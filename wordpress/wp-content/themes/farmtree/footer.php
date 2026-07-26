<?php
/**
 * Site footer: footer markup, contact modal + AI assistant chrome, then
 * wp_footer() (which prints the enqueued footer app bundle). Closes the
 * `.site` wrapper opened in header-chrome.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}

get_template_part('template-parts/footer-chrome');

wp_footer();
?>
</body>
</html>
