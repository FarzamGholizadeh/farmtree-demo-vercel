<?php
/**
 * Anthropic Messages API adapter. Secrets stay server-side and errors remain generic.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) exit;

class FT_AI_Provider_Anthropic implements FT_AI_Provider_Interface
{
    const DEFAULT_MODEL = 'claude-3-5-haiku-latest';
    const ENDPOINT = 'https://api.anthropic.com/v1/messages';
    const TIMEOUT = 25;

    public function name(): string { return 'anthropic'; }

    public function chat(array $messages, array $opts = []): array
    {
        $key = FT_AI_Settings::get_api_key();
        if ($key === '') return ['ok' => false, 'error' => 'not_configured'];

        $system = '';
        $conversation = [];
        foreach ($messages as $message) {
            if (($message['role'] ?? '') === 'system') {
                $system .= ($system === '' ? '' : "\n\n") . (string) ($message['content'] ?? '');
            } elseif (in_array($message['role'] ?? '', ['user', 'assistant'], true)) {
                $conversation[] = ['role' => $message['role'], 'content' => (string) ($message['content'] ?? '')];
            }
        }

        $body = [
            'model' => $opts['model'] ?? (FT_AI_Settings::get_model() ?: self::DEFAULT_MODEL),
            'system' => $system,
            'messages' => $conversation,
            'temperature' => isset($opts['temperature']) ? (float) $opts['temperature'] : (float) FT_AI_Settings::get('temperature'),
            'max_tokens' => isset($opts['max_tokens']) ? (int) $opts['max_tokens'] : 600,
        ];
        $response = wp_remote_post(self::ENDPOINT, [
            'timeout' => self::TIMEOUT,
            'headers' => ['x-api-key' => $key, 'anthropic-version' => '2023-06-01', 'content-type' => 'application/json'],
            'body' => wp_json_encode($body),
        ]);
        if (is_wp_error($response)) return ['ok' => false, 'error' => 'request_failed'];
        $code = (int) wp_remote_retrieve_response_code($response);
        if ($code === 401 || $code === 403) return ['ok' => false, 'error' => 'auth_failed'];
        if ($code < 200 || $code >= 300) return ['ok' => false, 'error' => 'provider_error'];
        $data = json_decode((string) wp_remote_retrieve_body($response), true);
        $text = $data['content'][0]['text'] ?? '';
        return is_string($text) && $text !== '' ? ['ok' => true, 'text' => $text] : ['ok' => false, 'error' => 'empty_response'];
    }

    public function test_connection(): array
    {
        $result = $this->chat([['role' => 'user', 'content' => 'Reply with the single word: ok']], ['max_tokens' => 5]);
        return !empty($result['ok'])
            ? ['ok' => true, 'message' => __('Connection successful.', 'farmtree-ai-assistant')]
            : ['ok' => false, 'message' => __('Connection test failed.', 'farmtree-ai-assistant')];
    }
}
