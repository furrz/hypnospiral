// hypnospiral visualizer - by @xyladot
// gl_canvas.js - Handles rendering to a canvas.

function HandleGLCanvas(selector) {
    const canvas = document.querySelector(selector);
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("Your browser doesn't support WebGL 2 and won't be able to draw the spiral. Sorry!")
        return;
    }

    function updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        const width = Math.round(rect.width * dpr);
        const height = Math.round(rect.height * dpr);

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
        }
    }

    const runCanvas = callback => {
        function tick() {
            updateCanvasSize();
            gl.clear(gl.COLOR_BUFFER_BIT);
            callback(gl, canvas.width, canvas.height);
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    };

    return {gl, runCanvas};
}
