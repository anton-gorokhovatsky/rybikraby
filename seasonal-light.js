/* Local comparison controls. Production files and the solar clock stay intact. */
(() => {
  'use strict';
  if (location.hash === '#seasons') {
    document.documentElement.classList.add('season-restoring');
    addEventListener('load', () => {
      const end = document.querySelector('#seasons');
      end?.scrollIntoView({block:'end',behavior:'auto'});
      end?.querySelector('[aria-current]')?.focus({preventScroll:true});
      requestAnimationFrame(() => document.documentElement.classList.remove('season-restoring'));
    }, {once:true});
  }
  const solarStart = MarketLight.start;
  MarketLight.start = (options = {}) => solarStart({
    ...options,
    onChange: () => {
      // Solar light still controls day/evening and the photographic lighting.
      // Seasonal paper comes from CSS, not the old inline neutral paper value.
      document.body.style.removeProperty('--paper');
      options.onChange?.();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.row-header');
    const material = [...document.querySelectorAll('.row-player-picture,.fish-use img,.season-photo,.dialogue-start')]
      .filter(element => !element.closest('.row-hero') || element.matches('.dialogue-start'));
    const syncBackdrop = () => {
      const box = menu.getBoundingClientRect();
      menu.dataset.overContent = String(material.some(element => {
        const item = element.getBoundingClientRect();
        return item.top < box.bottom && item.bottom > box.top && item.left < box.right && item.right > box.left;
      }));
    };
    let frame = 0;
    addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0;syncBackdrop(); });
    }, {passive:true});
    addEventListener('resize', syncBackdrop);
    document.fonts.ready.then(syncBackdrop);
    syncBackdrop();
  });
})();
