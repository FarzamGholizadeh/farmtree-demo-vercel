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
<div class="wp-block-group ft-native-home"><!-- wp:group {"tagName":"section","metadata":{"name":"FarmTree Hero"},"align":"full","className":"ft-home-hero","style":{"dimensions":{"minHeight":"780px"},"spacing":{"padding":{"top":"var:preset|spacing|80","right":"var:preset|spacing|50","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50"}}},"backgroundColor":"farmtree-forest","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-hero has-farmtree-forest-background-color has-background" style="min-height:780px;padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)"><!-- wp:group {"metadata":{"name":"Editable Hero images"},"className":"ft-home-hero-media","layout":{"type":"default"}} -->
<div class="wp-block-group ft-home-hero-media"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide is-active"} -->
<figure class="wp-block-image size-full ft-home-hero-slide is-active"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/hero-field-planning-v1.jpg' ) ); ?>" alt="Illustrative field team reviewing an agroforestry plan and monitoring tools"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide"} -->
<figure class="wp-block-image size-full ft-home-hero-slide"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/proof-carbon.webp' ) ); ?>" alt="Three people reviewing information on a laptop"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide"} -->
<figure class="wp-block-image size-full ft-home-hero-slide"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/hero-project-teams.webp' ) ); ?>" alt="Four people discussing crops in a field"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide"} -->
<figure class="wp-block-image size-full ft-home-hero-slide"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/hero-impact-reporting-v2.jpg' ) ); ?>" alt="Agroforestry field team measuring a tree and reviewing monitoring information"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:group {"align":"wide","className":"ft-home-hero-content","layout":{"type":"constrained","justifyContent":"center"}} -->
<div class="wp-block-group alignwide ft-home-hero-content"><!-- wp:group {"metadata":{"name":"Editable primary Hero message"},"className":"ft-home-hero-current","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-current"><!-- wp:paragraph {"className":"ft-native-eyebrow ft-home-hero-current-kicker","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow ft-home-hero-current-kicker has-farmtree-gold-color has-text-color has-small-font-size">Agroforestry Intelligence</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"ft-home-hero-current-heading","textColor":"white","fontSize":"heading"} -->
<h1 class="wp-block-heading ft-home-hero-current-heading has-white-color has-text-color has-heading-font-size">Make agroforestry measurable, investable and scalable</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"ft-home-hero-current-text","textColor":"white","fontSize":"lead"} -->
<p class="ft-home-hero-current-text has-white-color has-text-color has-lead-font-size">FarmTree helps organisations turn agroforestry complexity into clearer project intelligence for planning, reporting and investment decisions</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Editable alternate Hero messages"},"className":"ft-home-hero-copy-sources","layout":{"type":"default"}} -->
<div class="wp-block-group ft-home-hero-copy-sources"><!-- wp:group {"className":"ft-home-hero-copy-source","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-copy-source"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Science-Based Modelling</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Turn field data into investment scenarios</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"white","fontSize":"lead"} -->
<p class="has-white-color has-text-color has-lead-font-size">Connect climate, soil, species and project assumptions into clear science-backed projections</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"ft-home-hero-copy-source","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-copy-source"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Project Teams</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Support project staff with clearer planning tools</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"white","fontSize":"lead"} -->
<p class="has-white-color has-text-color has-lead-font-size">Help project staff compare agroforestry options, understand trade-offs and communicate value with confidence</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"ft-home-hero-copy-source","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-copy-source"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Impact Reporting</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Report carbon, farmer value and long-term performance</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"white","fontSize":"lead"} -->
<p class="has-white-color has-text-color has-lead-font-size">Translate project results into clear reporting for investors, donors, MRV partners and programme teams</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:buttons {"className":"ft-home-hero-actions","layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons ft-home-hero-actions"><!-- wp:button {"backgroundColor":"farmtree-gold","textColor":"farmtree-ink"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-farmtree-ink-color has-farmtree-gold-background-color has-text-color has-background wp-element-button" href="https://tool.farmtree.earth/Identity/Account/Register" target="_blank" rel="noreferrer noopener">Request a demo ↗</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline ft-native-quotation-action","textColor":"white"} -->
<div class="wp-block-button is-style-outline ft-native-quotation-action"><a class="wp-block-button__link has-white-color has-text-color wp-element-button" href="mailto:info@farmtree.earth?subject=FarmTree%20quotation%20request">Ask for a quotation ↗</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->

<!-- wp:html -->
<div class="ft-home-hero-controls">
<button class="ft-home-hero-arrow ft-home-hero-arrow-prev" type="button" aria-label="Previous hero slide" data-ft-hero-prev>‹</button>
<div class="ft-home-hero-dots" role="group" aria-label="Choose hero slide">
<button class="ft-home-hero-dot is-active" type="button" aria-label="Project workshop" aria-pressed="true" data-ft-hero-dot></button>
<button class="ft-home-hero-dot" type="button" aria-label="Carbon planning" aria-pressed="false" data-ft-hero-dot></button>
<button class="ft-home-hero-dot" type="button" aria-label="Project Teams" aria-pressed="false" data-ft-hero-dot></button>
<button class="ft-home-hero-dot" type="button" aria-label="Impact Reporting" aria-pressed="false" data-ft-hero-dot></button>
</div>
<button class="ft-home-hero-arrow ft-home-hero-arrow-next" type="button" aria-label="Next hero slide" data-ft-hero-next>›</button>
<p class="screen-reader-text" aria-live="polite" data-ft-hero-status>Project workshop: Make agroforestry measurable, investable and scalable, slide 1 of 4</p>
</div>
<!-- /wp:html --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","anchor":"platform","metadata":{"name":"Platform / planning value"},"align":"full","className":"ft-home-section ft-home-platform","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section id="platform" class="wp-block-group alignfull ft-home-section ft-home-platform has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","verticalAlignment":"center","className":"ft-platform-layout","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center ft-platform-layout"><!-- wp:column {"verticalAlignment":"center","width":"42%","className":"ft-platform-copy"} -->
<div class="wp-block-column is-vertically-aligned-center ft-platform-copy" style="flex-basis:42%"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
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

<!-- wp:column {"verticalAlignment":"center","width":"58%","className":"ft-platform-media"} -->
<div class="wp-block-column is-vertically-aligned-center ft-platform-media" style="flex-basis:58%"><!-- wp:group {"metadata":{"name":"Editable FarmTree Platform media"},"className":"ft-platform-visual","layout":{"type":"default"}} -->
<div class="wp-block-group ft-platform-visual"><!-- wp:html -->
<div class="ft-platform-device" role="group" aria-label="FarmTree Platform shown in a laptop">
<div class="ft-platform-device-lid">
<span class="ft-platform-device-camera" aria-hidden="true"></span>
<div class="ft-platform-device-screen">
<picture class="ft-platform-screen ft-platform-gif">
<source media="(prefers-reduced-motion: reduce)" srcset="<?php echo esc_url( get_theme_file_uri( 'assets/media/final-tools-review-11s-to-40s-poster.png' ) ); ?>">
<img src="<?php echo esc_url( get_theme_file_uri( 'assets/media/final-tools-review-11s-to-40s-2x.gif' ) ); ?>" width="960" height="540" loading="lazy" decoding="async" alt="FarmTree Platform workflow moving from portfolio selection through plot configuration and modelling tools"/>
</picture>
</div>
</div>
<div class="ft-platform-device-base" aria-hidden="true"><span></span></div>
</div>
<!-- /wp:html -->

<!-- wp:paragraph {"className":"ft-home-media-caption","fontSize":"caption"} -->
<p class="ft-home-media-caption has-caption-font-size">The approved FarmTree Platform workflow</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Technology / how FarmTree works"},"align":"full","className":"ft-home-section ft-home-technology","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-technology has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
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

<!-- wp:group {"align":"wide","className":"ft-technology-story","layout":{"type":"default"}} -->
<div class="wp-block-group alignwide ft-technology-story"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-technology-model"} -->
<figure class="wp-block-image size-full ft-technology-model"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/technology-model.webp' ) ); ?>" alt="FarmTree model connecting site, climate, soil and species information to impact monitoring and future projections"/></figure>
<!-- /wp:image -->

</div>
<!-- /wp:group -->

<!-- wp:columns {"align":"wide","className":"ft-home-inputs"} -->
<div class="wp-block-columns alignwide ft-home-inputs"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">01</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Site information</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Define location, inventory and management baseline</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">02</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Climate, soil and terrain</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Connect local conditions, opportunities and risk</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">03</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Species database</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Add growth, yield, interaction and price data</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">04</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Plan, monitor and report</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Compare time-based business and impact projections</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Verified FarmTree metrics"},"align":"full","className":"ft-home-section ft-home-metrics","backgroundColor":"farmtree-forest","textColor":"white","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-metrics has-white-color has-farmtree-forest-background-color has-text-color has-background"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Track record</p>
<!-- /wp:paragraph --><!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-small-font-size">Agroforestry intelligence in active use</h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->
<!-- wp:columns {"align":"wide","className":"ft-metric-grid"} -->
<div class="wp-block-columns alignwide ft-metric-grid"><!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+100</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Active FarmTree Tool users</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+30</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Projects</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+40</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Agricultural regions impacted</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+1,000,000</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Farmers indirectly reached</p><!-- /wp:paragraph --></div><!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Global FarmTree perspective"},"align":"full","className":"ft-home-section ft-home-globe","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-ivory","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-globe has-farmtree-ivory-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","verticalAlignment":"center","className":"ft-globe-layout"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center ft-globe-layout"><!-- wp:column {"verticalAlignment":"center","width":"40%","className":"ft-globe-copy"} -->
<div class="wp-block-column is-vertically-aligned-center ft-globe-copy" style="flex-basis:40%"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Global perspective</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Agroforestry decisions across diverse landscapes</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree supports scenario thinking across tropical, temperate, dryland and highland contexts. The markers illustrate landscape contexts, not claimed project locations.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"ft-globe-instruction","fontSize":"small"} -->
<p class="ft-globe-instruction has-small-font-size">Drag in any direction or use the arrow keys to explore.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"60%","className":"ft-globe-media"} -->
<div class="wp-block-column is-vertically-aligned-center ft-globe-media" style="flex-basis:60%"><!-- wp:html -->
<div class="ft-globe-stage" data-ft-globe-shell data-ft-earth-texture="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/earth-blue-marble-nasa-2048.jpg' ) ); ?>">
<canvas class="ft-globe-canvas" width="720" height="720" tabindex="0" role="img" aria-label="Interactive realistic Earth with illustrative landscape-context connections" aria-describedby="ft-globe-description" data-ft-globe></canvas>
<p id="ft-globe-description" class="screen-reader-text">A realistic Earth rotates slowly. Orange markers and animated connection routes illustrate tropical, temperate, dryland and highland landscape contexts; they do not identify FarmTree project locations.</p>
<noscript><p>The interactive landscape-context globe requires JavaScript. The section text remains available without it.</p></noscript>
</div>
<!-- /wp:html --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Trust / references / testimonials"},"align":"full","className":"ft-home-section ft-home-trust","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-mist","textColor":"farmtree-ink","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-trust has-farmtree-ink-color has-farmtree-mist-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Trust and references</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"farmtree-ink","fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-farmtree-ink-color has-text-color has-heading-small-font-size">Built with organisations working across agroforestry and climate</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"farmtree-green","fontSize":"lead"} -->
<p class="has-farmtree-green-color has-text-color has-lead-font-size">Selected references and approved perspectives from teams using FarmTree in practice</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:gallery {"columns":6,"imageCrop":false,"linkTo":"none","align":"wide","className":"ft-partner-logos"} -->
<figure class="wp-block-gallery alignwide has-nested-images columns-6 ft-partner-logos"><!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="GIZ reference context"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/giz.png' ) ); ?>" alt="GIZ"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="Rabobank reference context"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/rabobank.png' ) ); ?>" alt="Rabobank"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="CGIAR reference context"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/cgiar.png' ) ); ?>" alt="CGIAR"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="FAO reference context"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/fao.png' ) ); ?>" alt="FAO"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="CATIE reference context"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/catie.png' ) ); ?>" alt="CATIE"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="Helvetas reference context"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/partners/helvetas.png' ) ); ?>" alt="Helvetas"/></a></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->

