<?php
/**
 * Plugin Name: FarmTree Core
 * Plugin URI: https://farmtree.eu
 * Description: Core content models, integrations and editorial functionality for FarmTree. Phase 1 registers foundations only; no public content types are registered until they are functional.
 * Version: 0.1.0
 * Author: FarmTree
 * Text Domain: farmtree-core
 * Requires at least: 6.6
 * Requires PHP: 8.1
 *
 * @package FarmTree_Core
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FARMTREE_CORE_VERSION', '0.1.0');
define('FARMTREE_CORE_FILE', __FILE__);
define('FARMTREE_CORE_DIR', plugin_dir_path(__FILE__));
define('FARMTREE_CORE_URL', plugin_dir_url(__FILE__));

require_once FARMTREE_CORE_DIR . 'includes/content-models.php';

/**
 * Activation: nothing destructive. Rewrite rules are flushed so that when
 * public content types are introduced in a later phase their permalinks work
 * immediately. Registering no post types here keeps activation a safe no-op.
 */
function farmtree_core_activate(): void
{
    flush_rewrite_rules();
}
register_activation_hook(FARMTREE_CORE_FILE, 'farmtree_core_activate');

/**
 * Deactivation: clean up rewrite rules only.
 */
function farmtree_core_deactivate(): void
{
    flush_rewrite_rules();
}
register_deactivation_hook(FARMTREE_CORE_FILE, 'farmtree_core_deactivate');
