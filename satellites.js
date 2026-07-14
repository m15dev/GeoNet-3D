window.meusSatellitesGlobais = window.meusSatellitesGlobais || [];

window.satelliteZoomDistances = {
    "satelite_iss": 1.5,
    "satelite_hubble": 1.0,
    "satelite_pace": 1.0,
    "satelite_lageos": 0.8,
    "telescopio_jwst": 1.8
};

/**
 * Creates and spawns a customized box simulation representing a real satellite module
 */
window.createSatellite = function(scene, name, color, orbitRadius, orbitSpeed, orbitInclination, width = 0.15, height = 0.1, depth = 0.15) {
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
};

/**
 * Performs vector translations. Accepts timeScale to adjust simulation speed dynamically.
 */
window.updateSatellites = function(timeScale = 1.0) {
    if (!window.meusSatellitesGlobais) return;
    
    window.meusSatellitesGlobais.forEach(sat => {
        // Apply timeScale to the orbital speed
        sat.angle += (sat.speed * timeScale);
        
        if (sat.mesh.name === "telescopio_jwst") {
            sat.mesh.position.x = Math.sin(sat.angle) * sat.radius;
            sat.mesh.position.z = Math.cos(sat.angle) * sat.radius;
            sat.mesh.position.y = 0; 
        } else {
            sat.mesh.position.x = Math.sin(sat.angle) * sat.radius;
            sat.mesh.position.z = Math.cos(sat.angle) * sat.radius;
            sat.mesh.position.y = Math.sin(sat.angle) * sat.inclination * (sat.radius * 0.5);
        }
        
        sat.mesh.lookAt(
            Math.sin(sat.angle + 0.01) * sat.radius,
            sat.mesh.name === "telescopio_jwst" ? 0 : Math.sin(sat.angle + 0.01) * sat.inclination * (sat.radius * 0.5),
            Math.cos(sat.angle + 0.01) * sat.radius
        );
    });
};

window.getSatelliteMeshes = function() {
    if (!window.meusSatellitesGlobais) return [];
    return window.meusSatellitesGlobais.map(sat => sat.mesh);
}; //67 hehehehe line 67, -- um sorry this was stupid ;/