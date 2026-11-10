window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,S=VF.store,C=VF.CONFIG,P=C.pages,$=U.$,esc=U.esc;
  var ORDER=['gaming','sports','thrill','adventure','art','interactive'];
  var arrow=VF.cards.arrow;
  function explore(o){return P.explore+U.buildQuery(o)}
  var total=S.all.length;

  function hero(){
    $('#heroCount').textContent=total;
    var stage=$('#stage'),dots=$('#stageDots'),orb=$('#orbScene'),i=0,timer;
    stage.insertAdjacentHTML('afterbegin',ORDER.map(function(k,n){var c=C.categories[k];
      return '<div class="stage__slide'+(n?'':' is-active')+'" data-k="'+k+'"><div class="scene scene--'+k+'" role="img" aria-label="Designed '+esc(c.short)+' artwork"></div></div>'}).join(''));
    dots.innerHTML=ORDER.map(function(k,n){return '<i'+(n?'':' class="is-on"')+'></i>'}).join('');
    var cap=$('#stageCap');
    function set(n){i=n;var k=ORDER[n],c=C.categories[k];
      U.$$('.stage__slide',stage).forEach(function(s,x){s.classList.toggle('is-active',x===n)});
      U.$$('i',dots).forEach(function(d,x){d.classList.remove('is-on');if(x===n){void d.offsetWidth;d.classList.add('is-on')}});
      cap.querySelector('span').textContent=String(n+1).padStart(2,'0')+' / '+String(ORDER.length).padStart(2,'0');
      cap.querySelector('b').textContent=c.label+' · '+S.catCount(k);
      cap.querySelector('a').href=explore({cat:k});cap.querySelector('a').setAttribute('aria-label','Browse '+c.label);
      var nx=ORDER[(n+1)%ORDER.length];orb.className='scene scene--'+nx;orb.style.backgroundPosition=(20+n*13)%100+'% '+(10+n*17)%100+'%';}
    function loop(){clearTimeout(timer);if(U.reduceMotion())return;timer=setTimeout(function(){if(!document.hidden)set((i+1)%ORDER.length);loop()},5500)}
    set(0);loop();
    dots.addEventListener('click',function(e){var x=U.$$('i',dots).indexOf(e.target);if(x>-1){set(x);loop()}});
    // ticker
    var items=ORDER.map(function(k){return '<span><b>'+esc(C.categories[k].label)+'</b> '+S.catCount(k)+'</span>'}).join('');
    var t=$('#ticker');t.innerHTML='<span><b>'+total+'</b> places</span>'+items+'<span>Delhi</span><span>Chandigarh</span><span>Mohali</span><span>Zirakpur</span><span>Panchkula</span>';t.innerHTML+=t.innerHTML;
  }

  function search(){
    var inp=$('#q'),box=$('#suggest'),form=$('#searchForm'),sel=-1,list=[];
    function close(){box.classList.remove('is-open');inp.setAttribute('aria-expanded','false');sel=-1}
    var show=U.debounce(function(){
      var q=inp.value.trim();list=S.suggest(q,6);
      if(!q||U.norm(q).length<2){close();return}
      box.innerHTML=list.length?list.map(function(r,n){return '<a href="'+U.expLink(r.id)+'" role="option" data-n="'+n+'"><b>'+esc(r.name)+'</b><small>'+esc(VF.cards.locText(r))+'</small></a>'}).join('')+'<a href="'+explore({q:q})+'"><b>See all results for “'+esc(q)+'”</b><small>Explore →</small></a>':'<div class="none">No matches for “'+esc(q)+'”. Try “snooker”, “VR” or “pickleball”.</div>';
      box.classList.add('is-open');inp.setAttribute('aria-expanded','true');sel=-1;
    },120);
    inp.addEventListener('input',show);
    inp.addEventListener('keydown',function(e){var as=U.$$('a',box);if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!as.length)return;e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+as.length)%as.length;as.forEach(function(a,n){a.classList.toggle('is-sel',n===sel)})}else if(e.key==='Enter'&&sel>-1&&as[sel]){e.preventDefault();location.href=as[sel].href}else if(e.key==='Escape')close()});
    document.addEventListener('click',function(e){if(!e.target.closest('.search'))close()});
    form.addEventListener('submit',function(e){e.preventDefault();location.href=explore({q:inp.value.trim()})});
    $('#chips').innerHTML=['snooker','VR','pickleball','escape rooms','pottery','go-karting'].map(function(t){return '<a class="chip" href="'+explore({q:t})+'">'+esc(t)+'</a>'}).join('');
  }

  function statement(){
    var areas=S.areas('delhi').length+S.areas('tricity').length;
    var st=[[total,'Places listed'],[areas,'Named neighbourhoods'],[Object.keys(C.regions).length,'Towns & regions'],[ORDER.length,'Activity types']];
    $('#stats').innerHTML=st.map(function(s){return '<div class="stat"><b class="num" data-count="'+s[0]+'">0</b><small>'+s[1]+'</small></div>'}).join('');
  }

  function cities(){
    var cfg=[['delhi','gaming'],['tricity','sports']];
    $('#cityGrid').innerHTML=cfg.map(function(c,n){var k=c[0],ci=C.cities[k],cnt=S.all.filter(function(r){return r.city===k}).length,ar=S.areas(k).length,top=ORDER.map(function(x){return [x,S.catCount(x,k)]}).sort(function(a,b){return b[1]-a[1]})[0];
      return '<a class="city" href="'+ci.page+'" data-reveal="mask" data-cursor="open"><div class="scene scene--'+c[1]+'" role="img" aria-label="Designed artwork"></div><span class="city__n">0'+(n+1)+'</span>'+
      '<h3>'+esc(ci.label.split(' ')[0])+'</h3><span class="city__sub">'+esc(ci.long)+'</span><p>'+esc(ci.line)+'</p><div class="city__meta"><span><b>'+cnt+'</b>places</span><span><b>'+ar+'</b>named areas</span><span><b>'+esc(C.categories[top[0]].short)+'</b>most common</span></div><span class="btn btn--solid">Explore '+esc(ci.label.split(' ')[0])+' '+arrow+'</span></a>'}).join('');
  }

  function featured(){
    // source quick-pick lists, interleaved across cities and moods so the rail varies
    var pool=S.featured(),by={},out=[],seen={};
    pool.forEach(function(r){var key=r.city+'|'+r.moods[0];(by[key]=by[key]||[]).push(r)});
    var keys=Object.keys(by),n=0;while(out.length<14&&n<10){keys.forEach(function(k){var r=by[k][n];if(r&&!seen[r.id]&&out.length<14){seen[r.id]=1;out.push(r)}});n++}
    $('#rail').innerHTML=out.map(function(r){return VF.cards.featured(r,r.moods[0])}).join('');
    var rail=$('#rail'),down=false,sx=0,sl=0,moved=false;
    rail.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=rail.scrollLeft;rail.classList.add('is-drag')});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4)moved=true;rail.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){down=false;rail.classList.remove('is-drag')});
    rail.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  }

  function categories(){
    var peek=$('#peek'),list=$('#catlist');
    list.innerHTML=ORDER.map(function(k,n){var c=C.categories[k];
      return '<a class="catrow" href="'+explore({cat:k})+'" data-k="'+k+'" style="--cat:'+c.hue+'" data-reveal><span class="catrow__n">0'+(n+1)+'</span><span class="catrow__t">'+esc(c.label)+'</span><span class="catrow__l">'+esc(c.line)+'</span><span class="catrow__c">'+S.catCount(k)+' <i>'+arrow+'</i></span><span class="catrow__thumb scene scene--'+k+'"></span></a>'}).join('');
    if(!U.finePointer())return;
    var x=0,y=0,tx=0,ty=0,run=false;
    function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;peek.style.transform='translate3d('+(x+28)+'px,'+(y-120)+'px,0) scale(1) rotate(-3deg)';if(run)requestAnimationFrame(loop)}
    list.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY});
    list.addEventListener('pointerover',function(e){var r=e.target.closest('.catrow');if(!r)return;peek.firstElementChild.className='scene scene--'+r.getAttribute('data-k');peek.classList.add('is-on');if(!run){run=true;x=tx;y=ty;requestAnimationFrame(loop)}});
    list.addEventListener('pointerleave',function(){peek.classList.remove('is-on');run=false});
  }

  function moods(){
    $('#moods').innerHTML=S.moods().map(function(m){return '<a class="mood" href="'+explore({mood:m.label})+'" data-reveal>'+esc(m.label)+'<sup>'+m.count+'</sup></a>'}).join('');
  }

  function collections(){
    $('#colls').innerHTML=C.collections.map(function(c,n){var cnt=S.count(c.filter);
      return '<a class="coll" href="'+explore({sub:c.filter.sub})+'" data-reveal data-cursor="open" style="--d:'+(n%3)+'"><div class="scene scene--'+c.scene+'" style="'+(function(){var k=VF.scenes.crop(c.id);return 'background-size:'+(k.s+40)+'%;background-position:'+k.x+'% '+k.y+'%'})()+'"></div><span class="coll__c">'+cnt+' places</span><div><h3>'+esc(c.title)+'</h3><p>'+esc(c.blurb)+'</p></div></a>'}).join('');
  }

  function areas(){
    ['delhi','tricity'].forEach(function(k){
      var all=S.areas(k),max=all.length?all[0].count:1;
      var featured=all.slice(0,4);
      function context(a){return k==='delhi'?(a.zone||'Delhi NCT'):(a.regionLabel||a.jurisdiction||'Chandigarh Tricity')}
      function href(a){return explore({city:k,area:a.slug})}
      $('#areas-'+k).innerHTML=featured.map(function(a,n){
        var pct=Math.max(8,Math.round(a.count/max*100));
        return '<a class="area-atlas__feature" href="'+href(a)+'"><span class="area-atlas__rank">0'+(n+1)+'</span><span class="area-atlas__featurecopy"><b>'+esc(a.name)+'</b><small>'+esc(context(a))+'</small><i style="--area-fill:'+pct+'%"></i></span><span class="area-atlas__count">'+a.count+'<small>'+(a.count===1?'place':'places')+'</small></span></a>';
      }).join('');
      var list=all.map(function(a){return '<a class="area-atlas__item" href="'+href(a)+'" data-area-name="'+esc(U.norm(a.name+' '+context(a)))+'"><span><b>'+esc(a.name)+'</b><small>'+esc(context(a))+'</small></span><em>'+a.count+'</em></a>'}).join('');
      var listEl=document.querySelector('[data-area-list="'+k+'"]');if(listEl)listEl.innerHTML=list;
      var countEl=$('#areasN-'+k);if(countEl)countEl.textContent=all.length;
    });
    var atlas=$('#areaAtlas');
    if(atlas){
      atlas.addEventListener('input',function(e){
        var field=e.target.closest('[data-area-search]');if(!field)return;
        var city=field.getAttribute('data-area-search'),q=U.norm(field.value),list=document.querySelector('[data-area-list="'+city+'"]'),items=U.$$('.area-atlas__item',list),visible=0;
        items.forEach(function(item){var show=!q||item.getAttribute('data-area-name').indexOf(q)>-1;item.hidden=!show;if(show)visible++});
        var none=document.querySelector('[data-area-none="'+city+'"]');if(none)none.hidden=visible!==0;
      });
      atlas.addEventListener('toggle',function(e){var d=e.target;if(!d.matches('.area-atlas__all'))return;var input=d.querySelector('[data-area-search]');if(d.open&&input)input.focus({preventScroll:true})},true);
    }
  }

  U.ready(function(){
    VF.chrome.mount('home');
    hero();search();statement();cities();featured();categories();moods();collections();areas();
    // split-line groups need the same trigger as data-reveal
    VF.reveal.init();VF.parallax.init();VF.cursor.init();VF.transitions.init();VF.polish.init();
  });
})(window.VF);
