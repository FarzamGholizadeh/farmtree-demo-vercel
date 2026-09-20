import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, realpath, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const hash = value => createHash('sha256').update(value).digest('hex');
const sha = 'a'.repeat(40);
const root = await realpath(await mkdtemp(join(tmpdir(), 'farmtree-news-operation-mock-')));
const bin = join(root, 'bin'); await mkdir(bin);
const source = await readFile(new URL('./news-release-operation.sh', import.meta.url), 'utf8');
const mock = `#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path');const a=process.argv.slice(2),name=path.basename(process.argv[1]);
if(name==='flock')process.exit(process.env.MOCK_LOCK_BUSY==='1'?1:0);
if(name==='wp'){
 if(a[0]==='db'&&a[1]==='prefix'){console.log('wp_');process.exit(0)}
 if(a[0]==='db'&&a[1]==='query'){const q=a.at(-1);console.log(q.includes('COUNT(*)')?(q.includes("post_name IN ('nl','de')")?'0':'1'):'fixture');process.exit(0)}
 const i=a.indexOf('eval-file'),sha=a[i+3],mode=a[i+4];if(!process.env.FT_CRON_DIAGNOSTICS_STAGE||!a.some(x=>x.startsWith('--require='))||!a.includes('--skip-plugins=farmtree-content'))process.exit(9);
 const file=process.env.FT_CRON_DIAGNOSTICS_FILE;fs.writeFileSync(file,'{"type":"window_start","pre_bootstrap":true}\\n{"type":"window_end"}\\n{"type":"process_end"}\\n');fs.writeFileSync(path.join(path.dirname(file),'executed'),'1');
 if(mode==='apply'&&(!/^[a-f0-9]{64}$/.test(a[i+5]||'')||!/^[a-f0-9]{64}$/.test(a[i+6]||'')))process.exit(9);
 console.log(JSON.stringify({source_commit:sha,post_launch_news12:true,plan_digest:'d'.repeat(64),summary:{create:29,update:0,unchanged:0,conflict:0,skipped:0}}));process.exit(process.env.MOCK_CLI_FAIL==='1'?2:0)
}
if(name==='php'){
 if(a[0]==='-r'){const p=JSON.parse(fs.readFileSync(a[2]));process.exit(p.plan_digest===a[3]?0:1)}
 if(a[0].endsWith('state-gates.php')){process.stdin.resume();process.stdin.on('end',()=>console.log('PUBLIC_STATE_GATES_PASS'));return}
 if(a[0].endsWith('cron-diagnostics-snapshot.php')){const changed=process.env.MOCK_CRON_CHANGE==='1'&&fs.existsSync(process.env.MOCK_EXECUTED);process.stdin.resume();process.stdin.on('end',()=>console.log(JSON.stringify({cron:changed?'changed':'fixed'})));return}
 if(a[0].endsWith('news-release-evidence.php')){
  if(a[1]==='capture')console.log(JSON.stringify({fixture:'database'}));else console.log(JSON.stringify({ok:true}));process.exit(0)
 }
 process.exit(8)
}
process.exit(9);
`;
for (const name of ['wp', 'php', 'flock']) await writeFile(join(bin, name), mock, { mode: 0o755 });
async function fixture(label, extra = {}) {
  const home = join(root, label); const web = join(home, 'public_html'); const recovery = join(home, 'backups'); const release = `news12-${sha}-1`; const base = join(recovery, release);
  await mkdir(join(web, 'wp-content/themes/farmtree-native'), { recursive: true }); await mkdir(join(web, 'wp-content/plugins/farmtree-content'), { recursive: true }); await mkdir(join(base, 'stage/wp-content/themes/farmtree-native'), { recursive: true });
  await writeFile(join(web, 'wp-content/themes/farmtree-native/style.css'), 'old'); await writeFile(join(base, 'stage/wp-content/themes/farmtree-native/style.css'), 'new');
  const helpers = ['news-release-command.php','news-release-evidence.php','cron-diagnostics-bootstrap.php','cron-diagnostics-snapshot.php','cron-diagnostics.php','state-gates.php'];
  for (const helper of helpers) await writeFile(join(base, helper), 'fixture');
  const helpersText = helpers.map(name => `${hash('fixture')}  ${name}\n`).join('');
  const target = `${hash('new')}  wp-content/themes/farmtree-native/style.css\n`; const backup = `${hash('backup')}  database.sql\n`;
  await writeFile(join(base, 'helpers.sha256'), helpersText); await writeFile(join(base, 'target.sha256'), target); await writeFile(join(base, 'backup.sha256'), backup); await writeFile(join(base, 'database.sql'), 'backup');
  const script = join(home, 'operation.sh'); await writeFile(script, source.replace('root=/home/u80341p492940/domains/farmtree.eu/public_html', `root=${web}`).replace('recovery=/home/u80341p492940/farmtree-recovery-backups', `recovery=${recovery}`));
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, MOCK_EXECUTED: join(base, 'op-dry-run/executed'), ...extra };
  const run = (mode = 'dry-run', digest) => spawnSync('bash', [script, sha, release, mode, hash(helpersText), hash(target), hash(backup), ...(digest ? [digest] : [])], { env, encoding: 'utf8' });
  return { run, base };
}
const success = await fixture('success');
const preflight = success.run('preflight'); assert.equal(preflight.status, 0, preflight.stderr + preflight.stdout);
const gates = (await readFile(join(success.base, 'preflight-gates.sha256'), 'utf8')).trim().split('\n');
assert.deepEqual(gates.map(line => line.slice(66)), ['command.json','verified.json','database-verification.json','diagnostics-verification.json','command.exit'].map(name => `op-preflight/${name}`));
for (const line of gates) assert.equal(line.slice(0, 64), hash(await readFile(join(success.base, line.slice(66)))));
assert.notEqual(success.run('preflight').status, 0, 'preflight retry must fail');
const first = success.run(); assert.equal(first.status, 0, first.stderr + first.stdout); await access(join(success.base, 'op-dry-run/verified.json')); assert.notEqual(success.run().status, 0, 'exclusive retry must fail');
const apply = success.run('apply', 'd'.repeat(64)); assert.equal(apply.status, 0, apply.stderr + apply.stdout); await access(join(success.base, 'op-apply/verified.json'));
const final = success.run('final-dry-run'); assert.equal(final.status, 0, final.stderr + final.stdout); await access(join(success.base, 'op-final-dry-run/verified.json'));
const failed = await fixture('cli-failure', { MOCK_CLI_FAIL: '1' }); assert.notEqual(failed.run().status, 0); await access(join(failed.base, 'op-dry-run/database-after.json')); await assert.rejects(access(join(failed.base, 'op-dry-run/verified.json')));
const cron = await fixture('cron-change', { MOCK_CRON_CHANGE: '1' }); assert.notEqual(cron.run().status, 0); await access(join(cron.base, 'op-dry-run/cron-after.json')); await assert.rejects(access(join(cron.base, 'op-dry-run/verified.json')));
const tampered = await fixture('tampered'); await writeFile(join(tampered.base, 'stage/wp-content/themes/farmtree-native/style.css'), 'tampered'); assert.notEqual(tampered.run().status, 0); await assert.rejects(access(join(tampered.base, 'op-dry-run')));
const locked = await fixture('locked', { MOCK_LOCK_BUSY: '1' }); assert.notEqual(locked.run().status, 0); await assert.rejects(access(join(locked.base, 'op-dry-run')));
console.log('NEWS_OPERATION_MOCK_PASS: dry-run/apply/final shell paths, exclusive retry, CLI-failure after-evidence, cron hard stop, staged tampering, lock refusal. PHP/DB/wp/flock mocked; real SQL validation remains pending.');
