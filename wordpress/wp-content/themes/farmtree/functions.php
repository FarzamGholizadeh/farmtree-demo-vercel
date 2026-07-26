<?php
/**
 * FarmTree theme bootstrap.
 *
 * Loads the theme's modular includes. Behaviour lives in inc/:
 *   - setup.php         theme supports, menus, document title
 *   - enqueue.php       ordered CSS + JS bundles, FT_ASSETS base
 *   - template-tags.php farmtree_asset() and presentational helpers
 *   - helpers.php       low-level utilities
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('FARMTREE_VERSION')) {
    $farmtree_theme = wp_get_theme();
    define('FARMTREE_VERSION', $farmtree_theme->get('Version') ?: '0.1.0');
}
define('FARMTREE_DIR', get_template_directory());
define('FARMTREE_URI', get_template_directory_uri());

require_once FARMTREE_DIR . '/inc/helpers.php';
require_once FARMTREE_DIR . '/inc/template-tags.php';
require_once FARMTREE_DIR . '/inc/setup.php';
require_once FARMTREE_DIR . '/inc/enqueue.php';
