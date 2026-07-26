<?php
/**
 * Asset enqueueing.
 *
 * CSS was extracted from the approved index.html as ORDERED SEGMENTS of a
 * single cascade; the files are enqueued base → components → pages →
 * responsive via a dependency chain so WordPress always prints them in the
 * original source order (preserving every specificity / !important tie).
 *
 * JS is split into two ordered bundles:
 *   - farmtree-head : CTA capture listener + early hash router (in <head>;
 *                     both defer real DOM work to DOMContentLoaded).
 *   - farmtree-app  : every in-body script in original execution order,
 *                     loaded in the footer. window.FT_ASSETS (the theme asset
 *                     base URL) is injected immediately before it so markup
 *                     built in JS resolves against the theme, not the site root.
 *
 * No jQuery dependency; nothing is enqueued twice.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue theme styles and scripts.
 */
function farmtree_enqueue_assets(): void
{
    $ver = FARMTREE_VERSION;
    $css = get_theme_file_uri('assets/css');
    $js  = get_theme_file_uri('assets/js');

    wp_enqueue_style('farmtree-base', "{$css}/base.css", [], $ver);
    wp_enqueue_style('farmtree-components', "{$css}/components.css", ['farmtree-base'], $ver);
    wp_enqueue_style('farmtree-pages', "{$css}/pages.css", ['farmtree-components'], $ver);
    wp_enqueue_style('farmtree-responsive', "{$css}/responsive.css", ['farmtree-pages'], $ver);
    // Theme-authored a11y styles (skip link) layered last.
    wp_enqueue_style('farmtree-a11y', "{$css}/theme-a11y.css", ['farmtree-responsive'], $ver);

    // Head bundle (registers CTA + router early; safe to run before <body>).
    wp_enqueue_script('farmtree-head', "{$js}/farmtree-head.js", [], $ver, false);
    // Router-safe skip link: on activation, move focus to #main-content without
    // changing the hash (so the router never processes it) — progressive
    // enhancement over the native anchor fallback. DOMContentLoaded-guarded
    // because the head bundle runs before <body> is parsed.
    wp_add_inline_script(
        'farmtree-head',
        "(function(){function init(){var l=document.querySelector('.skip-link');if(!l)return;"
        . "l.addEventListener('click',function(e){var m=document.getElementById('main-content');"
        . "if(!m)return;e.preventDefault();m.focus();m.scrollIntoView();});}"
        . "if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}})();",
        'after'
    );

    // App bundle in the footer, preceded by the FT_ASSETS base.
    wp_enqueue_script('farmtree-app', "{$js}/farmtree-app.js", [], $ver, true);
    $assets_base = esc_url_raw(untrailingslashit(get_theme_file_uri('assets')));
    wp_add_inline_script(
        'farmtree-app',
        'window.FT_ASSETS = ' . wp_json_encode($assets_base) . ';',
        'before'
    );
}
add_action('wp_enqueue_scripts', 'farmtree_enqueue_assets');
