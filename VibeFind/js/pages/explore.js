window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,S=VF.store,C=VF.CONFIG,$=U.$,esc=U.esc;
  var ORDER=['gaming','sports','thrill','adventure','art','interactive'];
  U.ready(function(){
    VF.chrome.mount('explore');
    var api=VF.directory.init({root:'#dirRoot',onChange:onChange});
    var tiles=$('#tiles');
    tiles.innerHTML=ORDER.map(function(k,i){var c=C.categories[k],cr=VF.scenes.crop('x'+k);
      return '<button type="button" class="tile" data-k="'+k+'" style="--cat:'+c.hue+'" aria-pressed="false"><div class="scene scene--'+k+'" style="background-size:'+(cr.s+30)+'%;background-position:'+cr.x+'% '+cr.y+'%"></div><b>'+esc(c.short)+'</b><small>'+S.catCount(k)+' places</small></button>'}).join('');
    tiles.addEventListener('click',function(e){var t=e.target.closest('.tile');if(!t)return;var k=t.getAttribute('data-k'),cur=api.state().cat,n=cur.indexOf(k)>-1?cur.filter(function(x){return x!==k}):cur.concat(k);
      api.set({cat:n,sub:api.state().sub.filter(function(s){return !n.length||n.indexOf(S.meta.subs[s].cat)>-1})},{scroll:n.length>0})});
    function onChange(st){U.$$('.tile',tiles).forEach(function(t){var on=st.cat.indexOf(t.getAttribute('data-k'))>-1;t.classList.toggle('is-on',on);t.setAttribute('aria-pressed',on)})}
    onChange(api.state());
    $('#heroForm').addEventListener('submit',function(e){e.preventDefault();api.set({q:$('#hq').value.trim()},{scroll:true})});
    $('#hq').value=api.state().q;
    $('#heroCount').textContent=S.all.length;
    VF.reveal.init();VF.cursor.init();VF.transitions.init();VF.polish.init();
  });
})(window.VF);
