/* Third version: product, Oks lettering and Yuri. */
function rowTypograph(text) {
  const shortWord = /(^|\s)([ВвСсКкУуОоИиАа]|[Пп]о|[Нн]а|[Ии]з|[Зз]а|[Сс]о|[Оо]т|[Дд]о|[Нн]е|[Нн]о|[Оо]б|[Пп]од|[Пп]ри|[Дд]ля|[Бб]ез|[Нн]ад|[Пп]еред|[Чч]ерез|[Мм]ежду)[ \t]+(?=\S)/g;
  return text.replace(shortWord,'$1$2\u00a0').replace(shortWord,'$1$2\u00a0').replace(/[ \t]+—[ \t]+/g,'\u00a0— ');
}

function tokyoRow({products, contactUrl}) {
  const lettering = (key, text) => {
    const art = oksLettering[key];
    return `<span class="row-lettering" style="--lettering-width:${art.inkWidth/1000}"><span class="row-readable">${text}</span><svg viewBox="${art.inkLeft} 0 ${art.inkWidth} 1000" aria-hidden="true" focusable="false"><path d="${art.path}" fill="currentColor"/></svg></span>`;
  };
  const arrow = '<span aria-hidden="true">↗</span>';
  const player = ({id, label, src, poster, source, date, duration, round=false, captions=''}) => `
    <figure class="row-player ${round?'row-player-round':''}" data-market-player data-duration="${duration}">
      <div class="row-player-picture">
        <video id="${id}" controls playsinline preload="none" poster="assets/${poster}" width="${round?400:720}" height="${round?400:1280}" aria-label="${label}">
          <source src="assets/${src}" type="video/mp4">
          ${captions?`<track kind="captions" src="assets/${captions}" srclang="ru" label="Русский, автоматические субтитры" default>`:''}
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
          <output class="row-player-time" aria-label="Время видео" aria-live="off"><span data-elapsed>00:00</span><span aria-hidden="true"> / </span><span data-total>${String(Math.floor(duration/60)).padStart(2,'0')}:${String(Math.floor(duration%60)).padStart(2,'0')}</span></output>
          <button class="row-sound" type="button" data-sound aria-controls="${id}" aria-label="Звук: ${label}" aria-pressed="true">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/><path class="sound-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="sound-off" d="m16 9 5 6m0-6-5 6"/></svg>
          </button>
        </div>
        <input class="row-player-seek" type="range" min="0" max="${duration}" step="0.1" value="0" aria-label="Позиция: ${label}" aria-controls="${id}" disabled>
        <p class="row-player-status" role="status" aria-live="polite"></p>
      </div>
      <figcaption class="row-player-meta"><a class="row-reference" href="${source}" target="_blank" rel="noopener" aria-label="Архив, оригинал видео в Telegram: ${label}, ${date}"><span data-player-caption>Архив · ${date}</span>&nbsp;${arrow}</a>${captions?`<button class="row-caption-toggle" type="button" data-captions aria-label="Автоматические субтитры: ${label}" aria-controls="${id}-captions" aria-pressed="true" hidden><span aria-hidden="true">CC</span></button>`:''}</figcaption>
      ${captions?`<p class="row-player-subtitles" id="${id}-captions" data-subtitles aria-live="off" hidden></p>`:''}
    </figure>`;
  const stories = {
    hello:{duration:59.585521,round:true,source:'https://t.me/ikrabov/148',date:'17.10.2025',title:'Рыба, икра и крабы'},
    'caviar-choice':{duration:49.450521,round:true,source:'https://t.me/ikrabov/149',date:'17.10.2025',title:'Теперь — соль и бюджет',copy:'Вид рыбы — только начало. У разных партий отличаются соль и консистенция. Юра пробует икру сам и подбирает варианты под разный бюджет.'},
    'caviar-tasting':{duration:60.054583,source:'https://t.me/Yuraikra/s/776',date:'09.06.2026',title:'Поэтому сначала пробуем',copy:'Июнь 2026-го: первая нерка нового сезона. Юра открывает банку, пробует соль и показывает зерно.'},
    'fish-start':{duration:57.695062,round:true,source:'https://t.me/ikrabov/88',date:'21.12.2024',title:'Всё началось с рынка',copy:'В декабре 2024-го Юра насмотрелся на работу рыбных рядов и решил сам заняться охлаждённой рыбой. Хотелось работать руками — с рыбой и ножом.'},
    'fish-work':{duration:31.515854,round:true,source:'https://t.me/ikrabov/107',date:'13.01.2025',title:'В январе — уже на складе',copy:'После декабрьского решения — первые рабочие дни с сёмгой и форелью. Теперь рыбу режут, вакуумируют и солят.'},
    'fish-cutting':{duration:23.7,source:'https://t.me/ikrabov/112',date:'25.01.2025',title:'Одна сёмга — несколько блюд',copy:'Стейки — пожарить. Филе — посолить. Голову и обрезь — на бульон. На фото Юра сам разложил и подписал части рыбы: с будущего блюда и стоит начинать выбор.',captions:false},
    'crab-table':{duration:38.44625,source:'https://t.me/Yuraikra/s/777',date:'09.06.2026',title:'А для салата — мясо опилио',copy:'Кроме крупных кусков, есть салатное мясо. В этой записи Юра показывает опилио и рассказывает об ассортименте. Цена и условия относятся к июню 2026 года.'},
    scallop:{duration:60.066667,source:'https://t.me/Yuraikra/s/761',date:'18.04.2026',title:'Теперь откроем гребешка',copy:'Он приехал с Сахалина ещё в раковине. Юра открывает одну прямо на складе — можно разглядеть продукт до приготовления.'},
    urchin:{duration:38.2,source:'https://t.me/ikrabov/179',date:'02.04.2026',title:'А у ежа — своя икра',copy:'Здесь икра уже в баночках по 100 г. Юра показывает термоупаковку, в которой приехала апрельская партия.'},
    crab:{duration:6.333333,source:'https://t.me/ikrabov/57',date:'11.11.2024',title:'Краб — крупным планом',copy:'Для подачи крупными кусками и для салата можно выбирать разное мясо.'},
    'with-yakov':{duration:55.97,round:true,source:'https://t.me/ikrabov/197',date:'07.06.2026',title:'Со склада — к грилю',copy:'Вместе с поваром Яковом Юра пробует рыбу на огне и обсуждает блюда с чавычей. Готовятся к событию 12 июня 2026-го.'},
    counter:{duration:14.233333,source:'https://t.me/ikrabov/217',date:'14.10.2026',title:'И снова — за рыбой',copy:'Осенью — обратно на склад. Рыба, полный прилавок и Юра со своим настроением.'}
  };
  const storyPlayer = key => {
    const s=stories[key];
    return player({id:`story-${key}`,label:s.title,src:`dialogue/${key}.mp4`,poster:`dialogue/${key}.jpg`,source:s.source,date:s.date,duration:s.duration,round:s.round,captions:s.captions===false?'':`dialogue/${key}.ru.vtt`});
  };
  const story = key => `<article class="dialogue-story">${storyPlayer(key)}<div class="dialogue-story-copy"><h3>${stories[key].title}</h3>${stories[key].copy?`<p>${stories[key].copy}</p>`:''}</div></article>`;
  return `
    <header class="site-header row-header">
      <a class="wordmark" href="#main" aria-label="Рыба и крабы, начало">РЫБА И КРАБЫ</a>
      <nav aria-label="Навигация сайта"><a href="#caviar">Икра</a><a href="#fish">Рыба</a><a class="button header-contact" href="${contactUrl}" target="_blank" rel="noopener">Написать Юре <span aria-hidden="true">↗</span></a></nav>
    </header>
    <main id="main" class="row-main" tabindex="-1">
      <section class="row-hero dialogue-hero" aria-labelledby="hero-title">
        <img class="row-hero-image" src="assets/caviar-grain.jpg" width="600" height="800" alt="Красная икра крупным планом — фотография из канала «Рыба и крабы»" fetchpriority="high">
        <div class="row-hero-top"><span>Розница и опт</span><span>Москва</span></div>
        <div class="row-hero-content">
          <h1 id="hero-title"><span>${lettering('fish','Рыба')}</span> <span>${lettering('crabs','и&nbsp;крабы')}</span></h1>
          <div class="dialogue-intro">
            <aside class="row-yura" aria-label="Юра о рыбе и икре">${storyPlayer('hello')}</aside>
            <div class="dialogue-greeting"><p class="dialogue-hello">Привет, мой друг.</p><p>Я Юра. Помогу выбрать рыбу, икру и крабов к твоему столу.</p></div>
            <a class="dialogue-reply dialogue-start" href="#caviar">Какую икру взять? <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>
      <section class="row-caviar dialogue-caviar" id="caviar" tabindex="-1" aria-labelledby="caviar-title">
        <div class="row-section-heading"><h2 id="caviar-title">${lettering('caviar','Красная икра')}</h2><a class="row-reference" href="https://t.me/ikrabov/190" target="_blank" rel="noopener">О различиях — в канале ${arrow}</a></div>
        <p class="dialogue-question">Начнём со вкуса.</p>
        <div class="row-lots">
          ${products.map(p=>`<article class="row-lot"><h3>${lettering(p.id,p.name)}</h3><dl><div><dt class="row-readable">Зерно</dt><dd>${p.grain} зерно</dd></div><div><dt class="row-readable">Вкус</dt><dd>${p.flavor}</dd></div></dl></article>`).join('')}
        </div>
        <div class="dialogue-stories">${story('caviar-choice')}${story('caviar-tasting')}</div>
        <div class="dialogue-turn"><a class="dialogue-reply" href="#fish">А рыбу к ужину? <span aria-hidden="true">↓</span></a></div>
      </section>
      <section class="dialogue-section dialogue-dark" id="fish" tabindex="-1" aria-labelledby="fish-title">
        <div class="dialogue-section-copy"><h2 id="fish-title">${lettering('fish','Рыба')}</h2><p class="dialogue-question">Тогда решим, что готовим.</p><p>Пожарить, посолить или сварить? От блюда зависит, какую часть рыбы выбрать.</p></div>
        <div class="dialogue-stories">${story('fish-start')}${story('fish-work')}</div>
        <div class="dialogue-fish-cutting">
          ${story('fish-cutting')}
          <figure class="dialogue-fish-picture"><img src="assets/dialogue/one-fish-three-uses.jpg" width="834" height="1030" alt="Разделанная сёмга в лотках. Подписи Юры: «Это пожарить» возле стейков, «Это посолить» возле филе, «Это сварить» возле головы и обрези." loading="lazy"><figcaption><a class="row-reference" href="https://t.me/Yuraikra" target="_blank" rel="noopener">Из истории Юры · 14.01.2025 ${arrow}</a></figcaption></figure>
        </div>
        <div class="dialogue-turn"><a class="dialogue-reply" href="#seafood">А что ещё к столу? <span aria-hidden="true">↓</span></a></div>
      </section>
      <section class="dialogue-section" id="seafood" tabindex="-1" aria-labelledby="seafood-title">
        <div class="dialogue-section-copy"><h2 id="seafood-title">${lettering('crabs','И крабы')}</h2></div>
        <div class="dialogue-stories">${story('crab')}${story('crab-table')}${story('scallop')}${story('urchin')}</div>
        <div class="dialogue-turn"><a class="dialogue-reply" href="#counter">А сам готовишь? <span aria-hidden="true">↓</span></a></div>
      </section>
      <section class="dialogue-section dialogue-dark" id="counter" tabindex="-1" aria-labelledby="counter-title">
        <div class="dialogue-section-copy"><h2 id="counter-title">${lettering('counter','За прилавком')}</h2><p class="dialogue-question">Собраться и приготовить.</p></div>
        <div class="dialogue-stories">${story('with-yakov')}${story('counter')}</div>
      </section>
    </main>
    <footer class="row-footer dialogue-footer" id="contact" tabindex="-1" aria-labelledby="contact-title">
      <div class="dialogue-footer-conversation">
        <div class="dialogue-footer-order"><h2 id="contact-title">Что приготовим?</h2><p>Напиши, что хочется к столу, на сколько человек и к какому дню. С Юрой обсудите наличие, фасовку, цену и получение.</p><a class="dialogue-footer-link" href="${contactUrl}" target="_blank" rel="noopener"><span>Написать Юре</span> ${arrow}</a></div>
        <div class="dialogue-footer-channel"><h3>Поступления и дегустации</h3><a class="row-order-link" href="https://t.me/ikrabov" target="_blank" rel="noopener">Читать @ikrabov ${arrow}</a></div>
      </div>
      <p class="dialogue-footer-brand"><span>${lettering('fish','Рыба')}</span> <span>${lettering('crabs','и&nbsp;крабы')}</span></p>
      <div class="dialogue-footer-meta"><p>Москва · розница и опт</p><a class="row-reference" href="#main">К началу <span aria-hidden="true">↑</span></a></div>
    </footer>`;
}
