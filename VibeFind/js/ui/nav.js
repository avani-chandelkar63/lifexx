/* Shared chrome: nav, mobile menu, saved drawer, footer, wipe + cursor nodes. Call VF.chrome.mount('home'). */
window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,C=VF.CONFIG,P=C.pages;
  var links=[['explore','Explore'],['delhi','Delhi'],['tricity','Chandigarh Tricity'],['about','About'],['contact','Contact']];
  var heart='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.7 4 4.5 7.3 4.5c1.900 0 3.500 1 4.700 2.700 1.200-1.700 2.800-2.700 4.700-2.700 3.300 0 5.600 3.200 4.500 6.600-1.700 4.800-9.200 9.400-9.200 9.400z"/></svg>';
  function navLinks(cur,cls){return links.map(function(l){return '<a href="'+P[l[0]]+'"'+(cur===l[0]?' aria-current="page"':'')+'>'+l[1]+'</a>'}).join('')}
  VF.chrome={
    mount:function(cur){
      var S=VF.store;
      var d=document;
      d.body.insertAdjacentHTML('afterbegin',
        '<a class="skip" href="#main">Skip to content</a>'+
        '<header class="nav" id="nav"><div class="wrap nav__in"><a class="logo" href="'+P.home+'" aria-label="VibeFind home"><i></i>VibeFind</a>'+
        '<nav class="nav__links" aria-label="Main">'+navLinks(cur)+'</nav>'+
        '<div class="nav__right"><button class="nav__saved" id="savedBtn" type="button" aria-haspopup="dialog" aria-controls="drawer">'+heart+'<span>Saved</span><b id="savedN" data-n="0">0</b></button>'+
        '<button class="nav__burger" id="burger" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span></button></div></div></header>'+
        '<div class="mmenu" id="mmenu" aria-hidden="true"><nav aria-label="Mobile">'+links.map(function(l){return '<a href="'+P[l[0]]+'">'+l[1]+'</a>'}).join('')+'</nav><small>Delhi · Chandigarh · Mohali · Zirakpur · Panchkula</small></div>');
      d.body.insertAdjacentHTML('beforeend',
        '<div class="scrim" id="scrim"></div><aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Saved experiences"><div class="drawer__head"><h2>Saved <span class="accent" id="drawerN"></span></h2><button class="iconbtn" id="drawerClose" type="button" aria-label="Close saved list">&times;</button></div><div class="drawer__body" id="drawerBody"></div></aside>'+
        '<footer class="foot"><div class="wrap"><div class="foot__grid"><div><a class="logo" href="'+P.home+'"><i></i>VibeFind</a><p>One place for things to do in Delhi and the Chandigarh tricity. Made for the curious generation.</p></div>'+
        '<div><h4>Explore</h4><ul><li><a href="'+P.explore+'">All experiences</a></li><li><a href="'+P.delhi+'">Delhi</a></li><li><a href="'+P.tricity+'">Chandigarh Tricity</a></li></ul></div>'+
        '<div><h4>Browse</h4><ul>'+Object.keys(C.categories).map(function(k){return '<li><a href="'+P.explore+'?cat='+k+'">'+C.categories[k].short+'</a></li>'}).join('')+'</ul></div>'+
        '<div><h4>VibeFind</h4><ul><li><a href="'+P.about+'">About</a></li><li><a href="'+P.contact+'">Contact</a></li></ul></div></div>'+
        '<div class="foot__legal"><span>VibeFind · a student project. Listings were collected from public sources; check timings and prices before you go.</span><span>Visuals are designed category art, not photos of venues.</span></div></div></footer>'+
        '<div class="wipe" id="wipe" aria-hidden="true"><span>VibeFind</span></div>');
      var nav=U.$('#nav'),last=0;
      addEventListener('scroll',function(){var y=scrollY;nav.classList.toggle('is-solid',y>40);nav.classList.toggle('is-hidden',y>last&&y>500&&!d.documentElement.classList.contains('menu-open'));last=y},{passive:true});
      var burger=U.$('#burger'),mm=U.$('#mmenu'),root=d.documentElement;
      burger.addEventListener('click',function(){var o=root.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o);mm.setAttribute('aria-hidden',!o)});
      // saved drawer
      var dr=U.$('#drawer'),sc=U.$('#scrim'),body=U.$('#drawerBody');
      function render(){var ids=VF.wishlist.ids();U.$('#savedN').textContent=ids.length;U.$('#savedN').setAttribute('data-n',ids.length);U.$('#drawerN').textContent=ids.length?'('+ids.length+')':'';
        body.innerHTML=ids.length?ids.map(function(id){return S.get(id)}).filter(Boolean).map(VF.cards.mini).join(''):'<p class="drawer__empty">Nothing saved yet. Tap the heart on any experience to keep it here.</p>'}
      function open(o){dr.classList.toggle('is-open',o);sc.classList.toggle('is-on',o);if(o){render();U.$('#drawerClose').focus()}else U.$('#savedBtn').focus()}
      U.$('#savedBtn').addEventListener('click',function(){open(true)});U.$('#drawerClose').addEventListener('click',function(){open(false)});sc.addEventListener('click',function(){open(false)});
      addEventListener('keydown',function(e){if(e.key==='Escape'){open(false);root.classList.remove('menu-open')}});
      VF.wishlist.onChange(function(){render()});render();
      // Mount the global Vibe Shuffle once the shared site chrome exists.
      if(VF.shuffle&&typeof VF.shuffle.mount==='function'&&['home','explore','delhi','tricity'].indexOf(cur)>-1)VF.shuffle.mount();
    }
  };
})(window.VF);
