import { scene } from './scene.js';
import { earth } from './planets.js';
import { SATELLITES } from "./satelliteData.js";

window.meusSatellitesGlobais = window.meusSatellitesGlobais || [];

// Configurando o GLTFLoader junto com o DRACOLoader para ler os arquivos compactados da NASA
const loader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(dracoLoader);

/**
 * Creates and spawns a 3D model simulation representing a real satellite module
 */
export function createSatellite(data) {
    const {
        name,
        altitude,
        inclination,
        period
    } = data;

    const radius =
        name === "jwst"
            ? 10.0          
            : 4 + altitude / 1000;
    const speed = (Math.PI * 2) / period;
    const inclinationRad = THREE.MathUtils.degToRad(inclination);

    const satelliteGroup = new THREE.Group();
    satelliteGroup.name = name;
    scene.add(satelliteGroup);

    let fileName = "";
    const lowerName = name.toLowerCase();

    // Seleciona o arquivo correspondente a cada satélite
    if (lowerName.includes("iss") || lowerName.includes("estacao")) {
        fileName = 'International_Space_Station_(ISS)_(A).glb';
    } else if (lowerName.includes("hubble")) {
        fileName = 'Hubble_Space_Telescope_(A).glb';
    } else if (lowerName.includes("jwst")) {
        fileName = 'James_Webb_Space_Telescope_(B).glb';
    } else if (lowerName.includes("landsat")) {
        fileName = 'Landsat_8.glb';
    } else if (lowerName.includes("sentinel")) {
        fileName = 'Jason_Continuity_of_Service_(Sentinel-6).glb';
    } else {
        fileName = 'Hubble_Space_Telescope_(A).glb'; 
    }

    // Carrega o modelo 3D e aplica o tamanho personalizado para cada um
    loader.load(
        fileName,
        (gltf) => {
            const model = gltf.scene;

            // 1. AJUSTE DE TAMANHO (Scale): 
            // Aumente ou diminua os números (X, Y, Z) para cada satélite
            if (lowerName.includes("iss") || lowerName.includes("estacao")) {
                model.scale.set(0.02, 0.02, 0.02); 
            } else if (lowerName.includes("hubble")) {
                model.scale.set(0.0005, 0.0005, 0.0005); 
            } else if (lowerName.includes("jwst")) {
                model.scale.set(0.04, 0.04, 0.04); 
            } else if (lowerName.includes("landsat")) {
                model.scale.set(0.03, 0.03, 0.03); 
            } else if (lowerName.includes("sentinel")) {
                model.scale.set(0.03, 0.03, 0.03); 
            }

            satelliteGroup.add(model);
        },
        undefined,
        (error) => {
            console.error(`Erro ao carregar o modelo 3D para ${name}:`, error);
        }
    );

    window.meusSatellitesGlobais.push({
        mesh: satelliteGroup,
        radius,
        speed,
        inclination: inclinationRad,
        angle: Math.random() * Math.PI * 2
    });
}

/**
 * Performs vector translations. Accepts timeScale to adjust simulation speed dynamically.
 */
export function updateSatellites(timeScale = 1.0) {
    if (!window.meusSatellitesGlobais) return;
    
    window.meusSatellitesGlobais.forEach(sat => {
        sat.angle += (sat.speed * timeScale);
        
        if (sat.mesh.name === "JWST") {
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
            sat.mesh.name === "JWST" ? earth.position.y : earth.position.y + Math.sin(sat.angle + 0.01) * sat.inclination * (sat.radius * 0.5),
            earth.position.z + Math.cos(sat.angle + 0.01) * sat.radius
        );
    });
}

export function getSatelliteMeshes() {
    if (!window.meusSatellitesGlobais) return [];
    return window.meusSatellitesGlobais.map(sat => sat.mesh);
}

window.createSatellite = (sceneRef, ...args) => createSatellite(...args);
window.updateSatellites = updateSatellites;
window.getSatelliteMeshes = getSatelliteMeshes;

export function initAllSatellites() {
    SATELLITES.forEach(createSatellite);
}