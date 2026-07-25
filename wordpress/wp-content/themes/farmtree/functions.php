<?php
/**
 * FarmTree theme functions.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

function farmtree_theme_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');

    register_nav_menus([
        'primary' => __('Primary navigation', 'farmtree'),
        'footer'  => __('Footer navigation', 'farmtree'),
    ]);
}
add_action('after_setup_theme', 'farmtree_theme_setup');

function farmtree_enqueue_assets(): void
{
    $theme = wp_get_theme();

    wp_enqueue_style(
        'farmtree-style',
        get_stylesheet_uri(),
        [],
        $theme->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'farmtree_enqueue_assets');
