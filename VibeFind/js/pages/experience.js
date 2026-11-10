window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,S=VF.store,C=VF.CONFIG,$=U.$,esc=U.esc;
  function categoryLabels(r){return r.categories.map(function(k){return C.categories[k]?C.categories[k].label:k})}
  function renderMissing(id){
    document.title='Experience not found · VibeFind';
    $('#detailRoot').innerHTML='<section class="detail-empty"><div class="wrap"><div class="detail-empty__mark">404</div><p class="eyebrow">No matching experience</p><h1 class="display" style="font-size:clamp(2.7rem,8vw,6.5rem);margin:1rem 0">This vibe is<br><span class="accent-v">off the radar.</span></h1><p class="lede">We could not find a listing for <b>'+esc(id||'that link')+'</b>. It may have moved or the link may be incomplete.</p><div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:2rem"><a class="btn btn--solid" href="explore.html">Explore all places '+VF.cards.arrow+'</a><a class="btn" href="index.html">Back home</a></div></div></section>';
  }
  function noteItems(r){
    var notes=[];
    (r.reviewFlags||[]).forEach(function(f){if(f.note)notes.push(f.note)});
    (r.corrections||[]).forEach(function(c){if(c.note)notes.push(c.note)});
    return notes;
  }
  function render(r){
    var cat=r.categories[0]||'gaming',meta=C.categories[cat]||{label:'Experience',short:'Experience'};
    var loc=S.locationLabel(r).join(' · ');
    var sub=(r.subcategories||[]).map(function(k){return S.meta.subs[k]&&S.meta.subs[k].label}).filter(Boolean);
    var activities=(r.activities||[]).map(function(a){return '<li class="detail-activity">'+esc(a)+'</li>'}).join('');
    var notes=noteItems(r),links=(r.links||[]).filter(function(l){return l&&l.url&&/^https?:\/\//i.test(l.url)});
    var map=r.directionsUrl||r.mapUrl;
    var scene='<div class="detail-hero__scene" aria-hidden="true"><div class="scene scene--'+esc(cat)+'" style="background-position:'+VF.scenes.cardCrop(r.id).x+'% '+VF.scenes.cardCrop(r.id).y+'%;"></div></div>';
    var detail='<section class="detail-hero"><div class="detail-hero__ambient"></div>'+scene+'<div class="wrap detail-hero__copy">'+
      '<div class="detail-hero__kicker"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><i>/</i><a href="explore.html">Explore</a><i>/</i><span>'+esc(r.city==='delhi'?'Delhi':'Chandigarh Tricity')+'</span></nav><span class="detail-hero__index">Entry '+esc(r.id.toUpperCase())+'</span></div>'+
      '<p class="eyebrow" data-reveal>'+esc(r.city==='delhi'?'Delhi NCT':'Chandigarh Tricity')+' · '+esc(meta.short)+'</p>'+
      '<h1 class="detail-hero__title display" data-reveal>'+esc(r.name)+'<span class="accent">.</span></h1>'+
      '<p class="lede detail-hero__summary" data-reveal>'+esc(loc)+'</p>'+
      '<div class="detail-hero__meta" data-reveal>'+categoryLabels(r).map(function(x){return '<span class="tag">'+esc(x)+'</span>'}).join('')+(sub.slice(0,3).map(function(x){return '<span class="tag">'+esc(x)+'</span>'}).join(''))+'</div>'+
      '<div class="detail-hero__actions" data-reveal>'+(map?'<a class="btn btn--solid" href="'+esc(map)+'" target="_blank" rel="noopener noreferrer">Get directions '+VF.cards.arrow+'</a>':'')+VF.cards.heart(r)+'<a class="btn btn--ghost" href="explore.html?city='+esc(r.city)+'">More in '+esc(r.city==='delhi'?'Delhi':'the Tricity')+'</a></div>'+
      '</div></section>';
    var addressPrecision=r.addressPrecision==='exact'?'Address supplied in source':'Approximate location — check the map';
    var spec='<aside class="detail-spec" aria-label="Experience information"><dl>'+
      '<div class="detail-spec__row"><dt>Location</dt><dd>'+esc(loc)+'</dd><small class="muted-note">'+esc(r.jurisdiction||'')+'</small></div>'+
      (r.address?'<div class="detail-spec__row"><dt>Address</dt><dd>'+esc(r.address)+'</dd><small class="muted-note">'+esc(addressPrecision)+'</small></div>':'')+
      '<div class="detail-spec__row"><dt>Activity type</dt><dd>'+categoryLabels(r).map(esc).join(' · ')+'</dd></div>'+
      (sub.length?'<div class="detail-spec__row"><dt>Activities</dt><dd>'+sub.map(esc).join(' · ')+'</dd></div>':'')+
      (r.moods&&r.moods.length?'<div class="detail-spec__row"><dt>Quick-pick mood</dt><dd>'+r.moods.map(esc).join(' · ')+'</dd><small class="muted-note">From the original research quick-pick list</small></div>':'')+
      '<div class="detail-spec__row"><dt>Listing reference</dt><dd>'+esc(r.id.toUpperCase())+'</dd></div></dl>'+
      '<div class="detail-actions">'+(map?'<a class="btn btn--solid" href="'+esc(map)+'" target="_blank" rel="noopener noreferrer">Open in Google Maps '+VF.cards.arrow+'</a>':'')+
      '<button class="btn btn--ghost" type="button" id="detailSave">'+(VF.wishlist.has(r.id)?'Remove from saved':'Save this place')+'</button></div></aside>';
    var main='<section class="detail-section" data-reveal><p class="eyebrow">What you can do</p><h2 class="detail-section__title">Activities listed for this place</h2>'+
      (activities?'<ul class="detail-activities">'+activities+'</ul>':'<p class="lede">No activity details were supplied for this listing.</p>')+'</section>'+
      (sub.length?'<section class="detail-section" data-reveal><p class="eyebrow">Explore the category</p><h2 class="detail-section__title">Related activity types</h2><div class="detail-tags">'+sub.map(function(x){return '<span class="tag">'+esc(x)+'</span>'}).join('')+'</div></section>':'')+
      (links.length?'<section class="detail-section" data-reveal><p class="eyebrow">Research references</p><h2 class="detail-section__title">More information</h2><div class="detail-links">'+links.map(function(l){return '<a class="detail-link" href="'+esc(l.url)+'" target="_blank" rel="noopener noreferrer">'+esc(l.label||l.host||'Open source link')+' '+VF.cards.arrow+'</a>'}).join('')+'</div><p class="form-disclaimer">Links are carried over from the source research and have not necessarily been independently checked. They are not presented as verified booking links.</p></section>':'')+
      (notes.length?'<section class="detail-section" data-reveal><p class="eyebrow">Research transparency</p><h2 class="detail-section__title">Data notes</h2><div class="detail-notes">'+notes.map(function(n){return '<div class="detail-note"><b>Source note</b>'+esc(n)+'</div>'}).join('')+'</div></section>':'');
    var html=detail+'<section class="detail-panel"><div class="wrap"><div class="detail-grid"><div class="detail-main">'+main+'</div>'+spec+'</div></div></section>';
    var related=S.related(r,6);
    if(related.length){html+='<section class="detail-related"><div class="wrap"><div class="detail-related__head"><div><p class="eyebrow">Keep exploring</p><h2 class="h2">More in this frequency<span class="accent-v">.</span></h2></div><a class="btn btn--ghost" href="explore.html?city='+esc(r.city)+'">Explore more '+VF.cards.arrow+'</a></div><div class="detail-related__grid">'+related.map(function(x){var k=x.r.categories[0]||'gaming';return '<article class="detail-related__card" data-reveal><div class="detail-related__visual scene scene--'+esc(k)+'" style="background-position:'+VF.scenes.cardCrop(x.r.id).x+'% '+VF.scenes.cardCrop(x.r.id).y+'%"></div><div class="detail-related__shade"></div><div class="detail-related__copy"><small>'+esc(x.why)+'</small><h3><a class="stretch" data-cursor="view" href="'+U.expLink(x.r.id)+'">'+esc(x.r.name)+'</a></h3><p>'+esc(S.locationLabel(x.r).join(' · '))+'</p></div></article>'}).join('')+'</div></div></section>'}
    $('#detailRoot').innerHTML=html;
    var save=$('#detailSave');if(save)save.addEventListener('click',function(){var on=VF.wishlist.toggle(r.id);save.textContent=on?'Saved to your list':'Save this place'});
    document.title=r.name+' · VibeFind';
    VF.reveal.init();VF.cursor.init();VF.transitions.init();VF.polish.init();
  }
  U.ready(function(){
    VF.chrome.mount('experience');
    var id=U.params().id,r=S.get(id);
    if(r)render(r);else renderMissing(id);
    VF.wishlist.onChange(function(){var r2=S.get(U.params().id),b=$('#detailSave');if(b&&r2)b.textContent=VF.wishlist.has(r2.id)?'Remove from saved':'Save this place'});
  });
})(window.VF);
