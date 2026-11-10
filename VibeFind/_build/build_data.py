"""Deterministic builder: _build/raw.json (extracted from the 3 source HTML files) -> js/data/experiences.js
Dev-time helper only. The website itself needs no build step."""
import json, re, html
from urllib.parse import urlparse, parse_qs, quote_plus
d=json.load(open('_build/raw.json',encoding='utf-8')); R=d['records']; M=d['meta']

CATS={'gaming':'Gaming & Arcade','sports':'Sports','thrill':'Thrill & Puzzle','art':'Art & Creative Workshops','interactive':'Interactive & Experiences','adventure':'Adventure & High-Energy'}
def slug(s):
    s=html.unescape(s).lower().replace('&','and'); return re.sub(r'[^a-z0-9]+','-',s).strip('-')

REGION={ # zone label -> (key, short label, jurisdiction)
 'Chandigarh (UT)':('chandigarh','Chandigarh','Chandigarh UT'),
 'Mohali & Kharar (Punjab)':('mohali','Mohali & Kharar','Punjab'),
 'Zirakpur (Punjab)':('zirakpur','Zirakpur','Punjab'),
 'Panchkula (Haryana)':('panchkula','Panchkula','Haryana')}
PLACEHOLDER={'Across Chandigarh','Mohali','Zirakpur','Panchkula'}

# ---- gaming + other subcategory rules: (key,label,parentCat,regex over activity text)
SUBS=[
 ('snooker-pool','Snooker & Pool','gaming',r'snooker|(?<!ball )\bpool\b|billiard|8-ball'),
 ('arcade-redemption','Arcade & Redemption','gaming',r'arcade|redemption|air hockey|carnival'),
 ('vr','VR','gaming',r'\bvr\b|virtual reality'),
 ('console-pc','Console & PC','gaming',r'playstation|\bps ?[345]\b|xbox|kinect|console|\bpc\b|gaming pcs'),
 ('racing-simulators','Racing & Simulators','gaming',r'racing|simulator|driving games'),
 ('bowling','Bowling','gaming',r'bowling'),
 ('board-tabletop','Board & Tabletop','gaming',r'board games|tabletop|carrom'),
 ('rides-softplay','Rides & Soft Play','gaming',r'bumper cars|soft play|ball pool|slides|\brides\b|play area|indoor play'),
 ('cricket-turf','Cricket & Turf','sports',r'cricket|turf'),
 ('racquet','Racquet Sports','sports',r'pickleball|badminton|tennis|squash|padel'),
 ('football-futsal','Football & Futsal','sports',r'football|futsal|7v7'),
 ('basketball','Basketball','sports',r'basketball'),
 ('swimming','Swimming','sports',r'swimming'),
 ('skating','Skating','sports',r'skating|roller'),
 ('combat-martial','Combat & Martial Arts','sports',r'boxing|judo|wrestling|krav maga|martial|fencing'),
 ('shooting-archery','Archery & Shooting','sports',r'archery|shooting range|air rifle'),
 ('golf','Golf','sports',r'golf|pitch & putt'),
 ('multi-sport-facility','Multi-sport Facilities','sports',r'athletics|indoor halls|floodlit|hockey|volleyball|weightlifting|stadium|sports complex'),
 ('climbing-ropes','Climbing & Rope Courses','adventure',r'climb|bouldering|rope|tree-top|obstacle|zipline'),
 ('trampoline','Trampoline & Air','adventure',r'trampoline|foam pit|sky verve|sky coaster'),
 ('karting','Karting & Rides','adventure',r'go-kart|kart|super-bike'),
 ('laser-paintball','Laser & Paintball','adventure',r'paintball|laser|neon splash'),
 ('boating-water','Boating & Water','adventure',r'boat|kayak|canoe'),
 ('outdoors-trails','Outdoors & Trails','adventure',r'trekking|camping|trail|lakeside walk'),
 ('escape-rooms','Escape Rooms','thrill',r'escape'),
 ('rage-room','Rage Room','thrill',r'rage room|anger banger'),
 ('mystery-puzzle','Mystery & Puzzle','thrill',r'mystery|puzzle|problem solving'),
 ('pottery-clay','Pottery & Clay','art',r'pottery|clay|ceramic|kintsugi'),
 ('painting-drawing','Painting & Drawing','art',r'paint|sketch|drawing|watercolour|spin art|texture art|acrylic'),
 ('resin-craft','Resin & Craft','art',r'resin|craft|\bdiy\b|block-print|keychain'),
 ('museums-heritage','Museums & Heritage','interactive',r'museum|gallery|archive|heritage|charkha'),
 ('illusions','Illusions','interactive',r'illusion'),
 ('gardens-wildlife','Gardens & Wildlife','interactive',r'garden|zoo|wildlife|waterfall'),
]
SUBMETA={k:(l,p) for k,l,p,_ in SUBS}

