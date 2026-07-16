import { scene, camera } from './scene.js';
import { earth, moon, sun, mercury, venus, mars, jupiter, saturnGroup, uranusGroup, neptune } from './planets.js';
import { getSatelliteMeshes } from './satellites.js';
import { startTracking } from './camera.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Table for the bodies and their types like sun is a star
export const planetList = [
    { name: "sol", label: "Sun", type: "Star" },
    { name: "mercurio", label: "Mercury", type: "Planet" },
    { name: "venus", label: "Venus", type: "Planet" },
    { name: "terra", label: "Earth", type: "Planet" },
    { name: "lua", label: "Moon", type: "Natural Satelite" },
    { name: "marte", label: "Mars", type: "Planet" },
    { name: "jupiter", label: "Jupiter", type: "Planet" },
    { name: "saturno", label: "Saturn", type: "Planet" },
    { name: "urano", label: "Uranus", type: "Planet" },
    { name: "netuno", label: "Neptune", type: "Planet" }
];

export let currentPlanetIndex = 3; // Terra defaults

export function selectPlanet(index) {
    currentPlanetIndex = index;
    const planet = planetList[index];

    document.getElementById("current-planet-name").innerText = planet.label;
    document.getElementById("planet-type").innerText = "Type: " + planet.type;

    const target = scene.getObjectByName(planet.name);
    if (!target) return;

    startTracking(target);
}

// Raycast selection handler
window.addEventListener('click', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.closest('#ui-panel') || event.target.tagName === 'BUTTON') return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const alvos = [
        earth, moon, sun, mercury, venus, mars, jupiter, saturnGroup, uranusGroup, neptune,
        ...getSatelliteMeshes()
    ];
    
    alvos.forEach(obj => {
        if(obj.isGroup) {
            obj.children.forEach(child => child.updateMatrixWorld());
        } else {
            obj.updateMatrixWorld();
        }
    });

    const intersects = raycaster.intersectObjects(alvos, true);

    if (intersects.length > 0) {
        const clickedObj = intersects[0].object.parent?.isGroup
            ? intersects[0].object.parent
            : intersects[0].object;

        const index = planetList.findIndex(p => p.name === clickedObj.name);

        if (index !== -1) {
            selectPlanet(index);
        }
    }
});

// Selector navigation elements
export function initNavigationUI() {
    document.getElementById('prev-planet').addEventListener('click', () => {
        currentPlanetIndex = (currentPlanetIndex - 1 + planetList.length) % planetList.length;
        selectPlanet(currentPlanetIndex);
    });

    document.getElementById('next-planet').addEventListener('click', () => {
        currentPlanetIndex = (currentPlanetIndex + 1) % planetList.length;
        selectPlanet(currentPlanetIndex);
    });
}