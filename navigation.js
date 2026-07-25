import { scene, camera } from './scene.js';
import { earth, moon, sun, mercury, venus, mars, jupiter, saturnGroup, uranusGroup, neptune } from './planets.js';
import { getSatelliteMeshes } from './satellites.js';
import { startTracking } from './camera.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(); 

// Table for the bodies and their types
export const planetList = [
    { name: "sol", label: "Sun", type: "Star", dbKey: "Sun" },
    { name: "mercurio", label: "Mercury", type: "Planet", dbKey: "Mercury" },
    { name: "venus", label: "Venus", type: "Planet", dbKey: "Venus" },
    { name: "terra", label: "Earth", type: "Planet", dbKey: "Earth" },
    { name: "lua", label: "Moon", type: "Natural Satelite", dbKey: "Moon" },
    { name: "marte", label: "Mars", type: "Planet", dbKey: "Mars" },
    { name: "jupiter", label: "Jupiter", type: "Planet", dbKey: "Jupiter" },
    { name: "saturno", label: "Saturn", type: "Planet", dbKey: "Saturn" },
    { name: "urano", label: "Uranus", type: "Planet", dbKey: "Uranus" },
    { name: "netuno", label: "Neptune", type: "Planet", dbKey: "Neptune" }
];

export let currentPlanetIndex = 3; // Terra defaults

const planetsDatabase = {
    "Sun": { radius: "696,340 km", mass: "1.989 x10³⁰ kg", day: "27 days", year: "-", moons: "-", distance: "0 km" },
    "Mercury": { radius: "2,440 km", mass: "3.30 x10²³ kg", day: "58.6 days", year: "88 days", moons: "0", distance: "57.9 M km" },
    "Venus": { radius: "6,051 km", mass: "4.87 x10²⁴ kg", day: "243 days", year: "225 days", moons: "0", distance: "108.2 M km" },
    "Earth": { radius: "6,371 km", mass: "5.97 x10²⁴ kg", day: "23 h 56 min", year: "365.25 days", moons: "1", distance: "149.6 M km" },
    "Moon": { radius: "1,737 km", mass: "7.34 x10²² kg", day: "27.3 days", year: "27.3 days", moons: "0", distance: "384,400 km" },
    "Mars": { radius: "3,389 km", mass: "6.42 x10²³ kg", day: "24 h 37 min", year: "687 days", moons: "2", distance: "227.9 M km" },
    "Jupiter": { radius: "69,911 km", mass: "1.89 x10²⁷ kg", day: "9 h 56 min", year: "11.9 years", moons: "95", distance: "778.5 M km" },
    "Saturn": { radius: "58,232 km", mass: "5.68 x10²⁶ kg", day: "10 h 42 min", year: "29.4 years", moons: "146", distance: "1.43 B km" },
    "Uranus": { radius: "25,362 km", mass: "8.68 x10²⁵ kg", day: "17 h 14 min", year: "84 years", moons: "28", distance: "2.87 B km" },
    "Neptune": { radius: "24,622 km", mass: "1.02 x10²⁶ kg", day: "16 h 6 min", year: "165 years", moons: "16", distance: "4.50 B km" }
};

export function updatePlanetInfoDisplay(dbKey) {
    const data = planetsDatabase[dbKey];
    if (!data) return;

    document.getElementById("info-title").innerText = dbKey;
    document.getElementById("info-radius").innerText = data.radius;
    document.getElementById("info-mass").innerText = data.mass;
    document.getElementById("info-day").innerText = data.day;
    document.getElementById("info-year").innerText = data.year;
    document.getElementById("info-moons").innerText = data.moons;
    document.getElementById("info-distance").innerText = data.distance;
}

export function selectPlanet(index) {
    currentPlanetIndex = index;
    const planet = planetList[index];

    document.getElementById("current-planet-name").innerText = planet.label;
    document.getElementById("planet-type").innerText = "Type: " + planet.type;

    updatePlanetInfoDisplay(planet.dbKey);

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
        currentPlanetIndex = (currentPlanetIndex + 1 + planetList.length) % planetList.length;
        selectPlanet(currentPlanetIndex);
    });
}