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
