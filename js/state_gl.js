// hypnospiral visualizer - by @xyladot
// state_gl.js - Links state to OpenGL uniforms.
// Dependencies:
// - state.js: Provides the state storage system.

function LinkStateToUniform(hsState, gl, program, uniformName, stateName) {
    const uniform = gl.getUniformLocation(program, uniformName);
    hsState.onStateChange(state => {
        gl.useProgram(program);
        gl.uniform1f(uniform, state[stateName]);
    });
}
