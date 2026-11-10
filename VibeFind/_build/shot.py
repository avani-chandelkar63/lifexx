import sys, asyncio
from playwright.sync_api import sync_playwright
url='file:///home/claude/VibeFind/index.html'
with sync_playwright() as p:
    b=p.chromium.launch()
    errs=[]
    for name,vp in [('desktop',{'width':1440,'height':900}),('mobile',{'width':390,'height':844})]:
        pg=b.new_page(viewport=vp)
        pg.on('console',lambda m,errs=errs:errs.append(('console',m.type,m.text)) if m.type in('error','warning') else None)
        pg.on('pageerror',lambda e,errs=errs:errs.append(('pageerror',str(e))))
        pg.goto(url); pg.wait_for_timeout(3500)
        pg.screenshot(path=f'/tmp/{name}_hero.png')
        h=pg.evaluate('document.documentElement.scrollHeight')
        # scroll through to trigger reveals
        y=0
        while y<h:
            pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(250); y+=700
        pg.evaluate('window.scrollTo(0,0)')
        pg.screenshot(path=f'/tmp/{name}_full.png',full_page=True)
        print(name,'height',h,'overflowX',pg.evaluate('document.documentElement.scrollWidth>innerWidth'))
    print(errs[:10])
    b.close()
