// hypnospiral visualizer - by @xyladot
// subliminal.js - Handles the 'subliminal text' system.
// Dependencies:
// - state.js: Provides the state storage system.

// Try to load state from the current page's hash as JSON, and auto-update the URL hash.
// This also auto-updates the value in a text-box to reflect the URL.
function HandleSubliminalText(hsState) {
    let lineQueue = [];
    let wordQueue = [];
    let timeoutHandle = null;

    // Link message text input lines to state.
    const linesInput = document.querySelector('#message-lines');
    const handleLinesChange = () => hsState.changeState({
        messages: linesInput.value.split('\n').filter(x => x && x.trim() !== '')
    });
    linesInput.addEventListener('change', handleLinesChange);
    linesInput.addEventListener('input', handleLinesChange);

    // Update subliminal text on a timer.
    const linesOutput = document.querySelector('#subliminal-text');
    hsState.onStateChange(state => {
        const curValue = linesInput.value.split('\n').filter(x => !!x);
        if (curValue.join('\n') !== state.messages.join('\n')) {
            linesInput.value = state.messages.join('\n');
        }

        linesOutput.style.color = `rgb(${state.txtColor.r},${state.txtColor.g},${state.txtColor.b})`;

        lineQueue = [];

        if (timeoutHandle != null) {
            window.clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(linesHandleGap, 10);
        }
    });

    // Timer function to handle the gaps between lines.
    function linesHandleGap() {
        linesOutput.style.opacity = 0;
        timeoutHandle = setTimeout(linesHandleDisplay, hsState.getState().messageGap * 1000);
    }

    // Timer function to handle the displaying of lines.
    function linesHandleDisplay() {
        const state = hsState.getState();

        // If we have no messages to display at all, give up with a dummy delay
        if (state.messages.length === 0) {
            timeoutHandle = setTimeout(linesHandleGap, 5000);
            return;
        }

        // If we're out of lines to draw from, reshuffle all lines.
        if (lineQueue.length < 1) {
            lineQueue = [...state.messages];

            if (state.randomOrder) {
                // Durstenfeld shuffle
                for (let i = lineQueue.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = lineQueue[i];
                    lineQueue[i] = lineQueue[j];
                    lineQueue[j] = temp;
                }
            }
        }

        // If we're out of words to display, pop a new line to display.
        if (wordQueue.length < 1) {
            wordQueue = (hsState.getState().oneWord ? lineQueue.shift().split(" ") : [lineQueue.shift()]);
        }

        linesOutput.innerText = wordQueue.shift();
        linesOutput.style.opacity = state.messageAlpha;

        // Only do a gap if we're out of words
        if (wordQueue.length < 1) {
            timeoutHandle = setTimeout(linesHandleGap, state.messageDuration * 1000);
        } else {
            timeoutHandle = setTimeout(linesHandleDisplay, state.messageDuration * 1000);
        }

    }

    timeoutHandle = setTimeout(linesHandleGap, 10);
}


