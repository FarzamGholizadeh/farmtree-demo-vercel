<?php
/**
 * Knowledge page. Add sources by scanning a public URL (server-side, SSRF-safe)
 * or by pasting text. Scanned pages are shown for review before saving. All
 * stored content is plain text only.
 *
 * @package FarmTree_AI_Assistant
 *
 * @var array|false $preview Scanned result awaiting review (from the controller).
 */

if (!defined('ABSPATH')) {
    exit;
}

$items    = FT_AI_Knowledge::all();
$scan_err = get_transient('ft_ai_scan_err_' . get_current_user_id());
$notice   = isset($_GET['ft_notice']) ? FT_AI_Admin::notice(sanitize_key(wp_unslash($_GET['ft_notice']))) : ['', ''];
$post_url = esc_url(admin_url('admin-post.php'));
?>
<div class="wrap ft-ai-wrap">
    <h1><?php esc_html_e('FarmTree AI — Knowledge', 'farmtree-ai-assistant'); ?></h1>
    <p class="ft-ai-muted"><?php esc_html_e('Everything the assistant is allowed to state as fact comes from the approved sources below. Enabled sources are used; disabled ones are ignored.', 'farmtree-ai-assistant'); ?></p>

    <?php if (!empty($notice[1])) : ?>
        <div class="notice notice-<?php echo esc_attr($notice[0]); ?> is-dismissible"><p><?php echo esc_html($notice[1]); ?></p></div>
    <?php endif; ?>
    <?php if ($scan_err) : ?>
        <div class="notice notice-error is-dismissible"><p><?php echo esc_html($scan_err); ?></p></div>
        <?php delete_transient('ft_ai_scan_err_' . get_current_user_id()); ?>
    <?php endif; ?>

    <?php if (is_array($preview) && !empty($preview['ok'])) : ?>
        <div class="ft-ai-panel ft-ai-panel--review">
            <h2><?php esc_html_e('Review scanned page', 'farmtree-ai-assistant'); ?></h2>
            <p class="ft-ai-muted"><?php esc_html_e('Only readable text was extracted — scripts, forms and media were dropped. Edit as needed, then save.', 'farmtree-ai-assistant'); ?></p>
            <form method="post" action="<?php echo $post_url; ?>">
                <input type="hidden" name="action" value="ft_ai_knowledge_save_scanned">
                <?php wp_nonce_field('ft_ai_knowledge_save_scanned', '_ft_ai_nonce'); ?>
                <input type="hidden" name="url" value="<?php echo esc_url($preview['url']); ?>">
                <p><label><strong><?php esc_html_e('Title', 'farmtree-ai-assistant'); ?></strong><br>
                    <input type="text" name="title" class="large-text" value="<?php echo esc_attr($preview['title']); ?>"></label></p>
                <p><span class="ft-ai-muted"><?php echo esc_html($preview['url']); ?></span></p>
                <p><label><strong><?php esc_html_e('Extracted text', 'farmtree-ai-assistant'); ?></strong><br>
                    <textarea name="content" rows="12" class="large-text ft-ai-mono"><?php echo esc_textarea($preview['text']); ?></textarea></label></p>
                <p><label><input type="checkbox" name="enabled" value="1" checked> <?php esc_html_e('Enable this source immediately', 'farmtree-ai-assistant'); ?></label></p>
                <button type="submit" class="button button-primary"><?php esc_html_e('Save to Knowledge', 'farmtree-ai-assistant'); ?></button>
            </form>
            <form method="post" action="<?php echo $post_url; ?>" class="ft-ai-inline-form">
                <input type="hidden" name="action" value="ft_ai_knowledge_discard">
                <?php wp_nonce_field('ft_ai_knowledge_save_scanned', '_ft_ai_nonce'); ?>
                <button type="submit" class="button"><?php esc_html_e('Discard', 'farmtree-ai-assistant'); ?></button>
            </form>
        </div>
    <?php endif; ?>

    <div class="ft-ai-grid2">
        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Add a link', 'farmtree-ai-assistant'); ?></h2>
            <p class="ft-ai-muted"><?php esc_html_e('We fetch the page on the server, extract its readable text, and show it for review. Private/internal addresses are refused.', 'farmtree-ai-assistant'); ?></p>
            <form method="post" action="<?php echo $post_url; ?>">
                <input type="hidden" name="action" value="ft_ai_knowledge_scan">
                <?php wp_nonce_field('ft_ai_knowledge_scan', '_ft_ai_nonce'); ?>
                <p><input type="url" name="url" class="large-text" placeholder="https://farmtree.eu/..." required></p>
                <p><button type="submit" class="button button-primary"><?php esc_html_e('Scan now', 'farmtree-ai-assistant'); ?></button></p>
            </form>
        </div>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Add text', 'farmtree-ai-assistant'); ?></h2>
            <form method="post" action="<?php echo $post_url; ?>">
                <input type="hidden" name="action" value="ft_ai_knowledge_add_text">
                <?php wp_nonce_field('ft_ai_knowledge_add_text', '_ft_ai_nonce'); ?>
                <p><input type="text" name="title" class="large-text" placeholder="<?php esc_attr_e('Title', 'farmtree-ai-assistant'); ?>" required></p>
                <p><textarea name="content" rows="6" class="large-text" placeholder="<?php esc_attr_e('Approved information…', 'farmtree-ai-assistant'); ?>" required></textarea></p>
                <p><label><input type="checkbox" name="enabled" value="1" checked> <?php esc_html_e('Enable immediately', 'farmtree-ai-assistant'); ?></label></p>
                <p><button type="submit" class="button button-primary"><?php esc_html_e('Add text', 'farmtree-ai-assistant'); ?></button></p>
            </form>
        </div>
    </div>

    <div class="ft-ai-panel">
        <h2><?php esc_html_e('Sources', 'farmtree-ai-assistant'); ?> <span class="ft-ai-muted">(<?php echo esc_html((string) count($items)); ?>)</span></h2>
        <?php if (empty($items)) : ?>
            <p class="ft-ai-muted"><?php esc_html_e('No knowledge sources yet.', 'farmtree-ai-assistant'); ?></p>
        <?php else : ?>
            <table class="widefat striped ft-ai-table">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Title', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('Type', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('Status', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('Updated', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('Actions', 'farmtree-ai-assistant'); ?></th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($items as $it) : ?>
                    <tr>
                        <td>
                            <strong><?php echo esc_html($it->title !== '' ? $it->title : __('(untitled)', 'farmtree-ai-assistant')); ?></strong>
                            <?php if ($it->type === 'link' && $it->url) : ?>
                                <br><a href="<?php echo esc_url($it->url); ?>" target="_blank" rel="noopener noreferrer" class="ft-ai-muted"><?php echo esc_html($it->url); ?></a>
                            <?php endif; ?>
                        </td>
                        <td><?php echo esc_html($it->type); ?></td>
                        <td>
                            <span class="ft-ai-badge <?php echo $it->status === 'enabled' ? 'ft-ai-badge--ok' : 'ft-ai-badge--no'; ?>">
                                <?php echo esc_html($it->status); ?>
                            </span>
                        </td>
                        <td class="ft-ai-muted"><?php echo esc_html($it->updated_at); ?></td>
                        <td class="ft-ai-actions">
                            <form method="post" action="<?php echo $post_url; ?>">
                                <input type="hidden" name="action" value="ft_ai_knowledge_toggle">
                                <?php wp_nonce_field('ft_ai_knowledge_toggle', '_ft_ai_nonce'); ?>
                                <input type="hidden" name="id" value="<?php echo esc_attr((string) $it->id); ?>">
                                <input type="hidden" name="to" value="<?php echo $it->status === 'enabled' ? 'disabled' : 'enabled'; ?>">
                                <button type="submit" class="button button-small"><?php echo $it->status === 'enabled' ? esc_html__('Disable', 'farmtree-ai-assistant') : esc_html__('Enable', 'farmtree-ai-assistant'); ?></button>
                            </form>
                            <form method="post" action="<?php echo $post_url; ?>" onsubmit="return confirm('<?php echo esc_js(__('Delete this source?', 'farmtree-ai-assistant')); ?>');">
                                <input type="hidden" name="action" value="ft_ai_knowledge_delete">
                                <?php wp_nonce_field('ft_ai_knowledge_delete', '_ft_ai_nonce'); ?>
                                <input type="hidden" name="id" value="<?php echo esc_attr((string) $it->id); ?>">
                                <button type="submit" class="button button-small button-link-delete"><?php esc_html_e('Delete', 'farmtree-ai-assistant'); ?></button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</div>
