const player = document.querySelector('#player');
const tracks = [...document.querySelectorAll('.track')];
const waveform = document.querySelector('.waveform');
const caption = document.querySelector('#current-track');
const cover = document.querySelector('#track-cover');
const state = document.querySelector('#play-state');
const message = document.querySelector('#play-message');
let currentTrack;
let bars = [];

function renderProgress() {
  const fraction = Number.isFinite(player.duration) && player.duration > 0
    ? player.currentTime / player.duration : 0;
  const playedBars = Math.round(bars.length * fraction);
  bars.forEach((bar, index) => bar.classList.toggle('elapsed', index < playedBars));
}

function renderPlayback() {
  const playing = !player.paused && !player.ended;
  currentTrack.classList.toggle('playing', playing);
  state.textContent = playing ? 'Now playing' : player.currentTime && !player.ended ? 'Paused' : 'Selected track';
}

function selectTrack(track) {
  if (currentTrack) {
    currentTrack.removeAttribute('aria-current');
    currentTrack.classList.remove('playing');
  }
  currentTrack = track;
  track.setAttribute('aria-current', 'true');
  const title = track.firstElementChild.textContent;
  cover.src = track.dataset.cover;
  cover.alt = title + ' cover artwork';
  caption.textContent = title;
  document.querySelector('#esfahan-note').hidden = title !== 'Esfahan Waltz';
  player.setAttribute('aria-label', title);
  message.hidden = true;
  message.textContent = '';
  bars = track.dataset.peaks.split(',').map(value => {
    const bar = document.createElement('i');
    bar.style.height = Math.max(4, Number(value)) + '%';
    return bar;
  });
  waveform.replaceChildren(...bars);
  renderPlayback();
  renderProgress();
}

function reportPlaybackError() {
  message.textContent = 'Playback could not start. Try the audio controls or choose another track.';
  message.hidden = false;
}

for (const track of tracks) {
  track.addEventListener('click', async event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (currentTrack === track && !player.paused) {
      player.pause();
      return;
    }
    if (currentTrack !== track) {
      player.src = track.href;
      selectTrack(track);
    } else if (player.error) {
      player.load();
    }
    try {
      await player.play();
    } catch (error) {
      if (error.name !== 'AbortError' && currentTrack === track) reportPlaybackError();
    }
  });
}
selectTrack(tracks[0]);
player.addEventListener('play', () => {
  message.hidden = true;
  renderPlayback();
});
player.addEventListener('pause', renderPlayback);
player.addEventListener('ended', renderPlayback);
player.addEventListener('error', reportPlaybackError);
player.addEventListener('timeupdate', renderProgress);
