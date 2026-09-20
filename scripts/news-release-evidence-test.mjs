import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PHP } from '@php-wasm/universal';
import { loadNodeRuntime } from '@php-wasm/node';
const source = readFileSync(new URL('./news-release-evidence.php', import.meta.url));
const helpers = ['news-release-command.php', 'news-release-evidence.php', 'cron-diagnostics-bootstrap.php', 'cron-diagnostics-snapshot.php', 'lib/cron-diagnostics.php', 'release-native-state-gates.php'].map(name => readFileSync(new URL(name, import.meta.url)).toString('base64'));
const php = new PHP(await loadNodeRuntime('8.3', { emscriptenOptions: { processId: process.pid } }));
try {
  const result = await php.runStream({ code: `<?php
file_put_contents('/evidence.php', base64_decode('${source.toString('base64')}'));
require '/evidence.php';
foreach (${JSON.stringify(helpers).replaceAll('[', 'array(').replaceAll(']', ')')} as $encoded) token_get_all(base64_decode($encoded), TOKEN_PARSE);
function reject_news($fn) { try { $fn(); } catch(Throwable $e) { return true; } throw new RuntimeException('Expected refusal'); }
$base=['schemaVersion'=>1,'tables'=>['wp_posts'=>['schemaHash'=>'schema','rows'=>['oldhash'],'scopedRows'=>[]]],'scope'=>['postIds'=>[],'termIds'=>[]],'categoryCounts'=>[3=>2],'newCategoryRelations'=>[],'optionHashes'=>['blog_public:one','cron:fixed'],'uploads'=>['files'=>['oldfile'=>'oldhash'],'scopedFiles'=>[]]];
$dry=news_compare($base,$base,false);
$after=$base; $after['tables']['wp_posts']['rows'][]='newhash'; $after['tables']['wp_posts']['scopedRows']=['newhash'];
$after['scope']=['postIds'=>range(1,24),'termIds'=>range(1,5)]; $after['categoryCounts']=[3=>3,7=>1]; $after['newCategoryRelations']=[3=>1,7=>1];
$after['uploads']['files']['newfile']='newhash'; $after['uploads']['scopedFiles']=['newfile'=>'newhash'];
$apply=news_compare($base,$after,true);
$fail=[];
$bad=$after; $bad['tables']['wp_posts']['rows'][0]='manualedit'; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$bad=$after; $bad['tables']['wp_posts']['rows'][]='unrelated'; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$bad=$after; $bad['categoryCounts'][3]=99; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$bad=$after; $bad['categoryCounts'][7]=99; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$bad=$after; $bad['optionHashes'][1]='cron:changed'; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$bad=$after; $bad['tables']['wp_posts']['schemaHash']='drift'; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$fail[]=reject_news(fn()=>news_compare($base,$after,false));
$bad=$after; $bad['scope']['postIds']=range(1,23); $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$bad=$base; $bad['tables']['wp_posts']['scopedRows']=['oldhash']; $fail[]=reject_news(fn()=>news_compare($bad,$after,true));
$bad=$after; $bad['uploads']['files']['oldfile']='edited'; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$bad=$after; $bad['uploads']['files']['unrelated']='unexpected'; $fail[]=reject_news(fn()=>news_compare($base,$bad,true));
$cacheBefore=$base; $cacheBefore['tables']['wp_options']=['schemaHash'=>'options','rows'=>['cache-old'],'scopedRows'=>[]]; $cacheBefore['categoryCache']=['table'=>'wp_options','fullHash'=>'cache-old','semanticHash'=>'unchanged-value-autoload'];
$cacheAfter=$after; $cacheAfter['tables']['wp_options']=['schemaHash'=>'options','rows'=>['cache-new'],'scopedRows'=>[]]; $cacheAfter['categoryCache']=['table'=>'wp_options','fullHash'=>'cache-new','semanticHash'=>'unchanged-value-autoload'];
if (!news_compare($cacheBefore,$cacheAfter,true)['categoryCacheRowIdentityChurn']) throw new RuntimeException('Expected exact cache-ID disclosure');
$bad=$cacheAfter; $bad['categoryCache']['semanticHash']='autoload-changed'; $fail[]=reject_news(fn()=>news_compare($cacheBefore,$bad,true));
$bad=$cacheAfter; $bad['optionHashes'][]='changedvalue'; $fail[]=reject_news(fn()=>news_compare($cacheBefore,$bad,true));
$bad=$cacheAfter; $bad['tables']['wp_options']['rows'][]='other-option-ID'; $fail[]=reject_news(fn()=>news_compare($cacheBefore,$bad,true));
$fail[]=reject_news(fn()=>news_compare($cacheBefore,$cacheAfter,false));
echo json_encode(['dry'=>$dry,'apply'=>$apply,'rejections'=>count($fail)]);
` });
  const data = JSON.parse(await result.stdoutText);
  assert(data.dry.ok && data.apply.ok);
  assert.equal(data.rejections, 15);
  console.log('NEWS_RELEASE_EVIDENCE_PASS: six PHP helpers syntax-checked; strict dry-run, scoped creates, exact cache-row-ID disclosure, fifteen negative mutation/scope fixtures including uploads.');
} finally { php.exit(); }
