window.VF=window.VF||{};
(function(VF){
  var U=VF.utils;
  VF.parallax={
    init:function(){
      if(U.reduceMotion())return;
      var els=U.$$('[data-parallax]'),ticking=false;
      function frame(){ticking=false;var vh=innerHeight;els.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var k=parseFloat(el.getAttribute('data-parallax'))||0,c=(r.top+r.height/2-vh/2);el.style.transform='translate3d(0,'+(c*k*-1).toFixed(1)+'px,0)'})}
      addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});addEventListener('resize',frame);frame();
      // pointer depth for hero layers (fine pointers only)
      var hero=U.$('.hero');if(!hero||!U.finePointer())return;
      var layers=U.$$('[data-depth]',hero),tx=0,ty=0,cx=0,cy=0,run=false;
      hero.addEventListener('pointermove',function(e){var b=hero.getBoundingClientRect();tx=(e.clientX-b.left)/b.width-.5;ty=(e.clientY-b.top)/b.height-.5;if(!run){run=true;requestAnimationFrame(loop)}});
      function loop(){cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;layers.forEach(function(l){var d=parseFloat(l.getAttribute('data-depth'));l.style.translate=(cx*d*-60).toFixed(1)+'px '+(cy*d*-40).toFixed(1)+'px'});if(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001)requestAnimationFrame(loop);else run=false}
    }
  };
})(window.VF);