LINKKIND={ # domain -> kind (honest classification; nothing is 'official' until verified)
 'dda.gov.in':'government','dda.org.in':'government',
 'district.in':'listing','lyfskills.com':'listing','playall.in':'listing','pickleheads.com':'listing','traveltriangle.com':'listing',
 'wanderon.in':'listing','wanderlog.com':'listing','museumsofindia.org':'listing',
 'pacificmalls.in':'mall',
 'eodparks.com':'operator','timezonegames.com':'operator','skyjumpertrampolinepark.com':'operator','playhaus.co.in':'operator',
 'daveandbustersindia.com':'operator','boulderbox.in':'operator','climbcentral.in':'operator','mysteryrooms.in':'operator',
 'gamepalacio.com':'operator','highclassvr.com':'operator','aurapottery.com':'operator',
 'yesministerdelhi.com':'unclassified'}
BRANDS=['Next Level Gaming Zone','Zoreko','SkyJumper','Sky Gamer','Timezone','Alpha Cue','Game Palacio','Masti Zone','Mystery Rooms','Dugout Arena','RallyGully','EOD Adventure Park','PlayAll','Smaaash','Dave & Buster']
def brand_for(name):
    n=name.lower().replace('’',"'")
    for b in BRANDS:
        if b.lower() in n.replace("'s",'') or b.lower().replace("'s",'') in n: return b.replace('Dave & Buster','Dave & Buster\u2019s')
    if 'eod' in n.replace('-','') and 'park' in n: return 'EOD Adventure Park'
    return None

PIN=re.compile(r'\b\d{6}\b')
CITYWORDS={'delhi','new delhi','chandigarh','mohali','zirakpur','panchkula','haryana','punjab','tricity','across chandigarh','kharar','sahibzada ajit singh nagar','across mohali'}
STREET=re.compile(r'\b(road|marg|street|st\.|mall|market|complex|floor|plaza|tower|building|lane|chowk|plot|shop|no\.|khasra|gate|sco|scf|booth|phase|block|sector|gali|pocket|village|opposite|opp\.|near|behind|centre|center|club|school|stadium|lake|garden|park)\b',re.I)
def precision(addr,area):
    a=PIN.sub('',addr).strip(' ,–-')
    parts=[p.strip().lower() for p in re.split(r',',a) if p.strip()]
    if parts and all(p in CITYWORDS for p in parts): return 'city'
    rest=[p for p in parts if p not in CITYWORDS]
    if len(rest)==1 and re.match(r'^(sector|phase)\s*[\w\-\(\) ]+$',rest[0]) and not re.search(r'\b(road|marg|plot|shop|floor|no\.)\b',rest[0]): return 'locality'
    has_digit=bool(re.search(r'\d',a)); has_street=bool(STREET.search(a))
    if not has_digit and not has_street: return 'locality'
    if len(parts)<=2 and not has_digit and area.lower() in a.lower(): return 'locality'
    return 'exact'

picks_by={}
for city,pre in (('delhi','del'),('tricity','chd')):
    for p in M[city+'_picks']:
        label=re.sub(r'^[^\w]+','',p['label']).strip()
        for it in p['items']:
            picks_by.setdefault((city,it['srcNum']),[]).append({'label':label,'note':it['note'].lstrip('–- ').strip()})

