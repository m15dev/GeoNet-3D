import { scene } from './scene.js';

const textureLoader = new THREE.TextureLoader();

// Materials & Textures
const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

// Sun (Sol)
export const sun = new THREE.Mesh(
    new THREE.SphereGeometry(12, 32, 32), 
    new THREE.MeshBasicMaterial({ color: 0xffaa00 })
);
sun.position.set(0, 0, 0); //moved to the center, so it cast shadow right and does the orbits
sun.name = "sol";
scene.add(sun);

// Earth We live here btw :P
export const earth = new THREE.Mesh(
    new THREE.SphereGeometry(3, 64, 64), 
    new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.6 })
);
earth.name = "terra"; 
earth.castShadow = true;  
earth.receiveShadow = true; 
scene.add(earth);

// Moon (Lua)
export const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32), 
    new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.9 })
);
moon.castShadow = true; 
moon.name = "lua";
moon.receiveShadow = true;   
scene.add(moon);

// Mercury (Mercúrio)
export const mercury = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 })
);
mercury.name = "mercurio";
mercury.castShadow = true;
mercury.receiveShadow = true;
scene.add(mercury);

// Venus (Vênus)
export const venus = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xeeddaa, roughness: 0.7 })
);
venus.name = "venus";
venus.castShadow = true;
venus.receiveShadow = true;
scene.add(venus);

// Mars (Marte)
export const mars = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xcc4422, roughness: 0.8 })
);
mars.name = "marte";
mars.castShadow = true;
mars.receiveShadow = true;
scene.add(mars);

// Jupiter (Júpiter)
export const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(6, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xd9c0a3, roughness: 0.5 })
);
jupiter.name = "jupiter";
jupiter.castShadow = true;
jupiter.receiveShadow = true;
scene.add(jupiter);

// Saturn (Saturno) & Rings
export const saturnGroup = new THREE.Group();
saturnGroup.name = "saturno";

export const saturnBody = new THREE.Mesh(
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

// Uranus (Urano) & Rings
export const uranusGroup = new THREE.Group();
uranusGroup.name = "urano";

export const uranusBody = new THREE.Mesh(
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
uranusRing.rotation.x = Math.PI / 2;
uranusGroup.add(uranusRing);
scene.add(uranusGroup);

// Neptune (Netuno)
export const neptune = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0x4169e1, roughness: 0.5 })
);
neptune.name = "netuno";
neptune.castShadow = true;
neptune.receiveShadow = true;
scene.add(neptune);