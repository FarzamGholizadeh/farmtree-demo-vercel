// Reviewed source import: metadata and JPEG posters only, never video binaries.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const inventory=JSON.parse(fs.readFileSync('qa/video-hub/channel-inventory.json'));
const choices=[
 ['HS9B74tx2iE','Getting started','A short introduction to the FarmTree Platform and its features.'],
 ['Sqxry5mQgec','Getting started','Build scenarios, define plots, add species and run simulations in the FarmTree Tool.'],
 ['6Ppp_8b4qSE','Planning workflows','Organise scenarios with folders and tags, and find the scenarios you need.'],
 ['V1r6Ww1AJ54','Planning workflows','Create and upload field surveys to monitor project activity and assess impact.'],
 ['zaPfRYsBiXY','Planning workflows','Upload, create and manage plot polygons for use in your scenarios.'],
 ['PSlD-VpPEsk','Planning workflows','Run multiple scenarios, select metrics, analyse outputs and export results.'],
 ['YlGmhqPkn4I','Planning workflows','Compare project scenarios with business-as-usual across financial, carbon, social and environmental metrics.'],
 ['Gi3NwwrPWdY','Planning workflows','Invite team members, review roles and remove inactive users.'],
 ['07ilVjP90rQ','Landscape planning','An introduction to planning agroforestry interventions with the Watershed Tool.'],
 ['MiA7fllbe4k','Modelling tutorials','Explore the soil fertility functions in the FarmTree Tool.'],
 ['TCejsqXmTYE','Modelling tutorials','Define planting density for species in an agroforestry scenario.'],
 ['igzaprkVYSE','Modelling tutorials','Interpret the integrated production potential of plant species.'],
 ['vY3GxB2ZKQs','Modelling tutorials','Interpret biomass and carbon graphs in the FarmTree Tool.'],
 ['fOS4_Ity6Wg','Modelling tutorials','Understand uncertainty margins for annual carbon sequestration by individual trees.'],
 ['v90mSmPKWQ4','Modelling tutorials','Interpret the biodiversity indicator in the FarmTree Tool.'],
 ['VV1uH1lYdm4','Modelling tutorials','Define prices, costs and labour settings, and review financial projections.'],
 ['AzuhfVvZz9o','Modelling tutorials','Link scenarios to climate data and explore climate-change effects.'],
 ['_dKBc1g6enE','Modelling tutorials','Explore water inflows and outflows through soil layers.'],
 ['AH_7jO2z7f8','Modelling tutorials','Simulate irrigation and review species water requirements.'],
 ['U0ixAfal_Q0','Earlier walkthroughs','A walkthrough of creating a FarmTree Tool account.'],
 ['MgkG2aXE6uA','Earlier walkthroughs','Explore the FarmTree Tool interface and its scenario-design functions.'],
 ['isffI5OZ5YY','Earlier walkthroughs','An earlier overview of side-by-side scenario comparison. For the updated workflow, use the 2026 lesson.'],
 ['AbGBX_5rJWg','Earlier walkthroughs','A demonstration of the FarmTree Tool recorded in January 2023.'],
 ['1wR6Gg_UteE','Earlier walkthroughs','The FarmTree Platform release announcement.'],
 ['HqlibR62zvw','Spanish introduction','A Spanish-language introduction to FarmTree tools for agroforestry projects.']
];
const dir='wordpress/wp-content/themes/farmtree-native/assets/images/videos';fs.mkdirSync(dir,{recursive:true});
const records=[];
for(const [id,module,description] of choices){const source=inventory.videos.find(v=>v.id===id);assert.ok(source);const r=await fetch(source.thumbnail.url);assert.equal(r.status,200);assert.ok(r.headers.get('content-type').includes('image/'));const bytes=Buffer.from(await r.arrayBuffer());assert.ok(bytes.length<250000);fs.writeFileSync(`${dir}/${id}.jpg`,bytes);records.push({...source,module,description,order:records.length+1,poster:`assets/images/videos/${id}.jpg`});}
fs.writeFileSync('qa/video-hub/library.json',JSON.stringify({source:inventory.source,channelId:inventory.channelId,verifiedAt:inventory.verifiedAt,excluded:inventory.videos.filter(v=>!choices.some(([id])=>id===v.id)).map(v=>({id:v.id,title:v.title,reason:'Field documentary, not Platform instruction'})),videos:records},null,2));
console.log(`${records.length} verified lessons; JPEG posters only`);
