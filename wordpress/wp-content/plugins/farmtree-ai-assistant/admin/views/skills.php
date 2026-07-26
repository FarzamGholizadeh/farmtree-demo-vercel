<?php
/**
 * Skills page. Skills are stored as data (never hard-coded in JS). Enabled
 * skills drive the frontend quick-replies and can attach an approved CTA link.
 * Example skills are seeded DISABLED and only appear on the site once enabled.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

$skills   = FT_AI_Skills::all();
$post_url = esc_url(admin_url('admin-post.php'));
$notice   = isset($_GET['ft_notice']) ? FT_AI_Admin::notice(sanitize_key(wp_unslash($_GET['ft_notice']))) : ['', ''];

$edit_id = isset($_GET['edit']) ? (int) $_GET['edit'] : 0;
$editing = $edit_id ? FT_AI_Skills::get($edit_id) : null;
$f = [
    'id'          => $editing->id ?? 0,
    'name'        => $editing->name ?? '',
    'description' => $editing->description ?? '',
    'triggers'    => $editing->triggers ?? '',
    'instruction' => $editing->instruction ?? '',
    'priority'    => $editing->priority ?? 10,
    'status'      => $editing->status ?? 'disabled',
    'cta_label'   => $editing->cta_label ?? '',
    'cta_url'     => $editing->cta_url ?? '',
];
$last = count($skills) - 1;
?>
<div class="wrap ft-ai-wrap">
    <h1><?php esc_html_e('FarmTree AI — Skills', 'farmtree-ai-assistant'); ?></h1>
    <p class="ft-ai-muted"><?php esc_html_e('Skills are quick, guided answers. Enabled skills show as quick-reply chips in the chat. A skill can offer one approved link (CTA).', 'farmtree-ai-assistant'); ?></p>

    <?php if (!empty($notice[1])) : ?>
        <div class="notice notice-<?php echo esc_attr($notice[0]); ?> is-dismissible"><p><?php echo esc_html($notice[1]); ?></p></div>
    <?php endif; ?>

    <div class="ft-ai-grid2">
        <div class="ft-ai-panel">
            <h2><?php echo $editing ? esc_html__('Edit skill', 'farmtree-ai-assistant') : esc_html__('Add a skill', 'farmtree-ai-assistant'); ?></h2>
            <form method="post" action="<?php echo $post_url; ?>">
                <input type="hidden" name="action" value="ft_ai_skill_save">
                <?php wp_nonce_field('ft_ai_skill_save', '_ft_ai_nonce'); ?>
                <input type="hidden" name="id" value="<?php echo esc_attr((string) $f['id']); ?>">

                <p><label><strong><?php esc_html_e('Name', 'farmtree-ai-assistant'); ?></strong><br>
                    <input type="text" name="name" class="large-text" value="<?php echo esc_attr($f['name']); ?>" required></label></p>

                <p><label><strong><?php esc_html_e('Description', 'farmtree-ai-assistant'); ?></strong><br>
                    <textarea name="description" rows="2" class="large-text"><?php echo esc_textarea($f['description']); ?></textarea></label></p>

                <p><label><strong><?php esc_html_e('Trigger phrases', 'farmtree-ai-assistant'); ?></strong> <span class="ft-ai-muted"><?php esc_html_e('(one per line)', 'farmtree-ai-assistant'); ?></span><br>
                    <textarea name="triggers" rows="3" class="large-text ft-ai-mono"><?php echo esc_textarea($f['triggers']); ?></textarea></label></p>

                <p><label><strong><?php esc_html_e('Instruction to the assistant', 'farmtree-ai-assistant'); ?></strong><br>
                    <textarea name="instruction" rows="3" class="large-text"><?php echo esc_textarea($f['instruction']); ?></textarea></label></p>

                <div class="ft-ai-row2">
                    <p><label><strong><?php esc_html_e('CTA label', 'farmtree-ai-assistant'); ?></strong><br>
                        <input type="text" name="cta_label" class="regular-text" value="<?php echo esc_attr($f['cta_label']); ?>"></label></p>
                    <p><label><strong><?php esc_html_e('CTA link (approved URL)', 'farmtree-ai-assistant'); ?></strong><br>
                        <input type="url" name="cta_url" class="regular-text" value="<?php echo esc_attr($f['cta_url']); ?>" placeholder="https://tool.farmtree.earth/…"></label></p>
                </div>

                <div class="ft-ai-row2">
                    <p><label><strong><?php esc_html_e('Priority', 'farmtree-ai-assistant'); ?></strong><br>
                        <input type="number" name="priority" class="small-text" value="<?php echo esc_attr((string) $f['priority']); ?>" min="0" max="999"></label></p>
                    <p class="ft-ai-check"><label><input type="checkbox" name="enabled" value="1" <?php checked($f['status'], 'enabled'); ?>> <?php esc_html_e('Enabled (shown on the site)', 'farmtree-ai-assistant'); ?></label></p>
                </div>

                <p>
                    <button type="submit" class="button button-primary"><?php echo $editing ? esc_html__('Update skill', 'farmtree-ai-assistant') : esc_html__('Add skill', 'farmtree-ai-assistant'); ?></button>
                    <?php if ($editing) : ?>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=farmtree-ai-skills')); ?>" class="button"><?php esc_html_e('Cancel', 'farmtree-ai-assistant'); ?></a>
                    <?php endif; ?>
                </p>
            </form>
        </div>

        <div class="ft-ai-panel">
            <h2><?php esc_html_e('Guidance', 'farmtree-ai-assistant'); ?></h2>
            <ul class="ft-ai-list">
                <li><?php esc_html_e('Only enabled skills appear on the website. Seeded examples start disabled for review.', 'farmtree-ai-assistant'); ?></li>
                <li><?php esc_html_e('Use the approved Platform login and Demo registration links as CTAs where relevant.', 'farmtree-ai-assistant'); ?></li>
                <li><?php esc_html_e('Keep instructions grounded — the assistant still only states facts from approved Knowledge.', 'farmtree-ai-assistant'); ?></li>
                <li><?php esc_html_e('Lower priority numbers appear first. Use the arrows to reorder.', 'farmtree-ai-assistant'); ?></li>
            </ul>
        </div>
    </div>

    <div class="ft-ai-panel">
        <h2><?php esc_html_e('All skills', 'farmtree-ai-assistant'); ?> <span class="ft-ai-muted">(<?php echo esc_html((string) count($skills)); ?>)</span></h2>
        <?php if (empty($skills)) : ?>
            <p class="ft-ai-muted"><?php esc_html_e('No skills yet.', 'farmtree-ai-assistant'); ?></p>
        <?php else : ?>
            <table class="widefat striped ft-ai-table">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Order', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('Name', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('CTA', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('Status', 'farmtree-ai-assistant'); ?></th>
                        <th><?php esc_html_e('Actions', 'farmtree-ai-assistant'); ?></th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($skills as $i => $sk) : ?>
                    <tr>
                        <td class="ft-ai-order">
                            <span class="ft-ai-prio"><?php echo esc_html((string) $sk->priority); ?></span>
                            <span class="ft-ai-arrows">
                                <?php if ($i > 0) : ?>
                                    <form method="post" action="<?php echo $post_url; ?>">
                                        <input type="hidden" name="action" value="ft_ai_skill_move">
                                        <?php wp_nonce_field('ft_ai_skill_move', '_ft_ai_nonce'); ?>
                                        <input type="hidden" name="id" value="<?php echo esc_attr((string) $sk->id); ?>">
                                        <input type="hidden" name="dir" value="up">
                                        <button type="submit" class="button button-small" aria-label="<?php esc_attr_e('Move up', 'farmtree-ai-assistant'); ?>">↑</button>
                                    </form>
                                <?php endif; ?>
                                <?php if ($i < $last) : ?>
                                    <form method="post" action="<?php echo $post_url; ?>">
                                        <input type="hidden" name="action" value="ft_ai_skill_move">
                                        <?php wp_nonce_field('ft_ai_skill_move', '_ft_ai_nonce'); ?>
                                        <input type="hidden" name="id" value="<?php echo esc_attr((string) $sk->id); ?>">
                                        <input type="hidden" name="dir" value="down">
                                        <button type="submit" class="button button-small" aria-label="<?php esc_attr_e('Move down', 'farmtree-ai-assistant'); ?>">↓</button>
                                    </form>
                                <?php endif; ?>
                            </span>
                        </td>
                        <td>
                            <strong><?php echo esc_html($sk->name); ?></strong>
                            <?php if ($sk->description) : ?><br><span class="ft-ai-muted"><?php echo esc_html(wp_trim_words($sk->description, 18)); ?></span><?php endif; ?>
                        </td>
                        <td>
                            <?php if ($sk->cta_url) : ?>
                                <a href="<?php echo esc_url($sk->cta_url); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($sk->cta_label !== '' ? $sk->cta_label : __('link', 'farmtree-ai-assistant')); ?></a>
                            <?php else : ?>
                                <span class="ft-ai-muted">—</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span class="ft-ai-badge <?php echo $sk->status === 'enabled' ? 'ft-ai-badge--ok' : 'ft-ai-badge--no'; ?>"><?php echo esc_html($sk->status); ?></span>
                        </td>
                        <td class="ft-ai-actions">
                            <a href="<?php echo esc_url(admin_url('admin.php?page=farmtree-ai-skills&edit=' . (int) $sk->id)); ?>" class="button button-small"><?php esc_html_e('Edit', 'farmtree-ai-assistant'); ?></a>
                            <form method="post" action="<?php echo $post_url; ?>">
                                <input type="hidden" name="action" value="ft_ai_skill_toggle">
                                <?php wp_nonce_field('ft_ai_skill_toggle', '_ft_ai_nonce'); ?>
                                <input type="hidden" name="id" value="<?php echo esc_attr((string) $sk->id); ?>">
                                <input type="hidden" name="to" value="<?php echo $sk->status === 'enabled' ? 'disabled' : 'enabled'; ?>">
                                <button type="submit" class="button button-small"><?php echo $sk->status === 'enabled' ? esc_html__('Disable', 'farmtree-ai-assistant') : esc_html__('Enable', 'farmtree-ai-assistant'); ?></button>
                            </form>
                            <form method="post" action="<?php echo $post_url; ?>">
                                <input type="hidden" name="action" value="ft_ai_skill_duplicate">
                                <?php wp_nonce_field('ft_ai_skill_duplicate', '_ft_ai_nonce'); ?>
                                <input type="hidden" name="id" value="<?php echo esc_attr((string) $sk->id); ?>">
                                <button type="submit" class="button button-small"><?php esc_html_e('Duplicate', 'farmtree-ai-assistant'); ?></button>
                            </form>
                            <form method="post" action="<?php echo $post_url; ?>" onsubmit="return confirm('<?php echo esc_js(__('Delete this skill?', 'farmtree-ai-assistant')); ?>');">
                                <input type="hidden" name="action" value="ft_ai_skill_delete">
                                <?php wp_nonce_field('ft_ai_skill_delete', '_ft_ai_nonce'); ?>
                                <input type="hidden" name="id" value="<?php echo esc_attr((string) $sk->id); ?>">
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
