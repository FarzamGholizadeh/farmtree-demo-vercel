<?php if (!defined('ABSPATH')) exit; ?>
<section class="page active" id="page-home">
<div class="hero">
<img fetchpriority="high" alt="Agroforestry landscape planning — tree-based farming systems and landscape investment in Madagascar" class="hero-img" id="heroImg" src="<?php echo farmtree_asset('case-giz_opt.webp'); ?>"/>
<div class="green-blob"></div>
<button type="button" class="arrow-side left" id="prevHero">‹</button><button type="button" class="arrow-side right" id="nextHero">›</button>
<div class="hero-content">
<div class="kicker" id="heroKicker">AGROFORESTRY INTELLIGENCE</div>
<h1 id="heroTitle">Make agroforestry measurable, investable and scalable.</h1>
<p id="heroText">FarmTree helps organisations turn agroforestry complexity into clearer project intelligence for planning, reporting and investment decisions.</p>
<div class="ft-hero-cta-row"><a class="cta-link" target="_blank" rel="noopener noreferrer" data-ft-action="request-demo" href="https://tool.farmtree.earth/Identity/Account/Register">Request a demo ↗</a><button type="button" class="cta-link secondary" data-ft-action="request-quotation">Ask for a quotation ↗</button></div><div class="ft-free-plan-card"><span>Future service</span><strong>Design your own agroforestry system</strong><p>Explore how FarmTree turns agroforestry scenarios into measurable outcomes and investment-ready plans.</p></div>
</div>
<div class="hero-controls" role="tablist" aria-label="Hero slides">
<button type="button" class="hero-dot active" data-slide="0" aria-label="Slide 1: Agroforestry Planning" aria-selected="true" role="tab"></button>
<button type="button" class="hero-dot" data-slide="1" aria-label="Slide 2: Science-Based Modelling" aria-selected="false" role="tab"></button>
</div>
</div>
<div class="video-home"></div>
</section><section class="section ft-about-feedback">
<div class="container ft-u-center">
<h2 class="kicker ft-kicker-h">About FarmTree</h2>
<div class="metrics ft-track-metrics" data-ft-static aria-label="FarmTree track record">
<article class="metric"><div class="metric-icon"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3 2.6-4.6 5.5-4.6S13.9 16 14.5 19"/><circle cx="16.6" cy="9.2" r="2.6"/><path d="M15.9 14.6c2.7.1 4.3 1.5 4.9 4"/></svg></div><h3>+100</h3><p>Active FarmTree Tool users</p></article>
<article class="metric"><div class="metric-icon"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3.5 7.5c0-1.1.9-2 2-2h4l2 2.4h7c1.1 0 2 .9 2 2v8.1c0 1.1-.9 2-2 2h-13c-1.1 0-2-.9-2-2z"/><path d="M7.5 13.5h9"/><path d="M7.5 16.5h5.5"/></svg></div><h3>+30</h3><p>Projects</p></article>
<article class="metric"><div class="metric-icon"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 4.5 3.8 6.6v12.9L9 17.4l6 2.1 5.2-2.1V4.5L15 6.6z"/><path d="M9 4.5v12.9"/><path d="M15 6.6v12.9"/></svg></div><h3>+40</h3><p>Agricultural regions impacted</p></article>
<article class="metric"><div class="metric-icon"><svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="6.4" r="3"/><path d="M6.2 20c.7-3.4 3-5.2 5.8-5.2s5.1 1.8 5.8 5.2"/><path d="M3 20.5h18"/><path d="M4.5 17.2c1-.2 1.8-.9 2.1-1.9M19.5 17.2c-1-.2-1.8-.9-2.1-1.9"/></svg></div><h3>+1,000,000</h3><p>Farmers indirectly reached</p></article>
</div>
<div class="overlap ft-platform-screenshot-block">
<div class="overlap-img ft-mock-outer ft-slider-outer">
<div class="ft-media-slider" role="group" aria-roledescription="carousel" aria-label="FarmTree platform media" tabindex="0">
  <div class="ft-ms-frame">
    <div class="ft-ms-stage">
      <div class="ft-ms-track" id="ftPpsTrack">
        <div class="ft-ms-slide" role="group" aria-roledescription="slide" aria-label="Slide 1 of 2 — agroforestry landscape" aria-description="Silent looping aerial view of a maturing agroforestry landscape at sunrise, with rows of trees across misted hills.">
          <!-- playsinline is required for iOS inline video and is kept intentionally (playback is controlled by JS visibility/reduced-motion logic, no autoplay attribute). The Firefox "unsupported" note from webhint (compat-api/html) is a known false-positive and is narrowly suppressed in .hintrc — do not remove this attribute. -->
          <video class="ft-ms-video" width="1280" height="720" muted loop playsinline preload="metadata" poster="<?php echo farmtree_asset('media/power-project-staff-landscape-poster.webp'); ?>" aria-hidden="true" tabindex="-1">
            <source src="<?php echo farmtree_asset('media/power-project-staff-landscape.webm'); ?>" type="video/webm">
            <source src="<?php echo farmtree_asset('media/power-project-staff-landscape.mp4'); ?>" type="video/mp4">
          </video>
        </div>
        <div class="ft-ms-slide" role="group" aria-roledescription="slide" aria-label="Slide 2 of 2 — FarmTree plot definition" aria-hidden="true">
          <img src="<?php echo farmtree_asset('media/power-project-staff-plot-definition.png'); ?>" width="690" height="343" loading="lazy" decoding="async" alt="FarmTree platform plot-definition screen showing project and financial settings, farm management, plot settings and a map for adding plot coordinates.">
        </div>
      </div>
      <button type="button" class="ft-ms-nav ft-ms-prev" aria-label="Previous slide" aria-controls="ftPpsTrack"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button type="button" class="ft-ms-nav ft-ms-next" aria-label="Next slide" aria-controls="ftPpsTrack"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <div class="ft-ms-dots" role="tablist" aria-label="Select slide">
      <button type="button" class="ft-ms-dot is-active" role="tab" aria-selected="true" aria-label="Slide 1: agroforestry landscape"></button>
      <button type="button" class="ft-ms-dot" role="tab" aria-selected="false" aria-label="Slide 2: FarmTree plot definition"></button>
    </div>
  </div>
