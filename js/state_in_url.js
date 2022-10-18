// hypnospiral visualizer - by @xyladot
// state_in_url.js - Allows saving and loading state from the current URL's hash.
// Dependencies:
// - state.js: Provides the state storage system.

// Try to load state from the current page's hash as JSON, and auto-update the URL hash.
// This also auto-updates the value in a text-box to reflect the URL.
function LinkStateToHash(hsState, selector) {

    // Try to load state from the URL
    if (location.hash && location.hash.length > 2) {
        try {
            // If it loads, change all the relevant state values.
            const hashData = JSON.parse(decodeURIComponent(location.hash.substring(1)));
            hsState.changeState(hashData);
        } catch (e) {
            console.log(e);
        }
    }

    const shareUrlOut = document.querySelector(selector);

    hsState.onStateChange(() => {
        const changedState = hsState.getNonDefaultState();

        if (Object.keys(changedState).length > 0) {
            window.location.hash = "#" + encodeURIComponent(JSON.stringify(changedState));
        } else {
            window.location.hash = "";
        }

        shareUrlOut.value = window.location.href;
    });

}
