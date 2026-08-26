<?php
/**
 * Runtime validation for the installed, inactive FarmTree native packages.
 *
 * Executed with `wp eval-file`. It never activates code, publishes content,
 * deletes content, changes options, or runs a migration. The only persistent
 * write is one clearly labelled draft page plus its revisions.
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "WordPress is not loaded.\n");
    exit(1);
}

function farmtree_runtime_fail(string $message): void
{
    fwrite(STDERR, "FARMTREE_RUNTIME_VALIDATION_FAILED: {$message}\n");
    exit(1);
}

function farmtree_runtime_assert(bool $condition, string $message): void
{
    if (!$condition) {
        farmtree_runtime_fail($message);
    }
}

/**
 * @param array<int, array<string, mixed>> $blocks
 * @return array<int, array<string, mixed>>
 */
function farmtree_runtime_flatten_blocks(array $blocks): array
{
    $flat = [];

    foreach ($blocks as $block) {
        $flat[] = $block;
        if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $flat = array_merge($flat, farmtree_runtime_flatten_blocks($block['innerBlocks']));
        }
    }

    return $flat;
}

/**
 * Evaluate a theme pattern file the same way core obtains its content.
 */
function farmtree_runtime_pattern_content(string $path): string
{
    ob_start();
    include $path;
    $content = ob_get_clean();

    farmtree_runtime_assert(is_string($content) && trim($content) !== '', "Empty pattern: {$path}");
    return $content;
}

set_error_handler(
    static function (int $severity, string $message, string $file, int $line): bool {
        if (!(error_reporting() & $severity)) {
            return false;
        }

        throw new ErrorException($message, 0, $severity, $file, $line);
    },
    E_WARNING | E_USER_WARNING | E_RECOVERABLE_ERROR
);

global $wp_version;

require_once ABSPATH . 'wp-admin/includes/plugin.php';

$theme_slug = 'farmtree-native';
$plugin_slug = 'farmtree-content';
$theme = wp_get_theme($theme_slug);
$theme_dir = WP_CONTENT_DIR . '/themes/' . $theme_slug;
$plugin_file = WP_CONTENT_DIR . '/plugins/' . $plugin_slug . '/farmtree-content.php';
$run_reference = isset($args[0]) ? sanitize_key((string) $args[0]) : 'manual';

farmtree_runtime_assert($theme->exists(), 'WordPress does not recognize farmtree-native.');
farmtree_runtime_assert(!$theme->errors(), 'WordPress reports a farmtree-native theme error.');
farmtree_runtime_assert($theme->is_block_theme(), 'farmtree-native is not recognized as a Block Theme.');
farmtree_runtime_assert(get_option('template') === 'farmtree', 'The active template changed from farmtree.');
farmtree_runtime_assert(get_option('stylesheet') === 'farmtree', 'The active stylesheet changed from farmtree.');
farmtree_runtime_assert(get_option('blog_public') === '0', 'WordPress search visibility is not disabled.');
farmtree_runtime_assert(!is_plugin_active($plugin_slug . '/farmtree-content.php'), 'farmtree-content must remain inactive.');
farmtree_runtime_assert(version_compare(PHP_VERSION, '8.1', '>='), 'PHP does not meet the native package requirement.');
farmtree_runtime_assert(version_compare((string) $wp_version, '6.6', '>='), 'WordPress does not meet the native package requirement.');

$theme_json_path = $theme_dir . '/theme.json';
farmtree_runtime_assert(is_readable($theme_json_path), 'theme.json is not readable.');

