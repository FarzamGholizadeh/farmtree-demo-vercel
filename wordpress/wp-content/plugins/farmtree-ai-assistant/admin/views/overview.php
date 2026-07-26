<?php
/**
 * Overview page. Reports true status only — the assistant is never shown as
 * "active" unless a real provider is configured (key present via constant) AND
 * the admin switch is on.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

$provider_configured = FT_AI_Settings::is_provider_configured();
$assistant_active    = FT_AI_Settings::is_assistant_active();
$enabled_switch      = (int) FT_AI_Settings::get('enabled') === 1;
$provider_name       = FT_AI_Settings::get_provider_name();

$k_enabled = FT_AI_Knowledge::count_enabled();
$s_enabled = FT_AI_Skills::count_enabled();
$s_total   = FT_AI_Skills::count_all();
$convos    = FT_AI_Conversations::count_recent(30);

$notice = isset($_GET['ft_notice']) ? FT_AI_Admin::notice(sanitize_key(wp_unslash($_GET['ft_notice']))) : ['', ''];
?>
<div class="wrap ft-ai-wrap">
    <h1><?php esc_html_e('FarmTree AI — Overview', 'farmtree-ai-assistant'); ?></h1>

    <?php if (!empty($notice[1])) : ?>
        <div class="notice notice-<?php echo esc_attr($notice[0]); ?> is-dismissible"><p><?php echo esc_html($notice[1]); ?></p></div>
    <?php endif; ?>

    <?php if ($assistant_active) : ?>
        <div class="ft-ai-status ft-ai-status--on">
            <span class="ft-ai-dot"></span>
            <strong><?php esc_html_e('Assistant is active', 'farmtree-ai-assistant'); ?></strong>
            <span><?php
                /* translators: %s: provider name. */
                echo esc_html(sprintf(__('Provider: %s (configured via server constant).', 'farmtree-ai-assistant'), $provider_name));
            ?></span>
        </div>
    <?php elseif ($enabled_switch && !$provider_configured) : ?>
        <div class="ft-ai-status ft-ai-status--warn">
            <span class="ft-ai-dot"></span>
            <strong><?php esc_html_e('Not active — no AI provider is configured', 'farmtree-ai-assistant'); ?></strong>
            <span><?php esc_html_e('The switch is on, but no API key constant is set on the server. The assistant will not respond and no fake answers are shown. Set the key in wp-config.php.', 'farmtree-ai-assistant'); ?></span>
        </div>
    <?php else : ?>
        <div class="ft-ai-status ft-ai-status--off">
            <span class="ft-ai-dot"></span>
            <strong><?php esc_html_e('Assistant is off', 'farmtree-ai-assistant'); ?></strong>
            <span><?php esc_html_e('Configure a provider and enable the assistant in Settings.', 'farmtree-ai-assistant'); ?></span>
        </div>
    <?php endif; ?>

    <div class="ft-ai-cards">
        <div class="ft-ai-card">
            <span class="ft-ai-card__n"><?php echo esc_html((string) $k_enabled); ?></span>
            <span class="ft-ai-card__l"><?php esc_html_e('Approved knowledge sources', 'farmtree-ai-assistant'); ?></span>
            <a href="<?php echo esc_url(admin_url('admin.php?page=farmtree-ai-knowledge')); ?>"><?php esc_html_e('Manage Knowledge', 'farmtree-ai-assistant'); ?></a>
        </div>
        <div class="ft-ai-card">
            <span class="ft-ai-card__n"><?php echo esc_html($s_enabled . ' / ' . $s_total); ?></span>
            <span class="ft-ai-card__l"><?php esc_html_e('Enabled skills (of total)', 'farmtree-ai-assistant'); ?></span>
            <a href="<?php echo esc_url(admin_url('admin.php?page=farmtree-ai-skills')); ?>"><?php esc_html_e('Manage Skills', 'farmtree-ai-assistant'); ?></a>
        </div>
        <div class="ft-ai-card">
            <span class="ft-ai-card__n"><?php echo esc_html((string) $convos); ?></span>
            <span class="ft-ai-card__l"><?php esc_html_e('Conversations (30 days)', 'farmtree-ai-assistant'); ?></span>
            <span class="ft-ai-card__hint"><?php echo FT_AI_Conversations::logging_enabled() ? esc_html__('Logging on', 'farmtree-ai-assistant') : esc_html__('Logging off', 'farmtree-ai-assistant'); ?></span>
        </div>
    </div>

    <div class="ft-ai-panel">
        <h2><?php esc_html_e('How this assistant stays safe', 'farmtree-ai-assistant'); ?></h2>
        <ul class="ft-ai-list">
            <li><?php esc_html_e('The AI API key is read only from a server constant (wp-config.php). It is never stored in the database, never sent to the browser, and never logged.', 'farmtree-ai-assistant'); ?></li>
            <li><?php esc_html_e('If no provider is configured, the assistant stays off and never invents answers.', 'farmtree-ai-assistant'); ?></li>
            <li><?php esc_html_e('Answers are grounded in the approved Knowledge you add here. When something is not covered, the assistant asks the visitor to confirm with the FarmTree team.', 'farmtree-ai-assistant'); ?></li>
            <li><?php esc_html_e('Skills are seeded as disabled drafts. Nothing appears on the website until you enable it.', 'farmtree-ai-assistant'); ?></li>
        </ul>
        <p class="ft-ai-muted">
            <?php
            $lu = FT_AI_Knowledge::last_updated();
            echo $lu
                ? esc_html(sprintf(/* translators: %s: date. */ __('Knowledge last updated: %s', 'farmtree-ai-assistant'), $lu))
                : esc_html__('No knowledge sources added yet.', 'farmtree-ai-assistant');
            ?>
        </p>
    </div>
</div>
