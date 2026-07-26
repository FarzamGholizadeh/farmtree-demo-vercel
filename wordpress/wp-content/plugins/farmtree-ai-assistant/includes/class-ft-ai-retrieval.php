<?php
/**
 * Lightweight keyword retrieval (NOT semantic/vector). Tokenizes the query,
 * scores enabled Knowledge sources and Skills by term overlap, and returns a
 * capped set of the most relevant approved excerpts + matching skills.
 *
 * @package FarmTree_AI_Assistant
 */

if (!defined('ABSPATH')) {
    exit;
}

class FT_AI_Retrieval
{
    const MAX_SOURCES     = 4;
    const MAX_EXCERPT_LEN = 1200;
    const MAX_CONTEXT_LEN = 6000;

    private const STOP = ['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'is', 'are', 'was', 'were', 'do', 'does', 'what', 'how', 'can', 'you', 'i', 'we', 'it', 'with', 'about', 'me', 'my', 'our', 'your'];

    /**
     * @return string[] Lowercased content tokens (>=3 chars, no stopwords).
     */
    public static function tokenize(string $text): array
    {
        $text = strtolower($text);
        $text = preg_replace('/[^a-z0-9\s\-]+/', ' ', $text) ?? $text;
        $parts = preg_split('/\s+/', trim($text)) ?: [];
        $out = [];
        foreach ($parts as $t) {
            if (strlen($t) >= 3 && !in_array($t, self::STOP, true)) {
                $out[] = $t;
            }
        }
        return array_values(array_unique($out));
    }

    /**
     * Retrieve context for a query.
     *
     * @return array{sources: array<int,array{title:string,url:string,excerpt:string,score:int}>, skills: array<int,object>, context: string}
     */
    public static function retrieve(string $query): array
    {
        $terms = self::tokenize($query);
        $sources = [];
        if (!empty($terms)) {
            foreach (FT_AI_Knowledge::enabled() as $k) {
                $hay = strtolower(($k->title ?? '') . ' ' . ($k->content ?? ''));
                $score = 0;
                foreach ($terms as $t) {
                    $score += substr_count($hay, $t);
                }
                if ($score > 0) {
                    $sources[] = [
                        'title'   => (string) $k->title,
                        'url'     => (string) $k->url,
                        'excerpt' => self::excerpt((string) $k->content, $terms),
                        'score'   => $score,
                    ];
                }
            }
            usort($sources, static fn($a, $b) => $b['score'] <=> $a['score']);
            $sources = array_slice($sources, 0, self::MAX_SOURCES);
        }

        // Score enabled skills (by trigger/name/description overlap).
        $skills = [];
        foreach (FT_AI_Skills::enabled() as $s) {
            $hay = strtolower(($s->name ?? '') . ' ' . ($s->description ?? '') . ' ' . ($s->triggers ?? ''));
            $score = 0;
            foreach ($terms as $t) {
                $score += substr_count($hay, $t);
            }
            if ($score > 0) {
                $s->_score = $score;
                $skills[] = $s;
            }
        }
        usort($skills, static fn($a, $b) => ($b->_score <=> $a->_score) ?: ($a->priority <=> $b->priority));

        // Build the capped context string sent to the provider.
        $ctx = '';
        foreach ($sources as $s) {
            $block = "### " . $s['title'] . ($s['url'] ? " ({$s['url']})" : '') . "\n" . $s['excerpt'] . "\n\n";
            if (strlen($ctx) + strlen($block) > self::MAX_CONTEXT_LEN) {
                break;
            }
            $ctx .= $block;
        }

        return ['sources' => $sources, 'skills' => $skills, 'context' => trim($ctx)];
    }

    /**
     * A term-centred excerpt of the content, capped in length.
     */
    private static function excerpt(string $content, array $terms): string
    {
        $content = trim(preg_replace('/\s+/', ' ', $content) ?? $content);
        if ($content === '') {
            return '';
        }
        $lc = strtolower($content);
        $pos = false;
        foreach ($terms as $t) {
            $p = strpos($lc, $t);
            if ($p !== false) {
                $pos = $p;
                break;
            }
        }
        if ($pos === false) {
            return substr($content, 0, self::MAX_EXCERPT_LEN);
        }
        $start = max(0, $pos - 200);
        return trim(substr($content, $start, self::MAX_EXCERPT_LEN));
    }
}
