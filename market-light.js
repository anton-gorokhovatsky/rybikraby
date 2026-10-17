/* Moscow's solar cycle. Position: NOAA General Solar Position Calculations.
   https://gml.noaa.gov/grad/solcalc/solareqns.PDF
   The palette is an artistic interpretation of sunlight, not weather data. */
(() => {
  'use strict';
  const rad=Math.PI/180;
  const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
  const smooth=(a,b,n)=>{const t=clamp((n-a)/(b-a));return t*t*(3-2*t);};
  const blend=(a,b,t)=>`rgb(${a.map((n,i)=>Math.round(n+(b[i]-n)*t)).join(' ')})`;
  function position(date,latitude=55.75,longitude=37.62) {
    const year=date.getUTCFullYear();
    const days=(Date.UTC(year+1,0,1)-Date.UTC(year,0,1))/86400000;
    const day=(date-Date.UTC(year,0,1))/86400000;
    const gamma=2*Math.PI/days*(day-.5);
    const equation=229.18*(.000075+.001868*Math.cos(gamma)-.032077*Math.sin(gamma)-.014615*Math.cos(2*gamma)-.040849*Math.sin(2*gamma));
    const declination=.006918-.399912*Math.cos(gamma)+.070257*Math.sin(gamma)-.006758*Math.cos(2*gamma)+.000907*Math.sin(2*gamma)-.002697*Math.cos(3*gamma)+.00148*Math.sin(3*gamma);
    const minutes=date.getUTCHours()*60+date.getUTCMinutes()+date.getUTCSeconds()/60;
    const solarMinutes=((minutes+equation+4*longitude)%1440+1440)%1440;
    const hourAngle=solarMinutes/4-180;
    const lat=latitude*rad;
    const h=hourAngle*rad;
    const cosine=clamp(Math.sin(lat)*Math.sin(declination)+Math.cos(lat)*Math.cos(declination)*Math.cos(h),-1,1);
    const altitude=90-Math.acos(cosine)/rad;
    const azimuth=(Math.atan2(Math.sin(h),Math.cos(h)*Math.sin(lat)-Math.tan(declination)*Math.cos(lat))/rad+540)%360;
    return {altitude,azimuth,morning:hourAngle<0};
  }
  function lightFor(sun) {
    const daylight=smooth(-6,18,sun.altitude);
    const warmth=Math.exp(-Math.pow((sun.altitude-1)/8,2));
    const light=sun.altitude>=-2?'day':'evening';
    const phase=sun.altitude<-6?'night':sun.altitude<6?(sun.morning?'dawn':'dusk'):'day';
    return {
      light,phase,
      paper:light==='day'?blend([244,245,241],[246,237,221],warmth*.65):blend([23,36,46],[38,37,41],warmth*.4),
      left:(.91-.11*daylight).toFixed(3),
      middle:(.66-.34*daylight).toFixed(3),
      right:(.8-.26*daylight).toFixed(3),
      glow:(.2*warmth*smooth(-7,1,sun.altitude)).toFixed(3),
      x:`${(5+90*clamp((sun.azimuth-60)/240)).toFixed(1)}%`,
      y:`${(85-65*clamp(sun.altitude/70)).toFixed(1)}%`
    };
  }
  function start({mode='auto',onChange=()=>{}}={}) {
    const previews={
      morning:{altitude:2,azimuth:100,morning:true},
      day:{altitude:35,azimuth:180,morning:false},
      evening:{altitude:-4,azimuth:265,morning:false},
      night:{altitude:-25,azimuth:330,morning:false}
    };
    const preview=Object.prototype.hasOwnProperty.call(previews,mode)?previews[mode]:null;
    const update=()=>{
      const now=new Date();
      const sun=preview||position(now);
      const light=lightFor(sun);
      const body=document.body;
      body.dataset.light=light.light;
      body.dataset.solarPhase=light.phase;
      body.dataset.solarSource=preview?'preview':'moscow';
      body.style.setProperty('--paper',light.paper);
      for(const key of ['left','middle','right','glow','x','y']) body.style.setProperty(`--market-light-${key}`,light[key]);
      const place=document.querySelector('[data-market-place]');
      if(place) {
        if(preview) place.textContent='Москва';
        else {
          const clock=new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
          place.innerHTML=`Москва · <time datetime="${now.toISOString()}">${clock}</time>`;
        }
      }
      onChange();
    };
    update();
    if(!preview) {
      let timer;
      const resume=()=>{
        clearInterval(timer);
        if(!document.hidden) { update();timer=setInterval(update,60000); }
      };
      document.addEventListener('visibilitychange',resume);
      addEventListener('pageshow',resume);
      addEventListener('pagehide',()=>clearInterval(timer));
      resume();
    }
  }
  const api={position,lightFor,start};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else window.MarketLight=api;
})();
