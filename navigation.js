import { scene, camera } from './scene.js';
import { earth, moon, sun, mercury, venus, mars, jupiter, saturnGroup, uranusGroup, neptune } from './planets.js';
import { getSatelliteMeshes } from './satellites.js';
import { startTracking } from './camera.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Static table holding names and labels
export const planetList = [
    { name: "sol", label: "Sol", type: "Estrela" },
    { name: "mercurio", label: "Mercúrio", type: "Planeta" },
    { name: "venus", label: "Vênus", type: "Planeta" },
    { name: "terra", label: "Terra", type: "Planeta" },
    { name: "lua", label: "Lua", type: "Satélite Natural" },
    { name: "marte", label: "Marte", type: "Planeta" },
    { name: "jupiter", label: "Júpiter", type: "Planeta" },
    { name: "saturno", label: "Saturno", type: "Planeta" },
    { name: "urano", label: "Urano", type: "Planeta" },
    { name: "netuno", label: "Netuno", type: "Planeta" }
];

export let currentPlanetIndex = 3; // Terra defaults

export function selectPlanet(index) {
    currentPlanetIndex = index;
    const planet = planetList[index];

    document.getElementById("current-planet-name").innerText = planet.label;
    document.getElementById("planet-type").innerText = "Tipo: " + planet.type;

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