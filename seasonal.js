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
      caviar: 'Икра к обычному завтраку.',
      caviarCopy: 'На хлеб с маслом, к блинам или просто ложкой. Начнём с того, какой вкус тебе нравится.',
      choice: 'А какую взять?', fish: 'А рыбу к ужину?', crab: 'А краба — к выходным?',
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
      caviar: 'Первую нерку начинаем с пробы.',
      caviarCopy: 'Первая проба, ради которой ждут начала сезона. Рядом — июньская запись Юры: соль, зерно и открытая банка.',
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
      body: 'В чеховской «Сирене» секретарь рассказывает о селёдке, кулебяке и стерляди. Председатель портит лист за листом, слушатели не выдерживают и уезжают обедать. Еды ещё нет перед глазами, а разговор уже сделал своё дело. Хорошо, когда рядом есть человек, который умеет так рассказывать о вкусе.',
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
    const note = document.createElement('p');
    note.className = 'cp-copy season-caviar-note';
    note.textContent = text(accent.caviarCopy);
    caviar.querySelector('.cp-caviar-copy>.cp-answer').after(note);
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
        <a class="season-photo-link" href="assets/smelt.jpg" target="_blank" rel="noopener" aria-label="Рассмотреть корюшку в полном размере — откроется в новой вкладке"><img src="assets/smelt.jpg" width="480" height="848" alt="Серебристая корюшка крупным планом из мартовской записи канала «Рыба и крабы»." loading="lazy"></a>
        <figcaption>${link('https://t.me/ikrabov/123', 'В канале · 26.03.2025')}</figcaption>
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
      // The summer's facts and comparison fill the text column beside the
      // full tasting. Keep the tall image from stranding an empty column.
      copy.append(tasting.querySelector('.cp-story-intro'), comparison);
      opening.append(copy, tasting);
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
    uses.innerHTML = [
      ['steaks', 'Пожарить', 'Стейки сёмги, извлечённые из фотографии Юры', 551, 682],
      ['broth', 'Сварить', 'Голова и обрезь сёмги для бульона', 631, 729],
      ['fillets', 'Посолить', 'Два куска филе сёмги из той же фотографии', 547, 1349]
    ].map(([part, label, alt, width, height]) => `<figure class="fish-use fish-use-${part}"><figcaption>${label}</figcaption><a href="assets/fish-${part}.png" target="_blank" rel="noopener" aria-label="${label}: рассмотреть рыбу в полном размере"><img src="assets/fish-${part}.png" width="${width}" height="${height}" alt="${alt}" loading="lazy"></a></figure>`).join('') + `<div class="fish-uses-source">${link('https://t.me/Yuraikra', 'Из истории Юры · 14.01.2025')}</div>`;
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
    return page.innerHTML;
  };
})();
