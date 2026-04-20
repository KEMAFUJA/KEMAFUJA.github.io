const miAudio = document.getElementById('background-audio');

    function playAudio() {
    miAudio.play();
    document.querySelector('.audio-controls .fa-play').parentNode.classList.add('active');
    document.querySelector('.audio-controls .fa-pause').parentNode.classList.remove('active');
    }

    function pauseAudio() {
    miAudio.pause();
    document.querySelector('.audio-controls .fa-pause').parentNode.classList.add('active');
    document.querySelector('.audio-controls .fa-play').parentNode.classList.remove('active');
    }