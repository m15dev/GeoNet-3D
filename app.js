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
import { earth } from './planets.js';
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

// makes the ui work
setupHideUI();

initLighting();

// Call that function that creates the orbits
initAllOrbits();

// Initialize the satelites 
initAllSatellites();

// Setup the UI Buttons
bindUIControls(localStarField);

// Initialize Navigation
initNavigationUI();

// Starts the camera control
setupCameraControl(earth, renderer.domElement);

// --- MAIN ANIMATION LOOP --This is the brain of it
function animate() {
    requestAnimationFrame(animate);

    const timeScale = isRealSpeed ? 0.005 : 1.0;

    // 1. Update celestial body transformations
    updateAstronomy();

    // 2. Update artificial satellites positions and lock them to Earth
    updateSatellites(timeScale);

    // 3. Process continuous keyboard controls
    updateCameraMovement();

    // 4. Resolve camera tracking, interpolation, and object collision
    updateTrackingSystem(timeScale);

    // 5. Render primary scene
    renderer.render(scene, camera);

    // 6. Layer custom scissors rendering for the 3D Compass on top
    renderCompass();

    // 7. Refresh UI with exact camera coordinates
    updateCoordinateDisplay();
}

// Start rendering
animate();

// Boot up sequence: goes to earth on start
requestAnimationFrame(() => {
    snapCameraTo(earth);
});