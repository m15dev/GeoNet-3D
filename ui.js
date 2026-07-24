import { camera } from './scene.js';
import { startAligning, stopAligning } from './astronomy.js';
import { setLockCamera } from './camera.js';
import { setShowCompass } from './compass.js';
import { formatCoordinate } from './utils.js';

// Elements bound to the starfield configuration
export function bindUIControls(starFieldMesh) {
    document.getElementById('toggle-stars').addEventListener('change', (e) => {
        starFieldMesh.visible = e.target.checked;
    });

    document.getElementById('toggle-lock').addEventListener('change', (e) => {
        setLockCamera(e.target.checked);
    });

    document.getElementById('toggle-compass').addEventListener('change', (e) => {
        setShowCompass(e.target.checked);
    });

    document.getElementById('toggle-speed').addEventListener('change', (e) => {
        if (e.target.checked) {
            startAligning();
        } else {
            stopAligning();
        }
    });
}

// Positioning code that give me the position, yeh 
export function updateCoordinateDisplay() {
    if (camera) {
        document.getElementById('cord-x').innerText = `X:${formatCoordinate(camera.position.x)}`;
        document.getElementById('cord-y').innerText = `Y:${formatCoordinate(camera.position.y)}`;
        document.getElementById('cord-z').innerText = `Z:${formatCoordinate(camera.position.z)}`;
    }
}

//this thing operates the UI HIDE 
export function setupHideUI() {
    const toggleUiCheckbox = document.getElementById('toggle-ui');
    const uiPanel = document.getElementById('ui-panel');
    const planetInfo = document.getElementById('planetInfo'); // Pega o painel de info dos planetas

    if (!toggleUiCheckbox || !uiPanel) return;

    const btnShowUI = document.createElement('button');
    btnShowUI.innerText = 'Show UI';

    Object.assign(btnShowUI.style, {
        display: 'none', position: 'fixed',
        top: '20px', left: '20px',
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