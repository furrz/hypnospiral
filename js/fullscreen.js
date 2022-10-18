// hypnospiral visualizer - by @xyladot
// fullscreen.js - Handles entering fullscreen by clicking an element.
function HandleFullscreen(selector) {
    document.querySelector(selector).addEventListener('click', function () {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen({navigationUI: "hide"});
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen({navigationUI: "hide"});
            }
        }
    });
}