<!-- wp:group {"align":"full","className":"ft-testimonial-marquee","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull ft-testimonial-marquee"><!-- wp:group {"metadata":{"name":"Approved-theme testimonial quotes"},"className":"ft-testimonial-cards","layout":{"type":"default"}} -->
<div class="wp-block-group ft-testimonial-cards"><!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">The FarmTree Tool and team helped us understand the value of different agroforestry systems and the potential for increased revenue over a few decades.</p>
<!-- /wp:paragraph --><cite><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/testimonials/generated-placeholders/portrait-01.jpg' ) ); ?>" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Mona McCord"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Mona McCord <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · SAN</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue. They do everything!</p>
<!-- /wp:paragraph --><cite><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/testimonials/generated-placeholders/portrait-02.jpg' ) ); ?>" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Mathijs de Bruin"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Mathijs de Bruin <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · TreeScape</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree provides a remarkable level of detail that helps us truly understand why coffee agroforestry systems perform the way they do.</p>
<!-- /wp:paragraph --><cite><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/testimonials/generated-placeholders/portrait-03.jpg' ) ); ?>" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Katharina Lima de Miranda"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Katharina Lima de Miranda <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · HRNS</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">We know very little of agroforestry options for a particular local context. The FarmTree tool is super helpful to generate location-specific scenarios!</p>
<!-- /wp:paragraph --><cite><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/testimonials/generated-placeholders/portrait-04.jpg' ) ); ?>" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Rob Kelly"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Rob Kelly <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · World Vision Australia</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">We found the FarmTree Tool essential for predicting outcomes of highly complex farm scenarios, among many, also agroforestry systems.</p>
<!-- /wp:paragraph --><cite><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/testimonials/generated-placeholders/portrait-05.jpg' ) ); ?>" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Lorenzo Mento"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Lorenzo Mento <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · Nectaerra</span></span></cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></section>
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
<figure class="wp-block-image size-full"><picture><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/proof/proof-carbon-documentary-v2.jpg' ) ); ?>" width="1122" height="1402" loading="lazy" decoding="async" alt="Field team measuring a mature tree and recording observations in an agroforestry landscape"/></picture></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 01</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Carbon</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Turn field assumptions into consistent carbon projections across project scenarios</p>
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/carbon-planning/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><picture><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/proof/proof-farm-value-documentary-v2.jpg' ) ); ?>" width="1122" height="1402" loading="lazy" decoding="async" alt="Farmer and adviser reviewing scenario materials at a farm-office table"/></picture></figure>
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
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/farm-value-modelling/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><picture><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/proof/proof-cocoa-documentary-v2.jpg' ) ); ?>" width="1122" height="1402" loading="lazy" decoding="async" alt="Cocoa field team inspecting pods and recording observations beneath shade trees"/></picture></figure>
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
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/cocoa-scenario-planning/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><picture><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/proof/proof-water-documentary-v2.jpg' ) ); ?>" width="1122" height="1402" loading="lazy" decoding="async" alt="Field team examining soil and recording water observations beside a stream"/></picture></figure>
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
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/water-landscape-resilience/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"News and Insights"},"align":"full","className":"ft-home-section ft-home-news","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-news has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:group {"align":"wide","className":"ft-home-news-header","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group alignwide ft-home-news-header"><!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Last News</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Latest from FarmTree</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"ft-home-news-tagline","fontSize":"lead"} -->
<p class="ft-home-news-tagline has-lead-font-size">Updates on the science, policy and practice shaping better agroforestry decisions.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":2,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"align":"wide","className":"ft-home-news-query"} -->
<div class="wp-block-query alignwide ft-home-news-query"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"ft-news-item","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-news-item"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->

