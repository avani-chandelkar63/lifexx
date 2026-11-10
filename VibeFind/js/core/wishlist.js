window.VF=window.VF||{};
(function(VF){
  var KEY=VF.CONFIG.storage.wishlist, listeners=[];
  function read(){try{var v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(e){return []}}
  function write(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
  var W=VF.wishlist={
    ids:read,
    has:function(id){return read().indexOf(id)>-1},
    count:function(){return read().length},
    toggle:function(id){var a=read(),i=a.indexOf(id);if(i>-1)a.splice(i,1);else a.push(id);write(a);W._emit();return i===-1},
    onChange:function(fn){listeners.push(fn)},
    _emit:function(){var a=read();listeners.forEach(function(f){f(a)})}
  };
  window.addEventListener('storage',function(e){if(e.key===KEY)W._emit()});
})(window.VF);
