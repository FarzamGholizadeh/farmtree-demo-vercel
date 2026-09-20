<?php
/** Explicit WP-CLI --require only. No default runtime installation. */
if (PHP_SAPI !== 'cli' || !defined('WP_CLI') || !WP_CLI || function_exists('get_option')) {
    throw new RuntimeException('Cron diagnostics require an explicit pre-bootstrap CLI window');
}
require_once is_file(__DIR__ . '/lib/cron-diagnostics.php') ? __DIR__ . '/lib/cron-diagnostics.php' : __DIR__ . '/cron-diagnostics.php';
$ft_cron_root = realpath((string) getenv('FT_CRON_DIAGNOSTICS_ROOT'));
$ft_cron_file = (string) getenv('FT_CRON_DIAGNOSTICS_FILE');
$ft_cron_parent = realpath(dirname($ft_cron_file));
$ft_cron_stage_input = (string) getenv('FT_CRON_DIAGNOSTICS_STAGE');
$ft_cron_stage = $ft_cron_stage_input !== '' ? realpath($ft_cron_stage_input) : null;
if ($ft_cron_stage_input !== '' && (!$ft_cron_stage || $ft_cron_stage !== $ft_cron_stage_input
    || is_link($ft_cron_stage_input) || $ft_cron_stage === $ft_cron_root
    || strpos($ft_cron_stage . '/', $ft_cron_root . '/') === 0
    || !is_file($ft_cron_stage . '/wp-content/plugins/farmtree-content/farmtree-content.php')
    || is_link($ft_cron_stage . '/wp-content/plugins/farmtree-content/farmtree-content.php'))) {
    throw new RuntimeException('Cron diagnostic stage must be a verified off-webroot candidate');
}
if (!$ft_cron_root || !is_dir($ft_cron_root) || !is_file($ft_cron_root . '/wp-load.php') || !$ft_cron_parent
    || substr($ft_cron_file, 0, 1) !== '/' || dirname($ft_cron_file) !== $ft_cron_parent
    || $ft_cron_parent === $ft_cron_root || strpos($ft_cron_parent . '/', $ft_cron_root . '/') === 0
    || !preg_match('/^[A-Za-z0-9_.-]+$/D', basename($ft_cron_file))) {
    throw new RuntimeException('Cron diagnostics require a verified off-webroot destination');
}
$ft_cron_old_umask = umask(0077);
$ft_cron_stream = @fopen($ft_cron_file, 'x');
umask($ft_cron_old_umask);
if (!$ft_cron_stream || !chmod($ft_cron_file, 0600)) { throw new RuntimeException('Cannot reserve private cron diagnostics'); }
$ft_cron_count = 0;
$ft_cron_bytes = 0;
$ft_cron_sink = static function ($event) use ($ft_cron_stream, &$ft_cron_count, &$ft_cron_bytes) {
    $line = json_encode(array('observed_at_utc' => gmdate('c')) + $event, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n";
    if (++$ft_cron_count > 1000 || $ft_cron_bytes + strlen($line) > 8388608) {
        $marker = '{"type":"diagnostic_saturation","operation_must_stop":true}' . "\n";
        fwrite($ft_cron_stream, $marker); fflush($ft_cron_stream);
        throw new RuntimeException('Cron diagnostic capacity reached; stop guarded operation');
    }
    $ft_cron_bytes += strlen($line);
    if (fwrite($ft_cron_stream, $line) !== strlen($line) || !fflush($ft_cron_stream)) {
        throw new RuntimeException('Cron diagnostic write failed; stop guarded operation');
    }
};
$ft_cron_observer = new FarmTree_Cron_Diagnostics($ft_cron_sink, $ft_cron_root, $ft_cron_stage);
$ft_cron_sink(array('type' => 'window_start', 'version' => 1, 'pre_bootstrap' => true));
$ft_cron_observer->install();
$GLOBALS['farmtree_cron_diagnostics_active'] = true;
register_shutdown_function(static function () use ($ft_cron_observer, $ft_cron_sink, $ft_cron_stream) {
    $error = error_get_last();
    $ft_cron_observer->finish();
    $ft_cron_sink(array('type' => 'process_end', 'last_error_type' => $error ? $error['type'] : null));
    fclose($ft_cron_stream);
});
