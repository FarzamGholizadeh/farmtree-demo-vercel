// Disposable WordPress fixture; no local or production database mutation.
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = process.cwd();
const temporary = await mkdtemp(resolve(tmpdir(), 'farmtree-animation-'));
const code = `<?php
require '/wordpress/wp-load.php';
switch_theme('farmtree-native');
require_once get_stylesheet_directory() . '/functions.php';
$animation = get_theme_file_uri('assets/media/final-tools-review-11s-to-40s-2x.gif');
$poster = get_theme_file_uri('assets/media/final-tools-review-11s-to-40s-poster.png');
$block = ['blockName'=>'core/image','attrs'=>['className'=>'ft-platform-screen ft-platform-gif']];
$html = '<figure class="wp-block-image ft-platform-gif"><img src="'.esc_url($animation).'" width="960" height="540" loading="lazy" decoding="async" alt="Approved workflow" /></figure>';
$rendered = farmtree_native_defer_platform_animation($html, $block);
$processor = new WP_HTML_Tag_Processor($rendered); $processor->next_tag('img');
$checks = ['poster'=>$processor->get_attribute('src')===$poster, 'exactAnimation'=>$processor->get_attribute('data-ft-animation-src')===$animation];
foreach (['width'=>'960','height'=>'540','loading'=>'lazy','decoding'=>'async','alt'=>'Approved workflow'] as $key=>$value) $checks[$key] = $processor->get_attribute($key)===$value;
$checks['idempotent'] = farmtree_native_defer_platform_animation($rendered,$block)===$rendered;
foreach (['replacement'=>str_replace($animation,'https://example.test/uploads/editor-choice.jpg',$html), 'srcset'=>str_replace(' width=', ' srcset="custom.gif 960w" width=', $html), 'sizes'=>str_replace(' width=', ' sizes="100vw" width=', $html)] as $name=>$input) $checks[$name] = farmtree_native_defer_platform_animation($input,$block)===$input;
$other = $block; $other['attrs']['className']='ft-platform-gif-other';
$checks['exactClassOnly']=farmtree_native_defer_platform_animation($html,$other)===$html;
$other['blockName']='core/post-featured-image'; $other['attrs']['className']='ft-platform-gif';
$checks['coreImageOnly']=farmtree_native_defer_platform_animation($html,$other)===$html;
$checks['priority']=has_filter('render_block','farmtree_native_defer_platform_animation')===12;
file_put_contents('/farmtree-output/result.json',wp_json_encode($checks));`;
try {
  const blueprint = resolve(temporary, 'blueprint.json');
  await writeFile(blueprint, JSON.stringify({ preferredVersions: { php: '8.2', wp: 'latest' }, steps: [{ step: 'runPHP', code }] }));
  const run = spawnSync(resolve(root, 'node_modules/.bin/wp-playground-cli'), ['run-blueprint', '--blueprint', blueprint, '--mount-dir', resolve(root, 'wordpress/wp-content/themes/farmtree-native'), '/wordpress/wp-content/themes/farmtree-native', '--mount-dir', temporary, '/farmtree-output'], { encoding: 'utf8', timeout: 180000 });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const result = JSON.parse(await readFile(resolve(temporary, 'result.json'), 'utf8'));
  for (const [name, passed] of Object.entries(result)) assert.equal(passed, true, name);
  console.log(JSON.stringify({ passed: true, checks: result }, null, 2));
} finally { await rm(temporary, { recursive: true, force: true }); }
