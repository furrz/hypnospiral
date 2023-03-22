// hypnospiral visualizer - by @xyladot
// control_toggle.js - Handles the toggling of the control UI.

function HandleControlToggle() {
    const hud = document.querySelector('#controls');

    function toggleHud() {
        if (hud.style.display === 'none') {
            hud.style.display = 'flex';
            document.querySelector("#spiral-video-overlay").pause();
        } else {
            hud.style.display = 'none';
            document.querySelector("#spiral-video-overlay").play();
            document.querySelector("#spiral-video-overlay").loop = true;
        }
    }

    window.addEventListener('keyup', function (e) {
        if (e.key === " " && hud.style.display === 'none') toggleHud();
        if (e.key === "Escape" && !(document.fullscreenElement || document.webkitFullscreenElement)) {
            toggleHud();
        }
    });

    document.querySelector('#control-hide-btn').addEventListener('click', toggleHud);
    document.querySelector('#mobile-emergency-escape').addEventListener('click', toggleHud);
}