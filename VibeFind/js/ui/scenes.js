/* Designed category scenes (generated SVG). These are ART, not photos of venues.
   Each scene is injected once as a CSS custom property: --scene-<key>. Elements use class "scene scene--<key>". */
window.VF=window.VF||{};
(function(VF){
  function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  var W=1000,H=1250;
  function wrap(inner,defs,bg1,bg2){
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid slice">'+
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="'+bg1+'"/><stop offset="1" stop-color="'+bg2+'"/></linearGradient>'+
    '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter>'+
    '<filter id="blur"><feGaussianBlur stdDeviation="26"/></filter><filter id="blur2"><feGaussianBlur stdDeviation="8"/></filter>'+(defs||'')+'</defs>'+
    '<rect width="'+W+'" height="'+H+'" fill="url(#bg)"/>'+inner+
    '<rect width="'+W+'" height="'+H+'" filter="url(#grain)" opacity=".16"/></svg>';
  }
  var S={};
  S.gaming=function(){var r=rng(11),c='#A78BFA',l='#C6FF4D',o='';
    o+='<circle cx="760" cy="260" r="260" fill="'+c+'" opacity=".35" filter="url(#blur)"/><circle cx="200" cy="1020" r="220" fill="'+l+'" opacity=".12" filter="url(#blur)"/>';
    o+='<rect x="140" y="170" width="720" height="560" rx="34" fill="#0c0f18" stroke="'+c+'" stroke-width="3"/><rect x="170" y="200" width="660" height="500" rx="18" fill="url(#scr)"/>';
    for(var y=0;y<9;y++)for(var x=0;x<12;x++){var v=r();if(v>.42){o+='<rect x="'+(204+x*52)+'" y="'+(232+y*48)+'" width="36" height="32" rx="6" fill="'+(v>.88?l:c)+'" opacity="'+(.18+v*.7).toFixed(2)+'"/>'}}
    for(var i=0;i<62;i++)o+='<rect x="170" y="'+(200+i*8)+'" width="660" height="2" fill="#000" opacity=".28"/>';
    o+='<circle cx="560" cy="990" r="190" fill="url(#ball)"/><circle cx="560" cy="990" r="70" fill="#f5f5f5"/><text x="560" y="1018" font-family="Space Grotesk,Arial" font-weight="700" font-size="84" text-anchor="middle" fill="#090B10">8</text>';
    o+='<line x1="40" y1="1230" x2="400" y2="1040" stroke="#f5f5f5" stroke-width="10" stroke-linecap="round" opacity=".85"/><line x1="40" y1="1230" x2="230" y2="1130" stroke="'+l+'" stroke-width="10" stroke-linecap="round"/>';
    return wrap(o,'<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b1646"/><stop offset="1" stop-color="#0b0d16"/></linearGradient><radialGradient id="ball" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e9ddff"/><stop offset=".45" stop-color="'+c+'"/><stop offset="1" stop-color="#2a1a66"/></radialGradient>','#1a1240','#090B10')};
  S.sports=function(){var l='#C6FF4D',o='';
    o+='<polygon points="0,0 380,0 120,760 0,760" fill="url(#beam)" opacity=".55"/><polygon points="1000,0 620,0 880,760 1000,760" fill="url(#beam)" opacity=".55"/>';
    o+='<g transform="translate(500 800) scale(1 .52) rotate(-8)" fill="none" stroke="'+l+'" stroke-width="5" opacity=".9"><rect x="-440" y="-460" width="880" height="920" rx="6"/><line x1="-440" y1="0" x2="440" y2="0"/><circle r="130"/><circle r="10" fill="'+l+'"/><rect x="-210" y="-460" width="420" height="190"/><rect x="-210" y="270" width="420" height="190"/><path d="M-110 -270 A110 110 0 0 0 110 -270"/><path d="M-110 270 A110 110 0 0 1 110 270"/></g>';
    o+='<ellipse cx="500" cy="1130" rx="420" ry="70" fill="'+l+'" opacity=".12" filter="url(#blur)"/>';
    o+='<circle cx="720" cy="330" r="96" fill="url(#sb)"/><path d="M640 300 Q720 340 800 300 M650 380 Q720 330 790 380 M720 234 Q700 330 720 426" stroke="#090B10" stroke-width="5" fill="none" opacity=".55"/><circle cx="720" cy="330" r="150" fill="'+l+'" opacity=".18" filter="url(#blur)"/>';
    return wrap(o,'<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+l+'" stop-opacity=".55"/><stop offset="1" stop-color="'+l+'" stop-opacity="0"/></linearGradient><radialGradient id="sb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#f4ffd0"/><stop offset="1" stop-color="'+l+'"/></radialGradient>','#11151D','#090B10')};
  S.thrill=function(){var p='#8B5CF6',o='';
    o+='<polygon points="500,560 120,1250 880,1250" fill="url(#ray)" opacity=".8"/>';
    o+='<rect x="270" y="150" width="460" height="760" rx="230" fill="#0b0d14" stroke="'+p+'" stroke-width="4"/><rect x="310" y="190" width="380" height="680" rx="190" fill="none" stroke="'+p+'" stroke-width="1.5" opacity=".5"/>';
    o+='<circle cx="500" cy="540" r="52" fill="'+p+'"/><polygon points="476,570 524,570 540,680 460,680" fill="'+p+'"/><circle cx="500" cy="540" r="140" fill="'+p+'" opacity=".22" filter="url(#blur)"/>';
    o+='<path d="M420 330 V270 a80 80 0 0 1 160 0 V330" fill="none" stroke="#f5f5f5" stroke-width="14" opacity=".85"/><rect x="390" y="320" width="220" height="150" rx="22" fill="#f5f5f5" opacity=".92"/><circle cx="500" cy="395" r="16" fill="#090B10"/>';
    var r=rng(5);for(var i=0;i<14;i++)o+='<text x="'+(60+r()*880).toFixed(0)+'" y="'+(980+r()*240).toFixed(0)+'" font-family="Space Grotesk,Arial" font-weight="700" font-size="'+(40+r()*70).toFixed(0)+'" fill="'+p+'" opacity="'+(.1+r()*.35).toFixed(2)+'">?</text>';
    return wrap(o,'<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+p+'" stop-opacity=".75"/><stop offset="1" stop-color="'+p+'" stop-opacity="0"/></linearGradient>','#090B10','#050509')};
  S.adventure=function(){var t='#D6A84F',o='',r=rng(21);
    for(var i=0;i<60;i++)o+='<circle cx="'+(r()*W).toFixed(0)+'" cy="'+(r()*520).toFixed(0)+'" r="'+(r()*2.2+.4).toFixed(1)+'" fill="#fff" opacity="'+(.2+r()*.6).toFixed(2)+'"/>';
    o+='<circle cx="730" cy="260" r="110" fill="#A78BFA" opacity=".95"/><circle cx="730" cy="260" r="210" fill="'+t+'" opacity=".22" filter="url(#blur)"/>';
    o+='<polygon points="0,820 160,560 300,720 470,430 650,740 780,600 1000,860 1000,1250 0,1250" fill="#151922"/>';
    o+='<polygon points="0,980 200,760 360,900 560,640 760,930 900,820 1000,950 1000,1250 0,1250" fill="#11151D"/>';
    o+='<polygon points="0,1100 260,940 460,1060 700,900 1000,1120 1000,1250 0,1250" fill="#050509"/>';
    o+='<polyline points="470,430 520,520 450,600 540,690 480,780 560,860" fill="none" stroke="'+t+'" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>';
    [[470,430],[450,600],[480,780],[560,860]].forEach(function(p){o+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="13" fill="#090B10" stroke="'+t+'" stroke-width="4"/>'});
    return wrap(o,'','#090B10','#050509')};
  S.art=function(){var a='#F5F5F5',o='',r=rng(8);
    o+='<ellipse cx="500" cy="1040" rx="400" ry="90" fill="none" stroke="'+a+'" stroke-width="3" opacity=".7"/><ellipse cx="500" cy="1040" rx="300" ry="62" fill="none" stroke="'+a+'" stroke-width="2" opacity=".45"/><ellipse cx="500" cy="1040" rx="200" ry="40" fill="'+a+'" opacity=".16"/>';
    o+='<path d="M380 980 C250 820 300 640 410 560 C460 520 430 440 430 400 L570 400 C570 440 540 520 590 560 C700 640 750 820 620 980 Z" fill="url(#clay)"/>';
    for(var i=0;i<9;i++){var y=430+i*60;o+='<ellipse cx="500" cy="'+y+'" rx="'+(70+Math.sin(i/1.6)*110+40).toFixed(0)+'" ry="14" fill="none" stroke="#090B10" stroke-width="2" opacity=".35"/>'}
    o+='<ellipse cx="500" cy="400" rx="70" ry="16" fill="#151922"/><ellipse cx="500" cy="1040" rx="130" ry="26" fill="'+a+'" opacity=".5" filter="url(#blur2)"/>';
    for(var j=0;j<26;j++)o+='<circle cx="'+(r()*W).toFixed(0)+'" cy="'+(r()*600+60).toFixed(0)+'" r="'+(r()*16+3).toFixed(0)+'" fill="'+(r()>.6?'#A78BFA':a)+'" opacity="'+(.12+r()*.4).toFixed(2)+'"/>';
    return wrap(o,'<linearGradient id="clay" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6D28D9"/><stop offset=".45" stop-color="'+a+'"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient>','#050509','#090B10')};
  S.interactive=function(){var c='#A0A5B1',o='';
    o+='<circle cx="500" cy="560" r="420" fill="'+c+'" opacity=".16" filter="url(#blur)"/>';
    for(var i=0;i<16;i++){var s=900-i*52;o+='<rect x="'+(500-s/2)+'" y="'+(560-s/2)+'" width="'+s+'" height="'+s+'" rx="'+(10+i*3)+'" fill="'+(i%2?'#11151D':'none')+'" stroke="'+(i%3?c:'#A78BFA')+'" stroke-width="'+(i%3?2:3)+'" opacity="'+(.9-i*.04).toFixed(2)+'" transform="rotate('+(i*5.5)+' 500 560)"/>'}
    o+='<circle cx="500" cy="560" r="64" fill="#f5f5f5"/><circle cx="500" cy="560" r="32" fill="#090B10"/><circle cx="486" cy="546" r="10" fill="#f5f5f5"/>';
    return wrap(o,'','#11151D','#050509')};

  var uri={};
  VF.scenes={
    keys:Object.keys(S),
    svg:function(k){return S[k]()},
    uri:function(k){return uri[k]||(uri[k]='url("data:image/svg+xml,'+encodeURIComponent(S[k]())+'")')},
    // deterministic crop so cards of one category don't all look identical
    // gentler crop for wide card images: keeps the focal middle of the artwork in frame
    cardCrop:function(id){var h=0;for(var i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))|0;h=Math.abs(h);return {x:30+(h%40),y:22+((h>>3)%56),s:135+(h%45)}},
    crop:function(id){var h=0;for(var i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))|0;h=Math.abs(h);return {x:(h%100),y:((h>>3)%100),s:(150+(h%90))}}
  };
  var css=':root{';VF.scenes.keys.forEach(function(k){css+='--scene-'+k+':'+VF.scenes.uri(k)+';'});css+='}';
  var st=document.createElement('style');st.id='vf-scenes';st.textContent=css;document.head.appendChild(st);
})(window.VF);
