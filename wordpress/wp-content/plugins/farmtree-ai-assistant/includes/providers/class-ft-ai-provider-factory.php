<?php
/**
 * Provider factory. Returns a provider adapter for the configured provider, or
 * null when no provider is configured. Extend the map to add providers.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Provider_Factory
{
    /**
     * @return FT_AI_Provider_Interface|null
     */
    public static function get(): ?FT_AI_Provider_Interface
    {
        if (!FT_AI_Settings::is_provider_configured()) {
            return null;
        }
        $name = FT_AI_Settings::get_provider_name();
        $map = apply_filters('farmtree_ai_providers', [
            'openai' => 'FT_AI_Provider_OpenAI',
            // OpenAI-compatible endpoints (Azure/OpenRouter/local gateway) can reuse the OpenAI adapter
            'openai-compatible' => 'FT_AI_Provider_OpenAI',
        ]);
        if (isset($map[$name]) && class_exists($map[$name])) {
            return new $map[$name]();
        }
        return null;
    }

    /**
     * @return string[] Known provider slugs (for display only).
     */
    public static function known(): array
    {
        return array_keys(apply_filters('farmtree_ai_providers', ['openai' => 1, 'openai-compatible' => 1]));
    }
}
