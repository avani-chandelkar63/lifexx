/* Card builders. All card text comes from the dataset; nothing is hard-coded per venue. */
window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,S=VF.store,C=VF.CONFIG;
  var heartSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.700 4 4.500 7.300 4.500c1.900 0 3.500 1 4.700 2.700 1.200-1.700 2.800-2.700 4.700-2.700 3.300 0 5.600 3.200 4.500 6.600-1.700 4.800-9.200 9.400-9.200 9.400z"/></svg>';
  var arrow='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function sceneStyle(r){var c=VF.scenes.crop(r.id);return 'background-size:'+c.s+'%;background-position:'+c.x+'% '+c.y+'%'}
  function heart(r){var on=VF.wishlist.has(r.id);return '<button class="heart" type="button" data-cursor="save" data-save="'+U.esc(r.id)+'" aria-pressed="'+on+'" aria-label="'+(on?'Remove ':'Save ')+U.esc(r.name)+(on?' from saved':'')+'">'+heartSvg+'</button>'}
  VF.cards={
    arrow:arrow,heart:heart,
    cat:function(r){return r.categories[0]},
    locText:function(r){return S.locationLabel(r).join(' · ')},
    // tall cinematic card for the featured rail
    featured:function(r,mood){
      var cat=r.categories[0];
      return '<article class="fcard" data-cursor="view"><div class="scene scene--'+cat+'" style="'+sceneStyle(r)+'" role="img" aria-label="Designed '+U.esc(C.categories[cat].short)+' artwork, not a photo of this venue"></div>'+
        (mood?'<span class="fcard__mood">'+U.esc(mood)+'</span>':'')+
        '<div style="position:absolute;top:1rem;right:1rem;z-index:4">'+heart(r)+'</div>'+
        '<h3><a href="'+U.expLink(r.id)+'" class="stretch" data-cursor="view">'+U.esc(r.name)+'</a></h3><p class="fcard__loc">'+U.esc(VF.cards.locText(r))+'</p></article>';
    },
    // directory card (grid or list). Subcategory tags come from evidence-based matching; category tags are the source tags.
    card:function(r,i){
      var cat=r.categories[0],C2=C.categories,subs=r.subcategories.slice(0,2).map(function(k){return S.meta.subs[k].label});
      var acts=r.activities.slice(0,3),more=r.activities.length-acts.length;
      return '<div class="xslot" data-reveal style="--d:'+((i||0)%6)+'"><article class="xcard" data-id="'+U.esc(r.id)+'" style="--cat:'+C2[cat].hue+'">'+
        '<div class="xcard__img"><div class="scene scene--'+cat+'" style="'+(function(){var c=VF.scenes.cardCrop(r.id);return 'background-size:'+c.s+'%;background-position:'+c.x+'% '+c.y+'%'})()+'" role="img" aria-label="Designed '+U.esc(C2[cat].short)+' artwork, not a photo of this venue"></div></div>'+
        '<div class="xcard__top"><span class="xcard__cat">'+r.categories.map(function(c){return U.esc(C2[c].short)}).join(' · ')+'</span>'+heart(r)+'</div>'+
        '<div class="xcard__body"><h3><a class="stretch" data-cursor="view" href="'+U.expLink(r.id)+'">'+U.esc(r.name)+'</a></h3>'+
        '<p class="xcard__loc">'+U.esc(VF.cards.locText(r))+(r.addressPrecision==='city'?' <span class="xcard__approx">approx. location</span>':'')+'</p>'+
        (r.address?'<p class="xcard__addr">'+U.esc(r.address)+'</p>':'')+
        '<ul class="xcard__acts">'+acts.map(function(a){return '<li>'+U.esc(a)+'</li>'}).join('')+(more>0?'<li class="more">+'+more+'</li>':'')+'</ul>'+
        '<div class="xcard__foot"><span class="xcard__subs">'+(r.featured?'<b class="xcard__pick">Quick pick</b>':'')+subs.map(function(x){return '<i>'+U.esc(x)+'</i>'}).join('')+'</span>'+
        (r.mapUrl?'<a class="xcard__map" href="'+U.esc(r.mapUrl)+'" target="_blank" rel="noopener noreferrer" aria-label="Open '+U.esc(r.name)+' on Google Maps (new tab)">Map '+VF.cards.arrow+'</a>':'')+'</div></div></article></div>';
    },
    // compact row for lists / drawer
    mini:function(r){return '<div class="drawer__item"><div class="scene scene--'+r.categories[0]+'" style="'+sceneStyle(r)+'"></div><div><b><a class="stretch" data-cursor="view" href="'+U.expLink(r.id)+'">'+U.esc(r.name)+'</a></b><small>'+U.esc(VF.cards.locText(r))+'</small></div><button class="iconbtn" type="button" data-save="'+U.esc(r.id)+'" aria-label="Remove '+U.esc(r.name)+' from saved">&times;</button></div>'}
  };
  document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.xcard');if(!c)return;var b=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-b.left)+'px');c.style.setProperty('--my',(e.clientY-b.top)+'px')});
  // one delegated listener for every save button on any page
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-save]');if(!b)return;e.preventDefault();e.stopPropagation();
    VF.wishlist.toggle(b.getAttribute('data-save'));
  });
  VF.wishlist.onChange(function(ids){
    U.$$('.heart[data-save]').forEach(function(h){var on=ids.indexOf(h.getAttribute('data-save'))>-1;h.setAttribute('aria-pressed',on)});
  });
})(window.VF);
