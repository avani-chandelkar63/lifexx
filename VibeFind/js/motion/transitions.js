/* Safe page transitions.
   Keep ordinary same-origin anchor navigation native and reliable. Browsers that
   support cross-document View Transitions use the CSS rule in motion.css. */
window.VF=window.VF||{};
(function(VF){
  VF.transitions={init:function(){
    var root=document.documentElement;
    requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('is-ready')})});
    // Deliberately do not preventDefault() on links. City, directory and venue
    // navigation must work even when the View Transition API is unavailable.
  }};
})(window.VF);
