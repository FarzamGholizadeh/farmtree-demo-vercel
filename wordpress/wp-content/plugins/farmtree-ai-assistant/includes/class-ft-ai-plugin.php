<?php
/**
 * Plugin bootstrap. Wires the admin UI, the public chat widget and the REST
 * endpoint. Kept intentionally thin — all logic lives in the dedicated classes.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

final class FT_AI_Plugin
{
    private static ?FT_AI_Plugin $instance = null;

    public static function instance(): FT_AI_Plugin
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
    }

    public function run(): void
    {
        // Keep the schema current if plugin files were updated without re-activation.
        add_action('init', ['FT_AI_Activator', 'maybe_upgrade']);
        load_plugin_textdomain('farmtree-ai-assistant', false, dirname(plugin_basename(FARMTREE_AI_FILE)) . '/languages');

        // REST chat endpoint (server-side provider only).
        $rest = new FT_AI_REST();
        add_action('rest_api_init', [$rest, 'register_routes']);

        // Admin UI.
        if (is_admin()) {
            require_once FARMTREE_AI_DIR . 'admin/class-ft-ai-admin.php';
            (new FT_AI_Admin())->hooks();
        }

        // Public chat widget.
        require_once FARMTREE_AI_DIR . 'public/class-ft-ai-frontend.php';
        (new FT_AI_Frontend())->hooks();
    }
}
