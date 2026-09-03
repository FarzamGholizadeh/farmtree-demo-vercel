<?php
/**
 * Generated production-safe FarmTree managed-content manifest.
 *
 * Source JSON remains local/repository-only and is excluded from release artifacts.
 * Regenerate with: npm run content:manifest
 *
 * @package FarmTree_Content
 */

if (!defined('ABSPATH')) {
    exit;
}

return [
    'manifest_version' => '2026-09-03-legal-review-1',
    'profile' => 'private-review',
    'publication_note' => 'English content is materialized as authenticated private-review content; public publication remains a separate approval.',
    'reserved_locales' => [
        'nl',
        'de',
    ],
    'team_member_keys' => [
        'team_member.arnoud-braun',
        'team_member.maximilian-michael-moeller',
        'team_member.frank-van-schoubroeck',
        'team_member.germaine-van-teeffelen',
        'team_member.irene-vinkenburg',
        'team_member.betelehem-beyene',
        'team_member.roos-van-haeff',
        'team_member.edi-yoga',
        'team_member.hery-hanipan',
        'team_member.alvaro-micheletti',
    ],
    'terms' => [
        [
            'key' => 'category.en.data-evidence',
            'taxonomy' => 'category',
            'slug' => 'data-evidence',
            'name' => 'Data & Evidence',
            'description' => '',
        ],
        [
            'key' => 'category.en.farmtree-updates',
            'taxonomy' => 'category',
            'slug' => 'farmtree-updates',
            'name' => 'FarmTree Updates',
            'description' => '',
        ],
        [
            'key' => 'category.en.landscape-planning',
            'taxonomy' => 'category',
            'slug' => 'landscape-planning',
            'name' => 'Landscape Planning',
            'description' => '',
        ],
        [
            'key' => 'category.en.policy-standards',
            'taxonomy' => 'category',
            'slug' => 'policy-standards',
            'name' => 'Policy & Standards',
            'description' => '',
        ],
        [
            'key' => 'category.en.project-finance',
            'taxonomy' => 'category',
            'slug' => 'project-finance',
            'name' => 'Project Finance',
            'description' => '',
        ],
        [
            'key' => 'category.en.species-design',
            'taxonomy' => 'category',
            'slug' => 'species-design',
            'name' => 'Species & Design',
            'description' => '',
        ],
    ],
    'assets' => [
        [
            'key' => 'asset.news.agroforestry-species-data-switchboard-2025',
            'slug' => 'news-species-data-provenance-v1-1600',
            'relative_path' => 'assets/images/news/news-species-data-provenance-v1-1600.webp',
            'title' => 'Better species data starts with better provenance',
            'alt' => 'Leaves and seed pods being compared with field records at a botanical work table',
            'mime_type' => 'image/webp',
            'sha256' => '5f8122c11e19e02fb63d1ca20b1ccfc0a363582cae6490575ccebe866cf07236',
        ],
        [
            'key' => 'asset.news.carbon-pricing-2026-nature-project-quality',
            'slug' => 'news-carbon-pricing-2026-v1-1600',
            'relative_path' => 'assets/images/news/news-carbon-pricing-2026-v1-1600.webp',
            'title' => 'Carbon pricing in 2026: why nature projects still need a grounded investment case',
            'alt' => 'A planner comparing scenario materials while overlooking an agroforestry landscape',
            'mime_type' => 'image/webp',
            'sha256' => '0b54a77e4eb825970202e624bdd2cff97b713a0f2993b8373394ba906f9843da',
        ],
        [
            'key' => 'asset.news.eu-carbon-farming-methodologies-agroforestry-2026',
            'slug' => 'news-eu-carbon-farming-methodologies-2026-v1-1600',
            'relative_path' => 'assets/images/news/news-eu-carbon-farming-methodologies-2026-v1-1600.webp',
            'title' => 'EU carbon-farming methodologies: what agroforestry planners should prepare',
            'alt' => 'Soil sampling equipment and scenario-planning materials beside an agroforestry field',
            'mime_type' => 'image/webp',
            'sha256' => '6f7c09bb9fc2b108b182c4bf5c8993057661f78e80200a0ec28e44a2ec6dcb28',
        ],
        [
            'key' => 'asset.news.eudr-2026-agroforestry-data-readiness',
            'slug' => 'news-eudr-data-readiness-2026-v1-1600',
            'relative_path' => 'assets/images/news/news-eudr-data-readiness-2026-v1-1600.webp',
            'title' => 'EUDR 2026: a data-readiness checklist for agroforestry programmes',
            'alt' => 'Field technician reviewing a parcel map at the edge of a mixed agroforestry plot',
            'mime_type' => 'image/webp',
            'sha256' => '398c1a320706743c81631a66e522f01ae06e966d6d5fa11d310e1e33ac5ef55f',
        ],
        [
            'key' => 'asset.news.farmtree-water-erosion-microclimate-model-update-2026',
            'slug' => 'news-water-erosion-microclimate-2026-v1-1600',
            'relative_path' => 'assets/images/news/news-water-erosion-microclimate-2026-v1-1600.webp',
            'title' => 'What FarmTree\'s 2026 water, erosion and microclimate update means for scenario planning',
            'alt' => 'Agroforestry rows after rainfall with surface water moving between planted contours',
            'mime_type' => 'image/webp',
            'sha256' => 'e5b170dc7fffa6f2b9f2a53c0656ce3b3b1c40fcb8f42909f3945c9552a4a8f7',
        ],
        [
            'key' => 'asset.news.nature-restoration-plans-report-once-agroforestry-2025',
            'slug' => 'news-nature-restoration-planning-v1-1600',
            'relative_path' => 'assets/images/news/news-nature-restoration-planning-v1-1600.webp',
            'title' => 'Report once, use evidence well: a lesson from EU nature-restoration planning',
            'alt' => 'Landscape planners reviewing a restoration map above a mosaic of fields and tree corridors',
            'mime_type' => 'image/webp',
            'sha256' => '8088ba938eb4ef0971c7abb1b50c5d2e0a0031043b2be1a6ef8a4d5c4d4cd60c',
        ],
        [
            'key' => 'asset.news.smallholder-agroforestry-wood-production-lessons-2025',
            'slug' => 'news-smallholder-wood-production-v1-1600',
            'relative_path' => 'assets/images/news/news-smallholder-wood-production-v1-1600.webp',
            'title' => 'Smallholder wood production: seven planning questions for multifunctional agroforestry',
            'alt' => 'A small diversified farm combining managed trees, crops and stacked pruning wood',
            'mime_type' => 'image/webp',
            'sha256' => 'f2a4671c2dd33e2edb553a1d16541668d75707b4502edd9f8b17e63be61f45da',
        ],
        [
            'key' => 'asset.news.verra-vm0042-v22-agricultural-land-management',
            'slug' => 'news-verra-vm0042-v22-v1-1600',
            'relative_path' => 'assets/images/news/news-verra-vm0042-v22-v1-1600.webp',
            'title' => 'Reading Verra VM0042 v2.2 through an agroforestry planning lens',
            'alt' => 'Careful soil-core sampling in a diversified agroforestry field',
            'mime_type' => 'image/webp',
            'sha256' => '08e3fdb5d5b6645c7be6232ed88f5f0459021e83727df9b39e39d2130dd192c7',
        ],
        [
            'key' => 'asset.news.verra-vm0042-v30-consultation-lessons',
            'slug' => 'news-verra-vm0042-v30-governance-v1-1600',
            'relative_path' => 'assets/images/news/news-verra-vm0042-v30-governance-v1-1600.webp',
            'title' => 'What the VM0042 v3.0 revision process teaches project teams about model governance',
            'alt' => 'Scenario diagrams and field measurements being compared beside agroforestry rows',
            'mime_type' => 'image/webp',
            'sha256' => '5a200065d17d20651bb878d818f905d8dc506781e11aa2cbecdcee70127a1400',
        ],
        [
            'key' => 'asset.proof.carbon-planning',
            'slug' => 'proof-carbon-documentary-v2',
            'relative_path' => 'assets/images/proof/proof-carbon-documentary-v2.jpg',
            'title' => 'Carbon planning',
            'alt' => 'Field team measuring a mature tree and recording observations in an agroforestry landscape',
            'mime_type' => 'image/jpeg',
            'sha256' => '217b40b25565c442ff688dce1d52fd570e5a215e2ce5a12f74bcd74f79d272b8',
        ],
        [
            'key' => 'asset.proof.cocoa-scenario-planning',
            'slug' => 'proof-cocoa-documentary-v2',
            'relative_path' => 'assets/images/proof/proof-cocoa-documentary-v2.jpg',
            'title' => 'Cocoa scenario planning and monitoring',
            'alt' => 'Cocoa field team inspecting pods and recording observations beneath shade trees',
            'mime_type' => 'image/jpeg',
            'sha256' => 'bf294653d0445bfdfc55e1868e5ca8f4927289946fe9bebe49716fb6404a4fc5',
        ],
        [
            'key' => 'asset.proof.farm-value-projection',
            'slug' => 'proof-farm-value-documentary-v2',
            'relative_path' => 'assets/images/proof/proof-farm-value-documentary-v2.jpg',
            'title' => 'Farm Value Projection',
            'alt' => 'Farmer and adviser reviewing scenario materials at a farm-office table',
            'mime_type' => 'image/jpeg',
            'sha256' => '8949f642e40265388de1517d10b29158576944d5b112e63d2df0faf20958c437',
        ],
        [
            'key' => 'asset.proof.landscape-hydrology',
            'slug' => 'proof-water-documentary-v2',
            'relative_path' => 'assets/images/proof/proof-water-documentary-v2.jpg',
            'title' => 'Landscape Hydrology',
            'alt' => 'Field team examining soil and recording water observations beside a stream',
            'mime_type' => 'image/jpeg',
            'sha256' => '9cf2bd27c7bf2981d6ebfe66ce3443904408602e7de01df9d171651e4c4d3e99',
        ],
        [
            'key' => 'asset.segment.consultancy-agroforestry-advisors',
            'slug' => 'segment-consultancy-advisors-v1-1600',
            'relative_path' => 'assets/images/segments/segment-consultancy-advisors-v1-1600.webp',
            'title' => 'Consultancy & Agroforestry Advisors',
            'alt' => 'Agroforestry advisers reviewing a field plan with a farmer',
            'mime_type' => 'image/webp',
            'sha256' => '6ef1981811fc93a2b17ee3f96840f148ec5fb392623ee2858e7b0b60fa47ff2e',
        ],
        [
            'key' => 'asset.segment.development-banks-donor-organisations',
            'slug' => 'segment-development-banks-donors-v1-1600',
            'relative_path' => 'assets/images/segments/segment-development-banks-donors-v1-1600.webp',
            'title' => 'Development Banks & Donor Organisations',
            'alt' => 'Development finance specialists reviewing an agroforestry landscape investment plan',
            'mime_type' => 'image/webp',
            'sha256' => '4d2f993979b2c91c1a183e2135228f3f3c0f9fc88a4f4b063b8334222715032a',
        ],
        [
            'key' => 'asset.segment.government-parastatal-institutions',
            'slug' => 'segment-government-institutions-v1-1600',
            'relative_path' => 'assets/images/segments/segment-government-institutions-v1-1600.webp',
            'title' => 'Government & Parastatal Institutions',
            'alt' => 'Public-sector planners discussing a regional agroforestry map',
            'mime_type' => 'image/webp',
            'sha256' => '9236f354695d08f04520e04766100728929a9ef7ecd1c58123fc7270751cc46c',
        ],
        [
            'key' => 'asset.segment.industry-associations-multi-stakeholder-platforms',
            'slug' => 'segment-industry-associations-v1-1600',
            'relative_path' => 'assets/images/segments/segment-industry-associations-v1-1600.webp',
            'title' => 'Industry Associations & Multi-Stakeholder Platforms',
            'alt' => 'Representatives from several organisations meeting beside an agroforestry site',
            'mime_type' => 'image/webp',
            'sha256' => '8d23d55d4040d974ac6d3ebb445df1721235346be18639717758b87060783043',
        ],
        [
            'key' => 'asset.segment.investors',
            'slug' => 'segment-investors-v1-1600',
            'relative_path' => 'assets/images/segments/segment-investors-v1-1600.webp',
            'title' => 'Investors',
            'alt' => 'Investment team reviewing landscape information overlooking an agroforestry project',
            'mime_type' => 'image/webp',
            'sha256' => '0ef1c93155cae0930844be8282caff4848358a29f641e918a0643edb8b38a3fd',
        ],
        [
            'key' => 'asset.segment.large-agri-corporate',
            'slug' => 'segment-large-agri-corporate-v1-1600',
            'relative_path' => 'assets/images/segments/segment-large-agri-corporate-v1-1600.webp',
            'title' => 'Large Agri-Corporate',
            'alt' => 'Agricultural supply-chain team walking through a mixed tree and crop system',
            'mime_type' => 'image/webp',
            'sha256' => '43eedd3871d6cffa236e9eea8deaebcf1b1d744e3cd0140e9d0bf2a4c26c9f4e',
        ],
        [
            'key' => 'asset.segment.mrv-esg-platforms',
            'slug' => 'segment-mrv-esg-platforms-v1-1600',
            'relative_path' => 'assets/images/segments/segment-mrv-esg-platforms-v1-1600.webp',
            'title' => 'MRV & ESG Platforms',
            'alt' => 'Field data specialist comparing digital records in an agroforestry landscape',
            'mime_type' => 'image/webp',
            'sha256' => 'd8919f8525a3c5f1f8d482702b4dad056f76b61e26597be4d1de68c96a050601',
        ],
        [
            'key' => 'asset.segment.nbs-carbon-project-developers',
            'slug' => 'segment-nbs-carbon-developers-v1-1600',
            'relative_path' => 'assets/images/segments/segment-nbs-carbon-developers-v1-1600.webp',
            'title' => 'NbS & Carbon Project Developers',
            'alt' => 'Nature-based project developers documenting an agroforestry plot',
            'mime_type' => 'image/webp',
            'sha256' => '694e835b1d0363f98d660927e1d9166bb78fb5d5bd65f9640a9ec1c69b691c6e',
        ],
        [
            'key' => 'asset.segment.ngos-conservation-organisations',
            'slug' => 'segment-ngos-conservation-v1-1600',
            'relative_path' => 'assets/images/segments/segment-ngos-conservation-v1-1600.webp',
            'title' => 'NGOs & Conservation Organisations',
            'alt' => 'Conservation practitioners surveying a diverse agroforestry landscape',
            'mime_type' => 'image/webp',
            'sha256' => '99f7ba2c6fdeb1ef3f70b6e2db909dc1a7237027e12599773812431502068734',
        ],
        [
            'key' => 'asset.segment.social-enterprise',
            'slug' => 'segment-social-enterprise-v1-1600',
            'relative_path' => 'assets/images/segments/segment-social-enterprise-v1-1600.webp',
            'title' => 'Social Enterprise',
            'alt' => 'Social-enterprise team discussing a farm plan with local producers',
            'mime_type' => 'image/webp',
            'sha256' => 'a65ff04e7b9e10d7a037c585ad6e4d320fb72b79030f0fbd29f102f5d3db7b5d',
        ],
        [
            'key' => 'asset.team.alvaro-micheletti',
            'slug' => 'alvaro-micheletti-690',
            'relative_path' => 'assets/images/team/alvaro-micheletti-690.webp',
            'title' => 'Álvaro Mitcheletti',
            'alt' => 'Álvaro Mitcheletti, Portfolio Manager, Latin America',
            'mime_type' => 'image/webp',
            'sha256' => '36d3f9be8cbe0e7ed43c3182c707a09fea44b10c25320e429ec3b09914b5cd52',
        ],
        [
            'key' => 'asset.team.arnoud-braun',
            'slug' => 'arnoud-braun-690',
            'relative_path' => 'assets/images/team/arnoud-braun-690.webp',
            'title' => 'Arnoud Braun',
            'alt' => 'Arnoud Braun, Founder & CEO',
            'mime_type' => 'image/webp',
            'sha256' => 'a57feb12a1ede92c7e0283d8a60753baccb5b89a6ce7921c65a8af49b82dadc9',
        ],
        [
            'key' => 'asset.team.betelehem-beyene',
            'slug' => 'betelehem-beyene-690',
            'relative_path' => 'assets/images/team/betelehem-beyene-690.webp',
            'title' => 'Betelehem Beyene',
            'alt' => 'Betelehem Beyene, Portfolio Manager',
            'mime_type' => 'image/webp',
            'sha256' => '785bd6eddc1fdeaffcdd12734e4b9721d34fb8c7b43d7791cc7df716981bb412',
        ],
        [
            'key' => 'asset.team.edi-yoga',
            'slug' => 'edi-yoga-690',
            'relative_path' => 'assets/images/team/edi-yoga-690.webp',
            'title' => 'Edi Yoga',
            'alt' => 'Edi Yoga, FarmTree Representative, Indonesia',
            'mime_type' => 'image/webp',
            'sha256' => '5e3082afc7a4dac958175f8fd8c64cc6e8685619538ef6a737fd4a10708359d7',
        ],
        [
            'key' => 'asset.team.frank-van-schoubroeck',
            'slug' => 'frank-van-schoubroeck-690',
            'relative_path' => 'assets/images/team/frank-van-schoubroeck-690.webp',
            'title' => 'Frank van Schoubroeck',
            'alt' => 'Frank van Schoubroeck, Founder & CTO',
            'mime_type' => 'image/webp',
            'sha256' => '7c2b2767a878f8ae31aed19419baec5b1eeb8b341f3720535a8e229e8dcd785a',
        ],
        [
            'key' => 'asset.team.germaine-van-teeffelen',
            'slug' => 'germaine-van-teeffelen-800',
            'relative_path' => 'assets/images/team/germaine-van-teeffelen-800.jpg',
            'title' => 'Germaine van Teeffelen',
            'alt' => 'Germaine van Teeffelen, Interim Project Manager',
            'mime_type' => 'image/jpeg',
            'sha256' => '6fbf0ffb17a998d91ac65db5b4d38dc7a9984de4c5c4b1308523b4ee9da9acbe',
        ],
        [
            'key' => 'asset.team.hero',
            'slug' => 'team-field-collaboration-v1',
            'relative_path' => 'assets/images/team/team-field-collaboration-v1.jpg',
            'title' => 'Illustrative FarmTree team field collaboration',
            'alt' => 'Illustrative group of agroforestry professionals walking through a diversified farm',
            'mime_type' => 'image/jpeg',
            'sha256' => 'b15f6789a1d53abb4bd95793b144eac92220e3233c31208af0d655ed82761cd1',
        ],
        [
            'key' => 'asset.team.hery-hanipan',
            'slug' => 'hery-hanipan-690',
            'relative_path' => 'assets/images/team/hery-hanipan-690.webp',
            'title' => 'Hery Hanipan',
            'alt' => 'Hery Hanipan, FarmTree Database Management, Indonesia',
            'mime_type' => 'image/webp',
            'sha256' => '32d502d7fbc1efd7e6dddb39e4dae3c15f3e2f03909e6b8b05e2aebf4733b617',
        ],
        [
            'key' => 'asset.team.irene-vinkenburg',
            'slug' => 'irene-vinkenburg-690',
            'relative_path' => 'assets/images/team/irene-vinkenburg-690.webp',
            'title' => 'Irene Vinkenburg',
            'alt' => 'Irene Vinkenburg, Modelling & IT Lead',
            'mime_type' => 'image/webp',
            'sha256' => '6cea0e44d8b45dbe27d2e56be4fbc8ce5cf9e179f8976a50427b6c9469de4495',
        ],
        [
            'key' => 'asset.team.maximilian-michael-moeller',
            'slug' => 'maximilian-michael-moeller-800',
            'relative_path' => 'assets/images/team/maximilian-michael-moeller-800.jpg',
            'title' => 'Maximilian Michael Möller',
            'alt' => 'Maximilian Michael Möller, Chief Growth Officer',
            'mime_type' => 'image/jpeg',
            'sha256' => '6a8495d9eb7839e54e4271dfc09bef2580524a105805c608b35be70da68cd87e',
        ],
        [
            'key' => 'asset.team.roos-van-haeff',
            'slug' => 'roos-van-haeff-690',
            'relative_path' => 'assets/images/team/roos-van-haeff-690.webp',
            'title' => 'Roos van Haeff',
            'alt' => 'Roos van Haeff, Impact Quantification Lead',
            'mime_type' => 'image/webp',
            'sha256' => 'c10b957461e1429c9455fa4a9de6b3c9af7bdd19541b098f40d48c43ff6580f3',
        ],
    ],
    'entities' => [
        [
            'key' => 'page.en.home',
            'post_type' => 'page',
            'slug' => 'home',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'FarmTree Native Homepage',
                'post_name' => 'home',
                'post_status' => 'private',
                'post_excerpt' => '',
                'post_content' => '
<!-- wp:group {"metadata":{"name":"FarmTree Homepage"},"className":"ft-native-home","layout":{"type":"default"},"templateLock":"contentOnly","lock":{"move":true,"remove":true}} -->
<div class="wp-block-group ft-native-home"><!-- wp:group {"tagName":"section","metadata":{"name":"FarmTree Hero"},"align":"full","className":"ft-home-hero","style":{"dimensions":{"minHeight":"780px"},"spacing":{"padding":{"top":"var:preset|spacing|80","right":"var:preset|spacing|50","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50"}}},"backgroundColor":"farmtree-forest","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-hero has-farmtree-forest-background-color has-background" style="min-height:780px;padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)"><!-- wp:group {"metadata":{"name":"Editable Hero images"},"className":"ft-home-hero-media","layout":{"type":"default"}} -->
<div class="wp-block-group ft-home-hero-media"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide is-active"} -->
<figure class="wp-block-image size-full ft-home-hero-slide is-active"><img src="%%FARMTREE_THEME_URI:assets/images/home/hero-field-planning-v1.jpg%%" alt="Illustrative field team reviewing an agroforestry plan and monitoring tools"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide"} -->
<figure class="wp-block-image size-full ft-home-hero-slide"><img src="%%FARMTREE_THEME_URI:assets/images/home/proof-carbon.webp%%" alt="Three people reviewing information on a laptop"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide"} -->
<figure class="wp-block-image size-full ft-home-hero-slide"><img src="%%FARMTREE_THEME_URI:assets/images/home/hero-project-teams.webp%%" alt="Four people discussing crops in a field"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-home-hero-slide"} -->
<figure class="wp-block-image size-full ft-home-hero-slide"><img src="%%FARMTREE_THEME_URI:assets/images/home/hero-impact-reporting-v2.jpg%%" alt="Agroforestry field team measuring a tree and reviewing monitoring information"/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:group {"align":"wide","className":"ft-home-hero-content","layout":{"type":"constrained","justifyContent":"center"}} -->
<div class="wp-block-group alignwide ft-home-hero-content"><!-- wp:group {"metadata":{"name":"Editable primary Hero message"},"className":"ft-home-hero-current","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-current"><!-- wp:paragraph {"className":"ft-native-eyebrow ft-home-hero-current-kicker","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow ft-home-hero-current-kicker has-farmtree-gold-color has-text-color has-small-font-size">Agroforestry Intelligence</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"className":"ft-home-hero-current-heading","textColor":"white","fontSize":"heading"} -->
<h1 class="wp-block-heading ft-home-hero-current-heading has-white-color has-text-color has-heading-font-size">Make agroforestry measurable, investable and scalable</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"ft-home-hero-current-text","textColor":"white","fontSize":"lead"} -->
<p class="ft-home-hero-current-text has-white-color has-text-color has-lead-font-size">FarmTree helps organisations turn agroforestry complexity into clearer project intelligence for planning, reporting and investment decisions</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Editable alternate Hero messages"},"className":"ft-home-hero-copy-sources","layout":{"type":"default"}} -->
<div class="wp-block-group ft-home-hero-copy-sources"><!-- wp:group {"className":"ft-home-hero-copy-source","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-copy-source"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Science-Based Modelling</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Turn field data into investment scenarios</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"white","fontSize":"lead"} -->
<p class="has-white-color has-text-color has-lead-font-size">Connect climate, soil, species and project assumptions into clear science-backed projections</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"ft-home-hero-copy-source","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-copy-source"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Project Teams</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Support project staff with clearer planning tools</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"white","fontSize":"lead"} -->
<p class="has-white-color has-text-color has-lead-font-size">Help project staff compare agroforestry options, understand trade-offs and communicate value with confidence</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"ft-home-hero-copy-source","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-home-hero-copy-source"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Impact Reporting</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Report carbon, farmer value and long-term performance</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"white","fontSize":"lead"} -->
<p class="has-white-color has-text-color has-lead-font-size">Translate project results into clear reporting for investors, donors, MRV partners and programme teams</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:buttons {"className":"ft-home-hero-actions","layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons ft-home-hero-actions"><!-- wp:button {"backgroundColor":"farmtree-gold","textColor":"farmtree-ink"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-farmtree-ink-color has-farmtree-gold-background-color has-text-color has-background wp-element-button" href="https://tool.farmtree.earth/Identity/Account/Register" target="_blank" rel="noreferrer noopener">Request a demo ↗</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline ft-native-quotation-action","textColor":"white"} -->
<div class="wp-block-button is-style-outline ft-native-quotation-action"><a class="wp-block-button__link has-white-color has-text-color wp-element-button" href="mailto:info@farmtree.earth?subject=FarmTree%20quotation%20request">Ask for a quotation ↗</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->

<!-- wp:html -->
<div class="ft-home-hero-controls">
<button class="ft-home-hero-arrow ft-home-hero-arrow-prev" type="button" aria-label="Previous hero slide" data-ft-hero-prev>‹</button>
<div class="ft-home-hero-dots" role="group" aria-label="Choose hero slide">
<button class="ft-home-hero-dot is-active" type="button" aria-label="Project workshop" aria-pressed="true" data-ft-hero-dot></button>
<button class="ft-home-hero-dot" type="button" aria-label="Carbon planning" aria-pressed="false" data-ft-hero-dot></button>
<button class="ft-home-hero-dot" type="button" aria-label="Project Teams" aria-pressed="false" data-ft-hero-dot></button>
<button class="ft-home-hero-dot" type="button" aria-label="Impact Reporting" aria-pressed="false" data-ft-hero-dot></button>
</div>
<button class="ft-home-hero-arrow ft-home-hero-arrow-next" type="button" aria-label="Next hero slide" data-ft-hero-next>›</button>
<p class="screen-reader-text" aria-live="polite" data-ft-hero-status>Project workshop: Make agroforestry measurable, investable and scalable, slide 1 of 4</p>
</div>
<!-- /wp:html --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","anchor":"platform","metadata":{"name":"Platform / planning value"},"align":"full","className":"ft-home-section ft-home-platform","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section id="platform" class="wp-block-group alignfull ft-home-section ft-home-platform has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","verticalAlignment":"center","className":"ft-platform-layout","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center ft-platform-layout"><!-- wp:column {"verticalAlignment":"center","width":"42%","className":"ft-platform-copy"} -->
<div class="wp-block-column is-vertically-aligned-center ft-platform-copy" style="flex-basis:42%"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">The FarmTree Platform</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Move from project idea to investment plan</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree gives project staff a practical way to build and compare agroforestry scenarios before decisions are locked in</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"ft-home-value-list"} -->
<ul class="ft-home-value-list"><!-- wp:list-item -->
<li>Create agroforestry investment plans</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Compare farm and project options</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Understand future scenarios</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/platform/">Explore the platform</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"58%","className":"ft-platform-media"} -->
<div class="wp-block-column is-vertically-aligned-center ft-platform-media" style="flex-basis:58%"><!-- wp:group {"metadata":{"name":"Editable FarmTree Platform media"},"className":"ft-platform-visual","layout":{"type":"default"}} -->
<div class="wp-block-group ft-platform-visual"><!-- wp:group {"metadata":{"name":"FarmTree Platform media frame"},"className":"ft-platform-media-frame","layout":{"type":"default"}} -->
<div class="wp-block-group ft-platform-media-frame"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-platform-screen ft-platform-gif"} -->
<figure class="wp-block-image size-full ft-platform-screen ft-platform-gif"><img src="%%FARMTREE_THEME_URI:assets/media/final-tools-review-11s-to-40s-2x.gif%%" width="960" height="540" loading="lazy" decoding="async" alt="FarmTree Platform workflow moving from portfolio selection through plot configuration and modelling tools"/></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-platform-screen ft-platform-poster"} -->
<figure class="wp-block-image size-full ft-platform-screen ft-platform-poster" aria-hidden="true"><img class="ft-platform-poster-image" src="%%FARMTREE_THEME_URI:assets/media/final-tools-review-11s-to-40s-poster.png%%" width="960" height="540" loading="lazy" decoding="async" alt=""/></figure>
<!-- /wp:image --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"ft-home-media-caption","fontSize":"caption"} -->
<p class="ft-home-media-caption has-caption-font-size">The approved FarmTree Platform workflow</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Technology / how FarmTree works"},"align":"full","className":"ft-home-section ft-home-technology","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-technology has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">How FarmTree works</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">How agroforestry projects are planned, monitored and reported</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree connects site information such as climate, soil and species data into a <strong>science-based, multi-KPI business plans</strong></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:group {"align":"wide","className":"ft-technology-story","layout":{"type":"default"}} -->
<div class="wp-block-group alignwide ft-technology-story"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-technology-model"} -->
<figure class="wp-block-image size-full ft-technology-model"><img src="%%FARMTREE_THEME_URI:assets/images/home/technology-model.webp%%" alt="FarmTree model connecting site, climate, soil and species information to impact monitoring and future projections"/></figure>
<!-- /wp:image -->

</div>
<!-- /wp:group -->

<!-- wp:columns {"align":"wide","className":"ft-home-inputs"} -->
<div class="wp-block-columns alignwide ft-home-inputs"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">01</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Site information</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Define location, inventory and management baseline</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">02</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Climate, soil and terrain</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Connect local conditions, opportunities and risks</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">03</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Species database</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Add growth, yield, interaction and price data</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph {"className":"ft-home-input-number","fontSize":"caption"} -->
<p class="ft-home-input-number has-caption-font-size">04</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Plan, monitor and report</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Compare business and impact projections time &#45; based</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Verified FarmTree metrics"},"align":"full","className":"ft-home-section ft-home-metrics","backgroundColor":"farmtree-forest","textColor":"white","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-metrics has-white-color has-farmtree-forest-background-color has-text-color has-background"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">Track record</p>
<!-- /wp:paragraph --><!-- wp:heading {"level":2,"textColor":"white","fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-white-color has-text-color has-heading-small-font-size">Agroforestry intelligence in active use</h2>
<!-- /wp:heading --></div>
<!-- /wp:group -->
<!-- wp:columns {"align":"wide","className":"ft-metric-grid"} -->
<div class="wp-block-columns alignwide ft-metric-grid"><!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+100</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Active FarmTree Tool users</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+30</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Projects</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+40</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Agricultural regions impacted</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column ft-metric-card"><!-- wp:heading {"level":3,"className":"ft-metric-value","fontSize":"heading-small"} --><h3 class="wp-block-heading ft-metric-value has-heading-small-font-size">+1,000,000</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Farmers indirectly reached</p><!-- /wp:paragraph --></div><!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Global FarmTree perspective"},"align":"full","className":"ft-home-section ft-home-globe","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-ivory","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-globe has-farmtree-ivory-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","verticalAlignment":"center","className":"ft-globe-layout"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center ft-globe-layout"><!-- wp:column {"verticalAlignment":"center","width":"40%","className":"ft-globe-copy"} -->
<div class="wp-block-column is-vertically-aligned-center ft-globe-copy" style="flex-basis:40%"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Global perspective</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Agroforestry decisions across diverse landscapes</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree supports scenario thinking across tropical, temperate, dryland and highland contexts.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center","width":"60%","className":"ft-globe-media"} -->
<div class="wp-block-column is-vertically-aligned-center ft-globe-media" style="flex-basis:60%"><!-- wp:html -->
<div class="ft-globe-stage" data-ft-globe-shell data-ft-earth-texture="%%FARMTREE_THEME_URI:assets/images/home/earth-blue-marble-nasa-2048.jpg%%">
<canvas class="ft-globe-canvas" width="720" height="720" tabindex="0" role="img" aria-label="Interactive realistic Earth showing FarmTree locations and connections" aria-describedby="ft-globe-description" data-ft-globe></canvas>
<p id="ft-globe-description" class="screen-reader-text">A realistic Earth rotates slowly. Location markers and animated routes connect Kenya, Tanzania, Uganda, Brazil, Benin, Ghana, Nigeria, Senegal, Indonesia, Ethiopia, Bhutan, Colombia, Peru, the Netherlands, the United Kingdom, Hungary, France, Bulgaria, Belgium, Denmark, Iran and Jordan. Use the arrow keys to rotate the globe.</p>
<noscript><p>The interactive landscape-context globe requires JavaScript. The section text remains available without it.</p></noscript>
</div>
<!-- /wp:html --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"Trust / references / testimonials"},"align":"full","className":"ft-home-section ft-home-trust","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-mist","textColor":"farmtree-ink","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-trust has-farmtree-ink-color has-farmtree-mist-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Trust and references</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"textColor":"farmtree-ink","fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-farmtree-ink-color has-text-color has-heading-small-font-size">FarmTree Client</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"farmtree-green","fontSize":"lead"} -->
<p class="has-farmtree-green-color has-text-color has-lead-font-size">Trusted by organisations, practitioners and partners working across agroforestry and climate.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:gallery {"columns":6,"imageCrop":false,"linkTo":"none","align":"wide","className":"ft-partner-logos"} -->
<figure class="wp-block-gallery alignwide has-nested-images columns-6 ft-partner-logos"><!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="GIZ reference context"><img src="%%FARMTREE_THEME_URI:assets/images/partners/giz.png%%" alt="GIZ"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="Rabobank reference context"><img src="%%FARMTREE_THEME_URI:assets/images/partners/rabobank.png%%" alt="Rabobank"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="CGIAR reference context"><img src="%%FARMTREE_THEME_URI:assets/images/partners/cgiar.png%%" alt="CGIAR"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="FAO reference context"><img src="%%FARMTREE_THEME_URI:assets/images/partners/fao.png%%" alt="FAO"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="CATIE reference context"><img src="%%FARMTREE_THEME_URI:assets/images/partners/catie.png%%" alt="CATIE"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","href":"/acknowledgements/"} -->
<figure class="wp-block-image size-full"><a href="/acknowledgements/" aria-label="Helvetas reference context"><img src="%%FARMTREE_THEME_URI:assets/images/partners/helvetas.png%%" alt="Helvetas"/></a></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery -->

<!-- wp:group {"align":"full","className":"ft-testimonial-marquee","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull ft-testimonial-marquee"><!-- wp:group {"metadata":{"name":"Approved-theme testimonial quotes"},"className":"ft-testimonial-cards","layout":{"type":"default"}} -->
<div class="wp-block-group ft-testimonial-cards"><!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">The FarmTree Tool and team helped us understand the value of different agroforestry systems and the potential for increased revenue over a few decades.</p>
<!-- /wp:paragraph --><cite><img src="%%FARMTREE_THEME_URI:assets/images/testimonials/generated-placeholders/portrait-01.jpg%%" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Mona McCord"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Mona McCord <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · SAN</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue. They do everything!</p>
<!-- /wp:paragraph --><cite><img src="%%FARMTREE_THEME_URI:assets/images/testimonials/generated-placeholders/portrait-02.jpg%%" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Mathijs de Bruin"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Mathijs de Bruin <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · TreeScape</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">FarmTree provides a remarkable level of detail that helps us truly understand why coffee agroforestry systems perform the way they do.</p>
<!-- /wp:paragraph --><cite><img src="%%FARMTREE_THEME_URI:assets/images/testimonials/generated-placeholders/portrait-03.jpg%%" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Katharina Lima de Miranda"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Katharina Lima de Miranda <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · HRNS</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">We know very little of agroforestry options for a particular local context. The FarmTree tool is super helpful to generate location-specific scenarios!</p>
<!-- /wp:paragraph --><cite><img src="%%FARMTREE_THEME_URI:assets/images/testimonials/generated-placeholders/portrait-04.jpg%%" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Rob Kelly"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Rob Kelly <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · World Vision Australia</span></span></cite></blockquote>
<!-- /wp:quote -->

<!-- wp:quote {"className":"ft-trust-quote ft-testimonial-card"} -->
<blockquote class="wp-block-quote ft-trust-quote ft-testimonial-card"><!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">We found the FarmTree Tool essential for predicting outcomes of highly complex farm scenarios, among many, also agroforestry systems.</p>
<!-- /wp:paragraph --><cite><img src="%%FARMTREE_THEME_URI:assets/images/testimonials/generated-placeholders/portrait-05.jpg%%" width="720" height="900" loading="lazy" decoding="async" alt="Illustrative portrait placeholder; not a likeness of Lorenzo Mento"/><span class="ft-testimonial-profile-copy"><span class="ft-testimonial-name">Lorenzo Mento <span class="ft-testimonial-verified" aria-label="Source-attributed testimonial">✓</span></span><span class="ft-testimonial-identity">Illustrative portrait · Nectaerra</span></span></cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","anchor":"proof","metadata":{"name":"Proof Stories / Themes"},"align":"full","className":"ft-home-section ft-home-proof","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-ivory","layout":{"type":"constrained"}} -->
<section id="proof" class="wp-block-group alignfull ft-home-section ft-home-proof has-farmtree-ivory-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:group {"align":"wide","className":"ft-home-section-heading","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide ft-home-section-heading"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Proof Stories</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">See what better agroforestry decisions look like</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"lead"} -->
<p class="has-lead-font-size">Four themes grounded in FarmTree project experience</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:columns {"align":"wide","className":"ft-proof-grid"} -->
<div class="wp-block-columns alignwide ft-proof-grid"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><picture><img src="%%FARMTREE_THEME_URI:assets/images/proof/proof-carbon-documentary-v2.jpg%%" width="1122" height="1402" loading="lazy" decoding="async" alt="Field team measuring a mature tree and recording observations in an agroforestry landscape"/></picture></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 01</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Carbon</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Turn field assumptions into consistent carbon projections across project scenarios</p>
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/carbon-planning/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><picture><img src="%%FARMTREE_THEME_URI:assets/images/proof/proof-farm-value-documentary-v2.jpg%%" width="1122" height="1402" loading="lazy" decoding="async" alt="Farmer and adviser reviewing scenario materials at a farm-office table"/></picture></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 02</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Farm Value Projection</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Compare costs, benefits and projected returns across different farm and project options</p>
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/farm-value-projection/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><picture><img src="%%FARMTREE_THEME_URI:assets/images/proof/proof-cocoa-documentary-v2.jpg%%" width="1122" height="1402" loading="lazy" decoding="async" alt="Cocoa field team inspecting pods and recording observations beneath shade trees"/></picture></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 03</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Cocoa scenario planning and monitoring</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Compare shade-tree systems, species mixes and long-term landscape scenarios</p>
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/cocoa-scenario-planning/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:group {"className":"ft-proof-card","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card has-white-background-color has-background"><!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><picture><img src="%%FARMTREE_THEME_URI:assets/images/proof/proof-water-documentary-v2.jpg%%" width="1122" height="1402" loading="lazy" decoding="async" alt="Field team examining soil and recording water observations beside a stream"/></picture></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"ft-proof-card-copy","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-proof-card-copy"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"caption"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-caption-font-size">Theme 04</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"fontSize":"lead"} -->
<h3 class="wp-block-heading has-lead-font-size">Landscape Hydrology</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Connect water balance and ecosystem indicators to long-term monitoring and investment decisions</p>
<!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-proof-link"} --><p class="ft-proof-link"><a href="/proof-stories/landscape-hydrology/">Explore story <span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","metadata":{"name":"News and Insights"},"align":"full","className":"ft-home-section ft-home-news","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section class="wp-block-group alignfull ft-home-section ft-home-news has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:group {"align":"wide","className":"ft-home-news-header","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"}} -->
<div class="wp-block-group alignwide ft-home-news-header"><!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">Last News</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Latest from FarmTree</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"ft-home-news-tagline","fontSize":"lead"} -->
<p class="ft-home-news-tagline has-lead-font-size">Updates on the science, policy and practice shaping better agroforestry decisions.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:query {"queryId":2,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"align":"wide","className":"ft-home-news-query"} -->
<div class="wp-block-query alignwide ft-home-news-query"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"ft-news-item","layout":{"type":"constrained"}} -->
<div class="wp-block-group ft-news-item"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->

<!-- wp:post-terms {"term":"category","fontSize":"caption"} /-->

<!-- wp:post-date {"fontSize":"caption"} /-->

<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"lead"} /-->

