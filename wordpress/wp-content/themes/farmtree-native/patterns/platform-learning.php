<?php
/**
 * Title: FarmTree Platform learning library
 * Slug: farmtree-native/platform-learning
 * Categories: featured
 * Inserter: false
 */
$lessons = json_decode(file_get_contents(__DIR__ . '/../inc/platform-videos.json'), true);
?>
<!-- wp:group {"className":"ft-learning-hero","layout":{"type":"default"}} -->
<div class="wp-block-group ft-learning-hero">
<!-- wp:paragraph {"className":"ft-learning-eyebrow"} --><p class="ft-learning-eyebrow">PLATFORM LEARNING</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":1} --><h1 class="wp-block-heading">FarmTree Platform Videos</h1><!-- /wp:heading -->
<!-- wp:paragraph --><p>Learn the FarmTree Platform through practical video walkthroughs, from setting up scenarios to comparing results and working with project data.</p><!-- /wp:paragraph -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline"} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="https://www.youtube.com/@farmtree8168" target="_blank" rel="noopener noreferrer">View on YouTube ↗</a></div><!-- /wp:button --></div><!-- /wp:buttons -->
</div><!-- /wp:group -->
<!-- wp:group {"anchor":"platform-classroom","className":"ft-learning-classroom","layout":{"type":"default"}} -->
<div id="platform-classroom" class="wp-block-group ft-learning-classroom"><!-- wp:paragraph --><p>Choose a lesson below to watch on YouTube. With JavaScript enabled, you can also load the video here.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:group {"className":"ft-learning-overview","layout":{"type":"default"}} -->
<div class="wp-block-group ft-learning-overview">
<!-- wp:heading --><h2 class="wp-block-heading">Explore all Platform videos</h2><!-- /wp:heading -->
<!-- wp:paragraph --><p>Start with the Platform overview, explore planning workflows or go deeper into individual modelling topics. Earlier walkthroughs may show an older interface.</p><!-- /wp:paragraph -->
<!-- wp:group {"className":"ft-learning-grid","layout":{"type":"default"}} -->
<div class="wp-block-group ft-learning-grid">
<?php foreach ($lessons as $lesson) : ?>
<!-- wp:group {"className":"ft-learning-card","layout":{"type":"default"}} -->
<div class="wp-block-group ft-learning-card">
<!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="<?php echo esc_url(get_theme_file_uri($lesson['poster'])); ?>" alt="<?php echo esc_attr('Video thumbnail: ' . $lesson['title']); ?>" /></figure><!-- /wp:image -->
<!-- wp:paragraph {"className":"ft-learning-module"} --><p class="ft-learning-module"><?php echo esc_html($lesson['module']); ?></p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading"><?php echo esc_html($lesson['title']); ?></h3><!-- /wp:heading -->
<!-- wp:paragraph {"className":"ft-learning-description"} --><p class="ft-learning-description"><?php echo esc_html($lesson['description']); ?></p><!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"ft-learning-duration"} --><p class="ft-learning-duration"><?php echo esc_html($lesson['duration']); ?></p><!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"ft-learning-youtube"} --><p class="ft-learning-youtube"><a href="<?php echo esc_url($lesson['url']); ?>" target="_blank" rel="noopener noreferrer">Play Video</a></p><!-- /wp:paragraph -->
</div><!-- /wp:group -->
<?php endforeach; ?>
</div><!-- /wp:group -->
<!-- wp:paragraph {"className":"ft-learning-channel"} --><p class="ft-learning-channel"><a href="https://www.youtube.com/@farmtree8168" target="_blank" rel="noopener noreferrer">Visit FarmTree on YouTube ↗</a></p><!-- /wp:paragraph -->
</div><!-- /wp:group -->
