// Disposable WordPress only: verify exact sitemap exclusion, never mutate a site.
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = process.cwd();
const temporary = await mkdtemp(resolve(tmpdir(), 'farmtree-sitemap-'));
const code = `<?php
require '/wordpress/wp-load.php';
switch_theme('farmtree-native');
require_once get_stylesheet_directory() . '/functions.php';
$ids = [];
foreach (['blog','news-insights','unrelated'] as $slug) {
    $ids[$slug] = wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_title'=>$slug,'post_name'=>$slug]);
    if ($slug !== 'unrelated') update_post_meta($ids[$slug], '_farmtree_content_managed_key', 'page.en.' . str_replace('-', '_', $slug));
}
$provider = new WP_Sitemaps_Posts();
$args = ['post_type'=>'page','post_status'=>'publish','fields'=>'ids','posts_per_page'=>-1,'post__not_in'=>[99999]];
$before = get_posts($args);
$filtered = farmtree_native_news_hub_sitemap_args($args, 'page');
$after = get_posts($filtered);
$expected = array_values(array_diff($before, [$ids['news-insights']]));
sort($expected); sort($after);
$nonpage = farmtree_native_news_hub_sitemap_args($args, 'post');
$canonical = wp_get_canonical_url($ids['news-insights']);
update_post_meta($ids['news-insights'], '_farmtree_content_managed_key', 'unrelated-owner');
$unowned = farmtree_native_news_hub_sitemap_args($args, 'page');
$unowned_canonical = wp_get_canonical_url($ids['news-insights']);
file_put_contents('/farmtree-output/result.json', wp_json_encode([
 'exactRemainingIds'=>$after===$expected,'priorExclusionPreserved'=>in_array(99999,$filtered['post__not_in'],true),
 'onlyPageFilter'=>$nonpage===$args,'canonical'=>$canonical,'blog'=>get_permalink($ids['blog']),
 'unownedUnchanged'=>$unowned===$args,'unownedCanonical'=>$unowned_canonical===get_permalink($ids['news-insights']),
 'blogStillPublished'=>get_post_status($ids['blog'])==='publish','duplicateStillPublished'=>get_post_status($ids['news-insights'])==='publish'
]));`;
try {
  const blueprint = resolve(temporary, 'blueprint.json');
  await writeFile(blueprint, JSON.stringify({ preferredVersions: { php: '8.2', wp: 'latest' }, steps: [{ step: 'runPHP', code }] }));
  const run = spawnSync(resolve(root, 'node_modules/.bin/wp-playground-cli'), ['run-blueprint', '--blueprint', blueprint, '--mount-dir', resolve(root, 'wordpress/wp-content/themes/farmtree-native'), '/wordpress/wp-content/themes/farmtree-native', '--mount-dir', temporary, '/farmtree-output'], { encoding: 'utf8', timeout: 180000 });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const result = JSON.parse(await readFile(resolve(temporary, 'result.json'), 'utf8'));
  assert.equal(result.canonical, result.blog);
  for (const [key, value] of Object.entries(result)) if (!['canonical', 'blog'].includes(key)) assert.equal(value, true, key);
  console.log(JSON.stringify({ passed: true, ...result }, null, 2));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
