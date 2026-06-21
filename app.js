const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
const geometry = new THREE.SphereGeometry(2, 64, 64);

const material = new THREE.MeshStandardMaterial({ 
    map: earthTexture,          
    roughness: 0.6              
}); 
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(4, 3, 5); 
scene.add(sunLight);

camera.position.z = 6;

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.005;
    earth.rotation.x += 0.001;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();