<?php
/**
 * Template tags used by the theme markup.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!function_exists('farmtree_asset')) {
    /**
     * Resolve a theme asset path to an escaped, absolute URL.
     *
     * All migrated markup references assets through this tag so nothing hard-codes
     * `assets/…` (which would resolve against the site root) or a filesystem path.
     * Mirrors window.FT_ASSETS on the JS side.
     *
     * @param string $path Path relative to the theme assets/ directory (e.g. 'media/x.webm').
     * @return string Escaped absolute URL.
     */
    function farmtree_asset(string $path): string
    {
        return esc_url(get_theme_file_uri('assets/' . ltrim($path, '/')));
    }
}

if (!function_exists('farmtree_asset_url')) {
    /**
     * Unescaped variant for contexts that escape later (e.g. wp_json_encode).
     *
     * @param string $path Path relative to the theme assets/ directory.
     * @return string
     */
    function farmtree_asset_url(string $path): string
    {
        return get_theme_file_uri('assets/' . ltrim($path, '/'));
    }
}