</div>
</div>
<div class="overlap-card">
<div class="kicker">Power to project staff</div>
<h2 class="mid-title">Make agroforestry planning easier for local teams.</h2>
<p class="lead">Project staff can learn, in a short time, to make agroforestry investment plans and show farmers different options: costs, benefits, and projected returns.</p>
<a class="outline-btn" target="_blank" rel="noopener noreferrer" data-ft-action="platform-login" href="https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F">See the platform</a>
</div>
</div>
</div>
</section><section class="section ft-home-only-section ft-p6-grid-bg ft-bg-cream">
<div class="container ft-u-center">
<div class="kicker">Base technology</div><h2 class="big-title">Rethinking how agroforestry projects are planned and financed.</h2>
<p class="lead ft-centered-lead">FarmTree's base technology connects site information, climate, soil and species data into a science-based methodology for projections and reporting.</p>
<div class="diagram" id="diagram"><figure class="ft-simple-diagram ft-final-ecosystem"><img loading="lazy" decoding="async" alt="FarmTree model infographic showing site information, climate and terrain inputs, species database, impact monitoring and impact projection" src="<?php echo farmtree_asset('base-technology/home-ecosystem-current-brand.webp'); ?>"/></figure></div>
<div class="ft-method-grid">
<article><div class="ft-p6-method-num">01</div><h3>Find &amp; define</h3><p>Identify the baseline, what is on the plot, and the intervention that is planned.</p></article>
<article><div class="ft-p6-method-num">02</div><h3>Connect</h3><p>FarmTree Model links climate, soil and species data and runs the scenario.</p></article>
<article><div class="ft-p6-method-num">03</div><h3>10 base indicators</h3><p>The model produces indicators across production, carbon, hydrology, soil fertility, labour and economics.</p></article>
<article><div class="ft-p6-method-num">04</div><h3>Future projection</h3><p>Time-based projection of future risks, performance and benefits.</p></article>
</div>
</div>
</section>
<section class="ft-commercial-section" id="frank-partners"><div class="ft-commercial-wrap"><div class="ft-commercial-head center"><span class="ft-section-label">References</span><h2>Trusted by leading agroforestry and climate organisations.</h2><p>Organisations that have worked with FarmTree across Africa, Asia and Latin America on planning, carbon finance, cocoa landscape and water resilience projects.</p></div><div class="ft-partner-strip"><div class="ft-partner-track"><button type="button" class="ft-partner-logo" data-page="case-giz"><img loading="lazy" decoding="async" alt="GIZ logo" src="<?php echo farmtree_asset('embedded_055.png'); ?>"/></button><button type="button" class="ft-partner-logo" data-page="case-acorn"><img loading="lazy" decoding="async" alt="Rabobank logo" src="<?php echo farmtree_asset('embedded_058.png'); ?>"/></button><button type="button" class="ft-partner-logo" data-page="track"><img loading="lazy" decoding="async" alt="CGIAR logo" src="<?php echo farmtree_asset('embedded_057.png'); ?>"/></button><button type="button" class="ft-partner-logo" data-page="track"><img loading="lazy" decoding="async" alt="FAO logo" src="<?php echo farmtree_asset('embedded_059.png'); ?>"/></button><button type="button" class="ft-partner-logo" data-page="track"><img loading="lazy" decoding="async" alt="CATIE logo" src="<?php echo farmtree_asset('embedded_060.png'); ?>"/></button><button type="button" class="ft-partner-logo" data-page="track"><img loading="lazy" decoding="async" alt="Helvetas logo" src="<?php echo farmtree_asset('embedded_056.png'); ?>"/></button></div></div></div></section>
<section class="ft-commercial-section alt" id="target-groups"><div class="ft-commercial-wrap"><div class="ft-commercial-head center"><span class="ft-section-label">Use cases</span><h2>How different organisations use FarmTree</h2><p>Each audience gets a direct path to the value FarmTree can create for their planning, investment or reporting work.</p></div><div class="ft-target-grid"><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('case-giz_opt.webp'); ?>"/><h3>Investors &amp; climate finance organisations</h3><p>De-risk your agroforestry portfolio with credible projections and long-term farmer return scenarios.</p><button type="button" data-page="investors">Learn more ↗</button></article><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('embedded_016_opt.webp'); ?>"/><h3>Project developers &amp; programme officers</h3><p>Design, implement and scale agroforestry projects with clearer investment plans and reporting logic.</p><button type="button" data-page="ngos">Learn more ↗</button></article><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('embedded_017.jpg'); ?>"/><h3>Field experts &amp; scientists</h3><p>Access calibrated, science-backed modelling tools for local species, soils, climate and project context.</p><button type="button" data-page="platform">Learn more ↗</button></article><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('embedded_015.jpg'); ?>"/><h3>Farmers &amp; farmer organisations</h3><p>Understand the value of land under different agroforestry scenarios and compare costs, benefits and risks.</p><button type="button" data-page="services">Learn more ↗</button></article><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('case-water_opt.webp'); ?>"/><h3>MRV platforms &amp; data providers</h3><p>Connect monitoring data with credible impact projections for carbon, water, productivity and farmer value.</p><button type="button" data-page="dfi">Learn more ↗</button></article></div></div></section><section class="ft-news-section" id="news-carousel">
<div class="ft-commercial-wrap">
<div class="ft-commercial-head center"><span class="ft-section-label">Latest updates</span><h2>News and insights from FarmTree</h2><p>Fresh resources for returning visitors, project teams and climate finance partners.</p></div>
<div class="ft-news-grid">
<article class="ft-news-card"><span>Latest article</span><h3>Planning agroforestry investments with clearer evidence</h3><p>How credible projections help teams compare impact, farmer value and long-term risk before implementation.</p><button type="button" data-page="track">Read more ↗</button></article>
<article class="ft-news-card"><span>Platform update</span><h3>Turning field realities into investment plans</h3><p>A short overview of how local data, species assumptions and project context move into FarmTree scenarios.</p><button type="button" data-page="platform">Read more ↗</button></article>
<article class="ft-news-card"><span>Project story</span><h3>From programme design to impact reporting</h3><p>Selected proof stories from partners using FarmTree for carbon, finance, cocoa and water resilience work.</p><button type="button" data-page="track">Read more ↗</button></article>
</div>
</div>
</section><section class="ft-commercial-section alt" id="proof-stories"><div class="ft-commercial-wrap"><div class="ft-commercial-head center"><span class="ft-section-label">Proof stories</span><h2>Four themes where FarmTree makes agroforestry investment legible</h2><p>Real project experience across programme planning, carbon finance, cocoa landscapes and water resilience — each theme links to the full Track Record.</p></div><div class="ft-proof-theme-grid"><article><h3>Programme investment planning</h3><p>Combining carbon projections with farmer income analysis to build a programme-level investment case for the LOSO Nyando landscape in western Kenya.</p><button type="button" data-page="track">Track Record ↗</button></article><article><h3>Carbon and farmer value modelling</h3><p>Translating ACORN field data into credible carbon plans and long-term farmer value scenarios across smallholder agroforestry programmes in multiple countries.</p><button type="button" data-page="track">Track Record ↗</button></article><article><h3>Cacao landscape scenario planning</h3><p>Beyond Beans + Cacao de Bosque: comparing shade-tree systems, carbon potential and farmer economics to shape landscape-level cocoa investment decisions.</p><button type="button" data-page="track">Track Record ↗</button></article><article><h3>Water and landscape resilience monitoring</h3><p>Connecting water balance modelling, erosion risk and ecosystem service projections to support landscape investment decisions with measurable water resilience outcomes.</p><button type="button" data-page="track">Track Record ↗</button></article></div></div></section><section class="ft-testimonials-section" id="testimonials"><div class="ft-testimonials-orb"><span>SAN</span><span>TS</span><span>HRNS</span><span>WVA</span><span>NECT</span></div><div class="ft-testimonials-head"><div class="kicker">Testimonials</div><h2>What partners say about FarmTree</h2><p>Organisations that have worked with FarmTree across Africa, Asia and Latin America on planning, investment and reporting.</p></div><div class="ft-testimonial-marquee"><div class="ft-testimonial-track"><article class="ft-testimonial-card"><div class="ft-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><p>“The FarmTree Tool and team helped us understand the value of different agroforestry systems and the potential for increased revenue over a few decades.”</p><div class="ft-testimonial-person"><div class="ft-avatar">MM</div><div><strong>Mona McCord</strong><small>SAN</small></div></div></article><article class="ft-testimonial-card"><div class="ft-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><p>“FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue, they do everything!”</p><div class="ft-testimonial-person"><div class="ft-avatar">MdB</div><div><strong>Mathijs de Bruin</strong><small>TreeScape</small></div></div></article><article class="ft-testimonial-card"><div class="ft-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><p>“FarmTree provides a remarkable level of detail that helps us truly understand why coffee agroforestry systems perform the way they do.”</p><div class="ft-testimonial-person"><div class="ft-avatar">KL</div><div><strong>Katharina Lima de Miranda</strong><small>HRNS</small></div></div></article><article class="ft-testimonial-card"><div class="ft-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><p>“We know very little of agroforestry options for a particular local context. The FarmTree tool is super helpful to generate location-specific scenarios!”</p><div class="ft-testimonial-person"><div class="ft-avatar">RK</div><div><strong>Rob Kelly</strong><small>World Vision Australia</small></div></div></article><article class="ft-testimonial-card"><div class="ft-stars"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div><p>“We found the FarmTree Tool essential for predicting outcomes of highly complex farm scenarios, among many, also agroforestry systems.”</p><div class="ft-testimonial-person"><div class="ft-avatar">LM</div><div><strong>Lorenzo Mento</strong><small>Nectaerra</small></div></div></article></div></div></section><section class="ft-partner-statements" id="partner-statements"><div class="ft-commercial-wrap"><div class="ft-commercial-head center"><span class="ft-section-label">Partner perspectives</span><h2>What organisations say about working with FarmTree</h2><p>Selected perspectives from partners across the agroforestry investment and implementation chain.</p></div><div class="ft-statement-grid"><article><h3>Science that travels well</h3><p>"FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue. They do everything."</p><p class="ft-u-note14">Mathijs de Bruin — TreeScape</p></article><article><h3>Depth where it matters</h3><p>"FarmTree provides a remarkable level of detail that helps us truly understand why coffee agroforestry systems perform the way they do — and how to communicate that to partners."</p><p class="ft-u-note14">Katharina Lima de Miranda — HRNS</p></article><article><h3>Local scenarios, fast</h3><p>"We know very little of agroforestry options for a particular local context. The FarmTree tool is super helpful to generate location-specific scenarios quickly and confidently."</p><p class="ft-u-note14">Rob Kelly — World Vision Australia</p></article></div></div></section><section class="ft-faq-section" id="faq"><div class="ft-faq-wrap"><div class="ft-faq-head"><span class="ft-section-label">F&amp;Q</span><h2>Questions about FarmTree modelling?</h2><p>Common questions about FarmTree, the platform, and how to get started. Can’t find what you need? Contact us directly.</p></div><div class="ft-faq-grid" id="ftFaqAccordion"><article class="ft-open"><div class="ft-faq-q"><h3>What does FarmTree model?</h3><span class="ft-faq-toggle">+</span></div><div class="ft-faq-a"><div class="ft-faq-a-inner">FarmTree models production, carbon, hydrology, soil fertility, labour, economics and other impact indicators — covering 10+ KPIs across a single, interconnected science-based model.</div></div></article><article><div class="ft-faq-q"><h3>Can FarmTree support investment planning?</h3><span class="ft-faq-toggle">+</span></div><div class="ft-faq-a"><div class="ft-faq-a-inner">Yes. FarmTree helps turn project ideas, species assumptions and local data into credible scenarios and investment cases — with outputs that hold up to professional and funder scrutiny.</div></div></article><article><div class="ft-faq-q"><h3>How far ahead can FarmTree project?</h3><span class="ft-faq-toggle">+</span></div><div class="ft-faq-a"><div class="ft-faq-a-inner">FarmTree supports 50-year projections for long-term planning, investment cases and project monitoring — aligned with standard agroforestry project lifecycles.</div></div></article><article><div class="ft-faq-q"><h3>Can local project teams use the platform?</h3><span class="ft-faq-toggle">+</span></div><div class="ft-faq-a"><div class="ft-faq-a-inner">Yes. Project staff can learn, in a short time, to prepare agroforestry plans and show farmers different options — reducing dependence on external consultants over time.</div></div></article><article><div class="ft-faq-q"><h3>How do we request a demo or quotation?</h3><span class="ft-faq-toggle">+</span></div><div class="ft-faq-a"><div class="ft-faq-a-inner">Use the "Request a demo" or "Ask for a quotation" button anywhere on the site. The FarmTree team will follow up to discuss your scope, project context, and the right level of support.</div></div></article><article><div class="ft-faq-q"><h3>Which standards does FarmTree align with?</h3><span class="ft-faq-toggle">+</span></div><div class="ft-faq-a"><div class="ft-faq-a-inner">FarmTree’s carbon outputs are aligned with Verra VCS and Gold Standard methodologies. For broader ESG and climate reporting, outputs can be structured to support CSRD and MRV frameworks.</div></div></article></div></div></section><section class="section ft-final-cta-feedback"><div class="container ft-u-center"><span class="ft-final-cta-tagline">Make agroforestry measurable, investable and scalable.</span><h2 class="big-title">Ready to build a stronger agroforestry investment case?</h2><p class="lead ft-centered-lead">Request a demo or ask for a quotation. FarmTree will work with you to understand your scope, project context and reporting needs.</p><div class="ft-final-cta-row"><a class="cta-link" target="_blank" rel="noopener noreferrer" data-ft-action="request-demo" href="https://tool.farmtree.earth/Identity/Account/Register">Request a demo</a><button type="button" class="cta-link secondary" data-ft-action="request-quotation">Ask for a quotation</button></div></div></section><section class="page" id="page-platform">
<div class="subhero"><img loading="lazy" decoding="async" alt="Planning agroforestry scenarios with stakeholders" src="<?php echo farmtree_asset('embedded_025_opt.webp'); ?>"/><div class="container"><div class="kicker">FarmTree Platform</div><h1>A software model and online interface for agroforestry scenarios</h1><p class="lead ft-subhero-lead-light">Design agroforestry scenarios and project carbon, financial and environmental indicators for up to 50 years.</p></div></div>
<section class="section"><div class="container"><div class="overlap"><div class="overlap-img"><img loading="lazy" decoding="async" alt="Field data for agroforestry modelling" src="<?php echo farmtree_asset('embedded_026_opt.webp'); ?>"/></div><div class="overlap-card"><div class="kicker">Model methodology</div><h2 class="mid-title">Carbon, Production &amp; Finance, Environment and Landscape Tool</h2><p class="lead">The FarmTree model is composed of interconnected sub models simulating soil, nutrients, water, plant growth, production, carbon, labour and finance.</p></div></div><div class="cards"><div class="card"><h3>Carbon</h3><p>Biomass accumulation, carbon stock, Carbon Removal Units and carbon revenue by species.</p></div><div class="card"><h3>Production &amp; Finance</h3><p>Yields, production costs, revenues, cash flows, profitability and labour needs.</p></div><div class="card"><h3>Environment</h3><p>Water balance, soil organic matter, nutrient flows, erosion and biodiversity.</p></div><div class="card"><h3>Landscape Tool</h3><p>Compare multiple project areas and portfolio wide performance.</p></div></div></div></section>
</section>
<section class="page ft-p5-page" id="page-services">

<!-- 1. SUBHERO -->
<div class="subhero"><img loading="lazy" decoding="async" alt="FarmTree support and training for agroforestry project teams" src="<?php echo farmtree_asset('embedded_027_opt.webp'); ?>"/><div class="container"><div class="kicker">Solutions</div><h1>From expert led planning to independent operation</h1><p class="lead ft-u-heronote-660">Three service areas that match where you are in your agroforestry journey — from initial scenario design to multi-country independent operation.</p><div class="ft-p5-hero-btns"><button class="pill contact" type="button" data-ftmodal="request">Talk to us about your project</button><a class="ft-p5-hero-ghost" target="_blank" rel="noopener noreferrer" data-ft-action="platform-login" href="https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F">Explore the platform</a></div></div></div>

