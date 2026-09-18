import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const temporary = await mkdtemp(resolve(tmpdir(), 'farmtree-post-launch-'));
try {
  const baseline = execFileSync('git', ['show', '34771e782f3b3d2118567ecd42f4bbf54aa93121:wordpress/wp-content/plugins/farmtree-content/includes/managed-content-manifest.php'], { cwd: root });
  await writeFile(resolve(temporary, 'baseline.php'), baseline);
  const harness = await readFile(resolve(root, 'scripts/fixtures/post-launch-images.php'), 'utf8');
  await writeFile(resolve(temporary, 'blueprint.json'), JSON.stringify({
    preferredVersions: { php: '8.3', wp: '7.1' }, steps: [{ step: 'runPHP', code: harness }]
  }));
  const run = spawnSync(resolve(root, 'node_modules/.bin/wp-playground-cli'), [
    'run-blueprint', '--blueprint', resolve(temporary, 'blueprint.json'), '--php', '8.3', '--wp', '7.1',
    '--mount-dir', resolve(root, 'wordpress/wp-content/plugins/farmtree-content'), '/wordpress/wp-content/plugins/farmtree-content',
    '--mount-dir', resolve(root, 'wordpress/wp-content/themes/farmtree-native'), '/wordpress/wp-content/themes/farmtree-native',
    '--mount-dir', temporary, '/farmtree-test', '--verbosity', 'quiet'
  ], { cwd: root, encoding: 'utf8', maxBuffer: 8e6, timeout: 240000 });
  let evidence;
  try { evidence = JSON.parse(await readFile(resolve(temporary, 'result.json'), 'utf8')); } catch {
    throw new Error(`Post-launch fixture failed: ${run.stderr}\n${run.stdout}`);
  }
  console.log(JSON.stringify(evidence, null, 2));
  if (run.status !== 0 || !evidence.ok) throw new Error('Post-launch regression failed');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
