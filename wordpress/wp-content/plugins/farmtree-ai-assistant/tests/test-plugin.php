<?php
/**
 * PHPUnit tests (run in CI against the WordPress test suite).
 *
 * These exercise the plugin's security-critical and data-model behavior:
 *  - the API key is never configured/exposed from the DB;
 *  - the safe-fallback rule is always present in the system prompt;
 *  - seeded skills are DISABLED and use the approved external URLs;
 *  - Knowledge CRUD and keyword retrieval behave;
 *  - the SSRF host filter rejects private/reserved hosts.
 *
 * @package FarmTree_AI_Assistant
 */

class FT_AI_Plugin_Test extends WP_UnitTestCase
{
    public function test_provider_unconfigured_by_default(): void
    {
        $this->assertFalse(FT_AI_Settings::is_provider_configured(), 'No constant → not configured.');
        $this->assertFalse(FT_AI_Settings::is_assistant_active(), 'Not configured → never active.');
        $this->assertSame('', FT_AI_Settings::get_api_key(), 'Key is empty without a constant.');
    }

    public function test_enabling_switch_alone_does_not_activate(): void
    {
        FT_AI_Settings::update(['enabled' => 1]);
        // Still no provider constant → must not be "active".
        $this->assertFalse(FT_AI_Settings::is_assistant_active());
    }

    public function test_system_prompt_always_contains_safe_fallback(): void
    {
        $prompt = FT_AI_Behavior::build_system_prompt();
        $this->assertStringContainsString(FT_AI_Behavior::SAFE_FALLBACK_RULE, $prompt);
        // Even if an admin clears guardrails, the rule persists.
        FT_AI_Behavior::update(['guardrails' => '']);
        $this->assertStringContainsString('needs confirmation from the FarmTree team', FT_AI_Behavior::build_system_prompt());
    }

    public function test_tokenize_drops_stopwords_and_short_tokens(): void
    {
        $tokens = FT_AI_Retrieval::tokenize('What is the FarmTree platform?');
        $this->assertContains('farmtree', $tokens);
        $this->assertContains('platform', $tokens);
        $this->assertNotContains('is', $tokens);
        $this->assertNotContains('the', $tokens);
    }

    public function test_seeded_skills_are_disabled_with_approved_urls(): void
    {
        FT_AI_Skills::maybe_seed_examples();
        $all = FT_AI_Skills::all();
        $this->assertCount(5, $all);
        foreach ($all as $s) {
            $this->assertSame('disabled', $s->status, 'Seeded skills must ship disabled.');
        }
        $byName = [];
        foreach ($all as $s) {
            $byName[$s->name] = $s;
        }
        $this->assertSame('https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F', $byName['Access the FarmTree Platform']->cta_url);
        $this->assertSame('https://tool.farmtree.earth/Identity/Account/Register', $byName['Book a Demo']->cta_url);
    }

    public function test_seed_is_idempotent(): void
    {
        FT_AI_Skills::maybe_seed_examples();
        FT_AI_Skills::maybe_seed_examples();
        $this->assertCount(5, FT_AI_Skills::all(), 'Seeding twice must not duplicate.');
    }

    public function test_knowledge_crud_roundtrip(): void
    {
        $id = FT_AI_Knowledge::create(['title' => 'About', 'type' => 'text', 'content' => 'FarmTree models agroforestry.', 'status' => 'enabled']);
        $this->assertGreaterThan(0, $id);
        $this->assertCount(1, FT_AI_Knowledge::enabled());
        FT_AI_Knowledge::set_status($id, 'disabled');
        $this->assertCount(0, FT_AI_Knowledge::enabled());
        $this->assertTrue(FT_AI_Knowledge::delete($id));
    }

    public function test_retrieval_scores_matching_knowledge(): void
    {
        FT_AI_Knowledge::create(['title' => 'Platform', 'type' => 'text', 'content' => 'The FarmTree platform helps model agroforestry scenarios.', 'status' => 'enabled']);
        $res = FT_AI_Retrieval::retrieve('Tell me about the agroforestry platform');
        $this->assertNotEmpty($res['sources']);
        $this->assertStringContainsString('agroforestry', strtolower($res['context']));
    }

    public function test_ssrf_rejects_private_hosts(): void
    {
        $m = new ReflectionMethod('FT_AI_Scanner', 'host_is_public');
        $m->setAccessible(true);
        $this->assertFalse($m->invoke(null, 'localhost'));
        $this->assertFalse($m->invoke(null, '127.0.0.1'));
        $this->assertFalse($m->invoke(null, '10.0.0.5'));
        $this->assertFalse($m->invoke(null, '192.168.1.1'));
        $this->assertFalse($m->invoke(null, '169.254.169.254'), 'Cloud metadata endpoint must be refused.');
        $this->assertFalse($m->invoke(null, 'router.internal'));
    }

    public function test_settings_never_store_api_key(): void
    {
        FT_AI_Settings::update(['api_key' => 'sk-should-be-ignored', 'enabled' => 1]);
        $stored = get_option(FT_AI_Settings::OPTION);
        $this->assertArrayNotHasKey('api_key', $stored, 'The settings option must never hold a key.');
    }
}
