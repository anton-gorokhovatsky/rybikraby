(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const lightMode = params.get('light') || 'auto';
  const products = [
    {id:'nerka', name:'Нерка', grain:'Мелкое, мягкая оболочка', color:'Ярко-красный', flavor:'Пикантный, с лёгкой горчинкой', serving:'На белом хлебе со сливочным маслом', illustration:'caviar-guide/nerka-marine.fa2c9611d564.webp', imageScale:1.068206, imageInset:-3.200420, imageWidth:640, imageHeight:242},
    {id:'gorbusha', name:'Горбуша', grain:'Среднее, мягкая оболочка', color:'Ярко-оранжевый', flavor:'Мягкий, без выраженной горчинки', serving:'На овощных оладьях с творожным сыром', illustration:'caviar-guide/gorbusha-marine.a484b665ad76.webp', imageScale:1.054226, imageInset:-2.179692, imageWidth:640, imageHeight:256},
    {id:'keta', name:'Кета', grain:'Крупное, мягкая оболочка', color:'Янтарно-оранжевый', flavor:'Нежный, сливочный', serving:'На блинах', illustration:'caviar-guide/keta-marine.9cdc9fa4a945.webp', imageScale:1.037017, imageInset:-1.427816, imageWidth:640, imageHeight:261},
    {id:'coho', name:'Кижуч', grain:'Мелкое, упругая оболочка', color:'Тёмно-красный, бордовый', flavor:'Горьковатый', serving:'С яйцом', illustration:'caviar-guide/coho-marine.7812cd64a738.webp', imageScale:1.041408, imageInset:-1.604555, imageWidth:640, imageHeight:248},
    {id:'trout', name:'Форель', grain:'Очень мелкое, упругая оболочка', color:'От жёлтого до красного', flavor:'Солоноватый', serving:'На канапе или бутербродах', illustration:'caviar-guide/trout-marine.cd2059605638.webp', imageScale:1.040975, imageInset:-1.348548, imageWidth:640, imageHeight:249}
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
