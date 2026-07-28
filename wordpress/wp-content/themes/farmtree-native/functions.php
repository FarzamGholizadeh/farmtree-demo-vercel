<?php
/**
 * FarmTree Native theme foundation.
 *
 * @package FarmTree_Native
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the minimum theme supports required by the native foundation.
 */
function farmtree_native_setup(): void
{
    load_theme_textdomain('farmtree-native', get_template_directory() . '/languages');

    add_theme_support('automatic-feed-links');
    add_theme_support('editor-styles');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('title-tag');
    add_theme_support('wp-block-styles');

    add_editor_style(['style.css', 'assets/css/editor.css']);
}
add_action('after_setup_theme', 'farmtree_native_setup');

/**
 * Register the FarmTree pattern category.
 */
function farmtree_native_register_pattern_categories(): void
{
    if (!function_exists('register_block_pattern_category')) {
        return;
    }

    register_block_pattern_category(
        'farmtree-native',
        [
            'label'       => __('FarmTree', 'farmtree-native'),
            'description' => __('Approved FarmTree page sections with controlled structure.', 'farmtree-native'),
        ]
    );
}
add_action('init', 'farmtree_native_register_pattern_categories');

/**
 * Keep template editing intentional for non-administrators.
 *
 * Editors can create and manage content using locked patterns. Site-wide
 * template composition remains an administrator responsibility.
 *
 * @param array<string, mixed> $settings Block editor settings.
 * @param WP_Block_Editor_Context $context Current editor context.
 * @return array<string, mixed>
 */
function farmtree_native_editor_settings(array $settings, WP_Block_Editor_Context $context): array
{
    if (!current_user_can('manage_options')) {
        $settings['canLockBlocks'] = false;
    }

    return $settings;
}
add_filter('block_editor_settings_all', 'farmtree_native_editor_settings', 10, 2);
