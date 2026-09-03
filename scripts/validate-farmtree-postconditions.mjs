import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const playground = resolve(repositoryRoot, 'node_modules/.bin/wp-playground-cli');
const pluginRoot = process.env.FARMTREE_POSTCONDITION_PLUGIN_ROOT ||
  resolve(repositoryRoot, 'wordpress/wp-content/plugins/farmtree-content');
const themeRoot = resolve(repositoryRoot, 'wordpress/wp-content/themes/farmtree-native');

function fail(message, details = []) {
  const suffix = details.length === 0 ? '' : `\n${details.map((detail) => `  - ${detail}`).join('\n')}`;
  throw new Error(`${message}${suffix}`);
}

const phpHarness = String.raw`<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);
register_shutdown_function(static function () {
    $error = error_get_last();
    if (is_array($error) && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        file_put_contents('/farmtree-output/fatal.json', wp_json_encode($error));
    }
});
require_once '/wordpress/wp-load.php';
switch_theme('farmtree-native');
update_option('permalink_structure', '/%postname%/');

if (!defined('WP_CLI')) {
    define('WP_CLI', true);
}
if (!class_exists('WP_CLI')) {
    final class WP_CLI
    {
        public static function add_command($name, $class): void
        {
        }
    }
}
require_once WP_CONTENT_DIR . '/plugins/farmtree-content/farmtree-content.php';
farmtree_content_register_customer_segments();
farmtree_content_register_proof_stories();
flush_rewrite_rules(false);

// Simulate a legitimate but non-idempotent save canonicalizer. The historical
// reconciler ran this once before the write and WordPress ran it a second time.
$canonicalizer = static function ($content) {
    if (!is_string($content) || !str_contains($content, 'ft-native-home')) {
        return $content;
    }
    return preg_replace(
        '/<!-- \/wp:heading -->/',
        '<!-- farmtree-canonical-save -->' . "\n" . '<!-- /wp:heading -->',
        $content,
        1
    );
};
add_filter('content_save_pre', $canonicalizer, 60);

$source_commit = str_repeat('4', 40);
$backup_digest = str_repeat('7', 64);
$options = [
    'set_front_page' => false,
    'expected_site' => home_url('/'),
    'expected_theme' => get_stylesheet(),
    'source_commit' => $source_commit,
];
$reconciler = new FarmTree_Content_Reconciler();
$first_plan = $reconciler->build_plan($options);
$home_operation = null;
foreach ($first_plan['operations']['posts'] as $operation) {
    if ('page.en.home' === (string) ($operation['key'] ?? '')) {
        $home_operation = $operation;
        break;
    }
}
if (!$home_operation) {
    throw new RuntimeException('Homepage operation missing from the first plan.');
}

$manifest_property = new ReflectionProperty($reconciler, 'manifest');
$manifest_property->setAccessible(true);
$manifest = $manifest_property->getValue($reconciler);
$home_entity = null;
foreach ((array) $manifest['entities'] as $entity) {
    if ('page.en.home' === (string) ($entity['key'] ?? '')) {
        $home_entity = $entity;
        break;
    }
}
if (!$home_entity) {
    throw new RuntimeException('Homepage entity missing from the manifest.');
}
$write_method = new ReflectionMethod($reconciler, 'write_entity_state');
$write_method->setAccessible(true);
$write_resolved = true;
$pre_write = $write_method->invokeArgs($reconciler, [$home_entity, [], &$write_resolved]);
$normalize_method = new ReflectionMethod($reconciler, 'normalize_content_to_tokens');
$normalize_method->setAccessible(true);
add_action('wp_after_insert_post', static function ($post_id, $post, $update) use (
    $home_operation,
    $pre_write,
    $normalize_method,
    $reconciler
) {
    if ($update || !$post instanceof WP_Post || 'page' !== $post->post_type || 'home' !== $post->post_name) {
        return;
    }
    $desired_content = (string) ($home_operation['desired']['post_content'] ?? '');
    $persisted_content = (string) $post->post_content;
    $normalized_persisted = $normalize_method->invoke($reconciler, $persisted_content, []);
    file_put_contents('/farmtree-output/home-write-trace.json', wp_json_encode([
        'post_id' => (int) $post_id,
        'desired' => [
            'length' => strlen((string) $pre_write['post_content']),
            'sha256' => hash('sha256', (string) $pre_write['post_content']),
        ],
        'persisted' => [
            'length' => strlen($persisted_content),
            'sha256' => hash('sha256', $persisted_content),
        ],
        'normalized_desired' => [
            'length' => strlen($desired_content),
            'sha256' => hash('sha256', $desired_content),
            'canonical_marker_count' => substr_count($desired_content, '<!-- farmtree-canonical-save -->'),
        ],
        'normalized_persisted' => [
            'length' => strlen((string) $normalized_persisted),
            'sha256' => hash('sha256', (string) $normalized_persisted),
            'canonical_marker_count' => substr_count((string) $normalized_persisted, '<!-- farmtree-canonical-save -->'),
        ],
        'fields' => [
            'post_type' => (string) $post->post_type,
            'post_status' => (string) $post->post_status,
            'post_title' => (string) $post->post_title,
            'post_name' => (string) $post->post_name,
            'post_excerpt' => (string) $post->post_excerpt,
            'post_parent' => (int) $post->post_parent,
            'menu_order' => (int) $post->menu_order,
            'comment_status' => (string) $post->comment_status,
            'ping_status' => (string) $post->ping_status,
            'post_author' => (int) $post->post_author,
            'guid_sha256' => hash('sha256', (string) $post->guid),
        ],
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}, 1000, 3);

$apply = $reconciler->apply_plan($first_plan, $source_commit, $backup_digest);
$second_plan = $reconciler->build_plan($options);
$second_posts = [];
foreach ($second_plan['operations']['posts'] as $operation) {
    $second_posts[(string) $operation['key']] = $operation;
}

$home_ids = get_posts([
    'post_type' => 'page',
    'post_status' => 'any',
    'meta_key' => '_farmtree_content_managed_key',
    'meta_value' => 'page.en.home',
    'fields' => 'ids',
    'posts_per_page' => 2,
]);
if (1 !== count($home_ids)) {
    throw new RuntimeException('Expected exactly one managed Homepage after APPLY.');
}
$home_id = (int) reset($home_ids);
$post = get_post($home_id);
if (!$post) {
    throw new RuntimeException('Managed Homepage could not be loaded after APPLY.');
}

$asset_id_keys = [];
foreach ($second_plan['operations']['media'] as $operation) {
    if (!empty($operation['id'])) {
        $asset_id_keys[(int) $operation['id']] = (string) $operation['key'];
    }
}
$term_id_keys = [];
foreach ($second_plan['operations']['terms'] as $operation) {
    if (!empty($operation['id'])) {
        $term_id_keys[(int) $operation['id']] = (string) $operation['key'];
    }
}
$current_method = new ReflectionMethod($reconciler, 'current_entity');
$current_method->setAccessible(true);
$persisted = $current_method->invoke($reconciler, $home_id, $home_entity, $asset_id_keys, $term_id_keys);
$desired_method = new ReflectionMethod($reconciler, 'desired_entity');
$desired_method->setAccessible(true);
$desired_resolved = true;
$normalized_desired = $desired_method->invokeArgs($reconciler, [$home_entity, [], &$desired_resolved, $home_id]);

$assert_method = new ReflectionMethod($reconciler, 'assert_desired');
$assert_method->setAccessible(true);
$wrong_state_failures = [];
$wrong_values = [
    'post_type' => 'post',
    'post_title' => 'Wrong Homepage title',
    'post_name' => 'wrong-home',
    'post_status' => 'publish',
    'post_content' => (string) $persisted['post_content'] . "\nwrong-content",
];
foreach ($wrong_values as $field => $wrong_value) {
    $wrong = $persisted;
    $wrong[$field] = $wrong_value;
    try {
        $assert_method->invoke($reconciler, $normalized_desired, $wrong, 'page.en.home');
        $wrong_state_failures[$field] = null;
    } catch (Throwable $error) {
        $wrong_state_failures[$field] = $error->getMessage();
    }
}

$metadata_method = new ReflectionMethod($reconciler, 'assert_post_metadata');
$metadata_method->setAccessible(true);
$source_hash = (string) get_post_meta($home_id, '_farmtree_content_source_hash', true);
$applied_hash = (string) get_post_meta($home_id, '_farmtree_content_applied_hash', true);
$metadata_method->invoke($reconciler, $home_id, 'page.en.home', $source_hash, $applied_hash, $source_commit);
$metadata_failures = [];
$metadata_keys = [
    '_farmtree_content_managed_key',
    '_farmtree_content_manifest_version',
    '_farmtree_content_source_hash',
    '_farmtree_content_applied_hash',
    '_farmtree_content_release_commit',
    '_farmtree_content_backup_evidence_sha256',
];
foreach ($metadata_keys as $meta_key) {
    $correct = get_post_meta($home_id, $meta_key, false);
    update_post_meta($home_id, $meta_key, 'wrong-postcondition-value');
    try {
        $metadata_method->invoke($reconciler, $home_id, 'page.en.home', $source_hash, $applied_hash, $source_commit);
        $metadata_failures[$meta_key] = null;
    } catch (Throwable $error) {
        $metadata_failures[$meta_key] = $error->getMessage();
    } finally {
        delete_post_meta($home_id, $meta_key);
        foreach ($correct as $value) {
            add_post_meta($home_id, $meta_key, $value);
        }
    }
}

$representative_keys = [
    'page.en.home',
    'page.en.team',
    'page.en.platform',
    'proof_story.en.carbon_planning',
    'customer_segment.en.consultancy_agroforestry_advisors',
    'post.en.farmtree_water_erosion_microclimate_model_update_2026',
];
$representative_results = [];
foreach ($representative_keys as $key) {
    $operation = $second_posts[$key] ?? null;
    $representative_results[$key] = [
        'action' => $operation['action'] ?? null,
        'reason' => $operation['reason'] ?? null,
        'id' => (int) ($operation['id'] ?? 0),
    ];
}

$field_evidence = [];
foreach (['post_type', 'post_status', 'post_title', 'post_name', 'post_content', 'post_excerpt', 'post_parent', 'menu_order'] as $field) {
    $desired_value = $normalized_desired[$field] ?? null;
    $persisted_value = $persisted[$field] ?? null;
    $field_evidence[$field] = [
        'equal' => $desired_value === $persisted_value,
        'desired' => is_string($desired_value) && strlen($desired_value) > 120
            ? ['length' => strlen($desired_value), 'sha256' => hash('sha256', $desired_value)]
            : $desired_value,
        'persisted' => is_string($persisted_value) && strlen($persisted_value) > 120
            ? ['length' => strlen($persisted_value), 'sha256' => hash('sha256', $persisted_value)]
            : $persisted_value,
    ];
}

file_put_contents('/farmtree-output/result.json', wp_json_encode([
    'wordpress' => get_bloginfo('version'),
    'php' => PHP_VERSION,
    'first_plan' => ['summary' => $first_plan['summary'], 'digest' => $first_plan['plan_digest']],
    'pre_write' => [
        'resolved' => $write_resolved,
        'content_length' => strlen((string) $pre_write['post_content']),
        'content_sha256' => hash('sha256', (string) $pre_write['post_content']),
    ],
    'apply' => ['summary' => $apply['summary'], 'transaction' => $apply['transaction'], 'postcondition' => $apply['postcondition']],
    'homepage' => [
        'id' => $home_id,
        'post_type' => (string) $post->post_type,
        'status' => (string) $post->post_status,
        'title' => (string) $post->post_title,
        'slug' => (string) $post->post_name,
        'comment_status' => (string) $post->comment_status,
        'ping_status' => (string) $post->ping_status,
        'post_author' => (int) $post->post_author,
        'guid_sha256' => hash('sha256', (string) $post->guid),
        'canonical_marker_count' => substr_count((string) $post->post_content, '<!-- farmtree-canonical-save -->'),
        'field_evidence' => $field_evidence,
        'managed_metadata' => array_combine(
            $metadata_keys,
            array_map(static fn ($key) => get_post_meta($home_id, $key, false), $metadata_keys)
        ),
    ],
    'second_plan' => ['summary' => $second_plan['summary'], 'conflicts' => $second_plan['conflicts']],
    'representative_entities' => $representative_results,
    'wrong_state_failures' => $wrong_state_failures,
    'metadata_failures' => $metadata_failures,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
`;

