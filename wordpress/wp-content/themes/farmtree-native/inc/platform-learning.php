<?php
/** Scoped Platform learning presentation; the library is editable as core blocks. */
if (!defined('ABSPATH')) { exit; }

// Production caches theme pattern discovery by theme version. Register this
// bounded addition in memory even when that older discovery cache is present.
// Do not clear transients, alter options or overwrite an existing registration.
function farmtree_native_register_learning_pattern(): void
{
    $name = 'farmtree-native/platform-learning';
    if (WP_Block_Patterns_Registry::get_instance()->is_registered($name)) { return; }
    register_block_pattern($name, [
        'title' => 'FarmTree Platform learning library',
        'categories' => ['featured'],
        'inserter' => false,
        'filePath' => __DIR__ . '/../patterns/platform-learning.php',
    ]);
}
add_action('init', 'farmtree_native_register_learning_pattern', 20);

add_filter('document_title_separator', static function (string $separator): string {
    return is_page('user-videos') ? '|' : $separator;
});

add_action('wp_enqueue_scripts', static function (): void {
    if (!is_page('user-videos')) { return; }
    wp_enqueue_style('farmtree-learning', get_theme_file_uri('assets/css/platform-learning.css'), ['farmtree-native-style'], (string) filemtime(__DIR__ . '/../assets/css/platform-learning.css'));
    wp_enqueue_script('farmtree-learning', get_theme_file_uri('assets/js/platform-learning.js'), [], (string) filemtime(__DIR__ . '/../assets/js/platform-learning.js'), true);
});

// Intrinsic poster dimensions and lazy hints belong to rendered output, not
// extra attributes in Gutenberg's strict core/image serialization.
add_filter('render_block_core/image', static function (string $html): string {
    if (!is_page('user-videos')) { return $html; }
    $tag = new WP_HTML_Tag_Processor($html);
    if (!$tag->next_tag('IMG')) { return $html; }
    static $lessons = null;
    $lessons ??= json_decode(file_get_contents(__DIR__ . '/platform-videos.json'), true);
    foreach ($lessons as $lesson) {
        if ($tag->get_attribute('src') !== get_theme_file_uri($lesson['poster'])) { continue; }
        $tag->set_attribute('width', $lesson['width']);
        $tag->set_attribute('height', $lesson['height']);
        $tag->set_attribute('loading', 'lazy');
        return $tag->get_updated_html();
    }
    return $html;
});

/**
 * Keep the existing policy accurate while this theme supplies click-to-load
 * YouTube playback. Exact paragraph matches only; no stored content is changed.
 * These service-specific disclosures disappear if this runtime is rolled back.
 */
add_filter('render_block_core/paragraph', static function (string $html): string {
    if (!is_page('privacy') || is_admin()) { return $html; }
    $old = 'The FarmTree website does not embed those services or automatically transmit form data to the FarmTree Platform in the reviewed configuration.';
    $new = 'The Platform Videos page offers optional YouTube playback. Its posters are hosted by FarmTree, and no YouTube player is loaded until you select Load YouTube player. Loading the player sends technical request information, including your IP address and browser information, to YouTube/Google. The player may use cookies or browser storage, and YouTube/Google privacy practices apply. The website does not automatically transmit form data to the FarmTree Platform.';
    return str_replace($old, $new, $html);
});
