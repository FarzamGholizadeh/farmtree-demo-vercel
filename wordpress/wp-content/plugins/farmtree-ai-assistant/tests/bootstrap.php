<?php
/**
 * PHPUnit bootstrap for the WordPress test suite.
 *
 * Set WP_TESTS_DIR to your wordpress-tests-lib checkout, then run `phpunit`
 * from the plugin directory. Example:
 *   WP_TESTS_DIR=/tmp/wordpress-tests-lib phpunit
 *
 * @package FarmTree_AI_Assistant
 */

$tests_dir = getenv('WP_TESTS_DIR') ?: '/tmp/wordpress-tests-lib';

require_once $tests_dir . '/includes/functions.php';

tests_add_filter('muplugins_loaded', static function (): void {
    require dirname(__DIR__) . '/farmtree-ai-assistant.php';
    // Ensure custom tables exist for the test database.
    FT_AI_Activator::install_schema();
});

require $tests_dir . '/includes/bootstrap.php';
