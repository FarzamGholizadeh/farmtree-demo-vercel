<?php
/**
 * Front-page template.
 *
 * The current Vercel website will be integrated here in the next phase.
 *
 * @package FarmTree
 */

get_header();
?>

<main id="main-content">
    <h1><?php bloginfo('name'); ?></h1>
    <p><?php esc_html_e('FarmTree WordPress integration is ready for development.', 'farmtree'); ?></p>
</main>

<?php
get_footer();
