/* Directory engine shared by explore.html, delhi.html and chandigarh.html.
   State lives in the URL (q, city, region, zone, area, cat, sub, mood, sort, view) and is applied via VF.store. */
window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,S=VF.store,C=VF.CONFIG,$=U.$,esc=U.esc,PAGE=C.pageSize;
  var SORTS=[['best','Best match'],['az','Name A to Z'],['za','Name Z to A']];
  var csv=function(v){return v?String(v).split(',').filter(Boolean):[]};
  var SUBGROUP_ORDER=['gaming','sports','adventure','thrill','art','interactive'];

  VF.directory={init:function(opt){
    var auto=false,root=$(opt.root),lock=opt.lockCity||null,open={},st,rendered=0,list=[],sentinelIO;
    var P0=U.params();
    st={q:P0.q||'',city:lock||(P0.city==='delhi'||P0.city==='tricity'?P0.city:''),region:P0.region||'',zone:P0.zone||'',area:P0.area||'',cat:csv(P0.cat),sub:csv(P0.sub),mood:P0.mood||'',sort:P0.sort||'best',view:P0.view==='list'?'list':'grid',shown:PAGE};
    function spec(o){o=o||st;return {q:o.q,city:o.city,region:o.region,zone:o.zone,area:o.area,cat:o.cat,sub:o.sub,mood:o.mood}}
    function cnt(over){return S.filter(spec(Object.assign({},st,over))).length}
    function url(){var q={q:st.q,city:lock?'':st.city,region:st.region,zone:st.zone,area:st.area,cat:st.cat,sub:st.sub,mood:st.mood,sort:st.sort==='best'?'':st.sort,view:st.view==='grid'?'':st.view};history.replaceState(null,'',location.pathname+U.buildQuery(q))}
    function activeCount(){return (st.q?1:0)+(!lock&&st.city?1:0)+(st.region?1:0)+(st.zone?1:0)+(st.area?1:0)+st.cat.length+st.sub.length+(st.mood?1:0)}

    root.innerHTML=
      '<div class="dir">'+
      '<aside class="filters" id="filters" aria-label="Filters"><div class="filters__head"><h2>Filters</h2><button type="button" class="iconbtn" id="fClose" aria-label="Close filters">&times;</button></div><div class="filters__body" id="fBody"></div><div class="filters__foot"><button type="button" class="btn" id="fClear">Clear all</button><button type="button" class="btn btn--solid" id="fApply">Show results</button></div></aside>'+
      '<div class="results"><div class="toolbar"><div class="tsearch"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><label class="vh" for="dq">Search this directory</label><input id="dq" type="search" placeholder="Search names, areas, activities" autocomplete="off"><button type="button" id="dqClear" class="iconbtn" aria-label="Clear search" hidden>&times;</button></div>'+
      '<div class="toolbar__row"><button type="button" class="btn fbtn" id="fOpen" aria-controls="filters">Filters <b id="fN">0</b></button>'+
      '<label class="sort"><span class="vh">Sort</span><select id="dSort">'+SORTS.map(function(s){return '<option value="'+s[0]+'">'+s[1]+'</option>'}).join('')+'</select></label>'+
      '<div class="views" role="group" aria-label="Layout"><button type="button" data-view="grid" aria-label="Grid view"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></button><button type="button" data-view="list" aria-label="List view"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="1.5"/><rect x="3" y="10" width="18" height="4" rx="1.5"/><rect x="3" y="16" width="18" height="4" rx="1.5"/></svg></button></div></div></div>'+
      '<div class="rhead"><h2 id="rTitle" class="rtitle"></h2><p id="rLive" class="rlive" aria-live="polite"></p></div>'+
      '<div class="achips" id="aChips"></div>'+
      '<div class="grid" id="grid"></div><div class="empty" id="empty" hidden></div>'+
      '<div class="loadmore"><button type="button" class="btn" id="loadMore" hidden>Show more</button><p id="moreInfo" class="rlive"></p><div id="sentinel" aria-hidden="true"></div></div></div></div>';
    var el={fb:$('#fBody',root),grid:$('#grid',root),empty:$('#empty',root),chips:$('#aChips',root),title:$('#rTitle',root),live:$('#rLive',root),more:$('#loadMore',root),info:$('#moreInfo',root),q:$('#dq',root),sort:$('#dSort',root),fN:$('#fN',root),filters:$('#filters',root)};

    function set(patch,o){
      o=o||{};Object.assign(st,patch);
      if('city' in patch&&!('region' in patch)){st.region='';st.zone='';st.area=''}
      if('region' in patch&&!('area' in patch))st.area='';
      if('zone' in patch&&!('area' in patch))st.area='';
      if(lock)st.city=lock;
      // drop selected subs that no longer belong to selected categories
      st.shown=PAGE;url();renderAll();
      if(o.scroll)scrollToDir();
    }
    function scrollToDir(){var t=$('#directory')||root;window.scrollTo({top:t.getBoundingClientRect().top+scrollY-(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||72)-8,behavior:U.reduceMotion()?'auto':'smooth'})}

    /* ---------- filters panel ---------- */
    function grp(id,title,body,n){var expanded=Object.prototype.hasOwnProperty.call(open,id)?open[id]:(id==='area'?!!st.area:true);return '<details class="fg" data-g="'+id+'"'+(expanded?' open':'')+'><summary>'+title+(n?'<em>'+n+'</em>':'')+'</summary><div class="fg__b">'+body+'</div></details>'}
    function chip(f,v,label,n,on){return '<button type="button" class="fchip'+(on?' is-on':'')+'" data-f="'+f+'" data-v="'+esc(v)+'" aria-pressed="'+!!on+'"'+(n===0&&!on?' disabled':'')+'>'+esc(label)+(n!=null?'<sup>'+n+'</sup>':'')+'</button>'}
    function optRow(f,v,label,n,on,hue){return '<label class="opt'+(n===0&&!on?' is-zero':'')+'"><input type="checkbox" data-f="'+f+'" data-v="'+esc(v)+'"'+(on?' checked':'')+(n===0&&!on?' disabled':'')+'><span class="opt__box"'+(hue?' style="--h:'+hue+'"':'')+'></span><span class="opt__t">'+esc(label)+'</span><small>'+n+'</small></label>'}
    function renderFilters(){
      var f=document.activeElement&&el.fb.contains(document.activeElement)?{f:document.activeElement.getAttribute('data-f'),v:document.activeElement.getAttribute('data-v')}:null;
      var h='';
      if(!lock){h+=grp('city','Where',chip('city','','Everywhere',cnt({city:'',region:'',zone:'',area:''}),!st.city)+['delhi','tricity'].map(function(k){return chip('city',k,C.cities[k].label,cnt({city:k,region:'',zone:'',area:''}),st.city===k)}).join(''))}
      var city=lock||st.city;
      if(city==='tricity'){h+=grp('region','Town',Object.keys(C.regions).filter(function(k){return C.regions[k].city==='tricity'}).map(function(k){return chip('region',k,C.regions[k].label,cnt({region:st.region===k?'':k,area:''}),st.region===k)}).join(''))}
      if(city==='delhi'){h+=grp('zone','Zone',S.zones('delhi').map(function(z){return chip('zone',z.name,z.name,cnt({zone:st.zone===z.name?'':z.name,area:''}),st.zone===z.name)}).join(''))}
      h+=grp('cat','Category',Object.keys(C.categories).map(function(k){return optRow('cat',k,C.categories[k].label,cnt({cat:[k]}),st.cat.indexOf(k)>-1,C.categories[k].hue)}).join(''),st.cat.length||0);
      var subs=S.subsFor(null).filter(function(x){return !st.cat.length||st.cat.indexOf(x.cat)>-1});
      var sh='';SUBGROUP_ORDER.forEach(function(c){var ss=subs.filter(function(x){return x.cat===c});if(!ss.length)return;sh+='<div class="sgroup"><h4>'+esc(C.categories[c].short)+'</h4>'+ss.map(function(x){return optRow('sub',x.key,x.label,cnt({sub:[x.key]}),st.sub.indexOf(x.key)>-1)}).join('')+'</div>'});
      h+=grp('sub','Activity',sh,st.sub.length||0);
      var mo=S.moods();h+=grp('mood','Mood',mo.map(function(m){return chip('mood',m.label,m.label,cnt({mood:st.mood===m.label?'':m.label}),st.mood===m.label)}).join(''));
      // area list scoped by where
      var areas=S.areas(city||'delhi');if(!city)areas=S.areas('delhi').concat(S.areas('tricity'));
      areas=areas.filter(function(a){return (!st.region||a.region===st.region)&&(!st.zone||a.zone===st.zone)});
      var dup={};areas.forEach(function(a){dup[a.name]=(dup[a.name]||0)+1});
      var rows=areas.map(function(a){var n=cnt({area:a.slug}),on=st.area===a.slug;return '<button type="button" class="arow'+(on?' is-on':'')+'" data-f="area" data-v="'+a.slug+'" data-n="'+esc(U.norm(a.name))+'" aria-pressed="'+on+'"'+(n===0&&!on?' disabled':'')+'><span>'+esc(a.name+((dup[a.name]>1||!city)&&a.region!=='delhi'?' · '+a.regionLabel:''))+'</span><small>'+n+'</small></button>'}).join('');
      h+=grp('area','Area ('+areas.length+')','<div class="areafind"><label class="vh" for="areaQ">Find an area</label><input id="areaQ" type="search" placeholder="Find an area" autocomplete="off"></div><div class="arealist" id="areaList">'+rows+'</div>',st.area?1:0);
      el.fb.innerHTML=h;
      if(f){var t=el.fb.querySelector('[data-f="'+f.f+'"][data-v="'+(f.v||'').replace(/"/g,'\\"')+'"]');if(t&&!t.disabled)t.focus()}
    }

    /* ---------- results ---------- */
    function title(){
      var c=lock||st.city,bits=[];
      var where=st.area?(S.areas(c||'delhi').concat(S.areas('tricity')).filter(function(a){return a.slug===st.area})[0]||{}).name:(st.region?C.regions[st.region].label:(st.zone||(c?C.cities[c].label:'Delhi & Chandigarh Tricity')));
      return where;
    }
    function renderResults(full){
      list=S.query(spec(),st.sort);
      var n=list.length;
      el.title.innerHTML='<span class="num" id="rCount">'+n+'</span> '+(n===1?'place':'places')+' <em>'+esc(title())+'</em>';
      el.live.textContent=n+(n===1?' place':' places')+' match'+(n===1?'es':'')+' your filters.';
      var rd=function(){return st.shown};
      if(full){el.grid.innerHTML='';rendered=0}
      el.grid.className='grid grid--'+st.view;
      var upto=Math.min(n,st.shown),html='';
      for(var i=rendered;i<upto;i++)html+=VF.cards.card(list[i],i-rendered);
      el.grid.insertAdjacentHTML('beforeend',html);rendered=upto;
      if(html)VF.reveal.scan(el.grid);
      el.empty.hidden=n>0;if(full)auto=auto&&false;el.grid.hidden=n===0;
      if(!n){el.empty.innerHTML='<h3>Nothing matches that combination.</h3><p>Try removing a filter or searching something broader.</p><div class="empty__row"><button type="button" class="btn btn--solid" data-act="clear">Clear all filters</button>'+['snooker','VR','pickleball','escape'].map(function(t){return '<button type="button" class="chip" data-act="try" data-v="'+t+'">'+t+'</button>'}).join('')+'</div>'}
      var left=n-upto;el.more.hidden=left<=0;el.more.textContent='Show '+Math.min(PAGE,left)+' more';
      el.info.textContent=n?('Showing '+upto+' of '+n):'';
    }
    function renderChips(){
      var c=[],city=lock||st.city;
      function add(f,v,label){c.push('<button type="button" class="achip" data-rm="'+f+'" data-v="'+esc(v)+'">'+esc(label)+' <span aria-hidden="true">&times;</span><span class="vh">remove filter</span></button>')}
      if(st.q)add('q','','“'+st.q+'”');
      if(!lock&&st.city)add('city','',C.cities[st.city].label);
      if(st.region)add('region','',C.regions[st.region].label);
      if(st.zone)add('zone','',st.zone);
      if(st.area){var a=S.areas('delhi').concat(S.areas('tricity')).filter(function(x){return x.slug===st.area})[0];add('area','',a?a.name:st.area)}
      st.cat.forEach(function(k){if(C.categories[k])add('cat',k,C.categories[k].label)});
      st.sub.forEach(function(k){if(S.meta.subs[k])add('sub',k,S.meta.subs[k].label)});
      if(st.mood)add('mood','',st.mood);
      el.chips.innerHTML=c.join('')+(c.length>1?'<button type="button" class="achip achip--clear" data-act="clear">Clear all</button>':'');
      el.fN.textContent=activeCount();$('#fApply',root).textContent='Show '+list.length+' results';
    }
    function renderAll(){
      if(el.q.value!==st.q)el.q.value=st.q;$('#dqClear',root).hidden=!st.q;el.sort.value=st.sort;
      U.$$('.views button',root).forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-view')===st.view)});
      renderResults(true);renderFilters();renderChips();
      if(opt.onChange)opt.onChange(st);
    }

    /* ---------- events ---------- */
    function toggleArr(arr,v){var i=arr.indexOf(v);return i>-1?arr.filter(function(x){return x!==v}):arr.concat(v)}
    function clearAll(){set({q:'',city:lock||'',region:'',zone:'',area:'',cat:[],sub:[],mood:''})}
    root.addEventListener('click',function(e){
      var t=e.target.closest('[data-f],[data-rm],[data-act],[data-view]');if(!t)return;
      if(t.hasAttribute('data-view')){st.view=t.getAttribute('data-view');url();renderAll();return}
      var act=t.getAttribute('data-act');
      if(act==='clear'){clearAll();return}if(act==='try'){set({q:t.getAttribute('data-v')});return}
      var rm=t.getAttribute('data-rm');
      if(rm){var v=t.getAttribute('data-v');if(rm==='cat')set({cat:st.cat.filter(function(x){return x!==v})});else if(rm==='sub')set({sub:st.sub.filter(function(x){return x!==v})});else if(rm==='q')set({q:''});else{var p={};p[rm]='';set(p)}return}
      var f=t.getAttribute('data-f'),v=t.getAttribute('data-v');
      if(t.type==='checkbox')return; // handled on change
      if(f==='city')set({city:v});
      else if(f==='region')set({region:st.region===v?'':v});
      else if(f==='zone')set({zone:st.zone===v?'':v});
      else if(f==='mood')set({mood:st.mood===v?'':v});
      else if(f==='area')set({area:st.area===v?'':v});
    });
    root.addEventListener('change',function(e){var t=e.target;if(t.type!=='checkbox')return;var f=t.getAttribute('data-f'),v=t.getAttribute('data-v');
      if(f==='cat'){var nc=toggleArr(st.cat,v);var keep=st.sub.filter(function(s){return !nc.length||nc.indexOf(S.meta.subs[s].cat)>-1});set({cat:nc,sub:keep})}
      else if(f==='sub')set({sub:toggleArr(st.sub,v)});
    });
    root.addEventListener('toggle',function(e){var g=e.target.getAttribute&&e.target.getAttribute('data-g');if(g)open[g]=e.target.open},true);
    root.addEventListener('input',function(e){
      if(e.target.id==='areaQ'){var q=U.norm(e.target.value);U.$$('.arow',root).forEach(function(b){b.hidden=q&&b.getAttribute('data-n').indexOf(q)<0})}
    });
    el.q.addEventListener('input',U.debounce(function(){set({q:el.q.value.trim()})},180));
    $('#dqClear',root).addEventListener('click',function(){set({q:''});el.q.focus()});
    el.sort.addEventListener('change',function(){st.sort=el.sort.value;st.shown=PAGE;url();renderAll()});
    el.more.addEventListener('click',function(){auto=true;st.shown+=PAGE;renderResults(false)});
    // auto-load as the sentinel nears the viewport
    if('IntersectionObserver' in window){sentinelIO=new IntersectionObserver(function(es){if(auto&&es[0].isIntersecting&&rendered<list.length){st.shown+=PAGE;renderResults(false)}},{rootMargin:'500px'});sentinelIO.observe($('#sentinel',root))}
    // mobile sheet
    var scrim=document.createElement('div');scrim.className='scrim fscrim';document.body.appendChild(scrim);
    function sheet(o){el.filters.classList.toggle('is-open',o);scrim.classList.toggle('is-on',o);document.body.style.overflow=o?'hidden':'';if(o)$('#fClose',root).focus();else $('#fOpen',root).focus()}
    $('#fOpen',root).addEventListener('click',function(){sheet(true)});$('#fClose',root).addEventListener('click',function(){sheet(false)});$('#fApply',root).addEventListener('click',function(){sheet(false)});scrim.addEventListener('click',function(){sheet(false)});
    $('#fClear',root).addEventListener('click',clearAll);
    addEventListener('keydown',function(e){if(e.key==='Escape'&&el.filters.classList.contains('is-open'))sheet(false)});

    renderAll();
    var api={set:set,state:function(){return st},scrollToDir:scrollToDir,count:function(){return list.length}};
    VF.directory.api=api;return api;
  }};
})(window.VF);
