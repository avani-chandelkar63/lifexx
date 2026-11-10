/* Shared motion polish: scroll progress, ambient beams, dust, cursor light, wishlist feedback. No dependencies. */
window.VF=window.VF||{};
(function(VF){
  var U=VF.utils;
  function mk(c){var d=document.createElement('div');d.className=c;document.body.appendChild(d);return d}
  VF.polish={init:function(){
    var bar=mk('vf-progress'),tick=false;bar.setAttribute('aria-hidden','true');
    function upd(){tick=false;var m=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0)+')'}
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
    var toast=mk('vf-toast'),tt;toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');
    document.addEventListener('click',function(e){
      var b=e.target.closest('[data-save]');if(!b)return;var id=b.getAttribute('data-save');
      setTimeout(function(){var on=VF.wishlist.has(id),r=VF.store.get(id);
        U.$$('.heart[data-save="'+id+'"]').forEach(function(h){h.classList.remove('vf-pop');void h.offsetWidth;if(on)h.classList.add('vf-pop')});
        toast.innerHTML=(on?'<b>Saved</b> ':'Removed ')+(r?U.esc(r.name):'')+(on?' · '+VF.wishlist.count()+' in your list':'');
        toast.classList.add('is-on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('is-on')},2200)},0);
    },true);
    if(U.reduceMotion())return;
    var hero=U.$('main>section:first-child');
    if(hero&&!U.$('.hero-beam',hero)){hero.style.position=hero.style.position||'relative';hero.insertAdjacentHTML('afterbegin','<div class="vf-ambient" aria-hidden="true"><div class="hero-beam beam-a"></div><div class="hero-beam beam-b"></div></div>')}
    var dust=mk('vf-dust');dust.setAttribute('aria-hidden','true');
    for(var i=0;i<14;i++){var s=document.createElement('i');s.style.left=(Math.random()*100)+'%';s.style.setProperty('--dx',(Math.random()*80-40)+'px');s.style.animationDuration=(16+Math.random()*18)+'s';s.style.animationDelay=(-Math.random()*30)+'s';dust.appendChild(s)}
    // Pointer feedback is handled by the single custom cursor in cursor.js.
  }};
})(window.VF);