<!-- wp:post-terms {"term":"category","fontSize":"caption"} /-->

<!-- wp:post-date {"fontSize":"caption"} /-->

<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"lead"} /-->

<!-- wp:post-excerpt {"moreText":"","excerptLength":18,"fontSize":"small"} /-->

<!-- wp:read-more {"content":"Read article ↗","className":"ft-news-read-more"} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No insights have been published yet</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query -->

<!-- wp:buttons {"align":"wide","className":"ft-home-news-more","layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons alignwide ft-home-news-more"><!-- wp:button {"backgroundColor":"farmtree-green","textColor":"white"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-white-color has-farmtree-green-background-color has-text-color has-background wp-element-button" href="/blog/">Read more</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","anchor":"faq","metadata":{"name":"Frequently asked questions"},"align":"full","className":"ft-home-section ft-home-faq","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section id="faq" class="wp-block-group alignfull ft-home-section ft-home-faq has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","className":"ft-faq-layout","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide ft-faq-layout"><!-- wp:column {"width":"34%"} -->
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
<details class="wp-block-details"><summary>What information is needed to get started?</summary><!-- wp:paragraph -->
<p>The starting point depends on the project, but typically combines a location and site baseline with species, management and economic assumptions. The FarmTree team can help identify the appropriate inputs</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Are FarmTree results measurements or projections?</summary><!-- wp:paragraph -->
<p>FarmTree produces modelled projections from the inputs and assumptions supplied. They should be interpreted alongside measured field data and the documented scenario context</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Can FarmTree compare different project scenarios?</summary><!-- wp:paragraph -->
<p>Yes. Teams can compare species mixes, management choices and other project assumptions to understand potential trade-offs before selecting a plan</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Can FarmTree connect with other reporting systems?</summary><!-- wp:paragraph -->
<p>Data exchange and reporting options depend on the required workflow and system. Discuss the intended integration and data format with the FarmTree team during scoping</p>
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

<!-- wp:pattern {"slug":"farmtree-native/call-to-action"} /--></div>
<!-- /wp:group -->
