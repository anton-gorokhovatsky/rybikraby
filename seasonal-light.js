/* Seasonal navigation and the shared photographic light. */
(() => {
  'use strict';
  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  const seasonDestination = ['#seasons', '#editions'].includes(location.hash);
  if (seasonDestination && navigationType !== 'back_forward' && navigationType !== 'reload') {
    document.documentElement.classList.add('season-restoring');
    addEventListener('load', () => {
      const destination = document.querySelector(location.hash);
      destination?.scrollIntoView({block:location.hash === '#seasons' ? 'end' : 'start',behavior:'auto'});
      destination?.querySelector('[aria-current]')?.focus({preventScroll:true});
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
    const editions = document.querySelector('.season-editions');
    const selected = editions?.querySelector('[aria-current]');
    const revealEdition = () => {
      if (!editions || !selected) return;
      // Only scroll the rail; opening the normal hero must never move the page.
      const target = editions.contains(document.activeElement) ? document.activeElement.closest('a') || selected : selected;
      const padding = parseFloat(getComputedStyle(editions).paddingInlineStart);
      const left = target.offsetLeft - padding;
      const right = target.offsetLeft + target.offsetWidth + padding;
      if (left < editions.scrollLeft) editions.scrollLeft = left;
      else if (right > editions.scrollLeft + editions.clientWidth) editions.scrollLeft = right - editions.clientWidth;
    };
    editions?.addEventListener('focusin', revealEdition);
    document.fonts.ready.then(revealEdition);
    if (editions) new ResizeObserver(revealEdition).observe(editions);
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
