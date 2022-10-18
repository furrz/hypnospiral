// hypnospiral visualizer - by @xyladot
// state.js - Provides a simple state-storage system, wherein state is stored in a set of keys+values.

// HSStateStorage: initialize a new state-storage object with the given default state.
function HSStateStorage(defaultState) {
    let state = { ...defaultState };
    let stateChangeListeners = [];

    // changeState(newState): Applies the new state to the old one immediately,
    // triggering any state change listeners.
    function changeState(newState) {
        state = {...state, ...newState};

        for (const listener of stateChangeListeners) {
            listener(state, newState);
        }
    }

    // Add a new state change listener. It will be called with (state, newState) whenever
    // the state is changed.
    function onStateChange(cb) {
        stateChangeListeners.push(cb);
    }

    // Get the current state.
    function getState() {
        return state;
    }

    // Get any non-default state.
    function getNonDefaultState() {
        const changedState = {};
        for (const [k, v] of Object.entries(defaultState)) {
            if (JSON.stringify(v) !== JSON.stringify(state[k])) changedState[k] = state[k];
        }
        return changedState;
    }

    return {changeState, onStateChange, getState, getNonDefaultState};
}
