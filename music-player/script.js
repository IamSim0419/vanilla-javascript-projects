const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressContainer = document.querySelector('.progress-container');
const progress = document.getElementById('progress');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover-image');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const volumeIcon = document.getElementById('volume-icon');

const songs = [
    {
        name: "audio/NewJeans - Bubble Gum.mp3",
        title: "Bubble Gum",
        artist: "NewJeans",
        cover: "assets/nj_cover2.jpg"
    },
    {
        name: "audio/NewJeans - Cool With You.mp3",
        title: "Cool With You",
        artist: "NewJeans",
        cover: "assets/nj_cover3.jpg"
    },
    {
        name: "audio/NewJeans - How Sweet.mp3",
        title: "How Sweet",
        artist: "NewJeans",
        cover: "assets/nj_cover1.jpg"
    },
    {
        name: "audio/NewJeans - New Jeans.mp3",
        title: "New Jeans",
        artist: "NewJeans",
        cover: "assets/nj_cover4.jpg"
    },
];

let songIndex = 0;

// Load song details first
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.name;
    cover.src = song.cover;
}

// Play song
function playSong() {
    playBtn.querySelector('i').classList.remove('fa-play');
    playBtn.querySelector('i').classList.add('fa-pause');
    audio.play();
}

// Pause song
function pauseSong() {
    playBtn.querySelector('i').classList.remove('fa-pause');
    playBtn.querySelector('i').classList.add('fa-play');
    audio.pause();
}

// Previous song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    // console.log(songs[songIndex]);
    playSong();
}

// Update progress bar and time display
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Update current time display
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeEl.innerText = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;

    // Update duration display
    if (!isNaN(duration)) {
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        durationEl.innerText = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Volume control
function setVolume() {
    audio.volume = volumeSlider.value;

    // Update volume icon
    if (audio.volume === 0) {
        volumeIcon.innerHTML = '<i class="fa fa-volume-mute"></i>';
    } else if (audio.volume < 0.5) {
        volumeIcon.innerHTML = '<i class="fa fa-volume-down"></i>';
    } else {
        volumeIcon.innerHTML = '<i class="fa fa-volume-up"></i>';
    }
}

// Mute/unmute
function toggleMute() {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.innerHTML = '<i class="fa fa-volume-mute"></i>';
    } else {
        audio.volume = 1;
        volumeSlider.value = 1;
        volumeIcon.innerHTML = '<i class="fa fa-volume-up"></i>';
    }
}

// Event listeners
playBtn.addEventListener('click', () => {
    const isPlaying = playBtn.querySelector('i').classList.contains('fa-pause');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);
volumeSlider.addEventListener('input', setVolume);
volumeIcon.addEventListener('click', toggleMute);

// Load initial song
loadSong(songs[songIndex]);
