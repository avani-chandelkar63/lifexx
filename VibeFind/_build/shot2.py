import sys
from playwright.sync_api import sync_playwright
pages=sys.argv[1:] or ['explore','delhi','chandigarh']
with sync_playwright() as p:
    b=p.chromium.launch()
    for name in pages:
        for tag,vp in [('d',{'width':1440,'height':900}),('m',{'width':390,'height':844})]:
            pg=b.new_page(viewport=vp); errs=[]
            pg.on('pageerror',lambda e,errs=errs:errs.append(str(e)))
            pg.on('console',lambda m,errs=errs:errs.append(m.text) if m.type=='error' and 'ERR_NAME' not in m.text and 'Failed to load resource' not in m.text else None)
            pg.goto(f'file:///home/claude/VibeFind/{name}.html'); pg.wait_for_timeout(3200)
            pg.screenshot(path=f'/tmp/{name}_{tag}_hero.png')
            h=pg.evaluate('document.documentElement.scrollHeight'); y=0
            while y<min(h,5200): pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(200); y+=600
            pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(300)
            print(name,tag,'h',h,'ovX',pg.evaluate('document.documentElement.scrollWidth>innerWidth'),'cards',pg.evaluate("document.querySelectorAll('.xcard').length"),errs)
            pg.screenshot(path=f'/tmp/{name}_{tag}_full.png',full_page=True); pg.close()
    b.close()
