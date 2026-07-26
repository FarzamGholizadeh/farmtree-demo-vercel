<?php
/**
 * Uninstall routine. Data is preserved by default. It is removed ONLY when the
 * admin explicitly enabled "Delete all plugin data when the plugin is
 * uninstalled" in Settings. No secrets are involved (none are ever stored).
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

$settings = get_option('ft_ai_settings', []);
$remove = is_array($settings) && !empty($settings['remove_data_on_uninstall']);

if (!$remove) {
    return; // keep all data (default, safe)
}

global $wpdb;

// Drop custom tables.
$tables = [
    $wpdb->prefix . 'ft_ai_knowledge',
    $wpdb->prefix . 'ft_ai_skills',
    $wpdb->prefix . 'ft_ai_conversations',
    $wpdb->prefix . 'ft_ai_messages',
];
foreach ($tables as $t) {
    // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- internal table names, no user input.
    $wpdb->query("DROP TABLE IF EXISTS {$t}");
}

// Remove options.
delete_option('ft_ai_settings');
delete_option('ft_ai_behavior');
delete_option('ft_ai_db_version');

// Best-effort transient cleanup (per-user scan/test transients).
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_ft_ai_%' OR option_name LIKE '_transient_timeout_ft_ai_%'");
