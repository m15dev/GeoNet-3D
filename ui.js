import { camera } from './scene.js';
import { startAligning, stopAligning } from './astronomy.js';
import { setLockCamera } from './camera.js';
import { setShowCompass } from './compass.js';
import { formatCoordinate } from './utils.js';
import { getSatelliteMeshes } from './satellites.js';
import { getOrbitMeshes } from './orbits.js';

// Elements bound to the starfield configuration
export function bindUIControls(starFieldMesh) {
    // 1. Estrelas
    const toggleStars = document.getElementById('toggle-stars');
    if (toggleStars && starFieldMesh) {
        toggleStars.addEventListener('change', (e) => {
            starFieldMesh.visible = e.target.checked;
        });
    }

    // 2. Órbitas
    const toggleOrbits = document.getElementById('toggle-orbits');
    if (toggleOrbits) {
        toggleOrbits.addEventListener('change', (e) => {
            const show = e.target.checked;
            const orbits = getOrbitMeshes();
            orbits.forEach(orbit => {
                orbit.visible = show;
            });
        });
    }

    // 3. Satélites Artificiais
    const toggleSatellites = document.getElementById('toggle-ArtficialSatelites');
    if (toggleSatellites) {
        toggleSatellites.addEventListener('change', (e) => {
            const show = e.target.checked;
            const satMeshes = getSatelliteMeshes();
            satMeshes.forEach(sat => {
                sat.visible = show;
            });
        });
    }

    // 4. Trava de Câmera
    const toggleLock = document.getElementById('toggle-lock');
    if (toggleLock) {
        toggleLock.addEventListener('change', (e) => {
            setLockCamera(e.target.checked);
        });
    }

    // 5. Bússola 3D
    const toggleCompass = document.getElementById('toggle-compass');
    if (toggleCompass) {
        toggleCompass.addEventListener('change', (e) => {
            setShowCompass(e.target.checked);
        });
    }

    // 6. Velocidade Real
    const toggleSpeed = document.getElementById('toggle-speed');
    if (toggleSpeed) {
        toggleSpeed.addEventListener('change', (e) => {
            if (e.target.checked) {
                startAligning();
            } else {
                stopAligning();
            }
        });
    }
}

// Positioning code that gives the exact camera coordinates
export function updateCoordinateDisplay() {
    if (camera) {
        const cordX = document.getElementById('cord-x');
        const cordY = document.getElementById('cord-y');
        const cordZ = document.getElementById('cord-z');

        if (cordX) cordX.innerText = `X:${formatCoordinate(camera.position.x)}`;
        if (cordY) cordY.innerText = `Y:${formatCoordinate(camera.position.y)}`;
        if (cordZ) cordZ.innerText = `Z:${formatCoordinate(camera.position.z)}`;
    }
}

// Operates the UI HIDE feature with smooth transition and floating restore button
export function setupHideUI() {
    const toggleUiCheckbox = document.getElementById('toggle-ui');
    const uiPanel = document.getElementById('ui-panel');
    const planetInfo = document.getElementById('planetInfo'); 

    if (!toggleUiCheckbox || !uiPanel) return;

    // Cria o botão flutuante de "Mostrar UI" no canto esquerdo
    const btnShowUI = document.createElement('button');
    btnShowUI.innerText = 'Show UI';

    Object.assign(btnShowUI.style, {
        display: 'none', 
        position: 'fixed',
        top: '20px', 
        left: '20px', // No canto esquerdo conforme solicitado
        zIndex: '9999', 
        background: 'rgba(10, 10, 25, 0.95)',
        color: '#00ffcc',
        border: '1px solid #3a3a5c',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontFamily: 'sans-serif',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
    });
    
    document.body.appendChild(btnShowUI);

    const setUIVisible = (visible) => {
        if (visible) {
            uiPanel.classList.remove('hidden');
            if (planetInfo) planetInfo.classList.remove('hidden'); 
            btnShowUI.style.display = 'none';
            toggleUiCheckbox.checked = false;
        } else {
            uiPanel.classList.add('hidden');
            if (planetInfo) planetInfo.classList.add('hidden');
            btnShowUI.style.display = 'block';
            toggleUiCheckbox.checked = true;
        }
    };

    toggleUiCheckbox.addEventListener('change', (e) => {
        setUIVisible(!e.target.checked);
    });

    btnShowUI.addEventListener('click', () => {
        setUIVisible(true);
    });
}