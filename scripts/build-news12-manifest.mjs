import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {PHP} from '@php-wasm/universal';
import {loadNodeRuntime} from '@php-wasm/node';
import {loadEditorialArticles} from './news-editorial-content.mjs';

const root=new URL('../',import.meta.url);
const plugin='wordpress/wp-content/plugins/farmtree-content/includes/';
const sha=x=>createHash('sha256').update(x).digest('hex');
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const php=new PHP(await loadNodeRuntime('8.3',{emscriptenOptions:{processId:process.pid}}));
let base;
try {
  const source=await readFile(new URL(plugin+'managed-content-manifest.php',root),'utf8');
  php.writeFile('/manifest.php',source);
  const response=await php.runStream({code:"<?php define('ABSPATH','/wordpress/'); echo json_encode(require '/manifest.php', JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);"});
  base=JSON.parse(await response.stdoutText);
} finally {php.exit();}
const articles=await loadEditorialArticles();assert.equal(articles.length,12);
const release=JSON.parse(await readFile(new URL('config/farmtree-native-release-files.json',root),'utf8'));
const additions={terms:[],assets:[],entities:[]};
const terms=new Map(base.terms.map(t=>[t.name,t.key]));
for(const a of articles) {
  if(!terms.has(a.category)) {
    const slug=a.category.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-').replaceAll(/^-|-$/g,'');
    const key=`category.en.${slug}`;
    additions.terms.push({key,taxonomy:'category',slug,name:a.category,description:''});terms.set(a.category,key);
  }
  const path=`assets/images/${a.image.directory}/${a.image.filename}`;
  assert(release.runtime.includes('wordpress/wp-content/themes/farmtree-native/'+path),'News source image must be audited runtime');
  assert(!base.assets.some(asset=>asset.relative_path===path),'Duplicate pre-existing managed image');
  const imageSlug=a.image.filename.replace(/\.jpg$/,'');
  const assetKey=`asset.news12.${imageSlug}`;
  additions.assets.push({key:assetKey,slug:imageSlug,relative_path:path,title:a.image.alt,alt:a.image.alt,mime_type:'image/jpeg',sha256:sha(await readFile(new URL('wordpress/wp-content/themes/farmtree-native/'+path,root)))});
  additions.entities.push({key:`post.en.${a.slug.replaceAll('-','_')}`,post_type:'post',slug:a.slug,legacy_slugs:[],fields:{post_title:a.title,post_name:a.slug,post_status:'publish',post_excerpt:a.deck,post_content:a.content,comment_status:'closed',ping_status:'closed',menu_order:0},featured_asset_key:assetKey,category_keys:[terms.get(a.category)],child_keys:[]});
}
const referenceTerms=base.terms.filter(t=>additions.entities.some(e=>e.category_keys.includes(t.key)));
assert.equal(referenceTerms.length,1);
assert.equal(referenceTerms[0].name,'Policy & Standards');
const manifest={manifest_version:base.manifest_version,profile:'news12',team_member_keys:[],reference_terms:referenceTerms,...additions};
for(const kind of Object.keys(additions)) {
  const oldKeys=new Set(base[kind].map(x=>x.key));
  for(const x of additions[kind])assert(!oldKeys.has(x.key),'Existing identity collision');
}
manifest.news12_keys=Object.fromEntries(Object.entries(additions).map(([kind,items])=>[kind,items.map(x=>x.key)]));
const literal=JSON.stringify(manifest).replaceAll('\\','\\\\').replaceAll("'","\\'");
const output=`<?php\n/** Generated: node scripts/build-news12-manifest.mjs. Isolated exact News12 scope; no global manifest fallback. */\nif (!defined('ABSPATH')) { exit; }\nreturn json_decode('${literal}', true, 512, JSON_THROW_ON_ERROR);\n`;
const path=new URL(plugin+'news12-content-manifest.php',root);
if(process.argv.includes('--check'))assert.equal(await readFile(path,'utf8'),output,'Stale News12 manifest');
else await writeFile(path,output);
console.log(JSON.stringify({manifest_sha256:sha(JSON.stringify(canonical(manifest))),newTerms:additions.terms.length,newAssets:additions.assets.length,newPosts:additions.entities.length,oldManifestUnchanged:true}));