<!-- 2. METHODOLOGY: 4-STEP WORKFLOW -->
<section class="ft-p5-section cream"><div class="ft-p5-wrap"><span class="ft-section-label">How it works</span><h2 class="ft-p5-h2">A structured journey from scenario design to scaled delivery</h2><p class="ft-p5-lead">FarmTree's service model follows a clear four-step logic — each step builds on the previous one and can be the starting point depending on your team's current capability.</p><div class="ft-sol-steps"><div class="ft-sol-step"><div class="ft-sol-step-num">01</div><h3>Understand &amp; Scope</h3><p>Map your project context, clarify objectives, and identify the right FarmTree engagement level for your team.</p></div><div class="ft-sol-step"><div class="ft-sol-step-num">02</div><h3>Design Scenarios</h3><p>Build agroforestry scenarios using local species data, climate parameters and your project assumptions.</p></div><div class="ft-sol-step"><div class="ft-sol-step-num">03</div><h3>Deliver &amp; Train</h3><p>FarmTree delivers science-backed outputs alongside your team and trains local staff to understand and operate the platform.</p></div><div class="ft-sol-step"><div class="ft-sol-step-num">04</div><h3>Scale &amp; Report</h3><p>Extend the same methodology across more sites and seasons — with consistent reporting and comparable impact metrics.</p></div></div></div></section>

<!-- 3. THREE SERVICE AREAS -->
<section class="ft-p5-section"><div class="ft-p5-wrap"><span class="ft-section-label">Service areas</span><h2 class="ft-p5-h2">Three ways FarmTree supports your agroforestry work</h2><p class="ft-p5-lead">Each service area matches a phase in the agroforestry project lifecycle. Many organisations start with one and expand as confidence grows.</p><div class="ft-sol-phase-grid">

<div class="ft-sol-phase-card"><div class="ft-sol-phase-no">01 / Understand &amp; Design</div><h3>FarmTree turns project ideas into fundable scenarios.</h3><p>Expert-led scenario design that translates project context, species assumptions and local data into credible farm plans and investment cases. What normally takes consultants months, FarmTree generates in hours — with full documentation and scientific rigour.</p><div class="ft-sol-deliverables"><strong>What you receive</strong><ul><li>Baseline and agroforestry scenario comparison</li><li>Carbon, production and farmer income projections</li><li>Investment case narrative with sensitivity analysis</li><li>Funder-ready outputs and risk framing</li></ul></div><button class="ft-sol-cs-link" type="button" data-page="case-giz">Case example: GIZ / Madagascar ↗</button></div>

<div class="ft-sol-phase-card"><div class="ft-sol-phase-no">02 / Capture &amp; Learn</div><h3>Project staff learn how field realities become investment plans.</h3><p>FarmTree calibrates the platform for your local context and trains your team to collect field data, operate the model and interpret outputs — reducing dependence on external experts over time and building in-house analytical capacity.</p><div class="ft-sol-deliverables"><strong>What you receive</strong><ul><li>Local species and climate calibration</li><li>Field data collection support</li><li>Guided platform training sessions</li><li>Scenario documentation for local team use</li></ul></div><button class="ft-sol-cs-link" type="button" data-page="case-acorn">Case example: ACORN / Rabobank ↗</button></div>

<div class="ft-sol-phase-card"><div class="ft-sol-phase-no">03 / Operate &amp; Scale</div><h3>Project staff scale agroforestry investments and report confidently.</h3><p>Once your team is operating independently, FarmTree supports multi-site management, portfolio comparison and investor-ready reporting — keeping methods consistent as your programme expands across regions and countries.</p><div class="ft-sol-deliverables"><strong>What you receive</strong><ul><li>Multi-project portfolio management</li><li>Consistent impact metrics across sites and countries</li><li>MRV-aligned monitoring and reporting</li><li>Outputs for investors, donors and programme partners</li></ul></div><button class="ft-sol-cs-link" type="button" data-page="case-cocoa">Case example: Beyond Beans ↗</button></div>

</div></div></section>

<!-- 4. PLATFORM-SUPPORTED DELIVERY -->
<section class="ft-p5-section dark"><div class="ft-p5-wrap"><span class="ft-section-label ft-label-on-dark">Platform supported</span><h2 class="ft-p5-h2">Every service is backed by FarmTree's science-based modelling platform</h2><p class="ft-p5-lead">Regardless of which service area you engage, every projection, scenario and report is grounded in FarmTree's peer-reviewed interconnected model — covering four domains simultaneously.</p><div class="ft-sol-cap-grid"><div class="ft-sol-cap"><strong>Carbon</strong><span>Biomass accumulation, carbon stock projections and Carbon Removal Units by species — aligned with Verra VCS and Gold Standard.</span></div><div class="ft-sol-cap"><strong>Production &amp; Finance</strong><span>Yields, production costs, revenues, cash flows, profitability and labour requirements for each scenario configuration.</span></div><div class="ft-sol-cap"><strong>Environment</strong><span>Water balance, soil organic matter, nutrient flows, erosion risk and biodiversity indicators per land-use scenario.</span></div><div class="ft-sol-cap"><strong>Landscape Tool</strong><span>Compare multiple project areas and aggregate results at portfolio and programme level for consistent reporting.</span></div></div><div class="ft-sol-cta-row ft-u-mt32"><button class="pill contact" type="button" data-ftmodal="request">Discuss your project scope</button><a class="ft-p5-hero-ghost" target="_blank" rel="noopener noreferrer" data-ft-action="platform-login" href="https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F">Explore the platform</a></div></div></section>

<!-- 5. FINAL CTA -->
<section class="ft-p5-section cream"><div class="ft-p5-wrap ft-u-center"><h2 class="ft-p5-h2 ft-cta-heading-tight">Ready to start your agroforestry journey with FarmTree?</h2><p class="ft-p5-lead ft-u-mxauto-mb28">Whether you are designing a first scenario or scaling an established programme, FarmTree has a service level that fits your current needs and your next step.</p><div class="ft-u-ctarow"><button class="pill contact" type="button" data-ftmodal="request">Talk to us about your project</button><button class="outline-btn" type="button" data-page="track">View our Track Record</button></div></div></section>

</section>
<section class="page ft-p5-page" id="page-track">

<!-- 1. SUBHERO -->
<div class="subhero"><img loading="lazy" decoding="async" alt="Collaborative agroforestry progress and impact reporting" src="<?php echo farmtree_asset('embedded_028_opt.webp'); ?>"/><div class="container"><div class="kicker">Track Record</div><h1>A growing database of agroforestry projects supported by FarmTree</h1><p class="lead ft-u-heronote-660">From investment case design to multi-country portfolio management — projects across Africa, Asia and Latin America that demonstrate FarmTree's science-based approach in practice.</p></div></div>

<!-- 2. METRICS STRIP -->
<section class="ft-p5-section cream"><div class="ft-p5-wrap"><div class="ft-tr-metrics"><div class="ft-tr-metric"><strong>+100</strong><span>Active users</span></div><div class="ft-tr-metric"><strong>+30</strong><span>Projects supported</span></div><div class="ft-tr-metric"><strong>18+</strong><span>Countries reached</span></div><div class="ft-tr-metric"><strong>+40</strong><span>Agricultural regions</span></div></div></div></section>

<!-- 3. PROJECT GRID -->
<section class="ft-p5-section"><div class="ft-p5-wrap">
<span class="ft-section-label">Project database</span>
<h2 class="ft-p5-h2">Selected projects from the FarmTree portfolio</h2>
<p class="ft-p5-lead">A representative selection of programmes, investment cases and platform engagements supported by FarmTree. Four projects link directly to detailed case study pages.</p>

<!-- Category chips -->
<div class="ft-tr-chips">
<span class="ft-tr-chip active">All projects</span>
<span class="ft-tr-chip">Investment planning</span>
<span class="ft-tr-chip">Carbon</span>
<span class="ft-tr-chip">Cocoa</span>
<span class="ft-tr-chip">Water</span>
<span class="ft-tr-chip">Landscape</span>
</div>

<!-- Project cards -->
<div class="ft-tr-grid">

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag planning">Planning</div></div></div><div class="ft-tr-region">Madagascar · Africa</div><h3>GIZ / Madagascar Programme Planning</h3><p>Landscape-scale agroforestry scenario design for a GIZ climate programme — turning local species data and project context into a structured investment framework.</p><button class="ft-tr-card-link" type="button" data-page="case-giz">Read case study ↗</button></div>

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag carbon">Carbon</div></div></div><div class="ft-tr-region">Africa · Asia · Latin America</div><h3>ACORN / Rabobank Carbon Planning</h3><p>A shared carbon modelling framework for Rabobank's ACORN smallholder programme — consistent methodology applied across projects on three continents.</p><button class="ft-tr-card-link" type="button" data-page="case-acorn">Read case study ↗</button></div>

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag cocoa">Cocoa</div></div></div><div class="ft-tr-region">West Africa · Latin America</div><h3>Beyond Beans Cocoa Landscape Planning</h3><p>Shade-tree density and carbon insetting scenario planning for the Beyond Beans cocoa supply chain programme — comparing systems at landscape scale.</p><button class="ft-tr-card-link" type="button" data-page="case-cocoa">Read case study ↗</button></div>

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag water">Water</div></div></div><div class="ft-tr-region">Kenya · East Africa</div><h3>LOSO Nyando Water &amp; Landscape Resilience</h3><p>Integrated water balance, carbon and farmer value modelling for the LOSO Nyando landscape programme in western Kenya's Lake Victoria watershed.</p><button class="ft-tr-card-link" type="button" data-page="case-nyando">Read case study ↗</button></div>

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag planning">Planning</div></div></div><div class="ft-tr-region">Tanzania · East Africa</div><h3>Morogoro Watershed Reforestation</h3><p>Watershed reforestation and restoration planning — scenario modelling for species selection, water balance and long-term land restoration value.</p></div>

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag landscape">Landscape</div></div></div><div class="ft-tr-region">Bhutan · South Asia</div><h3>Bhutan Agroforestry Strategy</h3><p>Entrepreneurial agroforestry strategy and landscape planning — species scenario design for a national agroforestry development programme.</p></div>

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag planning">Planning</div></div></div><div class="ft-tr-region">Malaysia · Southeast Asia</div><h3>Malaysia Integrated Land Use</h3><p>Scenario modelling for integrated pest management and agroforestry diversification within oil palm systems — species mix and income projections.</p></div>

<div class="ft-tr-card"><div class="ft-tr-card-top"><div><div class="ft-tr-tag carbon">Carbon</div></div></div><div class="ft-tr-region">Multi-country · Global</div><h3>CGIAR Research Programmes</h3><p>Supporting international research programmes with agroforestry scenario modelling, carbon projections and comparative landscape analysis.</p></div>

</div>
</div></section>

