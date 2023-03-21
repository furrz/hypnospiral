// hypnospiral visualizer - by @xyladot
// main.js - Initializes scripting for the whole page.
// Dependencies:
// - state.js: Provides the state storage system.
// - state_dom.js: Provides functions to link state with DOM elements.
// - state_color.js: Provides color-picker system.
// - state_in_url.js: Save and load state from the URL's hash.
// - subliminal.js: Handle the subliminal messaging system.
// - control_toggle.js: Handle toggling the control UI.
// - fullscreen.js: Handle entering and exiting fullscreen
// - gl_shaders.js: Handles compiling GLSL shaders.
// - gl_geom.js: Handles generating OpenGL geometry.
// - gl_canvas.js: Handles the OpenGL canvas.
// - state_gl.js: Links state to OpenGL uniforms.
// - dyslexia.js: Handles toggling dyslexia font.

(async () => {

    // Create state-storage system.
    const hsState = HSStateStorage({
        bgColor: {r: 0, g: 0, b: 0},
        spColor: {r: 96, g: 255, b: 43},
        txtColor: {r: 255, g: 255, b: 255},
        spinSpeed: 1,
        throbSpeed: 1,
        throbStrength: 1,
        zoom: 1,
        messages: [],
        messageAlpha: 0.25,
        messageDuration: 0.1,
        messageGap: 1,
        oneWord: true,
        randomOrder: true,
        bgImage: "",
        bgImageAlpha: 0.5,
        trapCursor: false,
    });

    // Create a color picker and link its state.
    LinkStateToColorPicker(hsState, '#picker', ['spColor', 'bgColor', 'txtColor']);

    // Connect state to DOM elements based on their data-... attributes.
    LinkStateToSliders(hsState);    // data-slider:   Range sliders
    LinkStateToFloatText(hsState);  // data-float:    Display floating points in text elements.
    LinkStateToBGColor(hsState);    // data-bg-color: Display colors as the background color of an element.
    LinkStateToCheckboxes(hsState); // data-check:    Checkboxes.
    LinkStateToText(hsState);       // data-text:     Text boxes.

    const spiralOverlay = document.querySelector("#spiral-overlay");
    const spiralVideo = document.querySelector("#spiral-video-overlay");
    hsState.onStateChange(state => {
        spiralOverlay.style.backgroundImage = `url("${state.bgImage}")`;
        spiralOverlay.style.opacity = state.bgImageAlpha;
        spiralVideo.style.opacity = state.bgImageAlpha;

        const newSourceElem = document.createElement("source");
        newSourceElem.src = state.bgImage;
        spiralVideo.replaceChildren(newSourceElem);
        spiralVideo.load();
        spiralVideo.pause();
    });

    // Handle subliminal messaging
    HandleSubliminalText(hsState);

    // Handle the toggling of the control panel
    HandleControlToggle();

    // Enter fullscreen when clicking on the canvas.
    HandleFullscreen('#c');

    // Connect the site's URL/hash to the state system.
    // This triggers a state change immediately.
    LinkStateToHash(hsState, '#share-url');

    // Force a state change to ensure everything is up-to-date.
    hsState.changeState({});


    // Load GLSL Shader Source
    const [vSource, fSource] = await Promise.all([
        fetch("glsl/spiral.vert").then(r => r.text()),
        fetch("glsl/spiral.frag").then(r => r.text())
    ]);

    // Create the GL Canvas
    const {gl, runCanvas} = HandleGLCanvas('#c');

    // Compile the shader program
    const program = GLCreateProgram(gl, vSource, fSource);
    const uniformTime = gl.getUniformLocation(program, 'iTime');
    const uniformRes = gl.getUniformLocation(program, 'iRes');

    // Create quad geometry
    const drawGeom = GLCreateGeometry(gl);

    // Link state to OpenGL uniforms
    LinkStateToUniform(hsState, gl, program, 'spinSpeed', 'spinSpeed');
    LinkStateToUniform(hsState, gl, program, 'throbSpeed', 'throbSpeed');
    LinkStateToUniform(hsState, gl, program, 'throbStrength', 'throbStrength');
    LinkStateToUniform(hsState, gl, program, 'zoom', 'zoom');

    // Link color state to uniforms, too
    const uniformSpiralColor = gl.getUniformLocation(program, "spiralColor");
    const uniformBackgroundColor = gl.getUniformLocation(program, "bgColor");
    hsState.onStateChange(state => {
        gl.useProgram(program);
        gl.uniform3f(uniformSpiralColor, state.spColor.r / 255, state.spColor.g / 255, state.spColor.b / 255);
        gl.uniform3f(uniformBackgroundColor, state.bgColor.r / 255, state.bgColor.g / 255, state.bgColor.b / 255);
    });

    const cvasEl = document.querySelector('#c');
    window.addEventListener('mousemove', event => {
        if (hsState.getState().trapCursor) {
            const rect = cvasEl.getBoundingClientRect();
            const x = event.clientX - (rect.width / 2);
            const y = event.clientY - (rect.height / 2);
            if (Math.sqrt(x * x + y * y) < 50) {
                cvasEl.style.opacity = '0';
            } else {
                cvasEl.style.opacity = '1';
            }
        } else {
            cvasEl.style.opacity = '1';
        }
    });

    // Begin rendering!
    runCanvas((gl, width, height) => {
        gl.useProgram(program);
        gl.uniform1f(uniformTime, performance.now() / 1000.0);
        gl.uniform2f(uniformRes, width, height);
        drawGeom();
    });

    // Force a state change *again* to ensure uniforms are up-to-date.
    hsState.changeState({});

    SetupDyslexia();
})();