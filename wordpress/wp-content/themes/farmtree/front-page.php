<?php
/**
 * Front page: the full approved FarmTree homepage.
 *
 * The homepage sections and the statically-present in-page routes
 * (#platform, #case-studies, #segment-*) live in the main-home template
 * part; the hash router in the head bundle toggles the active section.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>
<main id="main-content">
<?php get_template_part('template-parts/main-home'); ?>
</main>
<?php
get_footer();
