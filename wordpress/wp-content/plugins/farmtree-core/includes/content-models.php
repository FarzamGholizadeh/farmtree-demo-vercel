<?php
/**
 * Planned editorial content models (foundations).
 *
 * PHASE 1 (this migration) deliberately registers NO public post types. The
 * approved homepage renders entirely from theme markup, so introducing empty
 * post types now would only add non-functional admin UI and risk showing empty
 * database queries in place of approved content.
 *
 * This file instead publishes the AGREED ROADMAP as data. When a model is ready
 * to become editable, move its definition into a real registration call
 * (register_post_type / register_taxonomy) behind its own reviewed patch, and
 * migrate the corresponding theme section to read from it.
 *
 * @package FarmTree_Core
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The recommended future editable content models, in priority order.
 *
 * Each entry documents intent only; nothing here is registered with WordPress
 * yet. Consumers may read this via the `farmtree_core_planned_content_models`
 * filter to build admin notices, docs, or a future migration.
 *
 * @return array<string, array<string, mixed>>
 */
function farmtree_core_planned_content_models(): array
{
    $models = [
        'news' => [
            'label'   => 'News',
            'type'    => 'post_type',
            'public'  => true,
            'notes'   => 'News / updates carousel on the homepage and a news archive.',
        ],
        'case_study' => [
            'label'   => 'Case Studies',
            'type'    => 'post_type',
            'public'  => true,
            'notes'   => 'The four project cards on #case-studies; fields: title, region, summary, metrics, logo.',
        ],
        'testimonial' => [
            'label'   => 'Testimonials',
            'type'    => 'post_type',
            'public'  => false,
            'notes'   => 'Partner quotes for the Testimonials marquee; fields: quote, author, organisation, initials.',
        ],
        'team_member' => [
            'label'   => 'Team',
            'type'    => 'post_type',
            'public'  => false,
            'notes'   => 'Team / about people grid; fields: name, role, photo, bio, links.',
        ],
        'vacancy' => [
            'label'   => 'Vacancies',
            'type'    => 'post_type',
            'public'  => true,
            'notes'   => 'Open positions with an application link.',
        ],
        'customer_segment' => [
            'label'   => 'Customer Segments',
            'type'    => 'post_type',
            'public'  => true,
            'notes'   => 'The ten segment pages (currently template-generated in JS): slug, H1, value prop, help cards, capability chips, outputs.',
        ],
        'faq' => [
            'label'   => 'FAQ',
            'type'    => 'post_type',
            'public'  => false,
            'notes'   => 'FAQ accordion entries; fields: question, answer, order.',
        ],
        'video' => [
            'label'   => 'Videos',
            'type'    => 'post_type',
            'public'  => true,
            'notes'   => 'User / explainer videos; fields: title, poster, webm, mp4, external link.',
        ],
    ];

    /**
     * Filter the planned content-model roadmap.
     *
     * @param array $models Planned models keyed by slug.
     */
    return apply_filters('farmtree_core_planned_content_models', $models);
}

/**
 * Target WordPress-native information architecture.
 *
 * This is an implementation roadmap, not runtime registration. Each model moves
 * to real Pages, CPTs, taxonomies, settings, or blocks only in its own focused
 * sprint after the matching frontend renderer and migration path exist.
 *
 * @return array<string, mixed>
 */
function farmtree_core_target_content_architecture(): array
{
    $architecture = [
        'pages' => [
            'home' => [
                'url' => '/',
                'template' => 'template-farmtree-native-homepage.php',
                'blocks' => ['farmtree/homepage-hero'],
                'notes' => 'Pilot hybrid page. The approved shell remains in code while the hero reads block attributes from the selected static front page.',
            ],
            'platform' => [
                'url' => '/platform/',
                'source' => 'future page template',
                'notes' => 'Replace #platform after clean-route approval.',
            ],
            'solutions' => [
                'url' => '/solutions/',
                'source' => 'future page template',
                'notes' => 'Replace #services after clean-route approval.',
            ],
            'track_record' => [
                'url' => '/track-record/',
                'source' => 'future page template plus case-study CPT queries',
                'notes' => 'Replace #track after clean-route approval.',
            ],
        ],
        'custom_post_types' => [
            'case_study' => [
                'public' => true,
                'taxonomies' => ['farmtree_region', 'farmtree_theme', 'farmtree_audience'],
                'fields' => ['summary', 'hero_media', 'partner_logo', 'metrics', 'challenge', 'approach', 'outcomes', 'quote'],
            ],
            'news' => [
                'public' => true,
                'taxonomies' => ['category', 'post_tag', 'farmtree_audience'],
                'fields' => ['summary', 'hero_media', 'related_cta'],
            ],
            'team_member' => [
                'public' => false,
                'fields' => ['role', 'photo', 'bio', 'linkedin_url', 'sort_order'],
            ],
            'testimonial' => [
                'public' => false,
                'fields' => ['quote', 'person', 'organisation', 'initials', 'related_case_study'],
            ],
            'vacancy' => [
                'public' => true,
                'fields' => ['location', 'employment_type', 'application_url', 'closing_date'],
            ],
            'customer_segment' => [
                'public' => true,
                'taxonomies' => ['farmtree_audience'],
                'fields' => ['hero_copy', 'decision_context', 'help_cards', 'capability_chips', 'outputs'],
            ],
            'video' => [
                'public' => true,
                'taxonomies' => ['farmtree_audience'],
                'fields' => ['poster', 'webm', 'mp4', 'external_url', 'transcript'],
            ],
        ],
        'global_settings' => [
            'company_profile' => ['address', 'email', 'phone', 'social_links', 'legal_name'],
            'cta_destinations' => ['platform_login_url', 'demo_registration_url', 'quotation_behavior'],
            'seo_defaults' => ['default_og_image', 'organization_schema_logo', 'content_owner'],
        ],
        'blocks' => [
            'farmtree/homepage-hero' => 'Editable pilot block for hero copy, media and CTA labels.',
            'farmtree/section-heading' => 'Future controlled heading block for repeated section headers.',
            'farmtree/case-study-grid' => 'Future query block for approved case studies.',
            'farmtree/partner-strip' => 'Future global partner logo strip.',
        ],
        'editor_locking' => [
            'principle' => 'Editors change content inside FarmTree blocks and patterns; layout primitives remain controlled by theme templates.',
            'pilot' => 'The FarmTree Native Homepage Pilot page template currently allows only farmtree/homepage-hero.',
        ],
    ];

    /**
     * Filter the target content architecture roadmap.
     *
     * @param array $architecture Target architecture keyed by concern.
     */
    return apply_filters('farmtree_core_target_content_architecture', $architecture);
}
