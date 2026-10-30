/* Controls are outside the picture: the Telegram circle stays a circle.
   This controller owns playback intent and the caption preference. CSS reads
   data-player-phase / data-player-engaged and the derived hero voice only. */
(() => {
  'use strict';
  const players = [...document.querySelectorAll('[data-market-player]')];
  const pauseControllers = new Map();
  const narrowHero = window.matchMedia('(max-width:760px)');
  const time = seconds => {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(value / 60)).padStart(2,'0')}:${String(value % 60).padStart(2,'0')}`;
  };
  players.forEach(player => {
    const video = player.querySelector('video');
    const mediaSources = [...video.querySelectorAll('source')];
    const failedMediaSources = new Set();
    const controls = player.querySelector('.row-player-controls');
    const play = player.querySelector('[data-play]');
    const sound = player.querySelector('[data-sound]');
    const seek = player.querySelector('.row-player-seek');
    const elapsed = player.querySelector('[data-elapsed]');
    const total = player.querySelector('[data-total]');
    const status = player.querySelector('.row-player-status');
    const caption = player.querySelector('[data-player-caption]');
    const sourceLink = caption.closest('a');
    const originalCaption = caption.textContent;
    const label = video.getAttribute('aria-label');
    const hero = player.closest('.row-hero');
    const greeting = hero && hero.querySelector('.dialogue-greeting');
    // Timed cues feed the page text; metadata cannot paint over the video.
    const trackElement = video.querySelector('track[data-player-captions]');
    const track = trackElement && trackElement.track;
    const captionButton = player.querySelector('[data-captions]');
    const captionState = captionButton && captionButton.querySelector('[data-caption-state]');
    const originalCaptionLabel = captionButton && captionButton.getAttribute('aria-label');
    const subtitleText = player.querySelector('[data-subtitles]');
    const metadata = player.querySelector('.row-player-meta');
    const voiceReserve = hero && greeting ? document.createElement('div') : null;
    const captionHistory = hero && greeting ? document.createElement('div') : null;
    const previousCaption = captionHistory ? document.createElement('span') : null;
    let captionAnimation = null;
    let visibleCueKey = '';
    let visibleCueText = '';
    let visibleCueTime = 0;
    if(voiceReserve) {
      voiceReserve.className = 'hero-voice-reserve';
      voiceReserve.setAttribute('aria-hidden', 'true');
      voiceReserve.hidden = true;
      captionHistory.className = 'hero-caption-history';
      captionHistory.setAttribute('aria-hidden', 'true');
      captionHistory.hidden = true;
      previousCaption.className = 'hero-caption-previous';
      captionHistory.append(previousCaption);
      metadata.append(status, captionHistory, subtitleText, voiceReserve);
    }

    const clearCaptionHistory = () => {
      if(captionAnimation) captionAnimation.cancel();
      captionAnimation = null;
      visibleCueKey = '';
      visibleCueText = '';
      if(previousCaption) previousCaption.textContent = '';
    };
    const updateCaptionHistory = (key, text, available) => {
      if(!previousCaption) return;
      if(!available || video.seeking || video.currentTime < visibleCueTime) {
        clearCaptionHistory();
      } else if(key !== visibleCueKey && visibleCueText && text !== visibleCueText) {
        if(captionAnimation) captionAnimation.cancel();
        previousCaption.textContent = visibleCueText;
        if(!video.paused) {
          const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
          const rise = getComputedStyle(hero).getPropertyValue('--space-inline').trim();
          captionAnimation = previousCaption.animate([
            {transform:reduced ? 'none' : `translateY(${rise})`, opacity:.8},
            {transform:'none', opacity:.5}
          ], {duration:reduced ? 125 : 180, easing:getComputedStyle(hero).getPropertyValue('--ease').trim()});
        }
      }
      if(video.paused && captionAnimation) {
        captionAnimation.cancel();
        captionAnimation = null;
      }
      visibleCueKey = available ? key : '';
      visibleCueText = available ? text : '';
      visibleCueTime = video.currentTime;
    };

    let captionsEnabled = true;
    let trackAvailable = Boolean(track && captionButton && subtitleText);
    let captionFailed = Boolean(trackElement && trackElement.readyState === 3);
    let sourceFailed = false;
    let engaged = false;
    let hasCaptionSession = false;
    let starting = false;
    let buffering = false;
    let playRejected = false;
    let requestToken = 0;
    let retryPosition = null;
    let duration = Number(player.dataset.duration);
    if(captionFailed) trackAvailable = false;

    const phase = () => {
      if(video.error || sourceFailed || playRejected) return 'error';
      if(starting || (buffering && !video.paused)) return 'loading';
      if(video.ended) return 'ended';
      if(!video.paused) return 'playing';
      return engaged ? 'paused' : 'idle';
    };
    const canSeek = () => !video.error && !sourceFailed && video.readyState >= 1 &&
      Number.isFinite(video.duration) && video.duration > 0;
    const clearSourceFailure = () => {
      sourceFailed = false;
      failedMediaSources.clear();
    };
    const activeCaption = () => {
      if(!trackAvailable || !track) return {text:'', key:''};
      const position = Number(video.currentTime) || 0;
      const cues = [...(track.activeCues || [])]
        .filter(cue => cue.startTime <= position && position < cue.endTime);
      return {
        text:rowTypograph(cues.map(cue => cue.text).join(' ').replace(/\s+/g,' ')),
        key:cues.map(cue => `${cue.startTime}:${cue.endTime}:${cue.text}`).join('|')
      };
    };
    const render = () => {
      const state = phase();
      const {text, key} = activeCaption();
      if(text && engaged && video.currentTime > 0 && state !== 'ended' && state !== 'error') {
        hasCaptionSession = true;
      }
      const contextual = Boolean(hero && greeting && narrowHero.matches);
      const heroCaption = contextual && captionsEnabled && trackAvailable &&
        hasCaptionSession && state !== 'ended' && state !== 'error';
      const captionVisible = captionsEnabled && trackAvailable &&
        state !== 'error' && state !== 'ended' && (!contextual || heroCaption);

      player.dataset.playerPhase = state;
      player.dataset.playerEngaged = String(engaged);
      if(hero && greeting) {
        const voice = heroCaption ? 'captions' : 'greeting';
        player.dataset.heroVoice = voice;
        hero.dataset.heroVoice = voice;
        greeting.hidden = heroCaption;
        greeting.setAttribute('aria-hidden', String(heroCaption));
      }
      if(subtitleText) {
        updateCaptionHistory(key, text, Boolean(hero && !narrowHero.matches && engaged && captionVisible));
        const visibleText = captionVisible ? text : '';
        if(subtitleText.textContent !== visibleText) subtitleText.textContent = visibleText;
        subtitleText.hidden = !captionVisible;
        subtitleText.setAttribute('aria-hidden', String(!captionVisible));
      }
      if(voiceReserve) {
        const reserveTexts = engaged && track ?
          [...(track.cues || [])].map(cue => rowTypograph(cue.text.replace(/\s+/g,' '))) : [];
        const children = [...voiceReserve.children];
        if(children.length !== reserveTexts.length || reserveTexts.some((value, index) => children[index].textContent !== value)) {
          voiceReserve.replaceChildren(...reserveTexts.map(value => {
            const line = document.createElement('span');
            line.textContent = value;
            return line;
          }));
        }
        voiceReserve.hidden = reserveTexts.length === 0;
        captionHistory.hidden = reserveTexts.length === 0;
      }
      if(captionButton) {
        captionButton.hidden = false;
        captionButton.disabled = !trackAvailable;
        captionButton.setAttribute('aria-pressed', String(captionsEnabled && trackAvailable));
        captionButton.setAttribute('aria-label', trackAvailable ? originalCaptionLabel : `Субтитры недоступны: ${label}`);
        if(captionState) captionState.textContent = trackAvailable ? (captionsEnabled ? 'вкл.' : 'выкл.') : 'недоступны';
      }

      // A source remains a source while feedback has its own status row.
      const sourceText = contextual ? 'Архив' : originalCaption;
      if(caption.textContent !== sourceText) caption.textContent = sourceText;
      const feedback = [];
      if(video.error || sourceFailed) feedback.push('Видео не загрузилось. Повторите запуск или откройте архив в Telegram.');
      else if(playRejected) feedback.push('Видео не удалось запустить. Повторите запуск или откройте архив в Telegram.');
      else if(state === 'loading') feedback.push('Загрузка видео.');
      if(captionFailed) feedback.push('Субтитры не загрузились. Видео можно смотреть без них или открыть архив в Telegram.');
      const feedbackText = feedback.join(' ');
      if(status.textContent !== feedbackText) status.textContent = feedbackText;

      const busy = state === 'loading' || state === 'playing';
      player.classList.toggle('is-playing', busy);
      player.classList.toggle('is-ended', state === 'ended');
      player.classList.toggle('is-muted', video.muted || video.volume === 0);
      let action = 'Смотреть';
      if(busy) action = 'Пауза';
      else if(state === 'error') action = 'Повторить запуск';
      else if(state === 'ended') action = 'Смотреть ещё раз';
      else if(state === 'paused') action = 'Продолжить';
      play.setAttribute('aria-label', `${action}: ${label}`);
      sound.setAttribute('aria-pressed', String(!video.muted && video.volume > 0));
      elapsed.textContent = time(video.currentTime);
      total.textContent = time(duration);
      const seekAvailable = canSeek();
      if(!seekAvailable && !seek.disabled && document.activeElement === seek) {
        play.focus({preventScroll:true});
      }
      seek.disabled = !seekAvailable;
      seek.value = video.currentTime || 0;
      seek.style.setProperty('--played', `${Math.min(100, duration > 0 ? (video.currentTime || 0) / duration * 100 : 0)}%`);
      seek.setAttribute('aria-valuetext', `${time(video.currentTime)} из ${time(duration)}`);
    };
    const pausePlayback = () => {
      requestToken += 1;
      starting = false;
      buffering = false;
      video.pause();
      render();
    };
    pauseControllers.set(player, pausePlayback);

    play.addEventListener('click', async () => {
      const currentPhase = phase();
      if(starting || (!video.paused && currentPhase !== 'ended' && currentPhase !== 'error')) {
        pausePlayback();
        return;
      }
      engaged = true;
      const request = ++requestToken;
      const ended = video.ended;
      starting = true;
      buffering = false;
      playRejected = false;
      try {
        if(video.error || sourceFailed || (video.networkState === 3 && video.readyState < 1)) {
          if(retryPosition === null && Number.isFinite(video.currentTime) && video.currentTime > 0) {
            retryPosition = video.currentTime;
          }
          clearSourceFailure();
          video.load();
        }
        if(ended) {
          retryPosition = null;
          hasCaptionSession = false;
          video.currentTime = 0;
        }
        render();
        await video.play();
      } catch(error) {
        // A cancelled or superseded request cannot overwrite a later intention.
        if(request === requestToken) {
          starting = false;
          buffering = false;
          playRejected = true;
          video.pause();
          render();
        }
      } finally {
        if(request === requestToken) {
          starting = false;
          render();
        }
      }
    });
    sound.addEventListener('click', () => {
      if(video.volume === 0) { video.volume = 1; video.muted = false; }
      else video.muted = !video.muted;
      render();
    });
    if(track && captionButton && subtitleText) {
      track.mode = 'hidden';
      captionButton.addEventListener('click', () => {
        if(!trackAvailable) return;
        captionsEnabled = !captionsEnabled;
        render();
      });
      track.addEventListener('cuechange', render);
      trackElement.addEventListener('load', () => {
        trackAvailable = true;
        captionFailed = false;
        render();
      });
      trackElement.addEventListener('error', () => {
        trackAvailable = false;
        captionFailed = true;
        hasCaptionSession = false;
        render();
      });
    }
    mediaSources.forEach(mediaSource => mediaSource.addEventListener('error', () => {
      // Source-list failures do not bubble and may leave video.error null.
      // A later candidate or already usable media must not be marked failed.
      if(video.hasAttribute('src') || video.readyState >= 1) return;
      failedMediaSources.add(mediaSource);
      if(failedMediaSources.size === mediaSources.length) {
        sourceFailed = true;
        pausePlayback();
      }
    }));

    const restoreRetryPosition = () => {
      if(retryPosition === null || video.readyState < 1) return;
      const target = Number.isFinite(video.duration) && video.duration > 0 ?
        Math.min(retryPosition, Math.max(0, video.duration - .001)) : retryPosition;
      try {
        video.currentTime = target;
        retryPosition = null;
      } catch(error) {
        // Keep the known position for the next readiness event.
      }
    };
    const updateDuration = () => {
      if(video.readyState >= 1 && !video.error) clearSourceFailure();
      if(Number.isFinite(video.duration) && video.duration > 0) {
        duration = video.duration;
        seek.max = duration;
      }
      restoreRetryPosition();
      render();
    };
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('durationchange', updateDuration);
    video.addEventListener('canplay', updateDuration);
    video.addEventListener('loadstart', () => { clearSourceFailure(); render(); });
    seek.addEventListener('input', () => {
      if(!canSeek()) { render(); return; }
      clearCaptionHistory();
      video.currentTime = Number(seek.value);
      render();
    });
    video.addEventListener('play', () => {
      if(!video.paused && !video.ended && !video.error) {
        pauseControllers.forEach((pause, other) => { if(other !== player) pause(); });
      }
      render();
    });
    video.addEventListener('playing', () => {
      if(!video.paused && !video.ended && !video.error) {
        starting = false;
        buffering = false;
        playRejected = false;
      }
      render();
    });
    video.addEventListener('waiting', () => {
      if(!video.paused && !video.ended && !video.error) buffering = true;
      render();
    });
    video.addEventListener('pause', () => { if(video.paused) buffering = false; render(); });
    video.addEventListener('ended', () => {
      if(video.ended) { starting = false; buffering = false; }
      render();
    });
    video.addEventListener('error', () => {
      if(video.error) { starting = false; buffering = false; }
      render();
    });
    video.addEventListener('emptied', () => {
      hasCaptionSession = false;
      buffering = false;
      render();
    });
    video.addEventListener('seeking', () => { clearCaptionHistory(); render(); });
    video.addEventListener('seeked', () => { clearCaptionHistory(); render(); });
    ['timeupdate','volumechange'].forEach(event => video.addEventListener(event, render));

    // Closing a note and leaving the hero cancel pending starts as well as play.
    const note = player.closest('.cp-video-note');
    if(note) note.addEventListener('toggle', () => { if(!note.open) pausePlayback(); });
    if(hero && greeting) {
      const action = hero.querySelector('.dialogue-start');
      if(action) action.addEventListener('click', pausePlayback);
      const secondaryControls = [sound, captionButton, seek].filter(Boolean);
      const buttons = player.querySelector('.row-player-buttons');
      const syncControlOrder = () => {
        const focused = document.activeElement;
        let sourceMoved = false;
        let captionMoved = false;
        if(narrowHero.matches) {
          if(sourceLink.parentNode !== buttons || sourceLink.nextElementSibling !== sound) {
            buttons.insertBefore(sourceLink, sound);
            sourceMoved = true;
          }
          if(captionButton && (captionButton.parentNode !== buttons || sound.nextElementSibling !== captionButton)) {
            sound.after(captionButton);
            captionMoved = true;
          }
        } else {
          if(sourceLink.parentNode !== metadata) {
            metadata.insertBefore(sourceLink, status);
            sourceMoved = true;
          }
          if(captionButton && captionButton.parentNode !== metadata) {
            metadata.insertBefore(captionButton, status);
            captionMoved = true;
          }
        }
        if((sourceMoved && focused === sourceLink) || (captionMoved && focused === captionButton)) {
          const target = narrowHero.matches && !engaged && focused === captionButton ? play : focused;
          target.focus({preventScroll:true});
        }
      };
      player.addEventListener('focusout', event => {
        if(event.relatedTarget || !secondaryControls.includes(event.target)) return;
        const previous = event.target;
        requestAnimationFrame(() => {
          const current = document.activeElement;
          const focusWasDropped = !current || current === document.body ||
            current === document.documentElement || current === previous;
          if(narrowHero.matches && !engaged && focusWasDropped &&
            getComputedStyle(previous).display === 'none') {
            play.focus({preventScroll:true});
          }
        });
      });
      narrowHero.addEventListener('change', () => {
        clearCaptionHistory();
        if(narrowHero.matches && !engaged && secondaryControls.includes(document.activeElement)) {
          play.focus({preventScroll:true});
        }
        syncControlOrder();
        render();
      });
      syncControlOrder();
    }
    video.controls = false;
    controls.hidden = false;
    render();
  });
  document.querySelectorAll('[data-order]').forEach(button => button.addEventListener('click', () => {
    pauseControllers.forEach(pause => pause());
  }));
  const revealLinkedVideo = () => {
    const id = location.hash.slice(1);
    const target = id && document.getElementById(id);
    const note = target && target.closest('.cp-video-note');
    if(note && !note.open) { note.open = true; target.scrollIntoView({block:'start',behavior:'instant'}); }
  };
  window.addEventListener('hashchange',revealLinkedVideo);
  revealLinkedVideo();
})();
