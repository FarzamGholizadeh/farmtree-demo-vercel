const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');
const theme = 'wordpress/wp-content/themes/farmtree-native/';
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/','https://farmtree.eu/'].includes(base));
const production = base.startsWith('https:');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const errors = [], rows = [];
  try {
    for (const width of production ? [390,1440,1920] : [320,390,768,1024,1440,1920]) {
      const page = await browser.newPage();
      await page.setViewport({width,height:900});
      if (!production) await page.setCookie({name:'playground_auto_login_already_happened',value:'1',domain:'localhost',path:'/'});
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', e => {if(e.type()==='error') errors.push(e.text());});
      await page.setRequestInterception(true);
      page.on('request', r => {
        const u = new URL(r.url());
        if(!production && u.pathname.endsWith('/assets/js/native-interactions.js')) return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync(theme+'assets/js/native-interactions.js')});
        if(!production && u.pathname.endsWith('/farmtree-native/style.css')) return r.respond({status:200,contentType:'text/css',body:fs.readFileSync(theme+'style.css')});
        return r.continue();
      });
      const values = () => page.$$eval('.ft-metric-value', es=>es.map(e=>e.textContent));
      for(let reload=0;reload<3;reload++) {
        assert.equal((await page.goto(base,{waitUntil:'networkidle2'})).status(),200);
        await page.evaluate(()=>sessionStorage.setItem('ft-metrics-animated','true'));
        assert.deepEqual(await values(),['0','0','0','0']);
        const controls = await page.$$eval('[data-ft-motion-control]',es=>es.map(e=>({text:e.textContent,label:e.getAttribute('aria-label'),width:e.getBoundingClientRect().width})));
        assert.ok(controls.length>=2);
        assert.ok(controls.every(e=>! /Pause|Playing|Paused/.test(e.text)&&e.label&&e.width>=44));
        assert.ok(await page.$$eval('.ft-motion-control-row--contextual button',es=>es.length===4&&es.every(e=>getComputedStyle(e).opacity==='0')));
        await page.focus('[data-ft-motion-control="hero slides"]');
        await page.keyboard.press('Space');
        assert.equal(await page.$eval('[data-ft-motion-control="hero slides"]',e=>e.getAttribute('aria-pressed')),'true');
        await page.$eval('.ft-home-metrics',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
        await sleep(350);
        assert.notDeepEqual(await values(),['0','0','0','0']);
        await sleep(1800);
        const final = ['+100','+30','+40','+1,000,000'];
        assert.deepEqual(await values(),final);
        await page.evaluate(()=>scrollTo(0,0)); await sleep(100);
        await page.$eval('.ft-home-metrics',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
        assert.deepEqual(await values(),final);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      }
      await page.$$eval('[data-ft-hero-dot]',es=>es[1].focus());
      await page.keyboard.press('Enter');
      assert.equal(await page.$$eval('.ft-home-hero-slide',es=>es.findIndex(e=>e.classList.contains('is-active'))),1);
      await page.$eval('.ft-platform-media-frame',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
      await page.waitForFunction(()=>document.querySelector('.ft-platform-gif img').getAttribute('src').endsWith('.gif'));
      await page.focus('[data-ft-motion-control="Platform animation"]');
      await page.keyboard.press('Space');
      assert.ok(await page.$eval('.ft-platform-gif img',e=>e.getAttribute('src').endsWith('poster.png')));
      await page.keyboard.press('Space');
      await page.waitForFunction(()=>document.querySelector('.ft-platform-gif img').getAttribute('src').endsWith('.gif'));
      await page.$eval('[data-ft-globe-shell]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
      await page.waitForFunction(()=>document.querySelector('[data-ft-globe-shell]').dataset.ftGlobeState==='ready');
      await page.evaluate(()=>document.activeElement.blur()); await page.mouse.move(0,0);
      const canvasBefore = await page.$eval('[data-ft-globe]',e=>e.toDataURL());
      await sleep(400);
      assert.notEqual(await page.$eval('[data-ft-globe]',e=>e.toDataURL()),canvasBefore);
      for(const label of ['partner logos','testimonials','globe animation','field quotes']) {
        const selector = `[data-ft-motion-control="${label}"]`;
        await page.focus(selector);
        assert.equal(await page.$eval(selector,e=>getComputedStyle(e).opacity),'1');
        await page.keyboard.press('Space');
        assert.equal(await page.$eval(selector,e=>e.getAttribute('aria-pressed')),'true');
        await page.keyboard.press('Space');
        await page.evaluate(()=>document.activeElement.blur());
        assert.equal(await page.$eval(selector,e=>getComputedStyle(e).opacity),'0');
      }
      for (const rail of ['.ft-partner-logos','.ft-testimonial-cards']) {
        await page.$eval(rail,e=>e.scrollIntoView({block:'center',behavior:'instant'}));
        const x = () => page.$eval(`${rail} .ft-moving-rail-track`,e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m41);
        const before = await x(); await sleep(500); const after = await x();
        assert.notEqual(before,after,'Rail must move');
        if(rail.includes('testimonial')) assert.ok(after>before,'Testimonials must move left to right');
      }
      await page.$eval('[data-ft-footer-quotes]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
      const quote = () => page.$$eval('[data-ft-footer-quotes] p',es=>es.find(e=>!e.hidden)?.textContent);
      const previousQuote=await quote(); await sleep(7300); assert.notEqual(await quote(),previousQuote);
      await page.evaluate(()=>scrollTo(0,0)); await sleep(300);
      fs.mkdirSync('qa/motion-cleanup',{recursive:true});
      await page.screenshot({path:`qa/motion-cleanup/${production?'production':'local'}-${width}.png`});
      await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
      await page.goto(base,{waitUntil:'networkidle2'});
      assert.deepEqual(await values(),['+100','+30','+40','+1,000,000']);
      assert.ok(await page.$$eval('[data-ft-motion-control]',es=>es.every(e=>e.disabled)));
      assert.ok(await page.$eval('.ft-platform-gif img',e=>e.getAttribute('src').endsWith('poster.png')));
      rows.push({width,reloads:3,counters:true,keyboard:true,reducedMotion:true,overflow:0});
      await page.close();
    }
    assert.deepEqual(errors,[]);
    fs.mkdirSync('qa/motion-cleanup',{recursive:true});
    fs.writeFileSync(`qa/motion-cleanup/${production?'production':'local'}.json`,JSON.stringify({rows,errors},null,2));
    console.log('PASS',JSON.stringify(rows));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
