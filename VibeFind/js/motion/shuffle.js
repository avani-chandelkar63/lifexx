/* Vibe Shuffle — discover one real listing from the live VibeFind dataset. */
window.VF=window.VF||{};
(function(VF){
  var mounted=false;
  var ORDER=['gaming','sports','thrill','adventure','art','interactive'];
  var ICONS={
    gaming:'◈',sports:'⌁',thrill:'✳',adventure:'↗',art:'✦',interactive:'◎'
  };
  VF.shuffle={
    mount:function(){
      if(mounted||!VF.store||!VF.CONFIG||!VF.cards)return;
      mounted=true;
      var U=VF.utils,S=VF.store,C=VF.CONFIG,d=document;
      var trigger=d.createElement('button');
      trigger.type='button';trigger.className='vf-shuffle-launch';trigger.id='vfShuffleLaunch';
      trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls','vfShuffle');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Shuffle a vibe');trigger.setAttribute('title','Shuffle a vibe');trigger.setAttribute('data-cursor','open');
      trigger.innerHTML='<span class="vf-shuffle-launch__mark" aria-hidden="true"><i></i><i></i><i></i></span><span class="vf-shuffle-launch__copy"><small>CAN\'T PICK?</small><b>Shuffle a vibe</b></span><span class="vf-shuffle-launch__arrow" aria-hidden="true">↗</span>';
      d.body.appendChild(trigger);

      var dialog=d.createElement('dialog');dialog.className='vf-shuffle';dialog.id='vfShuffle';dialog.setAttribute('aria-labelledby','vfShuffleTitle');
      dialog.innerHTML='<div class="vf-shuffle__shell">'+
        '<div class="vf-shuffle__top"><span class="vf-shuffle__eyebrow"><i></i> THE VIBEFIND RANDOMIZER</span><button class="vf-shuffle__close" type="button" aria-label="Close Vibe Shuffle">×</button></div>'+
        '<div class="vf-shuffle__intro"><p class="vf-shuffle__index">A LITTLE LESS PLANNING / A LITTLE MORE DOING</p><h2 id="vfShuffleTitle">Let the next plan<br><em>find you.</em></h2><p>Pick a city and a kind of energy. We’ll pull a real place from the VibeFind directory.</p></div>'+
        '<div class="vf-shuffle__controls"><fieldset class="vf-shuffle__field"><legend>01 / WHERE?</legend><div class="vf-shuffle__choices" id="vfShuffleCities"><button type="button" data-city="all" class="is-active" aria-pressed="true">Anywhere</button><button type="button" data-city="delhi" aria-pressed="false">Delhi</button><button type="button" data-city="tricity" aria-pressed="false">Tricity</button></div></fieldset>'+
        '<fieldset class="vf-shuffle__field"><legend>02 / WHAT’S THE ENERGY?</legend><div class="vf-shuffle__categories" id="vfShuffleCats"><button type="button" data-cat="all" class="is-active" aria-pressed="true">Anything goes</button>'+ORDER.map(function(k){return '<button type="button" data-cat="'+k+'" aria-pressed="false"><i>'+ICONS[k]+'</i>'+U.esc(C.categories[k].short)+'</button>'}).join('')+'</div></fieldset></div>'+
        '<div class="vf-shuffle__bottom"><span class="vf-shuffle__count" id="vfShuffleCount">258 real listings to explore</span><button class="vf-shuffle__go" id="vfShuffleGo" type="button"><span>Find my next plan</span><i aria-hidden="true">↗</i></button></div>'+
        '<div class="vf-shuffle__result" id="vfShuffleResult" aria-live="polite" aria-atomic="true"><div class="vf-shuffle__empty"><span>01</span><b>Your next story is somewhere in here.</b><small>Choose your filters, then let us shuffle.</small></div></div>'+
        '<p class="vf-shuffle__footnote">A random discovery from our researched listings. Details may change — check with the venue before visiting.</p>'+
        '</div>';
      d.body.appendChild(dialog);

      var state={city:'all',cat:'all',last:null};
      var cityWrap=U.$('#vfShuffleCities',dialog),catWrap=U.$('#vfShuffleCats',dialog),count=U.$('#vfShuffleCount',dialog),result=U.$('#vfShuffleResult',dialog),go=U.$('#vfShuffleGo',dialog),close=U.$('.vf-shuffle__close',dialog);
      function spec(){return{city:state.city==='all'?null:state.city,cat:state.cat==='all'?[]:[state.cat]}}
      function matches(){return S.query(spec(),'best')}
      function updateCount(){var n=S.count(spec());count.textContent=n+' real '+(n===1?'listing':'listings')+' to explore';go.disabled=!n}
      function setPressed(w,attr,value){U.$$('button['+attr+']',w).forEach(function(b){var on=b.getAttribute(attr)===value;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',on?'true':'false')})}
      cityWrap.addEventListener('click',function(e){var b=e.target.closest('button[data-city]');if(!b)return;state.city=b.getAttribute('data-city');setPressed(cityWrap,'data-city',state.city);updateCount();clearResult()});
      catWrap.addEventListener('click',function(e){var b=e.target.closest('button[data-cat]');if(!b)return;state.cat=b.getAttribute('data-cat');setPressed(catWrap,'data-cat',state.cat);updateCount();clearResult()});
      function clearResult(){result.innerHTML='<div class="vf-shuffle__empty"><span>↗</span><b>Ready for a different kind of plan?</b><small>Hit the button when you’re ready.</small></div>'}
      function pick(){
        var pool=matches();
        if(!pool.length){result.innerHTML='<div class="vf-shuffle__empty"><span>—</span><b>No listings match those filters yet.</b><small>Try another city or activity.</small></div>';return}
        var candidates=pool.filter(function(r){return r.id!==state.last});
        if(!candidates.length)candidates=pool;
        var r=candidates[Math.floor(Math.random()*candidates.length)];state.last=r.id;
        var cat=r.categories&&r.categories.length?r.categories[0]:'interactive';
        var catLabel=C.categories[cat]?C.categories[cat].label:'Experience';
        var crop=VF.scenes&&VF.scenes.crop?VF.scenes.crop(r.id):{s:100,x:50,y:50};
        var acts=(r.activities||[]).slice(0,3);
        var loc=S.locationLabel(r).join(' · ');
        var map=r.mapUrl?'<a class="vf-shuffle__map" href="'+U.esc(r.mapUrl)+'" target="_blank" rel="noopener noreferrer">Open map ↗</a>':'';
        result.innerHTML='<article class="vf-shuffle__pick"><div class="vf-shuffle__art scene scene--'+U.esc(cat)+'" style="background-size:'+crop.s+'%;background-position:'+crop.x+'% '+crop.y+'%"><span class="vf-shuffle__arttag">YOUR RANDOM PICK</span><span class="vf-shuffle__artnum">VF / '+U.esc(r.id)+'</span></div><div class="vf-shuffle__pickcopy"><span class="vf-shuffle__category">'+U.esc(catLabel)+'</span><h3>'+U.esc(r.name)+'</h3><p class="vf-shuffle__location">'+U.esc(loc)+'</p>'+(acts.length?'<div class="vf-shuffle__activity">'+acts.map(function(a){return '<span>'+U.esc(a)+'</span>'}).join('')+'</div>':'')+'<div class="vf-shuffle__actions"><a class="vf-shuffle__open" href="'+U.esc(U.expLink(r.id))+'">View this place <span>↗</span></a>'+map+VF.cards.heart(r)+'</div></div></article>';
        result.classList.remove('is-arriving');void result.offsetWidth;result.classList.add('is-arriving');
        if(window.VF&&VF.reveal&&VF.reveal.refresh)VF.reveal.refresh(result);
      }
      go.addEventListener('click',pick);
      function open(){
        if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
        trigger.setAttribute('aria-expanded','true');
        d.documentElement.classList.add('vf-shuffle-open');
        updateCount();close.focus();
      }
      function shut(){if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');trigger.setAttribute('aria-expanded','false');d.documentElement.classList.remove('vf-shuffle-open');trigger.focus()}
      trigger.addEventListener('click',open);close.addEventListener('click',shut);
      // Keep the floating tool useful without covering the first-screen hero or ticker.
      // It appears as a compact orbital button after the visitor starts exploring.
      var compactFrame=0;
      function syncCompact(){
        compactFrame=0;
        var small=window.matchMedia('(max-width:560px)').matches;
        var threshold=small?Math.min(420,window.innerHeight*.55):240;
        var hidden=window.scrollY<threshold;
        trigger.classList.toggle('is-compact',true);
        trigger.classList.toggle('is-hidden',hidden);
        trigger.setAttribute('aria-hidden',hidden?'true':'false');
        trigger.tabIndex=hidden?-1:0;
      }
      function requestCompact(){if(!compactFrame)compactFrame=requestAnimationFrame(syncCompact)}
      addEventListener('scroll',requestCompact,{passive:true});addEventListener('resize',requestCompact,{passive:true});syncCompact();
      dialog.addEventListener('click',function(e){if(e.target===dialog)shut()});
      dialog.addEventListener('close',function(){trigger.setAttribute('aria-expanded','false');d.documentElement.classList.remove('vf-shuffle-open');trigger.focus()});
      updateCount();
    }
  };
})(window.VF);
