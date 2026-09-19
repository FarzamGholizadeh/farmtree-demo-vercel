<?php
/**
 * Approved off-webroot CLI runner. Never deploy this script into the webroot.
 * wp --skip-plugins=farmtree-content eval-file <this-file> <plugin-root> <sha>
 *   dry-run | apply <reviewed-plan-digest> <verified-backup-digest>
 * The installed plugin remains active for all public requests.
 */
if (!defined('WP_CLI') || !WP_CLI || !defined('ABSPATH')) exit(1);
if (count($args) < 3 || !in_array($args[2], ['dry-run', 'apply'], true)) throw new RuntimeException('Explicit mode required.');
$candidate = realpath($args[0]);
$webroot = realpath(ABSPATH);
if (!$candidate || !$webroot || str_starts_with($candidate . '/', $webroot . '/')
    || basename($candidate) !== 'farmtree-content' || defined('FARMTREE_CONTENT_DIR')) {
    throw new RuntimeException('Require an off-webroot candidate and --skip-plugins=farmtree-content.');
}
if (!preg_match('/^[0-9a-f]{40}$/', $args[1])) throw new RuntimeException('Exact source SHA required.');
if (count($args) !== ($args[2] === 'apply' ? 5 : 3)) throw new RuntimeException('Unexpected arguments.');
require $candidate . '/farmtree-content.php';
farmtree_content_register_customer_segments();
farmtree_content_register_proof_stories();
$options = [
    $args[2] => true,
    'post-launch-editorial' => true,
    'source-commit' => $args[1],
    'expected-site' => 'https://farmtree.eu/',
    'expected-theme' => 'farmtree-native',
    'format' => 'json',
];
if ($args[2] === 'apply') {
    $options += [
        'plan-digest' => $args[3],
        'backup-digest' => $args[4],
        'confirmation' => 'APPLY APPROVED EDITORIAL DOCUMENTARY UPDATES',
        'publication-confirmation' => 'PRESERVE EXISTING PUBLICATION AND ROUTING',
        'protection-confirmation' => 'PUBLIC INDEXING ON AND COMING SOON OFF VERIFIED',
    ];
}
(new FarmTree_Content_CLI_Command())->reconcile([], $options);
