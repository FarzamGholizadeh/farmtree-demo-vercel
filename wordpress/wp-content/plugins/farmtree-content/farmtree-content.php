<?php
/**
 * Plugin Name: FarmTree Content
 * Plugin URI: https://farmtree.eu/
 * Description: Canonical native content-model and global-settings layer for the isolated FarmTree rebuild. This foundation release registers no public content types.
 * Version: 0.1.0
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

define('FARMTREE_CONTENT_VERSION', '0.1.0');
define('FARMTREE_CONTENT_FILE', __FILE__);
define('FARMTREE_CONTENT_DIR', plugin_dir_path(__FILE__));

require_once FARMTREE_CONTENT_DIR . 'includes/architecture.php';

/**
 * Keep activation side-effect free during the foundation sprint.
 */
function farmtree_content_activate(): void
{
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
