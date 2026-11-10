/* Central data access: indexes, search, filter, sort, related. Every page reads through here. */
window.VF=window.VF||{};
(function(VF){
  var U=VF.utils, D=VF.DATA, CFG=VF.CONFIG;
  var all=D.records, byId={}, S=VF.store={all:all,byId:byId,meta:D.meta};
  var SYN=[['snooker','pool','billiards','billiard','cue'],['vr','virtual reality','headset'],['escape','mystery rooms','escape rooms','puzzle'],['ps5','ps4','playstation','console'],['box cricket','turf','cricket'],['pickleball','pickle ball'],['go karting','go kart','karting','kart']];
  all.forEach(function(r){
    byId[r.id]=r;
    r._f={name:U.norm(r.name+' '+(r.brand||'')),area:U.norm(r.area+' '+r.regionLabel+' '+r.zone),act:U.norm(r.activities.join(' ')),cat:U.norm(r.sourceCategories.join(' ')+' '+r.subcategories.map(function(s){return D.meta.subs[s].label}).join(' ')),addr:U.norm(r.address||'')};
    r._f.all=[r._f.name,r._f.area,r._f.act,r._f.cat,r._f.addr].join(' ');
  });
  S.get=function(id){return byId[id]||null};
  S.pricedCount=all.filter(function(r){return r.priceVerified&&r.price!=null}).length;
  S.showPrices=S.pricedCount>0; // price UI stays hidden while no verified prices exist
  S.photo=function(r){var p=VF.PHOTOS.venues[r.id];return p&&p.verified?p:null};

  S.score=function(r,q){
    var n=U.norm(q); if(!n)return 1;
    var toks=n.split(' '), s=0, f=r._f;
    var phrase=f.name.indexOf(n)>-1; if(phrase)s+=60; if(f.area.indexOf(n)>-1)s+=40; if(f.name.indexOf(n)===0)s+=20;
    var matched=0;
    toks.forEach(function(t){
      var hit=false;
      if(f.name.indexOf(t)>-1){s+=24;hit=true}
      if(f.area.indexOf(t)>-1){s+=12;hit=true}
      if(f.cat.indexOf(t)>-1){s+=9;hit=true}
      if(f.act.indexOf(t)>-1){s+=8;hit=true}
      if(f.addr.indexOf(t)>-1){s+=3;hit=true}
      if(hit)matched++;
    });
    if(matched<toks.length){ // try synonyms for unmatched tokens
      var syn=0;SYN.forEach(function(g){var gn=g.map(U.norm);if(gn.some(function(x){return n.indexOf(x)>-1})){gn.forEach(function(x){if(f.all.indexOf(x)>-1)syn=Math.max(syn,6)})}});
      if(!syn)return 0; s+=syn;
    }
    return s;
  };
  // spec: {q, city, region, zone, area, cat:[], sub:[], mood, act}
  S.filter=function(spec){
    spec=spec||{};
    var cat=[].concat(spec.cat||[]), sub=[].concat(spec.sub||[]);
    var res=[];
    all.forEach(function(r){
      if(spec.city&&r.city!==spec.city)return;
      if(spec.region&&r.region!==spec.region)return;
      if(spec.zone&&r.zone!==spec.zone)return;
      if(spec.area&&r.areaSlug!==spec.area)return;
      if(cat.length&&!cat.some(function(c){return r.categories.indexOf(c)>-1}))return;
      if(sub.length&&!sub.some(function(s){return r.subcategories.indexOf(s)>-1}))return;
      if(spec.mood&&r.moods.indexOf(spec.mood)<0)return;
      if(spec.act&&r._f.act.indexOf(U.norm(spec.act))<0)return;
      var sc=spec.q?S.score(r,spec.q):1; if(!sc)return;
      res.push({r:r,s:sc});
    });
    return res;
  };
  S.sort=function(list,mode){
    var a=list.slice();
    if(mode==='az')a.sort(function(x,y){return x.r.name.localeCompare(y.r.name)});
    else if(mode==='za')a.sort(function(x,y){return y.r.name.localeCompare(x.r.name)});
    else a.sort(function(x,y){return y.s-x.s||(y.r.featured-x.r.featured)||x.r.name.localeCompare(y.r.name)});
    return a.map(function(x){return x.r});
  };
  S.query=function(spec,mode){return S.sort(S.filter(spec),mode)};
  S.count=function(spec){return S.filter(spec).length};

  // counts + indexes
  S.catCount=function(key,city){return all.filter(function(r){return r.categories.indexOf(key)>-1&&(!city||r.city===city)}).length};
  S.areas=function(city){ // specific areas only; placeholders excluded
    var m={};
    all.forEach(function(r){if(r.city!==city||r.areaIsPlaceholder)return;var a=m[r.areaSlug]||(m[r.areaSlug]={slug:r.areaSlug,name:r.area,zone:r.zone,region:r.region,regionLabel:r.regionLabel,jurisdiction:r.jurisdiction,count:0});a.count++});
    return Object.keys(m).map(function(k){return m[k]}).sort(function(a,b){return b.count-a.count||a.name.localeCompare(b.name)});
  };
  S.zones=function(city){
    var m={};all.forEach(function(r){if(r.city!==city)return;(m[r.zone]=m[r.zone]||{name:r.zone,count:0,region:r.region}).count++});
    return Object.keys(m).map(function(k){return m[k]});
  };
  S.subsFor=function(cat){var o=D.meta.subs,out=[];Object.keys(o).forEach(function(k){if(!cat||o[k].cat===cat)out.push({key:k,label:o[k].label,cat:o[k].cat,count:all.filter(function(r){return r.subcategories.indexOf(k)>-1}).length})});return out.filter(function(s){return s.count}).sort(function(a,b){return b.count-a.count})};
  S.moods=function(){var m={};all.forEach(function(r){r.moods.forEach(function(x){m[x]=(m[x]||0)+1})});return Object.keys(m).map(function(k){return{label:k,count:m[k]}}).sort(function(a,b){return b.count-a.count})};
  S.featured=function(){return all.filter(function(r){return r.featured})};
  S.locationLabel=function(r){ // e.g. "Singhpura (Expressway) · Zirakpur · Punjab"
    var parts=[];parts.push(r.areaIsPlaceholder?'Area not specified':r.area);
    if(r.city==='delhi'){parts.push(r.zone)}else{if(r.areaIsPlaceholder&&r.area===r.regionLabel){}parts.push(r.regionLabel);parts.push(r.jurisdiction)}
    return parts;
  };
  S.related=function(r,n){
    n=n||6;var seen={},out=[];seen[r.id]=1;
    function add(list,why){list.forEach(function(x){if(out.length<n&&!seen[x.id]){seen[x.id]=1;out.push({r:x,why:why})}})}
    var subs=r.subcategories;
    if(subs.length&&!r.areaIsPlaceholder)add(all.filter(function(x){return x.areaSlug===r.areaSlug&&x.subcategories.some(function(s){return subs.indexOf(s)>-1})}),'Same activity in '+r.area);
    add(all.filter(function(x){return x.region===r.region&&x.subcategories.some(function(s){return subs.indexOf(s)>-1})}),'Same activity in '+r.regionLabel);
    add(all.filter(function(x){return x.region===r.region&&x.categories.some(function(c){return r.categories.indexOf(c)>-1})}),'Same category in '+r.regionLabel);
    add(all.filter(function(x){return x.city===r.city&&x.categories.some(function(c){return r.categories.indexOf(c)>-1})}),'Same category nearby');
    return out;
  };
  S.suggest=function(q,n){if(U.norm(q).length<2)return[];return S.query({q:q},'best').slice(0,n||6)};
})(window.VF);
