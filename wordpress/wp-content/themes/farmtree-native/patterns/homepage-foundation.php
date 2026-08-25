<?php
/**
 * Title: FarmTree Homepage
 * Slug: farmtree-native/homepage-foundation
 * Categories: farmtree-native
 * Description: Frank-approved native Homepage with editable content and locked structural design.
 * Keywords: homepage, platform, trust, proof stories, faq
 * Block Types: core/post-content
 * Post Types: page
 *
 * @package FarmTree_Native
 */
?>
<!-- wp:group {"metadata":{"name":"FarmTree Homepage"},"className":"ft-native-home","layout":{"type":"default"},"templateLock":"contentOnly","lock":{"move":true,"remove":true}} -->
<div class="wp-block-group ft-native-home"><!-- wp:cover {"url":"<?php echo esc_url( get_theme_file_uri( 'assets/images/home/hero-project-workshop.webp' ) ); ?>","dimRatio":65,"overlayColor":"farmtree-forest","minHeight":720,"minHeightUnit":"px","isDark":true,"align":"full","className":"ft-home-hero","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","right":"var:preset|spacing|50","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull is-dark ft-home-hero" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50);min-height:720px"><span aria-hidden="true" class="wp-block-cover__background has-farmtree-forest-background-color has-background-dim-60 has-background-dim"></span><img class="wp-block-cover__image-background" alt="Project teams reviewing agroforestry systems in the field" src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/hero-project-workshop.webp' ) ); ?>" data-object-fit="cover"/><div class="wp-block-cover__inner-container"><!-- wp:group {"align":"wide","className":"ft-home-hero-content","layout":{"type":"constrained","justifyContent":"left"}} -->
<div class="wp-block-group alignwide ft-home-hero-content"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-mist","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-mist-color has-text-color has-small-font-size">FarmTree agroforestry intelligence</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"textColor":"white","fontSize":"heading"} -->
<h1 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Plan agroforestry with scientific confidence</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"white","fontSize":"lead"} -->
<p class="has-white-color has-text-color has-lead-font-size">Compare project options, understand future scenarios and turn site data into an investment plan your team can use</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"farmtree-gold","textColor":"farmtree-ink"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-farmtree-ink-color has-farmtree-gold-background-color has-text-color has-background wp-element-button" href="https://tool.farmtree.earth/Identity/Account/Register" target="_blank" rel="noreferrer noopener">Request a demo</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline","textColor":"white"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-white-color has-text-color wp-element-button" href="#platform">See the platform</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover -->

<!-- wp:group {"tagName":"section","anchor":"platform","metadata":{"name":"Platform / planning value"},"align":"full","className":"ft-home-section ft-home-platform","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<section id="platform" class="wp-block-group alignfull ft-home-section ft-home-platform has-white-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","verticalAlignment":"center","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"42%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:42%"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">The FarmTree Platform</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Move from project idea to investment plan</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree gives project staff a practical way to build and compare agroforestry scenarios before decisions are locked in</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"ft-home-value-list"} -->
<ul class="ft-home-value-list"><!-- wp:list-item -->
<li>Create agroforestry investment plans</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Compare farm and project options</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Understand future scenarios</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/platform/">Explore the platform</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"58%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:58%"><!-- wp:group {"metadata":{"name":"Editable FarmTree Platform media"},"className":"ft-platform-visual","layout":{"type":"default"}} -->
<div class="wp-block-group ft-platform-visual"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-platform-screen ft-platform-screen-primary"} -->
<figure class="wp-block-image size-full ft-platform-screen ft-platform-screen-primary"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/platform-slide-1.png' ) ); ?>" alt="FarmTree Platform home screen with scenario, metrics and comparison tools"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-platform-screen ft-platform-screen-detail"} -->
<figure class="wp-block-image size-full ft-platform-screen ft-platform-screen-detail"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/platform-slide-2.png' ) ); ?>" alt="FarmTree Platform plot definition screen with project, farm and map settings"/></figure>
<!-- /wp:image -->

<!-- wp:paragraph {"className":"ft-home-media-caption","fontSize":"caption"} -->
<p class="ft-home-media-caption has-caption-font-size">Actual FarmTree Platform screens</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Technology / how FarmTree works"},"align":"full","className":"ft-home-section ft-home-technology","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-sky","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-technology has-farmtree-sky-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">How FarmTree works</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">How agroforestry projects are planned, monitored and reported</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree connects site information such as climate, soil and species data into a <strong>science-based, multi-KPI business plan</strong></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:image {"align":"wide","sizeSlug":"full","linkDestination":"none","className":"ft-technology-model"} -->
<figure class="wp-block-image alignwide size-full ft-technology-model"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/technology-model.webp' ) ); ?>" alt="FarmTree model connecting site, climate, soil and species information to impact monitoring and future projections"/></figure>
<!-- /wp:image -->

<!-- wp:columns {"align":"wide","className":"ft-home-inputs"} -->
<div class="wp-block-columns alignwide ft-home-inputs"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">01</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Site and climate</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Start with location, climate and terrain context</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">02</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Soil and species</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Connect plot conditions with species and management data</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">03</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Plan and report</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Compare time-based indicators for planning, monitoring and reporting</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Trust / references / testimonials"},"align":"full","className":"ft-home-section ft-home-trust","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-forest","textColor":"white","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-trust has-white-color has-farmtree-forest-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-mist","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-mist-color has-text-color has-small-font-size">Trust and references</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-small-font-size">Built with organisations working across agroforestry and climate</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"farmtree-mist","fontSize":"lead"} -->
<p class="has-farmtree-mist-color has-text-color has-lead-font-size">Selected references and approved perspectives from teams using FarmTree in practice</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:gallery {"columns":6,"imageCrop":false,"linkTo":"none","align":"wide","className":"ft-partner-logos"} -->
<figure class="wp-block-gallery alignwide has-nested-images columns-6 ft-partner-logos"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/giz.png' ) ); ?>" alt="GIZ"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/rabobank.png' ) ); ?>" alt="Rabobank"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/cgiar.png' ) ); ?>" alt="CGIAR"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/fao.png' ) ); ?>" alt="FAO"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/catie.png' ) ); ?>" alt="CATIE"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/helvetas.png' ) ); ?>" alt="Helvetas"/></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->

