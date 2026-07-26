// Dear Human or alien idk[~...], if you're reading this:
//
// Yes, the camera can phase through Mars,
//
// huhm,
//
// PLEASE don't.
//
// No, I don't know how to fix it yet. 
//
// *probably there isn't a real fix bc TRHEE.js doesn't have a native colisiton tool*

import { scene, camera, renderer, controls } from './scene.js';
import { initAllOrbits } from './orbits.js';
import { earth } from './planets.js'; // REMOVIDO o earthTexture daqui!
import { initAllSatellites, updateSatellites } from './satellites.js';
import { setupCameraControl, updateCameraMovement, updateTrackingSystem, snapCameraTo } from './camera.js';
import { updateAstronomy, isRealSpeed } from './astronomy.js';
import { initNavigationUI, selectPlanet } from './navigation.js';
import { bindUIControls, updateCoordinateDisplay, setupHideUI } from './ui.js';
import { renderCompass } from './compass.js';
import { initLighting } from './lighting.js';

// --- STARFIELD BACKGROUND GERENATOR ---
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 3500; 
const starPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount; i++) {
    const vertex = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
    ).normalize().multiplyScalar(300 + Math.random() * 200);

    starPositions[i * 3] = vertex.x;
    starPositions[i * 3 + 1] = vertex.y;
    starPositions[i * 3 + 2] = vertex.z;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const localStarField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(localStarField);

// --- INITIALIZATION FOR IT TOO WORK ---

setupHideUI();
initLighting();
initAllOrbits();
initAllSatellites();
bindUIControls(localStarField);
initNavigationUI();
setupCameraControl(earth, renderer.domElement);

// --- MAIN ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    const timeScale = isRealSpeed ? 0.005 : 1.0;

    updateAstronomy();
    updateSatellites(timeScale);
    updateCameraMovement();
    updateTrackingSystem(timeScale);
    renderer.render(scene, camera);
    renderCompass();
    updateCoordinateDisplay();
}

animate();

requestAnimationFrame(() => {
    snapCameraTo(earth);
});

/*---------------------------------------*/

// --- GLOBO EXCLUSIVO PARA A TELA DE INTRODUÇÃO ---
let introAnimationId = null;

function initIntroGlobe() {
    const container = document.getElementById('intro-globe-container');
    if (!container) return;

    // Força dimensões válidas para evitar canvas 0x0
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const introScene = new THREE.Scene();
    const introCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    introCamera.position.z = 4.5;

    const introRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    introRenderer.setSize(width, height);
    introRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    container.innerHTML = '';
    container.appendChild(introRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    introScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight.position.set(5, 3, 5);
    introScene.add(dirLight);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('./earth_atmos_2048.jpg');

    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.5,
        metalness: 0.1
    });

    const introEarth = new THREE.Mesh(geometry, material);
    introScene.add(introEarth);

    function animateIntro() {
        introAnimationId = requestAnimationFrame(animateIntro);
        introEarth.rotation.y += 0.003;
        introRenderer.render(introScene, introCamera);
    }

    animateIntro();
}

// Executa a criação do globo imediatamente
initIntroGlobe();

// --- LÓGICA DO BOTÃO "START EXPLORING" ---
function closeCard() {
    // Para a animação do globo da intro
    if (introAnimationId) {
        cancelAnimationFrame(introAnimationId);
    }

    // Esconde o painel da intro
    const card = document.getElementById('welcome-card');
    if (card) {
        card.style.display = 'none';
    }

    // Exibe a cena 3D principal e a UI
    const canvasContainer = document.getElementById('canvas-container');
    const uiPanel = document.getElementById('ui-panel');
    const planetInfo = document.getElementById('planetInfo');

    if (canvasContainer) canvasContainer.style.display = 'block';
    if (uiPanel) uiPanel.style.display = 'block';
    if (planetInfo) planetInfo.style.display = 'block';

    // Ajusta o tamanho da cena principal para a tela toda
    if (typeof camera !== 'undefined' && typeof renderer !== 'undefined') {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 1. Torna a função global para caso o HTML ainda use onclick="closeCard()"
window.closeCard = closeCard;

// 2. Adiciona o ouvinte de clique direto no botão caso o HTML use id="btn-start"
const startBtn = document.getElementById('btn-start');
if (startBtn) {
    startBtn.addEventListener('click', closeCard);
}
