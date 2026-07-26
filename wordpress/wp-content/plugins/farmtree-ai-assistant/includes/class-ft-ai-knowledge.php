<?php
/**
 * Knowledge repository: CRUD over the knowledge table. Two source types:
 * 'link' (scanned server-side) and 'text' (manual). All writes are sanitized.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Knowledge
{
    private static function table(): string
    {
        return FT_AI_Activator::table_knowledge();
    }

    /**
     * @return array<int,object> Knowledge rows (most recent first).
     */
    public static function all(): array
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- table name is internal, no user input.
        return $wpdb->get_results("SELECT * FROM {$t} ORDER BY updated_at DESC, id DESC") ?: [];
    }

    /**
     * @return array<int,object> Only enabled rows.
     */
    public static function enabled(): array
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        return $wpdb->get_results("SELECT * FROM {$t} WHERE status = 'enabled' ORDER BY updated_at DESC") ?: [];
    }

    public static function get(int $id): ?object
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$t} WHERE id = %d", $id));
        return $row ?: null;
    }

    public static function count_enabled(): int
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE status = 'enabled'");
    }

    public static function last_updated(): ?string
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        $v = $wpdb->get_var("SELECT MAX(updated_at) FROM {$t}");
        return ($v && $v !== '0000-00-00 00:00:00') ? $v : null;
    }

    /**
     * Insert a knowledge source. Content is sanitized as multiline text.
     *
     * @param array $data title,type,url,content,status
     * @return int Inserted id (0 on failure).
     */
    public static function create(array $data): int
    {
        global $wpdb;
        $now = current_time('mysql');
        $row = self::sanitize($data);
        $row['created_at'] = $now;
        $row['updated_at'] = $now;
        $ok = $wpdb->insert(self::table(), $row, ['%s', '%s', '%s', '%s', '%s', '%s', '%s']);
        return $ok ? (int) $wpdb->insert_id : 0;
    }

    public static function update(int $id, array $data): bool
    {
        global $wpdb;
        $row = self::sanitize($data);
        $row['updated_at'] = current_time('mysql');
        return false !== $wpdb->update(self::table(), $row, ['id' => $id]);
    }

    public static function set_status(int $id, string $status): bool
    {
        global $wpdb;
        $status = ($status === 'enabled') ? 'enabled' : 'disabled';
        return false !== $wpdb->update(
            self::table(),
            ['status' => $status, 'updated_at' => current_time('mysql')],
            ['id' => $id],
            ['%s', '%s'],
            ['%d']
        );
    }

    public static function delete(int $id): bool
    {
        global $wpdb;
        return false !== $wpdb->delete(self::table(), ['id' => $id], ['%d']);
    }

    /**
     * Sanitize a knowledge row for storage.
     */
    private static function sanitize(array $data): array
    {
        $type = (isset($data['type']) && $data['type'] === 'link') ? 'link' : 'text';
        $status = (isset($data['status']) && $data['status'] === 'disabled') ? 'disabled' : 'enabled';
        $url = '';
        if ($type === 'link' && !empty($data['url'])) {
            $url = esc_url_raw((string) $data['url']);
        }
        return [
            'title'   => isset($data['title']) ? sanitize_text_field((string) $data['title']) : '',
            'type'    => $type,
            'url'     => $url,
            // Store readable text only; wp_kses to a very small tag set (none) prevents any markup/scripts.
            'content' => isset($data['content']) ? sanitize_textarea_field((string) $data['content']) : '',
            'status'  => $status,
        ];
    }
}
