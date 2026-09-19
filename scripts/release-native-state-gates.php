<?php
// Parse SELECT output without loading WordPress or exposing option values.
$values = [];
foreach (file('php://stdin', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    [$key, $hex] = explode("\t", $line, 2);
    $values[$key] = hex2bin($hex);
}
$decode = static fn($key) => @unserialize($values[$key] ?? '', ['allowed_classes' => false]);
$plugins = $decode('active_plugins');
$seedprod = $decode('seedprod_settings');
if (!is_array($seedprod)) $seedprod = json_decode(is_string($seedprod) ? $seedprod : ($values['seedprod_settings'] ?? ''), true);
$ai = $decode('ft_ai_settings');
$valid = ($values['stylesheet'] ?? '') === 'farmtree-native'
    && ($values['template'] ?? '') === 'farmtree-native'
    && ($values['blog_public'] ?? '') === '1'
    && ($values['show_on_front'] ?? '') === 'page'
    && ctype_digit($values['page_on_front'] ?? '')
    && is_array($plugins) && in_array('farmtree-content/farmtree-content.php', $plugins, true)
    && is_array($seedprod) && array_key_exists('enable_coming_soon_mode', $seedprod)
    && empty($seedprod['enable_coming_soon_mode'])
    && empty($seedprod['enable_maintenance_mode'])
    && is_array($ai) && array_key_exists('enabled', $ai) && empty($ai['enabled']);
if (!$valid) { fwrite(STDERR, "PUBLIC_STATE_GATE_FAILED\n"); exit(1); }
echo "PUBLIC_STATE_GATES_PASS\n";
