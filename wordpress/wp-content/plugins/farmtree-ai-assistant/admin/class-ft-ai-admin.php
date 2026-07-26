<?php
/**
 * Admin controller: registers the top-level "FarmTree AI" menu and its five
 * pages, enqueues admin assets, and handles all nonce + capability guarded
 * POST actions. No secret is ever accepted, stored or echoed here.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Admin
{
    const MENU_SLUG = 'farmtree-ai';
    const NONCE     = 'ft_ai_admin';

    public function hooks(): void
    {
        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue']);

        // admin-post.php handlers (each verifies nonce + capability).
        $actions = [
            'save_settings', 'test_connection', 'save_behavior',
            'knowledge_scan', 'knowledge_save_scanned', 'knowledge_add_text',
            'knowledge_toggle', 'knowledge_delete', 'knowledge_discard',
            'skill_save', 'skill_toggle', 'skill_delete', 'skill_duplicate', 'skill_move',
        ];
        foreach ($actions as $a) {
            add_action('admin_post_ft_ai_' . $a, [$this, 'handle_' . $a]);
        }
    }

    public function register_menu(): void
    {
        $cap = FARMTREE_AI_CAP;
        add_menu_page(
            __('FarmTree AI', 'farmtree-ai-assistant'),
            __('FarmTree AI', 'farmtree-ai-assistant'),
            $cap,
            self::MENU_SLUG,
            [$this, 'render_overview'],
            'dashicons-format-chat',
            58
        );
        $pages = [
            [self::MENU_SLUG, __('Overview', 'farmtree-ai-assistant'), 'render_overview'],
            [self::MENU_SLUG . '-knowledge', __('Knowledge', 'farmtree-ai-assistant'), 'render_knowledge'],
            [self::MENU_SLUG . '-behavior', __('Behavior', 'farmtree-ai-assistant'), 'render_behavior'],
            [self::MENU_SLUG . '-skills', __('Skills', 'farmtree-ai-assistant'), 'render_skills'],
            [self::MENU_SLUG . '-settings', __('Settings', 'farmtree-ai-assistant'), 'render_settings'],
        ];
        foreach ($pages as $p) {
            add_submenu_page(self::MENU_SLUG, $p[1], $p[1], $cap, $p[0], [$this, $p[2]]);
        }
    }

    public function enqueue(string $hook): void
    {
        if (strpos($hook, self::MENU_SLUG) === false) {
            return;
        }
        wp_enqueue_style('ft-ai-admin', FARMTREE_AI_URL . 'admin/css/admin.css', [], FARMTREE_AI_VERSION);
        wp_enqueue_script('ft-ai-admin', FARMTREE_AI_URL . 'admin/js/admin.js', [], FARMTREE_AI_VERSION, true);
    }

    // ---- page renderers ----

    private function guard(): void
    {
        if (!current_user_can(FARMTREE_AI_CAP)) {
            wp_die(esc_html__('You do not have permission to access this page.', 'farmtree-ai-assistant'));
        }
    }

    public function render_overview(): void
    {
        $this->guard();
        require FARMTREE_AI_DIR . 'admin/views/overview.php';
    }
    public function render_knowledge(): void
    {
        $this->guard();
        $preview = get_transient('ft_ai_scan_' . get_current_user_id());
        require FARMTREE_AI_DIR . 'admin/views/knowledge.php';
    }
    public function render_behavior(): void
    {
        $this->guard();
        require FARMTREE_AI_DIR . 'admin/views/behavior.php';
    }
    public function render_skills(): void
    {
        $this->guard();
        require FARMTREE_AI_DIR . 'admin/views/skills.php';
    }
    public function render_settings(): void
    {
        $this->guard();
        require FARMTREE_AI_DIR . 'admin/views/settings.php';
    }

    // ---- shared guards + redirect helpers ----

    private function verify(string $action): void
    {
        if (!current_user_can(FARMTREE_AI_CAP)) {
            wp_die(esc_html__('Insufficient permissions.', 'farmtree-ai-assistant'));
        }
        check_admin_referer($action, '_ft_ai_nonce');
    }

    private function back(string $page, string $notice = '', array $extra = []): void
    {
        $args = ['page' => $page];
        if ($notice !== '') {
            $args['ft_notice'] = $notice;
        }
        $args = array_merge($args, $extra);
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
        exit;
    }

    // ---- Settings ----

    public function handle_save_settings(): void
    {
        $this->verify('ft_ai_save_settings');
        FT_AI_Settings::update([
            'enabled'              => isset($_POST['enabled']) ? 1 : 0,
            'model'                => isset($_POST['model']) ? sanitize_text_field(wp_unslash($_POST['model'])) : '',
            'temperature'          => isset($_POST['temperature']) ? (float) $_POST['temperature'] : 0.2,
            'max_message_length'   => isset($_POST['max_message_length']) ? (int) $_POST['max_message_length'] : 1000,
            'max_history'          => isset($_POST['max_history']) ? (int) $_POST['max_history'] : 8,
            'rate_limit_per_min'   => isset($_POST['rate_limit_per_min']) ? (int) $_POST['rate_limit_per_min'] : 12,
            'conversation_logging' => isset($_POST['conversation_logging']) ? 1 : 0,
            'remove_data_on_uninstall' => isset($_POST['remove_data_on_uninstall']) ? 1 : 0,
        ]);
        $this->back(self::MENU_SLUG . '-settings', 'settings_saved');
    }

    public function handle_test_connection(): void
    {
        $this->verify('ft_ai_test_connection');
        $provider = FT_AI_Provider_Factory::get();
        if (!$provider) {
            $this->back(self::MENU_SLUG . '-settings', 'test_unconfigured');
        }
        $res = $provider->test_connection();
        set_transient('ft_ai_test_' . get_current_user_id(), $res, 60);
        $this->back(self::MENU_SLUG . '-settings', !empty($res['ok']) ? 'test_ok' : 'test_fail');
    }

    // ---- Behavior ----

    public function handle_save_behavior(): void
    {
        $this->verify('ft_ai_save_behavior');
        // Raw values are sanitized inside FT_AI_Behavior::update().
        FT_AI_Behavior::update([
            'ai_role'              => wp_unslash($_POST['ai_role'] ?? ''),
            'brand_voice'          => wp_unslash($_POST['brand_voice'] ?? ''),
            'guardrails'           => wp_unslash($_POST['guardrails'] ?? ''),
            'default_language'     => wp_unslash($_POST['default_language'] ?? 'en'),
            'auto_detect_language' => isset($_POST['auto_detect_language']) ? 1 : 0,
            'reply_same_language'  => isset($_POST['reply_same_language']) ? 1 : 0,
            'max_answer_chars'     => (int) ($_POST['max_answer_chars'] ?? 900),
            'handoff_message'      => wp_unslash($_POST['handoff_message'] ?? ''),
            'escalation_contact'   => wp_unslash($_POST['escalation_contact'] ?? ''),
            'include_source_links' => isset($_POST['include_source_links']) ? 1 : 0,
            'retain_history'       => isset($_POST['retain_history']) ? 1 : 0,
        ]);
        $this->back(self::MENU_SLUG . '-behavior', 'behavior_saved');
    }

    // ---- Knowledge ----

    public function handle_knowledge_scan(): void
    {
        $this->verify('ft_ai_knowledge_scan');
        $url = isset($_POST['url']) ? esc_url_raw(wp_unslash($_POST['url'])) : '';
        $result = FT_AI_Scanner::scan($url);
        if (empty($result['ok'])) {
            set_transient('ft_ai_scan_err_' . get_current_user_id(), $result['error'] ?? __('Scan failed.', 'farmtree-ai-assistant'), 60);
            $this->back(self::MENU_SLUG . '-knowledge', 'scan_error');
        }
        // Store the scanned result for admin review before saving.
        set_transient('ft_ai_scan_' . get_current_user_id(), $result, 15 * MINUTE_IN_SECONDS);
        $this->back(self::MENU_SLUG . '-knowledge', 'scan_ready');
    }

    public function handle_knowledge_save_scanned(): void
    {
        $this->verify('ft_ai_knowledge_save_scanned');
        $id = FT_AI_Knowledge::create([
            'title'   => wp_unslash($_POST['title'] ?? ''),
            'type'    => 'link',
            'url'     => esc_url_raw(wp_unslash($_POST['url'] ?? '')),
            'content' => wp_unslash($_POST['content'] ?? ''),
            'status'  => isset($_POST['enabled']) ? 'enabled' : 'disabled',
        ]);
        delete_transient('ft_ai_scan_' . get_current_user_id());
        $this->back(self::MENU_SLUG . '-knowledge', $id ? 'knowledge_added' : 'knowledge_error');
    }

    public function handle_knowledge_add_text(): void
    {
        $this->verify('ft_ai_knowledge_add_text');
        $id = FT_AI_Knowledge::create([
            'title'   => wp_unslash($_POST['title'] ?? ''),
            'type'    => 'text',
            'content' => wp_unslash($_POST['content'] ?? ''),
            'status'  => isset($_POST['enabled']) ? 'enabled' : 'disabled',
        ]);
        $this->back(self::MENU_SLUG . '-knowledge', $id ? 'knowledge_added' : 'knowledge_error');
    }

    public function handle_knowledge_toggle(): void
    {
        $this->verify('ft_ai_knowledge_toggle');
        $id = (int) ($_POST['id'] ?? 0);
        $to = ($_POST['to'] ?? '') === 'enabled' ? 'enabled' : 'disabled';
        FT_AI_Knowledge::set_status($id, $to);
        $this->back(self::MENU_SLUG . '-knowledge', 'knowledge_updated');
    }

    public function handle_knowledge_delete(): void
    {
        $this->verify('ft_ai_knowledge_delete');
        FT_AI_Knowledge::delete((int) ($_POST['id'] ?? 0));
        $this->back(self::MENU_SLUG . '-knowledge', 'knowledge_deleted');
    }

    public function handle_knowledge_discard(): void
    {
        $this->verify('ft_ai_knowledge_save_scanned');
        delete_transient('ft_ai_scan_' . get_current_user_id());
        $this->back(self::MENU_SLUG . '-knowledge');
    }

    // ---- Skills ----

    public function handle_skill_save(): void
    {
        $this->verify('ft_ai_skill_save');
        $id = (int) ($_POST['id'] ?? 0);
        $data = [
            'name'        => wp_unslash($_POST['name'] ?? ''),
            'description' => wp_unslash($_POST['description'] ?? ''),
            'triggers'    => wp_unslash($_POST['triggers'] ?? ''),
            'instruction' => wp_unslash($_POST['instruction'] ?? ''),
            'priority'    => (int) ($_POST['priority'] ?? 10),
            'status'      => isset($_POST['enabled']) ? 'enabled' : 'disabled',
            'cta_label'   => wp_unslash($_POST['cta_label'] ?? ''),
            'cta_url'     => esc_url_raw(wp_unslash($_POST['cta_url'] ?? '')),
        ];
        if ($id > 0) {
            FT_AI_Skills::update($id, $data);
            $this->back(self::MENU_SLUG . '-skills', 'skill_updated');
        }
        FT_AI_Skills::create($data);
        $this->back(self::MENU_SLUG . '-skills', 'skill_added');
    }

    public function handle_skill_toggle(): void
    {
        $this->verify('ft_ai_skill_toggle');
        $id = (int) ($_POST['id'] ?? 0);
        $to = ($_POST['to'] ?? '') === 'enabled' ? 'enabled' : 'disabled';
        FT_AI_Skills::set_status($id, $to);
        $this->back(self::MENU_SLUG . '-skills', 'skill_updated');
    }

    public function handle_skill_delete(): void
    {
        $this->verify('ft_ai_skill_delete');
        FT_AI_Skills::delete((int) ($_POST['id'] ?? 0));
        $this->back(self::MENU_SLUG . '-skills', 'skill_deleted');
    }

    public function handle_skill_duplicate(): void
    {
        $this->verify('ft_ai_skill_duplicate');
        FT_AI_Skills::duplicate((int) ($_POST['id'] ?? 0));
        $this->back(self::MENU_SLUG . '-skills', 'skill_duplicated');
    }

    /**
     * Reorder by swapping priority with the adjacent skill (up/down).
     */
    public function handle_skill_move(): void
    {
        $this->verify('ft_ai_skill_move');
        $id  = (int) ($_POST['id'] ?? 0);
        $dir = ($_POST['dir'] ?? '') === 'up' ? 'up' : 'down';
        $all = FT_AI_Skills::all();
        $idx = null;
        foreach ($all as $i => $s) {
            if ((int) $s->id === $id) {
                $idx = $i;
                break;
            }
        }
        if ($idx !== null) {
            $swap = $dir === 'up' ? $idx - 1 : $idx + 1;
            if (isset($all[$swap])) {
                $a = $all[$idx];
                $b = $all[$swap];
                FT_AI_Skills::set_priority((int) $a->id, (int) $b->priority);
                FT_AI_Skills::set_priority((int) $b->id, (int) $a->priority);
            }
        }
        $this->back(self::MENU_SLUG . '-skills', 'skill_updated');
    }

    // ---- shared view helpers ----

    /** Map a notice code to a [type,message] pair for display. */
    public static function notice(string $code): array
    {
        $map = [
            'settings_saved'   => ['success', __('Settings saved.', 'farmtree-ai-assistant')],
            'test_ok'          => ['success', __('Connection test succeeded.', 'farmtree-ai-assistant')],
            'test_fail'        => ['error', __('Connection test failed. See details below.', 'farmtree-ai-assistant')],
            'test_unconfigured'=> ['warning', __('No provider is configured. Set the API key constant in wp-config.php.', 'farmtree-ai-assistant')],
            'behavior_saved'   => ['success', __('Behavior saved.', 'farmtree-ai-assistant')],
            'scan_ready'       => ['success', __('Page scanned. Review the extracted text below, then save.', 'farmtree-ai-assistant')],
            'scan_error'       => ['error', __('The page could not be scanned.', 'farmtree-ai-assistant')],
            'knowledge_added'  => ['success', __('Knowledge source added.', 'farmtree-ai-assistant')],
            'knowledge_updated'=> ['success', __('Knowledge updated.', 'farmtree-ai-assistant')],
            'knowledge_deleted'=> ['success', __('Knowledge source deleted.', 'farmtree-ai-assistant')],
            'knowledge_error'  => ['error', __('Could not save the knowledge source.', 'farmtree-ai-assistant')],
            'skill_added'      => ['success', __('Skill added.', 'farmtree-ai-assistant')],
            'skill_updated'    => ['success', __('Skill updated.', 'farmtree-ai-assistant')],
            'skill_deleted'    => ['success', __('Skill deleted.', 'farmtree-ai-assistant')],
            'skill_duplicated' => ['success', __('Skill duplicated (as a disabled draft).', 'farmtree-ai-assistant')],
        ];
        return $map[$code] ?? ['info', ''];
    }
}