<!-- 4. GEOGRAPHIC COVERAGE -->
<section class="ft-p5-section cream"><div class="ft-p5-wrap">
<span class="ft-section-label">Geographic coverage</span>
<h2 class="ft-p5-h2">Projects across three continents and growing</h2>
<p class="ft-p5-lead">FarmTree's methods are calibrated for diverse climatic zones, species contexts and land-use systems — from the humid tropics to dry savannas and highland landscapes.</p>
<div class="ft-tr-regions">
<div class="ft-tr-region-card"><strong>Sub-Saharan Africa</strong><span>Kenya, Tanzania, Madagascar, Ghana, Ethiopia, Uganda and wider East and West African programmes — covering savanna, highland and humid tropical zones.</span></div>
<div class="ft-tr-region-card"><strong>Asia &amp; Pacific</strong><span>Bhutan, Malaysia, Indonesia and South and Southeast Asian contexts — agroforestry systems in highland, tropical and plantation landscapes.</span></div>
<div class="ft-tr-region-card"><strong>Latin America</strong><span>Colombia, Brazil and broader Latin American supply chain programmes — cocoa, coffee and mixed agroforestry systems with carbon and farmer value focus.</span></div>
</div>
</div></section>

<!-- Project Journey (relocated from Home, placed below Geographic coverage) -->
<section class="ft-commercial-section" id="frank-phase-journey"><div class="ft-commercial-wrap"><div class="ft-commercial-head center"><span class="ft-section-label">Project journey</span><h2>From project ideas to scaled agroforestry reporting</h2><p>FarmTree's three-phase approach moves teams from initial scenario design through to independent platform operation and scaled agroforestry reporting.</p></div><div class="ft-phase-grid"><article class="ft-phase-card"><div class="ft-phase-no">01 / UNDERSTAND &amp; DESIGN</div><h3>FarmTree turns project ideas into fundable scenarios.</h3><ul><li>Design credible farm plans and investment cases.</li><li>De-risk project choices before committing field resources.</li><li>Generate in hours what normally takes consultants months.</li></ul><div class="ft-case-mini">Case example: GIZ / Madagascar</div><button type="button" data-page="services">Learn more about this phase ↗</button></article><article class="ft-phase-card"><div class="ft-phase-no">02 / CAPTURE &amp; LEARN</div><h3>Project staff learn how field realities get turned into investment plans.</h3><ul><li>Operate the platform with FarmTree support.</li><li>Calibrate models with local species data, prices and growing conditions.</li><li>Translate field data into carbon and farmer value scenarios.</li></ul><div class="ft-case-mini">Case example: ACORN / Rabobank</div><button type="button" data-page="services">Learn more about this phase ↗</button></article><article class="ft-phase-card"><div class="ft-phase-no">03 / OPERATE &amp; SCALE</div><h3>Project staff scale agroforestry investments and report to investors and partners.</h3><ul><li>Manage projections and monitoring across projects and countries.</li><li>Use consistent science-backed metrics.</li><li>Report clearly to investors, donors and implementation partners.</li></ul><div class="ft-case-mini">Case example: Beyond Beans</div><button type="button" data-page="services">Learn more about this phase ↗</button></article></div><div class="ft-proof-metrics ft-counter-row"><div class="ft-proof-metric ft-counter-card" data-suffix=" yrs" data-target="50"><strong>50 yrs</strong><span>long-term scenario planning horizon</span></div><div class="ft-proof-metric ft-counter-card" data-suffix="" data-target="4"><strong>4</strong><span>proof story themes prepared</span></div><div class="ft-proof-metric ft-counter-card" data-suffix="" data-target="3"><strong>3</strong><span>project phases clarified for buyers</span></div><div class="ft-proof-metric ft-static-card"><strong>MRV</strong><span>reporting and monitoring narrative</span></div></div></div></section>

<!-- 5. CTA -->
<section class="ft-p5-section dark"><div class="ft-p5-wrap ft-u-center"><h2 class="ft-p5-h2">Want to discuss what FarmTree has done in your context?</h2><p class="ft-p5-lead ft-u-mxauto-mb28">Talk to the FarmTree team about relevant project experience, available case narratives and how our methods apply to your geography and crop system.</p><div class="ft-u-ctarow"><button class="pill contact" type="button" data-ftmodal="request">Talk to the team</button><button class="ft-p5-hero-ghost" type="button" data-page="case-giz">Read a case study</button></div></div></section>

</section>
<section class="page" id="page-case-studies"><div class="ft-seg-hero"><div class="ft-seg-wrap"><span class="ft-section-label ft-label-on-dark">Case studies</span><h1>Projects that show what FarmTree makes possible</h1><p>Four real programmes where FarmTree's science-based modelling helped teams plan, invest and report on agroforestry at scale.</p></div></div><div class="ft-seg-section"><div class="ft-seg-wrap"><h2 class="ft-visually-hidden">Case studies</h2><div class="ft-case-grid"><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('case-giz_opt.webp'); ?>"/><span>Preparation</span><h3>GIZ / Madagascar programme planning</h3><p>FarmTree supported GIZ programme planning in Madagascar — translating project context and species assumptions into credible investment scenarios for stakeholder alignment.</p><button type="button" data-page="case-giz">Read more ↗</button></article><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('case-acorn_opt.webp'); ?>"/><span>Implementation</span><h3>ACORN / Rabobank carbon planning</h3><p>FarmTree translated Rabobank ACORN field data into carbon projections and farmer value scenarios across smallholder programmes in Africa, Asia and Latin America.</p><button type="button" data-page="case-acorn">Read more ↗</button></article><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('case-cocoa_opt.webp'); ?>"/><span>Scaling</span><h3>Beyond Beans cocoa landscape planning</h3><p>FarmTree modelled shade-tree density, species mix and long-term carbon insetting for Beyond Beans — turning cocoa landscape complexity into clear, comparable scenarios.</p><button type="button" data-page="case-cocoa">Read more ↗</button></article><article><img loading="lazy" decoding="async" alt="" src="<?php echo farmtree_asset('case-water_opt.webp'); ?>"/><span>Monitoring</span><h3>LOSO Nyando / water resilience</h3><p>FarmTree modelled water resilience, carbon stocks and farmer value outcomes for the LOSO Nyando landscape programme in western Kenya, supporting long-term investment planning.</p><button type="button" data-page="case-nyando">Read more ↗</button></article></div></div></div><div class="ft-seg-final"><div class="ft-seg-wrap"><h2>Want to explore what FarmTree could do for your project?</h2><p>Request a demo, or start a conversation with the FarmTree team.</p><div class="ft-seg-cta-row"><a class="cta-link" target="_blank" rel="noopener noreferrer" data-ft-action="request-demo" href="https://tool.farmtree.earth/Identity/Account/Register">Request a demo ↗</a><button type="button" class="cta-link secondary" data-ftmodal="request">Talk to FarmTree</button></div></div></div></section>
<section class="page" id="page-cocoa">
<div class="subhero"><img loading="lazy" decoding="async" alt="Cocoa agroforestry field inspection" src="<?php echo farmtree_asset('embedded_029_opt.webp'); ?>"/><div class="container"><div class="kicker">Cocoa Focus</div><h1>Regenerative cocoa planning with long term projections</h1></div></div>
<section class="section"><div class="container"><div class="cards"><div class="card"><h3>Shade tree density</h3><p>Compare shade systems and understand their effect on production and resilience.</p></div><div class="card"><h3>Species mix</h3><p>Model tree combinations, cocoa systems and local conditions.</p></div><div class="card"><h3>Farmer income</h3><p>Understand how scenarios affect yields, costs and cash flow.</p></div><div class="card"><h3>Carbon insetting</h3><p>Estimate long term carbon value within cocoa supply chains.</p></div></div></div></section>
</section>
<section class="page" id="page-videos">
<section class="ft-videos-page">
<div class="ft-videos-wrap">
<div class="ft-videos-head">
<span class="ft-section-label">User videos</span>
<h1>FarmTree Platform Videos</h1>
<p>Get a sneak peek of the FarmTree Platform features and functions. This page collects the platform tutorial topics from the current FarmTree user videos page in the new visual system.</p>
</div>
<div class="ft-video-grid">
<article class="ft-video-card">
<a aria-label="Open FarmTree Platform video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>FarmTree Platform</h3><p>Get a sneak peek of the FarmTree Platform features and functions.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Team management video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Team management</h3><p>Learn how to manage your team on the FarmTree Platform, from inviting new members to tracking roles and removing inactive users.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Multiplot Tool video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Multiplot Tool</h3><p>Explore the Multiplot Tool on FarmTree, run and analyse hundreds of scenarios at once, select metrics, and export results with ease. Built for scale and speed.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open FarmTree Tool Overview video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>FarmTree Tool Overview</h3><p>Get started with the FarmTree Tool, build agroforestry scenarios, define plots, add species, and run detailed simulations with just a few clicks. Flexible, data-rich, and intuitive.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Comparison Tool video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Comparison Tool</h3><p>Use the FarmTree Comparison Tool to evaluate multiple agroforestry scenarios side by side, compare carbon, yields, water balance, revenues, and more to find the best fit.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Scenarios Page video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Scenarios Page</h3><p>Organise, search, and manage all your agroforestry scenarios with ease on the FarmTree Platform. Create folders, tag scenarios, and collaborate smoothly.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Polygons video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Polygons</h3><p>Learn how to upload, create, and manage plot polygons on the FarmTree Platform, organise locations, extract data, and use them in your scenarios.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Uncertainties video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Uncertainties</h3><p>Understand uncertainty margins for the carbon sequestration potential of different tree species.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Soil fertility video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Soil fertility</h3><p>Optimize soil fertility parameters in the tool for effective soil health management in agroforestry.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Create an Account video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Create an Account</h3><p>How to create a FarmTree Tool Demo account.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open FarmTree Tool Interface video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>FarmTree Tool Interface</h3><p>Key tool features and functionalities to design a scenario.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Landscape Tool video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Landscape Tool</h3><p>How to plan agroforestry interventions for future-proof watershed management.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open FarmTree Intro Spanish video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>FarmTree Intro Spanish</h3><p>Conoce nuestras herramientas digitales para la gestión y evaluación de proyectos de agroforestería.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Production Potential video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Production Potential</h3><p>How to examine the production potential of plant species based on growth limiting factors.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Biomass and Carbon video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Biomass and Carbon</h3><p>Understanding projections on biomass production and how they relate to carbon sequestration.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Climate projections video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Climate projections</h3><p>How to link your scenario to site-specific climate data and explore the impact of climate change.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Biodiversity video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Biodiversity</h3><p>Understanding the effect of land use on biodiversity.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Finances video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Finances</h3><p>How to define key settings, prices, costs and labour, and review their impact on the financial projections.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Planting Density video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Planting Density</h3><p>How to adjust species planting densities in intercropping scenarios and review their effect on cover.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Hydrology video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Hydrology</h3><p>How to explore the effect of tree planting on water inflows and outflows from the soil layers.</p></div>
</article>
<article class="ft-video-card">
<a aria-label="Open Irrigation video" class="ft-video-thumb" href="https://www.farmtree.earth/user-videos" rel="noopener" target="_blank"><span class="ft-play">▶</span><span class="ft-video-tag">Platform tutorial</span></a>
<div class="ft-video-body"><h3>Irrigation</h3><p>How to simulate irrigation application and review its effect on the water requirements of species.</p></div>
</article>
</div>
</div>
</section>
</section>
<section class="page" id="page-team">
<div class="subhero">
<img loading="lazy" decoding="async" alt="The FarmTree team — agroforestry field landscape" src="<?php echo farmtree_asset('embedded_030_opt.webp'); ?>"/>
<div class="container">
<div class="kicker">Who we are</div>
<h1>A Wageningen based team combining science, modelling and software</h1>
</div>
</div>
<section class="section ft-team-photo-section" id="team-photos">
<div class="container">
<div class="kicker">Team</div>
<h2 class="section-title">Meet the FarmTree team</h2>
<p class="lead ft-team-intro">
        A multidisciplinary team combining agroforestry science, modelling, software, field knowledge and project experience.
      </p>
