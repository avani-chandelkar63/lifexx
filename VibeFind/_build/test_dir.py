from playwright.sync_api import sync_playwright
base='file:///home/claude/VibeFind/'
def cnt(pg): return pg.evaluate("+document.querySelector('#rCount').textContent")
with sync_playwright() as p:
    b=p.chromium.launch(); res=[]
    def ok(n,c,d=''): res.append((n,bool(c),d)); print(('PASS ' if c else 'FAIL ')+n,d)
    pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(base+'explore.html'); pg.wait_for_timeout(1500)
    ok('explore initial 258',cnt(pg)==258,cnt(pg)); ok('24 cards first',pg.evaluate("document.querySelectorAll('.xcard').length")==24)
    ok('no price filter UI',pg.evaluate("!/budget|price|₹/i.test(document.querySelector('#filters').textContent)"))
    pg.click('.fchip[data-f=city][data-v=delhi]'); pg.wait_for_timeout(300); ok('city=delhi 188',cnt(pg)==188,cnt(pg)); ok('url city',('city=delhi' in pg.url),pg.url)
    ok('zone facet appears',pg.evaluate("document.querySelectorAll('.fchip[data-f=zone]').length")==9)
    pg.click('.opt:has(input[data-v=sports]) '); pg.wait_for_timeout(300); n1=cnt(pg); ok('delhi+sports 27',n1==27,n1)
    pg.click('.opt:has(input[data-v=racquet])')
    pg.wait_for_timeout(300); ok('sub racquet narrows',cnt(pg)<=27,cnt(pg))
    pg.click('.achip--clear'); pg.wait_for_timeout(300); ok('clear all -> 258',cnt(pg)==258,cnt(pg)); ok('url cleared',pg.url.endswith('explore.html'),pg.url)
    # query via url
    pg.goto(base+'explore.html?cat=gaming&sub=snooker-pool&city=tricity'); pg.wait_for_timeout(1200)
    ok('deep link filters apply',0<cnt(pg)<80,cnt(pg)); ok('chips shown',pg.evaluate("document.querySelectorAll('.achip').length")>=3)
    pg.goto(base+'explore.html?mood=Adrenaline'); pg.wait_for_timeout(1000); ok('mood filter',cnt(pg)==8,cnt(pg))
    pg.goto(base+'explore.html?q=zzzzqq'); pg.wait_for_timeout(1000); ok('empty state',pg.is_visible('#empty') and cnt(pg)==0)
    pg.click('#empty [data-act=clear]'); pg.wait_for_timeout(400); ok('empty clear works',cnt(pg)==258)
    pg.goto(base+'explore.html?q=snooker'); pg.wait_for_timeout(1000); n=cnt(pg); ok('search snooker',n>60,n)
    pg.fill('#dq','VR'); pg.wait_for_timeout(600); ok('typed search VR',0<cnt(pg)<258,cnt(pg))
    pg.fill('#dq',''); pg.wait_for_timeout(500)
    pg.select_option('#dSort','az'); pg.wait_for_timeout(300); first=pg.evaluate("document.querySelector('.xcard h3').textContent"); ok('sort A-Z',first[0].lower()<='b',first)
    pg.click('.views [data-view=list]'); pg.wait_for_timeout(300); ok('list view',pg.evaluate("document.querySelector('#grid').classList.contains('grid--list')")); pg.click('.views [data-view=grid]')
    pg.click('#loadMore'); pg.wait_for_timeout(500); ok('load more -> 48',pg.evaluate("document.querySelectorAll('.xcard').length")==48,pg.evaluate("document.querySelectorAll('.xcard').length"))
    # wishlist from card
    pg.evaluate("document.querySelector('.xcard .heart').click()"); pg.wait_for_timeout(200); ok('save from card',pg.inner_text('#savedN')=='1')
    # hero tile
    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(600); pg.click('.tile[data-k=art]'); pg.wait_for_timeout(1200); ok('tile art -> 12',cnt(pg)==12,cnt(pg))
    # area
    pg.goto(base+'explore.html?city=delhi&area=rohini'); pg.wait_for_timeout(1000); ok('area rohini 13',cnt(pg)==13,cnt(pg))
    # city pages
    pg.goto(base+'delhi.html'); pg.wait_for_timeout(1800); ok('delhi 188',cnt(pg)==188,cnt(pg))
    ok('delhi has no city facet',pg.evaluate("!document.querySelector('.fchip[data-f=city]')"))
    pg.click('.zrow:nth-of-type(3)'); pg.wait_for_timeout(1500); ok('zone click filters',cnt(pg)<188,cnt(pg)); ok('zone active',pg.evaluate("!!document.querySelector('.zrow.is-on')"))
    pg.click('#stripRow .chip:nth-of-type(1)'); pg.wait_for_timeout(1300); ok('area chip filters',cnt(pg)==13,cnt(pg))
    pg.goto(base+'chandigarh.html'); pg.wait_for_timeout(1800); ok('tricity 70',cnt(pg)==70,cnt(pg))
    pg.click('.region[data-region=zirakpur]'); pg.wait_for_timeout(1500); ok('region zirakpur',cnt(pg)==pg.evaluate("VF.store.all.filter(r=>r.region==='zirakpur').length"),cnt(pg))
    ok('area list scoped',pg.evaluate("[...document.querySelectorAll('.arow')].every(a=>a.textContent.length>0)"))
    pg.goto(base+'chandigarh.html?region=mohali&cat=sports'); pg.wait_for_timeout(1200); ok('tricity deep link',0<cnt(pg)<70,cnt(pg))
    # mobile sheet
    m=b.new_page(viewport={'width':390,'height':844}); m.on('pageerror',lambda e:errs.append(str(e)))
    m.goto(base+'explore.html'); m.wait_for_timeout(1500)
    m.evaluate("document.querySelector('#directory').scrollIntoView()"); m.wait_for_timeout(600)
    m.click('#fOpen'); m.wait_for_timeout(1000); ok('mobile sheet opens',m.evaluate("document.querySelector('#filters').classList.contains('is-open')"))
    m.screenshot(path='/tmp/m_sheet.png')
    m.click('.opt:has(input[data-v=thrill])'); m.wait_for_timeout(300); m.click('#fApply'); m.wait_for_timeout(800)
    ok('mobile apply filter',cnt(m)==21,cnt(m)); ok('sheet closed',not m.evaluate("document.querySelector('#filters').classList.contains('is-open')"))
    m.screenshot(path='/tmp/m_results.png')
    print('ERRORS',errs); print(sum(1 for r in res if r[1]),'/',len(res))
    b.close()
