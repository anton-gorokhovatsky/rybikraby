/* Product-led dialogue: accepted hero, original media, questions beside answers. */
(() => {
  const accepted = tokyoRow;
  const prose = text => rowTypograph(text)
    .replace(/(\d)-(го|й)(?=[\s.,!?]|$)/g,'$1\u2011$2')
    .replace(/(\d) +(г|кг)(?=[\s.,!?]|$)/g,'$1\u00a0$2');
  tokyoRow = options => {
    const source=document.createElement('template');
    source.innerHTML=accepted(options);
    const root=source.content;
    const player=key=>{
      const figure=root.querySelector(`#story-${key}`).closest('.row-player').cloneNode(true);
      const caption=figure.querySelector('[data-player-caption]');
      caption.textContent=caption.textContent.replace(/^Архив · /,'');
      return figure.outerHTML;
    };
    const title=id=>{
      const heading=root.querySelector(`#${id}-title`).cloneNode(true);
      heading.style.setProperty('--cp-lettering',heading.querySelector('.row-lettering').style.getPropertyValue('--lettering-width'));
      return `<div class="cp-title">${heading.outerHTML}</div>`;
    };
    const question=text=>`<p class="cp-question">${prose(text)}</p>`;
    const paragraph=(text,style='cp-copy')=>`<p class="${style}">${prose(text)}</p>`;
    const voice=(key,text)=>`<div class="cp-voice">${paragraph(text,'cp-voice-answer')}${player(key)}</div>`;
    const hero=root.querySelector('.row-hero').outerHTML;
    const header=root.querySelector('.row-header').outerHTML;
    const lots=root.querySelector('.row-lots').outerHTML;
    const fishPicture=root.querySelector('.dialogue-fish-picture').outerHTML;
    const footer=root.querySelector('.dialogue-footer');
    const origin=document.createElement('p');
    origin.className='cp-origin';
    origin.textContent=prose('Разговор составлен по архивным записям Юры. Даты и цены в видео относятся к моменту съёмки.');
    footer.querySelector('.dialogue-footer-brand').before(origin);
    return `${header}<main id="main" class="row-main" tabindex="-1">${hero}
      <section id="caviar" class="cp-scene cp-caviar row-caviar" tabindex="-1" aria-labelledby="caviar-title">
        <div class="cp-caviar-copy">
          ${title('caviar')}
          ${paragraph('Начнём со вкуса.','cp-answer')}
          ${lots}
          <a class="row-reference cp-source" href="https://t.me/ikrabov/190" target="_blank" rel="noopener">О различиях — в канале <span aria-hidden="true">↗</span></a>
          <div class="cp-exchange">
            ${question('А если я не разбираюсь?')}
            ${voice('caviar-choice','Я пробую икру сам. Подберём по соли, консистенции и твоему бюджету.')}
          </div>
        </div>
        <div class="cp-product cp-caviar-product">
          ${paragraph('Вот, пробую нерку нового сезона. Открываю банку и показываю зерно.','cp-product-answer')}
          ${player('caviar-tasting')}
        </div>
      </section>

      <section id="fish" class="cp-scene cp-fish dialogue-section dialogue-dark" tabindex="-1" aria-labelledby="fish-title">
        <div class="cp-scene-heading">${title('fish')}</div>
        <div class="cp-fish-layout">
          <div class="cp-fish-reply">
            ${question('А рыбу к ужину?')}
            ${paragraph('Можно и пожарить, и посолить.','cp-answer')}
            ${paragraph('Стейки — на сковороду. Филе — посолить. Голову и обрезь — на бульон.')}
          </div>
          ${fishPicture}
          <div class="cp-cutting">${player('fish-cutting')}</div>
        </div>
        <div class="cp-work">
          ${question('Ты сам этим занимаешься?')}
          <div class="cp-voices">
            ${voice('fish-start','Сначала меня увлекли рыбные ряды. Захотелось самому работать с рыбой и ножом.')}
            ${voice('fish-work','А здесь мы уже на складе. Режем, вакуумируем, солим сёмгу и форель.')}
          </div>
        </div>
      </section>

      <section id="seafood" class="cp-scene cp-seafood dialogue-section" tabindex="-1" aria-labelledby="seafood-title">
        <div class="cp-scene-heading">${title('seafood')}</div>
        <div class="cp-crab-layout">
          <div class="cp-crab-reply">
            ${question('А что ещё к столу?')}
            ${paragraph('Крупные куски — к столу. Опилио — в салат.','cp-answer')}
            ${paragraph('А здесь показываю салатное мясо и другие продукты. Запись из июня 2026-го.')}
          </div>
          <div class="cp-product cp-crab-product">${player('crab')}</div>
          <div class="cp-crab-tasting">${player('crab-table')}</div>
        </div>
        <div class="cp-shells">
          ${question('А кроме краба?')}
          <div class="cp-shells-grid">
            <article class="cp-shell">
              <h3>Гребешок из Сахалина</h3>
              ${paragraph('Приехал ещё в раковине. Сейчас откроем и посмотрим внутрь.')}
              ${player('scallop')}
            </article>
            <article class="cp-shell">
              <h3>Икра морского ежа</h3>
              ${paragraph('Уже в баночках по 100 г. Показываю, как эта партия приехала в термоупаковке.')}
              ${player('urchin')}
            </article>
          </div>
        </div>
      </section>

      <section id="counter" class="cp-scene cp-counter dialogue-section dialogue-dark" tabindex="-1" aria-labelledby="counter-title">
        <div class="cp-scene-heading">${title('counter')}</div>
        <div class="cp-counter-layout">
          <div class="cp-counter-reply">
            ${question('А сам готовишь?')}
            ${paragraph('Собраться и приготовить — люблю.','cp-answer')}
            ${voice('with-yakov','Здесь мы с поваром Яковом пробуем рыбу на огне и обсуждаем чавычу перед событием 12 июня 2026-го.')}
          </div>
          <div class="cp-product cp-counter-product">
            ${paragraph('А потом — снова за рыбой. Полный прилавок и вот такое настроение.','cp-product-answer')}
            ${player('counter')}
          </div>
        </div>
      </section>
    </main>${footer.outerHTML}`;
  };
  document.addEventListener('keydown',()=>document.documentElement.classList.add('cp-keyboard'),{capture:true});
  document.addEventListener('pointerdown',()=>document.documentElement.classList.remove('cp-keyboard'),{capture:true});
})();
