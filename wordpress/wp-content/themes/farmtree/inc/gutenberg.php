<?php
/**
 * Gutenberg integration: FarmTree blocks, patterns and editor guardrails.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Approved default content for the homepage hero pilot block.
 *
 * @return array<string, mixed>
 */
function farmtree_homepage_hero_defaults(): array
{
    return [
        'kicker'        => 'AGROFORESTRY INTELLIGENCE',
        'title'         => 'Make agroforestry measurable, investable and scalable.',
        'text'          => 'FarmTree helps organisations turn agroforestry complexity into clearer project intelligence for planning, reporting and investment decisions.',
        'mediaId'       => 0,
        'mediaUrl'      => farmtree_asset_url('case-giz_opt.webp'),
        'mediaAlt'      => 'Agroforestry landscape planning — tree-based farming systems and landscape investment in Madagascar',
        'primaryText'   => 'Request a demo ↗',
        'primaryUrl'    => 'https://tool.farmtree.earth/Identity/Account/Register',
        'secondaryText' => 'Ask for a quotation ↗',
        'futureLabel'   => 'Future service',
        'futureTitle'   => 'Design your own agroforestry system',
        'futureText'    => 'Explore how FarmTree turns agroforestry scenarios into measurable outcomes and investment-ready plans.',
        'showFutureCard' => true,
    ];
}

/**
 * Normalize and validate hero attributes before frontend rendering.
 *
 * @param array<string, mixed> $attributes Block attributes.
 * @return array<string, mixed>
 */
function farmtree_normalize_homepage_hero_attributes(array $attributes = []): array
{
    $defaults = farmtree_homepage_hero_defaults();
    $attrs    = array_merge($defaults, $attributes);

    foreach (['kicker', 'title', 'text', 'mediaAlt', 'primaryText', 'secondaryText', 'futureLabel', 'futureTitle', 'futureText'] as $key) {
        $attrs[$key] = trim(wp_strip_all_tags((string) ($attrs[$key] ?? $defaults[$key])));
        if ($attrs[$key] === '') {
            $attrs[$key] = $defaults[$key];
        }
    }

    $media_url = esc_url_raw((string) ($attrs['mediaUrl'] ?? ''));
    $attrs['mediaUrl'] = $media_url !== '' ? $media_url : $defaults['mediaUrl'];

    $primary_url = esc_url_raw((string) ($attrs['primaryUrl'] ?? ''));
    $attrs['primaryUrl'] = preg_match('#^https://#i', $primary_url) ? $primary_url : $defaults['primaryUrl'];
    $attrs['mediaId'] = absint($attrs['mediaId'] ?? 0);
    $attrs['showFutureCard'] = !empty($attrs['showFutureCard']);

    return $attrs;
}

/**
 * Render the editable homepage hero while preserving the approved frontend DOM.
 *
 * @param array<string, mixed> $attributes Block attributes.
 * @return string
 */
function farmtree_render_homepage_hero(array $attributes = []): string
{
    $attrs = farmtree_normalize_homepage_hero_attributes($attributes);

    ob_start();
    ?>
<section class="page active" id="page-home">
<div class="hero">
<img fetchpriority="high" alt="<?php echo esc_attr($attrs['mediaAlt']); ?>" class="hero-img" id="heroImg" src="<?php echo esc_url($attrs['mediaUrl']); ?>"/>
<div class="green-blob"></div>
<button type="button" class="arrow-side left" id="prevHero">‹</button><button type="button" class="arrow-side right" id="nextHero">›</button>
<div class="hero-content">
<div class="kicker" id="heroKicker"><?php echo esc_html($attrs['kicker']); ?></div>
<h1 id="heroTitle"><?php echo esc_html($attrs['title']); ?></h1>
<p id="heroText"><?php echo esc_html($attrs['text']); ?></p>
<div class="ft-hero-cta-row"><a class="cta-link" target="_blank" rel="noopener noreferrer" data-ft-action="request-demo" href="<?php echo esc_url($attrs['primaryUrl']); ?>"><?php echo esc_html($attrs['primaryText']); ?></a><button type="button" class="cta-link secondary" data-ft-action="request-quotation"><?php echo esc_html($attrs['secondaryText']); ?></button></div><?php if ($attrs['showFutureCard']) : ?><div class="ft-free-plan-card"><span><?php echo esc_html($attrs['futureLabel']); ?></span><strong><?php echo esc_html($attrs['futureTitle']); ?></strong><p><?php echo esc_html($attrs['futureText']); ?></p></div><?php endif; ?>
</div>
<div class="hero-controls" role="tablist" aria-label="Hero slides">
<button type="button" class="hero-dot active" data-slide="0" aria-label="Slide 1: Agroforestry Planning" aria-selected="true" role="tab"></button>
<button type="button" class="hero-dot" data-slide="1" aria-label="Slide 2: Science-Based Modelling" aria-selected="false" role="tab"></button>
</div>
</div>
<div class="video-home"></div>
</section>
<script type="application/json" id="ftHomepageHeroData"><?php echo wp_json_encode([
    'kicker'   => $attrs['kicker'],
    'title'    => $attrs['title'],
    'text'     => $attrs['text'],
    'mediaUrl' => $attrs['mediaUrl'],
    'mediaAlt' => $attrs['mediaAlt'],
]); ?></script>
    <?php
    return trim((string) ob_get_clean());
}

