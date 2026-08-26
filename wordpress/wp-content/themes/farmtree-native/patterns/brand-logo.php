<?php
/**
 * Title: FarmTree Brand Logo
 * Slug: farmtree-native/brand-logo
 * Categories: farmtree-native
 * Description: Asset-backed FarmTree logo with a reliable Homepage link.
 * Inserter: no
 *
 * @package FarmTree_Native
 */
?>
<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"<?php echo esc_url( home_url( '/' ) ); ?>"} -->
<figure class="wp-block-image size-full"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/brand/farmtree-logo.webp' ) ); ?>" alt="FarmTree homepage"/></a></figure>
<!-- /wp:image -->
