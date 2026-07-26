<?php
/**
 * Conversation logging (optional). Only writes when the setting is enabled.
 * Stores a hashed IP (never the raw IP) and message text; no other PII.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Conversations
{
    public static function logging_enabled(): bool
    {
        return (int) FT_AI_Settings::get('conversation_logging') === 1;
    }

    public static function count_recent(int $days = 30): int
    {
        if (!self::logging_enabled()) {
            return 0;
        }
        global $wpdb;
        $t = FT_AI_Activator::table_conversations();
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$t} WHERE started_at >= %s",
            gmdate('Y-m-d H:i:s', time() - $days * DAY_IN_SECONDS)
        ));
    }

    /**
     * Record a user+assistant exchange for a session. Returns conversation id.
     */
    public static function log_exchange(string $session_id, string $ip_hash, string $user_msg, string $assistant_msg): int
    {
        if (!self::logging_enabled()) {
            return 0;
        }
        global $wpdb;
        $conv_t = FT_AI_Activator::table_conversations();
        $msg_t  = FT_AI_Activator::table_messages();
        $now = current_time('mysql');
        $session_id = substr(sanitize_text_field($session_id), 0, 64);

        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $conv = $wpdb->get_row($wpdb->prepare("SELECT id FROM {$conv_t} WHERE session_id = %s", $session_id));
        if ($conv) {
            $conv_id = (int) $conv->id;
            $wpdb->query($wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "UPDATE {$conv_t} SET message_count = message_count + 2, updated_at = %s WHERE id = %d",
                $now,
                $conv_id
            ));
        } else {
            $wpdb->insert($conv_t, [
                'session_id'    => $session_id,
                'ip_hash'       => substr($ip_hash, 0, 64),
                'message_count' => 2,
                'started_at'    => $now,
                'updated_at'    => $now,
            ]);
            $conv_id = (int) $wpdb->insert_id;
        }
        foreach ([['user', $user_msg], ['assistant', $assistant_msg]] as $m) {
            $wpdb->insert($msg_t, [
                'conversation_id' => $conv_id,
                'role'            => $m[0],
                'content'         => sanitize_textarea_field($m[1]),
                'created_at'      => $now,
            ]);
        }
        return $conv_id;
    }
}
