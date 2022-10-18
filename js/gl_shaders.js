// hypnospiral visualizer - by @xyladot
// gl_shaders.js - Helpers for the creation of GLSL Shader Programs.

// Compile a GLSL shader.
function GLCompileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
}

// Create an OpenGL shader program from two GLSL shaders' source.
function GLCreateProgram(gl, vSource, fSource) {
    const vShader = GLCompileShader(gl, gl.VERTEX_SHADER, vSource);
    const fShader = GLCompileShader(gl, gl.FRAGMENT_SHADER, fSource);
    const program = gl.createProgram();
    gl.attachShader(program, fShader);
    gl.attachShader(program, vShader);
    gl.linkProgram(program);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
}

