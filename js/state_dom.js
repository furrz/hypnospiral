// hypnospiral visualizer - by @xyladot
// state_dom.js - Provides helpers for linking state to DOM elements.
// Dependencies:
// - state.js: Provides the state storage system.

// Find range inputs with `data-slider="someState"` and link them to the relevant state.
function LinkStateToSliders(hsState) {
    document.querySelectorAll('[data-slider]').forEach(slider => {
        const stateName = slider.dataset.slider;
        slider.addEventListener('input', () =>
            hsState.changeState({[stateName]: slider.value}));
        hsState.onStateChange(state => slider.value = state[stateName]);
    });
}

// Find text inputs with `data-text="someState"` and link them to the relevant state.
function LinkStateToText(hsState) {
     document.querySelectorAll('[data-text]').forEach(input => {
        const stateName = input.dataset.text;
        input.addEventListener('input', () =>
            hsState.changeState({[stateName]: input.value}));
        hsState.onStateChange(state => input.value = state[stateName]);
    });
}

// Find checkbox inputs with `data-check="someState"` and link them to the relevant state.
function LinkStateToCheckboxes(hsState) {
    document.querySelectorAll('[data-check]').forEach(checkbox => {
        const stateName = checkbox.dataset.check;
        checkbox.addEventListener('change', () =>
            hsState.changeState({ [stateName]: checkbox.checked }));
        hsState.onStateChange(state => checkbox.checked = state[stateName]);
    });
}

// Find elements with `data-float="someState"` and link them to the relevant state.
function LinkStateToFloatText(hsState) {
    document.querySelectorAll('[data-float]').forEach(el => {
        const stateName = el.dataset.float;
        hsState.onStateChange(state =>
            el.innerText = Number.parseFloat(state[stateName]).toFixed(2));
    });
}

// Find elements with `data-bg-color="someState"` and link them to the relevant state.
function LinkStateToBGColor(hsState) {
    document.querySelectorAll(`[data-bg-color]`).forEach(el => {
        const stateName = el.dataset.bgColor;
        hsState.onStateChange(state =>
            el.style.backgroundColor = `rgb(${state[stateName].r},${state[stateName].g},${state[stateName].b})`);
    });
}