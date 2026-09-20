const assert=require('node:assert/strict'),fs=require('node:fs'),puppeteer=require('puppeteer-core');
const base=process.argv[2]||'http://localhost:8888/';
assert.ok(['http://localhost:8888/','https://farmtree.eu/'].includes(base));
const production=base.startsWith('https:'),theme='wordpress/wp-content/themes/farmtree-native/';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const absent='[data-ft-motion-control],.ft-motion-control-row,.ft-motion-toggle,[data-ft-globe-direction],.ft-globe-direction-controls';
const final=['+100','+30','+40','+1,000,000'];
(async()=>{
 const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const rows=[],errors=[];
 try {
  const widths=production?[390,1440,1920]:(process.env.MOTION_WIDTHS||'320,390,768,1024,1440,1920').split(',').map(Number);
  assert.ok(widths.every(w=>[320,390,768,1024,1440,1920].includes(w)));
  for(const width of widths){
   const page=await browser.newPage();await page.setViewport({width,height:900,hasTouch:true});
   if(!production)await page.setCookie({name:'playground_auto_login_already_happened',value:'1',domain:'localhost',path:'/'});
   page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
   if(!production){await page.setRequestInterception(true);page.on('request',r=>{
    const p=new URL(r.url()).pathname;
    if(p.endsWith('/assets/js/native-interactions.js'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync(theme+'assets/js/native-interactions.js')});
    if(p.endsWith('/farmtree-native/style.css'))return r.respond({status:200,contentType:'text/css',body:fs.readFileSync(theme+'style.css')});
    r.continue();
   });}
   const values=()=>page.$$eval('.ft-metric-value',es=>es.map(e=>e.textContent));
   const index=()=>page.$$eval('.ft-home-hero-slide',es=>es.findIndex(e=>e.classList.contains('is-active')));
   for(let reload=0;reload<3;reload++){
    assert.equal((await page.goto(base,{waitUntil:'networkidle2'})).status(),200);
    assert.equal(await page.$$eval(absent,es=>es.length),0);
    assert.deepEqual(await values(),['0','0','0','0']);
    await page.$eval('.ft-home-metrics',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    await wait(350);assert.notDeepEqual(await values(),['0','0','0','0']);await wait(1800);assert.deepEqual(await values(),final);
    await page.evaluate(()=>scrollTo(0,0));await wait(100);
    await page.$eval('.ft-home-metrics',e=>e.scrollIntoView({block:'center',behavior:'instant'}));assert.deepEqual(await values(),final);
   }
   await page.focus('.ft-home-hero');await page.keyboard.press('Space');
   assert.equal(await page.$eval('.ft-home-hero',e=>e.dataset.ftMotionPaused),'true');
   await page.$$eval('[data-ft-hero-dot]',es=>es[0].focus());
   let before=await index();await page.keyboard.press('ArrowRight');assert.notEqual(await index(),before);
   assert.equal(await page.$$eval('[data-ft-hero-prev],[data-ft-hero-next]',es=>es.length),2);
   if(width>=768){before=await index();await page.click('[data-ft-hero-next]');assert.notEqual(await index(),before);await page.click('[data-ft-hero-prev]');assert.equal(await index(),before);}
   const cdp=await page.createCDPSession();
   const touchDrag=async selector=>{
    await page.$eval(selector,e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    const r=await page.$eval(selector,e=>{const b=e.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2};});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x,y:r.y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x-90,y:r.y+25}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   };
   if(width<768){before=await index();await touchDrag('.ft-home-hero');assert.notEqual(await index(),before,'Hero swipe');}
   await page.focus('.ft-platform-media-frame');
   await page.waitForFunction(()=>document.querySelector('.ft-platform-gif img').getAttribute('src').endsWith('.gif'));
   await page.keyboard.press('Space');assert.ok(await page.$eval('.ft-platform-gif img',e=>e.getAttribute('src').endsWith('poster.png')));
   await page.keyboard.press('Space');await page.waitForFunction(()=>document.querySelector('.ft-platform-gif img').getAttribute('src').endsWith('.gif'));
   await page.focus('[data-ft-globe]');await page.waitForFunction(()=>document.querySelector('[data-ft-globe-shell]').dataset.ftGlobeState==='ready');
   await page.keyboard.press('Space');const canvas=()=>page.$eval('[data-ft-globe]',e=>e.toDataURL());
   for(const key of ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']){const a=await canvas();await page.keyboard.press(key);assert.notEqual(await canvas(),a);}
   let a=await canvas();await touchDrag('[data-ft-globe]');assert.notEqual(await canvas(),a,'Globe touch');
   const rect=await page.$eval('[data-ft-globe]',e=>{const b=e.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2};});
   a=await canvas();await page.mouse.move(rect.x,rect.y);await page.mouse.down();await page.mouse.move(rect.x+50,rect.y+35,{steps:5});await page.mouse.up();assert.notEqual(await canvas(),a,'Globe pointer');
   await page.evaluate(()=>document.activeElement.blur());await page.mouse.move(0,0);
   for(const rail of ['.ft-partner-logos','.ft-testimonial-cards']){
    await page.$eval(rail,e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    const x=()=>page.$eval(rail+' .ft-moving-rail-track',e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m41);
    const start=await x();await wait(500);const end=await x();assert.notEqual(end,start);
    if(rail.includes('testimonial'))assert.ok(end>start,'Left to right');
    await page.focus(rail);await page.keyboard.press('Space');
    assert.equal(await page.$eval(rail+' .ft-moving-rail-track',e=>getComputedStyle(e).animationPlayState),'paused');
    await wait(50);const stopped=await x();await wait(150);assert.equal(await x(),stopped);
    await page.keyboard.press('Space');await page.evaluate(()=>document.activeElement.blur());
   }
   assert.ok(await page.$$eval('[data-ft-rail-clone]',es=>es.length>0&&es.every(e=>e.inert&&e.getAttribute('aria-hidden')==='true')));
   await page.$eval('[data-ft-footer-quotes]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   const quote=()=>page.$$eval('[data-ft-footer-quotes] p',es=>es.find(e=>!e.hidden)?.textContent);
   const q=await quote();await wait(7300);assert.notEqual(await quote(),q);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.evaluate(()=>scrollTo(0,0));await wait(300);fs.mkdirSync('qa/motion-dom-removal',{recursive:true});
   await page.screenshot({path:`qa/motion-dom-removal/${production?'production':'local'}-${width}.png`});
   await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(base,{waitUntil:'networkidle2'});
   assert.deepEqual(await values(),final);assert.equal(await page.$$eval(absent,es=>es.length),0);
   assert.ok(await page.$eval('.ft-platform-gif img',e=>e.getAttribute('src').endsWith('poster.png')));
   assert.ok(await page.$$eval('[data-ft-motion-paused]',es=>es.every(e=>e.dataset.ftMotionPaused==='true')));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   rows.push({width,reloads:3,removedControls:0,hero:true,globePointerTouchKeyboard:true,rails:true,quotes:true,counters:true,reducedMotion:true,overflow:0});
   console.log(width+': PASS');await page.close();
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(`qa/motion-dom-removal/${production?'production':'local'}.json`,JSON.stringify({rows,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