<div class="ft-team-grid">
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Team Member portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_031.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Team Member</h3>
<p>FarmTree Team</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Ard portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_032.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Ard</h3>
<p>Agroforestry &amp; Modelling</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Arnoud portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_033.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Arnoud</h3>
<p>Agroforestry Specialist</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Bart portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_034.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Bart</h3>
<p>Agroforestry Specialist</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Frank portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_035.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Frank</h3>
<p>Co-founder / Partnerships</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Gabija portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_036.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Gabija</h3>
<p>FarmTree Team</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Limbi portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_037.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Limbi</h3>
<p>FarmTree Team</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Marjolein portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_038.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Marjolein</h3>
<p>FarmTree Team</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Moussa portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_039.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Moussa</h3>
<p>FarmTree Team</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Peter portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_040.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Peter</h3>
<p>FarmTree Team</p>
</div>
</article>
<article class="ft-team-card">
<div class="ft-team-image-wrap">
<img alt="Drocelle portrait" loading="lazy" src="<?php echo farmtree_asset('embedded_041.webp'); ?>"/>
</div>
<div class="ft-team-info">
<h3>Drocelle</h3>
<p>FarmTree Team</p>
</div>
</article>
</div>
</div>
</section>
</section>
<section class="page" id="page-vacancies">
<div class="subhero"><img loading="lazy" decoding="async" alt="Join the FarmTree mission" src="<?php echo farmtree_asset('embedded_042_opt.webp'); ?>"/><div class="container"><div class="kicker">Vacancies</div><h1>Join us and help the world quantify trees</h1></div></div>
<section class="section"><div class="container"><div class="cards"><div class="card"><h3>Financial Administrative Officer</h3><p>Assist in keeping FarmTree financial systems up to date.</p></div><div class="card"><h3>Internship: Modelling erosion</h3><p>Contribute to modelling capabilities for agroforestry and erosion.</p></div><div class="card"><h3>Plant Database Development</h3><p>Work with species data and agroforestry restoration databases.</p></div><div class="card"><h3>MSc &amp; BSc thesis or internship</h3><p>Learn, develop and join an international dynamic team.</p></div></div></div></section>
</section>
<section class="page" id="page-contact">
<div class="subhero"><img loading="lazy" decoding="async" alt="Contact FarmTree for project support" src="<?php echo farmtree_asset('embedded_043_opt.webp'); ?>"/><div class="container"><div class="kicker">Contact us</div><h1>How can we help?</h1></div></div>
<section class="section"><div class="container"><div class="split-feature"><div><h2 class="mid-title">FarmTree B.V.</h2><p class="lead">Plus Ultra Building, Bronland 12C-1, 6708 WH Wageningen, The Netherlands. Call +31 (0)630 884 640 or email info@farmtree.earth.</p></div><div class="card"><h3>Contact details</h3><p>Contact us about anything related to our company or services. We will do our best to get back to you as soon as possible.</p><button type="button" class="outline-btn" data-page="request">Open request form</button></div></div></div></section>
</section>
<section class="page" id="page-request">
<div class="form-page"><div class="form-wrap">
<div id="ftRequestFormWrap">
<h1>Contact Us</h1><p>Fill in the fields below and the FarmTree team will follow up within one business day.</p>
<form id="ftRequestPageForm" novalidate>
<input class="ft-hp" type="text" name="_gotcha" id="ftReqHp" tabindex="-1" autocomplete="off" aria-hidden="true"/>
<div class="field"><label for="ftReqName">Name *</label><input id="ftReqName" type="text" placeholder="Enter your name here"/><span class="ft-field-err" id="ftReqNameErr">Please enter your name.</span></div>
<div class="field"><label for="ftReqEmail">Email address *</label><input id="ftReqEmail" type="email" placeholder="Enter your email"/><span class="ft-field-err" id="ftReqEmailErr">Please enter a valid email address.</span></div>
<div class="field"><label for="ftReqCompany">Company name *</label><input id="ftReqCompany" type="text" placeholder="Start typing..."/><span class="ft-field-err" id="ftReqCompanyErr">Please enter your company name.</span></div>
<div class="field"><label for="ftReqRole">Job title</label><input id="ftReqRole" type="text" placeholder="Start typing..."/></div>
<div class="field"><label for="ftReqPhone">Mobile phone</label><input id="ftReqPhone" type="tel" placeholder="Enter number"/></div>
<div class="field"><label for="ftReqWeb">Company website</label><input id="ftReqWeb" type="url" placeholder="Enter link"/></div>
<div class="field"><label for="ftReqInterest">What are you interested in?</label><select id="ftReqInterest"><option>FarmTree Platform demo</option><option>Agroforestry investment case</option><option>Cocoa Focus</option><option>Project monitoring</option><option>General question</option></select></div>
<div class="field"><label for="ftReqMsg">Message</label><textarea id="ftReqMsg" placeholder="Tell us about your project"></textarea></div>
<button class="pill contact" type="submit" id="ftReqSubmit">Submit request</button>
<div class="ft-field-err ft-submit-err" id="ftReqSubmitErr" role="alert">Sorry — your request could not be sent. Please check your connection and try again.</div>
</form>
</div>
<div id="ftRequestSuccess" class="ft-request-success">
<div class="ft-success-icon">✓</div>
<h2 class="ft-success-title">Thank you.</h2>
<p class="ft-success-text">The FarmTree team will review your request and be in touch within one business day.</p>
<button class="pill contact" type="button" onclick="document.getElementById('ftRequestSuccess').style.display='none';document.getElementById('ftRequestFormWrap').style.display='block';document.getElementById('ftRequestPageForm').reset()">Send another request</button>
</div>
</div></div>
</section>
<section class="page" id="page-acknowledgements"><div class="subhero"><img loading="lazy" decoding="async" alt="Project partnerships and field realities" src="<?php echo farmtree_asset('embedded_044_opt.webp'); ?>"/><div class="container"><div class="kicker">Acknowledgements</div><h1>Scientific collaboration, field data and project partnerships</h1></div></div><section class="section"><div class="container"><p class="lead">This page can include contributors, research partners, funders and project acknowledgements connected to FarmTree methodology and platform development.</p></div></section></section>
<section class="page" id="page-licenses"><div class="subhero"><img loading="lazy" decoding="async" alt="Responsible agroforestry planning and reporting" src="<?php echo farmtree_asset('embedded_045_opt.webp'); ?>"/><div class="container"><div class="kicker">Licenses</div><h1>Responsible use of data, models and platform outputs</h1></div></div><section class="section"><div class="container"><p class="lead">This page can explain platform access, model use, data responsibilities, privacy, permissions and licensing arrangements for FarmTree Platform users.</p></div></section></section>
<section class="page" id="page-investors"></section>
<section class="page" id="page-dfi">
<div class="ft-aud-page">

<!-- 1 — SUBHERO -->
<div class="subhero ft-u-minh72"><img loading="lazy" decoding="async" alt="Landscape programme planning for DFIs and climate funds" src="<?php echo farmtree_asset('embedded_028_opt.webp'); ?>"/><div class="container"><div class="ft-cs-phase"><span class="ft-cs-phase-dot"></span>For DFIs, donors &amp; climate funds</div><h1 class="ft-u-maxw880">Programme-level planning and reporting for climate and landscape investment</h1><p class="lead ft-u-heronote-660">FarmTree helps development finance institutions translate complex agroforestry programmes into structured, evidence-based scenarios aligned with M&amp;E frameworks, donor requirements and climate fund standards.</p><div class="ft-aud-hero-btns"><button class="pill contact" type="button" data-ftmodal="request">Request programme demo</button><button class="ft-aud-btn-ghost" type="button" data-page="case-giz">Read the GIZ case study</button></div></div></div>

<!-- 2 — CHALLENGES -->
<section class="ft-aud-section cream"><div class="ft-aud-wrap"><span class="ft-cs-section-label">The challenge</span><h2 class="ft-aud-h2">Why large-scale agroforestry programmes are difficult to manage</h2><p class="ft-aud-lead">DFIs and donors need to coordinate complex programmes across diverse geographies, implementation partners and reporting systems — without losing scientific credibility or operational consistency.</p><div class="ft-aud-problem-grid"><div class="ft-aud-problem-card"><h3>Inconsistent baselines</h3><p>Large-scale programmes often involve multiple implementing partners and reporting systems. Without a shared methodology, programme-level comparison and transparent accountability become difficult to maintain.</p></div><div class="ft-aud-problem-card"><h3>Accountability gaps</h3><p>Climate and livelihood outcomes are expected, but the science behind projected impact is rarely transparent or independently reviewable — creating friction in funder relationships and complicating mid-term reviews.</p></div><div class="ft-aud-problem-card"><h3>Scaling bottlenecks</h3><p>Moving from pilot to multi-country roll-out requires consistent planning logic, calibrated local assumptions and a common reporting language — one that field teams can actually operate without expert support.</p></div></div></div></section>

<!-- 3 — VALUE -->
<section class="ft-aud-section"><div class="ft-aud-wrap"><span class="ft-cs-section-label">How FarmTree helps</span><h2 class="ft-aud-h2">From fragmented reporting to programme-wide evidence</h2><div class="ft-aud-grid-4"><div class="ft-aud-card"><div class="ft-aud-icon">⊞</div><h3>Programme scenario design</h3><p>Build comparable scenarios across sites, countries and implementation partners using a shared methodology — ensuring programme coherence even with diverse field conditions and local contexts.</p></div><div class="ft-aud-card"><div class="ft-aud-icon">◈</div><h3>Climate &amp; livelihood integration</h3><p>Model carbon, water, biodiversity and farmer income indicators together — producing the multi-dimensional impact evidence that climate funds and institutional donors increasingly require.</p></div><div class="ft-aud-card"><div class="ft-aud-icon">⊙</div><h3>M&amp;E-compatible outputs</h3><p>FarmTree outputs are structured to support monitoring and evaluation frameworks — connecting planning assumptions to measurable indicators that field teams can track and report against over time.</p></div><div class="ft-aud-card"><div class="ft-aud-icon">↗</div><h3>Climate fund alignment</h3><p>Produce scenario documentation and impact narratives that align with Green Climate Fund, CSRD and common donor reporting standards — reducing the burden on programme teams at reporting time.</p></div></div></div></section>

