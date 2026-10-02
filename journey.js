(function(){
 'use strict';
 var section=document.querySelector('.mobile-journey');
 if(!section)return;
 var mobile=matchMedia('(max-width:720px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 var stage=section.querySelector('.journey-stage'),image=section.querySelector('img');
 var visible=false,frame=0,selected='hari';
 var gardens={
  hari:{name:'Hari Nagar',photo:'images/amb-hari-green.webp',copy:'A table by the lake.<br />An evening beneath the trees.'},
  dwarka:{name:'Dwarka',photo:'images/wa-dwarka.jpg',copy:'A garden in the city.<br />A little room to breathe.'},
  janakpuri:{name:'Janakpuri',photo:'images/wa-eatery-royale-web.webp',copy:'Eatery Royale.<br />Gather under the evening lights.'}
 };
 function paint(){
  frame=0;
  if(!mobile.matches||reduced.matches)return;
  var rect=section.getBoundingClientRect();
  var travel=Math.max(1,section.offsetHeight-stage.offsetHeight);
  var progress=Math.max(0,Math.min(1,(84-rect.top)/travel));
  stage.style.setProperty('--p',progress.toFixed(3));
  stage.style.setProperty('--intro',Math.max(0,1-progress*2.5).toFixed(3));
  stage.style.setProperty('--reveal',Math.max(0,Math.min(1,(progress-.3)/.4)).toFixed(3));
 }
 function schedule(){if(visible&&!frame)frame=requestAnimationFrame(paint)}
 if('IntersectionObserver'in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;if(visible)paint()},{rootMargin:'120px'}).observe(section)}
 else visible=true;
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 reduced.addEventListener('change',function(){stage.style.removeProperty('--p');stage.style.removeProperty('--intro');stage.style.removeProperty('--reveal');schedule()});
 section.querySelectorAll('[data-garden]').forEach(function(button){button.addEventListener('click',function(){
  if(selected===button.dataset.garden)return;
  selected=button.dataset.garden;
  var garden=gardens[selected];
  image.src=garden.photo;
  section.querySelector('.journey-destination h2').textContent=garden.name;
  section.querySelector('.journey-destination p').innerHTML=garden.copy;
  section.querySelector('.journey-link').href='#restaurant-'+selected;
  section.querySelectorAll('[data-garden]').forEach(function(item){item.setAttribute('aria-pressed',String(item===button))});
  if(!reduced.matches)image.animate([{opacity:.2},{opacity:.7}],{duration:450,easing:'ease-out'});
 })});
 paint();
})();