/**
 * Find a block recursively in parsed block content.
 *
 * @param array<int, array<string, mixed>> $blocks Parsed block list.
 * @param string                          $name   Block name.
 * @return array<string, mixed>|null
 */
function farmtree_find_parsed_block(array $blocks, string $name): ?array
{
    foreach ($blocks as $block) {
        if (($block['blockName'] ?? '') === $name) {
            return $block;
        }
        if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $found = farmtree_find_parsed_block($block['innerBlocks'], $name);
            if ($found) {
                return $found;
            }
        }
    }

    return null;
}

/**
 * Read hero attributes from the configured static front page when available.
 *
 * This lets editors manage the pilot block from a real WordPress page while the
 * legacy single-document shell remains the visual fallback until release.
 *
 * @return array<string, mixed>
 */
function farmtree_get_front_page_homepage_hero_attributes(): array
{
    if (get_option('show_on_front') !== 'page') {
        return [];
    }

    $front_page_id = absint(get_option('page_on_front'));
    if ($front_page_id <= 0) {
        return [];
    }

    $front_page = get_post($front_page_id);
    if (!$front_page instanceof WP_Post || $front_page->post_type !== 'page' || !has_blocks($front_page)) {
        return [];
    }

    $block = farmtree_find_parsed_block(parse_blocks($front_page->post_content), 'farmtree/homepage-hero');
    if (!$block || empty($block['attrs']) || !is_array($block['attrs'])) {
        return [];
    }

    return $block['attrs'];
}

/**
 * Register FarmTree block primitives.
 */
function farmtree_register_blocks(): void
{
    $hero_asset_path = FARMTREE_DIR . '/blocks/homepage-hero/index.asset.php';
    $hero_asset      = file_exists($hero_asset_path) ? require $hero_asset_path : [
        'dependencies' => ['wp-block-editor', 'wp-blocks', 'wp-components', 'wp-element', 'wp-i18n'],
        'version'      => FARMTREE_VERSION,
    ];

    wp_register_script(
        'farmtree-homepage-hero-editor-script',
        FARMTREE_URI . '/blocks/homepage-hero/index.js',
        $hero_asset['dependencies'] ?? [],
        $hero_asset['version'] ?? FARMTREE_VERSION,
        true
    );

    register_block_type(
        FARMTREE_DIR . '/blocks/homepage-hero',
        [
            'render_callback' => static function ($attributes): string {
                return farmtree_render_homepage_hero(is_array($attributes) ? $attributes : []);
            },
        ]
    );
}
add_action('init', 'farmtree_register_blocks');

/**
 * Register reusable editor pattern categories.
 */
function farmtree_register_block_patterns(): void
{
    if (!function_exists('register_block_pattern_category')) {
        return;
    }

    register_block_pattern_category('farmtree', ['label' => __('FarmTree', 'farmtree')]);
}
add_action('init', 'farmtree_register_block_patterns');

/**
 * Lock the pilot page template to FarmTree-approved blocks only.
 *
 * @param bool|array<int, string> $allowed_block_types Allowed block types.
 * @param WP_Block_Editor_Context $editor_context      Editor context.
 * @return bool|array<int, string>
 */
function farmtree_allowed_block_types_for_native_templates($allowed_block_types, $editor_context)
{
    $post = $editor_context->post ?? null;
    if (!$post instanceof WP_Post || $post->post_type !== 'page') {
        return $allowed_block_types;
    }

    if (get_page_template_slug($post) !== 'template-farmtree-native-homepage.php') {
        return $allowed_block_types;
    }

    return ['farmtree/homepage-hero'];
}
add_filter('allowed_block_types_all', 'farmtree_allowed_block_types_for_native_templates', 10, 2);

/**
 * Provide theme asset URLs to block editor scripts.
 */
function farmtree_enqueue_block_editor_config(): void
{
    wp_add_inline_script(
        'farmtree-homepage-hero-editor-script',
        'window.FT_ASSETS = ' . wp_json_encode(esc_url_raw(untrailingslashit(get_theme_file_uri('assets')))) . ';',
        'before'
    );
}
add_action('enqueue_block_editor_assets', 'farmtree_enqueue_block_editor_config');
