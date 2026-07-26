<?php
/**
 * Behavior: AI role, brand voice, guardrails and language/answer settings.
 * Stored as a sanitized WP option. Defaults are intentionally generic and do
 * NOT invent FarmTree policies, facts, prices or legal claims.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Behavior
{
    const OPTION = 'ft_ai_behavior';

    /** The non-negotiable safety rule always appended to guardrails. */
    const SAFE_FALLBACK_RULE = 'When an answer is not present in approved FarmTree Knowledge, clearly say that the information needs confirmation from the FarmTree team. Never invent facts, prices, policies or legal claims.';

    public static function defaults(): array
    {
        return [
            'ai_role'            => 'You are the FarmTree website assistant. Help visitors understand FarmTree and find the right information, using only the approved FarmTree Knowledge provided to you.',
            'brand_voice'        => 'Clear, professional, warm and concise. Plain English. No hype, no unverified claims.',
            'guardrails'         => 'Only answer using the approved FarmTree Knowledge supplied in context. Do not give financial, legal or agronomic advice. Do not make commitments on behalf of FarmTree.',
            'default_language'   => 'en',
            'auto_detect_language' => 1,
            'reply_same_language'  => 1,
            'max_answer_chars'   => 900,
            'handoff_message'    => 'I can connect you with the FarmTree team for this. Please use "Request a demo" or "Ask for a quotation", or contact FarmTree directly.',
            'escalation_contact' => '', // e.g. an email — left empty; admin fills in an approved contact
            'include_source_links' => 1,
            'retain_history'     => 0,
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

    public static function update(array $input): void
    {
        $d = self::defaults();
        $out = [
            'ai_role'              => isset($input['ai_role']) ? sanitize_textarea_field((string) $input['ai_role']) : $d['ai_role'],
            'brand_voice'          => isset($input['brand_voice']) ? sanitize_textarea_field((string) $input['brand_voice']) : $d['brand_voice'],
            'guardrails'           => isset($input['guardrails']) ? sanitize_textarea_field((string) $input['guardrails']) : $d['guardrails'],
            'default_language'     => isset($input['default_language']) ? sanitize_key((string) $input['default_language']) : $d['default_language'],
            'auto_detect_language' => empty($input['auto_detect_language']) ? 0 : 1,
            'reply_same_language'  => empty($input['reply_same_language']) ? 0 : 1,
            'max_answer_chars'     => isset($input['max_answer_chars']) ? max(150, min(3000, (int) $input['max_answer_chars'])) : $d['max_answer_chars'],
            'handoff_message'      => isset($input['handoff_message']) ? sanitize_textarea_field((string) $input['handoff_message']) : $d['handoff_message'],
            'escalation_contact'   => isset($input['escalation_contact']) ? sanitize_text_field((string) $input['escalation_contact']) : $d['escalation_contact'],
            'include_source_links' => empty($input['include_source_links']) ? 0 : 1,
            'retain_history'       => empty($input['retain_history']) ? 0 : 1,
        ];
        update_option(self::OPTION, $out);
    }

    /**
     * Build the system prompt from behavior settings. The safe-fallback rule is
     * always enforced regardless of admin edits.
     */
    public static function build_system_prompt(): string
    {
        $b = self::get_all();
        $parts = [];
        $parts[] = trim((string) $b['ai_role']);
        $parts[] = 'Brand voice: ' . trim((string) $b['brand_voice']);
        $parts[] = 'Guardrails: ' . trim((string) $b['guardrails']);
        $parts[] = self::SAFE_FALLBACK_RULE;
        if (!empty($b['reply_same_language'])) {
            $parts[] = 'Reply in the same language as the visitor when detectable; otherwise use "' . $b['default_language'] . '".';
        }
        $parts[] = 'Keep answers under approximately ' . (int) $b['max_answer_chars'] . ' characters.';
        return implode("\n\n", array_filter($parts));
    }
}