try {
    $theme_json_data = json_decode((string) file_get_contents($theme_json_path), true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    farmtree_runtime_fail('theme.json cannot be decoded: ' . $error->getMessage());
}

farmtree_runtime_assert(is_array($theme_json_data), 'theme.json did not decode to an object.');
farmtree_runtime_assert(($theme_json_data['version'] ?? null) === 3, 'theme.json is not schema version 3.');
farmtree_runtime_assert(class_exists('WP_Theme_JSON'), 'WordPress theme.json runtime is unavailable.');
$theme_json = new WP_Theme_JSON($theme_json_data, 'theme');
farmtree_runtime_assert(is_array($theme_json->get_data()), 'WordPress could not normalize theme.json.');

$expected_templates = ['404', 'archive', 'content-only-page', 'front-page', 'index', 'page', 'single'];
$expected_parts = ['footer', 'header', 'quotation-modal'];
$expected_patterns = ['brand-logo', 'call-to-action', 'homepage-foundation', 'page-intro'];

foreach ($expected_templates as $slug) {
    $path = $theme_dir . '/templates/' . $slug . '.html';
    farmtree_runtime_assert(is_readable($path), "Missing template: {$slug}");
    $blocks = parse_blocks((string) file_get_contents($path));
    farmtree_runtime_assert(count($blocks) > 0, "Template did not parse: {$slug}");
}

foreach ($expected_parts as $slug) {
    $path = $theme_dir . '/parts/' . $slug . '.html';
    farmtree_runtime_assert(is_readable($path), "Missing template part: {$slug}");
    $blocks = parse_blocks((string) file_get_contents($path));
    farmtree_runtime_assert(count($blocks) > 0, "Template part did not parse: {$slug}");
}

farmtree_runtime_assert(
    str_contains((string) file_get_contents($theme_dir . '/parts/header.html'), 'ft-native-site-header'),
    'Header structure is missing.'
);
farmtree_runtime_assert(
    str_contains((string) file_get_contents($theme_dir . '/parts/footer.html'), 'ft-native-site-footer'),
    'Footer structure is missing.'
);

$native_theme_uri = content_url('themes/' . $theme_slug);
$theme_uri_filter = static function (string $url, string $file) use ($native_theme_uri): string {
    return trailingslashit($native_theme_uri) . ltrim($file, '/');
};
add_filter('theme_file_uri', $theme_uri_filter, 10, 2);

register_block_pattern_category(
    'farmtree-native',
    ['label' => 'FarmTree', 'description' => 'FarmTree runtime validation category.']
);

$pattern_titles = [
    'brand-logo' => 'FarmTree Brand Logo',
    'call-to-action' => 'Call To Action',
    'homepage-foundation' => 'FarmTree Homepage',
    'page-intro' => 'Page Intro',
];
$pattern_contents = [];

foreach ($expected_patterns as $slug) {
    $path = $theme_dir . '/patterns/' . $slug . '.php';
    farmtree_runtime_assert(is_readable($path), "Missing pattern: {$slug}");
    $content = farmtree_runtime_pattern_content($path);
    $blocks = parse_blocks($content);
    farmtree_runtime_assert(count($blocks) > 0, "Pattern did not parse: {$slug}");
    $pattern_contents[$slug] = $content;

    $registered = register_block_pattern(
        $theme_slug . '/' . $slug,
        ['title' => $pattern_titles[$slug], 'content' => $content]
    );
    farmtree_runtime_assert($registered, "Pattern could not be registered: {$slug}");
}

remove_filter('theme_file_uri', $theme_uri_filter, 10);

$homepage_content = $pattern_contents['homepage-foundation'];
$homepage_blocks = parse_blocks($homepage_content);
$homepage_flat = farmtree_runtime_flatten_blocks($homepage_blocks);
$block_names = array_values(array_filter(array_column($homepage_flat, 'blockName')));
$top_level_attrs = $homepage_blocks[0]['attrs'] ?? [];

farmtree_runtime_assert(($top_level_attrs['templateLock'] ?? '') === 'contentOnly', 'Homepage content-only lock is missing.');
farmtree_runtime_assert(($top_level_attrs['lock']['move'] ?? false) === true, 'Homepage move lock is missing.');
farmtree_runtime_assert(($top_level_attrs['lock']['remove'] ?? false) === true, 'Homepage remove lock is missing.');
farmtree_runtime_assert(in_array('core/image', $block_names, true), 'Editable core Image blocks are missing.');
farmtree_runtime_assert(in_array('core/video', $block_names, true), 'Editable core Video blocks are missing.');
farmtree_runtime_assert(in_array('core/query', $block_names, true), 'The News Query Loop is missing.');
farmtree_runtime_assert(in_array('core/pattern', $block_names, true), 'The Homepage CTA pattern reference is missing.');

$editable_contracts = [
    'Hero' => 'ft-home-hero-copy-sources',
    'Platform media' => 'ft-platform-visual',
    'testimonials' => 'ft-home-trust',
    'Proof Stories' => 'ft-home-proof',
    'FAQs' => 'ft-home-faq',
    'News' => 'ft-home-news-query',
];

foreach ($editable_contracts as $label => $marker) {
    farmtree_runtime_assert(str_contains($homepage_content, $marker), "{$label} editable contract is missing.");
}

farmtree_runtime_assert(
    str_contains($pattern_contents['call-to-action'], 'ft-final-cta'),
    'CTA editable contract is missing.'
);

$plugins = get_plugins('/' . $plugin_slug);
farmtree_runtime_assert(isset($plugins['farmtree-content.php']), 'WordPress does not recognize farmtree-content.');
farmtree_runtime_assert(is_readable($plugin_file), 'farmtree-content entry file is not readable.');
require_once $plugin_file;
farmtree_runtime_assert(function_exists('farmtree_content_architecture'), 'farmtree-content did not load for isolated validation.');
$architecture = farmtree_content_architecture();
farmtree_runtime_assert(($architecture['status'] ?? '') === 'foundation_only', 'Unexpected farmtree-content architecture status.');

$drafts = get_posts([
    'post_type' => 'page',
    'post_status' => 'draft',
    'numberposts' => 1,
    'fields' => 'ids',
    'meta_key' => '_farmtree_native_runtime_validation',
    'meta_value' => '1',
]);

if ($drafts) {
    $draft_id = (int) $drafts[0];
} else {
    $draft_id = wp_insert_post(
        wp_slash([
            'post_type' => 'page',
            'post_status' => 'draft',
            'post_title' => 'FarmTree Native Runtime Validation — Draft Only',
            'post_content' => $homepage_content,
        ]),
        true
    );
    if (is_wp_error($draft_id)) {
        farmtree_runtime_fail('Draft creation failed: ' . $draft_id->get_error_message());
    }
    $draft_id = (int) $draft_id;
    update_post_meta($draft_id, '_farmtree_native_runtime_validation', '1');
}

$draft = get_post($draft_id);
farmtree_runtime_assert($draft instanceof WP_Post, 'Draft could not be reloaded.');
farmtree_runtime_assert($draft->post_status === 'draft', 'Runtime validation page is not a draft.');
farmtree_runtime_assert(wp_revisions_enabled($draft), 'Page revisions are disabled.');

$revision_marker = "\n<!-- farmtree-runtime-validation:{$run_reference} -->";
$marked_content = $homepage_content . $revision_marker;
$marked_update = wp_update_post(
    wp_slash(['ID' => $draft_id, 'post_content' => $marked_content]),
    true
);
if (is_wp_error($marked_update)) {
    farmtree_runtime_fail('Draft save failed: ' . $marked_update->get_error_message());
}

$saved_draft = get_post($draft_id);
farmtree_runtime_assert($saved_draft instanceof WP_Post, 'Saved draft could not be reloaded.');
farmtree_runtime_assert($saved_draft->post_content === $marked_content, 'Draft content did not persist after reload.');
farmtree_runtime_assert(count(wp_get_post_revisions($draft_id)) > 0, 'WordPress did not create a revision.');

$restored_update = wp_update_post(
    wp_slash(['ID' => $draft_id, 'post_content' => $homepage_content]),
    true
);
if (is_wp_error($restored_update)) {
    farmtree_runtime_fail('Draft restoration save failed: ' . $restored_update->get_error_message());
}

$restored_draft = get_post($draft_id);
farmtree_runtime_assert($restored_draft instanceof WP_Post, 'Restored draft could not be reloaded.');
farmtree_runtime_assert($restored_draft->post_status === 'draft', 'Draft status changed during validation.');
farmtree_runtime_assert($restored_draft->post_content === $homepage_content, 'Final draft content does not match the Homepage pattern.');

$rendered = do_blocks($homepage_content);
farmtree_runtime_assert(trim($rendered) !== '', 'Homepage blocks rendered no output.');
farmtree_runtime_assert(!str_contains($rendered, '<?php'), 'Rendered Homepage contains unresolved PHP.');
farmtree_runtime_assert(str_contains($rendered, 'ft-home-news'), 'News Query Loop did not render its wrapper.');
farmtree_runtime_assert(str_contains($rendered, 'ft-final-cta'), 'CTA pattern did not render.');

printf(
    "FARMTREE_NATIVE_RUNTIME_STATIC_OK\nFARMTREE_NATIVE_DRAFT_ID=%d\nFARMTREE_NATIVE_DRAFT_SAVE_RELOAD_REVISIONS_OK\nFARMTREE_NATIVE_QUERY_AND_PATTERNS_RENDER_OK\n",
    $draft_id
);

restore_error_handler();
