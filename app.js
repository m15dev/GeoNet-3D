const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-4, 2.65, 6.50); // Start camera position
window.camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const compassSize = 80; //
const compassScene = new THREE.Scene();
compassScene.background = null; 
const compassCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
const compassAxes = new THREE.AxesHelper(2); 
compassScene.add(compassAxes);

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ map: earthTexture, roughness: .6 }); 
const earth = new THREE.Mesh(geometry, material);
earth.name = "terra"; 
earth.castShadow = true;  
earth.receiveShadow = true; 
scene.add(earth);

window.setupCameraControl(camera, controls, earth, renderer.domElement);

const sunGeometry = new THREE.SphereGeometry(12, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 }); 
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

sun.position.set(80, 20, -60); 
scene.add(sun);

const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

const moonGeometry = new THREE.SphereGeometry(0.8, 32, 32); 
const moonMaterial = new THREE.MeshStandardMaterial({ 
    map: moonTexture,
    roughness: 0.9 
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true; 
moon.receiveShadow = true;  
scene.add(moon);

let moonOrbitAngle = 0;

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3500; 
const starPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount; i++) {
    const vertex = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
    );
    
    vertex.normalize(); 
    
    const distance = 300 + Math.random() * 200;
    vertex.multiplyScalar(distance);

    starPositions[i * 3] = vertex.x;
    starPositions[i * 3 + 1] = vertex.y;
    starPositions[i * 3 + 2] = vertex.z;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2); 
sunLight.position.copy(sun.position); 
sunLight.target = earth; 

sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048; 
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
sunLight.shadow.bias = -0.0005;

const d = 20;
sunLight.shadow.camera.left = -d;
sunLight.shadow.camera.right = d;
sunLight.shadow.camera.top = d;
sunLight.shadow.camera.bottom = -d;
scene.add(sunLight);

const sunFillLight = new THREE.DirectionalLight(0xffffff, 0.6); 
sunFillLight.position.copy(sun.position);
sunFillLight.target = earth;
scene.add(sunFillLight);

let rotateEarth = true;
let lockCamera = false;
let showCompass = true; 

document.getElementById('toggle-rotation').addEventListener('change', (e) => {
    rotateEarth = e.target.checked;
});
document.getElementById('toggle-stars').addEventListener('change', (e) => {
    starField.visible = e.target.checked;
});
document.getElementById('toggle-lock').addEventListener('change', (e) => {
    lockCamera = e.target.checked;
});
document.getElementById('toggle-compass').addEventListener('change', (e) => {
    showCompass = e.target.checked;
});

function animate() {
    requestAnimationFrame(animate);

    if (rotateEarth) {
        earth.rotation.y += 0.002;
    }

    moonOrbitAngle += 0.005; 

    const orbitRadius = 12; 

    moon.position.x = Math.sin(moonOrbitAngle) * orbitRadius;
    moon.position.z = Math.cos(moonOrbitAngle) * orbitRadius;
    moon.position.y = Math.sin(moonOrbitAngle * 0.5) * 2; 

    moon.rotation.y += 0.002;

    if (lockCamera && rotateEarth) {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.002);
        controls.update();
    } else {
        window.updateCameraMovement();
    }

    controls.update();
    
    renderer.render(scene, camera); 

    if (showCompass) {
        compassCamera.quaternion.copy(camera.quaternion);
        compassCamera.position.set(0, 0, 4);
        compassCamera.position.applyQuaternion(camera.quaternion);

        renderer.setScissorTest(true);
        renderer.setScissor(10, 10, compassSize, compassSize);
        renderer.setViewport(10, 10, compassSize, compassSize);
        
        renderer.autoClear = false;
        renderer.render(compassScene, compassCamera);
        renderer.autoClear = true;
        
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(false); 
    } else {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(false);
    }

    if (window.camera) {
        const formatarCoord = (num) => {
            const absNum = Math.abs(num); 
            if (absNum >= 100) return num.toFixed(0); 
            if (absNum >= 10)  return num.toFixed(1); 
            return num.toFixed(2);                    
        };
        
        document.getElementById('cord-x').innerText = `X:${formatarCoord(camera.position.x)}`;
        document.getElementById('cord-y').innerText = `Y:${formatarCoord(camera.position.y)}`;
        document.getElementById('cord-z').innerText = `Z:${formatarCoord(camera.position.z)}`;
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();