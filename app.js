(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const lightMode = params.get('light') || 'auto';
  const products = [
    {id:'nerka', name:'Нерка', grain:'Мелкое', flavor:'Выразительный, с лёгкой горчинкой'},
    {id:'gorbusha', name:'Горбуша', grain:'Среднее', flavor:'Классический, без выраженной горчинки'},
    {id:'keta', name:'Кета', grain:'Крупное', flavor:'Нежный, со сливочным оттенком'}
  ];
  const contactUrl = 'https://t.me/Yuraikra';
  Object.assign(document.body.dataset,{direction:'tokyo',version:'3',type:'oks',menu:'glass',dialogue:''});
  document.getElementById('app').innerHTML=tokyoRow({products,contactUrl});
  const textNodes=document.createTreeWalker(document.getElementById('app'),NodeFilter.SHOW_TEXT);
  while(textNodes.nextNode()) {
    const node=textNodes.currentNode;
    node.textContent=rowTypograph(node.textContent,node.parentElement.matches('.cp-question'));
  }
  const menu=document.querySelector('.row-header');
  const menuHeadings=[...document.querySelectorAll('.row-main h1,.row-main h2,.row-main h3,.dialogue-footer-brand')];
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
  MarketLight.start({mode:lightMode,onChange:syncMenuSurface});

  document.querySelectorAll(`a[href="${contactUrl}"]`).forEach(link=>link.addEventListener('click',()=>{
    document.querySelectorAll('video').forEach(video=>{ if(!video.paused) video.pause(); });
  }));
})();
