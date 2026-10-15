/* A separate composition. The earlier Tokyo variants remain in app.js. */
function rowTypograph(text) {
  const shortWord = /(^|\s)([ВвСсКкУуОоИиАа]|[Пп]о|[Нн]а|[Ии]з|[Зз]а|[Сс]о|[Оо]т|[Дд]о|[Нн]е|[Нн]о|[Оо]б|[Пп]од|[Пп]ри|[Дд]ля|[Бб]ез|[Нн]ад|[Пп]еред|[Чч]ерез|[Мм]ежду)[ \t]+(?=\S)/g;
  return text.replace(shortWord,'$1$2\u00a0').replace(shortWord,'$1$2\u00a0').replace(/[ \t]+—[ \t]+/g,'\u00a0— ');
}

function tokyoRow({products, orderButton, footer}) {
  const lettering = (key, text) => {
    const art = oksLettering[key];
    return `<span class="row-lettering" style="--lettering-width:${art.width/1000}"><span class="row-readable">${text}</span><svg viewBox="0 0 ${art.width} 1000" aria-hidden="true" focusable="false"><path d="${art.path}" fill="currentColor"/></svg></span>`;
  };
  const arrow = '<span aria-hidden="true">↗</span>';
  const player = ({id, label, src, poster, source, date, duration, round=false, captions=''}) => `
    <figure class="row-player ${round?'row-player-round':''}" data-market-player data-duration="${duration}">
      <div class="row-player-picture">
        <video id="${id}" controls playsinline preload="none" poster="assets/${poster}" width="${round?400:720}" height="${round?400:1280}" aria-label="${label}">
          <source src="assets/${src}" type="video/mp4">
          ${captions?`<track kind="captions" src="assets/${captions}" srclang="ru" label="Русский" default>`:''}
          <a href="${source}">Посмотреть видео в Telegram</a>
        </video>
      </div>
      <div class="row-player-controls" hidden>
        <div class="row-player-buttons">
          <button class="row-play" type="button" data-play aria-controls="${id}" aria-label="Смотреть: ${label}">
            <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3"/></svg>
            <svg class="icon-replay" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8a8 8 0 1 1-1 7M5 3v5h5"/></svg>
          </button>
          <output class="row-player-time" aria-label="Время видео" aria-live="off"><span data-elapsed>00:00</span><span aria-hidden="true"> / </span><span data-total>${duration>50?'00:58':'00:14'}</span></output>
          <button class="row-sound" type="button" data-sound aria-controls="${id}" aria-label="Звук: ${label}" aria-pressed="true">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/><path class="sound-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="sound-off" d="m16 9 5 6m0-6-5 6"/></svg>
          </button>
        </div>
        <input class="row-player-seek" type="range" min="0" max="${duration}" step="0.1" value="0" aria-label="Позиция: ${label}" aria-controls="${id}" disabled>
        <p class="row-player-status" role="status" aria-live="polite"></p>
      </div>
      <figcaption class="row-player-meta"><a class="row-reference" href="${source}" target="_blank" rel="noopener" aria-label="Оригинал видео в Telegram: ${label}"><span data-player-caption>${round?'Архив · ':''}${date}</span>&nbsp;${arrow}</a>${captions?`<button class="row-caption-toggle" type="button" data-captions aria-label="Субтитры: ${label}" aria-controls="${id}-captions" aria-pressed="true" hidden><span aria-hidden="true">CC</span></button>`:''}</figcaption>
      ${captions?`<p class="row-player-subtitles" id="${id}-captions" data-subtitles aria-live="off" hidden></p>`:''}
    </figure>`;
  return `
    <header class="site-header row-header">
      <a class="wordmark" href="#main" aria-label="Рыба и крабы, начало">РЫБА И КРАБЫ</a>
      <nav aria-label="Навигация сайта"><a href="#caviar">Икра</a><a href="#guide">За прилавком</a>${orderButton('question','Написать Юре','header-contact')}</nav>
    </header>
    <main id="main" class="row-main" tabindex="-1">
      <section class="row-hero" aria-labelledby="hero-title">
        <img class="row-hero-image" src="assets/caviar-grain.jpg" width="600" height="800" alt="Красная икра крупным планом — фотография из канала «Рыба и крабы»" fetchpriority="high">
        <div class="row-hero-top"><span>Розница и опт</span><span>Москва</span></div>
        <div class="row-hero-content">
          <div class="row-hero-copy"><h1 id="hero-title"><span>${lettering('fish','Рыба')}</span> <span>${lettering('crabs','и&nbsp;крабы')}</span></h1><div class="row-hero-start"><a class="button" href="#caviar">Выбрать икру <span aria-hidden="true">↓</span></a></div></div>
          <aside class="row-yura" aria-label="Видеосообщение Юры">${player({id:'row-yura-video',label:'Юра, архивное видео от 30 мая 2026 года',src:'yura-message.mp4',poster:'yura-message.jpg',source:'https://t.me/ikrabov/185',date:'30.05.2026',duration:58.31,round:true,captions:'yura-message.ru.vtt'})}</aside>
        </div>
      </section>
      <section class="row-caviar" id="caviar" tabindex="-1" aria-labelledby="caviar-title">
        <div class="row-section-heading"><h2 id="caviar-title">${lettering('caviar','Красная икра')}</h2><div class="row-section-intro"><p class="row-availability">Наличие, фасовку и цену уточним перед заказом.</p><a class="row-reference" href="https://t.me/ikrabov/190" target="_blank" rel="noopener">О вкусах — в канале ${arrow}</a></div></div>
        <div class="row-lots">
          <div class="row-lots-labels" aria-hidden="true"><span></span><span>Зерно</span><span>Вкус</span></div>
          ${products.map(p=>`<article class="row-lot"><div class="row-lot-name"><h3>${lettering(p.id,p.name)}</h3></div><dl><div><dt>Зерно</dt><dd>${p.grain}</dd></div><div><dt>Вкус</dt><dd>${p.flavor}</dd></div></dl>${orderButton(p.id,'Выбрать','','Выбрать '+p.title.replace('Икра','икру'))}</article>`).join('')}
        </div>
        <div class="row-caviar-help">${orderButton('help','Помогите выбрать')}</div>
      </section>
      <section class="row-guide" id="guide" tabindex="-1" aria-labelledby="guide-title">
        <h2 id="guide-title">${lettering('counter','За&nbsp;прилавком')}</h2>
        <div class="row-counter">${player({id:'row-counter-video',label:'Прилавок, видео от 14 октября 2026 года',src:'market-counter.mp4',poster:'market-counter-frame.png',source:'https://t.me/ikrabov/217',date:'14.10.2026',duration:14.23})}</div>
        <div class="row-guide-action"><p>Расскажите, что любите и что собираетесь приготовить.</p>${orderButton('question','Написать Юре','primary')}</div>
      </section>
    </main>${footer('РЫБА И КРАБЫ',true)}`;
}
