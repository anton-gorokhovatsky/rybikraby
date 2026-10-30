/* Responsive navigation for the seasonal page. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.row-header');
    const navigation = header?.querySelector('nav');
    if (!header || !navigation) return;
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
    let movingSeasons = false;
    let seasonActions = null;
    const hero = document.querySelector('.row-hero');
    const seasonSlot = document.createComment('Seasonal navigation: wide cover position');
    const seasonGroup = document.createElement('div');
    seasonGroup.className = 'site-nav-seasons';
    seasonGroup.hidden = true;
    navigation.append(seasonGroup);

    const setOpen = (value, returnFocus = false) => {
      opened = compact && value;
      header.dataset.navOpen = String(opened);
      toggle.setAttribute('aria-expanded', String(opened));
      label.textContent = opened ? 'Закрыть' : 'Меню';
      navigation.hidden = compact && !opened;
      if (returnFocus && compact) toggle.focus({preventScroll: true});
    };
    // One real group, including its URLs, selected edition and drawn oval.
    // Cover renderers register their home; navigation alone moves this node.
    const refreshSeasons = (home = hero) => {
      seasonActions ||= document.querySelector('.hero-actions');
      if (!seasonActions || !home) return;
      if (seasonSlot.parentNode !== home) home.append(seasonSlot);
      let seasonLabel = seasonActions.querySelector('[data-season-label],.cover-editions-label');
      if (!seasonLabel) {
        seasonLabel = document.createElement('p');
        seasonLabel.textContent = 'Сезонные истории';
        seasonActions.prepend(seasonLabel);
      }
      seasonLabel.classList.add('hero-editions-label');
      seasonLabel.dataset.seasonLabel = '';
      seasonLabel.id = 'site-season-label';
      seasonActions.querySelector('.season-tabs')?.setAttribute('aria-labelledby', seasonLabel.id);
      const focusedSeason = seasonActions.contains(document.activeElement) ? document.activeElement : null;
      if (focusedSeason && compact && !opened) setOpen(true);
      movingSeasons = true;
      seasonGroup.hidden = !compact;
      if (compact) {
        if (seasonActions.parentNode !== seasonGroup) seasonGroup.append(seasonActions);
      } else if (seasonActions.nextSibling !== seasonSlot) seasonSlot.before(seasonActions);
      focusedSeason?.focus({preventScroll: true});
      movingSeasons = false;
    };
    window.marketSiteNavigation = Object.freeze({refreshSeasons});
    const revealLegacySeasons = () => {
      if (!compact || location.hash !== '#seasons' || !seasonActions) return;
      setOpen(true);
      const selected = seasonActions.querySelector('[aria-current="page"]') || seasonActions.querySelector('a');
      selected?.focus({preventScroll: true});
      if (selected) {
        const panelBox = navigation.getBoundingClientRect();
        const linkBox = selected.getBoundingClientRect();
        if (linkBox.bottom > panelBox.bottom - 20) navigation.scrollTop += linkBox.bottom - panelBox.bottom + 20;
        else if (linkBox.top < panelBox.top + 20) navigation.scrollTop += linkBox.top - panelBox.top - 20;
      }
    };
    const syncLayout = () => {
      const next = header.clientWidth < 64 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const becameCompact = next && !compact;
      const focused = document.activeElement;
      const focusedSeason = seasonActions?.contains(focused);
      const keepFocusedMenu = next && (navigation.contains(focused) || focusedSeason);
      const focusedToggleWillHide = !next && focused === toggle;
      compact = next;
      header.dataset.navCompact = String(compact);
      toggle.hidden = !compact;
      setOpen(opened || keepFocusedMenu);
      refreshSeasons();
      if (focusedSeason) focused.focus({preventScroll: true});
      else if (focusedToggleWillHide) navigation.querySelector('a').focus({preventScroll: true});
      if (becameCompact) revealLegacySeasons();
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
      if (opened && !header.contains(event.target)) setOpen(false, navigation.contains(document.activeElement));
    });
    header.addEventListener('focusout', event => {
      if (!movingSeasons && opened && event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
    });
    navigation.addEventListener('click', event => {
      const anchor = event.target.closest('a');
      if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(anchor.href, location.href);
      // A new tab leaves this page in place. Keep its next keyboard position
      // on the visible toggle instead of the link inside the now-hidden panel.
      setOpen(false, anchor.target === '_blank');
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) {
        const destination = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (destination) {
          if (!destination.hasAttribute('tabindex')) destination.tabIndex = -1;
          requestAnimationFrame(() => destination.focus({preventScroll: true}));
        }
      } else {
        document.querySelectorAll('video').forEach(video => { if (!video.paused) video.pause(); });
      }
    });
    header.querySelector('.wordmark').addEventListener('click', () => setOpen(false));
    // Section position never replaces aria-current="page" on edition links.
    const anchors = [...navigation.querySelectorAll('.menu-products a,.menu-secondary a')];
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
    addEventListener('hashchange', revealLegacySeasons);
    // The earlier seasonal-light load handler restores the old footer hash.
    // Run after its visibility frame, with the compact destination in the menu.
    addEventListener('load', () => requestAnimationFrame(revealLegacySeasons), {once: true});
    new ResizeObserver(syncLayout).observe(header);
    document.fonts.ready.then(() => { syncLayout(); syncCurrent(); });
    syncLayout();
    syncCurrent();
  });
})();
