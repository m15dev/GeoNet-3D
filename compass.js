//just a silly 3D compass, there no purpose at all, just for me at least, you could say it's a debug tool 
import { camera, renderer } from './scene.js';
import { COMPASS_SIZE } from './constants.js';

export const compassScene = new THREE.Scene();
compassScene.background = null;

export const compassCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
const compassAxes = new THREE.AxesHelper(2);
compassScene.add(compassAxes);

export let showCompass = true;

export function setShowCompass(value) {
    showCompass = value;
}

// Render loop step managing dedicated scissor canvas space
export function renderCompass() {
    if (showCompass) {
        compassCamera.quaternion.copy(camera.quaternion);
        compassCamera.position.set(0, 0, 4).applyQuaternion(camera.quaternion);
        
        renderer.setScissorTest(true);
        renderer.setScissor(10, 10, COMPASS_SIZE, COMPASS_SIZE);
        renderer.setViewport(10, 10, COMPASS_SIZE, COMPASS_SIZE);
        
        renderer.autoClear = false;
        renderer.render(compassScene, compassCamera);
        renderer.autoClear = true;
        
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(false); 
    } else {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(false);
    }
}