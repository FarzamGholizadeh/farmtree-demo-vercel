#!/usr/bin/env node
/** Theme-only post-launch release. Defaults to prepare; --execute is explicit. */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdtempSync, lstatSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const themePrefix = 'wp-content/themes/farmtree-native/';
const pluginPrefix = 'wp-content/plugins/farmtree-content/';
const root = resolve(import.meta.dirname, '..');
const hash = data => createHash('sha256').update(data).digest('hex');
export function parseManifest(text) {
  const entries = new Map();
  for (const line of text.trim().split('\n')) {
    const match = /^([a-f0-9]{64})  (?:wordpress\/)?([A-Za-z0-9_./-]+)$/.exec(line);
    if (!match) throw new Error('Invalid checksum record');
    const [, digest, path] = match;
    if ((!path.startsWith(themePrefix) && !path.startsWith(pluginPrefix)) || path.split('/').some(p => !p || p === '.' || p === '..') || entries.has(path)) throw new Error('Unsafe/duplicate/out-of-scope checksum path');
    entries.set(path, digest);
  }
  if (![...entries.keys()].some(p => p.startsWith(themePrefix))) throw new Error('Missing theme checksum set');
  return entries;
}
export function assertSourceState({sha, head, branch, status}) {
  if (!/^[a-f0-9]{40}$/.test(sha) || sha !== head || branch !== 'feat/wordpress-native-rebuild' || status.trim()) throw new Error('Release requires exact approved HEAD, feature branch and clean worktree');
}
function run(command, args, options = {}) {
  const result = spawnSync(command, args, {cwd:root, encoding:'utf8', maxBuffer:16e6, ...options});
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout || result.error}`);
  return result.stdout.trim();
}
function git(...args) { return run('git', args); }
function main() {
  const args = process.argv.slice(2); const options = {};
  for (let i=0;i<args.length;i++) {
    if (args[i] === '--execute') options.execute = true;
    else if (['--sha','--baseline','--known-hosts','--identity'].includes(args[i]) && args[i+1]) options[args[i].slice(2)] = args[++i];
    else throw new Error('Usage: --sha FULL_SHA --baseline REVIEWED_SHA256SUMS [--execute --known-hosts VERIFIED_FILE --identity SSH_KEY]');
  }
  assertSourceState({sha:options.sha, head:git('rev-parse','HEAD'), branch:git('branch','--show-current'), status:git('status','--porcelain=v1','--untracked-files=all')});
  if (!options.baseline) throw new Error('A separately reviewed deployed checksum baseline is mandatory');
  run(process.execPath, ['scripts/build-native-release.mjs','--audit']);
  const summary = JSON.parse(readFileSync(join(root,'.release/release-summary.json'),'utf8'));
  if (summary.sourceCommit !== options.sha) throw new Error('Artifact does not match approved SHA');
  const target = parseManifest(readFileSync(join(root,'.release/SHA256SUMS'),'utf8'));
  const baseline = parseManifest(readFileSync(resolve(options.baseline),'utf8'));
  const plugin = entries => JSON.stringify([...entries].filter(([p])=>p.startsWith(pluginPrefix)).sort());
  if (plugin(target) === '[]' || plugin(target) !== plugin(baseline)) throw new Error('Theme-only release cannot change Content plugin');
  const format = entries => [...entries].sort(([a],[b])=>a.localeCompare(b,'en')).map(([p,h])=>`${h}  ${p}\n`).join('');
  const theme = new Map([...target].filter(([p])=>p.startsWith(themePrefix)));
  for (const [path,digest] of target) {
    const full=join(root,'.release/wordpress',path);
    if (!lstatSync(full).isFile() || lstatSync(full).isSymbolicLink() || hash(readFileSync(full)) !== digest) throw new Error('Artifact file mismatch');
  }
  const out = mkdtempSync(join(tmpdir(),'farmtree-theme-release-'));
  writeFileSync(join(out,'target.sha256'),format(theme));
  writeFileSync(join(out,'baseline.sha256'),format(baseline));
  writeFileSync(join(out,'paths.txt'),[...theme.keys()].sort().join('\n')+'\n');
  run('tar',['-czf',join(out,'theme.tar.gz'),'-C',join(root,'.release/wordpress'),'-T',join(out,'paths.txt')]);
  for (const [source,dest] of [['release-native-theme-remote.sh','runner.sh'],['release-native-state-gates.php','state-gates.php']]) writeFileSync(join(out,dest),readFileSync(join(root,'scripts',source)));
  const names=['theme.tar.gz','target.sha256','baseline.sha256','runner.sh','state-gates.php'];
  const digests=Object.fromEntries(names.map(name=>[name,hash(readFileSync(join(out,name)))]));
  writeFileSync(join(out,'package.json'),JSON.stringify({sha:options.sha,digests},null,2));
  console.log(`PREPARED ${out}`);
  if (!options.execute) {console.log('NO_PRODUCTION_ACCESS_OR_MUTATION'); return;}
  if (!options['known-hosts'] || !options.identity) throw new Error('Execution requires independently verified known_hosts and SSH identity files');
  const remote = git('ls-remote','origin','refs/heads/feat/wordpress-native-rebuild').split(/\s/)[0];
  if (remote !== options.sha) throw new Error('Origin feature branch is not exact approved SHA');
  const known=resolve(options['known-hosts']); const identity=resolve(options.identity);
  for (const file of [known,identity]) if (!lstatSync(file).isFile()) throw new Error('SSH input must be a regular file');
  run('ssh-keygen',['-F','[web0173.zxcs.nl]:7685','-f',known]);
  const host='u80341p492940@web0173.zxcs.nl';
  const ssh=['-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o',`UserKnownHostsFile=${known}`,'-i',identity];
  const release=`live360-${options.sha}-${Date.now()}`;
  const base=`/home/u80341p492940/farmtree-recovery-backups/${release}`;
  run('ssh',[...ssh,'-p','7685',host,`umask 077; test -d /home/u80341p492940/farmtree-recovery-backups && mkdir '${base}'`]);
  run('scp',[...ssh,'-P','7685',...names.map(n=>join(out,n)),`${host}:${base}/`]);
  const verify=names.map(n=>`${digests[n]}  ${n}`).join('\n');
  const command=`cd '${base}' && printf '%s\\n' '${verify}' | sha256sum -c --quiet - && bash ./runner.sh '${options.sha}' '${release}' '${digests['theme.tar.gz']}' '${digests['target.sha256']}' '${digests['baseline.sha256']}'`;
  console.log(run('ssh',[...ssh,'-p','7685',host,command],{timeout:300000}));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {main();} catch (error) {console.error(error.message); process.exitCode=1;}
}