<!-- 4 — DATA CREDIBILITY -->
<div class="ft-aud-data-band"><div class="ft-aud-wrap"><span class="ft-cs-section-label ft-u-gold">Platform depth</span><h2 class="ft-aud-h2 ft-u-white-mb28">Multi-indicator modelling for programme accountability</h2><div class="ft-aud-kpi-strip"><div class="ft-aud-kpi"><strong>+10</strong><span>Impact KPIs modelled per scenario — carbon, water, income, biodiversity, soil and more</span></div><div class="ft-aud-kpi"><strong>50 yrs</strong><span>Long-term projection horizon for programme planning, investment cases and monitoring</span></div><div class="ft-aud-kpi"><strong>+900</strong><span>Species in the CAFS database — supporting local calibration across geographies</span></div><div class="ft-aud-kpi"><strong>Multi-country</strong><span>Consistent methodology applied across diverse landscapes, climates and implementation partners</span></div></div><div class="ft-aud-model-strip"><div class="ft-aud-model-pill">Carbon &amp; Climate<span>Sequestration, biomass and GHG indicator projections</span></div><div class="ft-aud-model-pill">Livelihoods<span>Farmer income, labour and long-term economic value</span></div><div class="ft-aud-model-pill">Water &amp; Ecology<span>Hydrology, soil, biodiversity and erosion risk</span></div><div class="ft-aud-model-pill">Landscape scale<span>Portfolio aggregation and programme-level reporting</span></div></div></div></div>

<!-- 5 — USE CASES -->
<section class="ft-aud-section cream"><div class="ft-aud-wrap"><span class="ft-cs-section-label">How it works in practice</span><h2 class="ft-aud-h2">Three ways DFIs and donors use FarmTree</h2><div class="ft-aud-usecase-list"><div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">01</div><div class="ft-aud-usecase-body"><h3>Programme design and feasibility</h3><p>Structure the science behind a new climate or livelihood programme before committing to implementation partners or seeking institutional approval — using credible, reviewable projections that hold up to scrutiny.</p></div></div><div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">02</div><div class="ft-aud-usecase-body"><h3>Multi-country portfolio management</h3><p>Apply a consistent planning and monitoring logic across a portfolio of agroforestry investments — enabling performance comparison between sites and countries without requiring additional analytical capacity at programme level.</p></div></div><div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">03</div><div class="ft-aud-usecase-body"><h3>Donor reporting and narrative building</h3><p>Generate science-backed impact narratives and indicator summaries that meet the reporting standards of institutional funders — from mid-term reviews to final programme evaluations — without rebuilding the evidence base from scratch.</p></div></div></div></div></section>

<!-- 6 — PROOF -->
<section class="ft-aud-section"><div class="ft-aud-wrap"><span class="ft-cs-section-label">Real project experience</span><h2 class="ft-aud-h2">Applied in programme design with institutional partners</h2><div class="ft-aud-proof-row"><div class="ft-aud-proof-quote">"We know very little of agroforestry options for a particular local context. The FarmTree tool is super helpful to generate location-specific scenarios quickly and confidently."<span class="ft-aud-proof-attr">Rob Kelly — World Vision Australia</span></div><div class="ft-aud-case-link" data-page="case-giz"><span class="ft-cs-section-label">Case study</span><h3>GIZ / Madagascar programme planning</h3><p>FarmTree supported GIZ in designing credible agroforestry scenarios for a programme-level investment case in Madagascar — translating local context into a structured planning framework for funders and implementers.</p><span class="ft-aud-cta-link-btn">Read the case study ↗</span></div></div></div></section>

<!-- 7 — CTA -->
<div class="ft-aud-cta-band"><div class="ft-aud-wrap"><h2>Ready to strengthen your programme evidence base?</h2><p>Request a programme demo with the FarmTree team. We will walk you through a relevant scenario and discuss how FarmTree can support your planning, M&amp;E and donor reporting needs.</p><div class="ft-aud-cta-btns"><button class="pill contact" type="button" data-ftmodal="request">Request programme demo</button><button class="ft-aud-btn-ghost" type="button" data-page="contact">Contact the team</button></div></div></div>

</div>
</section>
<section class="page" id="page-ngos"><div class="ft-page-soft"><div class="ft-commercial-wrap"><span class="ft-section-label">NGO and implementation use case</span><h1>Support field teams with clearer planning and reporting workflows</h1><p>FarmTree can help implementing partners move from fragmented manual reporting to more consistent project assumptions, field learning and stakeholder communication.</p><div class="ft-split"><div class="ft-list-card"><h3>Operational benefits</h3><ul><li>Field data collection support</li><li>Community-level planning conversations</li><li>Reduced manual reporting burden</li><li>Clearer project outputs for partners</li></ul></div><div class="ft-list-card"><h3>Next step</h3><p>Map an implementation workflow and identify where FarmTree can support daily project work.</p><button type="button" class="pill contact" data-page="request">Request workflow session</button></div></div></div></div></section>
<section class="page ft-p5-page" id="page-pricing">

<!-- 1. SUBHERO -->
<div class="subhero"><img loading="lazy" decoding="async" alt="FarmTree pricing and scope discussion" src="<?php echo farmtree_asset('embedded_025_opt.webp'); ?>"/><div class="container"><div class="kicker">Pricing</div><h1>Scope-based pricing built around your project reality</h1><p class="lead ft-u-heronote-660">FarmTree does not publish fixed price lists. Every engagement starts with your context, your team and your goals — then we propose the right scope and level of support.</p><div class="ft-p5-hero-btns"><button class="pill contact" type="button" data-ftmodal="request">Request a quotation</button><button class="ft-p5-hero-ghost" type="button" data-page="services">View service areas</button></div></div></div>

<!-- 2. PRICING PHILOSOPHY -->
<section class="ft-p5-section cream"><div class="ft-p5-wrap"><span class="ft-section-label">Our approach</span><h2 class="ft-p5-h2">Why we price by scope, not by feature</h2><p class="ft-p5-lead">Agroforestry projects vary enormously in complexity, geography, team capability and reporting requirements. A one-size price list would either overprice simple engagements or underdeliver on complex ones.</p><div class="ft-price-philos"><div class="ft-price-philos-card"><span class="ft-price-philos-icon">◎</span><strong>Consultative</strong><span>We start with a conversation about your project, not a price sheet. The right scope depends on what you need to achieve, not what we want to sell.</span></div><div class="ft-price-philos-card"><span class="ft-price-philos-icon">⊙</span><strong>Transparent</strong><span>Every engagement is clearly scoped before work begins. You know what you get, how long it takes, and what comes next before any commitment is made.</span></div><div class="ft-price-philos-card"><span class="ft-price-philos-icon">↗</span><strong>Flexible</strong><span>Many teams start with a single Analysis or Platform engagement and add service areas as confidence and need grow. There is no obligation to scale.</span></div></div></div></section>

<!-- 3. THREE SCOPE TIERS -->
<section class="ft-p5-section"><div class="ft-p5-wrap"><span class="ft-section-label">Scope tiers</span><h2 class="ft-p5-h2">Three levels of engagement — choose where to start</h2><p class="ft-p5-lead">Each tier represents a different level of depth, team involvement and time commitment. All tiers use the same science-based FarmTree methodology.</p>
<div class="ft-price-tiers">

<div class="ft-price-tier"><div class="ft-price-tier-label">Tier 01</div><h3>Analysis</h3><p>For defined modelling questions and investment case reviews. FarmTree delivers science-backed scenario outputs with full documentation — without team onboarding or platform access.</p><div class="ft-price-divider"></div><div class="ft-price-includes">What's included</div><ul><li>Baseline and agroforestry scenario comparison</li><li>Carbon, production and farmer income projections</li><li>Investment narrative and sensitivity analysis</li><li>Documentation and output summary</li></ul><div class="ft-price-includes ft-u-mt4">Typical for</div><ul><li>Due diligence reviews</li><li>Pre-investment case preparation</li><li>Research and policy analysis</li></ul><button class="ft-price-ghost" type="button" data-ftmodal="request">Request an analysis scope</button></div>

<div class="ft-price-tier featured"><div class="ft-price-tier-label">Tier 02</div><h3>Platform</h3><p>For teams ready to engage with the FarmTree platform directly. Includes demo, onboarding, guided use-case sessions and local calibration support.</p><div class="ft-price-divider"></div><div class="ft-price-includes">What's included</div><ul><li>Everything in Analysis</li><li>Platform demo and guided onboarding</li><li>Use-case specific platform session</li><li>Local species and condition calibration</li><li>Scenario documentation for team use</li></ul><div class="ft-price-includes ft-u-mt4">Typical for</div><ul><li>First platform engagement</li><li>Proof-of-concept projects</li><li>New geography or crop system entry</li></ul><button class="pill contact" type="button" data-ftmodal="request">Request a platform scope</button></div>

<div class="ft-price-tier"><div class="ft-price-tier-label">Tier 03</div><h3>Scale</h3><p>For teams building independent, repeatable agroforestry planning capacity. Includes structured training, multi-site management and ongoing reporting support.</p><div class="ft-price-divider"></div><div class="ft-price-includes">What's included</div><ul><li>Everything in Platform</li><li>Structured team training programme</li><li>Field data collection support</li><li>Multi-site and multi-country management</li><li>MRV-aligned monitoring and reporting</li><li>Ongoing support and model updates</li></ul><div class="ft-price-includes ft-u-mt4">Typical for</div><ul><li>Programme roll-out and scaling</li><li>Multi-country portfolio management</li><li>Donor reporting engagements</li></ul><button class="ft-price-ghost" type="button" data-ftmodal="request">Request a scale scope</button></div>

</div></div></section>

<!-- 4. WHAT AFFECTS SCOPE -->
<section class="ft-p5-section cream"><div class="ft-p5-wrap"><span class="ft-section-label">Scope factors</span><h2 class="ft-p5-h2">What affects the scope and depth of an engagement</h2><p class="ft-p5-lead">These are the main factors that determine the right engagement level and inform the quotation FarmTree prepares for your project.</p><div class="ft-price-scope-grid"><div class="ft-price-scope-item"><div class="ft-price-scope-num">01</div><div><h4>Number of countries and sites</h4><p>Multi-country or multi-site projects require separate calibration steps and may involve different species databases and climate parameters.</p></div></div><div class="ft-price-scope-item"><div class="ft-price-scope-num">02</div><div><h4>Species and calibration complexity</h4><p>Locally calibrated species models take more time to set up than standard configurations. New species not yet in the CAFS database require additional scientific input.</p></div></div><div class="ft-price-scope-item"><div class="ft-price-scope-num">03</div><div><h4>Team training requirement</h4><p>The number of staff to train, their prior experience with quantitative tools, and the language of delivery all affect training scope and time.</p></div></div><div class="ft-price-scope-item"><div class="ft-price-scope-num">04</div><div><h4>Reporting format and standard</h4><p>Outputs aligned with specific standards — Verra VCS, Gold Standard, GCF, CSRD — require additional documentation and review steps beyond standard deliverables.</p></div></div><div class="ft-price-scope-item"><div class="ft-price-scope-num">05</div><div><h4>Monitoring and MRV alignment</h4><p>Ongoing monitoring engagements require baseline documentation, field data structure design and periodic model updates that extend the engagement scope.</p></div></div><div class="ft-price-scope-item"><div class="ft-price-scope-num">06</div><div><h4>Frequency of updates and support</h4><p>Some teams need one-time scenario delivery; others benefit from quarterly updates, model recalibration and regular communication with the FarmTree team.</p></div></div></div></div></section>

