// hypnospiral visualizer - by @xyladot
// dyslexia.js - Allows toggling the use of OpenDyslexia.

function SetupDyslexia() {
    const link = document.querySelector('#dyslexia-toggle');

    if (localStorage.getItem('dyslexic')) {
        document.body.classList.toggle('dyslexia');
    }

    link.addEventListener('click', e => {
        e.preventDefault();
        document.body.classList.toggle('dyslexia');

        if (localStorage.getItem('dyslexic')) localStorage.removeItem('dyslexic');
        else localStorage.setItem('dyslexic', "true");
    });
}