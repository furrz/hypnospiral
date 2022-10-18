// hypnospiral visualizer - by @xyladot
// state_color.js - Allows linking state to a color picker.
// Dependencies:
// - state.js: Provides the state storage system.
// - iro.min.js: The iro.js color library

function LinkStateToColorPicker(hsState, selector, stateValues) {
    const picker = new iro.ColorPicker(selector, {
        colors: stateValues.map(k => hsState.getState()[k])
    });

    // Link color changes to state updates
    picker.on('color:change', color =>
        hsState.changeState({ [stateValues[color.index]]: color.rgb }));

    // data-picker-active links a box to the active color selection
    document.querySelectorAll('[data-picker-active]').forEach(el => {
        const stateName = el.dataset.pickerActive;
        const colorIndex = stateValues.indexOf(stateName);

        // Set the active color-picker color when clicked.
        el.addEventListener('click', () => picker.setActiveColor(colorIndex));

        // Update the 'active' class based on the current color selection.
        picker.on('color:setActive', color => {
            if (color.index === colorIndex) el.classList.add('active');
            else el.classList.remove('active');
        });

        // Make this the initially-active color if possible.
        if (el.classList.contains('active')) picker.setActiveColor(colorIndex);
    });
}