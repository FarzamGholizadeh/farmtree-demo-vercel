<?php
/**
 * Server-side URL scanner with SSRF protection. Fetches ONLY the submitted
 * public page, extracts the title and readable text, and never executes remote
 * scripts or imports media. Result is returned for admin review before saving.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Scanner
{
    const TIMEOUT       = 10;      // seconds
    const MAX_REDIRECTS = 2;
    const MAX_BYTES     = 750000;  // ~750 KB response cap
    const MAX_TEXT      = 20000;   // stored/extracted text cap (chars)

    /**
     * Scan a single URL. Returns ['ok'=>bool, 'title'=>..,'text'=>..] or
     * ['ok'=>false,'error'=>..].
     *
     * @return array
     */
    public static function scan(string $url): array
    {
        $url = trim($url);
        $parts = wp_parse_url($url);
        if (!$parts || empty($parts['scheme']) || empty($parts['host'])) {
            return self::err(__('Enter a full public URL including http:// or https://', 'farmtree-ai-assistant'));
        }
        $scheme = strtolower($parts['scheme']);
        if (!in_array($scheme, ['http', 'https'], true)) {
            return self::err(__('Only http and https URLs are allowed.', 'farmtree-ai-assistant'));
        }
        $host = strtolower($parts['host']);
        if (!self::host_is_public($host)) {
            return self::err(__('That destination is not allowed (localhost, private network or internal address).', 'farmtree-ai-assistant'));
        }

        $response = wp_safe_remote_get($url, [
            'timeout'             => self::TIMEOUT,
            'redirection'         => self::MAX_REDIRECTS,
            'limit_response_size' => self::MAX_BYTES,
            'reject_unsafe_urls'  => true,
            'user-agent'          => 'FarmTreeAI-KnowledgeScanner/1.0 (+' . home_url('/') . ')',
            'headers'             => ['Accept' => 'text/html,text/plain'],
        ]);

        if (is_wp_error($response)) {
            // Do not leak internal details; a generic message only.
            return self::err(__('Could not fetch the page. Check the URL and try again.', 'farmtree-ai-assistant'));
        }
        $code = (int) wp_remote_retrieve_response_code($response);
        if ($code < 200 || $code >= 400) {
            /* translators: %d: HTTP status code. */
            return self::err(sprintf(__('The page returned HTTP %d.', 'farmtree-ai-assistant'), $code));
        }
        $ctype = strtolower((string) wp_remote_retrieve_header($response, 'content-type'));
        if ($ctype && strpos($ctype, 'text/html') === false && strpos($ctype, 'text/plain') === false) {
            return self::err(__('Unsupported content type — only HTML/text pages can be scanned.', 'farmtree-ai-assistant'));
        }
        $body = (string) wp_remote_retrieve_body($response);
        if ($body === '') {
            return self::err(__('The page returned no readable content.', 'farmtree-ai-assistant'));
        }
        if (strlen($body) > self::MAX_BYTES) {
            $body = substr($body, 0, self::MAX_BYTES);
        }

        return [
            'ok'    => true,
            'title' => self::extract_title($body),
            'text'  => self::extract_text($body),
            'url'   => esc_url_raw($url),
        ];
    }

    /**
     * Only allow public hostnames. Rejects localhost, .local, and any resolved
     * IP in a private/reserved/loopback/link-local range.
     */
    private static function host_is_public(string $host): bool
    {
        $host = trim($host, '.');
        if ($host === '' || $host === 'localhost' || substr($host, -6) === '.local' || substr($host, -10) === '.localhost' || substr($host, -9) === '.internal') {
            return false;
        }

        $ips = [];
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            $ips[] = $host;
        } else {
            $v4 = gethostbynamel($host);
            if (is_array($v4)) {
                $ips = array_merge($ips, $v4);
            }
            if (function_exists('dns_get_record')) {
                $aaaa = @dns_get_record($host, DNS_AAAA);
                if (is_array($aaaa)) {
                    foreach ($aaaa as $r) {
                        if (!empty($r['ipv6'])) {
                            $ips[] = $r['ipv6'];
                        }
                    }
                }
            }
        }
        if (empty($ips)) {
            return false; // unresolvable -> refuse
        }
        foreach ($ips as $ip) {
            if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return false; // private / reserved / loopback / link-local
            }
        }
        return true;
    }

    /**
     * Extract the <title> (falling back to the first <h1>).
     */
    private static function extract_title(string $html): string
    {
        if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $m)) {
            return self::clean(html_entity_decode(wp_strip_all_tags($m[1]), ENT_QUOTES, 'UTF-8'), 191);
        }
        if (preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $html, $m)) {
            return self::clean(html_entity_decode(wp_strip_all_tags($m[1]), ENT_QUOTES, 'UTF-8'), 191);
        }
        return '';
    }

    /**
     * Remove scripts/styles/forms/nav/etc. and reduce to readable text. Never
     * executes anything; images/video are dropped.
     */
    private static function extract_text(string $html): string
    {
        // Drop the whole element for these (with their content).
        $html = preg_replace('#<(script|style|noscript|template|svg|form|iframe|object|embed|nav|header|footer|aside)\b[^>]*>.*?</\1>#is', ' ', $html) ?? $html;
        // Drop self-closing / media / comments.
        $html = preg_replace('#<!--.*?-->#s', ' ', $html) ?? $html;
        $html = preg_replace('#<(img|source|video|audio|input|link|meta|picture)\b[^>]*>#is', ' ', $html) ?? $html;
        // Turn block boundaries into newlines for readability.
        $html = preg_replace('#</(p|div|li|h[1-6]|section|article|tr|br)\s*>#i', "\n", $html) ?? $html;
        $text = wp_strip_all_tags($html);
        $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\n\s*\n\s*\n+/', "\n\n", $text) ?? $text;
        $text = trim($text);
        if (strlen($text) > self::MAX_TEXT) {
            $text = substr($text, 0, self::MAX_TEXT);
        }
        // Final safety: store as plain text only.
        return sanitize_textarea_field($text);
    }

    private static function clean(string $s, int $max): string
    {
        $s = sanitize_text_field($s);
        return (strlen($s) > $max) ? substr($s, 0, $max) : $s;
    }

    private static function err(string $msg): array
    {
        return ['ok' => false, 'error' => $msg];
    }
}
