<?php
/**
 * Public chat widget. Renders ONLY when the assistant is truly active
 * (admin switch on AND a provider configured on the server). When inactive,
 * nothing is enqueued or printed — so the site never shows a dead or fake chat.
 *
 * The browser receives no API key, no system prompt and no provider envelope —
 * only the public REST URL, a nonce, and the enabled skill labels.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Frontend
{
    public function hooks(): void
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueue']);
        add_action('wp_footer', [$this, 'render']);
        // Let the theme defer its own built-in assistant when this one is live.
        add_filter('farmtree_ai_plugin_active', [$this, 'is_active']);
    }

    public function is_active(): bool
    {
        return FT_AI_Settings::is_assistant_active();
    }

    public function enqueue(): void
    {
        if (!$this->is_active()) {
            return;
        }
        wp_enqueue_style('ft-ai-chat', FARMTREE_AI_URL . 'public/css/chat.css', [], FARMTREE_AI_VERSION);
        wp_enqueue_script('ft-ai-chat', FARMTREE_AI_URL . 'public/js/chat.js', [], FARMTREE_AI_VERSION, true);

        $skills = [];
        foreach (FT_AI_Skills::enabled() as $sk) {
            $skills[] = ['id' => (int) $sk->id, 'label' => $sk->name];
        }

        wp_localize_script('ft-ai-chat', 'FT_AI_CFG', [
            'restUrl'    => esc_url_raw(rest_url(FT_AI_REST::NS . FT_AI_REST::ROUTE)),
            'nonce'      => wp_create_nonce('wp_rest'),
            'altNonce'   => wp_create_nonce('ft_ai_chat'),
            'skills'     => $skills,
            'maxLen'     => (int) FT_AI_Settings::get('max_message_length'),
            'maxHistory' => (int) FT_AI_Settings::get('max_history'),
            /** Selector(s) that indicate the theme's mobile (Bento) menu is open. */
            'menuOpenSelector' => apply_filters('farmtree_ai_menu_open_selector', 'body.menu-open, body.ft-menu-open, body.mobile-nav-open, html.menu-open'),
            'i18n' => [
                'title'       => __('FarmTree Assistant', 'farmtree-ai-assistant'),
                'launch'      => __('Open the FarmTree assistant', 'farmtree-ai-assistant'),
                'close'       => __('Close', 'farmtree-ai-assistant'),
                'placeholder' => __('Ask about FarmTree…', 'farmtree-ai-assistant'),
                'send'        => __('Send', 'farmtree-ai-assistant'),
                'greeting'    => __('Hi! I can help you learn about FarmTree. Ask a question or pick a topic below.', 'farmtree-ai-assistant'),
                'thinking'    => __('Thinking…', 'farmtree-ai-assistant'),
                'error'       => __('Something went wrong. Please try again.', 'farmtree-ai-assistant'),
                'retry'       => __('Retry', 'farmtree-ai-assistant'),
                'unavailable' => __('The assistant is unavailable right now.', 'farmtree-ai-assistant'),
                'rateLimited' => __('Please wait a moment before sending another message.', 'farmtree-ai-assistant'),
                'sources'     => __('Sources', 'farmtree-ai-assistant'),
            ],
        ]);
    }

    public function render(): void
    {
        if (!$this->is_active()) {
            return;
        }
        ?>
        <div id="ft-ai-root" class="ft-ai-chat" hidden>
            <button type="button" id="ft-ai-launcher" class="ft-ai-launcher" aria-haspopup="dialog" aria-expanded="false" aria-controls="ft-ai-panel">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2v3.4l3.4-1.9c1.1.3 2.3.5 3.6.5 5.5 0 10-3.9 10-8.7S17.5 3 12 3Z"/></svg>
                <span class="ft-ai-launcher__label"><?php esc_html_e('Ask FarmTree', 'farmtree-ai-assistant'); ?></span>
            </button>

            <section id="ft-ai-panel" class="ft-ai-panel" role="dialog" aria-modal="false" aria-labelledby="ft-ai-title" hidden>
                <header class="ft-ai-head">
                    <span class="ft-ai-head__brand" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2v3.4l3.4-1.9c1.1.3 2.3.5 3.6.5 5.5 0 10-3.9 10-8.7S17.5 3 12 3Z"/></svg>
                    </span>
                    <h2 id="ft-ai-title" class="ft-ai-head__title"></h2>
                    <button type="button" id="ft-ai-close" class="ft-ai-close" aria-label="<?php esc_attr_e('Close', 'farmtree-ai-assistant'); ?>">
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                    </button>
                </header>

                <div id="ft-ai-log" class="ft-ai-log" role="log" aria-live="polite" aria-atomic="false"></div>

                <div id="ft-ai-quick" class="ft-ai-quick" role="group" aria-label="<?php esc_attr_e('Suggested topics', 'farmtree-ai-assistant'); ?>"></div>

                <form id="ft-ai-form" class="ft-ai-form">
                    <label for="ft-ai-input" class="screen-reader-text ft-ai-sr"><?php esc_html_e('Your message', 'farmtree-ai-assistant'); ?></label>
                    <textarea id="ft-ai-input" class="ft-ai-input" rows="1" autocomplete="off"></textarea>
                    <button type="submit" id="ft-ai-send" class="ft-ai-send" aria-label="<?php esc_attr_e('Send', 'farmtree-ai-assistant'); ?>">
                        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>
                    </button>
                </form>
            </section>
        </div>
        <?php
    }
}
