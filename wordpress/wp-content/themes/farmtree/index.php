<?php
/**
 * Fallback template.
 *
 * During the visual-parity phase the whole approved site is a single
 * hash-routed document, so the fallback renders the same homepage markup;
 * the head router resolves the requested #hash. This keeps every internal
 * route working regardless of the WordPress "front page displays" setting.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main id="main-content" tabindex="-1">
<?php get_template_part('template-parts/main-home'); ?>
</main>
<?php
get_footer();
