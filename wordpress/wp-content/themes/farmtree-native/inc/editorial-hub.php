<?php
/** Native editorial presentation; all story content stays in WordPress posts. */
if (!defined('ABSPATH')) { exit; }

// This workstream must not replace the approved Homepage's three News cards
// merely because the editorial hub adds twelve newer posts.
add_filter('query_loop_block_query_vars', static function (array $query, WP_Block $block): array {
    if (is_front_page() && (int) ($block->context['queryId'] ?? -1) === 2 && ($query['post_type'] ?? '') === 'post') {
        $query['post_name__in'] = ['farmtree-water-erosion-microclimate-model-update-2026', 'eu-carbon-farming-methodologies-agroforestry-2026', 'carbon-pricing-2026-nature-project-quality'];
    }
    return $query;
}, 10, 2);

add_action('wp_enqueue_scripts', static function (): void {
    if (is_page('blog')) {
        wp_enqueue_style('farmtree-editorial', get_theme_file_uri('assets/css/editorial.css'), ['farmtree-native-style'], (string) filemtime(__DIR__ . '/../assets/css/editorial.css'));
    }
});

function farmtree_native_editorial_topics(): array
{
    return [
        'planning' => ['Agroforestry Planning', ['Agroforestry Science', 'Species & Design', 'Agroforestry Practice', 'Data & Monitoring', 'Data & Governance', 'Monitoring & Decision Support'], 'Design choices, field evidence and monitoring for context-specific farm plans.'],
        'carbon' => ['Carbon & Finance', ['Carbon & MRV', 'Data & Evidence', 'Farm Economics', 'Farm Economics & Investment', 'Policy & Finance', 'Project Finance'], 'Carbon evidence, Farm Valuation and the assumptions behind an investment case.'],
        'policy' => ['Policy & Standards', ['Policy & Standards', 'Policy & Regulation', 'Policy & Restoration'], 'Read the requirements, distinguish proposals from rules, and plan the evidence.'],
        'landscape' => ['Landscape & Hydrology', ['Climate Resilience', 'Landscape Planning'], 'Water, erosion, biodiversity and the trade-offs that connect farms to landscapes.'],
        'updates' => ['FarmTree Platform / Product Insights', ['FarmTree Updates'], 'Explore modelling capabilities and how to interpret their outputs.'],
    ];
}

function farmtree_native_editorial_topic(WP_Post $post): string
{
    $names = wp_get_post_categories($post->ID, ['fields' => 'names']);
    $names = is_array($names) ? array_map(static fn($name) => html_entity_decode($name, ENT_QUOTES | ENT_HTML5, 'UTF-8'), $names) : [];
    foreach (farmtree_native_editorial_topics() as $key => [, $aliases]) {
        if (array_intersect($aliases, $names)) { return $key; }
    }
    return 'updates';
}

/** The same attachment/original filename cannot reappear under another size. */
function farmtree_native_editorial_image_key(int $id): string
{
    $file = get_attached_file($id);
    return $file ? preg_replace('/-\d+x\d+(?=\.[^.]+$)/', '', basename($file)) : (string) $id;
}

function farmtree_native_editorial_card(WP_Post $post, bool $lead, array &$images, bool $support = false): string
{
    $url = get_permalink($post);
    $title = get_the_title($post);
    $image = '';
    $thumbnail = (int) get_post_thumbnail_id($post);
    $image_key = $thumbnail ? farmtree_native_editorial_image_key($thumbnail) : '';
    if ($thumbnail && !isset($images[$image_key])) {
        $images[$image_key] = true;
        $block = new WP_Block([
            'blockName' => 'core/post-featured-image',
            'attrs' => ['isLink' => false, 'aspectRatio' => $lead ? '16/9' : '4/3', 'className' => 'ft-editorial-image' . ($lead ? ' ft-editorial-image--lead' : ($support ? ' ft-editorial-image--support' : ''))],
            'innerBlocks' => [], 'innerHTML' => '', 'innerContent' => [],
        ], ['postId' => $post->ID, 'postType' => 'post']);
        $image = $block->render();
    }
    $topics = farmtree_native_editorial_topics();
    $label = $topics[farmtree_native_editorial_topic($post)][0];
    $deck = has_excerpt($post) ? get_the_excerpt($post) : wp_trim_words(wp_strip_all_tags(strip_shortcodes($post->post_content)), 32);
    return '<article class="ft-editorial-card' . ($lead ? ' ft-editorial-card--lead' : '') . '" data-ft-story="' . esc_attr((string) $post->ID) . '">'
        . $image . '<div class="ft-editorial-card-copy"><p class="ft-editorial-meta">' . esc_html($label)
        . ' <span aria-hidden="true">·</span> <time datetime="' . esc_attr(get_the_date('c', $post)) . '">' . esc_html(get_the_date('j M Y', $post)) . '</time></p>'
        . '<h3><a href="' . esc_url($url) . '">' . esc_html($title) . '</a></h3><p>' . esc_html($deck) . '</p>'
        . '<span class="ft-editorial-read" aria-hidden="true">Read article <span>↗</span></span></div></article>';
}

