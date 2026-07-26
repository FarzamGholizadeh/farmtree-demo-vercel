<?php
/**
 * Site header: <head>, migrated meta, and the top-of-body chrome
 * (site loader + header/navigation + Bento mobile menu).
 *
 * Document title is left to WordPress (add_theme_support('title-tag')); the
 * front-page title string is provided via the document_title_parts filter.
 * Indexing (robots) is intentionally NOT hard-coded — it is controlled by
 * Settings → Reading (Search engine visibility) or an SEO plugin.
 *
 * @package FarmTree
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#214F2A">
<?php if (is_front_page()) : ?>
<meta name="description" content="FarmTree helps organisations plan, model and report agroforestry projects with clearer investor narratives, field workflows and platform driven insights.">
<link rel="canonical" href="<?php echo esc_url(home_url('/')); ?>">
<meta property="og:type" content="website">
<meta property="og:site_name" content="FarmTree">
<meta property="og:title" content="FarmTree | Agroforestry planning, reporting and investment insights">
<meta property="og:description" content="FarmTree helps organisations plan, model and report agroforestry projects with clearer investor narratives, field workflows and platform driven insights.">
<meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>">
<meta property="og:image" content="<?php echo farmtree_asset('case-giz_opt.webp'); ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="FarmTree | Agroforestry planning, reporting and investment insights">
<meta name="twitter:description" content="FarmTree helps organisations plan, model and report agroforestry projects with clearer investor narratives, field workflows and platform driven insights.">
<meta name="twitter:image" content="<?php echo farmtree_asset('case-giz_opt.webp'); ?>">
<?php endif; ?>
<link rel="icon" href="<?php echo farmtree_asset('favicon.ico'); ?>" sizes="any">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo farmtree_asset('brand/favicons/favicon-16.png'); ?>">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo farmtree_asset('brand/favicons/favicon-32.png'); ?>">
<link rel="icon" type="image/png" sizes="192x192" href="<?php echo farmtree_asset('brand/favicons/favicon-192.png'); ?>">
<link rel="icon" type="image/png" sizes="512x512" href="<?php echo farmtree_asset('brand/favicons/favicon-512.png'); ?>">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo farmtree_asset('brand/favicons/favicon-180.png'); ?>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="image" href="<?php echo farmtree_asset('case-giz_opt.webp'); ?>" fetchpriority="high">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"></noscript>
<?php if (is_front_page()) : ?>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FarmTree B.V.",
  "url": "<?php echo esc_url(home_url('/')); ?>",
  "logo": "<?php echo farmtree_asset('brand/farmtree-logo-primary-1024.png'); ?>",
  "email": "info@farmtree.earth",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Plus Ultra Building, Bronland 12C-1",
    "postalCode": "6708 WH",
    "addressLocality": "Wageningen",
    "addressCountry": "NL"
  }
}
</script>
<?php endif; ?>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main-content"><?php esc_html_e('Skip to content', 'farmtree'); ?></a>
<?php get_template_part('template-parts/header-chrome'); ?>
