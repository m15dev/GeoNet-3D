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