function farmtree_native_render_editorial_hub(): string
{
    // No sticky duplication, shared query offset, client filtering or mutation.
    $posts = get_posts(['post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => -1,
        'orderby' => ['date' => 'DESC', 'ID' => 'DESC'], 'has_password' => false,
        'ignore_sticky_posts' => true, 'suppress_filters' => false]);
    $images = [];
    $topics = farmtree_native_editorial_topics();
    // Reserve up to two stories per topic before allocating the six newest
    // feature/latest positions. Single-story topics remain visible too.
    $counts = [];
    foreach ($posts as $post) {
        $topic = farmtree_native_editorial_topic($post);
        $counts[$topic] = ($counts[$topic] ?? 0) + 1;
    }
    $promoted = [];
    $remaining = [];
    $reserve_limit = count($posts) >= 12 ? 2 : 1;
    $reserved = array_map(static fn($count) => min($reserve_limit, $count), $counts);
    foreach ($posts as $post) {
        $topic = farmtree_native_editorial_topic($post);
        if (count($promoted) < 6 && $counts[$topic] > $reserved[$topic]) {
            $promoted[] = $post;
            $counts[$topic]--;
        } else { $remaining[] = $post; }
    }
    $sections = ['featured' => array_splice($promoted, 0, 3), 'latest' => $promoted];
    foreach ($remaining as $post) { $sections[farmtree_native_editorial_topic($post)][] = $post; }
    $labels = ['featured' => 'Featured', 'latest' => 'Latest insights'];
    foreach ($topics as $key => [$label]) { $labels[$key] = $label; }
    $html = '<div class="ft-editorial-hub"><p class="ft-editorial-intro">Research, policy and field knowledge for the people planning, financing and managing agroforestry.</p>';
    $html .= '<nav class="ft-editorial-topics" aria-label="On this page">';
    $short_labels = ['planning' => 'Agroforestry planning', 'carbon' => 'Carbon & finance', 'policy' => 'Policy & standards', 'landscape' => 'Landscape & hydrology', 'updates' => 'Platform insights'];
    foreach ($short_labels as $key => $label) {
        if (!empty($sections[$key])) { $html .= '<a href="#insights-' . esc_attr($key) . '">' . esc_html($label) . '</a>'; }
    }
    $html .= '</nav>';
    foreach ($labels as $key => $label) {
        if (empty($sections[$key])) { continue; }
        $html .= '<section id="insights-' . esc_attr($key) . '" aria-labelledby="insights-title-' . esc_attr($key) . '"><h2 id="insights-title-' . esc_attr($key) . '">' . esc_html($label) . '</h2>';
        if (isset($topics[$key])) { $html .= '<p class="ft-editorial-section-deck">' . esc_html($topics[$key][2]) . '</p>'; }
        $html .= '<div class="ft-editorial-grid' . ($key === 'featured' ? ' ft-editorial-grid--featured' : '') . '">';
        foreach ($sections[$key] as $index => $post) { $html .= farmtree_native_editorial_card($post, $key === 'featured' && $index === 0, $images, $key === 'featured' && $index > 0); }
        $html .= '</div></section>';
    }
    $html .= '<section class="ft-editorial-explore"><h2>Explore more topics</h2><nav class="ft-editorial-topic-cards" aria-label="Explore all insights by topic">';
    foreach ($topics as $key => [$label, , $description]) {
        if (!empty($sections[$key])) { $html .= '<a href="#insights-' . esc_attr($key) . '"><strong>' . esc_html($label) . '</strong><span>' . esc_html($description) . '</span><span class="ft-editorial-topic-action">Explore articles <span aria-hidden="true">↗</span></span></a>'; }
    }
    $html .= '</nav></section>';
    // No newsletter provider is configured. Do not collect addresses or imply
    // automatic subscription. This uses the approved mailto-only contact model.
    $html .= '<section class="ft-editorial-subscribe" aria-labelledby="insights-stay-informed"><div><p class="ft-editorial-eyebrow">Stay connected</p><h2 id="insights-stay-informed">Keep agroforestry intelligence in view.</h2><p>Interested in future FarmTree updates? Tell us which research, policy or platform topics matter to your work.</p><p class="ft-editorial-subscribe-note">This opens your email app. It does not automatically subscribe you to a mailing list.</p></div><a class="wp-element-button" href="mailto:info@farmtree.earth?subject=Interest%20in%20FarmTree%20updates">Ask about updates</a></section>';
    return $html . '</div>';
}

add_action('init', static function (): void {
    register_block_type('farmtree/editorial-hub', ['api_version' => 3, 'render_callback' => 'farmtree_native_render_editorial_hub', 'supports' => ['html' => false]]);
});
