<?php
/** Off-webroot WP-CLI eval-file adapter; never installed in the webroot. */
if (!defined('WP_CLI') || !WP_CLI || true !== ($GLOBALS['farmtree_cron_diagnostics_active'] ?? false)) {
    throw new RuntimeException('A pre-bootstrap diagnostic window is mandatory.');
}
if (class_exists('FarmTree_Content_Reconciler', false) || count($args) < 3) {
    throw new RuntimeException('Use only the staged audited plugin with the installed Content plugin skipped for this CLI process.');
}
[$stage, $sha, $mode] = $args;
if (($mode === 'dry-run' && count($args) !== 3) || ($mode === 'apply' && count($args) !== 5)) {
    throw new RuntimeException('Unexpected guarded operation arguments.');
}
$stage = realpath($stage);
$root = realpath(ABSPATH);
if (!$stage || !$root || str_starts_with($stage . '/', $root . '/')
    || !preg_match('/^[a-f0-9]{40}$/D', $sha) || !in_array($mode, ['dry-run', 'apply'], true)
    || !is_file($stage . '/wp-content/plugins/farmtree-content/farmtree-content.php')
    || !is_file($stage . '/wp-content/themes/farmtree-native/style.css')) {
    throw new RuntimeException('Invalid off-webroot audited runtime.');
}
// theme_root receives only the root path, not the stylesheet identity. This
// process-only filter makes the candidate's source assets available to planning;
// theme_root_uri stays unchanged so public URLs never expose recovery paths.
add_filter('theme_root', static fn ($path) => $stage . '/wp-content/themes', PHP_INT_MAX);
require $stage . '/wp-content/plugins/farmtree-content/farmtree-content.php';
farmtree_content_register_customer_segments();
farmtree_content_register_proof_stories();
$options = [
    $mode => true, 'post-launch-news12' => true, 'expected-site' => 'https://farmtree.eu/',
    'expected-theme' => 'farmtree-native', 'source-commit' => $sha, 'format' => 'json',
];
if ($mode === 'apply') {
    if (count($args) !== 5) throw new RuntimeException('Reviewed plan and backup digests required.');
    $base = dirname($stage);
    require_once $base . '/news-release-evidence.php';
    global $wpdb;
    $unsafeEngines = $wpdb->get_var("SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_TYPE='BASE TABLE' AND (ENGINE IS NULL OR UPPER(ENGINE)<>'INNODB')");
    if ($wpdb->last_error !== '' || (string) $unsafeEngines !== '0') throw new RuntimeException('Every database table must be InnoDB for the guarded rollback contract.');
    $GLOBALS['farmtree_news_evidence_reader'] = static function (string $sql) use ($wpdb): array {
        $rows = $wpdb->get_results($sql, ARRAY_N);
        if ($wpdb->last_error !== '' || !is_array($rows)) throw new RuntimeException('Same-connection evidence SELECT failed');
        return array_map(static fn ($row) => implode("\t", array_map(static fn ($value) => $value === null ? 'NULL' : (string) $value, $row)), $rows);
    };
    $reviewed = news_read_json($base . '/op-dry-run/command.json');
    if (($reviewed['plan_digest'] ?? '') !== $args[3] || ($reviewed['source_commit'] ?? '') !== $sha) throw new RuntimeException('Precommit scope differs from reviewed plan');
    $baseline = news_read_json($base . '/op-apply/database-before.json');
    $runtimeBaseline = file($base . '/op-apply/runtime-before.sha256', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $checkRuntime = static function () use ($root, $runtimeBaseline): void {
        $current = [];
        foreach (['wp-content/themes', 'wp-content/plugins'] as $relative) {
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root . '/' . $relative, FilesystemIterator::SKIP_DOTS)) as $file) {
                if ($file->isLink()) throw new RuntimeException('Runtime symlink appeared during operation');
                if ($file->isFile()) $current[] = hash_file('sha256', $file->getPathname()) . '  ' . substr($file->getPathname(), strlen($root) + 1);
            }
        }
        sort($current, SORT_STRING);
        if ($current !== $runtimeBaseline) throw new RuntimeException('Runtime files changed during content operation');
    };
    // Detect bootstrap changes BEFORE entering any authorized content writes.
    news_compare($baseline, news_capture($wpdb->prefix, $reviewed), false);
    $checkRuntime();
    $GLOBALS['farmtree_news12_commit_guard'] = static function ($plan, $results) use ($wpdb, $baseline, $reviewed, $base, $checkRuntime): void {
        if (($plan['plan_digest'] ?? '') !== $reviewed['plan_digest']) throw new RuntimeException('Precommit reviewed digest changed');
        $verification = news_compare($baseline, news_capture($wpdb->prefix, $reviewed), true);
        $checkRuntime();
        $stream = fopen($base . '/op-apply/precommit-verification.json', 'x');
        if (!$stream || !chmod($base . '/op-apply/precommit-verification.json', 0600)) throw new RuntimeException('Could not reserve private precommit evidence');
        $json = json_encode($verification, JSON_THROW_ON_ERROR) . "\n";
        if (fwrite($stream, $json) !== strlen($json) || !fflush($stream)) { fclose($stream); throw new RuntimeException('Could not persist precommit evidence'); }
        fclose($stream);
    };
    $options += ['plan-digest' => $args[3], 'backup-digest' => $args[4],
        'confirmation' => 'CREATE TWELVE APPROVED FARMTREE NEWS ARTICLES',
        'publication-confirmation' => 'PRESERVE EXISTING PUBLICATION AND ROUTING',
        'protection-confirmation' => 'PUBLIC INDEXING ON AND COMING SOON OFF VERIFIED'];
}
(new FarmTree_Content_CLI_Command())->reconcile([], $options);
