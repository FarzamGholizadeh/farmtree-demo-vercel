<?php
/**
 * Template Name: FarmTree Native Homepage Pilot
 * Template Post Type: page
 *
 * Editor-friendly homepage pilot. Editors place the FarmTree Homepage Hero
 * block in the page content; the public shell still renders through the
 * approved homepage template and reads the block attributes safely.
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
