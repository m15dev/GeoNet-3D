window.setupCameraControl = function(camera, controls, earthObject, domElement) {
    const moveSpeed = 0.1;
    const lookSpeed = 0.02;
    const keysPressed = {};

    const centerPoint = new THREE.Vector3(0, 0, 0);
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

    window.updateCameraMovement = function() {
        if (keysPressed['arrowup']) camera.rotateX(lookSpeed);
        if (keysPressed['arrowdown']) camera.rotateX(-lookSpeed);
        if (keysPressed['arrowleft']) camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), lookSpeed);
        if (keysPressed['arrowright']) camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -lookSpeed);

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
            moveDirection.normalize().multiplyScalar(moveSpeed);
            camera.position.add(moveDirection);
            
            if (keysPressed['w'] || keysPressed['s'] || keysPressed['a'] || keysPressed['d']) {
                const targetDirection = new THREE.Vector3();
                camera.getWorldDirection(targetDirection);
                controls.target.copy(camera.position).add(targetDirection.multiplyScalar(0.1));
            }
        }
    };
};