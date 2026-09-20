<?php
/** Standalone stdin is HEX(serialized cron), not a WordPress bootstrap. */
require_once is_file(__DIR__ . '/lib/cron-diagnostics.php') ? __DIR__ . '/lib/cron-diagnostics.php' : __DIR__ . '/cron-diagnostics.php';
try {
    $hex = trim(stream_get_contents(STDIN));
    if ($hex === '' || strlen($hex) % 2 || !ctype_xdigit($hex)) { throw new RuntimeException('Invalid cron evidence'); }
    $snapshot = FarmTree_Cron_Diagnostics::decode(hex2bin($hex));
    $snapshot['hook_owner'] = 'unknown: standalone snapshot has no runtime callback registry';
    echo json_encode($snapshot, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . PHP_EOL;
} catch (Throwable $error) { fwrite(STDERR, "Cron snapshot failed; raw input suppressed.\n"); exit(1); }