<!-- wp:post-excerpt {"moreText":"","excerptLength":18,"fontSize":"small"} /-->

<!-- wp:read-more {"content":"Read article ↗","className":"ft-news-read-more"} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No insights have been published yet</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results --></div>
<!-- /wp:query -->

<!-- wp:buttons {"align":"wide","className":"ft-home-news-more","layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons alignwide ft-home-news-more"><!-- wp:button {"backgroundColor":"farmtree-green","textColor":"white"} -->
<div class="wp-block-button"><a class="wp-block-button__link has-white-color has-farmtree-green-background-color has-text-color has-background wp-element-button" href="/blog/">Read more</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","anchor":"faq","metadata":{"name":"Frequently asked questions"},"align":"full","className":"ft-home-section ft-home-faq","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}},"backgroundColor":"farmtree-cream","layout":{"type":"constrained"}} -->
<section id="faq" class="wp-block-group alignfull ft-home-section ft-home-faq has-farmtree-cream-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)"><!-- wp:columns {"align":"wide","className":"ft-faq-layout","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide ft-faq-layout"><!-- wp:column {"width":"34%"} -->
<div class="wp-block-column" style="flex-basis:34%"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-green","fontSize":"small"} -->
<p class="ft-native-eyebrow has-farmtree-green-color has-text-color has-small-font-size">FAQ</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"fontSize":"heading-small"} -->
<h2 class="wp-block-heading has-heading-small-font-size">Questions about FarmTree modelling</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Common questions about the model, Platform and planning process</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"width":"66%","className":"ft-faq-list"} -->
<div class="wp-block-column ft-faq-list" style="flex-basis:66%"><!-- wp:details {"showContent":true} -->
<details class="wp-block-details" open><summary>What does FarmTree model?</summary><!-- wp:paragraph -->
<p>FarmTree connects production, carbon, hydrology, soil fertility, labour and economics in one science-based model</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Can FarmTree support investment planning?</summary><!-- wp:paragraph -->
<p>Yes. Project teams can turn site data and species assumptions into comparable scenarios and structured investment plans</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>How far ahead can FarmTree project?</summary><!-- wp:paragraph -->
<p>FarmTree supports projections of up to 50 years for long-term planning, investment cases and project monitoring</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>What information is needed to get started?</summary><!-- wp:paragraph -->
<p>The starting point depends on the project, but typically combines a location and site baseline with species, management and economic assumptions. The FarmTree team can help identify the appropriate inputs</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Are FarmTree results measurements or projections?</summary><!-- wp:paragraph -->
<p>FarmTree produces modelled projections from the inputs and assumptions supplied. They should be interpreted alongside measured field data and the documented scenario context</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Can FarmTree compare different project scenarios?</summary><!-- wp:paragraph -->
<p>Yes. Teams can compare species mixes, management choices and other project assumptions to understand potential trade-offs before selecting a plan</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>Can FarmTree connect with other reporting systems?</summary><!-- wp:paragraph -->
<p>Data exchange and reporting options depend on the required workflow and system. Discuss the intended integration and data format with the FarmTree team during scoping</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details"><summary>How do we request a demo?</summary><!-- wp:paragraph -->
<p>Request a demo and the FarmTree team will follow up to discuss your project context, scope and reporting needs</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->

