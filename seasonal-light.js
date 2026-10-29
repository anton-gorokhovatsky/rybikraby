/* Seasonal navigation and the shared photographic light. */
(() => {
  'use strict';
  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  if (location.hash === '#seasons' && !['back_forward', 'reload'].includes(navigationType)) {
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

(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.row-hero');
    const intro = hero.querySelector('.dialogue-intro');
    const action = intro.querySelector('.dialogue-start');
    // Season Artist A: an editorial annotation on the photograph.
    const editions = [
      ['spring', 'Весна'], ['summer', 'Лето'], ['autumn', 'Осень'],
      ['newyear', 'Новый год'], ['winter', 'Зима']
    ];
    const current = document.body.dataset.seasonal;
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    const tabs = document.createElement('nav');
    tabs.className = 'season-tabs';
    tabs.setAttribute('aria-label', 'Сезонные истории');
    tabs.innerHTML = editions.map(([key, name]) => {
      const url = new URL(location.href);
      url.searchParams.set('accent', key);
      url.hash = 'main';
      const title = key === 'newyear' ? 'Новогодний стол — Новый год' : name;
      const mark = key === 'newyear'
        ? 'M6 21C5 11 9 5 23 3C43 1 72 2 86 5C93 7 95 13 94 22C94 31 89 35 75 37C55 39 26 37 15 34C8 32 5 28 6 21M12 9C28 2 72 1 88 7'
        : 'M7 24C2 14 14 5 37 3C61 1 90 6 94 18C99 30 80 37 55 37C31 38 10 35 7 24M10 11C25 2 72 1 90 10';
      return `<a href="${url.pathname}${url.search.replace(/&/g, '&amp;')}#main" data-edition="${key}" aria-label="${title}"${key === current ? ' aria-current="page"' : ''}>
        <span class="season-tab-time">${name.replace('Новый год', 'Новый\u00a0год')}</span>
        <svg class="season-current-mark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${mark}"/></svg>
      </a>`;
    }).join('');
    actions.append(tabs);
    intro.append(actions);
    // Old shared #editions links now lead to the opening scene.
    hero.id = 'editions';
  });
})();
