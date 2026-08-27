<?php
/**
 * Plugin Name:       FarmTree AI Assistant
 * Plugin URI:        https://farmtree.eu
 * Description:        Manageable AI assistant for FarmTree with Knowledge, Behavior and Skills management, a provider-adapter architecture, and a secure REST chat endpoint. The AI API key is never stored in the database or exposed to the browser. Inactive until activated.
 * Version:           0.2.0
 * Requires at least: 6.6
 * Requires PHP:      8.1
 * Author:            FarmTree
 * Text Domain:       farmtree-ai-assistant
 * Domain Path:       /languages
 * License:           Proprietary
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FARMTREE_AI_VERSION', '0.2.0');
define('FARMTREE_AI_DB_VERSION', '1');
define('FARMTREE_AI_FILE', __FILE__);
define('FARMTREE_AI_DIR', plugin_dir_path(__FILE__));
define('FARMTREE_AI_URL', plugin_dir_url(__FILE__));
define('FARMTREE_AI_CAP', 'manage_options'); // capability required for all admin CRUD

require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-activator.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-settings.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-behavior.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-knowledge.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-skills.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-conversations.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-scanner.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-retrieval.php';
require_once FARMTREE_AI_DIR . 'includes/providers/interface-ft-ai-provider.php';
require_once FARMTREE_AI_DIR . 'includes/providers/class-ft-ai-provider-openai.php';
require_once FARMTREE_AI_DIR . 'includes/providers/class-ft-ai-provider-anthropic.php';
require_once FARMTREE_AI_DIR . 'includes/providers/class-ft-ai-provider-factory.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-rest.php';
require_once FARMTREE_AI_DIR . 'includes/class-ft-ai-plugin.php';

register_activation_hook(__FILE__, ['FT_AI_Activator', 'activate']);
register_deactivation_hook(__FILE__, ['FT_AI_Activator', 'deactivate']);

/**
 * Boot the plugin once all plugins are loaded.
 */
function farmtree_ai_boot(): void
{
    FT_AI_Plugin::instance()->run();
}
add_action('plugins_loaded', 'farmtree_ai_boot');
