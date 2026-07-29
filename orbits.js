import { scene } from './scene.js';

// Lista global para guardar as órbitas criadas
const orbitMeshes = [];

// Factory utility to produce orbital path visualizer lines
export function createOrbit(radius, color = 0xffffff) {
    const segments = 128;
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.3 
    });
    
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    
    geometry.setFromPoints(points);
    const orbit = new THREE.Line(geometry, material);
    scene.add(orbit);
    
    // Salva na nossa listinha
    orbitMeshes.push(orbit);
    
    return orbit;
}

// Retorna todas as órbitas para o UI controler
export function getOrbitMeshes() {
    return orbitMeshes;
}

// Generate orbits for each planets
export function initAllOrbits() {
    createOrbit(18);  //Mercury
    createOrbit(26);  //Vênus
    createOrbit(38);  //Mars 
    createOrbit(50);  //Earth 
    createOrbit(75);  //Jupiter
    createOrbit(105); //Saturn
    createOrbit(135); //Uranus
    createOrbit(165); //Neptune
}