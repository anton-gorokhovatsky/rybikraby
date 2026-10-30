/* One editorial accent at a time; the year-round offer stays in every edition. */
(() => {
  'use strict';
  const accepted = tokyoRow;
  // Selected by an editor after checking the offer. Query overrides are visitor
  // previews, not a signal of stock or an automatic fishing calendar.
  const currentAccent = 'autumn';
  const accents = {
    autumn: {
      start: 'Икру к выходным?', first: 'caviar',
      caviar: 'Икра к завтраку.',
      caviarCopy: 'На хлеб с маслом, к блинам или просто ложкой. Начнём с того, какой вкус тебе нравится.',
      choice: 'А какую взять?', fish: 'А рыбу к ужину?', crab: 'А как подать краба?',
      contact: 'Что к столу?',
      contactCopy: 'Напиши, что хочется к столу, на сколько человек и к какому дню. С Юрой обсудите наличие, фасовку, цену и получение.',
      contactLink: 'Написать Юре'
    },
    newyear: {
      start: 'Что к новогоднему столу?', first: 'caviar',
      caviar: 'Начнём с икры.',
      caviarCopy: 'Кто-то любит нежную кету, кто-то — нерку с горчинкой. Выберем под тех, кто соберётся за столом.',
      choice: 'У всех разные вкусы. Как выбрать?',
      fish: 'А рыбу можно посолить?', crab: 'А в салат — настоящего краба?',
      contact: 'Что к Новому году?',
      contactCopy: 'Расскажи, сколько вас будет, что хочется приготовить и к какому дню всё нужно. С Юрой обсудите количество, наличие, цену и получение.',
      contactLink: 'Обсудить стол с Юрой'
    },
    winter: {
      start: 'Рыбу к домашнему ужину?', first: 'fish',
      caviar: 'А к блинам — икру.',
      caviarCopy: 'Праздники прошли, любимый вкус остался. Выбирай по зерну, соли и тому, как любишь есть икру.',
      choice: 'А какую взять?', fish: 'Что приготовим дома?', crab: 'А краба можно в салат?',
      contact: 'Рыбу к ужину?',
      contactCopy: 'Напиши, что любишь и что собираешься готовить. С Юрой обсудите подходящую рыбу, икру или краба, наличие и получение.',
      contactLink: 'Написать Юре'
    },
    spring: {
      start: 'А корюшка?', first: 'fish',
      caviar: 'А если хочется икры?',
      caviarCopy: 'Нерка, горбуша или кета — выбираем по вкусу. Наличие конкретной партии и фасовку обсудим в Telegram.',
      choice: 'А какую взять?', fish: 'А кроме корюшки?', crab: 'А что ещё к столу?',
      contact: 'Корюшку к столу?',
      contactCopy: 'Спроси Юру о ближайшем поступлении корюшки. А если хочется рыбы, икры или краба — обсудите и их.',
      contactLink: 'Спросить Юру'
    },
    summer: {
      start: 'Что за первая нерка?', first: 'caviar',
      caviar: 'Сначала — проба новой икры нерки.',
      caviarCopy: '',
      choice: 'А если я не разбираюсь?', fish: 'А рыбу на огонь?', crab: 'А что ещё для общего стола?',
      contact: 'Что пробуем?',
      contactCopy: 'Спроси Юру о новой партии или расскажи, что хочется приготовить. Наличие, фасовку, цену и получение обсудите в Telegram.',
      contactLink: 'Написать Юре'
    }
  };
  const requested = new URLSearchParams(location.search).get('accent');
  const key = Object.hasOwn(accents, requested) ? requested : currentAccent;
  const accent = accents[key];
  document.body.dataset.seasonal = key;
  const text = value => rowTypograph(value).replace(/(\d)-(го|й)(?=[\s.,!?]|$)/g, '$1\u2011$2');
  const link = (url, label) => {
    const dated = label.match(/^(.*?) · (\d{2})\.(\d{2})\.(\d{4})$/);
    const content = dated ? `<span class="row-reference-title">${text(dated[1])}</span><time datetime="${dated[4]}-${dated[3]}-${dated[2]}">${dated[2]}.${dated[3]}.${dated[4]}</time>` : text(label);
    return `<a class="row-reference${dated ? ' row-reference-dated' : ''}" href="${url}" target="_blank" rel="noopener"><span class="row-link-label">${content}</span> <span aria-hidden="true">↗</span></a>`;
  };

  // These are attributed editorial readings, separate from Yuri's own words
  // and the dated history of each product. No borrowed translation is quoted.
  const tasteReadings = {
    autumn: {
      title: 'Сначала — рассмотреть.',
      body: 'У Танидзаки поднимают крышку тёмной лаковой чаши: белый рис, облако пара. Ещё не попробовал, а вкус уже занимает всё внимание. С икрой тоже хочется задержаться на этом мгновении: посмотреть на свет в зерне, набрать немного на ложку. И только потом — попробовать.',
      source: 'Танидзаки, «Похвала тени»',
      url: 'https://tricycle.org/magazine/tasting-darkness/'
    },
    summer: {
      title: 'А день уже стал лучше.',
      body: 'Первую ложку новой икры хочется попробовать не спеша. Соль и зерно можно обсудить чуть позже. У Хемингуэя устрицы и белое вино тоже меняют настроение: морской вкус, холодный глоток — и вместо усталости уже хочется строить планы.',
      source: 'Хемингуэй, «Праздник, который всегда с тобой»',
      url: 'https://www.simonandschuster.com/books/A-Moveable-Feast/Ernest-Hemingway/9780684824994'
    },
    winter: {
      title: 'Пока пекутся блины.',
      body: 'У Шмелёва Масленица приходит с оттепелью, запахом берёзового дыма и блинов. На столе — сёмга и икра, вокруг — знакомые голоса. В такой памяти остаётся и вкус, и человек, который переворачивал блины у плиты. А у вас кто их печёт?',
      source: 'Шмелёв, «Лето Господне», «Масленица»',
      url: 'https://ru.wikisource.org/wiki/Лето_Господне_(Шмелёв)'
    },
    newyear: {
      title: 'Проголодаться от разговора.',
      body: 'В чеховской «Сирене» секретарь рассказывает о селёдке, кулебяке и стерляди. Председатель портит лист за листом, слушатели не выдерживают и уезжают обедать. Еды ещё нет перед глазами, а разговор уже сделал своё дело.',
      source: 'Чехов, «Сирена»',
      url: 'https://ru.wikisource.org/wiki/Сирена_(Чехов)'
    }
  };
  tasteReadings.spring = tasteReadings.autumn;
  const cookingReadings = {
    autumn: {
      title: 'Море и земля — в одной кастрюле.',
      body: 'У Неруды рыба проходит путь от штормового чилийского моря до кухни. Чеснок, золотистый лук, креветки; в конце — сливки. В его оде рыбной похлёбке к столу приходят вместе вкусы моря и земли.',
      continuation: 'У сёмги на нашей кухне будет свой путь. Пока филе солится, из головы и обрези можно варить бульон. Запотевает окно, пахнет луком. Пробуешь с ложки — и решаешь, добавить ли ещё перца.',
      source: 'Пабло Неруда, ода рыбной похлёбке',
      url: 'https://cultura.fundacionneruda.org/2023/06/oda-al-caldillo-de-congrio/'
    },
    winter: {
      title: 'С мороза — к горячей миске.',
      body: 'В «Моби Дике» Измаил и Квикег приезжают на Нантакет замёрзшими и голодными. В трактире им подают похлёбку с моллюсками. Над мисками поднимается пар; друзья съедают всё и пробуют ещё одну — с треской.',
      continuation: 'В такой вечер хочется отогреть ладони, отломить хлеба и придвинуть миску поближе. Для домашнего рыбного супа пригодятся голова и обрезь сёмги. Пусть на плите тихо кипит, пока все добираются домой.',
      source: 'Мелвилл, «Моби Дик», глава «Похлёбка»',
      url: 'https://www.gutenberg.org/files/2701/2701-h/2701-h.htm#link2HCH0015'
    },
    spring: {
      title: 'Море тоже умеет светиться.',
      body: 'У Куприна в «Листригонах» ночью светится вода: за рыбой тянутся серебристые следы, вёсла оставляют сияющие полосы. Опускаешь руку за борт — и огоньки остаются на пальцах. Обычная рыбацкая ночь становится чудом.',
      continuation: 'У Куприна — Балаклава и ночная ловля. У Юры — Петербург и корюшка, пахнущая огурцами. Две разные истории о том, как рыба остаётся в памяти вместе с целым городом.',
      source: 'Куприн, «Листригоны», «Воровство»',
      url: 'https://lib.ru/LITRA/KUPRIN/listrygo.txt'
    }
  };
  cookingReadings.summer = cookingReadings.autumn;
  cookingReadings.newyear = cookingReadings.autumn;
  const tableReading = {
    title: 'Когда ужин — подарок.',
    body: 'Позвать людей за стол — это ещё и придумать, чем их порадовать. У Карен Бликсен Бабетта вкладывает в один ужин всё своё мастерство. Весь вечер — её работа, её вкус, её подарок людям, у которых она нашла дом.',
    source: 'Карен Бликсен, «Пир Бабетты»',
    url: 'https://litteratursiden.dk/analyser/blixen-karen-babettes-gaestebud'
  };
  const readingNote = (id, reading) => {
    const note = document.createElement('aside');
    note.className = 'season-reading-note';
    note.id = id;
    note.setAttribute('aria-labelledby', `${id}-title`);
    note.innerHTML = `<h3 id="${id}-title">${text(reading.title)}</h3><p>${text(reading.body)}</p>${link(reading.url, reading.source)}`;
    return note;
  };

  tokyoRow = options => {
    const page = document.createElement('template');
    page.innerHTML = accepted(options);
    const root = page.content;
    const setText = (selector, value) => { root.querySelector(selector).textContent = text(value); };
    const caviar = root.querySelector('#caviar');
    const fish = root.querySelector('#fish');
    const seafood = root.querySelector('#seafood');
    const start = root.querySelector('.dialogue-start');
    start.href = `#${accent.first}`;
    start.innerHTML = `<span aria-hidden="true">↓</span><span class="dialogue-action-label">${text(accent.start)}</span>`;
    setText('.cp-caviar-copy>.cp-answer', accent.caviar);
    if (accent.caviarCopy) {
      const note = document.createElement('p');
      note.className = 'cp-copy season-caviar-note';
      note.textContent = text(accent.caviarCopy);
      caviar.querySelector('.cp-caviar-copy>.cp-answer').after(note);
    }
    setText('.cp-caviar .cp-exchange>.cp-question', accent.choice);
    setText('.cp-fish-reply>.cp-question', accent.fish);
    setText('.cp-crab-reply>.cp-question', accent.crab);
    setText('#contact-title', accent.contact);
    setText('.dialogue-footer-order>p', accent.contactCopy);
    setText('.dialogue-footer-link .row-link-label', accent.contactLink);
    // A small invitation at the very end, not the visitor's main task.
    const seasons = document.createElement('div');
    seasons.id = 'seasons';
    seasons.className = 'season-switcher';
    seasons.innerHTML = `<p id="season-switcher-label">Заглянуть в другой сезон</p><nav aria-labelledby="season-switcher-label">${[
      ['spring','Весна'],['summer','Лето'],['autumn','Осень'],['newyear','Новый год'],['winter','Зима']
    ].map(([value,label]) => {
      const url = new URL(location.href);
      url.searchParams.set('accent',value);
      url.hash = 'seasons';
      return `<a href="${url.pathname}${url.search.replace(/&/g,'&amp;')}#seasons"${key === value ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('')}</nav>`;
    root.querySelector('.dialogue-footer-meta').after(seasons);
    // Change the entry and the conversation order, never hide the permanent offer.
    if (key === 'newyear') caviar.after(seafood);
    if (accent.first === 'fish') caviar.before(fish);

    if (key === 'spring') {
      setText('.cp-fish-reply>.cp-answer', 'Сёмгу — пожарить или посолить.');
      const art = seasonalLettering.smelt;
      const feature = document.createElement('div');
      feature.className = 'season-feature';
      feature.innerHTML = `<div class="season-feature-copy">
        <p class="cp-question">${text('Чем пахнет весна?')}</p>
        <h3 style="--season-lettering:${art.inkWidth / 1000}"><span class="row-lettering" style="--lettering-width:${art.inkWidth / 1000}"><span class="row-readable">Корюшка</span><svg viewBox="${art.inkLeft} 0 ${art.inkWidth} 1000" aria-hidden="true" focusable="false"><path d="${art.path}" fill="currentColor"/></svg></span></h3>
        <p class="cp-answer">${text('Та самая, что пахнет огурцами.')}</p>
        <p class="cp-copy">${text('С неё всё началось. В один майский день в Петербурге Юра почувствовал этот запах — в городе шёл сезон корюшки.')}</p>
        ${link('https://t.me/ikrabov/41', 'Как всё началось · 27.09.2024')}
      </div><figure class="season-photo">
        <a class="season-photo-link" href="assets/smelt-april-2026.jpg" target="_blank" rel="noopener" aria-label="Рассмотреть корюшку в полном размере — откроется в новой вкладке"><img src="assets/smelt-april-2026.jpg" width="720" height="1280" alt="Серебристая корюшка крупным планом — кадр из апрельской истории Юры." loading="lazy"></a>
        <figcaption>${link('https://t.me/Yuraikra/s/761', 'Из истории Юры · 18.04.2026')}</figcaption>
      </figure>`;
      fish.querySelector('.cp-scene-heading').after(feature);
      setText('.cp-work-story>.cp-question', 'И что было дальше?');
      setText('.cp-work-story>.cp-copy', 'В тот первый день Юра собрал заявок почти на семьдесят килограммов корюшки. Он ещё не держал рыбу в руках, но уже решил попробовать себя в рыбном деле.');
    }
    if (key === 'summer') {
      const tasting = caviar.querySelector('.cp-caviar-product');
      // The first tasting is the summer's principal story, rather than an
      // optional archive note in the other seasons.
      tasting.querySelector('.cp-video-note').open = true;
      const opening = document.createElement('div');
      opening.className = 'season-summer-opening';
      const copy = caviar.querySelector('.cp-caviar-copy');
      const comparison = document.createElement('div');
      comparison.className = 'season-comparison';
      comparison.append(copy.querySelector('.row-lots'), copy.querySelector('.cp-source'));
      // The same DOM reads as introduction, tasting, comparison. On a wide
      // screen the comparison still shares the text column beside the video.
      copy.append(tasting.querySelector('.cp-story-intro'));
      opening.append(copy, tasting, comparison);
      caviar.prepend(opening);
    }
    const tasteReading = readingNote('taste-reading', tasteReadings[key]);
    (key === 'summer' ? caviar.querySelector('.cp-caviar-conversation') : caviar.querySelector('.cp-caviar-product')).append(tasteReading);
    const fishPicture = root.querySelector('.dialogue-fish-picture');
    const uses = document.createElement('div');
    uses.className = 'fish-uses';
    uses.id = 'salmon-uses';
    uses.setAttribute('role', 'group');
    uses.setAttribute('aria-label', 'Одна сёмга — три способа приготовления');
    const servingDrawings = {
    steaks: {
      width:551,height:682,
      back:`
        <!-- The fish is a high raw pile. A wide, shallow oval pan supports
             its lower half; no contour tries to frame the whole photograph. -->
        <path d="M-24 406 C-9 326 100 262 252 259 C411 250 550 309 573 408 C600 514 514 628 353 669 C193 710 37 660 -11 556 C-31 512 -32 455 -24 406Z"/>
        <path class="serving-secondary" d="M-8 411 C12 340 115 284 254 281 C402 272 532 329 551 414 C573 505 494 607 347 646 C199 684 54 638 10 547 C-8 509 -15 456 -8 411Z"/>
        <path d="M-26 452 C-32 515 -13 582 39 628 C105 689 221 718 351 691 C490 663 575 577 579 479"/>
        <path class="serving-handle-long" d="M-24 414 C-37 392 -47 369 -53 349 L-113 221 C-120 206 -116 190 -103 184 C-89 177 -75 185 -68 200 L-9 329 C-1 347 8 361 20 370"/>
        <path class="serving-handle-long serving-secondary" d="M-98 205 C-104 208 -104 214 -101 222 L-89 248 C-85 256 -79 259 -74 256 C-69 253 -70 247 -73 240 L-85 214 C-88 207 -93 202 -98 205Z"/>
        <path class="serving-handle-short" d="M-13 395 L-17 151 C-24 133 -25 57 -19 33 C-16 18 -3 9 10 11 C27 13 35 26 33 43 L22 148 L16 365"/>
        <path class="serving-handle-short serving-secondary" d="M5 34 C-1 33 -5 39 -5 47 L-5 71 C-5 80 -2 86 4 87 C10 87 14 81 14 73 L16 48 C17 40 12 34 5 34Z"/>
        <path class="serving-secondary" d="M-16 382 C-7 377 1 374 10 374 M-18 396 C-8 391 1 388 10 389"/>
      `
    },
    fillets: {
      width:547,height:1349,
      back:`
        <path d="M277 -6 C393 -9 480 76 517 223 C548 347 553 507 548 680 C551 867 538 1068 494 1208 C456 1324 380 1374 273 1371 C153 1378 72 1320 33 1192 C-3 1074 -10 887 -7 690 C-10 502 -1 314 29 184 C59 59 149 -12 277 -6"/>
        <path class="serving-secondary" d="M124 66 C76 111 57 179 46 253 M31 891 C36 1010 46 1110 71 1190 C105 1293 167 1343 270 1344 C373 1351 442 1298 475 1198 C506 1101 519 966 522 837"/>
        <!-- A small preparation group at the open end of the dish:
             a pinch of coarse salt, three peppercorns and one dill sprig. -->
        <g class="serving-dill">
          <path d="M10 231 C28 188 47 143 89 55"/>
          <path d="M27 192 C19 176 14 162 11 151 M37 169 C26 152 22 136 20 123 M49 141 C40 124 37 108 38 96 M61 116 C57 98 59 82 63 72 M73 91 C75 72 82 57 91 46"/>
          <path d="M30 184 C41 180 51 172 58 163 M42 155 C54 151 64 143 72 134 M54 129 C67 124 79 116 86 105 M66 104 C79 98 89 90 96 81"/>
          <path class="serving-secondary" d="M11 151 l-7 -5 M11 151 l-1 -11 M20 123 l-8 -5 M20 123 l-1 -11 M38 96 l-7 -6 M38 96 l2 -11 M63 72 l-6 -8 M63 72 l7 -9 M91 46 l-1 -9 M91 46 l8 -6 M58 163 l9 -3 M58 163 l3 -9 M72 134 l10 -2 M72 134 l4 -8 M86 105 l10 -3 M86 105 l3 -9 M96 81 l9 -3 M96 81 l3 -9"/>
        </g>
        <g class="serving-salt">
          <path class="serving-salt-grain" d="M25 164 l8 -3 5 6 -4 7 -9 -2Z M39 157 l7 -4 7 5 -2 8 -9 1Z M41 173 l8 -5 6 7 -4 8 -8 -1Z M56 162 l6 -4 6 5 -2 7 -7 1Z M27 181 l6 -3 6 5 -3 7 -8 -1Z M55 185 l6 -3 5 5 -4 7 -6 -2Z"/>
          <path d="M23 151 l2 -3 M45 194 l2 -2 M66 179 l2 -3 M17 177 l2 -2"/>
        </g>
        <g class="serving-pepper">
          <path d="M112 59 C118 57 122 61 121 67 C120 73 114 75 109 72 C104 68 106 61 112 59Z M130 82 C136 82 139 87 136 92 C133 98 125 97 122 92 C120 87 124 82 130 82Z M110 95 C117 93 121 98 120 104 C118 111 111 113 106 109 C101 105 103 97 110 95Z"/>
          <path class="serving-secondary" d="M111 63 l3 5 M126 88 l5 2 M108 100 l5 6"/>
        </g>
      `
    },
    broth: {
      width:631,height:729,
      back:`
        <path d="M317 -2 C437 -5 540 56 589 169 C633 269 639 417 608 531 C573 661 471 735 330 746 C192 755 86 706 36 595 C-9 494 -6 342 23 227 C59 78 164 -5 317 -2"/>
        <path class="serving-secondary" d="M122 70 C173 38 238 18 316 20 C429 16 523 77 567 180"/>
        <path d="M28 213 C7 203 -14 204 -19 220 C-23 237 -20 270 -10 283 C-3 293 9 291 17 285 M591 172 C614 162 636 165 644 183 C652 200 655 228 647 240 C641 248 631 250 624 247"/>
        <path class="serving-secondary" d="M11 226 C-1 221 -7 223 -8 234 L-5 263 C-4 274 3 277 13 273 M602 184 C618 178 626 181 630 191 L636 219 C639 231 634 237 625 236"/>
        <path d="M9 421 C10 530 26 644 78 706 C130 766 229 782 329 779 C438 779 536 742 583 679 C614 638 628 559 631 462"/>
      `
    }
  };

    uses.innerHTML = [
      ['steaks', 'Пожарить', 'Стейки сёмги, извлечённые из фотографии Юры', 551, 682],
      ['broth', 'Сварить', 'Голова и обрезь сёмги для бульона', 631, 729],
      ['fillets', 'Посолить', 'Два куска филе сёмги из той же фотографии', 547, 1349]
    ].map(([part, label, alt, width, height]) => `<figure class="fish-use fish-use-${part}"><figcaption>${label}</figcaption><a href="assets/fish-${part}.png" target="_blank" rel="noopener" aria-label="${label}: рассмотреть рыбу в полном размере"><svg class="serving-drawing serving-drawing-${part}" viewBox="0 0 ${servingDrawings[part].width} ${servingDrawings[part].height}" aria-hidden="true" focusable="false">${servingDrawings[part].back}</svg><img src="assets/fish-${part}.png" width="${width}" height="${height}" alt="${alt}" loading="lazy"></a></figure>`).join('') + `<div class="fish-uses-source">${link('https://t.me/Yuraikra', 'Из истории Юры · 14.01.2025')}</div>`;
    fishPicture.replaceWith(uses);
    const cooking = cookingReadings[key];
    const story = document.createElement('aside');
    story.className = 'season-table-story';
    story.id = 'fish-table';
    story.setAttribute('aria-labelledby', 'fish-table-title');
    story.innerHTML = `<h3 id="fish-table-title">${text(cooking.title)}</h3>
      <div class="season-story-part">
        <p class="season-story-lead">${text(cooking.body)}</p>
        ${link(cooking.url, cooking.source)}
      </div>
      <div class="season-story-part"><p>${text(cooking.continuation)}</p></div>`;
    fish.querySelector('.cp-fish-layout').after(story);
    if (key === 'winter') {
      const biography=fish.querySelector('.cp-work');
      biography.classList.add('cp-work-after-table');
      story.after(biography);
    }
    root.querySelector('.cp-counter-reply').append(readingNote('table-reading', tableReading));
    // The same stroke and em-size follow the text in every link family.
    root.querySelectorAll('a>span[aria-hidden="true"]').forEach(span => {
      const direction = span.textContent.trim();
      if (!['↓', '↗'].includes(direction)) return;
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'row-action-arrow');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      icon.innerHTML = `<path d="${direction === '↓' ? 'M12 4v16M5 13l7 7 7-7' : 'M5 19 19 5M5 5h14v14'}"/>`;
      span.replaceWith(icon);
    });
    root.querySelectorAll('.icon-play path').forEach(path => path.setAttribute('d', 'M8 5 19 12 8 19Z'));
    root.querySelectorAll('[data-player-caption]').forEach(caption => { caption.textContent = caption.textContent.replace(/^Архив · /, ''); });
    // Cyrillic K/C/Ч have different left sidebearings in Golos. Compensate
    // the display heading at its own size, not by moving the whole group.
    root.querySelector('#contact-title').style.setProperty('--heading-ink-left', key === 'spring' ? '.100' : '.060');
    // Keep a question and its answer in the same text column at every wrap.
    const exchange = root.querySelector('.cp-caviar-conversation .cp-exchange');
    const voice = exchange.querySelector('.cp-voice');
    const copy = document.createElement('div');
    copy.className = 'cp-voice-copy';
    copy.append(exchange.querySelector('.cp-question'), voice.querySelector('.cp-voice-answer'));
    voice.prepend(copy);
    const heroPlayer=root.querySelector('.row-yura .row-player');
    const mediaCore=document.createElement('div');
    mediaCore.className='hero-player-core';
    mediaCore.append(heroPlayer.querySelector('.row-player-picture'),heroPlayer.querySelector('.row-player-controls'));
    heroPlayer.prepend(mediaCore);
    return page.innerHTML;
  };
})();
