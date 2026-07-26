<?php
/**
 * Skills repository: CRUD over the skills table. Skills are data (not
 * hard-coded JS). Enabled skills drive the frontend quick-replies and can add
 * approved CTAs to answers.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Skills
{
    private static function table(): string
    {
        return FT_AI_Activator::table_skills();
    }

    public static function all(): array
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        return $wpdb->get_results("SELECT * FROM {$t} ORDER BY priority ASC, id ASC") ?: [];
    }

    public static function enabled(): array
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        return $wpdb->get_results("SELECT * FROM {$t} WHERE status = 'enabled' ORDER BY priority ASC, id ASC") ?: [];
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

    public static function count_all(): int
    {
        global $wpdb;
        $t = self::table();
        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM {$t}");
    }

    public static function create(array $data): int
    {
        global $wpdb;
        $now = current_time('mysql');
        $row = self::sanitize($data);
        $row['created_at'] = $now;
        $row['updated_at'] = $now;
        $ok = $wpdb->insert(self::table(), $row);
        return $ok ? (int) $wpdb->insert_id : 0;
    }

    public static function update(int $id, array $data): bool
    {
        global $wpdb;
        $row = self::sanitize($data);
        $row['updated_at'] = current_time('mysql');
        return false !== $wpdb->update(self::table(), $row, ['id' => $id]);
    }

    public static function duplicate(int $id): int
    {
        $src = self::get($id);
        if (!$src) {
            return 0;
        }
        return self::create([
            'name'        => $src->name . ' (copy)',
            'description' => $src->description,
            'triggers'    => $src->triggers,
            'instruction' => $src->instruction,
            'priority'    => (int) $src->priority,
            'status'      => 'disabled', // copies start disabled for review
            'cta_label'   => $src->cta_label,
            'cta_url'     => $src->cta_url,
        ]);
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

    public static function set_priority(int $id, int $priority): bool
    {
        global $wpdb;
        return false !== $wpdb->update(
            self::table(),
            ['priority' => max(0, min(999, $priority)), 'updated_at' => current_time('mysql')],
            ['id' => $id],
            ['%d', '%s'],
            ['%d']
        );
    }

    public static function delete(int $id): bool
    {
        global $wpdb;
        return false !== $wpdb->delete(self::table(), ['id' => $id], ['%d']);
    }

    private static function sanitize(array $data): array
    {
        $status = (isset($data['status']) && $data['status'] === 'enabled') ? 'enabled' : 'disabled';
        $cta_url = '';
        if (!empty($data['cta_url'])) {
            $cta_url = esc_url_raw((string) $data['cta_url']);
        }
        return [
            'name'        => isset($data['name']) ? sanitize_text_field((string) $data['name']) : '',
            'description' => isset($data['description']) ? sanitize_textarea_field((string) $data['description']) : '',
            'triggers'    => isset($data['triggers']) ? sanitize_textarea_field((string) $data['triggers']) : '',
            'instruction' => isset($data['instruction']) ? sanitize_textarea_field((string) $data['instruction']) : '',
            'priority'    => isset($data['priority']) ? max(0, min(999, (int) $data['priority'])) : 10,
            'status'      => $status,
            'cta_label'   => isset($data['cta_label']) ? sanitize_text_field((string) $data['cta_label']) : '',
            'cta_url'     => $cta_url,
        ];
    }

    /**
     * Seed disabled example drafts once (only when the table is empty). All are
     * disabled and editable; approved external URLs are used where relevant.
     */
    public static function maybe_seed_examples(): void
    {
        if (self::count_all() > 0) {
            return;
        }
        $platform = 'https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F';
        $demo     = 'https://tool.farmtree.earth/Identity/Account/Register';
        $examples = [
            [
                'name' => 'What does FarmTree do?',
                'description' => 'Explain FarmTree at a high level using approved Knowledge.',
                'triggers' => "what is farmtree\nwhat does farmtree do\nabout farmtree",
                'instruction' => 'Answer only from approved FarmTree Knowledge. If details are missing, ask the visitor to confirm with the FarmTree team.',
                'priority' => 10, 'status' => 'disabled', 'cta_label' => '', 'cta_url' => '',
            ],
            [
                'name' => 'Access the FarmTree Platform',
                'description' => 'Direct the visitor to the FarmTree Platform login.',
                'triggers' => "platform\nlogin\nsign in\naccess the platform",
                'instruction' => 'Point the visitor to the FarmTree Platform and offer the login link.',
                'priority' => 20, 'status' => 'disabled', 'cta_label' => 'Open the FarmTree Platform', 'cta_url' => $platform,
            ],
            [
                'name' => 'Book a Demo',
                'description' => 'Help the visitor request a demo.',
                'triggers' => "demo\nbook a demo\nrequest a demo",
                'instruction' => 'Offer the demo request link.',
                'priority' => 30, 'status' => 'disabled', 'cta_label' => 'Request a demo', 'cta_url' => $demo,
            ],
            [
                'name' => 'Information for Investors',
                'description' => 'Point investors to relevant approved information.',
                'triggers' => "investor\ninvestment\nfor investors",
                'instruction' => 'Answer from approved Knowledge for investors; do not make financial claims.',
                'priority' => 40, 'status' => 'disabled', 'cta_label' => '', 'cta_url' => '',
            ],
            [
                'name' => 'Information for Implementers',
                'description' => 'Point implementers/NGOs to relevant approved information.',
                'triggers' => "implementer\nngo\nfor implementers",
                'instruction' => 'Answer from approved Knowledge for implementers.',
                'priority' => 50, 'status' => 'disabled', 'cta_label' => '', 'cta_url' => '',
            ],
        ];
        foreach ($examples as $ex) {
            self::create($ex);
        }
    }
}
