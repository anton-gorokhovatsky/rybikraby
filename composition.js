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
    const reference=(url,label)=>`<a class="row-reference" href="${url}" target="_blank" rel="noopener"><span class="row-link-label">${prose(label)}</span><span aria-hidden="true">↗</span></a>`;
    const hero=root.querySelector('.row-hero').outerHTML;
    const header=root.querySelector('.row-header').outerHTML;
    const lots=root.querySelector('.row-lots').outerHTML;
    const fishPicture=root.querySelector('.dialogue-fish-picture').outerHTML;
    const footer=root.querySelector('.dialogue-footer');
    return `${header}<main id="main" class="row-main" tabindex="-1">${hero}
      <section id="caviar" class="cp-scene cp-caviar row-caviar" tabindex="-1" aria-labelledby="caviar-title">
        <div class="cp-caviar-copy">
          ${title('caviar')}
          ${paragraph('Начнём со вкуса.','cp-answer')}
          ${lots}
          <a class="row-reference cp-source" href="https://t.me/ikrabov/190" target="_blank" rel="noopener"><span class="row-link-label">О различиях — в канале</span> <span aria-hidden="true">↗</span></a>
        </div>
        <div class="cp-caviar-conversation">
          <div class="cp-exchange">
            ${question('А если я не разбираюсь?')}
            ${voice('caviar-choice','Я пробую икру сам. Подберём по соли, консистенции и твоему бюджету.')}
          </div>
          <div class="cp-product cp-caviar-product">
            <div class="cp-story-intro">
              <h3 class="cp-story-heading">${prose('Первые девять килограммов')}</h3>
              ${paragraph('4 июня 2026-го в канале сообщили о первой икре нерки с Камчатки. В июньском видео Юра пробует новую нерку уже в Москве.','cp-product-answer')}
              <div class="cp-story-sources">${reference('https://t.me/ikrabov/192','Начало сезона в канале')}</div>
            </div>
            ${player('caviar-tasting')}
          </div>
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
          <div class="cp-cutting">
            <p class="cp-cutting-label">Как Юра разделывает сёмгу</p>
            ${player('fish-cutting')}
          </div>
          ${fishPicture}
        </div>
        <div class="cp-work">
          <div class="cp-work-story">
            ${question('Ты сам этим занимаешься?')}
            <blockquote class="cp-answer">${prose('«Меня так прёт от этого»')}</blockquote>
            <p class="cp-story-attribution">${reference('https://t.me/ikrabov/90','Юра, декабрь 2024')}</p>
            ${paragraph('Всё началось с запаха корюшки в майском Петербурге. Спустя несколько лет Юра увлёкся работой рыбных рядов и пошёл учиться разделке.')}
            ${paragraph('В январе 2025-го объявил себе челлендж: почистить и разделать пятьдесят рыб своими руками. В канале остались первые попытки и рабочие дни на складе.')}
            <div class="cp-story-sources">
              ${reference('https://t.me/ikrabov/41','Первая корюшка')}
              ${reference('https://t.me/ikrabov/108','Челлендж на пятьдесят рыб')}
            </div>
          </div>
          <div class="cp-voices">
            ${voice('fish-start','Декабрь 2024-го. Решение самому заняться охлаждённой рыбой.')}
            ${voice('fish-work','Январь 2025-го. Уже на складе: режем, вакуумируем, солим.')}
          </div>
        </div>
      </section>

      <section id="seafood" class="cp-scene cp-seafood dialogue-section" tabindex="-1" aria-labelledby="seafood-title">
        <div class="cp-scene-heading">${title('seafood')}</div>
        <div class="cp-crab-layout">
          <div class="cp-crab-reply">
            ${question('А что ещё к столу?')}
            ${paragraph('Крупные куски — к столу. Опилио — в салат.','cp-answer')}
          </div>
          <div class="cp-product cp-crab-product">${player('crab')}</div>
          <div class="cp-crab-tasting">
            ${paragraph('Для салата Юра предлагает мясо опилио — уже без панциря. В этой июньской записи 2026-го показывает его рядом с фалангами.','cp-product-answer')}
            ${player('crab-table')}
          </div>
        </div>
        <div class="cp-shells">
          ${question('А кроме краба?')}
          <div class="cp-shells-grid">
            <article class="cp-shell">
              <h3>Гребешок с Сахалина</h3>
              ${paragraph('Юра открывает раковину — и говорит о запахе, который жаль не передать через экран. Этот гребешок приехал с Сахалина.')}
              ${player('scallop')}
            </article>
            <article class="cp-shell">
              <h3>Икра морского ежа</h3>
              ${paragraph('К моменту обзора Юра уже попробовал икру, а ребята за кадром успели съесть по баночке. Потом он показывает термокоробку, в которой приехала эта партия.')}
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
            ${paragraph('Сначала пробуем вместе.','cp-answer')}
            ${voice('with-yakov','Июнь 2026-го. Юра и повар Яков собрались пробовать рыбу на мангале и обсуждать меню с чавычей для вечера с музыкой.')}
            <aside class="cp-supper-note">
              <h3 class="cp-story-heading">${prose('Крабовый ужин с музыкой')}</h3>
              ${paragraph('В приглашении на мартовский ужин 2025-го — повар Вячеслав Китушин, жюльен, салат и подкопчённые фаланги. К еде — музыка от диджея.')}
              <div class="cp-story-sources">${reference('https://t.me/ikrabov/122','Приглашение на крабовый ужин')}</div>
            </aside>
          </div>
          <div class="cp-product cp-counter-product">
            <div class="cp-story-intro">
              <h3 class="cp-story-heading">${prose('У прилавка — свой саундтрек')}</h3>
              ${paragraph('Рыбный обзор превращается в маленький музыкальный номер. Четырнадцать секунд Юриного настроения.','cp-product-answer')}
            </div>
            ${player('counter')}
          </div>
        </div>
      </section>
    </main>${footer.outerHTML}`;
  };
  document.addEventListener('keydown',()=>document.documentElement.classList.add('cp-keyboard'),{capture:true});
  document.addEventListener('pointerdown',()=>document.documentElement.classList.remove('cp-keyboard'),{capture:true});
})();
