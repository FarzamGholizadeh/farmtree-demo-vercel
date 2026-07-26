<?php
/**
 * Theme setup: supports, navigation menus, content width, document title.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register theme supports and navigation locations.
 */
function farmtree_theme_setup(): void
{
    load_theme_textdomain('farmtree', FARMTREE_DIR . '/languages');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('html5', [
        'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script',
    ]);
    add_theme_support('automatic-feed-links');
    add_theme_support('customize-selective-refresh-widgets');

    // Menu locations are registered now so future editorial navigation can be
    // attached without markup changes; the parity homepage does not yet use them.
    register_nav_menus([
        'primary' => __('Primary navigation', 'farmtree'),
        'footer'  => __('Footer navigation', 'farmtree'),
    ]);
}
add_action('after_setup_theme', 'farmtree_theme_setup');

if (!isset($GLOBALS['content_width'])) {
    $GLOBALS['content_width'] = 1280;
}

/**
 * Provide the approved front-page document title through WordPress' own title
 * system (title-tag support). This is not a hard-coded <title> — WordPress
 * still renders the single title element from this filtered value.
 *
 * @param string $title Current title.
 * @return string
 */
function farmtree_front_page_title(string $title): string
{
    if (is_front_page()) {
        return 'FarmTree | Agroforestry planning, reporting and investment insights';
    }
    return $title;
}
add_filter('pre_get_document_title', 'farmtree_front_page_title');
