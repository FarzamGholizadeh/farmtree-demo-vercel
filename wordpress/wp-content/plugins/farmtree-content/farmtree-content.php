<?php
/**
 * Plugin Name: FarmTree Content
 * Plugin URI: https://farmtree.eu/
 * Description: Canonical native content-model and global-settings layer for the isolated FarmTree rebuild.
 * Version: 0.3.0
 * Author: FarmTree
 * Text Domain: farmtree-content
 * Requires at least: 6.6
 * Requires PHP: 8.1
 *
 * @package FarmTree_Content
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FARMTREE_CONTENT_VERSION', '0.3.0');
define('FARMTREE_CONTENT_FILE', __FILE__);
define('FARMTREE_CONTENT_DIR', plugin_dir_path(__FILE__));

require_once FARMTREE_CONTENT_DIR . 'includes/architecture.php';

/**
 * Register the editor-managed customer segment model.
 *
 * Segment entries are public-capable, but migration/bootstrap content remains
 * private until an editor has approved each page for publication.
 */
function farmtree_content_register_customer_segments(): void
{
    $labels = [
        'name'                  => __('Customer Segments', 'farmtree-content'),
        'singular_name'         => __('Customer Segment', 'farmtree-content'),
        'add_new_item'          => __('Add Customer Segment', 'farmtree-content'),
        'edit_item'             => __('Edit Customer Segment', 'farmtree-content'),
        'new_item'              => __('New Customer Segment', 'farmtree-content'),
        'view_item'             => __('View Customer Segment', 'farmtree-content'),
        'search_items'          => __('Search Customer Segments', 'farmtree-content'),
        'not_found'             => __('No customer segments found.', 'farmtree-content'),
        'not_found_in_trash'    => __('No customer segments found in Trash.', 'farmtree-content'),
        'all_items'             => __('All Customer Segments', 'farmtree-content'),
        'item_published'        => __('Customer segment published.', 'farmtree-content'),
        'item_reverted_to_draft' => __('Customer segment reverted to draft.', 'farmtree-content'),
        'item_updated'          => __('Customer segment updated.', 'farmtree-content'),
    ];

    register_post_type('customer_segment', [
        'labels'             => $labels,
        'public'             => true,
        'show_in_rest'       => true,
        'rest_base'          => 'customer-segments',
        'has_archive'        => false,
        'rewrite'            => [
            'slug'       => 'customer-segments',
            'with_front' => false,
        ],
        'menu_icon'          => 'dashicons-groups',
        'menu_position'      => 21,
        'supports'           => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
        'template_lock'      => 'contentOnly',
        'show_in_nav_menus'  => true,
        'delete_with_user'   => false,
    ]);
}
add_action('init', 'farmtree_content_register_customer_segments');

/**
 * Register private-first Proof Stories with editor-owned content and theme-owned structure.
 */
function farmtree_content_register_proof_stories(): void
{
    register_post_type('proof_story', [
        'labels' => [
            'name' => __('Proof Stories', 'farmtree-content'),
            'singular_name' => __('Proof Story', 'farmtree-content'),
            'add_new_item' => __('Add Proof Story', 'farmtree-content'),
            'edit_item' => __('Edit Proof Story', 'farmtree-content'),
            'all_items' => __('All Proof Stories', 'farmtree-content'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'proof-stories',
        'has_archive' => false,
        'rewrite' => ['slug' => 'proof-stories', 'with_front' => false],
        'menu_icon' => 'dashicons-chart-area',
        'menu_position' => 22,
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
        'template_lock' => 'contentOnly',
        'show_in_nav_menus' => true,
        'delete_with_user' => false,
    ]);
}
add_action('init', 'farmtree_content_register_proof_stories');

/**
 * Keep activation side-effect free during the foundation sprint.
 */
function farmtree_content_activate(): void
{
    farmtree_content_register_customer_segments();
    farmtree_content_register_proof_stories();
    flush_rewrite_rules();
}
register_activation_hook(FARMTREE_CONTENT_FILE, 'farmtree_content_activate');

/**
 * Clear rewrite rules without deleting content or options.
 */
function farmtree_content_deactivate(): void
{
    flush_rewrite_rules();
}
register_deactivation_hook(FARMTREE_CONTENT_FILE, 'farmtree_content_deactivate');
