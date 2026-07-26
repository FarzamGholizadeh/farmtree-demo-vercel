<?php
/**
 * Settings: non-secret configuration in a WP option; secrets ONLY from
 * wp-config constants / environment. The API key is never stored in the DB
 * and never returned to the browser.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Settings
{
    const OPTION = 'ft_ai_settings';

    /**
     * Default non-secret settings.
     */
    public static function defaults(): array
    {
        return [
            'enabled'              => 0,          // admin master switch (frontend still requires a configured provider)
            'model'               => '',          // optional DB override; the constant wins if set
            'temperature'         => 0.2,
            'max_message_length'  => 1000,
            'max_history'         => 8,
            'rate_limit_per_min'  => 12,
            'conversation_logging' => 0,
            'remove_data_on_uninstall' => 0,
        ];
    }

    public static function get_all(): array
    {
        $saved = get_option(self::OPTION, []);
        if (!is_array($saved)) {
            $saved = [];
        }
        return wp_parse_args($saved, self::defaults());
    }

    public static function get(string $key)
    {
        $all = self::get_all();
        return $all[$key] ?? null;
    }

    /**
     * Sanitize + persist non-secret settings. Never accepts an API key.
     *
     * @param array $input Raw input.
     */
    public static function update(array $input): void
    {
        $d = self::defaults();
        $out = [
            'enabled'                  => empty($input['enabled']) ? 0 : 1,
            'model'                    => isset($input['model']) ? sanitize_text_field((string) $input['model']) : $d['model'],
            'temperature'              => isset($input['temperature']) ? max(0, min(1, (float) $input['temperature'])) : $d['temperature'],
            'max_message_length'       => isset($input['max_message_length']) ? max(200, min(4000, (int) $input['max_message_length'])) : $d['max_message_length'],
            'max_history'              => isset($input['max_history']) ? max(0, min(30, (int) $input['max_history'])) : $d['max_history'],
            'rate_limit_per_min'       => isset($input['rate_limit_per_min']) ? max(1, min(120, (int) $input['rate_limit_per_min'])) : $d['rate_limit_per_min'],
            'conversation_logging'     => empty($input['conversation_logging']) ? 0 : 1,
            'remove_data_on_uninstall' => empty($input['remove_data_on_uninstall']) ? 0 : 1,
        ];
        update_option(self::OPTION, $out);
    }

    // ---- provider / secrets (server-side only) ----

    public static function get_provider_name(): string
    {
        if (defined('FARMTREE_AI_PROVIDER') && FARMTREE_AI_PROVIDER) {
            return sanitize_key((string) FARMTREE_AI_PROVIDER);
        }
        $env = getenv('FARMTREE_AI_PROVIDER');
        return $env ? sanitize_key($env) : '';
    }

    public static function get_model(): string
    {
        if (defined('FARMTREE_AI_MODEL') && FARMTREE_AI_MODEL) {
            return sanitize_text_field((string) FARMTREE_AI_MODEL);
        }
        $env = getenv('FARMTREE_AI_MODEL');
        if ($env) {
            return sanitize_text_field($env);
        }
        $opt = self::get('model');
        return $opt ? (string) $opt : '';
    }

    /**
     * The API key — read ONLY from a constant/environment, never the DB, never
     * output anywhere. Callers must never echo or log the return value.
     */
    public static function get_api_key(): string
    {
        if (defined('FARMTREE_AI_API_KEY') && FARMTREE_AI_API_KEY) {
            return (string) FARMTREE_AI_API_KEY;
        }
        $env = getenv('FARMTREE_AI_API_KEY');
        return $env ? (string) $env : '';
    }

    /**
     * A provider is "configured" only when both a provider name and a
     * non-empty API key are present (from constants/env).
     */
    public static function is_provider_configured(): bool
    {
        return self::get_provider_name() !== '' && self::get_api_key() !== '';
    }

    /**
     * The assistant is truly "active" only when the admin switch is on AND a
     * provider is configured. Never report active on the switch alone.
     */
    public static function is_assistant_active(): bool
    {
        return (int) self::get('enabled') === 1 && self::is_provider_configured();
    }
}
