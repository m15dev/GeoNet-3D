import { scene } from './scene.js';
import { earth } from './planets.js';

// Global simulation storage keeping compatibility
window.meusSatellitesGlobais = window.meusSatellitesGlobais || [];

/**
 * Creates and spawns a customized box simulation representing a real satellite module
 */
export function createSatellite(name, color, orbitRadius, orbitSpeed, orbitInclination, width = 0.15, height = 0.1, depth = 0.15) {
    const satGeometry = new THREE.BoxGeometry(width, height, depth);
    
    const satMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.3,
        metalness: 0.7
    });
    
    const satellite = new THREE.Mesh(satGeometry, satMaterial);
    satellite.name = name;
    scene.add(satellite);
    
    window.meusSatellitesGlobais.push({
        mesh: satellite,
        radius: orbitRadius,
        speed: orbitSpeed,
        inclination: orbitInclination,
        angle: Math.random() * Math.PI * 2
    });
}

/**
 * Performs vector translations. Accepts timeScale to adjust simulation speed dynamically.
 */
export function updateSatellites(timeScale = 1.0) {
    if (!window.meusSatellitesGlobais) return;
    
    window.meusSatellitesGlobais.forEach(sat => {
        // Apply timeScale to the orbital speed
        sat.angle += (sat.speed * timeScale);
        
        if (sat.mesh.name === "telescopio_jwst") {
            // Lock position relative to Earth
            sat.mesh.position.set(
                earth.position.x + Math.sin(sat.angle) * sat.radius,
                earth.position.y,
                earth.position.z + Math.cos(sat.angle) * sat.radius
            );
        } else {
            sat.mesh.position.set(
                earth.position.x + Math.sin(sat.angle) * sat.radius,
                earth.position.y + Math.sin(sat.angle) * sat.inclination * (sat.radius * 0.5),
                earth.position.z + Math.cos(sat.angle) * sat.radius
            );
        }
        
        sat.mesh.lookAt(
            earth.position.x + Math.sin(sat.angle + 0.01) * sat.radius,
            sat.mesh.name === "telescopio_jwst" ? earth.position.y : earth.position.y + Math.sin(sat.angle + 0.01) * sat.inclination * (sat.radius * 0.5),
            earth.position.z + Math.cos(sat.angle + 0.01) * sat.radius
        );
    });
}



//67 hehehehe line 67, -- um sorry this was stupid ;/

export function getSatelliteMeshes() {
    if (!window.meusSatellitesGlobais) return [];
    return window.meusSatellitesGlobais.map(sat => sat.mesh);
}

// Expose interface functions globally so i can operate those anywhere
window.createSatellite = (sceneRef, ...args) => createSatellite(...args);
window.updateSatellites = updateSatellites;
window.getSatelliteMeshes = getSatelliteMeshes;

// Initialize the constellation of satellite objects
export function initAllSatellites() {
    createSatellite("satelite_iss", 0x00ffaa, 4.1, 0.025, 0.4, 0.4, 0.12, 0.25);      
    createSatellite("satelite_hubble", 0x33aaff, 4.5, 0.018, 0.2, 0.15, 0.15, 0.35);
    createSatellite("satelite_pace", 0xffcc00, 5.0, 0.02, 1.2, 0.18, 0.18, 0.18);
    createSatellite("satelite_lageos", 0xff55aa, 7.5, 0.007, 0.7, 0.12, 0.12, 0.12);
    createSatellite("telescopio_jwst", 0xff6600, 10.0, 0.001, 0.0, 0.4, 0.2, 0.4);
}