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
 * @param array<int, array<string, mixed>> $blocks
 * @return array<string, mixed>|null
 */
function farmtree_runtime_find_block_by_class(array $blocks, string $class_name): ?array
{
    foreach ($blocks as $block) {
        $classes = (string) ($block['attrs']['className'] ?? '');
        if (in_array($class_name, preg_split('/\s+/', trim($classes)) ?: [], true)) {
            return $block;
        }

        if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $match = farmtree_runtime_find_block_by_class($block['innerBlocks'], $class_name);
            if ($match !== null) {
                return $match;
            }
        }
    }

    return null;
}

/**
 * @param array<string, mixed> $block
 */
function farmtree_runtime_count_block_type(array $block, string $block_name): int
{
    $count = (($block['blockName'] ?? null) === $block_name) ? 1 : 0;

    if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
        foreach ($block['innerBlocks'] as $inner_block) {
            $count += farmtree_runtime_count_block_type($inner_block, $block_name);
        }
    }

    return $count;
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
farmtree_runtime_assert(in_array(get_option('blog_public'), ['0', '1'], true), 'WordPress search visibility option is invalid.');
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
$expected_templates = ['404', 'archive', 'content-only-page', 'front-page', 'index', 'page', 'single'];
$expected_parts = ['footer', 'header', 'quotation-modal'];
$expected_patterns = ['brand-logo', 'call-to-action', 'homepage-foundation', 'page-intro'];

$theme_context_filter = static function (string $value) use ($theme_slug): string {
    return $theme_slug;
};
$native_theme_uri = content_url('themes/' . $theme_slug);
$theme_uri_filter = static function (string $url, string $file) use ($native_theme_uri): string {
    return trailingslashit($native_theme_uri) . ltrim($file, '/');
};

add_filter('template', $theme_context_filter, PHP_INT_MAX);
add_filter('stylesheet', $theme_context_filter, PHP_INT_MAX);
add_filter('theme_file_uri', $theme_uri_filter, PHP_INT_MAX, 2);

require_once $theme_dir . '/functions.php';
farmtree_runtime_assert(function_exists('farmtree_native_setup'), 'farmtree-native functions.php did not load.');
farmtree_native_setup();
farmtree_runtime_assert(
    has_filter('render_block', 'farmtree_native_image_loading_attributes') !== false,
    'Native image runtime filter is not registered.'
);
farmtree_runtime_assert(
    has_filter('render_block', 'farmtree_native_platform_video_attributes') !== false,
    'Native video runtime filter is not registered.'
);

farmtree_runtime_assert(class_exists('WP_Theme_JSON_Resolver'), 'WordPress theme.json resolver is unavailable.');
WP_Theme_JSON_Resolver::clean_cached_data();
$resolved_theme_json = WP_Theme_JSON_Resolver::get_theme_data([], ['with_supports' => false]);
$resolved_theme_data = $resolved_theme_json->get_data();
farmtree_runtime_assert(is_array($resolved_theme_data), 'WordPress could not resolve theme.json.');
farmtree_runtime_assert(($resolved_theme_data['version'] ?? null) === 3, 'Resolved theme.json is not schema version 3.');
farmtree_runtime_assert(
    ($resolved_theme_data['settings']['layout']['contentSize'] ?? '') === '760px',
    'Resolved theme.json content size is incorrect.'
);
$resolved_palette = $resolved_theme_data['settings']['color']['palette']['theme']
    ?? $resolved_theme_data['settings']['color']['palette']
    ?? [];
$resolved_palette_slugs = array_column(is_array($resolved_palette) ? $resolved_palette : [], 'slug');
farmtree_runtime_assert(in_array('farmtree-green', $resolved_palette_slugs, true), 'Resolved theme palette is missing FarmTree Green.');

farmtree_runtime_assert(function_exists('get_block_templates'), 'WordPress Block Template discovery is unavailable.');
$discovered_templates = get_block_templates([], 'wp_template');
$discovered_template_slugs = array_map(
    static fn($template): string => (string) $template->slug,
    $discovered_templates
);
$discovered_parts = get_block_templates([], 'wp_template_part');
$discovered_part_slugs = array_map(
    static fn($part): string => (string) $part->slug,
    $discovered_parts
);

