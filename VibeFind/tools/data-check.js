(function(){
  var VF=window.VF,D=VF.DATA,R=D.records,U=VF.utils,out=[];
  function chk(name,pass,detail,warn){out.push({name:name,pass:pass,detail:detail||'',warn:!!warn})}
  // 1 counts
  var del=R.filter(function(r){return r.city==='delhi'}),chd=R.filter(function(r){return r.city==='tricity'});
  chk('Total records = 258',R.length===258,R.length);
  chk('Delhi records = 188 (source v1-v188)',del.length===188,del.length);
  chk('Tricity records = 70 (source v1-v70)',chd.length===70,chd.length);
  // 2 ids
  var ids={},dup=[];R.forEach(function(r){if(ids[r.id])dup.push(r.id);ids[r.id]=1});
  chk('IDs unique',!dup.length,dup.join(', '));
  var badId=R.filter(function(r){return !/^(del|chd)-\d{3}$/.test(r.id)});chk('IDs follow del-### / chd-###',!badId.length,badId.map(function(r){return r.id}).join(', '));
  [['delhi','del',188],['tricity','chd',70]].forEach(function(c){var miss=[];for(var i=1;i<=c[2];i++){if(!ids[c[1]+'-'+('00'+i).slice(-3)])miss.push(i)}chk('No gaps in '+c[1]+' numbering',!miss.length,miss.join(', '))});
  // 3 source accounting
  var noRaw=R.filter(function(r){return !r.rawSource||!r.rawSource.id||!r.rawSource.activities||r.rawSource.name!==r.name});
  chk('Every record keeps rawSource (id, name, activities, links)',!noRaw.length,noRaw.map(function(r){return r.id}).join(', '));
  var srcMismatch=R.filter(function(r){return r.rawSource.id!==r.srcId||('v'+r.srcNum)!==r.srcId.split('-')[0]});chk('Source IDs match source numbering',!srcMismatch.length,srcMismatch.map(function(r){return r.id}).join(', '));
  // 4 required fields
  var req=['id','name','city','region','area','areaSlug','categories','sourceCategories','activities','address','mapUrl'];
  var miss=R.filter(function(r){return req.some(function(k){var v=r[k];return v==null||v===''||(Array.isArray(v)&&!v.length)})});
  chk('Required fields present',!miss.length,miss.map(function(r){return r.id}).join(', '));
  // 5 URLs
  var badUrl=[];R.forEach(function(r){[r.mapUrl,r.directionsUrl].concat(r.links.map(function(l){return l.url})).forEach(function(u){if(u){try{var x=new URL(u);if(!/^https?:$/.test(x.protocol))badUrl.push(r.id)}catch(e){badUrl.push(r.id)}}})});
  chk('All URLs parse (http/https)',!badUrl.length,badUrl.join(', '));
  var nonMaps=R.filter(function(r){return !/^https:\/\/www\.google\.com\/maps\//.test(r.mapUrl||'')});chk('Map URLs are Google Maps search URLs',!nonMaps.length,nonMaps.map(function(r){return r.id}).join(', '));
  // 6 honesty fields
  chk('No venue has a price assumed (price null, unverified)',R.every(function(r){return r.price==null&&!r.priceVerified}),'priced: '+R.filter(function(r){return r.price!=null}).length);
  chk('No invented descriptions',R.every(function(r){return r.description===null}),'');
  chk('No booking URLs (none verified)',R.every(function(r){return r.bookingUrl===null}),'');
  chk('No link marked verified',R.every(function(r){return r.links.every(function(l){return l.checked===false})}),'');
  chk('No link called "official"',R.every(function(r){return r.links.every(function(l){return l.kind!=='official'})}),'');
  chk('No venue image claimed',R.every(function(r){return r.image===null})&&Object.keys(VF.PHOTOS.venues).length===0,'');
  chk('Price UI hidden while pricedCount = 0',VF.store.showPrices===false,'pricedCount='+VF.store.pricedCount);
  // 7 category counts vs handoff
  var exp={delhi:{gaming:143,sports:27,thrill:15,interactive:7,adventure:6,art:4},tricity:{gaming:15,sports:33,thrill:6,interactive:7,adventure:4,art:8}};
  var rows='';['delhi','tricity'].forEach(function(c){var tot=0;Object.keys(exp[c]).forEach(function(k){var n=R.filter(function(r){return r.city===c&&r.categories.indexOf(k)>-1}).length;tot+=n;var ok=n===exp[c][k];rows+='<tr><td>'+c+'</td><td>'+VF.CONFIG.categories[k].label+'</td><td>'+n+'</td><td>'+exp[c][k]+'</td><td class="'+(ok?'ok':'bad')+'">'+(ok?'match':'MISMATCH')+'</td></tr>';chk('Category count '+c+' / '+k+' = '+exp[c][k],ok,n)});
    var multi=R.filter(function(r){return r.city===c&&r.categories.length>1}).length;chk('Total tags '+c+' = '+(c==='delhi'?202:73)+' ; multi-tagged = '+(c==='delhi'?12:3),tot===(c==='delhi'?202:73)&&multi===(c==='delhi'?12:3),tot+' tags, '+multi+' multi')});
  document.getElementById('cats').innerHTML='<tr><th>City</th><th>Category</th><th>Data</th><th>Expected</th><th></th></tr>'+rows;
  // 8 geography
  var dA={},cA={};del.forEach(function(r){dA[r.areaSlug]=1});chd.forEach(function(r){cA[r.areaSlug]=1});
  chk('Delhi areas = 65',Object.keys(dA).length===65,Object.keys(dA).length);chk('Delhi zones = 9',new Set(del.map(function(r){return r.zone})).size===9,new Set(del.map(function(r){return r.zone})).size);
  chk('Tricity listed area groups = 38',Object.keys(cA).length===38,Object.keys(cA).length);chk('Tricity regions = 4',new Set(chd.map(function(r){return r.region})).size===4,'');
  var ph=chd.filter(function(r){return r.areaIsPlaceholder});chk('Tricity placeholder-area records flagged (not specific areas)',ph.length===20&&ph.every(function(r){return r.reviewFlags.some(function(f){return f.code==='placeholder-area'})}),ph.length+' records',false);
  chk('Specific tricity areas (excl. placeholders)',true,VF.store.areas('tricity').length+' (handoff estimate ~33; Morni Hills & Chhatbir counted)');
  // 9 extras
  chk('Delhi records with extra links = 31',del.filter(function(r){return r.links.length}).length===31,del.filter(function(r){return r.links.length}).length);
  chk('Tricity records with extra links = 41',chd.filter(function(r){return r.links.length}).length===41,chd.filter(function(r){return r.links.length}).length);
  chk('Ideas to explore kept separate (11 Delhi, 14 Tricity), not counted as listings',D.meta.ideas.delhi.length===11&&D.meta.ideas.tricity.length===14,D.meta.ideas.delhi.length+' / '+D.meta.ideas.tricity.length);
  // 10 unresolved review
  var fl={},flagged=[];R.forEach(function(r){if(r.reviewFlags.length)flagged.push(r);r.reviewFlags.forEach(function(f){fl[f.code]=(fl[f.code]||0)+1})});
  chk('Review flags recorded for manual review (informational)',true,Object.keys(fl).length+' codes on '+flagged.length+' records',true);
  document.getElementById('flags').innerHTML='<tr><th>Flag</th><th>Records</th></tr>'+Object.keys(fl).sort().map(function(k){return '<tr><td>'+k+'</td><td>'+fl[k]+'</td></tr>'}).join('');
  document.getElementById('flagged').innerHTML='<tr><th>ID</th><th>Name</th><th>Flags</th></tr>'+flagged.filter(function(r){return r.reviewFlags.some(function(f){return ['placeholder-area','category-note'].indexOf(f.code)<0})}).map(function(r){return '<tr><td>'+r.id+'</td><td>'+U.esc(r.name)+'</td><td>'+r.reviewFlags.filter(function(f){return ['placeholder-area','category-note'].indexOf(f.code)<0}).map(function(f){return '<b>'+f.code+'</b>: '+U.esc(f.note)}).join('<br>')+'</td></tr>'}).join('');
  var pass=out.filter(function(o){return o.pass}).length;
  document.getElementById('sum').innerHTML='<div><b>'+R.length+'</b>records</div><div><b class="'+(pass===out.length?'ok':'bad')+'">'+pass+' / '+out.length+'</b>checks passed</div><div><b>'+flagged.length+'</b>records with review flags</div>';
  document.getElementById('checks').innerHTML=out.map(function(o){return '<tr><td class="'+(o.pass?(o.warn?'warn':'ok'):'bad')+'">'+(o.pass?(o.warn?'INFO':'PASS'):'FAIL')+'</td><td>'+o.name+'</td><td><small>'+U.esc(o.detail)+'</small></td></tr>'}).join('');
  window.__dataCheck={pass:pass,total:out.length,failed:out.filter(function(o){return !o.pass})};
})();
