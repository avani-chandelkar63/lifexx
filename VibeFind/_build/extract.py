import re, json, html
UP='/mnt/user-data/uploads/'
def un(s): return html.unescape(re.sub(r'\s+',' ',s)).strip()
def tx(s): return un(re.sub(r'<[^>]+>','',s))
out=[]; meta={}
for fn,city,prefix in [('delhi.html','delhi','del'),('chandigarh.html','tricity','chd')]:
    s=open(UP+fn,encoding='utf-8').read()
    vs=s.find('<section id="venues">'); body=s[vs:]
    tokens=re.finditer(r'<section class="zone" id="([^"]+)">\s*<h2>(.*?)</h2>|<section class="area" id="([^"]+)">\s*<h3>(.*?)</h3>|(<article class="venue".*?</article>)',body,re.S)
    zone=area=None; zid=aid=None
    for m in tokens:
        if m.group(1): zid,zone=m.group(1),tx(m.group(2)); continue
        if m.group(3): aid,area=m.group(3),tx(m.group(4)); continue
        a=m.group(5)
        head=re.match(r'<article class="venue"([^>]*)>',a).group(1)
        attrs=dict(re.findall(r'([\w-]+)="([^"]*)"',head))
        num=int(re.match(r'v(\d+)-',attrs['id']).group(1))
        name=tx(re.search(r'<h4>(.*?)</h4>',a,re.S).group(1))
        at=tx(re.search(r'<p class="activity-type">(.*?)</p>',a,re.S).group(1))
        acts=[tx(x) for x in re.findall(r'<li>(.*?)</li>',re.search(r'<ul class="activities">(.*?)</ul>',a,re.S).group(1),re.S)]
        addr=re.search(r'<address>(.*?)</address>',a,re.S); addr=tx(addr.group(1)) if addr else None
        links=[{'href':html.unescape(h),'label':tx(l)} for h,l in re.findall(r'<a href="([^"]+)"[^>]*>(.*?)</a>',re.search(r'(?:</address>|</ul>)(.*)</article>',a,re.S).group(1),re.S)]
        out.append(dict(file=fn,city=city,prefix=prefix,num=num,srcId=attrs['id'],attrs=attrs,zoneId=zid,zone=zone,areaId=aid,area=area,name=name,typeLine=at,activities=acts,address=addr,links=links))
    k=s.find('<h2>Ideas to explore</h2>'); seg=s[k:s.find('<p><a href="#top">',k)]
    meta[city+'_ideas']=[tx(x) for x in re.findall(r'<li>(.*?)</li>',seg,re.S)]
    k=s.find('id="picks"'); seg=s[k:s.find('</section>',k)]
    picks=[]; cur=None
    for t in re.finditer(r'<h3>(.*?)</h3>|<li><a href="#(v\d+)[^"]*">(.*?)</a>(.*?)</li>',seg,re.S):
        if t.group(1): cur={'label':tx(t.group(1)),'items':[]}; picks.append(cur)
        else: cur['items'].append({'srcNum':int(t.group(2)[1:]),'name':tx(t.group(3)),'note':tx(t.group(4))})
    meta[city+'_picks']=picks
    k=s.find('id="by-area"'); seg=s[k:s.find('</section>',k)]
    meta[city+'_arealist']=[(tx(a),int(c)) for a,c in re.findall(r'<li><a href="#area-[^"]+">(.*?)</a> \((\d+)\)</li>',seg)]
    meta[city+'_zonelist']=[tx(z) for z in re.findall(r'<h3><a href="#zone-[^"]+">(.*?)</a></h3>',seg)]
json.dump({'records':out,'meta':meta},open('_build/raw.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
from collections import Counter
for c in ['delhi','tricity']:
    r=[x for x in out if x['city']==c]; print(c,len(r),sorted(x['num'] for x in r)==list(range(1,len(r)+1)),'areas',len(set(x['area'] for x in r)),'zones',len(set(x['zone'] for x in r)))
    print(Counter(x['attrs'].get('data-types') for x in r))
    print(Counter(x['typeLine'] for x in r).most_common(14))
    print('arealist',len(meta[c+'_arealist']),'ideas',len(meta[c+'_ideas']),'picks',[len(p['items']) for p in meta[c+'_picks']])
print('links per rec',Counter(len(x['links']) for x in out))
print('attr keys',set(k for x in out for k in x['attrs']))
print('no address',[x['srcId'] for x in out if not x['address']])
print([ (x['srcId'],x['zone'],x['area']) for x in out if x['city']=='tricity'][:4])