foreach ($expected_templates as $slug) {
    farmtree_runtime_assert(in_array($slug, $discovered_template_slugs, true), "WordPress did not discover template: {$slug}");
    $matches = array_values(array_filter(
        $discovered_templates,
        static fn($template): bool => (string) $template->slug === $slug
    ));
    farmtree_runtime_assert(($matches[0]->theme ?? '') === $theme_slug, "Template belongs to the wrong theme: {$slug}");
    farmtree_runtime_assert(($matches[0]->source ?? '') === 'theme', "Template is not sourced from native files: {$slug}");
}

foreach ($expected_parts as $slug) {
    farmtree_runtime_assert(in_array($slug, $discovered_part_slugs, true), "WordPress did not discover template part: {$slug}");
    $matches = array_values(array_filter(
        $discovered_parts,
        static fn($part): bool => (string) $part->slug === $slug
    ));
    farmtree_runtime_assert(($matches[0]->theme ?? '') === $theme_slug, "Template part belongs to the wrong theme: {$slug}");
    farmtree_runtime_assert(($matches[0]->source ?? '') === 'theme', "Template part is not sourced from native files: {$slug}");
}

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

$category_registry = WP_Block_Pattern_Categories_Registry::get_instance();
if (!$category_registry->is_registered('farmtree-native')) {
    farmtree_native_register_pattern_categories();
}
farmtree_runtime_assert($category_registry->is_registered('farmtree-native'), 'FarmTree pattern category is unavailable.');
farmtree_runtime_assert(function_exists('_register_theme_block_patterns'), 'Core theme-pattern discovery is unavailable.');
_register_theme_block_patterns();

$pattern_registry = WP_Block_Patterns_Registry::get_instance();
$pattern_contents = [];

foreach ($expected_patterns as $slug) {
    $path = $theme_dir . '/patterns/' . $slug . '.php';
    farmtree_runtime_assert(is_readable($path), "Missing pattern: {$slug}");
    $registered_slug = $theme_slug . '/' . $slug;
    farmtree_runtime_assert($pattern_registry->is_registered($registered_slug), "Core did not discover pattern: {$slug}");
    $registered_pattern = $pattern_registry->get_registered($registered_slug);
    $content = (string) ($registered_pattern['content'] ?? '');
    $blocks = parse_blocks($content);
    farmtree_runtime_assert(count($blocks) > 0, "Pattern did not parse: {$slug}");
    $pattern_contents[$slug] = $content;
}

farmtree_runtime_assert(
    in_array('farmtree-native', $pattern_registry->get_registered('farmtree-native/homepage-foundation')['categories'] ?? [], true),
    'Homepage pattern category metadata is missing.'
);
farmtree_runtime_assert(
    in_array('page', $pattern_registry->get_registered('farmtree-native/homepage-foundation')['postTypes'] ?? [], true),
    'Homepage pattern page metadata is missing.'
);
farmtree_runtime_assert(
    ($pattern_registry->get_registered('farmtree-native/brand-logo')['inserter'] ?? true) === false,
    'Brand logo inserter metadata is incorrect.'
);

$homepage_content = $pattern_contents['homepage-foundation'];
$homepage_blocks = parse_blocks($homepage_content);
$homepage_flat = farmtree_runtime_flatten_blocks($homepage_blocks);
$block_names = array_values(array_filter(array_column($homepage_flat, 'blockName')));
$homepage_group = null;
foreach ($homepage_blocks as $candidate_block) {
    if (($candidate_block['blockName'] ?? null) === 'core/group') {
        $homepage_group = $candidate_block;
        break;
    }
}
farmtree_runtime_assert(is_array($homepage_group), 'Homepage root Group block is missing.');
$top_level_attrs = $homepage_group['attrs'] ?? [];

farmtree_runtime_assert(($top_level_attrs['templateLock'] ?? '') === 'contentOnly', 'Homepage content-only lock is missing.');
farmtree_runtime_assert(($top_level_attrs['lock']['move'] ?? false) === true, 'Homepage move lock is missing.');
farmtree_runtime_assert(($top_level_attrs['lock']['remove'] ?? false) === true, 'Homepage remove lock is missing.');
farmtree_runtime_assert(in_array('core/query', $block_names, true), 'The News Query Loop is missing.');
farmtree_runtime_assert(in_array('core/pattern', $block_names, true), 'The Homepage CTA pattern reference is missing.');

