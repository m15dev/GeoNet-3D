import { camera, controls } from './scene.js';
import { zoomDistances, satelliteZoomDistances, MAX_TRANSITION_TIME } from './constants.js';

export let trackedObject = null;
export let isTransitioning = false;
export let lockCamera = false;

let transitionStartTime = 0;
const targetPosition = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const previousTargetPosition = new THREE.Vector3();

// Keyboard controls state
const keysPressed = {};
const moveSpeed = 0.1;
const lookSpeed = 0.02;
const centerPoint = new THREE.Vector3(0, 0, 0);

export function setLockCamera(value) {
    lockCamera = value;
}

export function startTracking(target) {
    trackedObject = target;
    previousTargetPosition.copy(target.position);
    transitionStartTime = performance.now();
    isTransitioning = true;
}

export function stopTracking() {
    trackedObject = null;
    isTransitioning = false;
}

export function snapCameraTo(target) {
    const dist = zoomDistances[target.name] || 8;
    camera.position.set(
        target.position.x,
        target.position.y + dist * 0.5,
        target.position.z + dist
    );

    controls.target.copy(target.position);
    controls.update();

    trackedObject = target;
    previousTargetPosition.copy(target.position);
    isTransitioning = false;
}

// Camera control helper initializer
export function setupCameraControl(earthObject, domElement) {
    controls.target.copy(centerPoint);

    controls.mouseButtons = {
        LEFT: null, 
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
    };
    controls.enableKeys = false; 

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    domElement.addEventListener('pointerdown', (e) => {
        if (e.button === 0) { 
            const rect = domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(earthObject);

            if (intersects.length > 0) {
                controls.target.copy(centerPoint);
                camera.lookAt(centerPoint);
                controls.update();
            }
        }
    });

    window.addEventListener('keydown', (e) => {
        keysPressed[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
        keysPressed[e.key.toLowerCase()] = false;
    });
}

// Legacy global setup wrapper
window.setupCameraControl = function(camRef, ctrlRef, earthObj, el) {
    setupCameraControl(earthObj, el);
};

export function updateCameraMovement() {
    let cameraRotated = false;

    if (keysPressed['arrowup']) { camera.rotateX(lookSpeed); cameraRotated = true; }
    if (keysPressed['arrowdown']) { camera.rotateX(-lookSpeed); cameraRotated = true; }
    if (keysPressed['arrowleft']) { camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), lookSpeed); cameraRotated = true; }
    if (keysPressed['arrowright']) { camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -lookSpeed); cameraRotated = true; }

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();
    
    const up = camera.up.clone().normalize();

    const moveDirection = new THREE.Vector3(0, 0, 0);
    if (keysPressed['w']) moveDirection.add(forward);
    if (keysPressed['s']) moveDirection.add(forward.clone().negate());
    if (keysPressed['a']) moveDirection.add(right.clone().negate());
    if (keysPressed['d']) moveDirection.add(right);
    
    if (keysPressed['e']) moveDirection.add(up);
    if (keysPressed['q']) moveDirection.add(up.clone().negate());

    if (moveDirection.lengthSq() > 0) {
        const currentMultiplier = keysPressed['shift'] ? 5 : 1;
        moveDirection.normalize().multiplyScalar(moveSpeed * currentMultiplier);
        camera.position.add(moveDirection);
    }

    if (moveDirection.lengthSq() > 0 || cameraRotated) {
        const targetDirection = new THREE.Vector3();
        camera.getWorldDirection(targetDirection);
        controls.target.copy(camera.position).add(targetDirection.multiplyScalar(1.0));
        controls.update();
    }
}

// Global hook for continuous inputs
window.updateCameraMovement = updateCameraMovement;

// Break camera tracking on intentional user movements
window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        stopTracking();
    }
});

// Primary calculations for tracking and collision processing
export function updateTrackingSystem(timeScale) {
    if (!trackedObject) return;

    const deltaMove = new THREE.Vector3().subVectors(trackedObject.position, previousTargetPosition);

    if (isTransitioning) {
        const elapsed = performance.now() - transitionStartTime;
        targetLookAt.lerp(trackedObject.position, 0.25);
        
        const activeZooms = { ...zoomDistances, ...satelliteZoomDistances };
        const dist = activeZooms[trackedObject.name] || (trackedObject.geometry?.parameters?.radius * 2.5 || 5.0);
        
        const offset = camera.position
            .clone()
            .sub(trackedObject.position)
            .normalize()
            .multiplyScalar(dist);
        targetPosition.copy(trackedObject.position).add(offset);

        const remainingDistance = camera.position.distanceTo(targetPosition);
        const adaptiveSpeed = THREE.MathUtils.clamp(
            remainingDistance * 0.001,
            0.008,
            0.03
        );

        camera.position.lerp(targetPosition, adaptiveSpeed);
        camera.updateMatrixWorld();

        controls.target.copy(targetLookAt);
        controls.update();

        const currentDistance = camera.position.distanceTo(trackedObject.position);

        if (currentDistance <= dist + 0.3 || elapsed >= MAX_TRANSITION_TIME) {
            controls.target.copy(trackedObject.position);
            controls.update();
            isTransitioning = false;
        }
    } else {
        camera.position.add(deltaMove);
        controls.target.copy(trackedObject.position);

        if (lockCamera && typeof timeScale !== 'undefined' && timeScale > 0) {
            const offset = camera.position.clone().sub(controls.target);
            offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.002 * timeScale);
            camera.position.copy(controls.target).add(offset);
        }
    }
    
    previousTargetPosition.copy(trackedObject.position);
    controls.update();

    // Camera collision detection logic
    const radius =
        trackedObject.geometry?.parameters?.radius ||
        trackedObject.children?.[0]?.geometry?.parameters?.radius ||
        1;

    const minDistance = radius + 1.5;
    const direction = camera.position.clone().sub(trackedObject.position);
    const distance = direction.length();

    if (distance < minDistance) {
        direction.normalize();
        camera.position.copy(
            trackedObject.position.clone().add(direction.multiplyScalar(minDistance))
        );
    }
}