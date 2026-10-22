/* Local player presentation. Media loading, captions, seeking and pause remain
   in the shared player; this changes only its visible time convention. */
const remainingVideoTime = (duration, elapsed = 0) => {
  const seconds = Math.max(0, Math.floor((Number(duration) || 0) - (Number(elapsed) || 0)));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-market-player]').forEach(player => {
    const video = player.querySelector('video');
    const output = player.querySelector('.row-player-time');
    output.querySelectorAll('span').forEach(span => span.setAttribute('aria-hidden', 'true'));
    const remaining = document.createElement('span');
    remaining.dataset.remaining = '';
    output.append(remaining);
    const update = () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Number(player.dataset.duration);
      remaining.textContent = remainingVideoTime(duration, video.ended ? duration : video.currentTime);
      output.setAttribute('aria-label', `Осталось ${remaining.textContent}`);
    };
    ['loadedmetadata', 'durationchange', 'timeupdate', 'seeked', 'ended', 'emptied'].forEach(event => video.addEventListener(event, update));
    update();
  });
}
