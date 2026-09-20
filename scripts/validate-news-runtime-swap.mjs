import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,existsSync,chmodSync,realpathSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
import {PHP} from '@php-wasm/universal';
import {loadNodeRuntime} from '@php-wasm/node';

const runner=readFileSync(new URL('news-release-runtime-swap.sh',import.meta.url),'utf8');
const prepareRunner=readFileSync(new URL('news-release-prepare.sh',import.meta.url),'utf8');
const sha='a'.repeat(40), hash=value=>createHash('sha256').update(value).digest('hex');
const theme='wp-content/themes/farmtree-native/',plugin='wp-content/plugins/farmtree-content/';
const preflightBundle=()=>{
  const summary={create:29,update:0,unchanged:102,conflict:0,skipped:1};
  return {'command.json':{mode:'dry-run',source_commit:sha,post_launch_news12:true,summary,plan_digest:'b'.repeat(64)},'verified.json':{ok:true,source_commit:sha,phase:'preflight',summary},'database-verification.json':{ok:true,database:'unchanged'},'diagnostics-verification.json':{ok:true,cron_activity:'none'},'command.exit':'0\n'};
};
assert(!/[<>]\s*\(/.test(runner));
assert(!/wp (?:option (?:update|delete)|db (?:import|reset)|theme activate|plugin activate)|reconcile.*--apply/.test(runner));
function archive(entries) {
  const chunks=[];
  for(const {name,content='',type='0',link=''} of entries) {
    const body=Buffer.from(content),h=Buffer.alloc(512);
    h.write(name,0,100); h.write('0000644\0',100,8); h.write('0000000\0',108,8); h.write('0000000\0',116,8);
    h.write(body.length.toString(8).padStart(11,'0')+'\0',124,12); h.write('00000000000\0',136,12); h.fill(32,148,156);
    h.write(type,156,1);h.write(link,157,100);h.write('ustar\0',257,6);h.write('00',263,2);
    h.write([...h].reduce((sum,byte)=>sum+byte,0).toString(8).padStart(6,'0')+'\0 ',148,8);
    chunks.push(h,body,Buffer.alloc((512-body.length%512)%512));
  }
  return gzipSync(Buffer.concat([...chunks,Buffer.alloc(1024)]));
}
function fixture(mode,prepare=false) {
  const dir=realpathSync(mkdtempSync(join(tmpdir(),'ft-news-swap-'))),site=join(dir,'public_html'),recovery=join(dir,'recovery'),bin=join(dir,'bin');
  const release=`news12-${sha}-1`,base=join(recovery,release);
  for(const p of [site,recovery,base,bin])mkdirSync(p,{recursive:true});
  const old={[theme+'style.css']:'old-theme',[theme+'functions.php']:'<?php /* old theme */',[plugin+'farmtree-content.php']:'<?php /* old plugin */'};
  const next={[theme+'style.css']:'new-theme',[theme+'functions.php']:'<?php /* new theme */',[plugin+'farmtree-content.php']:'<?php /* new plugin */'};
  for(const [p,c] of Object.entries({...old,'wp-content/themes/farmtree/style.css':'legacy'})){mkdirSync(join(site,p,'..'),{recursive:true});writeFileSync(join(site,p),c);}
  const checksum=files=>Object.entries(files).map(([p,c])=>`${hash(c)}  ${p}\n`).join('');
  writeFileSync(join(base,'baseline.sha256'),checksum(old));
  if(mode==='drift')writeFileSync(join(site,theme+'style.css'),'manual-drift');
  const entries=Object.entries(next).map(([name,content])=>({name,content}));
  if(mode==='traversal')entries[0].name=theme+'../escape';
  if(mode==='double-slash')entries[0].name=theme+'/style.css';
  if(mode==='symlink')Object.assign(entries[0],{type:'2',content:'',link:'/etc/passwd'});
  if(mode==='duplicate')entries.push(entries[0]);
  writeFileSync(join(base,'runtime.tar.gz'),archive(entries));
  writeFileSync(join(base,'target.sha256'),entries.map(e=>`${hash(e.content)}  ${e.name}\n`).join(''));
  const gates=preflightBundle();
  if(mode==='bad-receipt')gates['command.json'].source_commit='c'.repeat(40);
  mkdirSync(join(base,'op-preflight'));
  const gateFiles={};
  for(const [p,c]of Object.entries(gates)){gateFiles['op-preflight/'+p]=typeof c==='string'?c:JSON.stringify(c);writeFileSync(join(base,'op-preflight',p),gateFiles['op-preflight/'+p]);}
  writeFileSync(join(base,'preflight-gates.sha256'),checksum(gateFiles));
  const helpers={'cron-diagnostics-snapshot.php':'snapshot','cron-diagnostics.php':'library','news-release-evidence.php':'evidence','state-gates.php':'gates'};
  for(const [p,c] of Object.entries(helpers))writeFileSync(join(base,p),c);
  writeFileSync(join(base,'swap-helpers.sha256'),checksum(helpers));
  writeFileSync(join(base,'helpers.sha256'),checksum(helpers));
  if(!prepare){
    writeFileSync(join(base,'backup.sha256'),'PRESERVE PRE-APPLY BACKUP');
    for(const file of ['runtime-before.tar.gz','legacy.sha256','php-lint.txt'])writeFileSync(join(base,file),'PRESERVE PREPARE '+file);
    mkdirSync(join(base,'stage'));writeFileSync(join(base,'stage','preserved'),'preflight-stage');
  }
  if(mode==='helper-symlink'){const p=join(base,'state-gates.php');writeFileSync(join(dir,'evil.php'),'gates');spawnSync('rm',[p]);symlinkSync(join(dir,'evil.php'),p);}
  const mock=(name,code)=>{const p=join(bin,name);writeFileSync(p,`#!${process.execPath}\n${code}`);chmodSync(p,0o755);};
  mock('stat',"console.log('1')");
  mock('flock',`process.exit(${mode==='lock'?1:0})`);
  mock('php',`const fs=require('node:fs'),a=process.argv;
    if(a[2]==='-l'){console.log('PHP_LINT_MOCK '+a[3]);process.exit(${mode==='lint-fail'?1:0});}
    if(a[2]==='-r'){const r=JSON.parse(fs.readFileSync(a[4]+'/op-preflight/command.json'));process.exit(r.mode==='dry-run'&&r.source_commit===a[5]?0:1);}
    if(a[2].endsWith('news-release-evidence.php')) {
      if(a[3]==='compare') {process.exit(fs.readFileSync(a[4],'utf8')===fs.readFileSync(a[5],'utf8')?0:1);}
      const p=${JSON.stringify(join(base,'database-count'))};const after=fs.existsSync(p);fs.writeFileSync(p,'1');
      if(${mode==='database-read-fail'})process.exit(1);
      console.log(JSON.stringify({allDatabaseTables:after&&${mode==='database-delta'}?'changed-user-row':'unchanged',uploads:after&&${mode==='upload-delta'}?'changed-upload':'unchanged'}));
    }
    else if(a[2].endsWith('cron-diagnostics-snapshot.php')) {const p=${JSON.stringify(join(base,'cron-count'))};const after=fs.existsSync(p);fs.writeFileSync(p,'1');if(${mode==='cron-read-fail'})process.exit(1);console.log(JSON.stringify({events:after&&${mode==='cron-delta'}?['new-hook']:[]}));}
    else {if(${mode==='state-gate-fail'})process.exit(1);console.log('PUBLIC_GATE_MOCK');}`);
  mock('wp',`const fs=require('node:fs'),s=process.argv.slice(2).join(' ');if(s==='db prefix')console.log('ft_');else if(s.startsWith('db export '))fs.writeFileSync(process.argv[4],'CREATE TABLE fixture; INSERT INTO fixture;');else if(s.includes('post_name IN'))console.log('0');else if(s.includes('SELECT COUNT(*)'))console.log('1');else if(s.includes('option_name <>')) {const p=${JSON.stringify(join(base,'state-count'))};const after=fs.existsSync(p);fs.writeFileSync(p,'1');console.log(after&&${mode==='state-delta'}?'changed':'stable');}else console.log('stable');`);
  mock('curl',`const fs=require('node:fs'),a=process.argv;fs.writeFileSync(a[a.indexOf('-D')+1],'HTTP/2 200');fs.writeFileSync(a[a.indexOf('-o')+1],'<main class="ft-native-home">Public</main>');console.log('${mode==='http-fail'?'503':'200'}');`);
  if(mode==='partial-swap')mock('mv',`const a=process.argv.slice(2);if(a[0].includes('/stage-swap/wp-content/plugins/'))process.exit(1);const r=require('node:child_process').spawnSync('/bin/mv',a,{stdio:'inherit'});process.exit(r.status);`);
  const path=join(dir,'runner.sh');writeFileSync(path,(prepare?prepareRunner:runner).replace('root=/home/u80341p492940/domains/farmtree.eu/public_html',`root=${site}`).replace('recovery=/home/u80341p492940/farmtree-recovery-backups',`recovery=${recovery}`));
  const inputs=prepare?['runtime.tar.gz','target.sha256','baseline.sha256','helpers.sha256']:['runtime.tar.gz','target.sha256','baseline.sha256','op-preflight/command.json','swap-helpers.sha256','preflight-gates.sha256'];
  const args=[path,sha,mode==='invalid-release'?'../escape':release,...inputs.map(p=>hash(readFileSync(join(base,p))))];
  if(mode==='bad-hash')args[3]='0'.repeat(64);
  const result=spawnSync('bash',args,{encoding:'utf8',env:{...process.env,PATH:bin+':'+process.env.PATH},timeout:30000});
  assert(!result.error,result.error?.message);
  if(prepare&&mode==='success') {
    assert.equal(result.status,0,result.stdout+result.stderr);
    for(const [p,c]of Object.entries(old))assert.equal(readFileSync(join(site,p),'utf8'),c);
    for(const [p,c]of Object.entries(next))assert.equal(readFileSync(join(base,'stage',p),'utf8'),c);
    assert(readFileSync(join(base,'backup.sha256'),'utf8').includes('database.sql'));
    assert(existsSync(join(base,'backup-check-prepare',theme+'functions.php')));
    return;
  }
  if(mode==='success') {
    assert.equal(result.status,0,result.stdout+result.stderr);
    for(const [p,c]of Object.entries(next))assert.equal(readFileSync(join(site,p),'utf8'),c);
    const lint=readFileSync(join(base,'swap-php-lint.txt'),'utf8');
    assert(lint.includes('stage-swap/'+theme+'functions.php')&&lint.includes('stage-swap/'+plugin+'farmtree-content.php'));
    assert(readFileSync(join(base,'swap-backup.sha256'),'utf8').includes(`${hash(lint)}  swap-php-lint.txt`));
  } else {
    assert.notEqual(result.status,0,mode+': '+result.stdout+result.stderr);
    for(const [p,c]of Object.entries(old))assert.equal(readFileSync(join(site,p),'utf8'),mode==='drift'&&p===theme+'style.css'?'manual-drift':c,mode+': '+p);
    if(['http-fail','cron-delta','state-delta','database-delta','upload-delta','partial-swap'].includes(mode))assert.match(result.stderr,/RUNTIMES_ROLLED_BACK/);
  }
  assert.equal(readFileSync(join(site,'wp-content/themes/farmtree/style.css'),'utf8'),'legacy');
  if(!prepare){
    assert.equal(readFileSync(join(base,'backup.sha256'),'utf8'),'PRESERVE PRE-APPLY BACKUP');
    for(const file of ['runtime-before.tar.gz','legacy.sha256','php-lint.txt'])assert.equal(readFileSync(join(base,file),'utf8'),'PRESERVE PREPARE '+file);
    assert.equal(readFileSync(join(base,'stage/preserved'),'utf8'),'preflight-stage');
  }
  if(['cron-read-fail','database-read-fail','lint-fail','state-gate-fail'].includes(mode))assert(!existsSync(join(base,'pre-theme')));
}
for(const mode of ['success','bad-receipt','bad-hash','invalid-release','drift','traversal','double-slash','symlink','helper-symlink','duplicate','lock','lint-fail','state-gate-fail','cron-read-fail','database-read-fail','http-fail','cron-delta','state-delta','database-delta','upload-delta','partial-swap'])fixture(mode);
for(const mode of ['success','bad-hash','invalid-release','drift','traversal','double-slash','symlink','helper-symlink','duplicate','lock','lint-fail','state-gate-fail'])fixture(mode,true);
// Execute the exact shell-embedded receipt gate, not a second implementation.
const receiptGate=runner.match(/^php -r '([^'\n]+)'/m)?.[1];
assert(receiptGate,'Exact inline PHP receipt gate must be discoverable');
const receiptCases=[
  ['valid',()=>{},true],
  ['source SHA',g=>{g['command.json'].source_commit='c'.repeat(40);}],
  ['APPLY not preflight',g=>{g['command.json'].mode='apply';}],
  ['wrong profile',g=>{g['command.json'].post_launch_news12=false;}],
  ['invalid digest',g=>{g['command.json'].plan_digest='invalid';}],
  ...Object.keys(preflightBundle()['command.json'].summary).map(key=>['summary '+key,g=>{g['command.json'].summary[key]++;}]),
  ['typed count',g=>{g['command.json'].summary.create='29';}],
  ['not verified',g=>{g['verified.json'].ok=false;}],
  ['verified wrong SHA',g=>{g['verified.json'].source_commit='c'.repeat(40);}],
  ['verified wrong phase',g=>{g['verified.json'].phase='dry-run';}],
  ['verified wrong summary',g=>{g['verified.json'].summary={};}],
  ['database failed',g=>{g['database-verification.json'].ok=false;}],
  ['database changed',g=>{g['database-verification.json'].database='changed';}],
  ['diagnostics failed',g=>{g['diagnostics-verification.json'].ok=false;}],
  ['cron activity',g=>{g['diagnostics-verification.json'].cron_activity='changed';}],
  ['nonzero exit',g=>{g['command.exit']='1\n';}],
];
const php=new PHP(await loadNodeRuntime('8.3',{emscriptenOptions:{processId:process.pid}}));
try {
  php.mkdir('/op-preflight');
  for(const [name,mutate,pass=false]of receiptCases){
    const gates=structuredClone(preflightBundle());mutate(gates);
    for(const [p,c]of Object.entries(gates))php.writeFile('/op-preflight/'+p,typeof c==='string'?c:JSON.stringify(c));
    const result=await php.runStream({code:`<?php $argv=array('gate','','${sha}'); ${receiptGate} echo 'GATE_ACCEPTED';`});
    const output=await result.stdoutText;
    assert.equal(output,pass?'GATE_ACCEPTED':'',name+': '+output);
  }
} finally {php.exit();}
console.log('NEWS_RUNTIME_SWAP_PASS: 33 prepare/swap filesystem cases plus '+receiptCases.length+' exact preflight-gate real PHP fixtures; runtime-first swap, archive/checksum/two-directory rollback and full-database/upload delta rejection verified. WP/HTTP/flock/stat mocked; no production access.');
