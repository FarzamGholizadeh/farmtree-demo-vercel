<?php
/**
 * OpenAI-compatible provider adapter (Chat Completions). Works with OpenAI and
 * OpenAI-compatible endpoints. The API key is read server-side from a constant
 * and is NEVER logged or returned. Requests are server-to-server only.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Provider_OpenAI implements FT_AI_Provider_Interface
{
    const DEFAULT_MODEL    = 'gpt-4o-mini';
    const DEFAULT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    const TIMEOUT          = 25;

    public function name(): string
    {
        return 'openai';
    }

    private function endpoint(): string
    {
        if (defined('FARMTREE_AI_ENDPOINT') && FARMTREE_AI_ENDPOINT) {
            return esc_url_raw((string) FARMTREE_AI_ENDPOINT);
        }
        return self::DEFAULT_ENDPOINT;
    }

    public function chat(array $messages, array $opts = []): array
    {
        $key = FT_AI_Settings::get_api_key();
        if ($key === '') {
            return ['ok' => false, 'error' => 'not_configured'];
        }
        $model = $opts['model'] ?? (FT_AI_Settings::get_model() ?: self::DEFAULT_MODEL);
        $body = [
            'model'       => $model,
            'messages'    => $messages,
            'temperature' => isset($opts['temperature']) ? (float) $opts['temperature'] : (float) FT_AI_Settings::get('temperature'),
            'max_tokens'  => isset($opts['max_tokens']) ? (int) $opts['max_tokens'] : 600,
        ];

        $response = wp_remote_post($this->endpoint(), [
            'timeout' => self::TIMEOUT,
            'headers' => [
                'Authorization' => 'Bearer ' . $key,
                'Content-Type'  => 'application/json',
            ],
            'body'    => wp_json_encode($body),
        ]);

        if (is_wp_error($response)) {
            // Generic error only — never include the key or full request.
            return ['ok' => false, 'error' => 'request_failed'];
        }
        $code = (int) wp_remote_retrieve_response_code($response);
        if ($code === 401 || $code === 403) {
            return ['ok' => false, 'error' => 'auth_failed'];
        }
        if ($code < 200 || $code >= 300) {
            return ['ok' => false, 'error' => 'provider_error'];
        }
        $data = json_decode((string) wp_remote_retrieve_body($response), true);
        $text = $data['choices'][0]['message']['content'] ?? '';
        if (!is_string($text) || $text === '') {
            return ['ok' => false, 'error' => 'empty_response'];
        }
        return ['ok' => true, 'text' => $text];
    }

    public function test_connection(): array
    {
        if (FT_AI_Settings::get_api_key() === '') {
            return ['ok' => false, 'message' => __('No API key constant is set.', 'farmtree-ai-assistant')];
        }
        $res = $this->chat(
            [
                ['role' => 'system', 'content' => 'Reply with the single word: ok'],
                ['role' => 'user', 'content' => 'ping'],
            ],
            ['max_tokens' => 5]
        );
        if (!empty($res['ok'])) {
            return ['ok' => true, 'message' => __('Connection successful.', 'farmtree-ai-assistant')];
        }
        $map = [
            'auth_failed'    => __('Authentication failed — check the API key.', 'farmtree-ai-assistant'),
            'not_configured' => __('No API key constant is set.', 'farmtree-ai-assistant'),
            'request_failed' => __('Could not reach the provider.', 'farmtree-ai-assistant'),
        ];
        return ['ok' => false, 'message' => $map[$res['error'] ?? ''] ?? __('Connection test failed.', 'farmtree-ai-assistant')];
    }
}