def flags_for(rec):
    f=[]; n=rec['name'].lower(); a=(rec['address'] or '').lower()
    def add(code,note): f.append({'code':code,'note':note})
    if rec['city']=='delhi' and ('eod' in n.replace('-','') or 'e-o-d' in a) and 'mayur vihar' in a:
        if n=='bowling alley': add('sub-attraction','Appears to be a bowling alley inside EOD Adventure Park; kept as its own record.')
        else: add('duplicate-variant','EOD Adventure Park appears under name variants with the same address; kept both, review for merge.')
    if rec['city']=='tricity' and rec['num'] in (48,49): add('possible-duplicate','HopUp and WOOP share a near-identical Singhpura address and activity list; may be one facility or a rebrand.')
    if 'v3s' in n or 'v3s' in a: add('area-mismatch','V3S Mall is listed under both Laxmi Nagar and Nirman Vihar across the source; source area kept.')
    if n=='cue zone': add('area-mismatch','Address says Shahdara but source area is Yamuna Vihar; source area kept.')
    if n=='the billiards': add('area-mismatch','Address says Yamuna Vihar but source area is Shahdara; source area kept.')
    if 'dave & buster' in n.replace('’',"'") : add('area-mismatch','Address mentions Tilak Nagar but the record sits under Tagore Garden; source area kept.')
    if 'hot shots' in n: add('area-mismatch','Address (Village Prach near Nayagaon) vs. area grouping looks inconsistent; source area kept.')
    if rec['city']=='tricity' and rec['area']=='Phase 7' and 'sector 61' in a: add('address-note','Mohali Phase 7 address references Sector 61.')
    if rec['area'] in ('Essex Farms','Morni Hills') or 'essex' in n: add('place-name-area','Area is a place name rather than a conventional neighbourhood.')
    if 'ne' == (rec['address'] or '')[-2:] and re.search(r'110019ne$',rec['address'] or ''): add('typo','Address ends “110019ne”; the typo also appears in the map URL. Preserved as in source.')
    if n in ('glitch gafe gaming cafe',) or 'glitch gafe' in n: add('possible-typo','“Glitch Gafe” may be a typo of “Glitch Cafe”; name preserved.')
    if 'gammer hub' in n: add('possible-typo','“Gammer Hub” may be a typo of “Gamer Hub”; name preserved.')
    if 'used snooker pool table' in n: add('not-a-venue?','May be a table seller rather than a playable venue; review before featuring.')
    if 'dda' in a or any('dda.gov.in' in l['href'] or 'dda.org.in' in l['href'] for l in rec['links']):
        if 'gaming' in rec['attrs']['data-types']: add('multi-sport-complex','DDA multi-sport complex carrying a Gaming tag because of billiards; original tags preserved.')
    if rec['city']=='tricity' and rec['areaIsPlaceholder']: add('placeholder-area','Source area is a fallback label, not a specific neighbourhood.')
    if 'art' in rec['attrs']['data-types'].split() and re.search(r'cafe|coffee|café',n): add('category-note','Café tagged under Art & Creative Workshops in the source; tag preserved.')
    if 'interactive' in rec['attrs']['data-types'].split(): add('category-note','Interactive & Experiences mixes museums, zoo and Rock Garden in the source; tag preserved.')
    return f

out=[]; brandcount={}
for r in R:
    reg=REGION.get(r['zone']) if r['city']=='tricity' else ('delhi',r['zone'],'Delhi NCT')
    r['areaIsPlaceholder']= r['city']=='tricity' and r['area'] in PLACEHOLDER
    r['_b']=brand_for(r['name'])
    if r['_b']: brandcount[r['_b']]=brandcount.get(r['_b'],0)+1