<!-- 5. PRICING FAQ -->
<section class="ft-p5-section"><div class="ft-p5-wrap"><span class="ft-section-label">Common questions</span><h2 class="ft-p5-h2">Frequently asked pricing questions</h2><p class="ft-p5-lead">The most common questions we receive before a quotation is requested.</p><div class="ft-price-faq-list" id="priceFaqList"><div class="ft-price-faq-item"><button class="ft-price-faq-q" type="button">Do you publish fixed prices? <span class="ft-price-faq-icon">+</span></button><div class="ft-price-faq-a">No. FarmTree's pricing is always scope-based. We discuss your project context first and then propose the right level of engagement — which means you only pay for what your project actually needs.</div></div><div class="ft-price-faq-item"><button class="ft-price-faq-q" type="button">Can we start small and expand later? <span class="ft-price-faq-icon">+</span></button><div class="ft-price-faq-a">Yes. Many teams begin with an Analysis or Platform engagement and add Scale services as their confidence and internal capability grow. There is no obligation to commit to a full Scale engagement upfront.</div></div><div class="ft-price-faq-item"><button class="ft-price-faq-q" type="button">How long does a typical engagement take? <span class="ft-price-faq-icon">+</span></button><div class="ft-price-faq-a">Analysis engagements typically deliver within one to four weeks depending on complexity. Platform engagements run over one to three months. Scale engagements are structured over a longer horizon depending on training and roll-out requirements.</div></div><div class="ft-price-faq-item"><button class="ft-price-faq-q" type="button">Is there a free trial or introductory session? <span class="ft-price-faq-icon">+</span></button><div class="ft-price-faq-a">Yes. FarmTree offers introductory demo sessions where you can explore the platform and discuss your project context before committing to any scope. Contact us to arrange a session.</div></div><div class="ft-price-faq-item"><button class="ft-price-faq-q" type="button">What is included in ongoing support? <span class="ft-price-faq-icon">+</span></button><div class="ft-price-faq-a">Support varies by engagement. Scale engagements typically include structured check-ins, model updates when field data or assumptions change, and access to the FarmTree team for questions during the programme period.</div></div><div class="ft-price-faq-item"><button class="ft-price-faq-q" type="button">Can the outputs be used for investor and donor reporting? <span class="ft-price-faq-icon">+</span></button><div class="ft-price-faq-a">Yes. FarmTree outputs are designed to support formal reporting. Alignment with specific standards — Verra VCS, Gold Standard, GCF, CSRD — is confirmed at scoping stage and affects the documentation depth included in the engagement.</div></div></div></div></section>

<!-- 6. FINAL CTA -->
<section class="ft-p5-section dark"><div class="ft-p5-wrap ft-u-center"><h2 class="ft-p5-h2">Ready to discuss your scope?</h2><p class="ft-p5-lead ft-u-mxauto-mb28">Send FarmTree a brief description of your project and goals. The team will review your context and come back with a clear scope proposal within a few business days.</p><div class="ft-u-ctarow"><button class="pill contact" type="button" data-ftmodal="request">Request a quotation</button><button class="ft-p5-hero-ghost" type="button" data-page="services">View service areas</button></div></div></section>

</section>


