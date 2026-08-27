<?php
/**
 * Canonical content architecture manifest.
 *
 * Models become runtime behavior only with a matching editor, template,
 * migration, permission and SEO implementation.
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
        'status' => 'segment_model_active',
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
        'ai_assistant' => [
            'owner' => 'farmtree-ai-assistant',
            'status' => 'inactive_until_configured',
            'policy' => 'No simulated responses. Provider credentials and capability gating remain server-side; Knowledge, Behavior and Skills remain separately governed.',
        ],
        'content_sources' => [
            'customer_segments' => [
                'file' => 'data/customer-segments.json',
                'publication_status' => 'private_until_editor_approval',
                'claims_policy' => 'Do not migrate named prospects, confidential sales material, unverified metrics or implied customer relationships.',
            ],
            'editorial_drafts' => [
                'file' => 'data/editorial-drafts.json',
                'publication_status' => 'draft',
            ],
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
                'archive' => false,
                'single' => '/customer-segments/{slug}/',
                'runtime_status' => 'registered',
                'taxonomies' => [],
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
