/* Controls are outside the picture: the Telegram circle stays a circle. */
(() => {
  'use strict';
  const players = [...document.querySelectorAll('[data-market-player]')];
  const time = seconds => {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(value / 60)).padStart(2,'0')}:${String(value % 60).padStart(2,'0')}`;
  };
  players.forEach(player => {
    const video = player.querySelector('video');
    const controls = player.querySelector('.row-player-controls');
    const play = player.querySelector('[data-play]');
    const sound = player.querySelector('[data-sound]');
    const seek = player.querySelector('.row-player-seek');
    const elapsed = player.querySelector('[data-elapsed]');
    const total = player.querySelector('[data-total]');
    const status = player.querySelector('.row-player-status');
    const caption = player.querySelector('[data-player-caption]');
    const source = caption.closest('a');
    const originalCaption = caption.textContent;
    const sourceLabel = source.getAttribute('aria-label');
    const label = video.getAttribute('aria-label');
    const trackElement = video.querySelector('track[kind="captions"]');
    const captionButton = player.querySelector('[data-captions]');
    const subtitleText = player.querySelector('[data-subtitles]');
    if(trackElement && captionButton && subtitleText) {
      const track = trackElement.track;
      let captionsEnabled = true;
      const captionState = captionButton.querySelector('[data-caption-state]');
      const showCaptionState = (enabled, text = enabled ? 'вкл.' : 'выкл.') => {
        captionButton.setAttribute('aria-pressed',String(enabled));
        if(captionState) captionState.textContent = text;
      };
      const updateCaptions = () => {
        const active = [...(track.activeCues || [])];
        subtitleText.textContent = rowTypograph(active.map(cue=>cue.text).join(' ').replace(/\s+/g,' '));
      };
      track.mode = 'hidden';
      captionButton.hidden = false;
      subtitleText.hidden = false;
      captionButton.addEventListener('click', () => {
        captionsEnabled = !captionsEnabled;
        showCaptionState(captionsEnabled);
        subtitleText.setAttribute('aria-hidden',String(!captionsEnabled));
        updateCaptions();
      });
      track.addEventListener('cuechange',updateCaptions);
      trackElement.addEventListener('load',updateCaptions);
      trackElement.addEventListener('error',()=>{
        subtitleText.textContent='Субтитры не загрузились.';
        captionButton.disabled=true;
        showCaptionState(false,'недоступны');
        captionButton.setAttribute('aria-label',`Субтитры недоступны: ${label}`);
      });
      updateCaptions();
    }
    let starting = false;
    let duration = Number(player.dataset.duration);
    const setStatus = state => {
      caption.textContent = state==='loading'?'Загрузка…':state==='error'?'Ошибка · Telegram':originalCaption;
      status.textContent = state==='loading'?'Загрузка видео.':state==='error'?'Видео не загрузилось. Повторите запуск или откройте оригинал в Telegram.':'';
      source.setAttribute('aria-label',state==='error'?`Видео не загрузилось. ${sourceLabel}`:sourceLabel);
    };

    const update = () => {
      const playing = !video.paused && !video.ended;
      player.classList.toggle('is-playing', playing);
      player.classList.toggle('is-ended', video.ended);
      player.classList.toggle('is-muted', video.muted || video.volume === 0);
      play.setAttribute('aria-label', `${playing?'Пауза':video.error?'Повторить загрузку':video.ended?'Смотреть ещё раз':'Смотреть'}: ${label}`);
      sound.setAttribute('aria-pressed', String(!video.muted && video.volume > 0));
      elapsed.textContent = time(video.currentTime);
      total.textContent = time(duration);
      seek.value = video.currentTime || 0;
      seek.style.setProperty('--played', `${Math.min(100, (video.currentTime || 0) / duration * 100)}%`);
      seek.setAttribute('aria-valuetext', `${time(video.currentTime)} из ${time(duration)}`);
    };
    play.addEventListener('click', async () => {
      if(starting || !video.paused) {
        starting = false;
        video.pause();
        setStatus('');
        update();
        return;
      }
      if(video.error) video.load();
      if(video.ended) video.currentTime = 0;
      starting = true;
      setStatus('loading');
      try { await video.play(); }
      catch(error) {
        if(error.name !== 'AbortError') setStatus('error');
      } finally { starting = false; update(); }
    });
    sound.addEventListener('click', () => {
      if(video.volume === 0) { video.volume = 1; video.muted = false; }
      else video.muted = !video.muted;
      update();
    });
    video.addEventListener('loadedmetadata', () => {
      if(Number.isFinite(video.duration) && video.duration > 0) {
        duration = video.duration;
        seek.max = duration;
        seek.disabled = false;
      }
      update();
    });
    seek.addEventListener('input', () => {
      video.currentTime = Number(seek.value);
      update();
    });
    video.addEventListener('play', () => {
      players.forEach(other => { if(other !== player) other.querySelector('video').pause(); });
      update();
    });
    video.addEventListener('playing', () => { setStatus(''); update(); });
    video.addEventListener('waiting', () => { if(!video.paused) setStatus('loading'); });
    video.addEventListener('pause', () => { if(!video.error) setStatus(''); update(); });
    video.addEventListener('ended', () => { setStatus(''); update(); });
    video.addEventListener('error', () => { setStatus('error'); update(); });
    ['timeupdate','volumechange','seeked'].forEach(event => video.addEventListener(event, update));
    video.controls = false;
    controls.hidden = false;
    update();
  });
  document.querySelectorAll('[data-order]').forEach(button => button.addEventListener('click', () => {
    players.forEach(player => player.querySelector('video').pause());
  }));
})();
