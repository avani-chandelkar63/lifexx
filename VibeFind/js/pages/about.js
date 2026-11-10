window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,S=VF.store,C=VF.CONFIG,$=U.$,esc=U.esc;
  U.ready(function(){
    VF.chrome.mount('about');
    var cats=Object.keys(C.categories).map(function(k){
      var c=C.categories[k];return '<a class="story-cat" href="explore.html?cat='+encodeURIComponent(k)+'"><b>'+esc(c.label)+'</b><span>'+S.catCount(k)+'</span></a>';
    }).join('');
    $('#aboutStats').innerHTML='<div class="story-stat"><b data-count="'+S.all.length+'">0</b><span>researched venue records</span></div><div class="story-stat"><b data-count="'+S.areas('delhi').length+'">0</b><span>listed Delhi areas</span></div><div class="story-stat"><b data-count="'+S.areas('tricity').length+'">0</b><span>specific Tricity areas</span></div>';
    $('#aboutCategories').innerHTML=cats;
    $('#aboutCoverage').textContent=C.cities.delhi.coverage+' '+C.cities.tricity.coverage;
    VF.reveal.init();VF.cursor.init();VF.transitions.init();VF.polish.init();
  });
})(window.VF);
