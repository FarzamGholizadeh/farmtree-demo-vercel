import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,existsSync,chmodSync,realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
import YAML from 'yaml';
import {parseManifest,assertSourceState,themePrefix} from './release-native-theme.mjs';
const root=resolve(import.meta.dirname,'..');
const sha='a'.repeat(40), digest='b'.repeat(64);
const hash=b=>createHash('sha256').update(b).digest('hex');
assertSourceState({sha,head:sha,branch:'feat/wordpress-native-rebuild',status:''});
for(const state of [{status:' M file'}, {head:'c'.repeat(40)}, {branch:'main'}, {sha:'HEAD'}]) assert.throws(()=>assertSourceState({sha,head:sha,branch:'feat/wordpress-native-rebuild',status:'',...state}));
for(const path of ['../evil','wp-content/themes/farmtree/style.css',themePrefix+'../evil',themePrefix+'./evil',themePrefix+'a//b']) assert.throws(()=>parseManifest(`${digest}  ${path}`));
assert.throws(()=>parseManifest(`${digest}  ${themePrefix}style.css\n${digest}  ${themePrefix}style.css`));
const legacy=YAML.parse(readFileSync(join(root,'.github/workflows/deploy-wordpress.yml'),'utf8'));
const native=YAML.parse(readFileSync(join(root,'.github/workflows/deploy-wordpress-native.yml'),'utf8'));
assert.equal(legacy.concurrency.group,native.concurrency.group);
assert.equal(Object.keys(legacy.jobs).join(), 'blocked');
assert.match(legacy.jobs.blocked.steps[0].run,/exit 1/);
assert.match(native.jobs.deploy.steps[0].run,/exit 1/);
assert.equal(native.jobs.deploy.steps[0].name,'Refuse superseded private runtime deployment');
for (const name of ['deploy-wordpress-native.yml','test-vimexx-ssh.yml']) {
  const source=readFileSync(join(root,'.github/workflows',name),'utf8');
  assert.ok(!source.includes('ssh-keyscan'));
  assert.ok(source.includes('VIMEXX_KNOWN_HOSTS'));
}
const runner=readFileSync(join(root,'scripts/release-native-theme-remote.sh'),'utf8');
assert.ok(!/wp (?:option (?:update|delete)|db (?:import|reset)|theme activate|plugin activate)/.test(runner));
assert.ok(runner.indexOf('cmp "$base/current.sha256"')<runner.indexOf('mv wp-content/themes/farmtree-native'));

// Disposable filesystem integration: real tar/checksum/find/mv/rollback behavior;
// PHP/WP/HTTP/flock/stat are deterministic mocks, never a production connection.
function archive(entries) {
  const chunks=[];
  for(const {name,content='',type='0',link=''} of entries) {
    const body=Buffer.from(content); const h=Buffer.alloc(512);
    h.write(name,0,100);h.write('0000644\0',100,8);h.write('0000000\0',108,8);h.write('0000000\0',116,8);
    h.write(body.length.toString(8).padStart(11,'0')+'\0',124,12);h.write('00000000000\0',136,12);h.fill(32,148,156);h.write(type,156,1);h.write(link,157,100);h.write('ustar\0',257,6);h.write('00',263,2);
    h.write([...h].reduce((a,b)=>a+b,0).toString(8).padStart(6,'0')+'\0 ',148,8);
    chunks.push(h,body,Buffer.alloc((512-body.length%512)%512));
  }
  return gzipSync(Buffer.concat([...chunks,Buffer.alloc(1024)]));
}
function fixture(mode) {
  const dir=realpathSync(mkdtempSync(join(tmpdir(),'ft-release-test-'))),site=join(dir,'public_html'),recovery=join(dir,'recovery'),bin=join(dir,'bin');
  const release=`live360-${sha}-1`,base=join(recovery,release);
  for(const d of [site,recovery,base,bin])mkdirSync(d,{recursive:true});
  const files={ [themePrefix+'style.css']:'old', 'wp-content/plugins/farmtree-content/plugin.php':'plugin','wp-content/themes/farmtree/style.css':'legacy'};
  for(const [path,content] of Object.entries(files)){mkdirSync(join(site,path,'..'),{recursive:true});writeFileSync(join(site,path),content);}
  const baseline=Object.entries(files).filter(([p])=>!p.startsWith('wp-content/themes/farmtree/')).map(([p,c])=>`${hash(c)}  ${p}\n`).join('');
  writeFileSync(join(base,'baseline.sha256'), mode==='drift'?baseline.replace(hash('old'),hash('wrong')):baseline);
  const path=mode==='traversal'?themePrefix+'../escape':themePrefix+'style.css';
  writeFileSync(join(base,'target.sha256'),`${hash('new')}  ${path}\n`);
  writeFileSync(join(base,'theme.tar.gz'),archive([{name:path,content:mode==='symlink'?'':'new',type:mode==='symlink'?'2':'0',link:mode==='symlink'?'/etc/passwd':''}]));
  writeFileSync(join(base,'state-gates.php'),'mock');
  const mock=(name,code)=>{const p=join(bin,name);writeFileSync(p,`#!${process.execPath}\n${code}`);chmodSync(p,0o755);};
  mock('stat',"console.log('1')");
  mock('php',"console.log('PHP_MOCK')");
  mock('flock',`process.exit(${mode==='lock'?1:0})`);
  mock('wp',`const s=process.argv.slice(2).join(' ');if(s==='db prefix')console.log('ft_');else if(s.includes('post_name IN'))console.log('0');else if(s.includes('SELECT COUNT(*)'))console.log('1');else console.log('stable-state');`);
  mock('curl',`const fs=require('node:fs'),a=process.argv;fs.writeFileSync(a[a.indexOf('-D')+1],'HTTP/2 200');fs.writeFileSync(a[a.indexOf('-o')+1],'<html>Public</html>');console.log('${mode==='smoke-fail'?'503':'200'}');`);
  const script=join(dir,'runner.sh');
  writeFileSync(script,runner.replace('root=/home/u80341p492940/domains/farmtree.eu/public_html',`root=${site}`).replace('recovery=/home/u80341p492940/farmtree-recovery-backups',`recovery=${recovery}`));
  const args=[script,sha,release,...['theme.tar.gz','target.sha256','baseline.sha256'].map(f=>hash(readFileSync(join(base,f))))];
  const result=spawnSync('bash',args,{encoding:'utf8',env:{...process.env,PATH:bin+':'+process.env.PATH},timeout:30000});
  if(mode==='success') {assert.equal(result.status,0,result.stdout+result.stderr);assert.equal(readFileSync(join(site,themePrefix+'style.css'),'utf8'),'new');assert.ok(existsSync(join(base,'backup.sha256')));}
  else {assert.notEqual(result.status,0);assert.equal(readFileSync(join(site,themePrefix+'style.css'),'utf8'),'old');if(mode==='smoke-fail')assert.match(result.stderr,/THEME_ROLLED_BACK/);}
  assert.equal(readFileSync(join(site,'wp-content/themes/farmtree/style.css'),'utf8'),'legacy');
  assert.equal(readFileSync(join(site,'wp-content/plugins/farmtree-content/plugin.php'),'utf8'),'plugin');
}
for(const mode of ['success','drift','traversal','symlink','lock','smoke-fail'])fixture(mode);
console.log('THEME_RELEASE_TESTS_PASS: source mismatch/dirty; path traversal; symlink; baseline drift; simulated lock contention; real filesystem swap/rollback; legacy/plugin preserved. PHP/WP/HTTP/flock are mocked, production verification remains required.');
