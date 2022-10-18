// hypnospiral visualizer - by @xyladot
// gl_geom.js - Creates drawable geometry in GLSL.

function GLCreateGeometry(gl) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);

    const positions = [
        -1, -1, -1, 1, 1, 1,
        -1, -1, 1, -1, 1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    return () => {
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
}