<!-- wp:pattern {"slug":"farmtree-native/call-to-action"} /--></div>
<!-- /wp:group -->
',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.consultancy_agroforestry_advisors',
            'post_type' => 'customer_segment',
            'slug' => 'consultancy-agroforestry-advisors',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Consultancy & Agroforestry Advisors',
                'post_name' => 'consultancy-agroforestry-advisors',
                'post_status' => 'private',
                'post_excerpt' => 'Build consistent, evidence-led agroforestry scenarios for client strategy, design and investment planning.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Build consistent, evidence-led agroforestry scenarios for client strategy, design and investment planning.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Advisors need a repeatable way to connect site conditions, species choices, management assumptions and financial expectations.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Keeping site, species and price assumptions consistent across assignments</li><li>Explaining long-term trade-offs without hiding uncertainty</li><li>Producing reviewable outputs efficiently</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can help teams compare options, document assumptions and turn modelling outputs into a clearer client decision process.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Location-specific scenario comparison</li><li>Species and management assumptions</li><li>Multi-KPI business-plan outputs</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Define the client decision, assemble available site data, compare a small set of designs, review assumptions with specialists, and export the selected scenario for the advisory process.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Does FarmTree replace specialist judgement?</summary><!-- wp:paragraph --><p>No. It structures scenario evidence; professional and local judgement remain essential.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 1,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.consultancy-agroforestry-advisors',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.development_banks_donor_organisations',
            'post_type' => 'customer_segment',
            'slug' => 'development-banks-donor-organisations',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Development Banks & Donor Organisations',
                'post_name' => 'development-banks-donor-organisations',
                'post_status' => 'private',
                'post_excerpt' => 'Assess agroforestry programmes with clearer assumptions, comparable scenarios and long-term impact context.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Assess agroforestry programmes with clearer assumptions, comparable scenarios and long-term impact context.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Finance and donor teams need transparent project logic before committing resources and a consistent basis for later review.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Comparing programmes built on different assumptions</li><li>Reviewing long time horizons before funding decisions</li><li>Connecting planning evidence to later monitoring</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can structure scenario comparisons across economic, environmental and operational considerations without replacing due diligence.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Transparent scenario assumptions</li><li>Long-term economic and environmental projections</li><li>Exportable project-planning evidence</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Agree the appraisal question, model representative project scenarios, document sensitivity and data gaps, then use the outputs alongside technical, financial and safeguards due diligence.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Are projections investment assurance?</summary><!-- wp:paragraph --><p>No. They are decision-support evidence and do not replace due diligence or independent assurance.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 2,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.development-banks-donor-organisations',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.ngos_conservation_organisations',
            'post_type' => 'customer_segment',
            'slug' => 'ngos-conservation-organisations',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'NGOs & Conservation Organisations',
                'post_name' => 'ngos-conservation-organisations',
                'post_status' => 'private',
                'post_excerpt' => 'Connect conservation goals and livelihood priorities to practical agroforestry planning and monitoring.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Connect conservation goals and livelihood priorities to practical agroforestry planning and monitoring.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Programme teams often need to balance ecological objectives, farmer realities and implementation constraints across varied sites.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Balancing livelihood and conservation priorities</li><li>Adapting programme designs across sites</li><li>Separating measured progress from modelled futures</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can make assumptions and trade-offs visible so programmes can compare designs and communicate their planning rationale.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Scenario co-design</li><li>Production, carbon, water and economic indicators</li><li>Clear measured-versus-modelled reporting</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Frame the programme outcomes with field teams, model locally relevant options, select indicators for validation, and retain a reviewable assumptions trail.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Can local teams update scenarios?</summary><!-- wp:paragraph --><p>Yes, subject to training, data access and the agreed project workflow.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 3,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.ngos-conservation-organisations',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.nbs_carbon_project_developers',
            'post_type' => 'customer_segment',
            'slug' => 'nbs-carbon-project-developers',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'NbS & Carbon Project Developers',
                'post_name' => 'nbs-carbon-project-developers',
                'post_status' => 'private',
                'post_excerpt' => 'Test agroforestry design choices and connect project assumptions to carbon, production and financial scenarios.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Test agroforestry design choices and connect project assumptions to carbon, production and financial scenarios.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Nature-based solution developers need coherent project assumptions that can be examined before monitoring and verification workflows begin.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Testing design feasibility before validation</li><li>Connecting carbon assumptions to farmer and project value</li><li>Maintaining clear boundaries between projection and verification</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can support early scenario design and planning evidence; independent standards, validation and verification remain separate.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Carbon and biomass scenarios</li><li>Farm economics and sensitivity comparison</li><li>Traceable design assumptions</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Use FarmTree during design to compare systems and sensitivities, then pass clearly labelled inputs and projections into the project\'s independent standards and verification process.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Does FarmTree certify carbon credits?</summary><!-- wp:paragraph --><p>No. Certification, validation and verification are independent processes.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 4,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.nbs-carbon-project-developers',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.mrv_esg_platforms',
            'post_type' => 'customer_segment',
            'slug' => 'mrv-esg-platforms',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'MRV & ESG Platforms',
                'post_name' => 'mrv-esg-platforms',
                'post_status' => 'private',
                'post_excerpt' => 'Add forward-looking agroforestry scenario context to monitoring, reporting and sustainability workflows.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Add forward-looking agroforestry scenario context to monitoring, reporting and sustainability workflows.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Reporting platforms need traceable assumptions and meaningful context around the field and project data they organise.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Adding forward-looking context to observed datasets</li><li>Keeping provenance clear across systems</li><li>Representing agroforestry-specific assumptions</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can provide modelling outputs and scenario logic for integration planning, subject to an agreed technical scope and data contract.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Structured modelling outputs</li><li>Scenario metadata and provenance</li><li>Integration scoping for approved data exchanges</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Map the reporting question and data contract, validate a limited integration use case, document modelled and measured fields, then review governance before scaling.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Is a public API available?</summary><!-- wp:paragraph --><p>Integration options are scoped with FarmTree; no public integration should be assumed without an agreement.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 5,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.mrv-esg-platforms',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.government_parastatal_institutions',
            'post_type' => 'customer_segment',
            'slug' => 'government-parastatal-institutions',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Government & Parastatal Institutions',
                'post_name' => 'government-parastatal-institutions',
                'post_status' => 'private',
                'post_excerpt' => 'Compare agroforestry programme options using consistent site, species, management and impact assumptions.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Compare agroforestry programme options using consistent site, species, management and impact assumptions.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Public institutions need transparent planning methods that can support programme design across regions and stakeholder groups.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Comparing regional programme options consistently</li><li>Communicating assumptions across technical and policy teams</li><li>Working within procurement and data-governance requirements</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can help technical teams explore scenarios and communicate trade-offs while policy and procurement decisions remain with the institution.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Regional scenario comparison</li><li>Transparent planning assumptions</li><li>Long-term programme indicators</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Select representative locations, agree policy-relevant questions, compare scenarios with technical teams, and use the evidence within established governance and procurement processes.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Does FarmTree make policy decisions?</summary><!-- wp:paragraph --><p>No. It supports technical analysis; accountable institutions retain policy and procurement decisions.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 6,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.government-parastatal-institutions',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.industry_associations_multi_stakeholder_platforms',
            'post_type' => 'customer_segment',
            'slug' => 'industry-associations-multi-stakeholder-platforms',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Industry Associations & Multi-Stakeholder Platforms',
                'post_name' => 'industry-associations-multi-stakeholder-platforms',
                'post_status' => 'private',
                'post_excerpt' => 'Create a shared scenario language for agroforestry discussions across members, value chains and landscapes.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Create a shared scenario language for agroforestry discussions across members, value chains and landscapes.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Multi-stakeholder initiatives need a consistent way to compare assumptions without obscuring differences between locations or participants.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Creating shared definitions across members</li><li>Comparing options without erasing local differences</li><li>Turning discussion into reviewable next steps</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can support structured workshops and scenario conversations with a common evidence base for planning.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Workshop-ready scenarios</li><li>Comparable multi-KPI outputs</li><li>Documented assumptions and trade-offs</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Agree a shared question, prepare representative scenarios, review trade-offs in a facilitated session, and record where local validation or member-specific analysis is needed.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Can one scenario represent every member?</summary><!-- wp:paragraph --><p>Usually not. Representative scenarios support discussion but should not replace local analysis.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 7,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.industry-associations-multi-stakeholder-platforms',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.large_agri_corporate',
            'post_type' => 'customer_segment',
            'slug' => 'large-agri-corporate',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Large Agri-Corporate',
                'post_name' => 'large-agri-corporate',
                'post_status' => 'private',
                'post_excerpt' => 'Explore agroforestry options across sourcing landscapes with clearer business, production and environmental assumptions.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore agroforestry options across sourcing landscapes with clearer business, production and environmental assumptions.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Agricultural companies need to understand how design choices may affect farmer value, production, resilience and programme planning over time.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Connecting landscape goals to farmer value</li><li>Comparing programme designs across sourcing regions</li><li>Avoiding unsupported claims in sustainability reporting</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can compare representative scenarios and help teams define questions for field validation and investment review.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Representative farm and landscape scenarios</li><li>Production, resilience and financial projections</li><li>Assumption-led reporting support</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Start with a named programme and decision, model representative systems, validate assumptions with local teams, and use results alongside supply-chain and field evidence.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Are modelled results corporate reporting evidence?</summary><!-- wp:paragraph --><p>They must be clearly labelled as projections and combined with appropriate measured evidence.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 8,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.large-agri-corporate',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.social_enterprise',
            'post_type' => 'customer_segment',
            'slug' => 'social-enterprise',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Social Enterprise',
                'post_name' => 'social-enterprise',
                'post_status' => 'private',
                'post_excerpt' => 'Connect an agroforestry mission to practical operating assumptions, farmer value and an investable planning narrative.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Connect an agroforestry mission to practical operating assumptions, farmer value and an investable planning narrative.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Social enterprises need to test how ecological aims, operating choices and financial expectations fit together as they grow.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Testing mission and operating assumptions together</li><li>Working with limited technical capacity</li><li>Explaining value and uncertainty to partners</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can help teams compare models, clarify assumptions and prepare a stronger basis for partner or investor conversations.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Lean scenario comparison</li><li>Farmer and enterprise value modelling</li><li>Clear planning narratives</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Define the operating model, test a focused set of scenarios, identify the assumptions that matter most, and use the results to plan validation and partner conversations.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Is FarmTree suitable for an early-stage organisation?</summary><!-- wp:paragraph --><p>It can be when there is a clear decision, sufficient input data and an appropriately scoped engagement.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 9,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.social-enterprise',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'customer_segment.en.investors',
            'post_type' => 'customer_segment',
            'slug' => 'investors',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Investors',
                'post_name' => 'investors',
                'post_status' => 'private',
                'post_excerpt' => 'Review agroforestry opportunities through transparent scenarios, assumptions and long-term value drivers.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Review agroforestry opportunities through transparent scenarios, assumptions and long-term value drivers.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Investors need a clear view of the biological, operational and financial assumptions behind an agroforestry proposition.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Understanding biological and financial assumptions together</li><li>Testing sensitivity across long time horizons</li><li>Distinguishing projections from verified performance</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can support scenario review and sensitivity discussions; it does not provide investment advice, assurance or a guarantee of outcomes.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->