for r in R:
    reg=REGION[r['zone']] if r['city']=='tricity' else ('delhi',r['zone'],'Delhi NCT')
    cats=r['attrs']['data-types'].split()
    acts=r['activities']
    acttext=' | '.join(acts).lower()
    subs=[];ev=[]
    for key,label,parent,rx in SUBS:
        for a in acts:
            m=re.search(rx,a.lower())
            if m: 
                if key not in subs: subs.append(key)
                ev.append({'sub':key,'term':m.group(0),'activity':a})
                break
    status='evidence' if subs else 'unspecified'
    mapl=[l for l in r['links'] if 'google.com/maps' in l['href']]
    extra=[l for l in r['links'] if 'google.com/maps' not in l['href']]
    mapUrl=mapl[0]['href'] if mapl else None
    q=parse_qs(urlparse(mapUrl).query).get('query',[None])[0] if mapUrl else None
    dirUrl=('https://www.google.com/maps/dir/?api=1&destination='+quote_plus(q)) if q else None
    links=[]
    for l in extra:
        host=urlparse(l['href']).netloc.lower().replace('www.','').replace('discover.','')
        links.append({'url':l['href'],'label':l['label'].replace('\U0001F517','').strip(),'host':host,'kind':LINKKIND.get(host,'unclassified'),'checked':False})
    picks=picks_by.get((r['city'],r['num']),[])
    rec=dict(
      id=f"{r['prefix']}-{r['num']:03d}", srcFile=r['file'], srcId=r['srcId'], srcNum=r['num'],
      name=r['name'], brand=r['_b'] if brandcount.get(r['_b'],0)>=2 else None,
      city=r['city'], region=reg[0], regionLabel=reg[1], jurisdiction=reg[2],
      zone=r['zone'], area=r['area'],
      areaSlug=(slug(r['area']) if r['city']=='delhi' else reg[0]+'-'+slug(r['area'])),
      areaIsPlaceholder=r['areaIsPlaceholder'],
      sourceCategories=[CATS[c] for c in cats], categories=cats,
      subcategories=subs, subcategoryEvidence=ev, subcategoryStatus=status,
      activities=acts, description=None,
      address=r['address'], addressPrecision=precision(r['address'],r['area']),
      mapUrl=mapUrl, directionsUrl=dirUrl, links=links, bookingUrl=None,
      price=None, priceVerified=False, freeEntry=None,
      image=None, moods=[p['label'] for p in picks], quickPickNotes=picks, featured=bool(picks),
      reviewFlags=[], corrections=[],
      rawSource=dict(file=r['file'],id=r['srcId'],zoneId=r['zoneId'],zone=r['zone'],areaId=r['areaId'],area=r['area'],attrs=r['attrs'],typeLine=r['typeLine'],name=r['name'],activities=acts,address=r['address'],links=r['links']))
    rec['reviewFlags']=flags_for({**r,'areaIsPlaceholder':r['areaIsPlaceholder']})
    out.append(rec)

ideas={'delhi':M['delhi_ideas'][:11],'tricity':M['tricity_ideas'][:14]}
# the first <li> of ideas section may include 'Before you go' items; split by marker
for c in ('delhi','tricity'):
    allli=M[c+'_ideas']; ideas[c]=[x for x in allli if re.match(r'^\W*\w[^:]*:',x) and ':' in x]
meta={'ideas':ideas,'sourceCounts':{'delhi':188,'tricity':70},
      'areaLists':{c:M[c+'_arealist'] for c in ('delhi','tricity')},
      'zoneLists':{c:M[c+'_zonelist'] for c in ('delhi','tricity')},
      'cats':CATS,'subs':{k:{'label':l,'cat':p} for k,(l,p) in SUBMETA.items()}}
js='/* VibeFind dataset: generated from delhi.html + chandigarh.html by _build/build_data.py. One record per source venue (258). Do not hand-edit facts; log changes in each record\'s `corrections`. */\nwindow.VF=window.VF||{};\nVF.DATA={records:[\n'+',\n'.join(json.dumps(x,ensure_ascii=False,separators=(',',':')) for x in out)+'\n],\nmeta:'+json.dumps(meta,ensure_ascii=False,separators=(',',':'))+'};\n'
open('js/data/experiences.js','w',encoding='utf-8').write(js)
json.dump({'records':out,'meta':meta},open('_build/built.json','w',encoding='utf-8'),ensure_ascii=False)
from collections import Counter
print(len(out),len(js)//1024,'KB')
print('brands',brandcount)
print('flags',Counter(f['code'] for r in out for f in r['reviewFlags']))
print('precision',Counter((r['city'],r['addressPrecision']) for r in out))
print('subs',Counter(s for r in out for s in r['subcategories']).most_common())
print('gaming unspecified',sum(1 for r in out if 'gaming' in r['categories'] and not any(SUBMETA[s][1]=='gaming' for s in r['subcategories'])))
print('kinds',Counter(l['kind'] for r in out for l in r['links']))
print('featured',sum(r['featured'] for r in out),'ideas',{k:len(v) for k,v in ideas.items()})
print([ (r['id'],[f['code'] for f in r['reviewFlags']]) for r in out if any(f['code'] in('duplicate-variant','sub-attraction','possible-duplicate') for f in r['reviewFlags'])])
print([r['id'] for r in out if r['address'] and not r['mapUrl']])
