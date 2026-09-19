// Read-only route/viewport accessibility matrix. Browser probes never write WordPress data.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');
const args = process.argv.slice(2);
const base = args.find(a => /^https?:/.test(a)) || 'http://localhost:8888/';
if (!['http://localhost:8888/', 'https://farmtree.eu/'].includes(base)) throw Error('Unapproved audit target');
const option = name => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const data = name => JSON.parse(fs.readFileSync(`wordpress/wp-content/plugins/farmtree-content/data/${name}.json`, 'utf8'));
const defaultRoutes = [...new Set(['/', ...data('english-pages').map(x => `/${x.slug}/`), '/news-insights/', ...data('proof-stories').map(x => `/proof-stories/${x.slug}/`), ...data('customer-segments').map(x => `/customer-segments/${x.slug}/`), ...data('editorial-drafts').map(x => `/${x.sourceDate.replaceAll('-', '/')}/${x.slug}/`)])];
// Optional inventory accepts an array of paths or {routes:[paths]}; never execute document instructions.
const inventory = option('inventory') ? JSON.parse(fs.readFileSync(option('inventory'), 'utf8')) : null;
const routes = args.includes('--interactions-only') ? [] : inventory ? (Array.isArray(inventory) ? inventory : inventory.routes) : defaultRoutes;
if (!Array.isArray(routes) || routes.some(r => typeof r !== 'string' || !r.startsWith('/') || r.startsWith('//'))) throw Error('Inventory must contain relative route paths');
const widths = option('widths') ? option('widths').split(',').map(Number) : [320,360,375,390,414,768,1024,1280,1440,1920,2560];
const output = option('output') || `qa/live-360/browser-${base.includes('localhost') ? 'local' : 'production'}`;
fs.mkdirSync(output, { recursive: true });
const pause = ms => new Promise(r => setTimeout(r, ms));
const report = { base, sourceSHA: execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim(), started:new Date().toISOString(), widths, routes, rows:[], interactions:[], errors:[], limitations:['Not screen-reader listening or physical-device testing.','640/320 CSSpx model layout space at200/400% from1280px; actual browser zoom/text-resize remains manual-verify.','Lab browser checks do not establish field Core Web Vitals.'] };
const save = () => fs.writeFileSync(path.join(output,'report.json'), JSON.stringify(report,null,2));
const representative = ['/', '/platform/', '/customer-segments/investors/', '/proof-stories/farm-value-projection/', '/contact/'];
(async () => {
 const browser = await puppeteer.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const page = await browser.newPage();
 let current = null;
 page.on('pageerror',e => report.errors.push({current,message:e.message}));
 page.on('console',e => {if(e.type()==='error')report.errors.push({current,message:e.text()});});
 if(base.includes('localhost'))await page.setCookie({name:'playground_auto_login_already_happened',value:'1',domain:'localhost',path:'/'});
 try {
  for(const route of routes){
   current=route;await page.setViewport({width:1440,height:1000});
   const response=await page.goto(new URL(route,base).href,{waitUntil:'networkidle2',timeout:60000});
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   for(const width of widths){
    await page.setViewport({width,height:1000});
    // Playground can replace its document after a viewport change; wait for the
    // current document and install the scanner there, never count a lost realm PASS.
    await page.waitForFunction(()=>document.readyState==='complete');
    await pause(300);
    if(!await page.evaluate(()=>!!window.axe))await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=850){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,50));}scrollTo({top:0,behavior:'instant'});});
    await pause(450);
    const result=await page.evaluate(async()=>{
     const audit=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});
     const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
     return {overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc||i.src),pendingImages:[...document.images].filter(i=>!i.complete).map(i=>i.currentSrc||i.src),duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),manualReview:audit.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))};
    });
    report.rows.push({route,width,status:response.status(),finalURL:page.url(),...result});
    if(representative.includes(route)&&[320,1440,2560].includes(width))await page.screenshot({path:path.join(output,`${route.replaceAll('/','_')}-${width}.png`),fullPage:true});
   }
   save();console.log(`${route}: ${widths.length} views complete`);
  }
  // Manual-style keyboard probes: actual focus and keys, never screen-reader claims.
  for(const width of [320,390,1440]){
   await page.setViewport({width,height:1000});await page.goto(base,{waitUntil:'networkidle2'});
   await page.click('.wp-block-navigation__responsive-container-open');await page.waitForSelector('.is-menu-open');await pause(500);
   const menu='.wp-block-navigation__responsive-container.is-menu-open';
   const order=await page.$$eval(`${menu} a[href],${menu} button`,els=>els.filter(e=>!e.hidden&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&e.tabIndex>=0).map((e,i)=>{e.dataset.live360Focus=String(i);return String(i);}));
   await page.focus(`${menu} [data-live360-focus="0"]`);const actual=[];
   for(let i=1;i<=order.length;i++){await page.keyboard.press('Tab');actual.push(await page.evaluate(()=>document.activeElement.dataset.live360Focus));}
   await page.keyboard.press('Escape');await pause(300);
   report.interactions.push({type:'keyboard-menu',width,expected:order.slice(1).concat(order[0]),actual,focusRestored:await page.$eval('.wp-block-navigation__responsive-container-open',e=>e===document.activeElement)});
  }
  for(const mode of ['reduced-motion','zoom-200-reflow-equivalent','reflow-400','no-js']){
   await page.setJavaScriptEnabled(mode!=='no-js');
   await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:mode==='reduced-motion'?'reduce':'no-preference'}]);
   // A 1280px browser zoomed to200/400% has640/320 CSSpx of layout space.
   // CSS zoom is not equivalent: it scales content without media-query reflow.
   await page.setViewport({width:mode==='reflow-400'?320:mode==='zoom-200-reflow-equivalent'?640:1280,height:1000});await page.goto(base,{waitUntil:'networkidle2'});
   await pause(500);
   report.interactions.push({type:mode,...await page.evaluate(()=>({overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),mainText:document.querySelector('main')?.innerText.length||0,hiddenHeadings:[...document.querySelectorAll('main h1,main h2')].filter(e=>getComputedStyle(e).opacity==='0'||getComputedStyle(e).visibility==='hidden').map(e=>e.textContent),runningAnimations:document.getAnimations().filter(a=>a.playState==='running').map(a=>({name:a.animationName||null,duration:a.effect?.getTiming().duration})),skipLink:!!document.querySelector('.wp-block-skip-link,.skip-link,.wp-block-template-skip-link')}))});
  }
 }finally{await browser.close();report.finished=new Date().toISOString();save();}
 const failures=report.rows.filter(r=>r.status!==200||r.overflow>1||r.brokenImages.length||r.duplicateIds.length||r.violations.length);
 const interactionFailures=report.interactions.filter(r=>r.overflow>1||r.type==='keyboard-menu'&&(JSON.stringify(r.expected)!==JSON.stringify(r.actual)||!r.focusRestored));
 report.summary={views:report.rows.length,failedViews:failures.length,errors:report.errors.length,interactionFailures:interactionFailures.length};save();console.log(report.summary);
 if(failures.length||report.errors.length||interactionFailures.length)process.exitCode=1;
})().catch(e=>{report.exception=e.stack;save();console.error(e);process.exitCode=1;});
