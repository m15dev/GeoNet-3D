import { scene } from './scene.js';
import { earth } from './planets.js';
import { SATELLITES } from "./satelliteData.js";

// Global simulation storage keeping compatibility
window.meusSatellitesGlobais = window.meusSatellitesGlobais || [];

/**
 * Creates and spawns a customized box simulation representing a real satellite module
 */
export function createSatellite(data) {

    const {
        name,
        color,
        altitude,
        inclination,
        period,
        size
    } = data;

    const radius =
    name === "jwst"
        ? 10.0              // perto do ponto L2 no seu modelo
        : 4 + altitude / 1000;
    const speed = (Math.PI * 2) / period;

    const orbitRadius = altitude / 100 + 4;
    const orbitSpeed = (Math.PI * 2) / (period * 60);
    const orbitInclination = THREE.MathUtils.degToRad(inclination);


    const width = size.x;
    const height = size.y;
    const depth = size.z;

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
    radius,
    speed,
    inclination: THREE.MathUtils.degToRad(inclination),
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
        
        if (sat.mesh.name === "JWST") {
            // Lock position relative to Earth
            sat.mesh.position.set(
                earth.position.x + Math.sin(sat.angle) * sat.radius,
                earth.position.y,
//67 hehehehe line 67, -- um sorry this was stupid ;/
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
            sat.mesh.name === "JWST" ? earth.position.y : earth.position.y + Math.sin(sat.angle + 0.01) * sat.inclination * (sat.radius * 0.5),
            earth.position.z + Math.cos(sat.angle + 0.01) * sat.radius
        );
    });
}

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
    SATELLITES.forEach(createSatellite);
}


