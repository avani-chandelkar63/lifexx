/* Shared by delhi.html and chandigarh.html. Each page has its own composition; data comes from VF.store. */
window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,S=VF.store,C=VF.CONFIG,$=U.$,esc=U.esc;
  var arrow=VF.cards.arrow;
  function topCats(list,n){var m={};list.forEach(function(r){r.categories.forEach(function(c){m[c]=(m[c]||0)+1})});return Object.keys(m).map(function(k){return[k,m[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,n)}
  U.ready(function(){
    var city=document.body.getAttribute('data-city'),isD=city==='delhi',recs=S.all.filter(function(r){return r.city===city}),cfg=C.cities[city],areas=S.areas(city);
    VF.chrome.mount(city);
    var api=VF.directory.init({root:'#dirRoot',lockCity:city,onChange:onChange});
    var tp=topCats(recs,1)[0];
    $('#pstats').innerHTML='<div><b class="num" data-count="'+recs.length+'">0</b><small>Places</small></div><div><b class="num" data-count="'+areas.length+'">0</b><small>Named areas</small></div>'+
      (isD?'<div><b class="num" data-count="'+S.zones('delhi').length+'">0</b><small>Zones</small></div>':'<div><b class="num" data-count="4">0</b><small>Towns</small></div>')+
      '<div><b>'+esc(C.categories[tp[0]].short)+'</b><small>Most common · '+tp[1]+'</small></div>';
    var zoneRows,regionBtns;
    if(isD){
      var zs=S.zones('delhi'),mx=Math.max.apply(null,zs.map(function(z){return z.count}));
      $('#zones').insertAdjacentHTML('beforeend',zs.map(function(z,i){var t=topCats(recs.filter(function(r){return r.zone===z.name}),1)[0];
        return '<button type="button" class="zrow" data-zone="'+esc(z.name)+'" style="--cat:'+C.categories[t[0]].hue+';--w:'+Math.round(z.count/mx*90)+'" aria-pressed="false"><span class="zn">'+String(i+1).padStart(2,'0')+'</span><span class="zt">'+esc(z.name)+'</span><span class="zc"><i></i>'+z.count+'</span></button>'}).join(''));
      zoneRows=U.$$('.zrow');
      $('#zones').addEventListener('click',function(e){var b=e.target.closest('.zrow');if(!b)return;var z=b.getAttribute('data-zone');api.set({zone:api.state().zone===z?'':z},{scroll:api.state().zone!==z})});
    }else{
      var rk=Object.keys(C.regions).filter(function(k){return C.regions[k].city==='tricity'});
      var used={};
      $('#regions').innerHTML=rk.map(function(k,i){var rr=recs.filter(function(r){return r.region===k}),tc=topCats(rr,3),cr=VF.scenes.crop('r'+k),pick=(tc.filter(function(t){return !used[t[0]]})[0]||tc[0])[0],vague=rr.filter(function(r){return r.areaIsPlaceholder}).length;
        return (used[pick]=1,'')+'<button type="button" class="region" data-region="'+k+'" style="--cat:'+C.categories[pick].hue+'" aria-pressed="false"><div class="scene scene--'+pick+'" style="background-size:'+(cr.s+60)+'%;background-position:'+cr.x+'% '+cr.y+'%"></div><span class="region__n">0'+(i+1)+'</span><span class="region__go">'+arrow+'</span>'+
        '<span class="region__j">'+esc(C.regions[k].jurisdiction)+'</span><h3>'+esc(C.regions[k].label)+'</h3><span class="region__c">'+rr.length+' places</span>'+
        '<span class="region__d">'+tc.map(function(t){return esc(C.categories[t[0]].short)+' '+t[1]}).join(' · ')+(vague?'<br>'+vague+' with a town-level location only.':'')+'</span></button>'}).join('');
      regionBtns=U.$$('.region');
      $('#regions').addEventListener('click',function(e){var b=e.target.closest('.region');if(!b)return;var k=b.getAttribute('data-region');api.set({region:api.state().region===k?'':k},{scroll:api.state().region!==k})});
      var j={};recs.forEach(function(r){j[r.jurisdiction]=(j[r.jurisdiction]||0)+1});
      $('#tnote').innerHTML=Object.keys(j).map(function(k){return '<div><b>'+esc(k)+'</b>'+j[k]+' places listed</div>'}).join('');
    }
    // A small set of popular area shortcuts; the complete searchable index stays in directory filters.
    var top=areas.slice(0,5),dup={};areas.forEach(function(a){(dup[a.name]=dup[a.name]||0);dup[a.name]++});
    $('#stripRow').innerHTML=top.map(function(a){var label=a.name+(dup[a.name]>1?' · '+a.regionLabel:'');return '<button type="button" class="strip__chip" data-area="'+a.slug+'" aria-pressed="false"><span>'+esc(label)+'</span><small>'+a.count+'</small></button>'}).join('');
    $('#stripRow').addEventListener('click',function(e){var b=e.target.closest('[data-area]');if(!b)return;var s=b.getAttribute('data-area'),on=api.state().area===s;api.set(isD?{zone:'',area:on?'':s}:{region:'',area:on?'':s},{scroll:!on});if(!on)api.set({area:s},{scroll:true})});
    var allAreasBtn=document.querySelector('[data-open-all-areas]');
    if(allAreasBtn)allAreasBtn.addEventListener('click',function(){
      var group=document.querySelector('#dirRoot [data-g="area"]');
      var openFilters=document.querySelector('#dirRoot #fOpen');
      if(window.matchMedia('(max-width:1100px)').matches&&openFilters&&!document.querySelector('#dirRoot .filters.is-open'))openFilters.click();
      window.setTimeout(function(){if(group){group.open=true;group.scrollIntoView({behavior:'smooth',block:'center'});var q=group.querySelector('#areaQ');if(q)q.focus({preventScroll:true})}else document.querySelector('#directory').scrollIntoView({behavior:'smooth'})},80);
    });
    function onChange(st){
      if(zoneRows)zoneRows.forEach(function(b){var on=st.zone===b.getAttribute('data-zone');b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on)});
      if(regionBtns)regionBtns.forEach(function(b){var on=st.region===b.getAttribute('data-region');b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on)});
      U.$$('#stripRow .strip__chip').forEach(function(b){var on=st.area===b.getAttribute('data-area');b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on)});
    }
    onChange(api.state());
    // State the coverage limitation without showing unlisted ideas as if they were venues.
    var coverage=$('#coverageNote');if(coverage)coverage.textContent=cfg.coverage;
    VF.reveal.init();VF.cursor.init();VF.transitions.init();VF.polish.init();
  });
})(window.VF);
