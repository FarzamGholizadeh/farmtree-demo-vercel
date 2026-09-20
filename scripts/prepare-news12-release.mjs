/** Exact-commit package preparation; production staging requires --execute. */
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdtempSync,lstatSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {parseManifest,assertSourceState} from './release-native-theme.mjs';
const root=resolve(import.meta.dirname,'..');
const hash=x=>createHash('sha256').update(x).digest('hex');
const run=(cmd,args,options={})=>{const r=spawnSync(cmd,args,{cwd:root,encoding:'utf8',maxBuffer:20e6,...options});if(r.status!==0)throw Error(`${cmd} failed: ${r.stderr||r.stdout}`);return r.stdout.trim();};
const args=process.argv.slice(2), opts={};
for(let i=0;i<args.length;i++) {
  if(args[i]==='--execute') opts.execute=true;
  else if(['--sha','--baseline','--identity','--known-hosts'].includes(args[i])&&args[i+1])opts[args[i].slice(2)]=args[++i];
  else throw Error('Invalid release preparation argument');
}
assertSourceState({sha:opts.sha,head:run('git',['rev-parse','HEAD']),branch:run('git',['branch','--show-current']),status:run('git',['status','--porcelain=v1','--untracked-files=all'])});
run(process.execPath,['scripts/build-native-release.mjs','--audit']);
if(JSON.parse(readFileSync(join(root,'.release/release-summary.json'))).sourceCommit!==opts.sha)throw Error('Artifact source mismatch');
const baseline=parseManifest(readFileSync(resolve(opts.baseline),'utf8'));
const target=parseManifest(readFileSync(join(root,'.release/SHA256SUMS'),'utf8'));
for(const [path,digest]of target) {
  const file=join(root,'.release/wordpress',path),stat=lstatSync(file);
  if(!stat.isFile()||stat.isSymbolicLink()||hash(readFileSync(file))!==digest)throw Error('Artifact file checksum/type mismatch');
}
const format=m=>[...m].sort(([a],[b])=>a.localeCompare(b,'en')).map(([p,h])=>`${h}  ${p}\n`).join('');
const out=mkdtempSync(join(tmpdir(),'farmtree-news12-package-'));
writeFileSync(join(out,'target.sha256'),format(target));writeFileSync(join(out,'baseline.sha256'),format(baseline));
writeFileSync(join(out,'paths.txt'),[...target.keys()].sort().join('\n')+'\n');
run('tar',['-czf',join(out,'runtime.tar.gz'),'-C',join(root,'.release/wordpress'),'-T',join(out,'paths.txt')]);
const helpers={
  'prepare.sh':'news-release-prepare.sh','swap.sh':'news-release-runtime-swap.sh',
  'operation.sh':'news-release-operation.sh','news-release-command.php':'news-release-command.php',
  'news-release-evidence.php':'news-release-evidence.php',
  'state-gates.php':'release-native-state-gates.php','cron-diagnostics.php':'lib/cron-diagnostics.php',
  'cron-diagnostics-bootstrap.php':'cron-diagnostics-bootstrap.php','cron-diagnostics-snapshot.php':'cron-diagnostics-snapshot.php',
};
for(const [dest,source]of Object.entries(helpers))writeFileSync(join(out,dest),readFileSync(join(root,'scripts',source)));
writeFileSync(join(out,'helpers.sha256'),Object.keys(helpers).sort().map(n=>`${hash(readFileSync(join(out,n)))}  ${n}\n`).join(''));
writeFileSync(join(out,'swap-helpers.sha256'),['cron-diagnostics-snapshot.php','cron-diagnostics.php','news-release-evidence.php','state-gates.php'].sort().map(n=>`${hash(readFileSync(join(out,n)))}  ${n}\n`).join(''));
const names=['runtime.tar.gz','target.sha256','baseline.sha256','helpers.sha256','swap-helpers.sha256',...Object.keys(helpers)];
const digests=Object.fromEntries(names.map(n=>[n,hash(readFileSync(join(out,n)))]));
const release=`news12-${opts.sha}-${Date.now()}`;
writeFileSync(join(out,'package.json'),JSON.stringify({sha:opts.sha,release,digests},null,2));
console.log(JSON.stringify({package:out,release,sha:opts.sha,execute:!!opts.execute}));
if(opts.execute) {
  if(!opts.identity||!opts['known-hosts'])throw Error('Verified SSH identity and known_hosts required');
  if(run('git',['ls-remote','origin','refs/heads/feat/wordpress-native-rebuild']).split(/\s/)[0]!==opts.sha)throw Error('Remote feature branch differs');
  const identity=resolve(opts.identity), known=resolve(opts['known-hosts']);
  run('ssh-keygen',['-F','[web0173.zxcs.nl]:7685','-f',known]);
  const ssh=['-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o',`UserKnownHostsFile=${known}`,'-i',identity];
  const host='u80341p492940@web0173.zxcs.nl',base=`/home/u80341p492940/farmtree-recovery-backups/${release}`;
  run('ssh',[...ssh,'-p','7685',host,`umask 077; test -d /home/u80341p492940/farmtree-recovery-backups && mkdir '${base}'`]);
  run('scp',[...ssh,'-P','7685',...names.map(n=>join(out,n)),`${host}:${base}/`]);
  const verify=names.map(n=>`${digests[n]}  ${n}`).join('\n');
  console.log(run('ssh',[...ssh,'-p','7685',host,`cd '${base}' && printf '%s\\n' '${verify}' | sha256sum -c --quiet - && bash prepare.sh '${opts.sha}' '${release}' '${digests['runtime.tar.gz']}' '${digests['target.sha256']}' '${digests['baseline.sha256']}' '${digests['helpers.sha256']}'`],{timeout:300000}));
}
