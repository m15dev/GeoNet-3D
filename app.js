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
//  *pshshs* Hey ! if yk how to fix, take a look at line (436) or somewhat around there

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let cameraOffset = new THREE.Vector3();
let transitionStartTime = 0;
const MAX_TRANSITION_TIME = 1000; // milissegundos

window.camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

// --- GLOBAL VARIABLES ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetPosition = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();
let isTransitioning = false;

// Unified tracking system for static and moving targets
let trackedObject = null; 
let previousTargetPosition = new THREE.Vector3();


function startTracking(target){

    trackedObject = target;

    previousTargetPosition.copy(target.position);

    transitionStartTime = performance.now();

    isTransitioning = true;
}

// Dynamic Zoom Table for all bodies
const zoomDistances = {
    "lua": 4.0,   
    "terra": 9.0, 
    "sol": 35.0,
    "mercurio": 4.0,
    "venus": 7.0,
    "marte": 7.0,
    "jupiter": 16.0,
    "saturno": 18.0,
    "urano": 14.0,
    "netuno": 12.0
};

const compassSize = 80; 
const compassScene = new THREE.Scene();
compassScene.background = null; 
const compassCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
const compassAxes = new THREE.AxesHelper(2); 
compassScene.add(compassAxes);

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();

// Earth
const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(3, 64, 64), 
    new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.6 })
);
earth.name = "terra"; 
earth.castShadow = true;  
earth.receiveShadow = true; 
scene.add(earth);

window.setupCameraControl(camera, controls, earth, renderer.domElement);

// Sun
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(12, 32, 32), 
    new THREE.MeshBasicMaterial({ color: 0xffaa00 })
);
sun.position.set(0, 0, 0); // Moved Sun to the true center of the universe for proper orbits
sun.name = "sol";
scene.add(sun);

// Moon
const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32), 
    new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.9 })
);
moon.castShadow = true; 
moon.name = "lua";
moon.receiveShadow = true;   
scene.add(moon);

// --- ALL PLANETS ---

// Mercury
const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 })
);
mercury.name = "mercurio";
mercury.castShadow = true;
mercury.receiveShadow = true;
scene.add(mercury);

// Venus
const venus = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xeeddaa, roughness: 0.7 })
);
venus.name = "venus";
venus.castShadow = true;
venus.receiveShadow = true;
scene.add(venus);

// Mars
const mars = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xcc4422, roughness: 0.8 })
);
mars.name = "marte";
mars.castShadow = true;
mars.receiveShadow = true;
scene.add(mars);

// Jupiter
const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(6, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xd9c0a3, roughness: 0.5 })
);
jupiter.name = "jupiter";
jupiter.castShadow = true;
jupiter.receiveShadow = true;
scene.add(jupiter);

// Saturn & Rings
const saturnGroup = new THREE.Group();
saturnGroup.name = "saturno";

const saturnBody = new THREE.Mesh(
    new THREE.SphereGeometry(5, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xeaddb9, roughness: 0.5 })
);
saturnBody.castShadow = true;
saturnGroup.add(saturnBody);

const ringGeometry = new THREE.RingGeometry(6, 9, 64);
const ringMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcca370, 
    side: THREE.DoubleSide, 
    transparent: true, 
    opacity: 0.8 
});
const saturnRing = new THREE.Mesh(ringGeometry, ringMaterial);
saturnRing.rotation.x = Math.PI / 2 + 0.3; 
saturnRing.receiveShadow = true;
saturnGroup.add(saturnRing);
scene.add(saturnGroup);

// Uranus & Rings
const uranusGroup = new THREE.Group();
uranusGroup.name = "urano";

const uranusBody = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xadd8e6, roughness: 0.5 })
);
uranusBody.castShadow = true;
uranusGroup.add(uranusBody);

const uranusRingGeometry = new THREE.RingGeometry(4.5, 5.5, 64);
const uranusRingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, 
    side: THREE.DoubleSide, 
    transparent: true, 
    opacity: 0.3 
});
const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
uranusRing.rotation.x = Math.PI / 2; // Uranus rolls on its side
uranusGroup.add(uranusRing);
scene.add(uranusGroup);