<!-- wp:list --><ul><li>Long-term value scenarios</li><li>Sensitivity and trade-off review</li><li>Traceable production, carbon and financial assumptions</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Review the project\'s source data and model assumptions, compare downside and alternative scenarios, identify diligence questions, and combine the evidence with independent technical and financial review.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->

<!-- wp:details --><details class="wp-block-details"><summary>Does FarmTree provide investment advice?</summary><!-- wp:paragraph --><p>No. FarmTree provides modelling and decision-support information, not regulated investment advice or a guarantee.</p><!-- /wp:paragraph --></details><!-- /wp:details -->

<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->',
                'menu_order' => 10,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.segment.investors',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.farmtree_water_erosion_microclimate_model_update_2026',
            'post_type' => 'post',
            'slug' => 'farmtree-water-erosion-microclimate-model-update-2026',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'What FarmTree\'s 2026 water, erosion and microclimate update means for scenario planning',
                'post_name' => 'farmtree-water-erosion-microclimate-model-update-2026',
                'post_status' => 'private',
                'post_excerpt' => 'A source-led guide to the July 2026 FarmTree model update and the questions project teams should revisit in existing scenarios.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree\'s July 2026 release updates the water and erosion models, adds microclimate effects to growth, and changes nutrient uptake and release in the soil model. Teams should review affected scenarios rather than assume older and newer runs are directly comparable.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Why model version matters</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>A projection records a model, its inputs and its assumptions at a point in time. When interconnected sub-models change, version notes become part of the evidence trail for any decision or report.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A practical review</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Record the scenario version, rerun a representative sample, compare water stress and erosion outputs, and document material differences before updating a wider portfolio.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">FarmTree context</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>This article explains FarmTree\'s published release notes. It does not claim that a software update independently validates a project outcome. See the Platform and Proof Stories pages for the wider planning workflow.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://www.farmtree.earth/release-blog" target="_blank" rel="noreferrer noopener">Release notes FarmTree Tool</a>, published 2026-07-10. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2026-07-10 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.farmtree-water-erosion-microclimate-model-update-2026',
            'category_keys' => [
                'category.en.farmtree-updates',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.eu_carbon_farming_methodologies_agroforestry_2026',
            'post_type' => 'post',
            'slug' => 'eu-carbon-farming-methodologies-agroforestry-2026',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'EU carbon-farming methodologies: what agroforestry planners should prepare',
                'post_name' => 'eu-carbon-farming-methodologies-agroforestry-2026',
                'post_status' => 'private',
                'post_excerpt' => 'The European Commission\'s 2026 carbon-farming methodology work reinforces the need for traceable baselines, monitoring and clearly separated projections.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The European Commission reports that carbon-farming methodologies now explicitly cover agriculture and agroforestry on mineral soils. Project teams should prepare transparent activity boundaries, baselines, monitoring responsibilities and durability assumptions.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Planning is not certification</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Scenario modelling can help teams test designs and document assumptions, but recognised schemes, audits and third-party verification remain separate requirements.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Build a reviewable evidence trail</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Keep source data, scenario definitions, model versions and uncertainty notes together. This makes later technical review more efficient and helps prevent modelled values being presented as measured outcomes.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Where FarmTree fits</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can support early scenario comparison across carbon, production, water and economics. Certification eligibility and quantified credits must be determined under the applicable approved methodology.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://climate.ec.europa.eu/areas-action/carbon-removals-and-carbon-farming/certification-methodologies_en" target="_blank" rel="noreferrer noopener">Certification methodologies</a>, published 2026-07-01. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2026-07-01 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.eu-carbon-farming-methodologies-agroforestry-2026',
            'category_keys' => [
                'category.en.policy-standards',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.eudr_2026_agroforestry_data_readiness',
            'post_type' => 'post',
            'slug' => 'eudr-2026-agroforestry-data-readiness',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'EUDR 2026: a data-readiness checklist for agroforestry programmes',
                'post_name' => 'eudr-2026-agroforestry-data-readiness',
                'post_status' => 'private',
                'post_excerpt' => 'A practical distinction between EUDR due-diligence information and the wider scenario evidence used to plan resilient agroforestry systems.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The European Commission states that the revised EUDR applies from 30 December 2026 for large and medium operators and later for most micro and small operators. Teams should use the time to verify geolocation, product and due-diligence workflows.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Do not confuse two evidence jobs</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>EUDR due diligence addresses deforestation-free product requirements. Agroforestry scenario modelling addresses design choices and projected outcomes. One does not automatically satisfy the other.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Prepare the data chain</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Identify data owners, map plot identifiers to source records, document quality checks, and retain a clear boundary between observed field information and model assumptions.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Use scenarios carefully</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree scenarios can help explore production, environmental and economic trade-offs. Legal interpretation and compliance decisions require the responsible organisation\'s qualified advisers.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en" target="_blank" rel="noreferrer noopener">Regulation on Deforestation-free products</a>, published 2026-05-04. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2026-05-04 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.eudr-2026-agroforestry-data-readiness',
            'category_keys' => [
                'category.en.policy-standards',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.verra_vm0042_v22_agricultural_land_management',
            'post_type' => 'post',
            'slug' => 'verra-vm0042-v22-agricultural-land-management',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Reading Verra VM0042 v2.2 through an agroforestry planning lens',
                'post_name' => 'verra-vm0042-v22-agricultural-land-management',
                'post_status' => 'private',
                'post_excerpt' => 'What the active improved agricultural land-management methodology signals about soil data, baselines and disciplined claims.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>VM0042 v2.2 is an active Verra methodology for quantifying emission reductions and soil organic carbon removals from improved agricultural land management. Its existence does not make every agroforestry activity eligible.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Begin with applicability</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Project developers should first confirm whether the activity, baseline and monitoring approach fall within the methodology. Avoid forcing a planning scenario into a certification claim.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Treat soil evidence with care</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Sampling design, processing, laboratory analysis and modelling choices affect soil-carbon conclusions. Record data quality and use conservative language where evidence is incomplete.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">FarmTree\'s role</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can organise scenario assumptions and compare linked indicators. Validation, verification and issuance remain governed by the standard and independent bodies.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://verra.org/methodologies/vm0042-improved-agricultural-land-management-v2-2/" target="_blank" rel="noreferrer noopener">VM0042 Improved Agricultural Land Management, v2.2</a>, published 2025-10-21. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2025-10-21 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.verra-vm0042-v22-agricultural-land-management',
            'category_keys' => [
                'category.en.data-evidence',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.verra_vm0042_v30_consultation_lessons',
            'post_type' => 'post',
            'slug' => 'verra-vm0042-v30-consultation-lessons',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'What the VM0042 v3.0 revision process teaches project teams about model governance',
                'post_name' => 'verra-vm0042-v30-consultation-lessons',
                'post_status' => 'private',
                'post_excerpt' => 'Methodology revisions show why agroforestry teams need version control, documented assumptions and change-aware reporting.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Verra\'s revision process for VM0042 highlights a simple operational lesson: methods evolve, so project evidence must preserve the version, inputs and decisions used at each stage.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Track the change</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Maintain a change log that links scenario versions to source datasets, review dates and responsible people. Never silently overwrite a result used in an earlier decision.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Reassess material assumptions</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>When baseline, sampling or calculation guidance changes, identify which project conclusions may be affected and prioritise those for expert review.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Keep claims bounded</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>A consultation draft is not an approved method. Describe it as a development signal, not as a current compliance requirement.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://verra.org/methodologies/revision-to-vm0042-methodology-for-improved-agricultural-land-management/" target="_blank" rel="noreferrer noopener">Major Revision to VM0042 Methodology for Improved Agricultural Land Management</a>, published 2026-03-31. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2026-03-31 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.verra-vm0042-v30-consultation-lessons',
            'category_keys' => [
                'category.en.data-evidence',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.smallholder_agroforestry_wood_production_lessons_2025',
            'post_type' => 'post',
            'slug' => 'smallholder-agroforestry-wood-production-lessons-2025',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Smallholder wood production: seven planning questions for multifunctional agroforestry',
                'post_name' => 'smallholder-agroforestry-wood-production-lessons-2025',
                'post_status' => 'private',
                'post_excerpt' => 'Lessons from the 2025 FAO and CIFOR-ICRAF report for teams comparing wood, crop, livelihood and resilience objectives.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Multifunctional smallholder tree systems differ widely. A useful plan asks who manages the trees, which products matter, when value arrives, what labour is required, how crops interact, which markets exist and how risk is shared.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Avoid one-size-fits-all design</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The FAO and CIFOR-ICRAF cases span woodlots, intercropping, home gardens and boundary planting. Each structure creates different production and livelihood dynamics.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Model timing and trade-offs</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Compare establishment cost, labour, thinning or harvest timing, crop interactions and uncertainty. Long horizons should make assumptions more visible, not more certain.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">From evidence to decision</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Use local knowledge and field validation to refine candidate scenarios. FarmTree can support comparison, while implementation choices remain with farmers and programme teams.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://www.fao.org/in-action/forest-landscape-restoration-mechanism/news-and-events/news/news-detail/agroforestry-for-wood-production---insights-from-multifunctional-smallholder-tree-farming-systems-in-asia-and-the-pacific/en" target="_blank" rel="noreferrer noopener">Agroforestry for wood production: insights from multifunctional smallholder tree farming systems</a>, published 2025-11-03. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2025-11-03 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.smallholder-agroforestry-wood-production-lessons-2025',
            'category_keys' => [
                'category.en.species-design',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.carbon_pricing_2026_nature_project_quality',
            'post_type' => 'post',
            'slug' => 'carbon-pricing-2026-nature-project-quality',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Carbon pricing in 2026: why nature projects still need a grounded investment case',
                'post_name' => 'carbon-pricing-2026-nature-project-quality',
                'post_status' => 'private',
                'post_excerpt' => 'The World Bank\'s 2026 market overview reinforces the value of quality signals, transparent assumptions and diversified project economics.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The World Bank reports wider carbon-pricing coverage and continued price differentiation by project quality. Agroforestry plans should not depend on a single assumed credit price.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Build a broader value case</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Test production, farmer value, programme cost and environmental indicators alongside carbon. A diversified decision case is more informative than a headline carbon estimate.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Use sensitivities</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Compare conservative, central and alternative assumptions for prices, timing, survival and verification cost. Label scenarios as projections rather than forecasts guaranteed to occur.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Keep market and project facts separate</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Market reports describe sector-level trends. They do not establish the quality, eligibility or future price of a particular FarmTree-supported project.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://www.worldbank.org/en/publication/state-and-trends-of-carbon-pricing" target="_blank" rel="noreferrer noopener">State and Trends of Carbon Pricing 2026</a>, published 2026-05-21. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2026-05-21 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.carbon-pricing-2026-nature-project-quality',
            'category_keys' => [
                'category.en.project-finance',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.agroforestry_species_data_switchboard_2025',
            'post_type' => 'post',
            'slug' => 'agroforestry-species-data-switchboard-2025',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Better species data starts with better provenance',
                'post_name' => 'agroforestry-species-data-switchboard-2025',
                'post_status' => 'private',
                'post_excerpt' => 'The Agroforestry Species Switchboard 4.0 shows how discoverable source provenance can strengthen species selection and model review.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Species databases become more useful when users can see where information comes from, which taxa it describes and how it can be accessed. Provenance is a quality feature, not administrative overhead.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Match data to the decision</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Growth, yield, management, product and ecological information may come from different sources. Record why each value is appropriate for the location and scenario.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Treat gaps honestly</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>A missing local parameter should trigger a research or calibration task, not unsupported precision. Document defaults and sensitivity ranges.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">FarmTree context</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree combines species characteristics with site, climate, soil and management data. Source review and local calibration remain important parts of responsible scenario design.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://switchboard.cifor-icraf.org/index.php/about" target="_blank" rel="noreferrer noopener">Agroforestry Species Switchboard 4.0</a>, published 2025-07-02. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2025-07-02 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.agroforestry-species-data-switchboard-2025',
            'category_keys' => [
                'category.en.species-design',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'post.en.nature_restoration_plans_report_once_agroforestry_2025',
            'post_type' => 'post',
            'slug' => 'nature-restoration-plans-report-once-agroforestry-2025',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Report once, use evidence well: a lesson from EU nature-restoration planning',
                'post_name' => 'nature-restoration-plans-report-once-agroforestry-2025',
                'post_status' => 'private',
                'post_excerpt' => 'The EU\'s common restoration-plan format offers a useful principle for agroforestry programmes: design information so it can support decisions and reporting without duplication.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Answer first</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The European Commission\'s common format for national restoration plans emphasises comparable information, reused data and tracking over time. Agroforestry programmes can apply the same design principle at project scale.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Define a shared information model</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Agree identifiers, units, source labels and responsibilities before collecting more data. This reduces reconciliation work later.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Connect plans and monitoring</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Each indicator should answer a project question. Keep baseline observations, management actions and projected values clearly distinguishable.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Use digital tools deliberately</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>A platform should make evidence easier to review and update. It cannot repair unclear governance or turn weak source data into a verified outcome.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p><a href="https://environment.ec.europa.eu/news/commission-adopts-user-friendly-planning-tool-support-member-states-implementing-nature-restoration-2025-05-20_en" target="_blank" rel="noreferrer noopener">Commission adopts a user-friendly planning tool to support Member States in implementing the Nature Restoration Regulation</a>, published 2025-05-20. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '2025-05-20 09:00:00',
                'comment_status' => 'closed',
            ],
            'featured_asset_key' => 'asset.news.nature-restoration-plans-report-once-agroforestry-2025',
            'category_keys' => [
                'category.en.landscape-planning',
            ],
            'child_keys' => [],
        ],
        [
            'key' => 'proof_story.en.carbon_planning',
            'post_type' => 'proof_story',
            'slug' => 'carbon-planning',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Carbon planning',
                'post_name' => 'carbon-planning',
                'post_status' => 'private',
                'post_excerpt' => 'Use traceable site, species and management assumptions to compare carbon projections without confusing planning with certification.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">The planning question</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>How do alternative agroforestry designs change the timing and distribution of projected biomass and carbon while remaining workable for farmers and project teams?</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree supports the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree connects site information, species characteristics and management choices to time-based carbon, production and economic projections. The assumptions remain visible for review.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Evidence boundaries</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Modelled carbon is a projection, not a verified credit or guaranteed outcome. Applicable standards, baseline requirements, field measurement, validation and verification remain separate.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A practical workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Define the project boundary, compare a limited set of credible designs, review sensitivity, document data gaps and take the preferred scenario into field and specialist review.</p><!-- /wp:paragraph -->',
                'menu_order' => 1,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.proof.carbon-planning',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'proof_story.en.farm_value',
            'post_type' => 'proof_story',
            'slug' => 'farm-value-projection',
            'legacy_slugs' => [
                'farm-value-modelling',
            ],
            'fields' => [
                'post_title' => 'Farm Value Projection',
                'post_name' => 'farm-value-projection',
                'post_status' => 'private',
                'post_excerpt' => 'Compare costs, labour, yields and revenues over time so farmer value remains visible in project design.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">The planning question</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Can a proposed agroforestry design create a credible path through establishment costs, changing labour needs and delayed tree-product revenues?</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree supports the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree brings production, cost, revenue and labour assumptions into the same time-based scenario, helping teams see cash-flow timing and trade-offs.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Evidence boundaries</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Prices, yields and adoption conditions can change. Results are scenario evidence rather than financial advice, assurance or a guarantee of farmer income.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A practical workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Agree representative farm types, document source assumptions, compare alternatives and sensitivities, then review the design with farmers and local specialists before implementation.</p><!-- /wp:paragraph -->',
                'menu_order' => 2,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.proof.farm-value-projection',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'proof_story.en.cocoa_scenario',
            'post_type' => 'proof_story',
            'slug' => 'cocoa-scenario-planning',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Cocoa scenario planning and monitoring',
                'post_name' => 'cocoa-scenario-planning',
                'post_status' => 'private',
                'post_excerpt' => 'Compare shade-tree density, species mix, renewal timing and farmer-value trade-offs before scaling a cocoa programme.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">The planning question</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Which regenerative cocoa design can balance production continuity, shade, diversified value, labour and long-term resilience in a specific context?</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree supports the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree compares cocoa and shade-tree arrangements using site, management, species and price assumptions, then links representative farm designs to wider programme questions.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Evidence boundaries</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>A representative scenario is not a measured outcome for every farm. Local calibration, farmer participation and field monitoring are required.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A practical workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Capture the baseline, co-design a focused set of systems, review short- and long-term trade-offs, select indicators and update scenarios as field information improves.</p><!-- /wp:paragraph -->',
                'menu_order' => 3,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.proof.cocoa-scenario-planning',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'proof_story.en.landscape_hydrology',
            'post_type' => 'proof_story',
            'slug' => 'landscape-hydrology',
            'legacy_slugs' => [
                'water-landscape-resilience',
            ],
            'fields' => [
                'post_title' => 'Landscape Hydrology',
                'post_name' => 'landscape-hydrology',
                'post_status' => 'private',
                'post_excerpt' => 'Connect hydrology, erosion, land cover and farm-value questions in a transparent landscape planning process.',
                'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">The planning question</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Where can tree-based interventions support water and landscape objectives without creating unsupported expectations about hydrological outcomes?</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree supports the work</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree can compare water-balance, erosion, production, carbon and economic indicators across defined scenarios and locations.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">Evidence boundaries</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Hydrological responses are context-dependent. Model results require appropriate source data, calibration, uncertainty communication and field evidence.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A practical workflow</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Define the catchment decision, select representative land-use systems, compare interventions, identify sensitive assumptions and connect the preferred plan to a proportionate monitoring design.</p><!-- /wp:paragraph -->',
                'menu_order' => 4,
                'post_date' => '',
            ],
            'featured_asset_key' => 'asset.proof.landscape-hydrology',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.platform',
            'post_type' => 'page',
            'slug' => 'platform',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'The FarmTree Platform',
                'post_name' => 'platform',
                'post_status' => 'private',
                'post_excerpt' => 'Design, compare and communicate agroforestry scenarios with connected scientific, environmental and economic project intelligence.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">FarmTree combines site, climate, soil, species and management information to create time-based agroforestry scenarios. Use it to compare options, keep assumptions visible and prepare decisions for field and specialist review.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.proof_stories',
            'post_type' => 'page',
            'slug' => 'proof-stories',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Proof Stories',
                'post_name' => 'proof-stories',
                'post_status' => 'private',
                'post_excerpt' => 'Explore four evidence themes grounded in FarmTree\'s published capabilities and project experience.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">These stories explain how FarmTree supports carbon planning, farm-value modelling, cocoa scenario work and water-resilience questions. They do not claim guaranteed or independently verified outcomes.</p><!-- /wp:paragraph --><!-- wp:list --><ul><li><a href="/proof-stories/carbon-planning/">Carbon planning</a>: Use traceable site, species and management assumptions to compare carbon projections without confusing planning with certification.</li><li><a href="/proof-stories/farm-value-projection/">Farm Value Projection</a>: Compare costs, labour, yields and revenues over time so farmer value remains visible in project design.</li><li><a href="/proof-stories/cocoa-scenario-planning/">Cocoa scenario planning and monitoring</a>: Compare shade-tree density, species mix, renewal timing and farmer-value trade-offs before scaling a cocoa programme.</li><li><a href="/proof-stories/landscape-hydrology/">Landscape Hydrology</a>: Connect hydrology, erosion, land cover and farm-value questions in a transparent landscape planning process.</li></ul><!-- /wp:list -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.customer_segments',
            'post_type' => 'page',
            'slug' => 'customer-segments',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Customer Segments',
                'post_name' => 'customer-segments',
                'post_status' => 'private',
                'post_excerpt' => 'Ten practical routes into FarmTree for organisations making different agroforestry decisions.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">The same model can support different decisions. Start with your organisation\'s question, available evidence and responsibilities, then choose an appropriately scoped workflow.</p><!-- /wp:paragraph --><!-- wp:list {"ordered":true} --><ol><li><a href="/customer-segments/consultancy-agroforestry-advisors/">Consultancy &amp; Agroforestry Advisors</a>: Build consistent, evidence-led agroforestry scenarios for client strategy, design and investment planning.</li><li><a href="/customer-segments/development-banks-donor-organisations/">Development Banks &amp; Donor Organisations</a>: Assess agroforestry programmes with clearer assumptions, comparable scenarios and long-term impact context.</li><li><a href="/customer-segments/ngos-conservation-organisations/">NGOs &amp; Conservation Organisations</a>: Connect conservation goals and livelihood priorities to practical agroforestry planning and monitoring.</li><li><a href="/customer-segments/nbs-carbon-project-developers/">NbS &amp; Carbon Project Developers</a>: Test agroforestry design choices and connect project assumptions to carbon, production and financial scenarios.</li><li><a href="/customer-segments/mrv-esg-platforms/">MRV &amp; ESG Platforms</a>: Add forward-looking agroforestry scenario context to monitoring, reporting and sustainability workflows.</li><li><a href="/customer-segments/government-parastatal-institutions/">Government &amp; Parastatal Institutions</a>: Compare agroforestry programme options using consistent site, species, management and impact assumptions.</li><li><a href="/customer-segments/industry-associations-multi-stakeholder-platforms/">Industry Associations &amp; Multi-Stakeholder Platforms</a>: Create a shared scenario language for agroforestry discussions across members, value chains and landscapes.</li><li><a href="/customer-segments/large-agri-corporate/">Large Agri-Corporate</a>: Explore agroforestry options across sourcing landscapes with clearer business, production and environmental assumptions.</li><li><a href="/customer-segments/social-enterprise/">Social Enterprise</a>: Connect an agroforestry mission to practical operating assumptions, farmer value and an investable planning narrative.</li><li><a href="/customer-segments/investors/">Investors</a>: Review agroforestry opportunities through transparent scenarios, assumptions and long-term value drivers.</li></ol><!-- /wp:list -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.case_studies',
            'post_type' => 'page',
            'slug' => 'case-studies',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Case Studies',
                'post_name' => 'case-studies',
                'post_status' => 'private',
                'post_excerpt' => 'FarmTree project experience, presented with clear sources and claim boundaries.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">This private pre-release hub will link only to editor-approved case material. Named organisations, outcomes and permissions require final human approval before publication.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.team',
            'post_type' => 'page',
            'slug' => 'team',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Team',
                'post_name' => 'team',
                'post_status' => 'private',
                'post_excerpt' => 'The people building and applying FarmTree\'s agroforestry planning approach.',
                'post_content' => '<!-- wp:cover {"url":"%%FARMTREE_MEDIA_URL:asset.team.hero%%","id":%%FARMTREE_MEDIA_ID:asset.team.hero%%,"dimRatio":60,"overlayColor":"black","isUserOverlayColor":true,"minHeight":520,"contentPosition":"center center","align":"full","className":"ft-team-hero"} --><div class="wp-block-cover alignfull ft-team-hero" style="min-height:520px"><img class="wp-block-cover__image-background wp-image-%%FARMTREE_MEDIA_ID:asset.team.hero%%" alt="" src="%%FARMTREE_MEDIA_URL:asset.team.hero%%" data-object-fit="cover"/><span aria-hidden="true" class="wp-block-cover__background has-black-background-color has-background-dim-60 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} --><p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">People behind the platform</p><!-- /wp:paragraph --><!-- wp:heading {"level":1,"textColor":"white","fontSize":"heading"} --><h1 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Meet the FarmTree team</h1><!-- /wp:heading --><!-- wp:paragraph {"textColor":"white","fontSize":"lead"} --><p class="has-white-color has-text-color has-lead-font-size">Agroforestry science, modelling, technology and project experience in one multidisciplinary team.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-hero-caption","textColor":"white","fontSize":"caption"} --><p class="ft-team-hero-caption has-white-color has-text-color has-caption-font-size">Illustrative field collaboration</p><!-- /wp:paragraph --></div></div><!-- /wp:cover --><!-- wp:paragraph {"className":"ft-team-intro","fontSize":"lead"} --><p class="ft-team-intro has-lead-font-size">Meet the people building and supporting the FarmTree Platform.</p><!-- /wp:paragraph --><!-- wp:group {"className":"ft-team-grid","layout":{"type":"grid","minimumColumnWidth":"18rem"}} --><div class="wp-block-group ft-team-grid"><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.arnoud-braun%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.arnoud-braun%%" alt="Arnoud Braun, Founder &amp; CEO" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.arnoud-braun%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Arnoud Braun</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Founder &amp; CEO</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Arnoud is FarmTree\'s CEO. He focuses on the company\'s legal, administrative and sales work, drawing on his upbringing in Kenya and studies in tropical soil science at Wageningen.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/brauna" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.maximilian-michael-moeller%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.maximilian-michael-moeller%%" alt="Maximilian Michael Möller, Chief Growth Officer" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.maximilian-michael-moeller%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Maximilian Michael Möller</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Chief Growth Officer</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Maximilian Michael Möller serves as Chief Growth Officer at FarmTree B.V.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/maximilian-michael-moeller/" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.frank-van-schoubroeck%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.frank-van-schoubroeck%%" alt="Frank van Schoubroeck, Founder &amp; CTO" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.frank-van-schoubroeck%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Frank van Schoubroeck</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Founder &amp; CTO</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Frank conceptualised the FarmTree model after two decades of supporting smallholder farmers. He leads FarmTree\'s marketing, modelling and IT research and development.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/frank-van-schoubroeck-9524518" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.germaine-van-teeffelen%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.germaine-van-teeffelen%%" alt="Germaine van Teeffelen, Interim Project Manager" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.germaine-van-teeffelen%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Germaine van Teeffelen</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Interim Project Manager</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Germaine supports project coordination at FarmTree as Interim Project Manager.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/germaine-van-teeffelen/" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.irene-vinkenburg%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.irene-vinkenburg%%" alt="Irene Vinkenburg, Modelling &amp; IT Lead" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.irene-vinkenburg%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Irene Vinkenburg</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Modelling &amp; IT Lead</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Irene develops the FarmTree Model, translating science into code through dynamic modelling and maintaining and improving tools across the FarmTree Platform.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/irene-vinkenburg-abb49033" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.betelehem-beyene%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.betelehem-beyene%%" alt="Betelehem Beyene, Portfolio Manager" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.betelehem-beyene%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Betelehem Beyene</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Portfolio Manager</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Betelehem builds client relationships, supports business development and helps clients get more from the FarmTree Platform. Her background is in private-sector development in Ethiopia\'s agricultural sector.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/betelehem-beyene" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.roos-van-haeff%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.roos-van-haeff%%" alt="Roos van Haeff, Impact Quantification Lead" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.roos-van-haeff%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Roos van Haeff</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Impact Quantification Lead</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Roos works on agroforestry quantification and has contributed to the FarmTree Model and Platform since their inception. Her current work in East Africa emphasises water management and livelihoods.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/roos-van-haeff-3b6032137" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.edi-yoga%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.edi-yoga%%" alt="Edi Yoga, FarmTree Representative, Indonesia" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.edi-yoga%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Edi Yoga</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">FarmTree Representative, Indonesia</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Edi represents FarmTree in Indonesia\'s agroforestry and social-forestry sector. He specialises in soil geography and landscape dynamics.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/edi-yoga/" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.hery-hanipan%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.hery-hanipan%%" alt="Hery Hanipan, FarmTree Database Management, Indonesia" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.hery-hanipan%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Hery Hanipan</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">FarmTree Database Management, Indonesia</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Hery is a data scientist supporting the creation of FarmTree\'s calibrated species library, with particular attention to Asian entries.</p><!-- /wp:paragraph --></article><!-- /wp:group --><!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":%%FARMTREE_MEDIA_ID:asset.team.alvaro-micheletti%%,"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="%%FARMTREE_MEDIA_URL:asset.team.alvaro-micheletti%%" alt="Álvaro Mitcheletti, Portfolio Manager, Latin America" class="wp-image-%%FARMTREE_MEDIA_ID:asset.team.alvaro-micheletti%%"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">Álvaro Mitcheletti</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">Portfolio Manager, Latin America</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">Álvaro is an agroforestry modeller responsible for FarmTree\'s Spanish-, Portuguese- and French-language portfolio across projects in Latin America and Africa. He is based in Brazil.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="https://www.linkedin.com/in/%C3%A1lvaro-micheletti-583ab6129/" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph --></article><!-- /wp:group --></div><!-- /wp:group -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [
                'team_member.arnoud-braun',
                'team_member.maximilian-michael-moeller',
                'team_member.frank-van-schoubroeck',
                'team_member.germaine-van-teeffelen',
                'team_member.irene-vinkenburg',
                'team_member.betelehem-beyene',
                'team_member.roos-van-haeff',
                'team_member.edi-yoga',
                'team_member.hery-hanipan',
                'team_member.alvaro-micheletti',
            ],
        ],
        [
            'key' => 'page.en.vacancies',
            'post_type' => 'page',
            'slug' => 'vacancies',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Vacancies',
                'post_name' => 'vacancies',
                'post_status' => 'private',
                'post_excerpt' => 'Opportunities to contribute to FarmTree\'s mission and scientific platform.',
                'post_content' => '<!-- wp:group {"className":"ft-careers-empty","layout":{"type":"constrained"}} --><section class="wp-block-group ft-careers-empty"><!-- wp:paragraph {"className":"ft-native-eyebrow"} --><p class="ft-native-eyebrow">Careers at FarmTree</p><!-- /wp:paragraph --><!-- wp:heading {"level":2,"fontSize":"heading-small"} --><h2 class="wp-block-heading has-heading-small-font-size">No approved vacancies are open right now</h2><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">New roles will appear here after they have been approved for publication. Until then, learn more about the people and work behind FarmTree.</p><!-- /wp:paragraph --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/team/">Meet the team</a></div><!-- /wp:button --><!-- wp:button {"className":"is-style-outline"} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/contact/">Contact FarmTree</a></div><!-- /wp:button --></div><!-- /wp:buttons --></section><!-- /wp:group -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.contact',
            'post_type' => 'page',
            'slug' => 'contact',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Contact FarmTree',
                'post_name' => 'contact',
                'post_status' => 'private',
                'post_excerpt' => 'Discuss an agroforestry planning, modelling or platform question with the FarmTree team.',
                'post_content' => '<!-- wp:paragraph --><p>The local pre-release form is intentionally unavailable until an approved delivery backend and privacy review are complete. No information entered here is transmitted, stored or logged.</p><!-- /wp:paragraph -->

<!-- wp:html --><form class="ft-contact-form" aria-describedby="ft-contact-unavailable"><fieldset disabled><legend>Contact details</legend><label>Name *<input name="name" autocomplete="name" required></label><label>Email *<input type="email" name="email" autocomplete="email" required></label><label>Phone <input type="tel" name="phone" autocomplete="tel"></label><label>Organisation <input name="organisation" autocomplete="organization"></label><label>Topic *<select name="topic" required><option value="">Choose a topic</option><option>Platform and demo</option><option>Project modelling</option><option>Quotation</option><option>Other</option></select></label><label>Message *<textarea name="message" rows="6" required></textarea></label><label><input type="checkbox" name="consent" required> I agree that FarmTree may use my details to respond.</label><button type="submit" disabled>Delivery unavailable</button></fieldset></form><p id="ft-contact-unavailable"><strong>Safe fallback:</strong> email <a href="mailto:info@farmtree.earth?subject=FarmTree%20contact%20request">info@farmtree.earth</a>. Your mail application will show exactly what is sent.</p><!-- /wp:html -->

<!-- wp:heading --><h2 class="wp-block-heading">Visit FarmTree</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p><a href="https://www.openstreetmap.org/search?query=Bronland%2012C-1%2C%206708%20WH%20Wageningen" target="_blank" rel="noreferrer noopener">View the location on OpenStreetMap ↗</a></p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.blog',
            'post_type' => 'page',
            'slug' => 'blog',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'News & Insights',
                'post_name' => 'blog',
                'post_status' => 'private',
                'post_excerpt' => 'Source-led FarmTree perspectives on agroforestry planning, evidence, policy and model practice.',
                'post_content' => '<!-- wp:group {"className":"ft-blog-intro","layout":{"type":"constrained"}} --><div class="wp-block-group ft-blog-intro"><!-- wp:paragraph {"className":"ft-native-eyebrow"} --><p class="ft-native-eyebrow">Ideas for better decisions</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">Source-led FarmTree analysis and practical interpretation for agroforestry planning teams.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:query {"queryId":8,"query":{"perPage":1,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"ft-blog-featured"} -->
<div class="wp-block-query ft-blog-featured"><!-- wp:post-template --><!-- wp:group {"className":"ft-blog-featured-card","layout":{"type":"constrained"}} --><div class="wp-block-group ft-blog-featured-card"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /--><div class="ft-blog-featured-copy"><!-- wp:post-terms {"term":"category","fontSize":"caption"} /--><!-- wp:post-date {"fontSize":"caption"} /--><!-- wp:post-title {"level":2,"isLink":true,"fontSize":"heading-small"} /--><!-- wp:post-excerpt {"moreText":"","excerptLength":34} /--><!-- wp:read-more {"content":"Read feature","className":"ft-news-read-more"} /--></div></div><!-- /wp:group --><!-- /wp:post-template --></div><!-- /wp:query -->
<!-- wp:heading {"level":2,"className":"ft-blog-latest","fontSize":"heading-small"} --><h2 class="wp-block-heading ft-blog-latest has-heading-small-font-size">Latest insights</h2><!-- /wp:heading -->
<!-- wp:query {"queryId":9,"query":{"perPage":8,"pages":0,"offset":1,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"ft-blog-grid"} -->
<div class="wp-block-query ft-blog-grid"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"ft-news-item","layout":{"type":"constrained"}} --><div class="wp-block-group ft-news-item">
<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->
<!-- wp:post-terms {"term":"category","fontSize":"caption"} /-->
<!-- wp:post-date {"fontSize":"caption"} /-->
<!-- wp:post-title {"level":2,"isLink":true,"fontSize":"lead"} /-->
<!-- wp:post-excerpt {"moreText":"","excerptLength":24,"fontSize":"small"} /-->
<!-- wp:read-more {"content":"Read article","className":"ft-news-read-more"} /-->
</div><!-- /wp:group -->
<!-- /wp:post-template --></div><!-- /wp:query -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.acknowledgements',
            'post_type' => 'page',
            'slug' => 'acknowledgements',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Acknowledgements',
                'post_name' => 'acknowledgements',
                'post_status' => 'private',
                'post_excerpt' => 'The research, data, software and collaboration foundations that support FarmTree.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">FarmTree\'s acknowledgements should identify approved contributors and upstream resources without implying endorsement. Final names and permissions require owner review.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.licenses',
            'post_type' => 'page',
            'slug' => 'licenses',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Licenses',
                'post_name' => 'licenses',
                'post_status' => 'private',
                'post_excerpt' => 'Understand available FarmTree Platform access and discuss the right scope for your team.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">License scope depends on intended users, projects, support and data needs. Contact FarmTree for current approved terms; this page does not make a binding offer.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.privacy',
            'post_type' => 'page',
            'slug' => 'privacy',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Privacy Policy',
                'post_name' => 'privacy',
                'post_status' => 'private',
                'post_excerpt' => 'How the FarmTree website handles personal information.',
                'post_content' => '<!-- wp:paragraph --><p>Last updated: 3 September 2026</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree B.V. respects your privacy and is committed to handling personal data in a transparent and responsible manner.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>This Privacy Policy explains what information may be processed when you visit farmtree.eu, why it is processed and what rights you may have.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">1. Who we are</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Email: info@farmtree.earth</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree B.V. is the entity identified on farmtree.eu. This notice describes the website-related processing associated with farmtree.eu.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">2. Information processed when you visit the website</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree does not currently use public behavioural analytics, advertising pixels or visitor-profiling technologies on farmtree.eu.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>When you access the website, technical request information may nevertheless be processed by the hosting infrastructure. This may include:</p><!-- /wp:paragraph -->

<!-- wp:list --><ul><li>IP address</li><li>date and time of the request</li><li>requested page or resource</li><li>browser and user-agent information</li><li>referring page, where provided</li><li>technical information required to deliver and protect the website</li></ul><!-- /wp:list -->

<!-- wp:paragraph --><p>The hosting environment uses Apache access logs and AWStats for technical and aggregate website statistics.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>This information is processed for website delivery, security, troubleshooting, availability and technical performance.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">3. Contacting FarmTree</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The current website uses an email-based contact experience.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>When you select a contact or quotation action, your own email application may open and allow you to send a message to info@farmtree.earth.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The website itself does not currently submit or store contact-form entries in the FarmTree WordPress database.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The reviewed website has no newsletter subscription, and comments are closed on all nine News posts.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>If you email FarmTree, the information you choose to provide may be used to respond to your request, communicate with you and, where relevant, take steps related to a potential or existing business relationship.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">4. Accounts and authentication</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>farmtree.eu does not currently provide public account registration.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>WordPress authentication functionality exists for authorised website administration and controlled access. When an authorised user signs in, WordPress may process authentication information and set strictly necessary login and session cookies.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>These cookies are used for authentication and security.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">5. Cookies and local browser storage</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>At the date of this Privacy Policy, an ordinary anonymous visit to the public website does not set advertising or behavioural-tracking cookies.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The FarmTree Native interface may use browser session storage for presentation purposes, such as remembering whether a visual metric animation has already been displayed during the browser session. This storage does not contain information entered by the visitor.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>WordPress authentication cookies are used only when login or controlled-access functionality is used.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>No cookie banner is currently present. If FarmTree introduces analytics, marketing or other non-essential cookies in the future, this Privacy Policy and, where legally required, the consent mechanism will be updated before those technologies are enabled.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">6. Hosting and technical services</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The website is hosted using Vimexx infrastructure on a network registered in the Netherlands.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Hosting systems process technical request information needed to provide, secure, maintain and troubleshoot the website.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The production WordPress installation also uses administrative and backup integrations supplied through the hosting environment. Extendify Insights and SeedProd usage telemetry are disabled in the reviewed configuration.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">7. External websites and services</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>farmtree.eu contains links to external websites and services, including the FarmTree Platform, LinkedIn, YouTube, OpenStreetMap and third-party information sources.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The FarmTree website does not embed those services or automatically transmit form data to the FarmTree Platform in the reviewed configuration.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>When you follow an external link, you leave farmtree.eu and the privacy practices of the destination service apply.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The FarmTree Platform is currently accessed through links to tool.farmtree.earth.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">8. Artificial intelligence features</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree has technical components that may support an AI assistant in the future.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The FarmTree AI Assistant is currently disabled.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>No public AI widget is rendered, conversation logging is disabled, no conversation history is stored and visitor information is not currently sent by this website to OpenAI, Anthropic or another AI provider.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>If such functionality is activated in the future, the applicable privacy information will be updated before public use.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">9. Team and professional information</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The website contains professional information about FarmTree team members, including names, roles, biographies, photographs and links to professional profiles.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>This information is presented as organisational and professional information about the FarmTree team.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">10. Legal basis</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Depending on the processing activity, FarmTree processes personal data where this is necessary:</p><!-- /wp:paragraph -->

<!-- wp:list --><ul><li>to operate, secure and maintain the website</li><li>for FarmTree\'s legitimate interests in communicating about its organisation, services and activities</li><li>to respond to enquiries and take steps requested by a person before entering into a business relationship</li><li>to comply with applicable legal obligations</li><li>where another legal basis under applicable data-protection law applies</li></ul><!-- /wp:list -->

<!-- wp:paragraph --><p>FarmTree does not currently use this website for automated decision-making or visitor profiling that produces legal or similarly significant effects.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">11. Data retention</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree does not state fixed retention periods in this Privacy Policy because no fixed periods were established by the website runtime audit.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The reviewed runtime currently stores authorised WordPress account and session information and team profile information. The hosting environment stores access-log and AWStats information and may retain website backups.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Email sent directly to info@farmtree.earth is handled outside the farmtree.eu WordPress database.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree retains personal data only for as long as reasonably necessary for the purpose for which it was processed, including applicable technical, security, business and legal requirements.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">12. Data security</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree uses technical and organisational measures intended to protect website and account information against unauthorised access, loss, misuse or alteration.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>No internet-based system can be guaranteed to be completely secure.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">13. Your rights</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Where the GDPR applies, you may have rights concerning your personal data, including rights of access, rectification, erasure, restriction, objection and, where applicable, data portability.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>You may contact FarmTree regarding a privacy request at info@farmtree.earth.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree may need to verify your identity before responding to certain requests.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>You may also have the right to lodge a complaint with the competent data-protection authority.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">14. External links and international processing</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The reviewed website configuration does not automatically load third-party fonts, maps, videos, analytics scripts or other third-party browser resources from FarmTree Native pages.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>If you choose to follow an external link, the destination service receives the request and may process information outside the European Economic Area under its own privacy arrangements.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">15. Changes to this Privacy Policy</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree may update this Privacy Policy when the website, services, technology or applicable requirements change.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The current version will be published on farmtree.eu with its latest revision date.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">16. Contact</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Questions about this Privacy Policy or FarmTree\'s handling of personal data can be sent to:</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands<br>info@farmtree.earth</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.terms',
            'post_type' => 'page',
            'slug' => 'terms',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Terms & Conditions',
                'post_name' => 'terms',
                'post_status' => 'private',
                'post_excerpt' => 'Terms for use of the public FarmTree website.',
                'post_content' => '<!-- wp:paragraph --><p>Last updated: 3 September 2026</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>These Terms &amp; Conditions apply to the use of the public FarmTree website at farmtree.eu.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>By using this website, you agree to use it in accordance with these Terms and applicable law.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">1. About FarmTree</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>This website is operated by:</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands<br>Email: info@farmtree.earth</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">2. Purpose of the website</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>farmtree.eu provides information about FarmTree, agroforestry planning, FarmTree\'s work, methodology, technology, projects, insights and related activities.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The website also provides links to the separate FarmTree Platform and other external services.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">3. Informational nature of website content</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Information published on farmtree.eu is provided for general informational and professional-communication purposes.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Website content should not, by itself, be treated as a binding financial, investment, legal, regulatory, scientific, certification or other professional recommendation.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Agroforestry outcomes depend on project-specific assumptions, data, locations, management decisions, environmental conditions and other factors.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Users should assess relevant project-specific information before making material decisions.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">4. FarmTree Platform</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The FarmTree Platform is available through a separate link from this website to tool.farmtree.earth.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Use of the FarmTree Platform may be governed by separate account, subscription, contractual or platform terms.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>These website Terms do not replace an executed agreement between FarmTree and a customer, partner or other organisation.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>If an executed agreement conflicts with these general website Terms, the executed agreement governs the relevant contractual relationship to the extent of that conflict.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">5. No contract created by general website use</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Browsing farmtree.eu, reading website content or sending a general enquiry does not by itself create a contractual relationship with FarmTree.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>A commercial or professional relationship may be established separately through an accepted proposal, agreement, Platform arrangement or other expressly agreed terms.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">6. Intellectual property</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Unless otherwise stated, the website structure, FarmTree branding, original text, graphics, visual design, software-related website materials and other original FarmTree content are owned by or licensed to FarmTree B.V.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Third-party names, trademarks, logos, photographs, publications and other materials remain the property of their respective owners.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>You may view and use the website for legitimate personal and professional informational purposes.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>You may not reproduce, commercially exploit, misrepresent, remove ownership notices from or redistribute protected FarmTree materials beyond what is permitted by applicable law or expressly authorised by FarmTree.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">7. Third-party materials and links</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>The website links to third-party websites, publications, platforms and professional profiles.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Such links are provided for convenience, reference or supporting context.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree does not control third-party websites and is not responsible for their availability, security, privacy practices, accuracy or terms.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>A link does not necessarily constitute endorsement of every statement, product or service available at the external destination.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">8. Website availability</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree aims to keep the website accurate, secure and available but does not guarantee uninterrupted or error-free operation.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The website may occasionally be changed, updated, suspended or temporarily unavailable because of maintenance, security, technical problems or external circumstances.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">9. Accuracy and updates</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree aims to maintain useful and accurate information.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>However, website material may become outdated as projects, regulations, scientific knowledge, technologies, organisations or external sources change.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree may update or remove website content without prior notice.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">10. Illustrative and modelling information</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Certain visualisations, scenarios, projections, maps, metrics or examples on the website may be illustrative or model-based.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>They should be interpreted in the context provided and should not be assumed to represent a guaranteed project outcome, financial return, environmental result or verified project location unless specifically identified as such.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">11. Limitation of liability</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>To the extent permitted by applicable law, FarmTree B.V. is not liable for loss arising solely from reliance on general website information, temporary website unavailability, third-party websites or circumstances outside FarmTree\'s reasonable control.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by applicable law.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">12. Acceptable use</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>You must not use farmtree.eu in a way that:</p><!-- /wp:paragraph -->

<!-- wp:list --><ul><li>violates applicable law</li><li>interferes with the security or operation of the website</li><li>attempts unauthorised access to systems or accounts</li><li>distributes malicious code</li><li>misrepresents FarmTree or its content</li><li>unlawfully infringes intellectual-property or privacy rights</li></ul><!-- /wp:list -->

<!-- wp:heading --><h2 class="wp-block-heading">13. Privacy</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Use of farmtree.eu is also subject to the FarmTree Privacy Policy.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Where personal data is processed, the Privacy Policy explains the relevant website practices and rights.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">14. Changes to these Terms</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>FarmTree may update these Terms when the website, services or applicable requirements change.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The latest version published on farmtree.eu applies from the revision date shown above.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">15. Severability</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions continue to apply to the extent permitted by law.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">16. Contact</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Questions about these Terms may be sent to:</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands<br>info@farmtree.earth</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.solutions',
            'post_type' => 'page',
            'slug' => 'solutions',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Solutions',
                'post_name' => 'solutions',
                'post_status' => 'private',
                'post_excerpt' => 'Plan, understand, learn, capture, operate and scale agroforestry evidence.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">FarmTree supports farm planning, project investment cases, local data capture, team learning and portfolio analysis. Scope and outputs are agreed for each engagement.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.user_videos',
            'post_type' => 'page',
            'slug' => 'user-videos',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'FarmTree Platform Videos',
                'post_name' => 'user-videos',
                'post_status' => 'private',
                'post_excerpt' => 'Practical guidance for building scenarios, comparing results and working with FarmTree tools.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">Approved training videos can be embedded here from the official FarmTree library. This private route avoids dead navigation while the final media selection is reviewed.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.cocoa_focus',
            'post_type' => 'page',
            'slug' => 'cocoa-focus',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'Cocoa Focus',
                'post_name' => 'cocoa-focus',
                'post_status' => 'private',
                'post_excerpt' => 'Compare regenerative cocoa designs and landscape investment questions with transparent assumptions.',
                'post_content' => '<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">FarmTree can support cocoa programmes in comparing shade-tree systems, renewal timing, production, farmer value, carbon and other indicators. Local evidence and field review remain essential.</p><!-- /wp:paragraph -->

<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->

<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
        [
            'key' => 'page.en.news_insights',
            'post_type' => 'page',
            'slug' => 'news-insights',
            'legacy_slugs' => [],
            'fields' => [
                'post_title' => 'News & Insights',
                'post_name' => 'news-insights',
                'post_status' => 'private',
                'post_excerpt' => 'Source-led FarmTree analysis for agroforestry planning teams.',
                'post_content' => '<!-- wp:group {"className":"ft-blog-intro","layout":{"type":"constrained"}} --><div class="wp-block-group ft-blog-intro"><!-- wp:paragraph {"className":"ft-native-eyebrow"} --><p class="ft-native-eyebrow">Ideas for better decisions</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">Source-led FarmTree analysis and practical interpretation for agroforestry planning teams.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:query {"queryId":8,"query":{"perPage":1,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"ft-blog-featured"} -->
<div class="wp-block-query ft-blog-featured"><!-- wp:post-template --><!-- wp:group {"className":"ft-blog-featured-card","layout":{"type":"constrained"}} --><div class="wp-block-group ft-blog-featured-card"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /--><div class="ft-blog-featured-copy"><!-- wp:post-terms {"term":"category","fontSize":"caption"} /--><!-- wp:post-date {"fontSize":"caption"} /--><!-- wp:post-title {"level":2,"isLink":true,"fontSize":"heading-small"} /--><!-- wp:post-excerpt {"moreText":"","excerptLength":34} /--><!-- wp:read-more {"content":"Read feature","className":"ft-news-read-more"} /--></div></div><!-- /wp:group --><!-- /wp:post-template --></div><!-- /wp:query -->
<!-- wp:heading {"level":2,"className":"ft-blog-latest","fontSize":"heading-small"} --><h2 class="wp-block-heading ft-blog-latest has-heading-small-font-size">Latest insights</h2><!-- /wp:heading -->
<!-- wp:query {"queryId":9,"query":{"perPage":8,"pages":0,"offset":1,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"ft-blog-grid"} -->
<div class="wp-block-query ft-blog-grid"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:group {"className":"ft-news-item","layout":{"type":"constrained"}} --><div class="wp-block-group ft-news-item">
<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->
<!-- wp:post-terms {"term":"category","fontSize":"caption"} /-->
<!-- wp:post-date {"fontSize":"caption"} /-->
<!-- wp:post-title {"level":2,"isLink":true,"fontSize":"lead"} /-->
<!-- wp:post-excerpt {"moreText":"","excerptLength":24,"fontSize":"small"} /-->
<!-- wp:read-more {"content":"Read article","className":"ft-news-read-more"} /-->
</div><!-- /wp:group -->
<!-- /wp:post-template --></div><!-- /wp:query -->',
                'menu_order' => 0,
                'post_date' => '',
            ],
            'featured_asset_key' => '',
            'category_keys' => [],
            'child_keys' => [],
        ],
    ],
];
