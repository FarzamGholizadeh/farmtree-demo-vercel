<?php
/**
 * AI provider adapter interface. All provider calls go through this contract so
 * the rest of the plugin never hard-codes a specific provider.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

interface FT_AI_Provider_Interface
{
    /**
     * Send a chat completion request.
     *
     * @param array $messages Array of ['role'=>'system|user|assistant','content'=>string].
     * @param array $opts     ['model'=>string,'temperature'=>float,'max_tokens'=>int].
     * @return array{ok:bool, text?:string, error?:string}
     */
    public function chat(array $messages, array $opts = []): array;

    /**
     * Validate connectivity/credentials without exposing the key.
     *
     * @return array{ok:bool, message:string}
     */
    public function test_connection(): array;

    public function name(): string;
}
