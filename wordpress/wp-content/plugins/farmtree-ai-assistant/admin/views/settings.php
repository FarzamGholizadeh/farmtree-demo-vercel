<?php
/**
 * Settings page. The API key is NEVER entered or displayed here — it is read
 * from a server constant. This page only manages non-secret configuration.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

$s = FT_AI_Settings::get_all();
$provider_name    = FT_AI_Settings::get_provider_name();
$provider_ok      = FT_AI_Settings::is_provider_configured();
$key_present      = FT_AI_Settings::get_api_key() !== '';
$model_effective  = FT_AI_Settings::get_model();
$known_providers  = FT_AI_Provider_Factory::known();

$test = get_transient('ft_ai_test_' . get_current_user_id());
$notice = isset($_GET['ft_notice']) ? FT_AI_Admin::notice(sanitize_key(wp_unslash($_GET['ft_notice']))) : ['', ''];
?>
<div class="wrap ft-ai-wrap">
    <h1><?php esc_html_e('FarmTree AI — Settings', 'farmtree-ai-assistant'); ?></h1>

    <?php if (!empty($notice[1])) : ?>
        <div class="notice notice-<?php echo esc_attr($notice[0]); ?> is-dismissible"><p><?php echo esc_html($notice[1]); ?></p></div>
    <?php endif; ?>

    <div class="ft-ai-panel">
        <h2><?php esc_html_e('AI provider (server-configured)', 'farmtree-ai-assistant'); ?></h2>
        <table class="form-table" role="presentation">
            <tr>
                <th><?php esc_html_e('Provider', 'farmtree-ai-assistant'); ?></th>
                <td>
                    <?php if ($provider_name) : ?>
                        <code><?php echo esc_html($provider_name); ?></code>
                    <?php else : ?>
                        <em><?php esc_html_e('none set', 'farmtree-ai-assistant'); ?></em>
                    <?php endif; ?>
                    <p class="description"><?php esc_html_e('Set with the FARMTREE_AI_PROVIDER constant (or environment variable).', 'farmtree-ai-assistant'); ?></p>
                </td>
            </tr>
            <tr>
                <th><?php esc_html_e('API key', 'farmtree-ai-assistant'); ?></th>
                <td>
                    <span class="ft-ai-badge <?php echo $key_present ? 'ft-ai-badge--ok' : 'ft-ai-badge--no'; ?>">
                        <?php echo $key_present ? esc_html__('Detected on server', 'farmtree-ai-assistant') : esc_html__('Not set', 'farmtree-ai-assistant'); ?>
                    </span>
                    <p class="description">
                        <?php esc_html_e('The key is read only from the FARMTREE_AI_API_KEY constant in wp-config.php (or environment). It is never stored in the database, shown here, sent to the browser, or logged.', 'farmtree-ai-assistant'); ?>
                    </p>
                    <?php if (!$key_present) : ?>
                        <pre class="ft-ai-code">define('FARMTREE_AI_PROVIDER', 'openai');
define('FARMTREE_AI_API_KEY',  'sk-...');   // keep this out of version control
define('FARMTREE_AI_MODEL',    'gpt-4o-mini');</pre>
                        <p class="description"><?php esc_html_e("Use provider 'anthropic' with an Anthropic model name to select the Anthropic adapter.", 'farmtree-ai-assistant'); ?></p>
                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <th><?php esc_html_e('Effective model', 'farmtree-ai-assistant'); ?></th>
                <td><code><?php echo $model_effective ? esc_html($model_effective) : esc_html__('(provider default)', 'farmtree-ai-assistant'); ?></code></td>
            </tr>
        </table>

        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="ft-ai-inline-form">
            <input type="hidden" name="action" value="ft_ai_test_connection">
            <?php wp_nonce_field('ft_ai_test_connection', '_ft_ai_nonce'); ?>
            <button type="submit" class="button" <?php disabled(!$provider_ok); ?>><?php esc_html_e('Test connection', 'farmtree-ai-assistant'); ?></button>
            <?php if (!$provider_ok) : ?>
                <span class="ft-ai-muted"><?php esc_html_e('Configure a provider + key on the server first.', 'farmtree-ai-assistant'); ?></span>
            <?php endif; ?>
        </form>
        <?php if (is_array($test) && isset($test['message'])) : ?>
            <p class="ft-ai-test <?php echo !empty($test['ok']) ? 'ft-ai-test--ok' : 'ft-ai-test--fail'; ?>">
                <?php echo esc_html($test['message']); ?>
            </p>
        <?php endif; ?>
        <?php if (!empty($known_providers)) : ?>
            <p class="ft-ai-muted"><?php
                /* translators: %s: comma-separated provider slugs. */
                echo esc_html(sprintf(__('Adapters available: %s', 'farmtree-ai-assistant'), implode(', ', $known_providers)));
            ?></p>
        <?php endif; ?>
    </div>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <input type="hidden" name="action" value="ft_ai_save_settings">
        <?php wp_nonce_field('ft_ai_save_settings', '_ft_ai_nonce'); ?>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Assistant', 'farmtree-ai-assistant'); ?></h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><?php esc_html_e('Enable on website', 'farmtree-ai-assistant'); ?></th>
                    <td>
                        <label><input type="checkbox" name="enabled" value="1" <?php checked((int) $s['enabled'], 1); ?>>
                            <?php esc_html_e('Show the assistant on the site', 'farmtree-ai-assistant'); ?></label>
                        <p class="description"><?php esc_html_e('The assistant still only responds when a provider is configured on the server. Enabling this alone never fakes activity.', 'farmtree-ai-assistant'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_model"><?php esc_html_e('Model override', 'farmtree-ai-assistant'); ?></label></th>
                    <td>
                        <input type="text" id="ft_model" name="model" class="regular-text" value="<?php echo esc_attr($s['model']); ?>" placeholder="<?php esc_attr_e('leave blank to use the server default', 'farmtree-ai-assistant'); ?>">
                        <p class="description"><?php esc_html_e('Optional. The FARMTREE_AI_MODEL constant takes precedence if set.', 'farmtree-ai-assistant'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_temp"><?php esc_html_e('Temperature', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="number" step="0.1" min="0" max="1" id="ft_temp" name="temperature" value="<?php echo esc_attr((string) $s['temperature']); ?>" class="small-text"></td>
                </tr>
            </table>
        </div>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Limits & privacy', 'farmtree-ai-assistant'); ?></h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="ft_maxmsg"><?php esc_html_e('Max message length', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="number" min="200" max="4000" id="ft_maxmsg" name="max_message_length" value="<?php echo esc_attr((string) $s['max_message_length']); ?>" class="small-text"> <?php esc_html_e('characters', 'farmtree-ai-assistant'); ?></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_hist"><?php esc_html_e('History window', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="number" min="0" max="30" id="ft_hist" name="max_history" value="<?php echo esc_attr((string) $s['max_history']); ?>" class="small-text"> <?php esc_html_e('recent messages passed as context', 'farmtree-ai-assistant'); ?></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_rl"><?php esc_html_e('Rate limit', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="number" min="1" max="120" id="ft_rl" name="rate_limit_per_min" value="<?php echo esc_attr((string) $s['rate_limit_per_min']); ?>" class="small-text"> <?php esc_html_e('messages per minute per visitor', 'farmtree-ai-assistant'); ?></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_tokens"><?php esc_html_e('Max output tokens', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="number" min="100" max="2000" id="ft_tokens" name="max_output_tokens" value="<?php echo esc_attr((string) $s['max_output_tokens']); ?>" class="small-text"> <?php esc_html_e('per response', 'farmtree-ai-assistant'); ?></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_daily"><?php esc_html_e('Daily request limit', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="number" min="1" max="5000" id="ft_daily" name="daily_limit" value="<?php echo esc_attr((string) $s['daily_limit']); ?>" class="small-text"> <?php esc_html_e('requests per visitor hash per day', 'farmtree-ai-assistant'); ?></td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Conversation logging', 'farmtree-ai-assistant'); ?></th>
                    <td>
                        <label><input type="checkbox" name="conversation_logging" value="1" <?php checked((int) $s['conversation_logging'], 1); ?>>
                            <?php esc_html_e('Store conversations for review', 'farmtree-ai-assistant'); ?></label>
                        <p class="description"><?php esc_html_e('When on, messages are stored with a one-way hashed IP only. The raw IP is never stored.', 'farmtree-ai-assistant'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('On uninstall', 'farmtree-ai-assistant'); ?></th>
                    <td>
                        <label><input type="checkbox" name="remove_data_on_uninstall" value="1" <?php checked((int) $s['remove_data_on_uninstall'], 1); ?>>
                            <?php esc_html_e('Delete all plugin data when the plugin is uninstalled', 'farmtree-ai-assistant'); ?></label>
                        <p class="description"><?php esc_html_e('Off by default. Data is preserved through deactivation and updates.', 'farmtree-ai-assistant'); ?></p>
                    </td>
                </tr>
            </table>
        </div>

        <p><button type="submit" class="button button-primary"><?php esc_html_e('Save settings', 'farmtree-ai-assistant'); ?></button></p>
    </form>
</div>
