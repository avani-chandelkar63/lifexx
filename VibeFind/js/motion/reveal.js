window.VF=window.VF||{};
(function(VF){
  var U=VF.utils;
  var scanIO,scanMask;
  VF.reveal={
    // observe [data-reveal] elements added after init (e.g. result cards)
    scan:function(root){
      var els=U.$$('[data-reveal]:not(.is-in)',root);
      if(!('IntersectionObserver' in window)||U.reduceMotion()){els.forEach(function(e){e.classList.add('is-in')});return}
      if(!scanIO){
        scanIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');scanIO.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -4% 0px'});
        scanMask=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');scanMask.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -6% 0px'});
      }
      els.forEach(function(e){(e.getAttribute('data-reveal')==='mask'?scanMask:scanIO).observe(e)});
    },
    init:function(){
      var els=U.$$('[data-reveal],[data-split]');
      if(!('IntersectionObserver' in window)||U.reduceMotion()){els.forEach(function(e){e.classList.add('is-in')});U.$$('.words .w').forEach(function(w){w.classList.add('is-lit')});}
      else{
        var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
        // clip-path:inset(100%) leaves nothing visible for a 15% threshold, so masks use threshold 0 with a 0.5% sliver left showing
        var ioMask=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');ioMask.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -12% 0px'});
        els.forEach(function(e){(e.getAttribute('data-reveal')==='mask'?ioMask:io).observe(e)});
      }
      // scroll-lit statement words
      var blocks=U.$$('.words');
      blocks.forEach(function(b){var t=b.textContent.trim().split(/\s+/);b.setAttribute('aria-label',b.textContent.trim());b.innerHTML=t.map(function(w){return '<span class="w" aria-hidden="true">'+U.esc(w)+'</span>'}).join(' ')});
      function lit(){if(U.reduceMotion())return;blocks.forEach(function(b){var r=b.getBoundingClientRect(),p=U.clamp((innerHeight*.85-r.top)/(r.height+innerHeight*.35),0,1),ws=b.children,n=Math.round(p*ws.length);for(var i=0;i<ws.length;i++)ws[i].classList.toggle('is-lit',i<n)})}
      if(blocks.length){addEventListener('scroll',lit,{passive:true});lit()}
      // counters
      var cs=U.$$('[data-count]');
      function run(el){var to=+el.getAttribute('data-count'),t0=performance.now(),dur=1600;if(U.reduceMotion()){el.textContent=to;return}
        (function f(t){var p=U.clamp((t-t0)/dur,0,1),e=1-Math.pow(1-p,4);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(f)})(t0)}
      if('IntersectionObserver' in window){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io2.unobserve(e.target)}})},{threshold:.6});cs.forEach(function(c){io2.observe(c)})}else cs.forEach(function(c){c.textContent=c.getAttribute('data-count')});
    }
  };
})(window.VF);
