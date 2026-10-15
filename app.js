(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const isRow = true;
  const lightMode = ['day','evening'].includes(params.get('light')) ? params.get('light') : 'auto';
  const products = [
    {id:'nerka', name:'Нерка', title:'Икра нерки', number:'01', grain:'Мелкое', flavor:'Выразительный, с лёгкой горчинкой', mood:'Для тех, кто любит характер', copy:'Небольшие красные икринки и заметная горчинка. Хороший повод познакомиться с другим вкусом икры.', short:'Яркая. С характером.'},
    {id:'gorbusha', name:'Горбуша', title:'Икра горбуши', number:'02', grain:'Среднее', flavor:'Классический, без выраженной горчинки', mood:'Для любимых бутербродов', copy:'Знакомый вкус и икринки среднего размера. Универсальный выбор к багету, блинчикам и другим блюдам.', short:'Знакомая. На каждый случай.'},
    {id:'keta', name:'Кета', title:'Икра кеты', number:'03', grain:'Крупное', flavor:'Нежный, со сливочным оттенком', mood:'Для красивого стола', copy:'Крупные янтарно-оранжевые икринки с нежным вкусом. Когда хочется уделить внимание каждой детали подачи.', short:'Нежная. Для особого случая.'}
  ];
  const orderButton = (id, label, cls='', arrow='↗', accessibleName='') => `<button class="button ${cls}" type="button" data-order="${id}"${accessibleName?` aria-label="${accessibleName}"`:''}>${label}<span aria-hidden="true">${arrow}</span></button>`;
  const footer = () => `<footer class="site-footer row-footer"><a class="wordmark" href="#main">РЫБА И КРАБЫ</a><p>Москва · розница и опт</p><div><a class="row-reference" href="https://t.me/ikrabov" target="_blank" rel="noopener">Telegram-канал <span aria-hidden="true">↗</span></a><a class="row-reference" href="https://t.me/Yuraikra" target="_blank" rel="noopener">Оптовый запрос <span aria-hidden="true">↗</span></a></div></footer>`;
  Object.assign(document.body.dataset,{direction:'tokyo',version:'3',type:'oks',menu:'glass'});
  document.getElementById('app').innerHTML=tokyoRow({products,orderButton:(id,label,cls,name)=>orderButton(id,label,cls,'→',name),footer});
  const textNodes=document.createTreeWalker(document.getElementById('app'),NodeFilter.SHOW_TEXT);
  while(textNodes.nextNode()) textNodes.currentNode.textContent=rowTypograph(textNodes.currentNode.textContent);
  const menu=document.querySelector('.row-header');
  const menuHeadings=[...document.querySelectorAll('.row-main h1,.row-main h2,.row-main h3')];
  const menuSurfaces=[...document.querySelectorAll('.row-main>section,.row-footer')];
  const syncMenuSurface=()=>{
    const rect=menu.getBoundingClientRect();
    const probe=rect.top+rect.height/2;
    const surface=menuSurfaces.find(section=>{
      const box=section.getBoundingClientRect();
      return box.top<=probe && box.bottom>probe;
    });
    menu.dataset.surface=document.body.dataset.light==='day' && surface?.matches('.row-caviar,.row-footer')?'paper':'dark';
    menu.dataset.overLettering=String(menuHeadings.some(heading=>{
      const box=heading.getBoundingClientRect();
      return box.top<rect.bottom && box.bottom>rect.top;
    }));
  };
  const syncMenuSpace=()=>{
    document.documentElement.style.setProperty('--row-menu-height',`${menu.getBoundingClientRect().height}px`);
    syncMenuSurface();
  };
  let menuFrame=0;
  addEventListener('scroll',()=>{
    if(menuFrame) return;
    menuFrame=requestAnimationFrame(()=>{menuFrame=0;syncMenuSurface();});
  },{passive:true});
  syncMenuSpace();
  new ResizeObserver(syncMenuSpace).observe(menu);
  function updateLight() {
    const hour=Number(new Intl.DateTimeFormat('en-GB',{hour:'2-digit',hourCycle:'h23',timeZone:'Europe/Moscow'}).format(new Date()));
    document.body.dataset.light=lightMode==='auto'?(hour>=7&&hour<19?'day':'evening'):lightMode;
    syncMenuSurface();
  }
  updateLight();
  if(lightMode==='auto') setInterval(updateLight,30000);

  const dialog = document.getElementById('order-dialog');
  const choice = document.getElementById('order-choice');
  const amount = document.getElementById('order-amount');
  const note = document.getElementById('order-note');
  const preview = document.getElementById('message-preview');
  const status = document.getElementById('copy-status');
  if(isRow) {
    choice.insertAdjacentHTML('afterbegin','<option value="question">Другой вопрос</option>');
    choice.value='question';
    choice.querySelector('[value="help"]').textContent='Помогите выбрать икру';
    dialog.querySelector('.order-heading .eyebrow').textContent='@Yuraikra';
    document.getElementById('order-title').textContent='Написать Юре';
    document.getElementById('order-intro').textContent=rowTypograph('Сообщение откроется в Telegram. Отправите его в чате.');
    dialog.querySelector('[for="order-choice"]').textContent='Что вас интересует';
    dialog.querySelector('[for="order-amount"] span').textContent='необязательно';
    amount.placeholder='Например, 250\u00a0г';
    dialog.querySelector('[for="order-note"]').firstChild.textContent='Вопрос или пожелания ';
    note.placeholder='Вкус, доставка, дата';
    dialog.querySelector('.message-box .eyebrow').remove();
    dialog.querySelector('.order-footnote').remove();
  }
  const draftKey = 'rybikraby-order-draft-v1';
  let previousFocus = null;
  try {
    const saved = JSON.parse(sessionStorage.getItem(draftKey)||'null');
    if(saved) {
      if(['help',...(isRow?['question']:[]),...products.map(p=>p.id)].includes(saved.product)) choice.value=saved.product;
      amount.value=String(saved.amount||'').slice(0,80);note.value=String(saved.note||'').slice(0,1000);
    }
  } catch { /* The form also works when browser storage is unavailable. */ }
  function messageText() {
    const product = products.find(p=>p.id===choice.value);
    if(isRow && choice.value==='question') {
      let text='Юра, здравствуйте!';
      text += '\n'+(note.value.trim() || 'Подскажите, что сейчас есть в наличии.');
      return text;
    }
    let text = product ? `Юра, здравствуйте! Интересует ${product.title.toLowerCase()}.` : 'Юра, здравствуйте! Помогите, пожалуйста, выбрать красную икру.';
    if(amount.value.trim()) text += `\nКоличество: ${amount.value.trim()}${isRow?'':'.'}`;
    if(note.value.trim()) text += `\n${note.value.trim()}`;
    return text+'\nПодскажите, пожалуйста, наличие, фасовку, цену и условия доставки.';
  }
  function updateMessage() {
    const generalQuestion = isRow && choice.value === 'question';
    amount.hidden = generalQuestion;
    dialog.querySelector('[for="order-amount"]').hidden = generalQuestion;
    const text=messageText();preview.textContent=text;
    document.getElementById('telegram-draft').href='https://t.me/Yuraikra?text='+encodeURIComponent(text);
    status.textContent='';
    try {sessionStorage.setItem(draftKey,JSON.stringify({product:choice.value,amount:amount.value,note:note.value}));} catch {}
  }
  document.querySelectorAll('[data-order]').forEach(button=>button.addEventListener('click',()=>{
    previousFocus=button;
    choice.value=button.dataset.order;
    updateMessage();dialog.showModal();dialog.scrollTop=0;
    if(isRow) dialog.querySelector('.close-dialog').focus({preventScroll:true});
    else choice.focus();
  }));
  document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',event=>{
    if(event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button,a[href],input,select,textarea')]
      .filter(control=>!control.disabled && control.getClientRects().length);
    const first = controls[0], last = controls[controls.length-1];
    if(!first) return;
    if(event.shiftKey && document.activeElement === first) {
      event.preventDefault();last.focus();
    } else if(!event.shiftKey && document.activeElement === last) {
      event.preventDefault();first.focus();
    }
  });
  dialog.addEventListener('close',()=>previousFocus?.focus({preventScroll:true}));
  document.getElementById('order-form').addEventListener('input',updateMessage);
  document.getElementById('order-form').addEventListener('change',updateMessage);
  document.getElementById('order-form').addEventListener('submit',event=>event.preventDefault());
  document.getElementById('copy-message').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(messageText());status.textContent='Текст скопирован.';}
    catch {status.textContent='Не удалось скопировать автоматически. Выделите текст сообщения выше и скопируйте его вручную.';}
  });
  updateMessage();
})();