$block_registry = WP_Block_Type_Registry::get_instance();
foreach (array_unique($block_names) as $block_name) {
    farmtree_runtime_assert($block_registry->is_registered($block_name), "Unregistered block type: {$block_name}");
}

$module_contracts = [
    'Hero' => ['class' => 'ft-home-hero', 'counts' => ['core/image' => 4, 'core/heading' => 4]],
    'Platform media' => ['class' => 'ft-home-platform', 'counts' => ['core/image' => 1, 'core/video' => 1]],
    'testimonials' => ['class' => 'ft-home-trust', 'counts' => ['core/quote' => 2, 'core/image' => 6]],
    'Proof Stories' => ['class' => 'ft-home-proof', 'counts' => ['core/image' => 4, 'core/heading' => 5]],
    'FAQs' => ['class' => 'ft-home-faq', 'counts' => ['core/details' => 4]],
    'News' => ['class' => 'ft-home-news', 'counts' => ['core/query' => 1]],
];

foreach ($module_contracts as $label => $contract) {
    $module = farmtree_runtime_find_block_by_class($homepage_blocks, $contract['class']);
    farmtree_runtime_assert(is_array($module), "{$label} module is missing.");

    foreach ($contract['counts'] as $block_name => $minimum) {
        farmtree_runtime_assert(
            farmtree_runtime_count_block_type($module, $block_name) >= $minimum,
            "{$label} does not expose the expected editable {$block_name} blocks."
        );
    }
}

farmtree_runtime_assert(
    farmtree_runtime_count_block_type(
        farmtree_runtime_find_block_by_class(parse_blocks($pattern_contents['call-to-action']), 'ft-final-cta') ?? [],
        'core/button'
    ) >= 2,
    'CTA editable Button blocks are missing.'
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

$revisions_before = wp_get_post_revisions($draft_id);
$revision_ids_before = array_map('intval', array_keys($revisions_before));
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
$revisions_after = wp_get_post_revisions($draft_id);
$revision_ids_after = array_map('intval', array_keys($revisions_after));
$new_revision_ids = array_diff($revision_ids_after, $revision_ids_before);
farmtree_runtime_assert(count($revisions_after) > count($revisions_before), 'Revision count did not increase after save.');
farmtree_runtime_assert(count($new_revision_ids) > 0, 'WordPress did not create a new revision for this save.');
$revision_has_marker = false;
foreach ($new_revision_ids as $revision_id) {
    $revision = get_post($revision_id);
    if ($revision instanceof WP_Post && str_contains($revision->post_content, $revision_marker)) {
        $revision_has_marker = true;
        break;
    }
}
farmtree_runtime_assert($revision_has_marker, 'The new revision does not contain the saved validation marker.');

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
farmtree_runtime_assert(
    str_contains($rendered, 'ft-news-item') || str_contains($rendered, 'No insights have been published yet'),
    'News Query Loop rendered neither posts nor its no-results state.'
);
farmtree_runtime_assert(str_contains($rendered, 'ft-final-cta'), 'CTA pattern did not render.');

remove_filter('theme_file_uri', $theme_uri_filter, PHP_INT_MAX);
remove_filter('stylesheet', $theme_context_filter, PHP_INT_MAX);
remove_filter('template', $theme_context_filter, PHP_INT_MAX);
WP_Theme_JSON_Resolver::clean_cached_data();
farmtree_runtime_assert(get_option('template') === 'farmtree', 'The active template option changed during validation.');
farmtree_runtime_assert(get_option('stylesheet') === 'farmtree', 'The active stylesheet option changed during validation.');
farmtree_runtime_assert(wp_get_theme()->get_stylesheet() === 'farmtree', 'The active theme context did not restore to farmtree.');
farmtree_runtime_assert(!is_plugin_active($plugin_slug . '/farmtree-content.php'), 'farmtree-content was activated during validation.');

printf(
    "FARMTREE_NATIVE_RUNTIME_STATIC_OK\nFARMTREE_NATIVE_DRAFT_ID=%d\nFARMTREE_NATIVE_DRAFT_SAVE_RELOAD_REVISIONS_OK\nFARMTREE_NATIVE_QUERY_AND_PATTERNS_RENDER_OK\n",
    $draft_id
);

restore_error_handler();
