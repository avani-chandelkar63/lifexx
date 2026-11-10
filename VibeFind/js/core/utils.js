window.VF=window.VF||{};
(function(VF){
  var U=VF.utils={};
  U.$=function(s,r){return (r||document).querySelector(s)};
  U.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  U.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  // lowercase, strip accents and punctuation, collapse spaces. Used for search only, never to change data.
  U.norm=function(s){return String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim()};
  U.debounce=function(fn,ms){var t;return function(){var a=arguments,c=this;clearTimeout(t);t=setTimeout(function(){fn.apply(c,a)},ms)}};
  U.params=function(){var o={};new URLSearchParams(location.search).forEach(function(v,k){o[k]=v});return o};
  U.buildQuery=function(o){var p=new URLSearchParams();Object.keys(o).forEach(function(k){var v=o[k];if(v!==''&&v!=null&&!(Array.isArray(v)&&!v.length))p.set(k,Array.isArray(v)?v.join(','):v)});var s=p.toString();return s?'?'+s:''};
  U.reduceMotion=function(){return window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches};
  U.finePointer=function(){return window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches};
  U.plural=function(n,a,b){return n+' '+(n===1?a:(b||a+'s'))};
  U.clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
  U.ready=function(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn)};
  U.expLink=function(id){return VF.CONFIG.pages.experience+'?id='+encodeURIComponent(id)};
})(window.VF);