// Neptune
const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0x4169e1, roughness: 0.5 })
);
neptune.name = "netuno";
neptune.castShadow = true;
neptune.receiveShadow = true;
scene.add(neptune);

// Orbital Angles
let moonOrbitAngle = 0;
let mercuryOrbitAngle = Math.PI * 0.2;
let venusOrbitAngle = Math.PI * 0.7;
let earthOrbitAngle = 0; 
let marsOrbitAngle = Math.PI; 
let jupiterOrbitAngle = Math.PI / 2;
let saturnOrbitAngle = Math.PI * 1.5;
let uranusOrbitAngle = Math.PI * 0.4;
let neptuneOrbitAngle = Math.PI * 1.8;

// Satellites jus lil buddies floawting on spaceeeee. actualy orbitating but forget i said that.
if (typeof window.createSatellite === 'function') {
    window.createSatellite(scene, "satelite_iss", 0x00ffaa, 4.1, 0.025, 0.4, 0.4, 0.12, 0.25);      
    window.createSatellite(scene, "satelite_hubble", 0x33aaff, 4.5, 0.018, 0.2, 0.15, 0.15, 0.35);
    window.createSatellite(scene, "satelite_pace", 0xffcc00, 5.0, 0.02, 1.2, 0.18, 0.18, 0.18);
    window.createSatellite(scene, "satelite_lageos", 0xff55aa, 7.5, 0.007, 0.7, 0.12, 0.12, 0.12);
    window.createSatellite(scene, "telescopio_jwst", 0xff6600, 10.0, 0.001, 0.0, 0.4, 0.2, 0.4);
}

// Starfield Background
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
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 1000); 
sunLight.position.copy(sun.position); 
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048; 
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// Controls & Toggles
let rotateEarth = true;
let lockCamera = false;
let showCompass = true; 
let isRealSpeed = false; 

document.getElementById('toggle-stars').addEventListener('change', (e) => starField.visible = e.target.checked);
document.getElementById('toggle-lock').addEventListener('change', (e) => lockCamera = e.target.checked);
document.getElementById('toggle-compass').addEventListener('change', (e) => showCompass = e.target.checked);
document.getElementById('toggle-speed').addEventListener('change', (e) => isRealSpeed = e.target.checked);

// BREAK LOCK
window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        trackedObject = null;
        isTransitioning = false;
    }
});

