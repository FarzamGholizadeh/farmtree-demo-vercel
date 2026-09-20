import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const temporary = await mkdtemp(resolve(tmpdir(), 'farmtree-news12-test-'));
const code = await readFile(new URL('./news-release-runtime-test.php', import.meta.url), 'utf8');
await writeFile(resolve(temporary, 'blueprint.json'), JSON.stringify({ preferredVersions: { php: '8.3', wp: '7.1' }, steps: [{ step: 'runPHP', code }] }));
const run = spawnSync(resolve(root, 'node_modules/.bin/wp-playground-cli'), ['run-blueprint', '--blueprint', resolve(temporary, 'blueprint.json'), '--php', '8.3', '--wp', '7.1', '--mount-dir', resolve(root, 'wordpress/wp-content/plugins/farmtree-content'), '/wordpress/wp-content/plugins/farmtree-content', '--mount-dir', resolve(root, 'wordpress/wp-content/themes/farmtree-native'), '/wordpress/wp-content/themes/farmtree-native', '--mount-dir', temporary, '/farmtree-test', '--verbosity', 'quiet'], { cwd: root, encoding: 'utf8', maxBuffer: 8e6, timeout: 240000 });
let result;
try { result = JSON.parse(await readFile(resolve(temporary, 'result.json'), 'utf8')); } catch { throw new Error(`Fixture failed: ${run.stderr}\n${run.stdout}`); }
console.log(JSON.stringify({ ...result, evidenceDirectory: temporary }, null, 2));
if (run.status !== 0 || !result.ok) throw new Error('News12 runtime test failed');
