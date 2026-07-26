<?php
/**
 * Low-level helpers.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('farmtree_asset_exists')) {
    /**
     * Whether a theme asset file exists on disk.
     *
     * @param string $path Path relative to the theme assets/ directory.
     * @return bool
     */
    function farmtree_asset_exists(string $path): bool
    {
        return file_exists(get_theme_file_path('assets/' . ltrim($path, '/')));
    }
}