<!-- wp:columns {"align":"wide","className":"ft-trust-quotes","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60"}}}} -->
<div class="wp-block-columns alignwide ft-trust-quotes"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:quote {"className":"ft-trust-quote"} -->
<blockquote class="wp-block-quote ft-trust-quote"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">The FarmTree Tool and team helped us understand the value of different agroforestry systems and the potential for increased revenue over a few decades</p>
<!-- /wp:paragraph --><cite>Mona McCord, SAN</cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:quote {"className":"ft-trust-quote"} -->
<blockquote class="wp-block-quote ft-trust-quote"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue</p>
<!-- /wp:paragraph --><cite>Mathijs de Bruin, TreeScape</cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","anchor":"proof","metadata":{"name":"Proof Stories / Themes"},"align":"full","className":"ft-home-section ft-home-proof","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-ivory","layout":{"type":"constrained"}} -->
<section id="proof" class="wp-block-group alignfull ft-home-section ft-home-proof has-farmtree-ivory-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Proof Stories</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">See what better agroforestry decisions look like</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">Four themes grounded in FarmTree project experience</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"align":"wide","className":"ft-proof-grid"} -->
<div class="wp-block-columns alignwide ft-proof-grid"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/proof-carbon.webp' ) ); ?>" alt="Project team reviewing carbon planning information"/></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 01</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Carbon planning</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Turn field assumptions into consistent carbon projections across project scenarios</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/proof-farm-value.webp' ) ); ?>" alt="Agroforestry project stakeholders comparing farm value options in the field"/></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 02</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Farm value modelling</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Compare costs, benefits and projected returns across different farm and project options</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/proof-cocoa.webp' ) ); ?>" alt="Cocoa agroforestry landscape under changing weather conditions"/></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 03</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Cocoa scenario planning and monitoring</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Compare shade-tree systems, species mixes and long-term landscape scenarios</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/proof-water.webp' ) ); ?>" alt="Project partners working together in an agroforestry landscape"/></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 04</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Water and landscape resilience monitoring</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Connect water balance and ecosystem indicators to long-term monitoring and investment decisions</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","anchor":"faq","metadata":{"name":"Frequently asked questions"},"align":"full","className":"ft-home-section ft-home-faq","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<section id="faq" class="wp-block-group alignfull ft-home-section ft-home-faq has-white-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"width":"34%"} -->
<div class="wp-block-column" style="flex-basis:34%"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">FAQ</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Questions about FarmTree modelling</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Common questions about the model, Platform and planning process</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"66%","className":"ft-faq-list"} -->
<div class="wp-block-column ft-faq-list" style="flex-basis:66%"><!-- wp:details {"showContent":true} -->
<details class="wp-block-details" open><summary>What does FarmTree model?</summary><!-- wp:paragraph -->
<p>FarmTree connects production, carbon, hydrology, soil fertility, labour and economics in one science-based model</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Can FarmTree support investment planning?</summary><!-- wp:paragraph -->
<p>Yes. Project teams can turn site data and species assumptions into comparable scenarios and structured investment plans</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>How far ahead can FarmTree project?</summary><!-- wp:paragraph -->
<p>FarmTree supports projections of up to 50 years for long-term planning, investment cases and project monitoring</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>How do we request a demo?</summary><!-- wp:paragraph -->
<p>Request a demo and the FarmTree team will follow up to discuss your project context, scope and reporting needs</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"News and Insights"},"align":"full","className":"ft-home-section ft-home-news","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-news has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:group {"align":"wide","className":"ft-home-news-header","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group alignwide ft-home-news-header"><!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">News &amp; Insights</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Latest from FarmTree</h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size"><a href="/blog/">View all insights</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":2,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"align":"wide","className":"ft-home-news-query"} -->
<div class="wp-block-query alignwide ft-home-news-query"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"ft-news-item","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-news-item"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->

<!-- wp:post-date {"fontSize":"caption"} /-->

<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"lead"} /-->

<!-- wp:post-excerpt {"moreText":"Read insight","excerptLength":18,"fontSize":"small"} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No insights have been published yet</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query --></section>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"farmtree-native/call-to-action"} /--></div>
<!-- /wp:group -->
