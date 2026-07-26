<?php
/**
 * Behavior page. Defines the assistant's role, voice, guardrails and language.
 * The non-negotiable safe-fallback rule is always enforced and shown read-only.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

$b = FT_AI_Behavior::get_all();
$notice = isset($_GET['ft_notice']) ? FT_AI_Admin::notice(sanitize_key(wp_unslash($_GET['ft_notice']))) : ['', ''];
?>
<div class="wrap ft-ai-wrap">
    <h1><?php esc_html_e('FarmTree AI — Behavior', 'farmtree-ai-assistant'); ?></h1>

    <?php if (!empty($notice[1])) : ?>
        <div class="notice notice-<?php echo esc_attr($notice[0]); ?> is-dismissible"><p><?php echo esc_html($notice[1]); ?></p></div>
    <?php endif; ?>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <input type="hidden" name="action" value="ft_ai_save_behavior">
        <?php wp_nonce_field('ft_ai_save_behavior', '_ft_ai_nonce'); ?>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Role & voice', 'farmtree-ai-assistant'); ?></h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="ft_role"><?php esc_html_e('AI role', 'farmtree-ai-assistant'); ?></label></th>
                    <td><textarea id="ft_role" name="ai_role" rows="3" class="large-text"><?php echo esc_textarea($b['ai_role']); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_voice"><?php esc_html_e('Brand voice', 'farmtree-ai-assistant'); ?></label></th>
                    <td><textarea id="ft_voice" name="brand_voice" rows="2" class="large-text"><?php echo esc_textarea($b['brand_voice']); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_guards"><?php esc_html_e('Guardrails', 'farmtree-ai-assistant'); ?></label></th>
                    <td><textarea id="ft_guards" name="guardrails" rows="3" class="large-text"><?php echo esc_textarea($b['guardrails']); ?></textarea></td>
                </tr>
            </table>
        </div>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Safety rule (always enforced)', 'farmtree-ai-assistant'); ?></h2>
            <p class="ft-ai-locked"><?php echo esc_html(FT_AI_Behavior::SAFE_FALLBACK_RULE); ?></p>
            <p class="description"><?php esc_html_e('This rule cannot be turned off. It is appended to every answer instruction so the assistant never invents facts.', 'farmtree-ai-assistant'); ?></p>
        </div>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Language', 'farmtree-ai-assistant'); ?></h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="ft_lang"><?php esc_html_e('Default language', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="text" id="ft_lang" name="default_language" value="<?php echo esc_attr($b['default_language']); ?>" class="small-text" maxlength="8"> <span class="description"><?php esc_html_e('e.g. en, nl, fr', 'farmtree-ai-assistant'); ?></span></td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Language handling', 'farmtree-ai-assistant'); ?></th>
                    <td>
                        <label><input type="checkbox" name="auto_detect_language" value="1" <?php checked((int) $b['auto_detect_language'], 1); ?>> <?php esc_html_e('Auto-detect the visitor language', 'farmtree-ai-assistant'); ?></label><br>
                        <label><input type="checkbox" name="reply_same_language" value="1" <?php checked((int) $b['reply_same_language'], 1); ?>> <?php esc_html_e('Reply in the same language as the visitor', 'farmtree-ai-assistant'); ?></label>
                    </td>
                </tr>
            </table>
        </div>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Answers & handoff', 'farmtree-ai-assistant'); ?></h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="ft_maxchars"><?php esc_html_e('Target answer length', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="number" id="ft_maxchars" name="max_answer_chars" value="<?php echo esc_attr((string) $b['max_answer_chars']); ?>" class="small-text" min="150" max="3000"> <?php esc_html_e('characters', 'farmtree-ai-assistant'); ?></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_handoff"><?php esc_html_e('Handoff message', 'farmtree-ai-assistant'); ?></label></th>
                    <td><textarea id="ft_handoff" name="handoff_message" rows="2" class="large-text"><?php echo esc_textarea($b['handoff_message']); ?></textarea></td>
                </tr>
                <tr>
                    <th scope="row"><label for="ft_escalation"><?php esc_html_e('Escalation contact', 'farmtree-ai-assistant'); ?></label></th>
                    <td><input type="text" id="ft_escalation" name="escalation_contact" value="<?php echo esc_attr($b['escalation_contact']); ?>" class="regular-text" placeholder="<?php esc_attr_e('approved email or team name (optional)', 'farmtree-ai-assistant'); ?>"></td>
                </tr>
                <tr>
                    <th scope="row"><?php esc_html_e('Options', 'farmtree-ai-assistant'); ?></th>
                    <td>
                        <label><input type="checkbox" name="include_source_links" value="1" <?php checked((int) $b['include_source_links'], 1); ?>> <?php esc_html_e('Show approved source links with answers', 'farmtree-ai-assistant'); ?></label><br>
                        <label><input type="checkbox" name="retain_history" value="1" <?php checked((int) $b['retain_history'], 1); ?>> <?php esc_html_e('Let the assistant use recent conversation history for context', 'farmtree-ai-assistant'); ?></label>
                    </td>
                </tr>
            </table>
        </div>

        <p><button type="submit" class="button button-primary"><?php esc_html_e('Save behavior', 'farmtree-ai-assistant'); ?></button></p>
    </form>
</div>
