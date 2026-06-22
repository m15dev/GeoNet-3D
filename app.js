const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ 
    map: earthTexture,          
    roughness: 0.6              
}); 
const earth = new THREE.Mesh(geometry, material);
earth.name = "terra"; 
scene.add(earth);

window.setupCameraControl(camera, controls, earth, renderer.domElement);

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const starPositions = new Float32Array(starsCount * 3);

for(let i = 0; i < starsCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 100;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(5, 3, 5); 
scene.add(sunLight);

camera.position.z = 6;

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.002;

    window.updateCameraMovement();

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();