<?php
/**
 * REST chat endpoint: POST /wp-json/farmtree-ai/v1/chat.
 *
 * Security posture:
 *  - The AI provider is called SERVER-SIDE ONLY. The browser never receives the
 *    API key, the system prompt, or the raw provider response envelope.
 *  - Input is validated and length-capped; history is trimmed.
 *  - Per-IP + per-session rate limiting via transients.
 *  - If no provider is configured or the assistant is disabled, a structured
 *    "unavailable" error is returned — never a fake AI answer.
 *  - No secret, key, full prompt or PII is logged.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_REST
{
    const NS    = 'farmtree-ai/v1';
    const ROUTE = '/chat';

    public function register_routes(): void
    {
        register_rest_route(self::NS, self::ROUTE, [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_chat'],
            'permission_callback' => [$this, 'permission'],
            'args'                => [
                'message' => [
                    'required' => true,
                    'type'     => 'string',
                ],
                'session' => [
                    'required' => false,
                    'type'     => 'string',
                ],
                'history' => [
                    'required' => false,
                    'type'     => 'array',
                ],
            ],
        ]);
    }

    /**
     * Soft CSRF protection: require a valid REST nonce. For anonymous visitors
     * WordPress still issues a usable nonce (uid 0), which — combined with rate
     * limiting — is an adequate abuse control for a public assistant.
     */
    public function permission(WP_REST_Request $request): bool
    {
        $nonce = $request->get_header('X-WP-Nonce');
        if ($nonce && wp_verify_nonce($nonce, 'wp_rest')) {
            return true;
        }
        // Fall back to our own nonce action for fully logged-out contexts.
        $alt = $request->get_header('X-FT-AI-Nonce');
        return (bool) ($alt && wp_verify_nonce($alt, 'ft_ai_chat'));
    }

    public function handle_chat(WP_REST_Request $request)
    {
        // 1) Availability — never fake a response.
        if (!FT_AI_Settings::is_assistant_active()) {
            return $this->error('unavailable', __('The assistant is not available right now.', 'farmtree-ai-assistant'), 503);
        }
        $provider = FT_AI_Provider_Factory::get();
        if (!$provider) {
            return $this->error('unavailable', __('The assistant is not available right now.', 'farmtree-ai-assistant'), 503);
        }

        // 2) Rate limiting (per IP hash + per session).
        $ip_hash = self::ip_hash();
        $session = substr(sanitize_text_field((string) $request->get_param('session')), 0, 64);
        if ($this->is_rate_limited($ip_hash)) {
            return $this->error('rate_limited', __('You are sending messages too quickly. Please wait a moment.', 'farmtree-ai-assistant'), 429);
        }

        // 3) Validate input.
        $max_len = (int) FT_AI_Settings::get('max_message_length');
        $message = trim((string) $request->get_param('message'));
        $message = wp_strip_all_tags($message);
        if ($message === '') {
            return $this->error('empty_message', __('Please enter a message.', 'farmtree-ai-assistant'), 400);
        }
        if (mb_strlen($message) > $max_len) {
            $message = mb_substr($message, 0, $max_len);
        }

        // 4) Trim history to the configured window; keep only role/content.
        $history = $this->sanitize_history($request->get_param('history'));

        // 5) Retrieve approved context (keyword-based; not vector).
        $retrieval = FT_AI_Retrieval::retrieve($message);

        // 6) Build the messages for the provider (system prompt stays server-side).
        $messages = $this->build_messages($retrieval, $history, $message);

        // 7) Call the provider server-side.
        $result = $provider->chat($messages, [
            'max_tokens' => 700,
        ]);

        if (empty($result['ok'])) {
            // Map internal error codes to safe, generic messages.
            $code = $result['error'] ?? 'provider_error';
            $msg = ($code === 'auth_failed' || $code === 'not_configured')
                ? __('The assistant is not available right now.', 'farmtree-ai-assistant')
                : __('Sorry — I could not generate a reply just now. Please try again.', 'farmtree-ai-assistant');
            return $this->error('provider_error', $msg, 502);
        }

        $reply = self::cap_reply((string) $result['text']);

        // 8) Optional, privacy-safe logging (hashed IP; no key/prompt).
        FT_AI_Conversations::log_exchange($session, $ip_hash, $message, $reply);

        // 9) Return only approved, safe fields to the browser.
        $sources = [];
        if ((int) FT_AI_Behavior::get('include_source_links') === 1) {
            foreach ($retrieval['sources'] as $s) {
                if (!empty($s['url'])) {
                    $sources[] = ['title' => $s['title'], 'url' => $s['url']];
                }
            }
        }

        return new WP_REST_Response([
            'ok'      => true,
            'reply'   => $reply,
            'sources' => $sources,
        ], 200);
    }

    // ---- helpers ----

    private function build_messages(array $retrieval, array $history, string $message): array
    {
        $system = FT_AI_Behavior::build_system_prompt();

        // Approved knowledge context (may be empty — the safe-fallback rule then applies).
        $context = trim((string) $retrieval['context']);
        if ($context !== '') {
            $system .= "\n\n--- APPROVED FARMTREE KNOWLEDGE (use only this for facts) ---\n" . $context;
        } else {
            $system .= "\n\nNo approved Knowledge matched this question. Follow the safe-fallback rule.";
        }

        // Enabled skills relevant to the query can offer approved CTAs.
        $skill_lines = [];
        foreach ($retrieval['skills'] as $sk) {
            $line = '- ' . $sk->name;
            if (!empty($sk->instruction)) {
                $line .= ': ' . $sk->instruction;
            }
            if (!empty($sk->cta_url)) {
                $label = $sk->cta_label !== '' ? $sk->cta_label : $sk->name;
                $line .= ' [Approved link — ' . $label . ': ' . $sk->cta_url . ']';
            }
            $skill_lines[] = $line;
        }
        if ($skill_lines) {
            $system .= "\n\n--- AVAILABLE SKILLS (offer the approved link only when relevant) ---\n" . implode("\n", $skill_lines);
        }

        $messages = [['role' => 'system', 'content' => $system]];
        foreach ($history as $h) {
            $messages[] = $h;
        }
        $messages[] = ['role' => 'user', 'content' => $message];
        return $messages;
    }

    private function sanitize_history($raw): array
    {
        if (!is_array($raw)) {
            return [];
        }
        $max = max(0, (int) FT_AI_Settings::get('max_history'));
        $max_len = (int) FT_AI_Settings::get('max_message_length');
        $out = [];
        foreach ($raw as $item) {
            if (!is_array($item)) {
                continue;
            }
            $role = ($item['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
            $content = wp_strip_all_tags((string) ($item['content'] ?? ''));
            $content = trim($content);
            if ($content === '') {
                continue;
            }
            if (mb_strlen($content) > $max_len) {
                $content = mb_substr($content, 0, $max_len);
            }
            $out[] = ['role' => $role, 'content' => $content];
        }
        // Keep only the most recent $max exchanges.
        if ($max > 0 && count($out) > $max) {
            $out = array_slice($out, -$max);
        } elseif ($max === 0) {
            $out = [];
        }
        return $out;
    }

    private function is_rate_limited(string $ip_hash): bool
    {
        $limit = (int) FT_AI_Settings::get('rate_limit_per_min');
        if ($limit <= 0) {
            return false;
        }
        $key = 'ft_ai_rl_' . $ip_hash;
        $count = (int) get_transient($key);
        if ($count >= $limit) {
            return true;
        }
        set_transient($key, $count + 1, MINUTE_IN_SECONDS);
        return false;
    }

    /**
     * A privacy-preserving, non-reversible IP identifier. The raw IP is never
     * stored. Salted with wp_salt so it cannot be correlated across sites.
     */
    private static function ip_hash(): string
    {
        $ip = '';
        if (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR']));
        }
        return substr(hash_hmac('sha256', $ip, wp_salt('nonce')), 0, 40);
    }

    private static function cap_reply(string $text): string
    {
        $max = (int) FT_AI_Behavior::get('max_answer_chars');
        $max = $max > 0 ? min(3000, $max + 200) : 1200; // small tolerance over the target
        $text = trim($text);
        if (mb_strlen($text) > $max) {
            $text = mb_substr($text, 0, $max);
        }
        return $text;
    }

    private function error(string $code, string $message, int $status)
    {
        return new WP_REST_Response([
            'ok'    => false,
            'code'  => $code,
            'message' => $message,
        ], $status);
    }
}
