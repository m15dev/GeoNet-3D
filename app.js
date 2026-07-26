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

// --- GLOBO EXCLUSIVO PARA A TELA DE INTRODUÇÃO ---
let introAnimationId = null;

function initIntroGlobe() {
    const container = document.getElementById('intro-globe-container');
    if (!container) return;

    // Garante dimensões mínimas se a tela ainda estiver carregando
    const width = container.clientWidth || (window.innerWidth - 600);
    const height = container.clientHeight || window.innerHeight;

    // 1. Cria a cena e câmera isoladas para a intro
    const introScene = new THREE.Scene();
    const introCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    introCamera.position.z = 4.5;

    // 2. Renderer isolado com fundo transparente
    const introRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    introRenderer.setSize(width, height);
    introRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Limpa qualquer canvas antigo caso a função rode mais de uma vez
    container.innerHTML = '';
    container.appendChild(introRenderer.domElement);

    // 3. Iluminação dedicada para a intro
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    introScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(5, 3, 5);
    introScene.add(dirLight);

    // 4. Carrega a textura da Terra diretamente no local
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.6,
        metalness: 0.1
    });

    const introEarth = new THREE.Mesh(geometry, material);
    introScene.add(introEarth);

    // 5. Loop de Rotação da Intro
    function animateIntro() {
        introAnimationId = requestAnimationFrame(animateIntro);
        introEarth.rotation.y += 0.003;
        introRenderer.render(introScene, introCamera);
    }

    animateIntro();
}

// Inicia o globo da intro
initIntroGlobe();

// Expondo a função para o botão "Start Exploring" no HTML
window.closeCard = function() {
    // Para o loop de animação do globo da intro
    if (introAnimationId) {
        cancelAnimationFrame(introAnimationId);
    }

    const card = document.getElementById('welcome-card');
    if (card) {
        card.style.display = 'none';
    }

    // Ativa o canvas e as interfaces do sistema principal
    const canvasContainer = document.getElementById('canvas-container');
    const uiPanel = document.getElementById('ui-panel');
    const planetInfo = document.getElementById('planetInfo');

    if (canvasContainer) canvasContainer.style.display = 'block';
    if (uiPanel) uiPanel.style.display = 'block';
    if (planetInfo) planetInfo.style.display = 'block';

    // Ajusta o viewport do Three.js para o tamanho total da janela
    if (typeof camera !== 'undefined' && typeof renderer !== 'undefined') {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
};