const temporaryRoot = await mkdtemp(resolve(tmpdir(), 'farmtree-postconditions-'));
try {
  const blueprintPath = resolve(temporaryRoot, 'blueprint.json');
  await writeFile(blueprintPath, JSON.stringify({
    $schema: 'https://playground.wordpress.net/blueprint-schema.json',
    preferredVersions: { php: '8.3', wp: '7.1' },
    steps: [{ step: 'runPHP', code: phpHarness }]
  }));
  const run = spawnSync(playground, [
    'run-blueprint',
    '--blueprint', blueprintPath,
    '--php', '8.3',
    '--wp', '7.1',
    '--mount-dir', pluginRoot, '/wordpress/wp-content/plugins/farmtree-content',
    '--mount-dir', themeRoot, '/wordpress/wp-content/themes/farmtree-native',
    '--mount-dir', temporaryRoot, '/farmtree-output',
    '--verbosity', 'quiet'
  ], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 240_000
  });
  if (run.error || run.status !== 0) {
    let fatal = '';
    let homeWriteTrace = '';
    try {
      fatal = await readFile(resolve(temporaryRoot, 'fatal.json'), 'utf8');
    } catch {
      fatal = '';
    }
    try {
      homeWriteTrace = await readFile(resolve(temporaryRoot, 'home-write-trace.json'), 'utf8');
    } catch {
      homeWriteTrace = '';
    }
    fail('Disposable Homepage postcondition regression failed to execute.', [
      run.error?.message ?? `exit ${run.status}`,
      fatal ? `PHP fatal: ${fatal}` : 'No PHP fatal detail file was produced.',
      homeWriteTrace ? `Homepage write trace: ${homeWriteTrace}` : 'No Homepage write trace was produced.',
      run.stderr.trim() || run.stdout.trim() || 'No process output.'
    ]);
  }

  const result = JSON.parse(await readFile(resolve(temporaryRoot, 'result.json'), 'utf8'));
  if (result.first_plan?.summary?.conflict !== 0 || result.apply?.transaction !== 'committed' ||
      result.apply?.postcondition !== 'verified_by_final_dry_run') {
    fail('Full manifest APPLY did not complete its postcondition.', [JSON.stringify(result.apply)]);
  }
  if (result.homepage?.canonical_marker_count !== 1) {
    fail('Homepage content was not canonicalized exactly once.', [JSON.stringify(result.homepage)]);
  }
  if (Object.values(result.homepage.field_evidence).some(({ equal }) => !equal)) {
    fail('Homepage normalized desired and persisted states differ.', [JSON.stringify(result.homepage.field_evidence)]);
  }
  if (result.second_plan?.summary?.create !== 0 || result.second_plan?.summary?.update !== 0 ||
      result.second_plan?.summary?.conflict !== 0 || result.second_plan?.conflicts?.length !== 0) {
    fail('Second full plan was not idempotent.', [JSON.stringify(result.second_plan)]);
  }
  for (const [key, operation] of Object.entries(result.representative_entities)) {
    if (operation.action !== 'unchanged' || operation.reason !== 'exact' || operation.id < 1) {
      fail(`Representative managed entity did not converge: ${key}.`, [JSON.stringify(operation)]);
    }
  }
  for (const [field, message] of Object.entries(result.wrong_state_failures)) {
    if (typeof message !== 'string' || !message.includes(`at ${field}`)) {
      fail(`Wrong Homepage ${field} did not fail exact field verification.`, [String(message)]);
    }
  }
  for (const [field, message] of Object.entries(result.metadata_failures)) {
    if (typeof message !== 'string' || !message.includes(`at ${field}`)) {
      fail(`Wrong Homepage metadata ${field} did not fail exact verification.`, [String(message)]);
    }
  }

  console.log(JSON.stringify({
    ok: true,
    wordpress: result.wordpress,
    php: result.php,
    regression: 'prewrite_save_filter_is_applied_exactly_once',
    firstPlan: result.first_plan,
    apply: result.apply,
    homepage: result.homepage,
    representativeEntities: result.representative_entities,
    secondPlan: result.second_plan,
    wrongStateFieldsRejected: Object.keys(result.wrong_state_failures),
    wrongMetadataFieldsRejected: Object.keys(result.metadata_failures)
  }, null, 2));
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
