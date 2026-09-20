import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PHP} from '@php-wasm/universal';
import {loadNodeRuntime} from '@php-wasm/node';

const source=readFileSync(new URL('lib/cron-diagnostics.php',import.meta.url),'utf8');
const php=new PHP(await loadNodeRuntime('8.3',{emscriptenOptions:{processId:process.pid}}));
try {
  const result=await php.runStream({code:source+`
mkdir('/wordpress/wp-content/plugins/farmtree-content',0777,true);
file_put_contents('/wordpress/wp-content/plugins/farmtree-content/fixture.php','<?php function fixture_callback() {}');
require '/wordpress/wp-content/plugins/farmtree-content/fixture.php';
mkdir('/private-recovery/stage/wp-content/plugins/farmtree-content',0777,true);
file_put_contents('/private-recovery/stage/wp-content/plugins/farmtree-content/fixture.php','<?php function staged_fixture_callback() {}');
require '/private-recovery/stage/wp-content/plugins/farmtree-content/fixture.php';
$old=array(100=>array('fixture_hook'=>array('ignored_key'=>array('schedule'=>'hourly','interval'=>3600,'args'=>array('secret-fixture-token','person@example.invalid')))), 'version'=>2);
$old[100]['stage_hook']=$old[100]['fixture_hook'];
$next=$old; $next[3700]=$next[100]; unset($next[100]);
$records=array();
$observer=new FarmTree_Cron_Diagnostics(function($event) use (&$records) {$records[]=$event;}, '/wordpress', '/private-recovery/stage');
$observer->install();
$GLOBALS['wp_filter']['fixture_hook']=array(10=>array(array('function'=>'fixture_callback')));
$GLOBALS['wp_filter']['stage_hook']=array(10=>array(array('function'=>'staged_fixture_callback')));
$origin=new ReflectionMethod($observer,'origin');
$unknown=$origin->invoke($observer,'/unrelated-secret-path/wp-content/plugins/farmtree-content/fixture.php');
$unchanged=$observer->proposed($old,$old);
$returned=$observer->proposed($next,$old);
$observer->updated($old,$next);
$roundtrip=FarmTree_Cron_Diagnostics::decode(serialize($next));
$invalid=false; try {FarmTree_Cron_Diagnostics::decode('not serialized');} catch(Throwable $e) {$invalid=true;}
$unsafe=false; $bad=$old; $bad[100]['secret email@example.invalid']=$bad[100]['fixture_hook'];
try {FarmTree_Cron_Diagnostics::snapshot($bad);} catch(Throwable $e) {$unsafe=true;}
$serializationCalls=0;
class DiagnosticMaliciousArgument { public function __serialize(): array {$GLOBALS['serializationCalls']++; return array();} }
$objectRejected=false; $objectCron=$old; $objectCron[100]['fixture_hook']['ignored_key']['args']=array('nested'=>array(new DiagnosticMaliciousArgument()));
try {FarmTree_Cron_Diagnostics::snapshot($objectCron);} catch(Throwable $e) {$objectRejected=true;}
$resourceRejected=false; $resourceCron=$old; $resource=fopen('php://memory','r+'); $resourceCron[100]['fixture_hook']['ignored_key']['args']=array($resource);
try {FarmTree_Cron_Diagnostics::snapshot($resourceCron);} catch(Throwable $e) {$resourceRejected=true;} fclose($resource);
$cycleRejected=false; $cycle=array(); $cycle['self']=&$cycle; $cycleCron=$old; $cycleCron[100]['fixture_hook']['ignored_key']['args']=$cycle;
try {FarmTree_Cron_Diagnostics::snapshot($cycleCron);} catch(Throwable $e) {$cycleRejected=true;}
echo json_encode(array('records'=>$records,'object_rejected'=>$objectRejected,'resource_rejected'=>$resourceRejected,'cycle_rejected'=>$cycleRejected,'serialization_calls'=>$serializationCalls,'unknown_origin'=>$unknown,'returned_unchanged'=>$returned===$next && $unchanged===$old,'roundtrip'=>$roundtrip,
'preinitialized'=>isset($GLOBALS['wp_filter']['pre_update_option_cron'][PHP_INT_MAX][0]),'invalid_rejected'=>$invalid,'unsafe_rejected'=>$unsafe));
`});
  const output=await result.stdoutText;
  const data=JSON.parse(output);
  assert(data.returned_unchanged && data.preinitialized && data.invalid_rejected && data.unsafe_rejected);
  assert(data.object_rejected && data.resource_rejected && data.cycle_rejected);
  assert.equal(data.serialization_calls,0,'Observer must never execute object serialization hooks');
  assert.equal(data.records.length,2);
  const [proposed,committed]=data.records;
  assert.equal(proposed.type,'cron_update_proposed');
  assert.equal(committed.type,'cron_update_committed');
  assert.equal(proposed.id,committed.id);
  assert.equal(proposed.before.events[0].timestamp,100);
  assert.equal(proposed.after.events[0].timestamp,3700);
  assert.equal(proposed.after.events[0].interval,3600);
  assert.equal(proposed.after.events[0].schedule,'hourly');
  assert.equal(proposed.before.events[0].argument_hash,proposed.after.events[0].argument_hash);
  assert.notEqual(proposed.before.semantic_sha256,proposed.after.semantic_sha256);
  assert.deepEqual(committed.after,data.roundtrip);
  assert.equal(proposed.hook_owners.fixture_hook[0].owner,'FarmTree');
  assert.equal(proposed.hook_owners.fixture_hook[0].file,'wp-content/plugins/farmtree-content/fixture.php');
  assert.equal(proposed.hook_owners.stage_hook[0].owner,'FarmTree');
  assert.equal(proposed.hook_owners.stage_hook[0].file,'wp-content/plugins/farmtree-content/fixture.php');
  assert.deepEqual(data.unknown_origin,{owner:'unknown',file:null});
  assert(!output.includes('/private-recovery')&&!output.includes('/unrelated-secret-path'));
  assert(proposed.stack.length>0);
  assert(!output.includes('secret-fixture-token')&&!output.includes('person@example.invalid'));
  assert(!output.includes('"args"')&&!output.includes('"object"'));
  assert(!/wp_schedule_event|wp_reschedule_event|wp_unschedule_event|update_option\(|\$wpdb|file_put_contents/.test(source));
  const bootstrap=readFileSync(new URL('cron-diagnostics-bootstrap.php',import.meta.url),'utf8');
  assert(bootstrap.includes("PHP_SAPI !== 'cli'"));
  // WASM uses a non-CLI SAPI. Mock only that environment identity; guards and IO execute unchanged.
  const bootstrapFixture=bootstrap.replace("PHP_SAPI !== 'cli'", "'cli' !== 'cli'");
  const entry=await php.runStream({code:`<?php
mkdir('/ft-fixture'); mkdir('/ft-fixture/wp'); mkdir('/ft-fixture/private');
mkdir('/ft-fixture/private/stage/wp-content/plugins/farmtree-content',0777,true);
file_put_contents('/ft-fixture/private/stage/wp-content/plugins/farmtree-content/farmtree-content.php','<?php');
file_put_contents('/ft-fixture/wp/wp-load.php','<?php');
file_put_contents('/ft-fixture/private/cron-diagnostics.php',base64_decode('${Buffer.from(source).toString('base64')}'));
file_put_contents('/ft-fixture/private/bootstrap.php',base64_decode('${Buffer.from(bootstrapFixture).toString('base64')}'));
define('WP_CLI',true);
putenv('FT_CRON_DIAGNOSTICS_ROOT=/ft-fixture/wp');
putenv('FT_CRON_DIAGNOSTICS_FILE=/ft-fixture/private/window.jsonl');
putenv('FT_CRON_DIAGNOSTICS_STAGE=/ft-fixture/private/stage');
require '/ft-fixture/private/bootstrap.php';
echo json_encode(array('mode'=>fileperms('/ft-fixture/private/window.jsonl') & 0777,'registered'=>isset($GLOBALS['wp_filter']['pre_update_option_cron'])));
`});
  const entryText=await entry.stdoutText;
  assert(entryText.startsWith('{'),entryText);
  const entryOutput=JSON.parse(entryText);
  assert.equal(entryOutput.mode,0o600); assert(entryOutput.registered);
  const report=await php.runStream({code:`<?php echo file_get_contents('/ft-fixture/private/window.jsonl');`});
  const events=(await report.stdoutText).trim().split('\n').map(JSON.parse);
  assert.deepEqual(events.map(event=>event.type),['window_start','window_end','process_end']);
  const collision=await php.runStream({code:`<?php define('WP_CLI',true); putenv('FT_CRON_DIAGNOSTICS_ROOT=/ft-fixture/wp'); putenv('FT_CRON_DIAGNOSTICS_FILE=/ft-fixture/private/window.jsonl'); try {require '/ft-fixture/private/bootstrap.php';} catch(Throwable $e) {echo 'REJECTED';}`});
  assert.equal(await collision.stdoutText,'REJECTED');
  const badStage=await php.runStream({code:`<?php define('WP_CLI',true); putenv('FT_CRON_DIAGNOSTICS_ROOT=/ft-fixture/wp'); putenv('FT_CRON_DIAGNOSTICS_FILE=/ft-fixture/private/invalid-stage.jsonl'); putenv('FT_CRON_DIAGNOSTICS_STAGE=/ft-fixture/wp'); try {require '/ft-fixture/private/bootstrap.php';} catch(Throwable $e) {echo file_exists('/ft-fixture/private/invalid-stage.jsonl')?'BAD':'REJECTED_BEFORE_LOG';}`});
  assert.equal(await badStage.stdoutText,'REJECTED_BEFORE_LOG');
  console.log('CRON_DIAGNOSTICS_PASS: isolated real PHP; semantic timestamps/schedules/intervals/argument hashes; pre-bootstrap registration; unchanged filter values; attempt/commit correlation; no raw arguments; invalid evidence rejected. No WordPress bootstrap, cron execution or production access.');
} finally {php.exit();}
