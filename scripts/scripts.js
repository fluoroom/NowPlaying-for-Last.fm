/* Fullscreen */
let elem = document.documentElement;

function changeUser(){
    localStorage.setItem("user", null);
    localStorage.setItem("user", prompt("Enter your Last.fm user please:"));
}

/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

function fullscreen() {
    let isFullscreen = document.fullscreen;
    if (isFullscreen == true) {
        closeFullscreen();
    } else {
        openFullscreen();
    }
}

function theme() {
    if (localStorage.getItem('theme') == null || localStorage.getItem('theme') == 'original') {
        localStorage.setItem('theme', 'test');
        $('#playingcss-test').attr('rel', 'stylesheet');
    } else {
        localStorage.setItem('theme', 'original');
        $('#playingcss-test').attr('rel', 'stylesheet alternate');
    }
}