function animate() {
    requestAnimationFrame(animate);

    const timeScale = isRealSpeed ? 0.005 : 1.0;

    // Mercury Translation
    mercuryOrbitAngle += 0.008 * timeScale;
    mercury.position.set(Math.sin(mercuryOrbitAngle) * 18, 0, Math.cos(mercuryOrbitAngle) * 18);
    mercury.rotation.y += 0.005 * timeScale;

    // Venus Translation (Retrograde rotation!)
    venusOrbitAngle += 0.006 * timeScale;
    venus.position.set(Math.sin(venusOrbitAngle) * 26, 0, Math.cos(venusOrbitAngle) * 26);
    venus.rotation.y -= 0.002 * timeScale; 

    // Earth Translation
    earthOrbitAngle += 0.004 * timeScale;
    earth.position.set(Math.sin(earthOrbitAngle) * 38, 0, Math.cos(earthOrbitAngle) * 38);
    if (rotateEarth) earth.rotation.y += 0.002 * timeScale;

    // Moon Translation & Tidal Locking
    moonOrbitAngle += 0.005 * timeScale; 
    moon.position.set(
        earth.position.x + Math.sin(moonOrbitAngle) * 12, 
        earth.position.y + Math.sin(moonOrbitAngle * 0.5) * 2, 
        earth.position.z + Math.cos(moonOrbitAngle) * 12
    );
    moon.rotation.y = moonOrbitAngle; 

    // Mars Translation 
    marsOrbitAngle += 0.002 * timeScale;
    mars.position.set(Math.sin(marsOrbitAngle) * 50, 0, Math.cos(marsOrbitAngle) * 50);
    mars.rotation.y += 0.002 * timeScale;

    // Jupiter Translation 
    jupiterOrbitAngle += 0.0008 * timeScale;
    jupiter.position.set(Math.sin(jupiterOrbitAngle) * 75, 0, Math.cos(jupiterOrbitAngle) * 75);
    jupiter.rotation.y += 0.004 * timeScale; 

    // Saturn Translation
    saturnOrbitAngle += 0.0004 * timeScale;
    saturnGroup.position.set(Math.sin(saturnOrbitAngle) * 105, 0, Math.cos(saturnOrbitAngle) * 105);
    saturnBody.rotation.y += 0.003 * timeScale;

    // Uranus Translation
    uranusOrbitAngle += 0.0002 * timeScale;
    uranusGroup.position.set(Math.sin(uranusOrbitAngle) * 135, 0, Math.cos(uranusOrbitAngle) * 135);
    uranusBody.rotation.x += 0.004 * timeScale; // Rolls on its side

    // Neptune Translation
    neptuneOrbitAngle += 0.0001 * timeScale;
    neptune.position.set(Math.sin(neptuneOrbitAngle) * 165, 0, Math.cos(neptuneOrbitAngle) * 165);
    neptune.rotation.y += 0.003 * timeScale;

    // Update satellites and lock them to Earth's position
    if (window.meusSatellitesGlobais) {
        window.meusSatellitesGlobais.forEach(sat => {
            sat.angle += (sat.speed * timeScale);
            
            if (sat.mesh.name === "telescopio_jwst") {
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

    // Camera Tracking Logic
    // --- Camera Tracking Logic ---
    if (trackedObject) {
        // Calculamos o deslocamento do objeto desde o último frame (se necessário)
        const deltaMove = new THREE.Vector3().subVectors(trackedObject.position, previousTargetPosition);

        if (isTransitioning) {
            const elapsed = performance.now() - transitionStartTime;
            targetLookAt.lerp(trackedObject.position, 0.25);
            
            // Define a distância de zoom correta
            const activeZooms = { ...zoomDistances, ...(window.satelliteZoomDistances || {}) };
            const dist = activeZooms[trackedObject.name] || (trackedObject.geometry?.parameters?.radius * 2.5 || 5.0);
            
            // CORREÇÃO: O ponto de destino é sempre uma posição relativa ao planeta (atrás/acima dele).
            // Não usamos a posição atual da câmera no cálculo do targetPosition para evitar o "efeito elástico".
            const offset = new THREE.Vector3(0, 0.4, 1).normalize().multiplyScalar(dist);
            targetPosition.copy(trackedObject.position).add(offset);

            // Move a câmera em direção ao destino calculado
            const remainingDistance = camera.position.distanceTo(targetPosition);

            const adaptiveSpeed = THREE.MathUtils.clamp(
                remainingDistance * 0.001,
                0.008,
                0.03
            );

            camera.position.lerp(targetPosition, adaptiveSpeed);
            camera.updateMatrixWorld();

            controls.target.copy(targetLookAt);
            controls.update();

            // Margem de erro para finalizar a transição
            const currentDistance =
            camera.position.distanceTo(trackedObject.position);

            if (
                currentDistance <= dist + 0.3 ||
                elapsed >= MAX_TRANSITION_TIME
            ) {

                controls.target.copy(trackedObject.position);

                controls.update();


                isTransitioning = false;
            }

        } else {
            // Modo de seguimento contínuo (após a transição)
            camera.position.add(deltaMove);

            controls.target.copy(trackedObject.position);

            // Lógica de rotação travada (se ativada)
            if (lockCamera && typeof timeScale !== 'undefined' && timeScale > 0) {
                const offset = camera.position.clone().sub(controls.target);
                offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.002 * timeScale);
                camera.position.copy(controls.target).add(offset);
            }
        }
        
        // Atualiza a posição anterior do objeto para o próximo frame
        previousTargetPosition.copy(trackedObject.position);
    }

    controls.update();
    if (trackedObject) {


        // Camera collision only with the tracked object cus i don't have any idea on how i'd a colision check for other planets, 
        // Interplanetary collision can wait for Future Me™, someday, verry far from now, or not - i hope so,
    const radius =
        trackedObject.geometry?.parameters?.radius ||
        trackedObject.children[0]?.geometry?.parameters?.radius ||
        1;

    const minDistance = radius + 1.5; // margem

    const direction = camera.position
        .clone()
        .sub(trackedObject.position);

    const distance = direction.length();

    if (distance < minDistance) {

        direction.normalize();

        camera.position.copy(
            trackedObject.position.clone().add(
                direction.multiplyScalar(minDistance)
            )
        );

    }

}
    renderer.render(scene, camera); 

    // Compass Rendering
    if (showCompass) {
        compassCamera.quaternion.copy(camera.quaternion);
        compassCamera.position.set(0, 0, 4).applyQuaternion(camera.quaternion);
        renderer.setScissorTest(true);
        renderer.setScissor(10, 10, compassSize, compassSize);
        renderer.setViewport(10, 10, compassSize, compassSize);
        renderer.autoClear = false;
        renderer.render(compassScene, compassCamera);
        renderer.autoClear = true;
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(false); 
    } else {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(false);
    }

    if (window.camera) {
        const fmt = (num) => (Math.abs(num) >= 100 ? num.toFixed(0) : Math.abs(num) >= 10 ? num.toFixed(1) : num.toFixed(2));
        document.getElementById('cord-x').innerText = `X:${fmt(camera.position.x)}`;
        document.getElementById('cord-y').innerText = `Y:${fmt(camera.position.y)}`;
        document.getElementById('cord-z').innerText = `Z:${fmt(camera.position.z)}`;
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.closest('#ui-panel') || event.target.tagName === 'BUTTON') return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);// Click a planet / Hopefully not empty space XP

    const alvos = [earth, moon, sun, mercury, venus, mars, jupiter, saturnGroup, uranusGroup, neptune, ...(typeof window.getSatelliteMeshes === 'function' ? window.getSatelliteMeshes() : [])];
    
    alvos.forEach(obj => {
        if(obj.isGroup) {
            obj.children.forEach(child => child.updateMatrixWorld());
        } else {
            obj.updateMatrixWorld();
        }
    });

    const intersects = raycaster.intersectObjects(alvos, true);

    if (intersects.length > 0) {

    const clickedObj =
        intersects[0].object.parent.isGroup
        ? intersects[0].object.parent
        : intersects[0].object;

    const index = planetList.findIndex(
        p => p.name === clickedObj.name
    );

    if (index !== -1) {
        selectPlanet(index);
    }
}
});


// Lista de objetos navegáveis
const planetList = [
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

// Função para atualizar a visualização dos planetas
// Every planet selection ends up here.
function selectPlanet(index) {

    currentPlanetIndex = index;

    const planet = planetList[index];

    document.getElementById("current-planet-name").innerText = planet.label;
    document.getElementById("planet-type").innerText =
        "Tipo: " + planet.type;

    const target = scene.getObjectByName(planet.name);

    if (!target) return;

    startTracking(target);
}

let currentPlanetIndex = 3; // planeta terra



// Listeners dos botões
document.getElementById('prev-planet').addEventListener('click', () => {
    currentPlanetIndex = (currentPlanetIndex - 1 + planetList.length)% planetList.length;
    
    selectPlanet(currentPlanetIndex);
});

document.getElementById('next-planet').addEventListener('click', () => {
    currentPlanetIndex =(currentPlanetIndex + 1)% planetList.length;

    selectPlanet(currentPlanetIndex);
});

function createOrbit(radius, color = 0xffffff) {
    const segments = 128;
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.3 });
    
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    
    geometry.setFromPoints(points);
    const orbit = new THREE.Line(geometry, material);
    scene.add(orbit);
    return orbit;
}
// Chame assim para cada planeta (ajuste o raio conforme sua escala)

createOrbit(18); 
createOrbit(26);
createOrbit(38);
createOrbit(50);
createOrbit(75);
createOrbit(105);
createOrbit(135);
createOrbit(165);


function snapCameraTo(target) {

    const dist = zoomDistances[target.name] || 8;

    camera.position.set(
        target.position.x,
        target.position.y + dist * 0.5,
        target.position.z + dist
    );

    controls.target.copy(target.position);
    controls.update();

    trackedObject = target;
    previousTargetPosition.copy(target.position);
    isTransitioning = false;
}


animate();

requestAnimationFrame(() => {
    snapCameraTo(earth);
});