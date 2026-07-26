<?php
/**
 * Activation / deactivation: schema (dbDelta) + seed disabled draft skills.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Activator
{
    /** Option name storing the installed schema version. */
    const DB_VERSION_OPTION = 'ft_ai_db_version';

    public static function table_knowledge(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'ft_ai_knowledge';
    }
    public static function table_skills(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'ft_ai_skills';
    }
    public static function table_conversations(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'ft_ai_conversations';
    }
    public static function table_messages(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'ft_ai_messages';
    }

    /**
     * Create/upgrade tables via dbDelta and seed example skills once.
     */
    public static function activate(): void
    {
        self::install_schema();
        FT_AI_Skills::maybe_seed_examples();
        update_option(self::DB_VERSION_OPTION, FARMTREE_AI_DB_VERSION);
        flush_rewrite_rules();
    }

    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }

    /**
     * Idempotent schema install/upgrade. Safe to call on every activation.
     */
    public static function install_schema(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();

        $knowledge = self::table_knowledge();
        $skills    = self::table_skills();
        $conv      = self::table_conversations();
        $msg       = self::table_messages();

        $sql = [];

        $sql[] = "CREATE TABLE {$knowledge} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL DEFAULT '',
            type VARCHAR(20) NOT NULL DEFAULT 'text',
            url TEXT NULL,
            content LONGTEXT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'enabled',
            created_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
            updated_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
            PRIMARY KEY  (id),
            KEY status (status),
            KEY type (type)
        ) {$charset};";

        $sql[] = "CREATE TABLE {$skills} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            name VARCHAR(191) NOT NULL DEFAULT '',
            description TEXT NULL,
            triggers TEXT NULL,
            instruction LONGTEXT NULL,
            priority INT NOT NULL DEFAULT 10,
            status VARCHAR(20) NOT NULL DEFAULT 'disabled',
            cta_label VARCHAR(191) NULL,
            cta_url TEXT NULL,
            created_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
            updated_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
            PRIMARY KEY  (id),
            KEY status (status),
            KEY priority (priority)
        ) {$charset};";

        $sql[] = "CREATE TABLE {$conv} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            session_id VARCHAR(64) NOT NULL DEFAULT '',
            ip_hash VARCHAR(64) NOT NULL DEFAULT '',
            message_count INT NOT NULL DEFAULT 0,
            started_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
            updated_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
            PRIMARY KEY  (id),
            KEY session_id (session_id)
        ) {$charset};";

        $sql[] = "CREATE TABLE {$msg} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            conversation_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            role VARCHAR(20) NOT NULL DEFAULT 'user',
            content MEDIUMTEXT NULL,
            created_at DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
            PRIMARY KEY  (id),
            KEY conversation_id (conversation_id)
        ) {$charset};";

        foreach ($sql as $statement) {
            dbDelta($statement);
        }
    }

    /**
     * Ensure schema is current on load (e.g. after a plugin file update
     * without re-activation).
     */
    public static function maybe_upgrade(): void
    {
        if (get_option(self::DB_VERSION_OPTION) !== FARMTREE_AI_DB_VERSION) {
            self::install_schema();
            update_option(self::DB_VERSION_OPTION, FARMTREE_AI_DB_VERSION);
        }
    }
}
