import { mercury, venus, earth, moon, mars, jupiter, saturnGroup, uranusGroup, neptune, saturnBody, uranusBody } from './planets.js';

// Simulation speeds and states        
export let simulationState = "NORMAL"; // NORMAL,
                                      //  ALIGNING(does the animation to align them all in a straing line),
                                     //  MOVING_TO_REAL (goes to the actual position when real-speed toggled)
export let isRealSpeed = false;
export let stateStartTime = 0;
export let rotateEarth = true;

// Orbital angles tracking
export let moonOrbitAngle = 0;
export let mercuryOrbitAngle = Math.PI * 0.2;
export let venusOrbitAngle = Math.PI * 0.7;
export let earthOrbitAngle = 0; 
export let marsOrbitAngle = Math.PI; 
export let jupiterOrbitAngle = Math.PI / 2;
export let saturnOrbitAngle = Math.PI * 1.5;
export let uranusOrbitAngle = Math.PI * 0.4;
export let neptuneOrbitAngle = Math.PI * 1.8;

// Epoch J2000
const EPOCH = new Date("2000-01-01T12:00:00Z");

// Período orbital (dias)
const orbitalPeriods = {
    mercurio: 87.969,
    venus: 224.701,
    terra: 365.256,
    marte: 686.980,
    jupiter: 4332.589,
    saturno: 10759.22,
    urano: 30688.5,
    netuno: 60182,
    lua: 27.321661
};

function getAngleFromCalendar(name) {

    const now = new Date();

    const elapsedDays =
        (now - EPOCH) / 86400000;

    const period = orbitalPeriods[name];

    if (!period) return 0;

    const orbitFraction =
        (elapsedDays % period) / period;

    return orbitFraction * Math.PI * 2;
}

// Define the astronomical bodies and alignment properties
export const bodies = [
    {
        mesh: moon,
        radius: 12,
        center: earth,
        get angle() { return moonOrbitAngle; },
        set angle(v) { moonOrbitAngle = v; }
    },
    {
        mesh: mercury,
        radius: 18,
        get angle() { return mercuryOrbitAngle; },
        set angle(v) { mercuryOrbitAngle = v; }
    },
    {
        mesh: venus,
        radius: 26,
        get angle() { return venusOrbitAngle; },
        set angle(v) { venusOrbitAngle = v; }
    },
    {
        mesh: earth,
        radius: 38,
        get angle() { return earthOrbitAngle; },
        set angle(v) { earthOrbitAngle = v; }
    },
    {
        mesh: mars,
        radius: 50,
        get angle() { return marsOrbitAngle; },
        set angle(v) { marsOrbitAngle = v; }
    },
    {
        mesh: jupiter,
        radius: 75,
        get angle() { return jupiterOrbitAngle; },
        set angle(v) { jupiterOrbitAngle = v; }
    },
    {
        mesh: saturnGroup,
        radius: 105,
        get angle() { return saturnOrbitAngle; },
        set angle(v) { saturnOrbitAngle = v; }
    },
    {
        mesh: uranusGroup,
        radius: 135,
        get angle() { return uranusOrbitAngle; },
        set angle(v) { uranusOrbitAngle = v; }
    },
    {
        mesh: neptune,
        radius: 165,
        get angle() { return neptuneOrbitAngle; },
        set angle(v) { neptuneOrbitAngle = v; }
    }
];

export function setRotateEarth(value) {
    rotateEarth = value;
}

export function setIsRealSpeed(value) {
    isRealSpeed = value;
}

export function startAligning() {
    bodies.forEach(body => {
        body.targetAngle =
            getAngleFromCalendar(body.mesh.name);
    });
    simulationState = "ALIGNING";
    stateStartTime = performance.now();
}

export function stopAligning() {
    simulationState = "NORMAL";
    isRealSpeed = false;
}

// Coordinate updates for all system entities
export function updateAstronomy() {
    const now = performance.now();
    const timeScale = isRealSpeed ? 0.005 : 1.0;

    if (simulationState === "ALIGNING") {
        let done = true;
        bodies.forEach(body => {
            body.angle = THREE.MathUtils.lerp(body.angle, 0, 0.02);

            if (body.center) {
                body.mesh.position.set(
                    body.center.position.x + Math.sin(body.angle) * body.radius,
                    body.center.position.y,
                    body.center.position.z + Math.cos(body.angle) * body.radius
                );
            } else {
                body.mesh.position.set(
                    Math.sin(body.angle) * body.radius,
                    0,
                    Math.cos(body.angle) * body.radius
                );
            }

            if (Math.abs(body.angle) > 0.002) done = false;
        });

        if (done) {
            if (now - stateStartTime > 3000) {
                simulationState = "MOVING_TO_REAL";
            }
        }
    } 
    else if (simulationState === "MOVING_TO_REAL") {
        let done = true;
        bodies.forEach(body => {
            const targetAngle = body.targetAngle;
            body.angle = THREE.MathUtils.lerp(body.angle, targetAngle, 0.01);

            if (body.center) {
                body.mesh.position.set(  
                    body.center.position.x + Math.sin(body.angle) * body.radius,
                    body.center.position.y,
                    body.center.position.z + Math.cos(body.angle) * body.radius
                );
            } else {
                body.mesh.position.set(
                    Math.sin(body.angle) * body.radius,
                    0,
                    Math.cos(body.angle) * body.radius
                );
            }

            if (Math.abs(body.angle - targetAngle) > 0.002) done = false;
        });

        if (done) {
            simulationState = "NORMAL";
            isRealSpeed = true;
        }
    } 
    else {
        // Mercury Translation
        mercuryOrbitAngle += 0.008 * timeScale;
        mercury.position.set(Math.sin(mercuryOrbitAngle) * 18, 0, Math.cos(mercuryOrbitAngle) * 18);
        mercury.rotation.y += 0.005 * timeScale;

        // Venus Translation
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
        uranusBody.rotation.x += 0.004 * timeScale;

        // Neptune Translation
        neptuneOrbitAngle += 0.0001 * timeScale;
        neptune.position.set(Math.sin(neptuneOrbitAngle) * 165, 0, Math.cos(neptuneOrbitAngle) * 165);
        neptune.rotation.y += 0.003 * timeScale;
    }
}