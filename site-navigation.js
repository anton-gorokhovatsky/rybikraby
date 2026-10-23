/* Responsive navigation for the seasonal page. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.row-header');
    const navigation = header.querySelector('nav');
    const arrow = '<svg class="row-action-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M6 5h13v13"/></svg>';
    const items = [
      ['caviar', 'Икра'], ['fish', 'Рыба'], ['seafood', 'Крабы и морепродукты'],
      ['counter', 'За прилавком'], ['contact', 'Контакты']
    ];
    const link = ([id, label]) => `<a href="#${id}"><span class="row-nav-label">${label}</span></a>`;
    header.classList.add('site-navigation');
    navigation.id = 'site-navigation';
    navigation.classList.add('menu-panel');
    navigation.innerHTML = `<div class="menu-products">${items.slice(0, 3).map(link).join('')}</div>
      <div class="menu-secondary">${items.slice(3).map(link).join('')}</div>
      <a class="header-contact" href="https://t.me/Yuraikra" target="_blank" rel="noopener"><span class="row-nav-label">Написать Юре</span>${arrow}</a>`;
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', navigation.id);
    toggle.innerHTML = `<span class="menu-toggle-label">Меню</span>
      <svg class="menu-symbol" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <g class="menu-sandwich"><path d="M3 14h18v3c0 2-2 3-4 3H7c-2 0-4-1-4-3z"/>
          <path d="M4 11h16"/><g class="menu-roe"><circle cx="6" cy="7" r="1.3"/><circle cx="12" cy="7" r="1.3"/><circle cx="18" cy="7" r="1.3"/><circle cx="9" cy="4" r="1.3"/><circle cx="15" cy="4" r="1.3"/></g></g>
        <g class="menu-cross"><path d="m5 5 14 14M19 5 5 19"/></g>
      </svg>`;
    header.insertBefore(toggle, navigation);
    const label = toggle.querySelector('.menu-toggle-label');
    let compact = false;
    let opened = false;

    const setOpen = (value, returnFocus = false) => {
      opened = compact && value;
      header.dataset.navOpen = String(opened);
      toggle.setAttribute('aria-expanded', String(opened));
      label.textContent = opened ? 'Закрыть' : 'Меню';
      navigation.hidden = compact && !opened;
      if (returnFocus && compact) toggle.focus({preventScroll: true});
    };
    const syncLayout = () => {
      const next = header.clientWidth < 64 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const focusWasHidden = !next && document.activeElement === toggle;
      compact = next;
      header.dataset.navCompact = String(compact);
      toggle.hidden = !compact;
      setOpen(opened);
      if (focusWasHidden) navigation.querySelector('a').focus({preventScroll: true});
    };
    header.addEventListener('pointerdown', () => { header.dataset.navInput = 'pointer'; });
    header.addEventListener('keydown', () => { header.dataset.navInput = 'keyboard'; });
    toggle.addEventListener('click', () => setOpen(!opened));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && opened) {
        event.preventDefault();
        header.dataset.navInput = 'keyboard';
        setOpen(false, true);
      }
    });
    document.addEventListener('pointerdown', event => {
      if (opened && !header.contains(event.target)) setOpen(false);
    });
    header.addEventListener('focusout', event => {
      if (opened && event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
    });
    navigation.addEventListener('click', event => {
      const anchor = event.target.closest('a');
      if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = anchor.getAttribute('href');
      setOpen(false);
      if (href.startsWith('#')) {
        const destination = document.getElementById(href.slice(1));
        if (destination) {
          if (!destination.hasAttribute('tabindex')) destination.tabIndex = -1;
          requestAnimationFrame(() => destination.focus({preventScroll: true}));
        }
      } else {
        document.querySelectorAll('video').forEach(video => { if (!video.paused) video.pause(); });
      }
    });
    header.querySelector('.wordmark').addEventListener('click', () => setOpen(false));
    const anchors = [...navigation.querySelectorAll('a[href^="#"]')];
    const scenes = items.map(([id]) => document.getElementById(id));
    let frame = 0;
    const syncCurrent = () => {
      frame = 0;
      const probe = header.getBoundingClientRect().bottom + 80;
      const scene = scenes.find(element => {
        const box = element.getBoundingClientRect();
        return box.top <= probe && box.bottom > probe;
      });
      anchors.forEach(anchor => {
        if (scene && anchor.hash === `#${scene.id}`) anchor.setAttribute('aria-current', 'location');
        else anchor.removeAttribute('aria-current');
      });
    };
    addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(syncCurrent); }, {passive: true});
    addEventListener('resize', syncLayout);
    new ResizeObserver(syncLayout).observe(header);
    document.fonts.ready.then(() => { syncLayout(); syncCurrent(); });
    syncLayout();
    syncCurrent();
  });
})();
