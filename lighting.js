import { scene } from './scene.js';

export function initLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
    scene.add(ambientLight);

    // Sun Point Light
    const sunLight = new THREE.PointLight(0xffffff, 2, 1000); 
    sunLight.position.set(0, 0, 0); // Placed at center so the uuh... "SHADOW", is cast from the sun
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048; 
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
}