const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),puppeteer=require('puppeteer-core');
const base=process.argv[2]||'http://localhost:8888/', production=base==='https://farmtree.eu/';
assert.ok(production||base==='http://localhost:8888/');
const file='wordpress/wp-content/themes/farmtree-native/assets/js/native-interactions.js';
const source=fs.readFileSync(file,'utf8'),old=cp.execFileSync('git',['show','d904f00bbddecb2be3980bcf8ac82fac6c6a5552:'+file],{encoding:'utf8'});
const expected=old.replace(/        const arcPairs = \[[\s\S]*?        \];\n/,'').replace(/        function arcBetween\([\s\S]*?(?=        async function loadEarthTexture)/,'').replace('            let arcs = [];\n','').replace(/            function drawArc\([\s\S]*?(?=            function draw\(time)/,'').replace(/^\s*arcs\.forEach\(.*\n/m,'').replace(/^\s*arcs = arcPairs\.map\(.*\n/m,'');
assert.equal(source,expected,'Only connection-route source removed; markers and interactions byte-identical');
assert.ok(!/arcPairs|arcBetween|drawArc|setLineDash|lineDashOffset/.test(source));
fs.mkdirSync('qa/globe-arcs',{recursive:true});
(async()=>{
 const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const rows=[],errors=[];
 try{for(const width of production?[390,1440,1920]:[390,768,1440,1920]){
  const page=await browser.newPage();await page.setViewport({width,height:900,hasTouch:true});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
  if(!production){await page.setCookie({name:'playground_auto_login_already_happened',value:'1',domain:'localhost',path:'/'});await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).pathname.endsWith('/assets/js/native-interactions.js')?r.respond({status:200,contentType:'application/javascript',body:source}):r.continue());}
  await page.evaluateOnNewDocument(()=>{window.globeEvidence={lines:0,dashes:0,dots:0};for(const method of ['lineTo','setLineDash','arc']){const original=CanvasRenderingContext2D.prototype[method];CanvasRenderingContext2D.prototype[method]=function(...args){if(this.canvas.matches('[data-ft-globe]')){if(method==='lineTo')window.globeEvidence.lines++;if(method==='setLineDash'&&args[0].length)window.globeEvidence.dashes++;if(method==='arc'&&Math.abs(args[2]-2.15*devicePixelRatio)<.01)window.globeEvidence.dots++;}return original.apply(this,args);};}});
  assert.equal((await page.goto(base,{waitUntil:'networkidle2'})).status(),200);
  await page.focus('[data-ft-globe]');await page.waitForFunction(()=>document.querySelector('[data-ft-globe-shell]').dataset.ftGlobeState==='ready');await page.keyboard.press('Space');
  assert.equal(await page.$eval('[data-ft-globe]',e=>e.dataset.ftGlobeLocationCount),'22');
  const position=()=>page.$eval('[data-ft-globe]',e=>[e.dataset.ftGlobeRotation,e.dataset.ftGlobePitch]);
  for(const key of ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']){const before=await position();await page.keyboard.press(key);assert.notDeepEqual(await position(),before);}
  await page.$eval('[data-ft-globe]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));const r=await page.$eval('[data-ft-globe]',e=>{const b=e.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2};});
  let before=await position();await page.mouse.move(r.x,r.y);await page.mouse.down();await page.mouse.move(r.x+50,r.y+35,{steps:5});await page.mouse.up();let after=await position();assert.ok(after.every((v,i)=>v!==before[i]),'Both pointer axes');
  const cdp=await page.createCDPSession();before=await position();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[r]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:r.x-80,y:r.y-25}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});after=await position();assert.ok(after.every((v,i)=>v!==before[i]),'Both touch axes');
  const evidence=await page.evaluate(()=>window.globeEvidence);assert.equal(evidence.lines,0);assert.equal(evidence.dashes,0);assert.ok(evidence.dots>0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(await page.$$eval('[id]',es=>es.map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i)),[]);
  await (await page.$('[data-ft-globe-shell]')).screenshot({path:`qa/globe-arcs/${production?'production':'local'}-${width}.png`});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload({waitUntil:'networkidle2'});await page.focus('[data-ft-globe]');await page.waitForFunction(()=>document.querySelector('[data-ft-globe-shell]').dataset.ftGlobeState==='reduced');assert.equal(await page.$eval('[data-ft-globe-shell]',e=>e.dataset.ftMotionPaused),'true');before=await position();await page.keyboard.press('ArrowRight');assert.notDeepEqual(await position(),before);
  rows.push({width,markers:22,routes:0,dashes:0,pointer:true,touch:true,keyboard:true,reducedMotion:true,overflow:0,duplicateIds:0});console.log(width+': PASS');await page.close();
 }assert.deepEqual(errors,[]);fs.writeFileSync(`qa/globe-arcs/${production?'production':'local'}.json`,JSON.stringify({rows,errors},null,2));}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
