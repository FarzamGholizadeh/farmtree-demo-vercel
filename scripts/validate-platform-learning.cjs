const fs=require('node:fs'),assert=require('node:assert/strict'),puppeteer=require('puppeteer-core');
const base=process.argv[2]||'http://localhost:8890';
assert.ok(['http://localhost:8890','https://farmtree.eu'].includes(base));
const videos=JSON.parse(fs.readFileSync('wordpress/wp-content/themes/farmtree-native/inc/platform-videos.json'));
const production=base.startsWith('https:');
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const title=text=>text.replace(/–/g,'-'); // Core wptexturize typographic punctuation.
(async()=>{
 const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const rows=[],errors=[],requests=[];
 try{
  for(const width of [320,360,390,414,768,1024,1440,1920]){
   const page=await browser.newPage();await page.setViewport({width,height:950,hasTouch:width<900});
   if(!production)await page.setCookie({name:'playground_auto_login_already_happened',value:'1',domain:'localhost',path:'/'});
   const thirdParty=[];
   await page.evaluateOnNewDocument(()=>{window.learningCLS=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.learningCLS+=entry.value;}).observe({type:'layout-shift',buffered:true});});
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>{if(/youtube|ytimg|googlevideo|doubleclick/.test(new URL(r.url()).hostname))thirdParty.push(r.url());});
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   assert.equal((await page.goto(base+'/user-videos/',{waitUntil:'networkidle2'})).status(),200);
   await page.waitForSelector('.ft-learning-classroom.is-enhanced');
   assert.equal(await page.title(),production?'FarmTree Platform Videos | FarmTree':'FarmTree Platform Videos | FarmTree Native Local');
   assert.deepEqual(await page.$$eval('h1',es=>es.map(e=>e.textContent)),['FarmTree Platform Videos']);
   assert.equal(await page.$$eval('.ft-learning-card',es=>es.length),videos.length);
   assert.equal(await page.$$eval('iframe',es=>es.length),0);
   assert.deepEqual(thirdParty,[],'Zero third-party requests before consent');
   const initialCLS=await page.evaluate(()=>window.learningCLS);assert.ok(initialCLS<=0.1,'Initial layout shift: '+initialCLS);
   assert.deepEqual(await page.$$eval('.ft-learning-youtube a',es=>es.map(e=>e.href)),videos.map(v=>v.url));
   assert.ok(await page.$$eval('.ft-learning-card img',async es=>(await Promise.all(es.map(e=>new Promise(resolve=>{const probe=new Image();probe.onload=()=>resolve(probe.naturalWidth>0);probe.onerror=()=>resolve(false);probe.src=e.src;})))).every(Boolean)));
   await page.$eval('.ft-learning-classroom',e=>e.scrollIntoView({block:'start',behavior:'instant'}));
   if(width<900){assert.equal(await page.$eval('.ft-learning-navigation',e=>e.open),false);await page.click('.ft-learning-navigation summary');}
   for(let i=0;i<videos.length;i++){
    const button=(await page.$$('.ft-learning-nav-group button'))[i];
    await button.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await button.click();
    assert.equal(title(await page.$eval('#ft-learning-title',e=>e.textContent)),videos[i].title);
    assert.equal(await page.$eval('.ft-learning-info > a',e=>e.href),videos[i].url);
    assert.equal(await page.$$eval('.ft-learning-nav-group [aria-current]',es=>es.length),1);
   }
   await page.click('.ft-learning-step button:first-child');
   assert.equal(title(await page.$eval('#ft-learning-title',e=>e.textContent)),videos.at(-2).title);
   await page.click('.ft-learning-step button:last-child');
   assert.equal(title(await page.$eval('#ft-learning-title',e=>e.textContent)),videos.at(-1).title);
   await page.focus('.ft-learning-nav-group button');await page.keyboard.press('Enter');
   assert.equal(await page.$eval('#ft-learning-title',e=>e.textContent),videos[0].title);
   assert.equal(await page.$$eval('iframe',es=>es.length),0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.deepEqual(await page.$$eval('[id]',es=>es.map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i)),[]);
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const axe=await page.evaluate(async()=>await axe.run('.ft-learning-page',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   assert.deepEqual(axe.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`qa/video-hub/${production?'production':'local'}-${width}.png`,fullPage:false});
   if(width===390){
    await page.click('.ft-learning-player button');
    assert.equal(await page.$$eval('iframe',es=>es.length),1);
    const iframe=await page.$('iframe');assert.ok((await iframe.evaluate(e=>e.src)).includes('youtube-nocookie.com/embed/'+videos[0].id+'?autoplay=0'));
    const frame=await iframe.contentFrame();await frame.waitForSelector('video',{timeout:30000});await pause(1500);
    const text=await frame.evaluate(()=>document.body.innerText);
    assert.ok(!/configuration error|Video unavailable|Sign in to confirm/i.test(text),text);
    const video=await frame.$('video');assert.equal(await video.evaluate(e=>e.paused),true,'No autoplay');
    const play=await frame.waitForSelector('.ytp-large-play-button,button[aria-label="Play video"]',{visible:true,timeout:30000});await play.click();
    await frame.waitForFunction(()=>document.querySelector('video')?.currentTime>0,{timeout:30000});
    requests.push({playback:true,video:videos[0].id});
    await page.click('.ft-learning-step button:last-child');
    assert.equal(await page.$$eval('iframe',es=>es.length),0,'Switching removes previous player');
   }
   await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
   await page.click('.ft-learning-step button:last-child');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   rows.push({width,lessons:videos.length,navigation:true,keyboard:true,axe:true,overflow:0,thirdPartyBeforeLoad:0,initialCLS});
   console.log(width+': PASS');await page.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(`qa/video-hub/${production?'production':'local'}.json`,JSON.stringify({rows,requests,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