<section class="page ft-cs-page" id="page-case-giz">
<div class="subhero"><img loading="lazy" decoding="async" alt="Agroforestry planning in Madagascar with GIZ" src="<?php echo farmtree_asset('case-giz_opt.webp'); ?>"/><div class="container"><div class="ft-cs-phase"><span class="ft-cs-phase-dot"></span>Phase 01 &nbsp;·&nbsp; Programme Planning</div><h1>Turning project ambition into credible investment scenarios</h1><p class="lead ft-u-heronote-680">GIZ needed landscape-scale agroforestry scenarios for Madagascar that funders, implementers and local teams could evaluate together — fast.</p></div></div>
<section class="section ft-rich-page"><div class="container">
<div class="ft-cs-breadcrumb"><button type="button" data-page="home">Home</button><span>›</span><button type="button" data-page="home" onclick="setTimeout(function(){document.getElementById('case-study-cards').scrollIntoView({behavior:'smooth'})},80)">Case studies</button><span>›</span><span>GIZ / Madagascar</span></div>
<div class="ft-inline-intro"><strong>Understanding the system before committing to the plan</strong><p>GIZ needed to translate a complex agroforestry programme idea in Madagascar into structured investment scenarios that funders, implementers and local teams could evaluate together. FarmTree provided the modelling capacity to do this quickly, consistently and with enough scientific rigour to support institutional decision-making.</p></div>
<div class="ft-cs-meta">
<div class="ft-cs-meta-item"><span>Partner</span><span>GIZ</span></div>
<div class="ft-cs-meta-item"><span>Location</span><span>Madagascar</span></div>
<div class="ft-cs-meta-item"><span>Project phase</span><span>Understand &amp; Design</span></div>
<div class="ft-cs-meta-item"><span>Focus area</span><span>Programme investment planning</span></div>
<div class="ft-cs-meta-item"><span>Projection horizon</span><span>Up to 50 years</span></div>
</div>
<span class="ft-cs-section-label">Context · Challenge · Approach</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Context</h3><p>A large-scale programme with multiple species candidates, sites and land-use histories. GIZ needed a planning framework that could work across different local conditions while remaining comparable at programme level.</p></article>
<article class="ft-info-card"><h3>Challenge</h3><p>Building credible agroforestry scenarios requires integrating local species data, climate assumptions, land quality parameters and financial projections — work that typically takes external consultants months to complete and rarely produces comparable outputs.</p></article>
<article class="ft-info-card"><h3>Approach</h3><p>FarmTree ran landscape-level scenario design sessions with the project team, calibrated species assumptions with local data and generated carbon, production and farmer income projections in hours — producing outputs the programme team could review, adjust and present to funders.</p></article>
</div>
<div class="ft-ack-band ft-u-mt28-r24">
<div class="ft-band-item"><strong>Multiple scenarios</strong><span>Comparable agroforestry options assessed within a single planning session</span></div>
<div class="ft-band-item"><strong>50-year horizon</strong><span>Long-term carbon, income and production projections for investment framing</span></div>
<div class="ft-band-item"><strong>GIZ-aligned</strong><span>Science-based assumptions matched to GIZ programme methodology and reporting standards</span></div>
</div>
<span class="ft-cs-section-label">Key outputs</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Scenario framework</h3><p>A set of comparable agroforestry scenarios covering different species mixes, planting densities and land-use configurations — structured for funder review and programme design decisions.</p><ul><li>Species selection and density options</li><li>Site-specific condition calibration</li><li>Side-by-side scenario comparison</li></ul></article>
<article class="ft-info-card"><h3>Carbon &amp; income projections</h3><p>Science-based projections for carbon sequestration, biomass accumulation and farmer income under each scenario — aligned with GIZ programme reporting expectations and climate finance standards.</p><ul><li>Carbon stock and CRU projections by species</li><li>Farmer income and cash flow modelling</li><li>Sensitivity analysis across key assumptions</li></ul></article>
<article class="ft-info-card"><h3>Investment case narrative</h3><p>A structured planning framework that project teams and climate finance partners could use to evaluate trade-offs and support programme design and funding conversations.</p><ul><li>Funder-ready scenario summaries</li><li>Risk and confidence framing</li><li>Outputs adapted for institutional review</li></ul></article>
</div>
<div class="ft-quote-card">"The FarmTree Tool and team helped us understand the value of different agroforestry systems and the potential for increased revenue over a few decades."<span class="ft-cs-quote-attr">Mona McCord — SAN</span></div>
<div class="ft-cs-cta-row"><button class="ft-cs-back" type="button" data-page="home">← Back to overview</button><button class="pill contact" type="button" data-ftmodal="request">Discuss a similar project</button></div>
</div></section>
</section>
<section class="page ft-cs-page" id="page-case-acorn">
<div class="subhero"><img loading="lazy" decoding="async" alt="ACORN Rabobank agroforestry carbon planning" src="<?php echo farmtree_asset('case-acorn_opt.webp'); ?>"/><div class="container"><div class="ft-cs-phase"><span class="ft-cs-phase-dot"></span>Phase 02 &nbsp;·&nbsp; Carbon Planning</div><h1>Field data turned into consistent carbon projections at scale</h1><p class="lead ft-u-heronote-680">Rabobank ACORN needed a shared scientific methodology to compare smallholder agroforestry projects across three continents — consistently and at portfolio scale.</p></div></div>
<section class="section ft-rich-page"><div class="container">
<div class="ft-cs-breadcrumb"><button type="button" data-page="home">Home</button><span>›</span><button type="button" data-page="home">Case studies</button><span>›</span><span>ACORN / Rabobank</span></div>
<div class="ft-inline-intro"><strong>A shared analytical foundation across continents</strong><p>The Rabobank ACORN programme connects smallholder farmers across Africa, Asia and Latin America to voluntary carbon markets. To manage a portfolio of this scale, ACORN needed a consistent, science-based method to translate diverse field conditions into comparable carbon and farmer value projections. FarmTree provided that foundation.</p></div>
<div class="ft-cs-meta">
<div class="ft-cs-meta-item"><span>Partner</span><span>Rabobank ACORN</span></div>
<div class="ft-cs-meta-item"><span>Geographies</span><span>Africa, Asia, Latin America</span></div>
<div class="ft-cs-meta-item"><span>Project phase</span><span>Capture &amp; Learn</span></div>
<div class="ft-cs-meta-item"><span>Focus area</span><span>Carbon and farmer value modelling</span></div>
<div class="ft-cs-meta-item"><span>Standard alignment</span><span>Verra VCS</span></div>
</div>
<span class="ft-cs-section-label">Context · Challenge · Approach</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Context</h3><p>Smallholder agroforestry projects across multiple countries and climatic zones, each with different species, soils, land-use histories and reporting requirements — all needing to be managed within a single programme framework.</p></article>
<article class="ft-info-card"><h3>Challenge</h3><p>Maintaining scientific consistency when field conditions, species databases and local assumptions vary significantly across geographies — while still producing carbon projections that meet voluntary carbon market standards and support investor confidence.</p></article>
<article class="ft-info-card"><h3>Approach</h3><p>FarmTree calibrated local species and condition parameters for each project geography, built a shared scenario logic that could be applied across the portfolio, and generated carbon stock and farmer income projections aligned with Verra VCS methodology.</p></article>
</div>
<div class="ft-ack-band ft-u-mt28-r24">
<div class="ft-band-item"><strong>3 continents</strong><span>Consistent modelling methodology applied across Africa, Asia and Latin America</span></div>
<div class="ft-band-item"><strong>Verra VCS aligned</strong><span>Carbon projections structured to meet voluntary carbon market standards</span></div>
<div class="ft-band-item"><strong>Portfolio-level view</strong><span>Shared analytical framework enabling comparison across all ACORN project sites</span></div>
</div>
<span class="ft-cs-section-label">Key outputs</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Consistent carbon methodology</h3><p>A shared scenario logic applied across all ACORN project geographies — enabling portfolio-level comparison and reporting on a single scientific basis without sacrificing local accuracy.</p><ul><li>Carbon stock and sequestration projections by species</li><li>Biomass accumulation curves per site</li><li>Portfolio-level carbon aggregation</li></ul></article>
<article class="ft-info-card"><h3>Species and context calibration</h3><p>Local species data, climate parameters and land-use assumptions calibrated per geography — maintaining scientific accuracy without requiring separate methodologies per site or country.</p><ul><li>CAFS species database applied per location</li><li>Climate and soil parameters matched to site</li><li>Calibration documented for audit and review</li></ul></article>
<article class="ft-info-card"><h3>Farmer value scenarios</h3><p>Long-term income and cash flow projections that helped local teams communicate the economic value of agroforestry participation to farmer communities, carbon buyers and programme partners.</p><ul><li>Farmer income per scenario and site</li><li>Cash flow and labour projections</li><li>Outputs adapted for community-level communication</li></ul></article>
</div>
<div class="ft-quote-card">"FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue — they do everything."<span class="ft-cs-quote-attr">Mathijs de Bruin — TreeScape</span></div>
<div class="ft-cs-cta-row"><button class="ft-cs-back" type="button" data-page="home">← Back to overview</button><button class="pill contact" type="button" data-ftmodal="request">Discuss carbon planning</button></div>
</div></section>
</section>
<section class="page ft-cs-page" id="page-case-cocoa">
<div class="subhero"><img loading="lazy" decoding="async" alt="Cocoa agroforestry landscape planning with Beyond Beans" src="<?php echo farmtree_asset('case-cocoa_opt.webp'); ?>"/><div class="container"><div class="ft-cs-phase"><span class="ft-cs-phase-dot"></span>Phase 03 &nbsp;·&nbsp; Landscape Scenario Planning</div><h1>Shade-tree density and carbon insetting, modelled at landscape scale</h1><p class="lead ft-u-heronote-680">Beyond Beans needed evidence-based comparisons of shade-tree systems across their cocoa supply chain — to make investment decisions that worked for farmers, buyers and the climate.</p></div></div>
<section class="section ft-rich-page"><div class="container">
<div class="ft-cs-breadcrumb"><button type="button" data-page="home">Home</button><span>›</span><button type="button" data-page="home">Case studies</button><span>›</span><span>Beyond Beans</span></div>
<div class="ft-inline-intro"><strong>Turning cocoa complexity into comparable scenarios</strong><p>Beyond Beans works with cocoa supply chains to improve sustainability and farmer livelihoods across landscapes. FarmTree helped Beyond Beans compare the effect of different shade-tree systems — modelling the trade-offs between productivity, farmer income and carbon insetting potential across their sourcing geographies.</p></div>
<div class="ft-cs-meta">
<div class="ft-cs-meta-item"><span>Partner</span><span>Beyond Beans</span></div>
<div class="ft-cs-meta-item"><span>Focus crop</span><span>Cocoa (Theobroma cacao)</span></div>
<div class="ft-cs-meta-item"><span>Project phase</span><span>Operate &amp; Scale</span></div>
<div class="ft-cs-meta-item"><span>Focus area</span><span>Cocoa landscape scenario planning</span></div>
<div class="ft-cs-meta-item"><span>Carbon approach</span><span>Insetting within supply chain</span></div>
</div>
<span class="ft-cs-section-label">Context · Challenge · Approach</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Context</h3><p>Cocoa landscapes with varying shade-tree densities, species mixes and climate conditions — each combination affecting productivity, carbon potential and farmer income differently, making system comparison difficult without a shared modelling framework.</p></article>
<article class="ft-info-card"><h3>Challenge</h3><p>Supply chain sustainability decisions need to be grounded in evidence. Beyond Beans needed to show how different shade configurations affect long-term farmer returns and carbon outcomes in a format that supply chain partners and climate investors could review with confidence.</p></article>
<article class="ft-info-card"><h3>Approach</h3><p>FarmTree built scenario comparisons across shade-tree density ranges and species combinations, projecting farmer cash flow, carbon insetting potential and productivity under each configuration at both farm and landscape scale.</p></article>
</div>
<div class="ft-ack-band ft-u-mt28-r24">
<div class="ft-band-item"><strong>Multiple shade systems</strong><span>Side-by-side scenario comparison across density and species combinations</span></div>
<div class="ft-band-item"><strong>Carbon insetting quantified</strong><span>Estimated insetting potential per land configuration within the supply chain</span></div>
<div class="ft-band-item"><strong>Landscape aggregation</strong><span>Farm-level outputs scaled to supply chain and landscape level for partner communication</span></div>
</div>
<span class="ft-cs-section-label">Key outputs</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Shade scenario comparison</h3><p>Side-by-side projections for different shade-tree densities and species mixes — showing the effect on cocoa productivity, farmer income and long-term carbon potential across the supply chain geography.</p><ul><li>Density and species variation scenarios</li><li>Productivity and income trade-off analysis</li><li>Outputs by farm type and region</li></ul></article>
<article class="ft-info-card"><h3>Carbon insetting model</h3><p>Quantified carbon insetting estimates per land configuration, enabling supply chain partners to evaluate the carbon value embedded within the cocoa system — rather than relying on external offsetting mechanisms.</p><ul><li>Carbon stock projections by species and density</li><li>Insetting value per hectare by configuration</li><li>Comparison against offset alternatives</li></ul></article>
<article class="ft-info-card"><h3>Supply chain sustainability case</h3><p>Landscape-level outputs structured for communication with supply chain partners, co-investors and sustainability programme funders — combining farmer economics, environmental outcomes and carbon value in one narrative.</p><ul><li>Partner-ready scenario summaries</li><li>Landscape aggregation by sourcing area</li><li>Outputs aligned with sustainability reporting frameworks</li></ul></article>
</div>
<div class="ft-quote-card">"FarmTree provides a remarkable level of detail that helps us truly understand why coffee agroforestry systems perform the way they do — and how to communicate that to partners."<span class="ft-cs-quote-attr">Katharina Lima de Miranda — HRNS</span></div>
<div class="ft-cs-cta-row"><button class="ft-cs-back" type="button" data-page="home">← Back to overview</button><button class="pill contact" type="button" data-ftmodal="request">Discuss cocoa landscape planning</button></div>
</div></section>
</section>
<section class="page ft-cs-page" id="page-case-nyando">
<div class="subhero"><img loading="lazy" decoding="async" alt="LOSO Nyando water and landscape resilience programme Kenya" src="<?php echo farmtree_asset('case-water_opt.webp'); ?>"/><div class="container"><div class="ft-cs-phase"><span class="ft-cs-phase-dot"></span>Phase 04 &nbsp;·&nbsp; Water Resilience &amp; Monitoring</div><h1>Connecting water balance, carbon and farmer value in a single investment case</h1><p class="lead ft-u-heronote-680">The LOSO Nyando programme needed to translate multi-dimensional landscape impact into a coherent, investor-ready narrative — across water, carbon and community livelihoods.</p></div></div>
<section class="section ft-rich-page"><div class="container">
<div class="ft-cs-breadcrumb"><button type="button" data-page="home">Home</button><span>›</span><button type="button" data-page="home">Case studies</button><span>›</span><span>LOSO Nyando</span></div>
<div class="ft-inline-intro"><strong>Evidence for a landscape investment decision</strong><p>The LOSO Nyando programme brings together community land restoration, water resilience and agroforestry investment in the Lake Victoria watershed, western Kenya. FarmTree helped the programme team build an investment-grade narrative connecting hydrological services, carbon outcomes and farmer income — giving funders and partners a clear, unified picture of landscape value.</p></div>
<div class="ft-cs-meta">
<div class="ft-cs-meta-item"><span>Programme</span><span>LOSO Nyando</span></div>
<div class="ft-cs-meta-item"><span>Location</span><span>Western Kenya</span></div>
<div class="ft-cs-meta-item"><span>Project phase</span><span>Monitoring &amp; Reporting</span></div>
<div class="ft-cs-meta-item"><span>Focus area</span><span>Water resilience &amp; landscape investment</span></div>
<div class="ft-cs-meta-item"><span>Watershed</span><span>Lake Victoria basin</span></div>
</div>
<span class="ft-cs-section-label">Context · Challenge · Approach</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Context</h3><p>A complex multi-stakeholder landscape programme with ambitions across water resilience, carbon markets and community livelihoods. Each impact dimension needed to be modelled independently — but also presented as part of a coherent, credible investment story for funders and water authority partners.</p></article>
<article class="ft-info-card"><h3>Challenge</h3><p>Connecting hydrology, carbon and farmer value into a single, technically rigorous model demands both scientific depth and narrative clarity. The programme needed outputs that could be validated by science partners, communicated to investors and eventually linked to field monitoring systems.</p></article>
<article class="ft-info-card"><h3>Approach</h3><p>FarmTree modelled water balance and erosion risk under different land restoration scenarios, projected carbon stocks and farmer income alongside hydrological indicators, and produced landscape-level aggregations that supported programme reporting and investor communication in parallel.</p></article>
</div>
<div class="ft-ack-band ft-u-mt28-r24">
<div class="ft-band-item"><strong>Water + carbon integrated</strong><span>Hydrological service value modelled alongside carbon and farmer income in a single framework</span></div>
<div class="ft-band-item"><strong>Landscape aggregation</strong><span>Farm-level outputs scaled to programme and watershed level for investment reporting</span></div>
<div class="ft-band-item"><strong>Monitoring-ready</strong><span>Scenario baselines that can be connected to field monitoring data over time</span></div>
</div>
<span class="ft-cs-section-label">Key outputs</span>
<div class="ft-info-grid">
<article class="ft-info-card"><h3>Water resilience projections</h3><p>Modelled water balance and erosion risk under different agroforestry interventions — quantifying the hydrological service value of landscape restoration for programme funders and water authority partners.</p><ul><li>Water balance and runoff reduction projections</li><li>Erosion risk modelling by intervention type</li><li>Hydrological service value framing for funders</li></ul></article>
<article class="ft-info-card"><h3>Integrated impact model</h3><p>A single analytical framework connecting water, carbon and farmer income across the Nyando landscape — enabling programme teams to present a coherent, complete and science-backed investment narrative.</p><ul><li>Carbon sequestration and soil health projections</li><li>Farmer income scenarios under each intervention plan</li><li>Multi-indicator landscape aggregation</li></ul></article>
<article class="ft-info-card"><h3>Monitoring-ready outputs</h3><p>Scenario baselines and projection bands that can be connected to field monitoring data over time — supporting ongoing performance review, adaptive programme management and reporting to climate finance partners.</p><ul><li>Baseline scenario documentation</li><li>Projection confidence ranges per indicator</li><li>Framework for connecting field observations to model outputs</li></ul></article>
</div>
<div class="ft-quote-card">"We found the FarmTree Tool essential for predicting outcomes of highly complex farm scenarios — among many, also agroforestry systems."<span class="ft-cs-quote-attr">Lorenzo Mento — Nectaerra</span></div>
<div class="ft-cs-cta-row"><button class="ft-cs-back" type="button" data-page="home">← Back to overview</button><button class="pill contact" type="button" data-ftmodal="request">Discuss landscape investment planning</button></div>
</div></section>
</section>
<section class="page" id="page-blog"></section>
