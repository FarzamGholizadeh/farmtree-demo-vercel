import fs from 'node:fs';
import assert from 'node:assert/strict';
const url='https://www.youtube.com/@farmtree8168/videos?hl=en';
const response=await fetch(url);assert.equal(response.status,200);
const html=await response.text();
const data=JSON.parse(html.match(/var ytInitialData = (.*?);<\/script>/s)[1]);
assert.equal(data.metadata.channelMetadataRenderer.externalId,'UCYz-zoEsltMhWprHLIKcvMw');
const videos=[];let continuation=false;
function walk(x){if(!x||typeof x!=='object')return;if(x.continuationItemRenderer)continuation=true;const v=x.lockupViewModel;if(v?.contentType==='LOCKUP_CONTENT_TYPE_VIDEO'){videos.push({id:v.contentId,title:v.metadata.lockupMetadataViewModel.title.content,url:'https://www.youtube.com/watch?v='+v.contentId,thumbnail:v.contentImage.thumbnailViewModel.image.sources.at(-1),duration:v.contentImage.thumbnailViewModel.overlays[0].thumbnailBottomOverlayViewModel.badges[0].thumbnailBadgeViewModel.text});return;}for(const v of Object.values(x))walk(v);}
walk(data.contents);assert.equal(continuation,false,'Pagination must be reviewed');assert.equal(new Set(videos.map(v=>v.id)).size,videos.length);
fs.mkdirSync('qa/video-hub',{recursive:true});fs.writeFileSync('qa/video-hub/channel-inventory.json',JSON.stringify({source:url,channelId:data.metadata.channelMetadataRenderer.externalId,verifiedAt:new Date().toISOString(),videos},null,2));
console.log(JSON.stringify({count:videos.length,ids:videos.map(v=>v.id)}));
