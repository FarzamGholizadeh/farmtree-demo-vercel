<?php
/**
 * Canonical content architecture manifest.
 *
 * FT-NATIVE-001 intentionally registers no post types, taxonomies or settings.
 * Each model becomes runtime behavior only with its matching editor, template,
 * migration, permission and SEO implementation in FT-NATIVE-003.
 *
 * @package FarmTree_Content
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Return the approved future FarmTree content ownership map.
 *
 * @return array<string, mixed>
 */
function farmtree_content_architecture(): array
{
    $architecture = [
        'status' => 'foundation_only',
        'owner' => 'farmtree-content',
        'legacy_compatibility' => [
            'plugin' => 'farmtree-core',
            'policy' => 'Do not duplicate active post types, taxonomies, options or capabilities.',
        ],
        'locale_routing' => [
            'strategy' => 'path_prefix',
            'default' => 'en',
            'routes' => [
                'en' => [
                    'locale' => 'en_GB',
                    'path' => '/',
                    'status' => 'active',
                    'published' => true,
                ],
                'nl' => [
                    'locale' => 'nl_NL',
                    'path' => '/nl/',
                    'status' => 'reserved',
                    'published' => false,
                ],
                'de' => [
                    'locale' => 'de_DE',
                    'path' => '/de/',
                    'status' => 'reserved',
                    'published' => false,
                ],
            ],
            'reserved_policy' => 'Do not register rewrites, pages, navigation links, hreflang, canonical alternates or sitemap entries until an approved translation is complete.',
        ],
        'quotation_delivery' => [
            'status' => 'unconfigured',
            'owner' => 'farmtree-content',
            'fallback' => 'mailto:info@farmtree.earth?subject=FarmTree%20quotation%20request',
            'privacy_policy' => 'The inactive frontend state must collect, store, transmit and log no personal information.',
        ],
        'post_types' => [
            'case_study' => [
                'public' => true,
                'rest' => true,
                'archive' => '/case-studies/',
                'taxonomies' => ['farmtree_region', 'farmtree_topic', 'farmtree_segment'],
            ],
            'customer_segment' => [
                'public' => true,
                'rest' => true,
                'archive' => '/customer-segments/',
                'taxonomies' => ['farmtree_capability'],
            ],
            'team_member' => [
                'public' => false,
                'rest' => true,
                'archive' => false,
                'taxonomies' => ['farmtree_team_group'],
            ],
            'vacancy' => [
                'public' => true,
                'rest' => true,
                'archive' => '/vacancies/',
                'taxonomies' => ['farmtree_employment_type'],
            ],
            'faq' => [
                'public' => false,
                'rest' => true,
                'archive' => false,
                'taxonomies' => ['farmtree_faq_group'],
            ],
            'partner' => [
                'public' => false,
                'rest' => true,
                'archive' => false,
                'taxonomies' => ['farmtree_partner_type'],
            ],
            'testimonial' => [
                'public' => false,
                'rest' => true,
                'archive' => false,
                'taxonomies' => [],
            ],
        ],
        'global_settings' => [
            'identity' => ['legal_name', 'logo_id', 'contact_details'],
            'destinations' => ['platform_url', 'demo_url', 'quotation_action'],
            'social' => ['linkedin_url', 'youtube_url'],
            'seo' => ['default_share_image_id', 'schema_logo_id', 'content_owner'],
        ],
    ];

    /**
     * Filter the architecture manifest for review and future migrations.
     *
     * @param array<string, mixed> $architecture Content ownership map.
     */
    return apply_filters('farmtree_content_architecture', $architecture);
}
