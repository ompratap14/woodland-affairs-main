const { chromium } = require('C:/Users/om/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const report = [];
  for (const mobile of [true, false]) {
    const context = await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
    await context.addInitScript(() => {
      window.auditMetrics={longTasks:[],shifts:[]};
      new PerformanceObserver(l=>l.getEntries().forEach(e=>window.auditMetrics.longTasks.push(Math.round(e.duration)))).observe({type:'longtask',buffered:true});
      new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.auditMetrics.shifts.push(e.value)})).observe({type:'layout-shift',buffered:true});
    });
    for (const name of ['index','menu','gallery','celebrate','contact']) {
      const page = await context.newPage();
      const errors=[]; const failed=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url())});
      const cdp=await context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
      await page.goto(`http://127.0.0.1:8765/${name}.html`,{waitUntil:'load'});
      if(await page.locator('.intro__skip').isVisible())await page.locator('.intro__skip').click();
      await page.waitForTimeout(500);
      const initial=await page.evaluate(()=>({domReady:Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd),bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)}));
      for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(90)}
      await page.waitForTimeout(700);
      if(mobile){await page.locator('.nav__toggle').click();if(await page.locator('.nav__toggle').getAttribute('aria-expanded')!=='true')errors.push('Navigation failed');await page.locator('.nav__toggle').click();}
      const interactions=[];
      if(name==='menu'){
        for(const outlet of ['hari','dwarka','janakpuri']){
          await page.locator(`[data-outlet="${outlet}"]`).click();
          const height=await page.locator('.notebook').evaluate(e=>e.offsetHeight);
          await page.locator('[data-page="next"]').click();await page.waitForTimeout(1050);
          interactions.push({outlet,progress:await page.locator('.notebook__progress').innerText(),stableHeight:height===await page.locator('.notebook').evaluate(e=>e.offsetHeight)});
          await page.locator('[data-page="prev"]').click();await page.waitForTimeout(1050);
        }
        await page.locator('[data-type="buffet"]').click();
        for(const outlet of ['hari','dwarka','janakpuri']){await page.locator(`[data-outlet="${outlet}"]`).click();interactions.push({outlet,buffetCards:await page.locator('.buffet-card').count()})}
        await page.locator('[data-type="carte"]').click();
      }
      const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),metrics:window.auditMetrics,video:document.querySelector('video')?{paused:document.querySelector('video').paused,ready:document.querySelector('video').readyState}:null}));
      await page.screenshot({path:`audit-${name}-${mobile?'mobile':'desktop'}.png`});
      const result={name,mobile,initial,errors,failed,interactions,...state};report.push(result);console.log(JSON.stringify(result));
      await page.close();
    }
    await context.close();
  }
  fs.writeFileSync('audit-results.json',JSON.stringify(report,null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
