/* VibeFind custom cursor: a compact ultraviolet ring with a lime core.
   Native cursor remains available unless a fine pointer is detected and JS is running. */
window.VF=window.VF||{};
(function(VF){
  var U=VF.utils;
  var started=false;
  VF.cursor={
    init:function(){
      if(started||!U||!U.finePointer()||U.reduceMotion())return;
      started=true;
      var root=document.documentElement;
      var cursor=document.createElement('div');
      cursor.className='cursor';
      cursor.setAttribute('aria-hidden','true');
      cursor.innerHTML='<span class="cursor__orbit" aria-hidden="true"><i></i><i></i></span><span class="cursor__dot"></span><span class="cursor__label"></span>';
      document.body.appendChild(cursor);
      var label=cursor.querySelector('.cursor__label');
      var x=-100,y=-100,tx=-100,ty=-100,raf=0,visible=false;
      var lastTarget=null;

      function closestInteractive(node){
        if(node&&node.nodeType===3)node=node.parentElement;
        if(!node||node.nodeType!==1)return null;
        return node.closest('a[href],button:not([disabled]),[role="button"],[data-cursor]');
      }
      function draw(){
        var dx=tx-x,dy=ty-y;
        x+=dx*.34;y+=dy*.34;
        cursor.style.transform='translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) translate(-50%,-50%)';
        if(Math.abs(dx)+Math.abs(dy)>.35){raf=requestAnimationFrame(draw)}
        else{ x=tx;y=ty;cursor.style.transform='translate3d('+x.toFixed(2)+'px,'+y.toFixed(2)+'px,0) translate(-50%,-50%)';raf=0 }
      }
      function move(e){
        if(e.pointerType&&e.pointerType!=='mouse')return;
        tx=e.clientX;ty=e.clientY;
        if(!visible){visible=true;root.classList.add('has-cursor');cursor.classList.add('is-on')}
        if(!raf)raf=requestAnimationFrame(draw);
      }
      function setTarget(node){
        var target=closestInteractive(node);
        if(target===lastTarget)return;
        lastTarget=target;
        cursor.classList.toggle('is-big',!!target);
        var mode=target&&target.getAttribute('data-cursor');
        if(!mode&&target){mode=target.tagName==='A'?'open':target.tagName==='BUTTON'?'tap':''}
        var text=mode==='view'?'VIEW':mode==='open'?'OPEN':mode==='save'?'SAVE':mode==='drag'?'DRAG':mode==='tap'?'TAP':'';
        label.textContent=text;
        cursor.classList.toggle('is-labeled',!!text);
        cursor.classList.toggle('is-view',mode==='view');
        cursor.classList.toggle('is-open',mode==='open');
        cursor.classList.toggle('is-drag',mode==='drag');
      }
      function hide(){
        visible=false;cursor.classList.remove('is-on','is-big','is-labeled','is-pressed','is-view','is-open','is-drag');
        root.classList.remove('has-cursor');lastTarget=null;
        if(raf){cancelAnimationFrame(raf);raf=0}
      }
      document.addEventListener('pointermove',move,{passive:true});
      document.addEventListener('pointerover',function(e){setTarget(e.target)},{passive:true});
      document.addEventListener('pointerout',function(e){
        var from=closestInteractive(e.target),to=closestInteractive(e.relatedTarget);
        if(from!==to)setTarget(e.relatedTarget);
      },{passive:true});
      document.addEventListener('pointerdown',function(){cursor.classList.add('is-pressed')},{passive:true});
      document.addEventListener('pointerup',function(){cursor.classList.remove('is-pressed')},{passive:true});
      document.addEventListener('pointerleave',hide);
      window.addEventListener('blur',hide);
      document.addEventListener('keydown',function(e){if(e.key==='Tab'||e.key==='Escape')hide()});
    }
  };
})(window.VF);
