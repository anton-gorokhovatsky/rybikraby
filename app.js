(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const lightMode = ['day','evening'].includes(params.get('light')) ? params.get('light') : 'auto';
  const products = [
    {id:'nerka', name:'Нерка', grain:'Мелкое', flavor:'Выразительный, с лёгкой горчинкой'},
    {id:'gorbusha', name:'Горбуша', grain:'Среднее', flavor:'Классический, без выраженной горчинки'},
    {id:'keta', name:'Кета', grain:'Крупное', flavor:'Нежный, со сливочным оттенком'}
  ];
  const contactUrl = 'https://t.me/Yuraikra';
  const footer = () => `<footer class="site-footer row-footer"><a class="row-reference" href="https://t.me/ikrabov" target="_blank" rel="noopener">Telegram-канал <span aria-hidden="true">↗</span></a><a class="row-reference" href="${contactUrl}" target="_blank" rel="noopener">Оптовый запрос <span aria-hidden="true">↗</span></a></footer>`;
  Object.assign(document.body.dataset,{direction:'tokyo',version:'3',type:'oks',menu:'glass',dialogue:''});
  document.getElementById('app').innerHTML=tokyoRow({products,footer,contactUrl});
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
    menu.dataset.surface=document.body.dataset.light==='day' && surface?.matches('.row-caviar,.row-footer,.dialogue-section:not(.dialogue-dark)')?'paper':'dark';
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

  document.querySelectorAll(`a[href="${contactUrl}"]`).forEach(link=>link.addEventListener('click',()=>{
    document.querySelectorAll('video').forEach(video=>{ if(!video.paused) video.pause(); });
  }));
})();
