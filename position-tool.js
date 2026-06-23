//Just a random tool that gives me the exact position my camera is when i 
// press space, cus i need to make an display to show the coodinates but i
// havent done it yet ;3 yay

window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.code === 'Space') {
    
        if (window.camera) {
            const x = camera.position.x.toFixed(2);
            const y = camera.position.y.toFixed(2);
            const z = camera.position.z.toFixed(2);

            const mensagem = `Coordenadas da Câmera:\nX: ${x}\nY: ${y}\nZ: ${z}`;

            console.log(mensagem);

        } else {
            console.warn("ERROR, you must have done popoo to the camera code ;D ...  GO FIX IT !!!!");
        }
    }
});