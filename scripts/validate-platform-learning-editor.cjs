const assert=require('node:assert/strict'),puppeteer=require('puppeteer-core'),fs=require('node:fs');
(async()=>{
 const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const page=await browser.newPage();await page.goto('http://localhost:8890/wp-admin/post-new.php?post_type=page',{waitUntil:'networkidle2'});
  await page.waitForFunction(()=>window.wp?.blocks?.parse&&window.wp?.apiFetch);
  const result=await page.evaluate(async()=>{
   const patterns=await wp.apiFetch({path:'/wp/v2/block-patterns/patterns'});
   const pattern=patterns.find(p=>p.name==='farmtree-native/platform-learning');
   if(!pattern)throw Error('Learning pattern missing');
   const blocks=wp.blocks.parse(pattern.content),invalid=[];
   let cards=0,images=0,links=0;
   function walk(list){for(const b of list){if(!b.isValid)invalid.push({name:b.name});if(b.attributes.className==='ft-learning-card')cards++;if(b.name==='core/image')images++;if(b.attributes.className==='ft-learning-youtube')links++;walk(b.innerBlocks);}}
   walk(blocks);
   const template=await wp.apiFetch({path:'/wp/v2/templates/farmtree-native//page-user-videos?context=edit'});
   return{invalid,cards,images,links,template:template.slug,roundTrip:wp.blocks.parse(wp.blocks.serialize(blocks)).every(b=>b.isValid)};
  });
  console.log(JSON.stringify(result,null,2));assert.deepEqual(result.invalid,[]);assert.equal(result.cards,25);assert.equal(result.images,25);assert.equal(result.links,25);assert.equal(result.roundTrip,true);
  fs.writeFileSync('qa/video-hub/editor.json',JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
