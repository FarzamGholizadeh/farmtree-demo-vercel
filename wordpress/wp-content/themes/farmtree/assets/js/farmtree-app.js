/* FarmTree app bundle — every in-body script in original execution
   order (self-contained IIFEs). Loaded in the footer. Order is the
   contract; do not reorder. window.FT_ASSETS is injected before this. */

/* ---- block 1 ---- */
(function(){
  function initPriceFaq(){
    var list = document.getElementById('priceFaqList');
    if(!list) return;
    list.querySelectorAll('.ft-price-faq-q').forEach(function(btn){
      if(btn.dataset.pfReady) return;
      btn.dataset.pfReady = '1';
      btn.addEventListener('click', function(){
        var item = btn.closest('.ft-price-faq-item');
        var wasOpen = item.classList.contains('open');
        list.querySelectorAll('.ft-price-faq-item').forEach(function(i){ i.classList.remove('open'); });
        if(!wasOpen) item.classList.add('open');
      });
    });
  }
  document.addEventListener('DOMContentLoaded', initPriceFaq);
  setTimeout(initPriceFaq, 500);
})();

/* ---- block 2 ---- */
/* Customer-segment pages: one reusable template rendered from structured
   data. Injected synchronously at parse time so the authoritative router
   resolves #segment-* routes on direct load, refresh and history nav.
   The homepage carousel content that previously summarised these
   segments is superseded by these pages (archive in qa/). */
(function(){
  var REG='https://tool.farmtree.earth/Identity/Account/Register';
  var S=[
   {slug:'advisors',short:'Advisors',title:'Consultancy & Agroforestry Advisors',
    value:'Add science-based agroforestry modelling to advisory work and give clients clearer scenario comparisons they can act on.',
    context:'Advisors need to compare land-use and agroforestry options, explain long-term costs and benefits, and translate technical assumptions into credible client recommendations.',
    helps:[['Baseline vs intervention','Compare a client’s current land use against agroforestry scenarios with documented assumptions.'],
           ['Local calibration','Work with locally calibrated species and climate assumptions rather than generic defaults.'],
           ['Multi-indicator projections','Show production, carbon, water and financial projections side by side.'],
           ['Sensitivity & comparison','Test how outcomes shift over the long term when key assumptions change.']],
    caps:['agroforestry scenario comparison','production projections','carbon projections','farmer income','financial planning','long-term scenario modelling'],
    outputs:['Scenario comparison','Farm or project plan','Projection summary','Client-ready evidence package'],
    flow:'Advisors typically enter at step one of the FarmTree workflow — turning project context and assumptions into credible plans — and hand clients evidence they can carry through implementation and review.'},
   {slug:'development-banks-donors',short:'Development Banks & Donors',title:'Development Banks & Donor Organisations',
    value:'Build a stronger evidence base for programme and portfolio investment decisions.',
    context:'Development finance and donor teams need comparable evidence across projects, credible long-term assumptions and visibility into both environmental outcomes and farmer value.',
    helps:[['Programme scenarios','Structure programme investment scenarios on consistent, documented assumptions.'],
           ['Farmer return visibility','Project long-term farmer returns alongside environmental indicators.'],
           ['Risk & sensitivity','Compare risk and sensitivity across interventions before committing funds.'],
           ['Comparable reporting','Report across projects and portfolios with the same indicator logic.']],
    caps:['portfolio comparison','long-term scenario modelling','carbon projections','farmer income','financial planning','reporting'],
    outputs:['Programme investment case','Portfolio scenario comparison','Long-term cost-benefit projection','Decision-ready reporting package'],
    flow:'Programme teams use the FarmTree workflow from investment planning through review — the same evidence base serves appraisal, monitoring and reporting.'},
   {slug:'ngos-conservation',short:'NGOs & Conservation',title:'NGOs & Conservation Organisations',
    value:'Plan, implement and report on agroforestry impact with stronger evidence.',
    context:'NGOs and conservation organisations need to connect field realities, farmer priorities and environmental objectives with funder-ready planning and reporting.',
    helps:[['Local scenarios','Build agroforestry scenarios grounded in local field realities.'],
           ['Livelihoods in focus','Keep farmer livelihood considerations explicit in every plan.'],
           ['Environmental indicators','Track carbon, water, soil and production in one framework.'],
           ['Funder communication','Support baselines, monitoring logic and funder-facing reporting.']],
    caps:['agroforestry scenario comparison','carbon projections','hydrology','soil fertility','farmer income','project monitoring','reporting'],
    outputs:['Project scenario plan','Environmental and livelihood projection','Monitoring framework input','Funder-facing impact summary'],
    flow:'NGO teams move through the full FarmTree workflow — plan, implement, review, report — with one consistent evidence base from proposal to funder report.'},
   {slug:'nbs-carbon',short:'NbS & Carbon Developers',title:'NbS & Carbon Project Developers',
    value:'Connect agroforestry design, carbon potential and long-term project viability within one scenario framework.',
    context:'Nature-based solutions and carbon project developers need to compare system designs while considering carbon, farmer economics, production and implementation realities together.',
    helps:[['Species-level carbon','Project biomass and carbon at species level, under local conditions.'],
           ['Design comparison','Compare baseline and intervention designs before field commitment.'],
           ['Farmer economics','Model farmer income and cash flow alongside carbon outcomes.'],
           ['Monitoring preparation','Prepare the projection logic that monitoring and reporting build on.']],
    caps:['carbon projections','agroforestry scenario comparison','farmer income','long-term scenario modelling','project monitoring','reporting'],
    outputs:['Carbon scenario comparison','Agroforestry system design evidence','Farmer value projection','Project investment scenario'],
    flow:'Developers use FarmTree from scenario design through performance review — the workflow keeps carbon, production and farmer value connected across the project lifecycle.'},
   {slug:'mrv-esg',short:'MRV & ESG Platforms',title:'MRV & ESG Platforms',
    value:'Connect observed field information with forward-looking agroforestry impact projections.',
    context:'MRV and ESG systems often capture current or historical field data but require structured modelling to understand future performance and compare interventions.',
    helps:[['Assumption integration','Bring field assumptions into a structured, documented model.'],
           ['Multi-KPI modelling','Model production, carbon, water and economics in one scenario.'],
           ['Projected vs observed','Compare projected trajectories with observed performance over time.'],
           ['Consistent reporting','Keep indicators consistent across locations and projects.']],
    caps:['long-term scenario modelling','portfolio comparison','carbon projections','hydrology','project monitoring','reporting'],
    outputs:['Scenario projection layer','Indicator mapping','Portfolio comparison','Reporting-ready model outputs'],
    flow:'FarmTree’s workflow complements monitoring systems: projections set the forward view that observed field data is compared against at review.'},
   {slug:'government-parastatals',short:'Government & Parastatals',title:'Government & Parastatals',
    value:'Support agroforestry policy, programme design and landscape investment with measurable scenarios.',
    context:'Public-sector organisations need to compare interventions across regions, coordinate multiple stakeholders and understand long-term environmental, economic and farmer outcomes.',
    helps:[['Regional comparison','Compare interventions across regions on the same assumptions.'],
           ['Landscape planning','Plan programmes at landscape level with measurable indicators.'],
           ['Farmer & environment','Keep farmer value and environmental outcomes visible together.'],
           ['Stakeholder evidence','Give stakeholders comparable evidence for coordination decisions.']],
    caps:['agroforestry scenario comparison','portfolio comparison','long-term scenario modelling','farmer income','carbon projections','reporting'],
    outputs:['Regional scenario overview','Programme investment framework','Policy decision-support evidence','Landscape reporting summary'],
    flow:'Public programmes apply the FarmTree workflow across regions — one planning and reporting logic that stakeholders can share.'},
   {slug:'industry-associations',short:'Industry Associations & MSPs',title:'Industry Associations & MSPs',
    value:'Create shared agroforestry evidence for value-chain and landscape collaboration.',
    context:'Industry associations and multi-stakeholder platforms need common assumptions, comparable indicators and a shared evidence base across organisations.',
    helps:[['Shared scenarios','Define scenarios once and share them across member organisations.'],
           ['Comparable indicators','Keep indicators consistent across the value chain or landscape.'],
           ['Decision support','Support member and stakeholder decisions with one evidence base.'],
           ['Scalable reporting','Structure reporting that scales across programmes and partners.']],
    caps:['agroforestry scenario comparison','portfolio comparison','production projections','carbon projections','reporting'],
    outputs:['Shared scenario framework','Stakeholder comparison','Landscape planning evidence','Multi-partner reporting structure'],
    flow:'Associations anchor the FarmTree workflow as common ground: shared scenario design, coordinated implementation and comparable review across members.'},
   {slug:'large-agri-corporates',short:'Large Agri-Corporates',title:'Large Agri-Corporates',
    value:'Connect agroforestry planning with supply-chain sustainability and farmer economics.',
    context:'Large agricultural companies need to compare agroforestry interventions across sourcing regions while understanding production, farmer value, carbon, water and implementation implications.',
    helps:[['Sourcing-region scenarios','Compare interventions across sourcing regions consistently.'],
           ['Farmer income & production','Project supplier and farmer outcomes next to volumes.'],
           ['Environmental indicators','Track carbon and water implications of sourcing decisions.'],
           ['Portfolio view','Roll regional scenarios up into portfolio-level comparisons.']],
    caps:['agroforestry scenario comparison','production projections','farmer income','carbon projections','hydrology','portfolio comparison','reporting'],
    outputs:['Sourcing-region scenario comparison','Supplier or farmer value projection','Sustainability programme evidence','Portfolio-level reporting input'],
    flow:'Corporate teams use the FarmTree workflow to move from sourcing-region planning to programme review, keeping farmer economics inside the sustainability case.'},
   {slug:'social-enterprise',short:'Social Enterprise',title:'Social Enterprise',
    value:'Evaluate farmer income and environmental outcomes within one agroforestry business model.',
    context:'Social enterprises need to demonstrate that an intervention can support farmer livelihoods while producing credible environmental and financial value.',
    helps:[['Farmer income first','Model farmer income as a first-class outcome of the business model.'],
           ['Costs, labour, revenue','Understand production, costs and labour requirements together.'],
           ['Environmental value','Track carbon and environmental indicators next to the economics.'],
           ['Long-term viability','Test the business model over long-term scenarios.']],
    caps:['farmer income','production projections','labour requirements','financial planning','carbon projections','long-term scenario modelling'],
    outputs:['Farmer business-case comparison','Long-term cash-flow projection','Impact scenario','Investment discussion material'],
    flow:'Social enterprises run the FarmTree workflow around the farmer business case — plan, pilot, review and refine with the same scenario logic.'},
   {slug:'implementation-organisations',short:'Implementation Organisations',title:'Implementation Organisations',
    value:'Turn field knowledge and operational plans into fundable, measurable agroforestry scenarios.',
    context:'Implementation teams understand local realities but need a structured way to translate field knowledge into plans, investment cases and reporting.',
    helps:[['Local definitions','Define baselines and interventions from real field knowledge.'],
           ['Field-data assumptions','Feed field data and species assumptions into the model.'],
           ['Scenario comparison','Compare implementation options before committing resources.'],
           ['Monitoring logic','Set up the projection logic that project monitoring reports against.']],
    caps:['agroforestry scenario comparison','production projections','farmer income','soil fertility','project monitoring','reporting'],
    outputs:['Implementation scenario','Field-informed farm plan','Projected project outcomes','Reporting input for funders and programme partners'],
    flow:'Implementation teams live in the middle of the FarmTree workflow — turning plans into field action and field learning back into better scenarios and reports.'}
  ];
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function page(d){
    var caps=d.caps.map(function(c){return '<li>'+esc(c)+'</li>';}).join('');
    var outs=d.outputs.map(function(o){return '<li>'+esc(o)+'</li>';}).join('');
    var cards=d.helps.map(function(h){return '<article><h3>'+esc(h[0])+'</h3><p>'+esc(h[1])+'</p></article>';}).join('');
    return '<section class="page" id="page-segment-'+d.slug+'">'
      +'<div class="ft-seg-hero"><div class="ft-seg-wrap">'
      +'<span class="ft-section-label ft-label-on-dark">Customer segment</span>'
      +'<h1>'+esc(d.title)+'</h1><p>'+esc(d.value)+'</p>'
      +'<div class="ft-seg-cta-row"><a class="cta-link" data-ft-action="request-demo" href="'+REG+'">Request a demo ↗</a>'
      +'<button type="button" class="cta-link secondary" data-ftmodal="request">Talk to FarmTree</button></div>'
      +'</div></div>'
      +'<div class="ft-seg-section"><div class="ft-seg-wrap"><span class="ft-section-label">Their decision context</span>'
      +'<h2>The decisions this work has to support</h2><p>'+esc(d.context)+'</p></div></div>'
      +'<div class="ft-seg-section alt"><div class="ft-seg-wrap"><span class="ft-section-label">How FarmTree helps</span>'
      +'<h2>Where FarmTree fits in</h2><div class="ft-seg-cards">'+cards+'</div></div></div>'
      +'<div class="ft-seg-section"><div class="ft-seg-wrap"><span class="ft-section-label">What they can work with</span>'
      +'<h2>FarmTree capability areas used by this segment</h2><ul class="ft-seg-chips">'+caps+'</ul></div></div>'
      +'<div class="ft-seg-section alt"><div class="ft-seg-wrap"><span class="ft-section-label">Typical outputs</span>'
      +'<h2>What this work typically produces</h2><ul class="ft-seg-outputs">'+outs+'</ul></div></div>'
      +'<div class="ft-seg-section"><div class="ft-seg-wrap"><span class="ft-section-label">Relevant workflow</span>'
      +'<h2>Connected to the FarmTree workflow</h2><p>'+esc(d.flow)+'</p></div></div>'
      +'<div class="ft-seg-final"><div class="ft-seg-wrap">'
      +'<h2>Ready to see it on your own case?</h2><p>Request a demo, or start a conversation with the FarmTree team about your context and evidence needs.</p>'
      +'<div class="ft-seg-cta-row"><a class="cta-link" data-ft-action="request-demo" href="'+REG+'">Request a demo ↗</a>'
      +'<button type="button" class="cta-link secondary" data-ftmodal="request">Talk to FarmTree</button></div>'
      +'</div></div>'
      +'</section>';
  }
  var main=document.querySelector('main');
  if(main){
    var html=S.map(page).join('');
    main.insertAdjacentHTML('beforeend', html);
  }
  window.FT_SEGMENTS = S.map(function(d){ return {slug:d.slug, short:d.short, title:d.title}; });
  /* document title per segment page (UI refresh on route change only) */
  function title(){
    var id=(location.hash||'').replace('#','');
    if(id==='case-studies'){ document.title='Case Studies | FarmTree'; return; }
    var m=id.match(/^segment-(.+)$/);
    if(!m) return;
    var seg=S.filter(function(x){return x.slug===m[1];})[0];
    if(seg) document.title=seg.title+' | FarmTree';
  }
  window.addEventListener('hashchange', title);
  window.addEventListener('ft:navigated', title);
  title();
})();

/* ---- block 3 ---- */
const state = { lang:'en', hero:0 };
const dict = {
  en: {
    navSolutions:'Solutions', navNews:'Track Record', contact:'Contact', readMore:'Read more here ↗',
    aboutHeadline:'FarmTree helps you design, implement and monitor agroforestry projects.'
  },
  nl: {
    navSolutions:'Oplossingen', navNews:'Track Record', contact:'Contact', readMore:'Lees meer ↗',
    aboutHeadline:'FarmTree helpt u agroforestry projecten te ontwerpen, implementeren en monitoren.'
  }
};
const heroes = [
  ['Agroforestry Intelligence', 'Make agroforestry measurable, investable and scalable.', 'FarmTree helps organisations turn agroforestry complexity into clearer project intelligence for planning, reporting and investment decisions.', '' + window.FT_ASSETS + '/case-giz_opt.webp', 'Agroforestry landscape planning — tree-based farming systems and landscape investment in Madagascar'],
  ['Science-Based Modelling', 'Turn Field Data into Investment Scenarios', 'Connect climate, soil, species, and project assumptions into clear science-backed projections.', '' + window.FT_ASSETS + '/case-acorn_opt.webp', 'Science-based carbon and agroforestry modelling — ACORN Rabobank smallholder portfolio'],
  ['Project Teams', 'Support Local Teams with Clearer Planning Tools', 'Help project staff compare agroforestry options, understand trade-offs, and communicate value with confidence.', '' + window.FT_ASSETS + '/embedded_027_opt.webp', 'Agroforestry field team training and support — local staff using FarmTree planning tools'],
  ['Impact Reporting', 'Report Carbon, Farmer Value and Long-Term Performance', 'Translate project results into clear reporting for investors, donors, MRV partners, and programme teams.', '' + window.FT_ASSETS + '/case-water_opt.webp', 'Landscape investment reporting — LOSO Nyando water, carbon and farmer value programme']
];
/* [router-consolidation 2026-07] removed: legacy setPage() + [data-page] click listener */
document.getElementById('openMenu').onclick=()=>{document.getElementById('mobileMenu').classList.add('open');setTimeout(()=>document.getElementById('closeMenu').focus(),60);};
document.getElementById('closeMenu').onclick=()=>{document.getElementById('mobileMenu').classList.remove('open');document.getElementById('openMenu').focus();};
/* Menu a11y (2026-07): Escape-to-close with focus return + focus trap while open */
document.addEventListener('keydown',function(e){
  var menu=document.getElementById('mobileMenu');
  if(!menu || !menu.classList.contains('open')) return;
  if(e.key==='Escape'){ menu.classList.remove('open'); var o=document.getElementById('openMenu'); if(o) o.focus(); return; }
  if(e.key==='Tab'){
    var f=menu.querySelectorAll('a[href],button:not([disabled])');
    if(!f.length) return;
    var first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  }
});
function setLang(lang) {
  state.lang=lang;
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const key=el.dataset.i18n; if(dict[lang][key]) el.textContent=dict[lang][key]; });
}
/* ── Hero carousel controller ─────────────────────────────── */
var ftHeroTimer = null;
var FT_HERO_DURATION = 5000;
var ftHeroTransitioning = false;

function ftHeroGo(idx, manualClick) {
  if (ftHeroTransitioning) return;
  var total = heroes.length;
  state.hero = ((idx % total) + total) % total;
  var h = heroes[state.hero];
  var img = document.getElementById('heroImg');
  var kicker = document.getElementById('heroKicker');
  var title = document.getElementById('heroTitle');
  var text = document.getElementById('heroText');
  var content = document.querySelector('.hero-content');

  ftHeroTransitioning = true;

  /* — Fade out image and text simultaneously — */
  if (img)     { img.style.transition = 'opacity 0.4s ease'; img.style.opacity = '0'; }
  if (content) { content.style.opacity = '0'; content.style.transform = 'translateY(12px)'; }

  setTimeout(function() {
    /* — Swap content while invisible — */
    if (img)    { img.src = h[3]; if (h[4]) img.alt = h[4]; }
    if (kicker) kicker.textContent = h[0];
    if (title)  title.textContent  = h[1];
    if (text)   text.textContent   = h[2];

    /* — Fade back in — */
    if (img)     { img.style.opacity = '0.86'; }
    if (content) { content.style.opacity = '1'; content.style.transform = 'translateY(0)'; }

    ftHeroTransitioning = false;
  }, 420);

  /* — Update dots + progress bars — */
  document.querySelectorAll('.hero-dot').forEach(function(dot, i) {
    var isActive = (i === state.hero);
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    var fill = dot.querySelector('.hero-dot-fill');
    if (!fill) return;
    /* Instantly reset bar width */
    fill.style.transition = 'none';
    fill.style.width = '0%';
    /* On next two frames, animate active dot to 100% over 5 s */
    if (isActive) {
      (function(f) {
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            f.style.transition = 'width ' + FT_HERO_DURATION + 'ms linear';
            f.style.width = '100%';
          });
        });
      })(fill);
    }
  });

  /* — Auto-rotation DISABLED: hero advances only on user interaction (arrows/dots). — */
  clearInterval(ftHeroTimer);
  ftHeroTimer = null;
}

/* Wire up prev/next arrows (still hidden but kept for keyboard extensibility) */
document.getElementById('nextHero').onclick = function() { ftHeroGo(state.hero + 1, true); };
document.getElementById('prevHero').onclick = function() { ftHeroGo(state.hero - 1, true); };

/* Wire up dot clicks */
document.querySelectorAll('.hero-dot').forEach(function(dot, i) {
  dot.onclick = function() { ftHeroGo(i, true); };
});

/* Kick off the first slide immediately (sets progress bar + starts timer) */
ftHeroGo(0, false);
document.getElementById('diagram').innerHTML = '<figure class="ft-simple-diagram" aria-label="FarmTree model system diagram"><img loading="lazy" decoding="async" src="' + window.FT_ASSETS + '/base-technology/home-ecosystem-current-brand.webp" alt="FarmTree model infographic showing site information, climate and terrain inputs, species database, impact monitoring and impact projection"></figure>';
setLang('en');

/* ---- block 4 ---- */
(function(){
  const translations = {"Solutions": "Oplossingen", "FarmTree Platform": "FarmTree Platform", "Track Record": "Track Record", "Contact": "Contact", "Home": "Home", "User Videos": "Gebruikersvideo’s", "Acknowledgements": "Dankwoord", "Licenses": "Licenties", "Team": "Team", "Vacancies": "Vacatures", "Contact us": "Neem contact op", "Request a demo": "Demo aanvragen", "FarmTree helps to": "FarmTree helpt bij", "Plan for and Report on Agroforestry Investments": "Agroforestry investeringen plannen en rapporteren", "Credible projections for environmental impact and farmer returns, built with specialised expertise, local data and scientific rigor.": "Betrouwbare prognoses voor milieu-impact en opbrengsten voor boeren, gebouwd met gespecialiseerde expertise, lokale data en wetenschappelijke nauwkeurigheid.", "FarmTree helps you design, implement and monitor agroforestry projects.": "FarmTree helpt u agroforestry projecten te ontwerpen, implementeren en monitoren.", "About FarmTree": "Over FarmTree", "+90 KPIs": "+90 KPI’s", "Key performance indicators directly linking carbon, finance, production, water, biodiversity and livelihoods.": "Prestatie-indicatoren die koolstof, financiën, productie, water, biodiversiteit en levensonderhoud direct met elkaar verbinden.", "50 years": "50 jaar", "Agroforestry scenario projections for long term planning, investment cases and de risking.": "Agroforestry scenarioprognoses voor langetermijnplanning, investeringscases en risicobeperking.", "+900": "+900", "Species and inputs in the CAFS database for local calibration and science backed modelling.": "Soorten en invoergegevens in de CAFS-database voor lokale kalibratie en wetenschappelijk onderbouwde modellering.", "Data backed impact": "Impact onderbouwd met data", "The FarmTree Platform": "Het FarmTree Platform", "The FarmTree Platform is a software model and online interface created to design agroforestry scenarios and project their impact on carbon, financial and environmental indicators.": "Het FarmTree Platform is een softwaremodel en online interface om agroforestry scenario’s te ontwerpen en hun impact op koolstof, financiële en milieugerelateerde indicatoren te projecteren.", "Learn more": "Meer informatie", "For project teams": "Voor projectteams", "Scale your agroforestry planning capability.": "Vergroot uw capaciteit voor agroforestry planning.", "FarmTree helps organisations move from expert led planning to project capture, staff training and independent platform operation.": "FarmTree helpt organisaties van expertgestuurde planning naar projectvastlegging, teamtraining en zelfstandig platformgebruik.", "Get started today": "Start vandaag", "Our ecosystem": "Ons ecosysteem", "Rethinking how agroforestry projects are planned and financed": "Opnieuw nadenken over hoe agroforestry projecten worden gepland en gefinancierd", "FarmTree connects investors, companies, implementors and farmers with scenario based data, helping teams build credible investment cases and monitor impact across landscapes.": "FarmTree verbindt investeerders, bedrijven, uitvoerders en boeren met scenario-gebaseerde data, zodat teams betrouwbare investeringscases kunnen bouwen en impact over landschappen kunnen monitoren.", "Why FarmTree?": "Waarom FarmTree?", "Growing better land decisions": "Betere beslissingen voor landgebruik", "Transparency": "Transparantie", "One information base for project design, monitoring and reporting.": "Eén informatiebasis voor projectontwerp, monitoring en rapportage.", "Livelihoods": "Levensonderhoud", "Model farmer income, labour needs, yields and long term value.": "Modelleer boereninkomen, arbeidsbehoefte, opbrengsten en langetermijnwaarde.", "Ecology": "Ecologie", "Estimate carbon, water, biodiversity, soil and erosion indicators.": "Schat indicatoren voor koolstof, water, biodiversiteit, bodem en erosie.", "Finance": "Financiën", "Translate complex agroforestry assumptions into investment ready narratives.": "Vertaal complexe agroforestry aannames naar investeringsklare verhalen.", "A long road ahead": "Een lange weg vooruit", "Deep roots in agroforestry transformation": "Diepe wortels in agroforestry transformatie", "FarmTree helps organisations move from farm level plans to landscape impact, portfolio scaling and evidence based communication with investors, farmers and partners.": "FarmTree helpt organisaties van plannen op boerderijniveau naar landschapsimpact, portfolioschaal en evidence-based communicatie met investeerders, boeren en partners.", "Learn more about us": "Meer over ons", "A software model and online interface for agroforestry scenarios": "Een softwaremodel en online interface voor agroforestry scenario’s", "Design agroforestry scenarios and project carbon, financial and environmental indicators for up to 50 years.": "Ontwerp agroforestry scenario’s en projecteer koolstof, financiële en milieugerelateerde indicatoren tot 50 jaar vooruit.", "Model methodology": "Modelmethodologie", "Carbon, Production & Finance, Environment and Landscape Tool": "Koolstof, Productie & Financiën, Milieu en Landschapstool", "The FarmTree model is composed of interconnected sub models simulating soil, nutrients, water, plant growth, production, carbon, labour and finance.": "Het FarmTree model bestaat uit verbonden submodellen die bodem, nutriënten, water, plantengroei, productie, koolstof, arbeid en financiën simuleren.", "Carbon": "Koolstof", "Biomass accumulation, carbon stock, Carbon Removal Units and carbon revenue by species.": "Biomassa-opbouw, koolstofvoorraad, Carbon Removal Units en koolstofopbrengsten per soort.", "Production & Finance": "Productie & Financiën", "Yields, production costs, revenues, cash flows, profitability and labour needs.": "Opbrengsten, productiekosten, omzet, cashflows, winstgevendheid en arbeidsbehoefte.", "Environment": "Milieu", "Water balance, soil organic matter, nutrient flows, erosion and biodiversity.": "Waterbalans, organische stof in de bodem, nutriëntenstromen, erosie en biodiversiteit.", "Landscape Tool": "Landschapstool", "Compare multiple project areas and portfolio wide performance.": "Vergelijk meerdere projectgebieden en prestaties op portfolioniveau.", "From expert led planning to independent operation": "Van expertgestuurde planning naar zelfstandige uitvoering", "Design & Understand": "Ontwerpen & Begrijpen", "We design credible farm plans and investment cases that de risk your project. What takes consultants months, you will generate in hours.": "Wij ontwerpen betrouwbare boerderijplannen en investeringscases die uw project minder risicovol maken. Wat consultants maanden kost, genereert u straks in uren.", "Learn & Capture": "Leren & Vastleggen", "Your staff learn to collect project data and operate FarmTree, while the team calibrates local species, prices and conditions.": "Uw team leert projectdata verzamelen en FarmTree gebruiken, terwijl ons team lokale soorten, prijzen en omstandigheden kalibreert.", "Operate & Scale": "Beheren & Opschalen", "Manage projections and monitoring across multiple projects, regions and countries with comparable impact metrics.": "Beheer prognoses en monitoring over meerdere projecten, regio’s en landen met vergelijkbare impactindicatoren.", "Our Track Record 2023 to 2026": "Onze Track Record 2023 tot 2026", "Active users": "Actieve gebruikers", "Active FarmTree Tool users.": "Actieve gebruikers van de FarmTree Tool.", "Projects": "Projecten", "Projects supported with FarmTree methods and modelling.": "Projecten ondersteund met FarmTree methoden en modellering.", "Regions": "Regio’s", "Agricultural regions impacted.": "Landbouwregio’s met impact.", "Regenerative cocoa planning with long term projections": "Regeneratieve cacaoplanning met langetermijnprognoses", "Shade tree density": "Dichtheid van schaduwbomen", "Compare shade systems and understand their effect on production and resilience.": "Vergelijk schaduwsystemen en begrijp hun effect op productie en veerkracht.", "Species mix": "Soortenmix", "Model tree combinations, cocoa systems and local conditions.": "Modelleer boomcombinaties, cacaosystemen en lokale omstandigheden.", "Farmer income": "Boereninkomen", "Understand how scenarios affect yields, costs and cash flow.": "Begrijp hoe scenario’s opbrengsten, kosten en cashflow beïnvloeden.", "Carbon insetting": "Koolstofinsetting", "Estimate long term carbon value within cocoa supply chains.": "Schat langetermijnwaarde van koolstof binnen cacao-toeleveringsketens.", "Learn to operate the FarmTree Platform": "Leer het FarmTree Platform gebruiken", "Guided learning for teams using FarmTree for team management, scenario analysis, multiplot workflows and dashboard reporting.": "Begeleide training voor teams die FarmTree gebruiken voor teambeheer, scenarioanalyse, multiplot workflows en dashboardrapportage.", "Team management": "Teambeheer", "Invite members, track roles and remove inactive users.": "Nodig leden uit, beheer rollen en verwijder inactieve gebruikers.", "Multiplot Tool": "Multiplot Tool", "Run and analyse hundreds of scenarios at once.": "Voer honderden scenario’s tegelijk uit en analyseer ze.", "Comparison Tool": "Vergelijkingstool", "Compare carbon, yields, water balance and revenues.": "Vergelijk koolstof, opbrengsten, waterbalans en inkomsten.", "Scenarios Page": "Scenariopagina", "Organise and manage agroforestry scenarios smoothly.": "Organiseer en beheer agroforestry scenario’s soepel.", "A Wageningen based team combining science, modelling and software": "Een team uit Wageningen dat wetenschap, modellering en software combineert", "Join us and help the world quantify trees": "Sluit u aan en help de wereld bomen te kwantificeren", "How can we help?": "Waarmee kunnen we helpen?", "FarmTree B.V.": "FarmTree B.V.", "Contact details": "Contactgegevens", "Contact us about anything related to our company or services. We will do our best to get back to you as soon as possible.": "Neem contact op over alles wat met ons bedrijf of onze diensten te maken heeft. Wij doen ons best om zo snel mogelijk te reageren.", "Open request form": "Open aanvraagformulier", "Contact Us": "Neem contact op", "Please fill in the fields below and submit your interest in FarmTree services or platform access.": "Vul de onderstaande velden in en geef uw interesse in FarmTree diensten of platformtoegang aan.", "Name *": "Naam *", "Email address *": "E-mailadres *", "Company name *": "Bedrijfsnaam *", "Job title": "Functietitel", "Mobile phone": "Mobiele telefoon", "Please share your company website": "Deel de website van uw bedrijf", "What are you interested in?": "Waar bent u in geïnteresseerd?", "Message": "Bericht", "Submit request": "Aanvraag verzenden", "Take action": "Onderneem actie", "Join us in growing better agroforestry decisions.": "Doe mee aan betere agroforestry beslissingen.", "Request a FarmTree demo ↗": "Vraag een FarmTree demo aan ↗", "About Us": "Over ons", "Platform": "Platform", "Copyright © 2026 FarmTree B.V. All rights reserved.": "Copyright © 2026 FarmTree B.V. Alle rechten voorbehouden."};
  let currentLang = 'en';
  const originals = new WeakMap();

  function walkTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && ['SCRIPT','STYLE'].includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let node;
    while(node = walker.nextNode()) nodes.push(node);
    return nodes;
  }

  function storeOriginals() {
    walkTextNodes(document.body).forEach(node => {
      if (!originals.has(node)) originals.set(node, node.nodeValue);
    });
    document.querySelectorAll('input, textarea').forEach(el => {
      if (!el.dataset.originalPlaceholder) el.dataset.originalPlaceholder = el.placeholder || '';
    });
  }

  function applyLanguage(lang) {
    storeOriginals();
    currentLang = lang;
    document.documentElement.lang = lang;
    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang.toUpperCase();

    walkTextNodes(document.body).forEach(node => {
      const original = originals.get(node);
      if (!original) return;
      const trimmed = original.trim();
      const prefix = original.match(/^\s*/)[0];
      const suffix = original.match(/\s*$/)[0];
      if (lang === 'nl' && translations[trimmed]) node.nodeValue = prefix + translations[trimmed] + suffix;
      if (lang === 'en') node.nodeValue = original;
    });

    const placeholderMap = {
      'Enter your name here':'Vul uw naam in',
      'Enter your email':'Vul uw e-mail in',
      'Start typing...':'Begin met typen...',
      'Enter number':'Vul telefoonnummer in',
      'Enter link':'Vul link in',
      'Tell us about your project':'Vertel ons over uw project'
    };
    document.querySelectorAll('input, textarea').forEach(el => {
      const orig = el.dataset.originalPlaceholder || '';
      el.placeholder = lang === 'nl' ? (placeholderMap[orig] || orig) : orig;
    });
  }

  window.applyFarmTreeLanguage = applyLanguage;

  document.addEventListener('DOMContentLoaded', () => {
    storeOriginals();
  });
})();

/* ---- block 5 ---- */
(function(){
  const dictionaries = {
    nl: {"Solutions": "Oplossingen", "FarmTree Platform": "FarmTree Platform", "Track Record": "Track Record", "Contact": "Contact", "Home": "Home", "User Videos": "Gebruikersvideo’s", "Acknowledgements": "Dankwoord", "Licenses": "Licenties", "Team": "Team", "Vacancies": "Vacatures", "Contact us": "Neem contact op", "Request a demo": "Demo aanvragen", "FarmTree helps to": "FarmTree helpt bij", "Plan for and Report on Agroforestry Investments": "Agroforestry investeringen plannen en rapporteren", "Credible projections for environmental impact and farmer returns, built with specialised expertise, local data and scientific rigor.": "Betrouwbare prognoses voor milieu-impact en opbrengsten voor boeren, gebouwd met gespecialiseerde expertise, lokale data en wetenschappelijke nauwkeurigheid.", "About FarmTree": "Over FarmTree", "+90 KPIs": "+90 KPI’s", "50 years": "50 jaar", "Data backed impact": "Impact onderbouwd met data", "The FarmTree Platform": "Het FarmTree Platform", "Learn more": "Meer informatie", "For project teams": "Voor projectteams", "Scale your agroforestry planning capability.": "Vergroot uw capaciteit voor agroforestry planning.", "Get started today": "Start vandaag", "Our ecosystem": "Ons ecosysteem", "Rethinking how agroforestry projects are planned and financed": "Opnieuw nadenken over hoe agroforestry projecten worden gepland en gefinancierd", "Why FarmTree?": "Waarom FarmTree?", "Growing better land decisions": "Betere beslissingen voor landgebruik", "Transparency": "Transparantie", "Livelihoods": "Levensonderhoud", "Ecology": "Ecologie", "Finance": "Financiën", "A long road ahead": "Een lange weg vooruit", "Deep roots in agroforestry transformation": "Diepe wortels in agroforestry transformatie", "Learn more about us": "Meer over ons", "Model methodology": "Modelmethodologie", "Design & Understand": "Ontwerpen & Begrijpen", "Learn & Capture": "Leren & Vastleggen", "Operate & Scale": "Beheren & Opschalen", "Our Track Record 2023 to 2026": "Onze Track Record 2023 tot 2026", "Active users": "Actieve gebruikers", "Projects": "Projecten", "Regions": "Regio’s", "A Wageningen based team combining science, modelling and software": "Een team uit Wageningen dat wetenschap, modellering en software combineert", "Join us and help the world quantify trees": "Sluit u aan en help de wereld bomen te kwantificeren", "How can we help?": "Waarmee kunnen we helpen?", "Contact details": "Contactgegevens", "Open request form": "Open aanvraagformulier", "Contact Us": "Neem contact op", "Name *": "Naam *", "Email address *": "E-mailadres *", "Company name *": "Bedrijfsnaam *", "Job title": "Functietitel", "Mobile phone": "Mobiele telefoon", "Please share your company website": "Deel de website van uw bedrijf", "What are you interested in?": "Waar bent u in geïnteresseerd?", "Message": "Bericht", "Submit request": "Aanvraag verzenden", "Take action": "Onderneem actie", "Join us in growing better agroforestry decisions.": "Doe mee aan betere agroforestry beslissingen.", "Request a FarmTree demo ↗": "Vraag een FarmTree demo aan ↗", "About Us": "Over ons", "Platform": "Platform", "Copyright © 2026 FarmTree B.V. All rights reserved.": "Copyright © 2026 FarmTree B.V. Alle rechten voorbehouden."},
    de: {"Solutions": "Lösungen", "FarmTree Platform": "FarmTree Plattform", "Track Record": "Track Record", "Contact": "Kontakt", "Home": "Startseite", "User Videos": "Nutzervideos", "Acknowledgements": "Danksagungen", "Licenses": "Lizenzen", "Team": "Team", "Vacancies": "Stellenangebote", "Contact us": "Kontaktieren Sie uns", "Request a demo": "Demo anfragen", "FarmTree helps to": "FarmTree unterstützt bei", "Plan for and Report on Agroforestry Investments": "Agroforstinvestitionen planen und darüber berichten", "Credible projections for environmental impact and farmer returns, built with specialised expertise, local data and scientific rigor.": "Zuverlässige Prognosen zur Umweltwirkung und zu Erträgen, aufgebaut auf spezialisierter Expertise, lokalen Daten und wissenschaftlicher Genauigkeit.", "About FarmTree": "Über FarmTree", "+90 KPIs": "+90 KPIs", "50 years": "50 Jahre", "Data backed impact": "Datengestützte Wirkung", "The FarmTree Platform": "Die FarmTree Plattform", "Learn more": "Mehr erfahren", "For project teams": "Für Projektteams", "Scale your agroforestry planning capability.": "Erweitern Sie Ihre Agroforst-Planungskapazitäten.", "Get started today": "Heute starten", "Our ecosystem": "Unser Ökosystem", "Rethinking how agroforestry projects are planned and financed": "Neu denken, wie Agroforstprojekte geplant und finanziert werden", "Why FarmTree?": "Warum FarmTree?", "Growing better land decisions": "Bessere Entscheidungen für Landnutzung", "Transparency": "Transparenz", "Livelihoods": "Lebensgrundlagen", "Ecology": "Ökologie", "Finance": "Finanzen", "A long road ahead": "Ein langer Weg liegt vor uns", "Deep roots in agroforestry transformation": "Tiefe Wurzeln in der Agroforst-Transformation", "Learn more about us": "Mehr über uns", "Model methodology": "Modellmethodik", "Design & Understand": "Entwerfen & Verstehen", "Learn & Capture": "Lernen & Erfassen", "Operate & Scale": "Betreiben & Skalieren", "Our Track Record 2023 to 2026": "Unser Track Record 2023 bis 2026", "Active users": "Aktive Nutzer", "Projects": "Projekte", "Regions": "Regionen", "A Wageningen based team combining science, modelling and software": "Ein Team aus Wageningen, das Wissenschaft, Modellierung und Software verbindet", "Join us and help the world quantify trees": "Arbeiten Sie mit und helfen Sie, Bäume weltweit zu quantifizieren", "How can we help?": "Wie können wir helfen?", "Contact details": "Kontaktdaten", "Open request form": "Anfrageformular öffnen", "Contact Us": "Kontaktieren Sie uns", "Name *": "Name *", "Email address *": "E-Mail-Adresse *", "Company name *": "Firmenname *", "Job title": "Berufsbezeichnung", "Mobile phone": "Mobiltelefon", "Please share your company website": "Bitte teilen Sie die Website Ihres Unternehmens", "What are you interested in?": "Woran sind Sie interessiert?", "Message": "Nachricht", "Submit request": "Anfrage senden", "Take action": "Jetzt handeln", "Join us in growing better agroforestry decisions.": "Machen Sie mit bei besseren Entscheidungen für Agroforst.", "Request a FarmTree demo ↗": "FarmTree-Demo anfragen ↗", "About Us": "Über uns", "Platform": "Plattform", "Copyright © 2026 FarmTree B.V. All rights reserved.": "Copyright © 2026 FarmTree B.V. Alle Rechte vorbehalten."}
  };
  const placeholders = {"nl": {"Enter your name here": "Vul uw naam in", "Enter your email": "Vul uw e-mail in", "Start typing...": "Begin met typen...", "Enter number": "Vul telefoonnummer in", "Enter link": "Vul link in", "Tell us about your project": "Vertel ons over uw project"}, "de": {"Enter your name here": "Geben Sie Ihren Namen ein", "Enter your email": "Geben Sie Ihre E-Mail ein", "Start typing...": "Beginnen Sie zu tippen...", "Enter number": "Telefonnummer eingeben", "Enter link": "Link eingeben", "Tell us about your project": "Erzählen Sie uns von Ihrem Projekt"}};
  let currentLang = 'en';
  const originals = new WeakMap();

  function walkTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && ['SCRIPT','STYLE'].includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    return nodes;
  }

  function captureOriginals() {
    walkTextNodes(document.body).forEach(node => {
      if (!originals.has(node)) originals.set(node, node.nodeValue);
    });
    document.querySelectorAll('input, textarea').forEach(el => {
      if (!el.dataset.originalPlaceholder) el.dataset.originalPlaceholder = el.placeholder || '';
    });
  }

  function translateText(lang, original) {
    if (lang === 'en') return original;
    const trimmed = original.trim();
    const dict = dictionaries[lang] || {};
    const translated = dict[trimmed];
    if (!translated) return original;
    const prefix = (original.match(/^\s*/) || [''])[0];
    const suffix = (original.match(/\s*$/) || [''])[0];
    return prefix + translated + suffix;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang.toUpperCase();

    walkTextNodes(document.body).forEach(node => {
      const original = originals.get(node);
      if (!original) return;
      node.nodeValue = translateText(lang, original);
    });

    document.querySelectorAll('input, textarea').forEach(el => {
      const originalPlaceholder = el.dataset.originalPlaceholder || '';
      if (lang === 'en') {
        el.placeholder = originalPlaceholder;
      } else {
        el.placeholder = (placeholders[lang] && placeholders[lang][originalPlaceholder]) || originalPlaceholder;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    captureOriginals();
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
    });
  });
})();

/* ---- block 6 ---- */
(function(){
  function markActive(lang){
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    var label = document.getElementById('langLabel');
    if(label) label.textContent = (lang || 'en').toUpperCase();
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.lang-option').forEach(function(btn){
      btn.addEventListener('click', function(){
        var lang = btn.dataset.lang;
        if (typeof window.applyFarmTreeLanguage === 'function') {
          window.applyFarmTreeLanguage(lang);
        } else if (typeof window.applyLanguage === 'function') {
          window.applyLanguage(lang);
        }
        document.documentElement.lang = lang;
        markActive(lang);
      });
    });
    markActive(document.documentElement.lang || 'en');
  });
})();

/* ---- block 7 ---- */
(function(){
  function updateLanguageUI(lang){
    var label = document.getElementById('langLabel');
    if(label) label.textContent = (lang || 'en').toUpperCase();

    document.querySelectorAll('.language-choice').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.language-choice').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();

        var lang = btn.dataset.lang || 'en';

        if (typeof window.applyFarmTreeLanguage === 'function') {
          window.applyFarmTreeLanguage(lang);
        }

        document.documentElement.lang = lang;
        updateLanguageUI(lang);
      });
    });

    updateLanguageUI(document.documentElement.lang || 'en');
  });
})();

/* ---- block 8 ---- */
(function(){
  const FT_LOGO_DATA = "";
  const ftTranslations = {
    en: {
      projectsCta: 'Learn more about our projects!',
      proofTitle: 'FarmTree Platform has been used to prepare Agroforestry investment plans by:',
      sdgTitle: 'The FarmTree Platform reports on different SDG indicators'
    },
    nl: {
      projectsCta: 'Lees meer over onze projecten!',
      proofTitle: 'Het FarmTree Platform is gebruikt om investeringsplannen voor agroforestry voor te bereiden voor:',
      sdgTitle: 'Het FarmTree Platform rapporteert over verschillende SDG-indicatoren'
    },
    de: {
      projectsCta: 'Mehr über unsere Projekte erfahren!',
      proofTitle: 'Die FarmTree Plattform wurde genutzt, um Investitionspläne für Agroforstwirtschaft vorzubereiten für:',
      sdgTitle: 'Die FarmTree Plattform berichtet über verschiedene SDG-Indikatoren'
    }
  };

  function createPartnerSection() {
    const home = document.getElementById('page-home');
    if (!home || home.querySelector('.ft-proof-section')) return;
    const target = home.querySelector('section.section.cream') || home.querySelector('.video-home') || home.lastElementChild;
    const section = document.createElement('section');
    section.className = 'section ft-proof-section';
    section.innerHTML = `
      <div class="container">
        <div class="ft-project-cta-row">
          <button type="button" class="outline-btn ft-project-cta" data-page="services" data-ft-i18n="projectsCta">Learn more about our projects!</button>
        </div>
        <h2 class="ft-proof-title" data-ft-i18n="proofTitle">FarmTree Platform has been used to prepare Agroforestry investment plans by:</h2>
        <div class="ft-marquee" aria-label="Selected partner logos">
          <div class="ft-marquee-track">
            ${partnerLogos()}
            ${partnerLogos()}
          </div>
        </div>
        <h3 class="ft-sdg-title" data-ft-i18n="sdgTitle">The FarmTree Platform reports on different SDG indicators</h3>
        <div class="ft-sdg-grid">
          <div class="ft-sdg-card sdg0 ft-reveal" style="transition-delay:.02s"><div class="ft-sdg-num">SDG</div><div class="ft-sdg-name">Sustainable<br>Development Goals</div><div class="ft-sdg-icon">◫</div></div>
          <div class="ft-sdg-card sdg1 ft-reveal" style="transition-delay:.10s"><div class="ft-sdg-num">1</div><div class="ft-sdg-name">No Poverty</div><div class="ft-sdg-icon">👪</div></div>
          <div class="ft-sdg-card sdg2 ft-reveal" style="transition-delay:.18s"><div class="ft-sdg-num">2</div><div class="ft-sdg-name">Zero Hunger</div><div class="ft-sdg-icon">☕</div></div>
          <div class="ft-sdg-card sdg6 ft-reveal" style="transition-delay:.26s"><div class="ft-sdg-num">6</div><div class="ft-sdg-name">Clean Water<br>and Sanitation</div><div class="ft-sdg-icon">💧</div></div>
          <div class="ft-sdg-card sdg10 ft-reveal" style="transition-delay:.34s"><div class="ft-sdg-num">10</div><div class="ft-sdg-name">Reduced<br>Inequalities</div><div class="ft-sdg-icon">⇄</div></div>
          <div class="ft-sdg-card sdg13 ft-reveal" style="transition-delay:.42s"><div class="ft-sdg-num">13</div><div class="ft-sdg-name">Climate Action</div><div class="ft-sdg-icon">🌍</div></div>
          <div class="ft-sdg-card sdg15 ft-reveal" style="transition-delay:.50s"><div class="ft-sdg-num">15</div><div class="ft-sdg-name">Life on Land</div><div class="ft-sdg-icon">🌳</div></div>
        </div>
      </div>`;
    if (target && target.parentNode) target.parentNode.insertBefore(section, target);
    else home.appendChild(section);
  }

  function partnerLogos() {
    return `
      <div class="ft-logo-card ft-cgiar"><div class="ft-logo-inner"><div class="ft-mark-circle">✿</div><div><div class="ft-logo-word">CGIAR</div></div></div></div>
      <div class="ft-logo-card ft-rabo"><div class="ft-logo-inner"><div class="ft-mark-circle">◔</div><div><div class="ft-logo-word">Rabobank</div></div></div></div>
      <div class="ft-logo-card ft-fao"><div class="ft-logo-inner"><div class="ft-mark-circle">FAO</div><div><div class="ft-logo-word">FAO</div><div class="ft-logo-sub">FIAT PANIS</div></div></div></div>
      <div class="ft-logo-card ft-catie"><div class="ft-logo-inner"><div class="ft-mark-circle">◜</div><div><div class="ft-logo-word">CATIE</div><div class="ft-logo-sub">Sustainable rural development</div></div></div></div>
      <div class="ft-logo-card ft-giz"><div class="ft-logo-inner"><div class="ft-mark-circle">g</div><div><div class="ft-logo-word">giz</div><div class="ft-logo-sub">Deutsche Gesellschaft für Internationale Zusammenarbeit</div></div></div></div>
      <div class="ft-logo-card ft-helv"><div class="ft-logo-inner"><div class="ft-mark-circle">✦</div><div><div class="ft-logo-word">HELVETAS</div><div class="ft-logo-sub">Swiss Intercooperation</div></div></div></div>`;
  }

  function renderDiagramV3() {
    const el = document.getElementById('diagram');
    if (!el) return;
    el.innerHTML = `
<svg viewBox="0 0 1480 620" aria-label="FarmTree ecosystem diagram">
  <defs>
    <linearGradient id="ftTubeL" x1="0" x2="1"><stop offset="0%" stop-color="#79BF6C"/><stop offset="100%" stop-color="#9BD386"/></linearGradient>
    <linearGradient id="ftTubeR" x1="0" x2="1"><stop offset="0%" stop-color="#A2D68B"/><stop offset="100%" stop-color="#4D9B4C"/></linearGradient>
    <style>
      .ft-node-title { font: 900 15px Inter, Arial, sans-serif; fill:#173428; letter-spacing:.02em; }
      .ft-node-sub { font: 500 10.5px Inter, Arial, sans-serif; fill:#173428; }
      .ft-pill-text { font: 700 10.5px Inter, Arial, sans-serif; fill:#173428; }
      .ft-side { font: 800 12px Inter, Arial, sans-serif; fill:#173428; }
      .ft-project-title { font: 900 16px Inter, Arial, sans-serif; fill:#173428; letter-spacing:.02em; }
      .ft-project-sub { font: 500 10.5px Inter, Arial, sans-serif; fill:#173428; }
    </style>
  </defs>

  <!-- Circle 3 background -->
  <circle cx="1008" cy="250" r="184" fill="#9CCF88" opacity=".96"/>
  <circle cx="1008" cy="250" r="174" fill="none" stroke="#B8DBA8" stroke-width="8"/>
  <circle cx="1008" cy="250" r="116" fill="none" stroke="#FFFFFF" stroke-width="5"/>

  <!-- tree icons positioned fully inside green circle -->
  <g opacity=".18">
    ${tree(900,145)}${tree(972,120)}${tree(1050,120)}${tree(1118,146)}
    ${tree(1140,232)}${tree(1115,336)}${tree(1048,390)}${tree(968,396)}
    ${tree(897,350)}${tree(870,252)}
  </g>

  <!-- connectors -->
  <path d="M268 250 C350 250 378 218 430 218 L454 218 C488 218 505 250 542 250 C505 250 488 282 454 282 L430 282 C378 282 350 250 268 250Z" fill="url("${window.FT_ASSETS}/embedded_053_opt.webp")"/>
  <path d="M606 250 C702 250 735 218 815 218 L840 218 C880 218 900 250 942 250 C900 250 880 282 840 282 L815 282 C735 282 702 250 606 250Z" fill="url("${window.FT_ASSETS}/embedded_054_opt.webp")"/>

  <!-- Circle 1 -->
  <circle cx="180" cy="250" r="74" fill="none" stroke="#A8D99F" stroke-width="8"/>
  <circle cx="180" cy="250" r="64" fill="#FFFFFF" stroke="#73BA6A" stroke-width="10"/>
  <g transform="translate(180 215)" fill="none" stroke="#8E8E8E" stroke-width="2.8">
    <rect x="-16" y="0" width="12" height="28"/>
    <rect x="0" y="-10" width="12" height="38"/>
    <rect x="16" y="4" width="12" height="24"/>
    <rect x="27" y="-7" width="8" height="8"/>
  </g>
  <text x="180" y="262" text-anchor="middle" class="ft-node-title">INVESTORS</text>
  <text x="180" y="284" text-anchor="middle" class="ft-node-sub">buyers &amp; funds</text>

  <!-- Circle 2 -->
  <circle cx="525" cy="250" r="68" fill="none" stroke="#A8D99F" stroke-width="8"/>
  <circle cx="525" cy="250" r="58" fill="#FFFFFF" stroke="#73BA6A" stroke-width="10"/>
  <image href="${FT_LOGO_DATA}" x="470" y="228" width="110" height="44" preserveAspectRatio="xMidYMid meet"/>

  <!-- left labels -->
  <path d="M305 223 h132 l14 13 l-14 13 h-132 a13 13 0 0 1 0 -26z" fill="#FFFFFF"/>
  <path d="M322 270 h115 l14 13 l-14 13 h-115 a13 13 0 0 1 0 -26z" fill="#FFFFFF"/>
  <text x="371" y="239" text-anchor="middle" class="ft-pill-text">Payments per t aCO₂e</text>
  <text x="376" y="286" text-anchor="middle" class="ft-pill-text">Traceable t aCO₂e</text>

  <!-- right labels -->
  <path d="M660 205 h165 l16 15 l-16 15 h-165 a15 15 0 0 1 0 -30z" fill="#FFFFFF"/>
  <path d="M646 250 h179 l16 15 l-16 15 h-179 a15 15 0 0 1 0 -30z" fill="#FFFFFF"/>
  <path d="M685 294 h140 l16 15 l-16 15 h-140 a15 15 0 0 1 0 -30z" fill="#FFFFFF"/>
  <path d="M668 339 h157 l16 15 l-16 15 h-157 a15 15 0 0 1 0 -30z" fill="#FFFFFF"/>
  <text x="742" y="224" text-anchor="middle" class="ft-pill-text">Payments per t aCO₂e</text>
  <text x="734" y="269" text-anchor="middle" class="ft-pill-text">Software as a Service</text>
  <text x="755" y="313" text-anchor="middle" class="ft-pill-text">Real Data</text>
  <text x="748" y="358" text-anchor="middle" class="ft-pill-text">C-Sink t aCO₂e</text>

  <!-- project center -->
  <circle cx="1008" cy="250" r="86" fill="none" stroke="#356F38" stroke-width="11" opacity=".65"/>
  <circle cx="1008" cy="250" r="68" fill="#FFFFFF" stroke="#2E7B3F" stroke-width="14"/>
  <text x="1008" y="245" text-anchor="middle" class="ft-project-title">PROJECTS</text>
  <text x="1008" y="268" text-anchor="middle" class="ft-project-sub">farms &amp; landscapes</text>

  <!-- right outcome nodes -->
  <circle cx="1290" cy="146" r="27" fill="#FFFFFF" stroke="#66AE5D" stroke-width="5"/>
  <text x="1290" y="152" text-anchor="middle" style="font:500 13px Inter, Arial, sans-serif; fill:#173428">CO₂</text>
  <text x="1324" y="150" class="ft-side">CARBON</text>

  <circle cx="1318" cy="248" r="27" fill="#FFFFFF" stroke="#66AE5D" stroke-width="5"/>
  <text x="1318" y="256" text-anchor="middle" style="font:600 23px Inter, Arial, sans-serif; fill:#173428">€</text>
  <text x="1352" y="252" class="ft-side">FINANCE</text>

  <circle cx="1298" cy="388" r="27" fill="#FFFFFF" stroke="#66AE5D" stroke-width="5"/>
  <text x="1298" y="396" text-anchor="middle" style="font:600 18px Inter, Arial, sans-serif; fill:#173428">≋</text>
  <text x="1332" y="392" class="ft-side">HYDROLOGY</text>

  <circle cx="1240" cy="480" r="27" fill="#FFFFFF" stroke="#66AE5D" stroke-width="5"/>
  <text x="1240" y="488" text-anchor="middle" style="font:600 14px Inter, Arial, sans-serif; fill:#173428">♧</text>
  <text x="1276" y="484" class="ft-side">BIODIVERSITY</text>
</svg>`;
  }

  function tree(x,y) {
    return `<g transform="translate(${x} ${y})"><path d="M0 10 L0 44" stroke="#2E7B3F" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="0" r="10" fill="#4F994C"/><circle cx="-8" cy="8" r="8" fill="#4F994C"/><circle cx="8" cy="8" r="8" fill="#4F994C"/></g>`;
  }

  function activateSdgAnimations() {
    const items = document.querySelectorAll('.ft-reveal');
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold: .24 });
    items.forEach(item => io.observe(item));
  }

  function setupStableLangHover() {
    const switcher = document.querySelector('.lang-switcher');
    if (!switcher) return;
    const panel = switcher.querySelector('.lang-panel');
    const toggle = switcher.querySelector('.lang-toggle');
    if (!panel || !toggle) return;
    let timer = null;
    const open = () => { clearTimeout(timer); switcher.classList.add('ft-open'); toggle.setAttribute('aria-expanded', 'true'); };
    const close = () => { clearTimeout(timer); timer = setTimeout(() => { switcher.classList.remove('ft-open'); toggle.setAttribute('aria-expanded', 'false'); }, 260); };
    ['mouseenter','focusin'].forEach(evt => switcher.addEventListener(evt, open));
    switcher.addEventListener('mouseleave', close);
    panel.addEventListener('mouseenter', open);
    panel.addEventListener('mouseleave', close);
    toggle.addEventListener('mouseenter', open);
    document.addEventListener('click', function(e) { if (!switcher.contains(e.target)) close(); });
  }

  function applyFtTranslations(lang) {
    const chosen = ftTranslations[lang] ? lang : 'en';
    document.querySelectorAll('[data-ft-i18n]').forEach(el => {
      const key = el.getAttribute('data-ft-i18n');
      if (ftTranslations[chosen][key]) el.textContent = ftTranslations[chosen][key];
    });
  }

  function syncLangBindings() {
    const current = document.documentElement.lang || 'en';
    applyFtTranslations(current);
    document.querySelectorAll('.lang-option, .language-choice').forEach(btn => {
      if (btn.dataset.ftBound) return;
      btn.dataset.ftBound = '1';
      btn.addEventListener('click', function() {
        const lang = this.dataset.lang || 'en';
        setTimeout(() => applyFtTranslations(lang), 0);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    createPartnerSection();
    // renderDiagramV3 disabled: simple static image requested.
    activateSdgAnimations();
    setupStableLangHover();
    syncLangBindings();
  });
})();

/* ---- block 9 ---- */
document.addEventListener('DOMContentLoaded', function () {
  const observer = new MutationObserver(function () {
    const possibleCards = document.querySelectorAll('.menu-overlay > div > div, .menu-panel > div > div, .mega-menu > div > div');
    possibleCards.forEach(function(card, index) {
      if (!card.classList.contains('menu-card') && card.querySelector('button, a')) {
        card.classList.add('menu-card');
        card.style.animationDelay = (0.04 + index * 0.06) + 's';
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

/* ---- block 10 ---- */
document.addEventListener('DOMContentLoaded', function () {
  const menu = document.getElementById('mobileMenu');
  const openBtn = document.getElementById('openMenu');

  function restartMenuAnimation() {
    if (!menu) return;
    const cards = menu.querySelectorAll('.mobile-card');
    cards.forEach(function(card) {
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = '';
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', function () {
      setTimeout(restartMenuAnimation, 20);
    });
  }
});

/* ---- block 11 ---- */
(function(){
  const originalSetLanguage = window.setLanguage;
  window.setLanguage = function(lang){
    if (typeof originalSetLanguage === "function") {
      originalSetLanguage(lang);
    }
    document.querySelectorAll("[data-i18n-en]").forEach(function(el){
      const value = el.getAttribute("data-i18n-" + lang);
      if (value) el.textContent = value;
    });
  };
})();

/* ---- block 12 ---- */
(function(){
  function initFarmTreeFAQ(){
    document.querySelectorAll(".ft-faq-item .ft-faq-question").forEach(function(btn){
      if (btn.dataset.ftFaqReady === "1") return;
      btn.dataset.ftFaqReady = "1";
      btn.addEventListener("click", function(){
        const item = btn.closest(".ft-faq-item");
        const list = btn.closest(".ft-faq-list");
        if (!item || !list) return;
        list.querySelectorAll(".ft-faq-item").forEach(function(other){
          if (other !== item) other.classList.remove("is-open");
        });
        item.classList.toggle("is-open");
      });
    });
  }

  initFarmTreeFAQ();
  document.addEventListener("DOMContentLoaded", initFarmTreeFAQ);

  const originalSetLanguage = window.setLanguage;
  window.setLanguage = function(lang){
    if (typeof originalSetLanguage === "function") {
      originalSetLanguage(lang);
    }
    document.querySelectorAll("[data-i18n-en]").forEach(function(el){
      const value = el.getAttribute("data-i18n-" + lang);
      if (value) el.textContent = value;
    });
  };
})();

/* ---- block 13 ---- */
(function(){
  function initFaqV4(){
    var acc = document.getElementById('ftFaqAccordion');
    if(!acc) return;
    acc.querySelectorAll('article').forEach(function(item){
      if(item.dataset.faqV4) return;
      item.dataset.faqV4 = '1';
      var q = item.querySelector('.ft-faq-q');
      if(!q) return;
      q.addEventListener('click', function(){
        var isOpen = item.classList.contains('ft-open');
        acc.querySelectorAll('article').forEach(function(other){ other.classList.remove('ft-open'); });
        if(!isOpen) item.classList.add('ft-open');
      });
    });
  }
  initFaqV4();
  document.addEventListener('DOMContentLoaded', initFaqV4);
})();

/* ---- block 14 ---- */
(function(){
  function initWorkflow(){
    const section = document.querySelector('.ft-workflow-section');
    if(!section) return;
    const tabs = section.querySelectorAll('.ft-workflow-tab');
    const card = section.querySelector('.ft-workflow-card');
    const icon = section.querySelector('.ft-workflow-icon');
    const number = section.querySelector('.ft-workflow-number');
    const title = section.querySelector('.ft-workflow-card h3');
    const text = section.querySelector('.ft-workflow-card p');

    const steps = [
      {
        n:'01',
        icon:'FT',
        title:'Define project scope',
        text:'Set location, objectives, species assumptions, financial settings and project parameters before modelling starts.'
      },
      {
        n:'02',
        icon:'AM',
        title:'Build agroforestry model',
        text:'Translate trees, crops, labour, inputs and climate assumptions into a scenario model that is easy to compare.'
      },
      {
        n:'03',
        icon:'IS',
        title:'Run impact scenarios',
        text:'Compare carbon, biodiversity, hydrology, farmer income and long term landscape value across alternatives.'
      },
      {
        n:'04',
        icon:'GR',
        title:'Generate reports',
        text:'Turn model outputs into clear narratives for investors, donors, project partners and internal decision makers.'
      }
    ];

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const s = steps[idx];
        card.dataset.step = String(idx + 1);
        icon.textContent = s.icon;
        number.textContent = s.n;
        title.textContent = s.title;
        text.textContent = s.text;
      });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initWorkflow);
  }else{
    initWorkflow();
  }
})();

/* ---- block 15 ---- */
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const menu = document.querySelector('.mobile-menu-grid');
    if(menu && !menu.querySelector('[data-page="investors"]')){
      menu.insertAdjacentHTML('beforeend', '<div class="mobile-card"><h4>Use cases</h4><button type="button" data-page="investors">Investors</button><button type="button" data-page="dfi">DFIs & donors</button><button type="button" data-page="ngos">NGOs & implementers</button></div><div class="mobile-card"><h4>Proof & commercial</h4><button type="button" data-page="case-giz">GIZ / Madagascar</button><button type="button" data-page="case-acorn">ACORN / Rabobank</button><button type="button" data-page="pricing">Pricing</button></div>');
    }
    const heroContent = document.querySelector('#page-home .hero-content') || document.querySelector('#page-home .hero .container') || document.querySelector('#page-home .hero-text');
    if(heroContent && !heroContent.querySelector('.ft-buyer-ctas')){
      heroContent.insertAdjacentHTML('beforeend','<div class="ft-buyer-ctas"><button type="button" data-page="investors">For investors</button><button type="button" data-page="ngos">For implementers</button><a data-ft-action="request-demo" href="https://tool.farmtree.earth/Identity/Account/Register">Request a demo</a></div>');
    }
    const h1 = document.querySelector('#page-home .hero h1');
    if(h1){ h1.style.fontSize = 'clamp(56px,8.5vw,116px)'; h1.style.letterSpacing='-.07em'; }
    const nav = document.querySelector('.nav');
    if(nav && !nav.querySelector('[data-page="investors"]')){
      const btn = document.createElement('button'); btn.className='nav-item'; btn.dataset.page='investors'; btn.textContent='Investors'; nav.insertBefore(btn, nav.firstElementChild?.nextSibling || null);
    }
  });
})();

/* ---- block 16 ---- */
(function(){
  function go(page){
    const el = document.querySelector('[data-page="'+page+'"]');
    if(el){ el.click(); return; }
    if(typeof window.setPage === 'function') window.setPage(page);
  }
  function initCounters(){
    const metrics = document.querySelectorAll('.ft-proof-metric');
    const parse = txt => {
      const m = String(txt).match(/^(\d+)(.*)$/);
      return m ? {n:+m[1], suffix:m[2]} : null;
    };
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting || entry.target.dataset.done) return;
        entry.target.dataset.done='1';
        entry.target.classList.add('is-counting');
        const strong = entry.target.querySelector('strong');
        const info = parse(strong.textContent.trim());
        if(!info){ setTimeout(()=>entry.target.classList.remove('is-counting'),900); return; }
        let start=null, dur=1100;
        function tick(ts){
          if(!start) start=ts;
          const p=Math.min((ts-start)/dur,1);
          strong.textContent = Math.round(info.n*p)+info.suffix;
          if(p<1) requestAnimationFrame(tick); else setTimeout(()=>entry.target.classList.remove('is-counting'),350);
        }
        strong.textContent='0'+info.suffix;
        requestAnimationFrame(tick);
      });
    },{threshold:.35});
    metrics.forEach(m=>obs.observe(m));
  }
  function replacePartners(){
    const track=document.querySelector('#frank-partners .ft-partner-track');
    if(!track || track.dataset.logoReady) return;
    track.dataset.logoReady='1';
    const logos=[
      ['Rabobank','' + window.FT_ASSETS + '/logo-rabobank.png','case-acorn'],
      ['FAO','' + window.FT_ASSETS + '/logo-fao.png','platform'],
      ['CATIE','' + window.FT_ASSETS + '/logo-catie.png','case-cocoa'],
      ['GIZ','' + window.FT_ASSETS + '/logo-giz.png','case-giz'],
      ['HELVETAS','' + window.FT_ASSETS + '/logo-helvetas.png','case-nyando'],
      ['CGIAR','' + window.FT_ASSETS + '/logo-cgiar.png','track']
    ];
    const html = logos.concat(logos).map(([alt,src,page])=>`<div class="ft-partner-logo" data-page="${page}"><img loading="lazy" decoding="async" src="${src}" alt="${alt}"></div>`).join('');
    track.innerHTML=html;
  }
  function addClickableCards(){
    const cards=[...document.querySelectorAll('.cards .card')];
    ['solutions','platform','track','request'].forEach((page,i)=>{ if(cards[i]) cards[i].setAttribute('data-page',page); });
    document.querySelectorAll('.ft-case-card').forEach((card,i)=>{
      const pages=['case-giz','case-acorn','case-cocoa','case-nyando'];
      card.setAttribute('data-page',pages[i]||'track');
    });
    document.querySelectorAll('.ft-photo-tile').forEach((tile,i)=>{
      const pages=['case-cocoa','case-nyando','case-giz','case-acorn'];
      tile.setAttribute('data-page',pages[i%pages.length]);
    });
    document.querySelectorAll('.ft-buyer-card').forEach((card,i)=>{
      const pages=['investors','donors','implementers','services','request','services'];
      card.setAttribute('data-page',pages[i]||'request');
    });
    document.querySelectorAll('.footer a,.footer button').forEach(el=>{
      /* CTA hardening 2026-07: never touch native external anchors or
         data-ft-action controls — their navigation is native-only. The
         'platform' text-mapping is removed (footer FarmTree Platform is a
         native Login anchor). */
      if(el.hasAttribute('href') || el.hasAttribute('data-ft-action')) return;
      if(!el.dataset.page){
        const t=el.textContent.toLowerCase();
        if(t.includes('team')) el.dataset.page='team';
        else if(t.includes('vacanc')) el.dataset.page='vacancies';
        else if(t.includes('contact')) el.dataset.page='request';
        else if(t.includes('video')) el.dataset.page='videos';
        else if(t.includes('acknow')) el.dataset.page='acknowledgements';
        else if(t.includes('license')) el.dataset.page='licenses';
      }
    });
  }
  document.addEventListener('DOMContentLoaded',function(){initCounters();replacePartners();addClickableCards();});
})();

/* ---- block 17 ---- */
(function(){
  const logoMap=["" + window.FT_ASSETS + "/embedded_055.png","" + window.FT_ASSETS + "/embedded_056.png","" + window.FT_ASSETS + "/embedded_057.png","" + window.FT_ASSETS + "/embedded_058.png","" + window.FT_ASSETS + "/embedded_059.png","" + window.FT_ASSETS + "/embedded_060.png"];
  const names=['GIZ','HELVETAS','CGIAR','Rabobank','FAO','CATIE'];
  document.querySelectorAll('.ft-partner-logo').forEach((el,i)=>{
    const img=document.createElement('img'); img.src=logoMap[i%logoMap.length]; img.alt=names[i%names.length];
    el.textContent=''; el.appendChild(img);
  });
  document.querySelectorAll('.logo-btn,.logo-wrap,.footer-logo').forEach(el=>{
    el.addEventListener('click',()=>{ const home=document.querySelector('[data-page="home"]'); if(home) home.click(); else window.scrollTo({top:0,behavior:'smooth'}); });
  });
  document.querySelectorAll('.ft-usecase-card,.ft-phase-card,.ft-case-card').forEach(card=>{
    card.addEventListener('click',e=>{ if(e.target.closest('button')) return; const b=card.querySelector('button[data-page]'); if(b) b.click(); });
  });
  const counters=[...document.querySelectorAll('.metric h3,.ft-proof-metric strong')];
  const parse=(txt)=>{ const m=txt.match(/\d+/); return m?parseInt(m[0],10):null; };
  counters.forEach(el=>{ if(el.closest('[data-ft-static]')) return; /* static stat cards (About track record) are exact values, not animated */ const raw=el.textContent.trim(); const n=parse(raw); if(!n) return; el.dataset.final=raw; el.dataset.num=n; el.textContent=raw.replace(/\d+/, '0'); });
  const animateCounter=(el)=>{
    if(el.dataset.done) return; el.dataset.done='1';
    const final=el.dataset.final, n=parseInt(el.dataset.num,10);
    /* Guard: only elements initialised above (digit-bearing, dataset.num/final
       set) may animate. Non-numeric counters (e.g. "Science-based", "MRV")
       keep their static text — previously this path threw
       "Cannot read properties of undefined (reading 'replace')". */
    if(final===undefined || isNaN(n)) return;
    let start=null; const dur=1100;
    function tick(ts){ if(!start) start=ts; const p=Math.min((ts-start)/dur,1); const v=Math.round(n*(1-Math.pow(1-p,3))); el.textContent=final.replace(/\d+/, v); if(p<1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  };
  const io=new IntersectionObserver(entries=>entries.forEach(en=>{ if(en.isIntersecting) animateCounter(en.target); }),{threshold:.35});
  /* Observe only counters this script initialised (element-existence guard) */
  counters.forEach(el=>{ if(el.dataset.num) io.observe(el); });
  // Make hero slides use real project photos and keep layout clean without green blob.
  const heroImgs=["" + window.FT_ASSETS + "/embedded_061.webp","" + window.FT_ASSETS + "/embedded_062.webp"];
  let heroIndex=0; const img=document.querySelector('.hero-img'); const dots=[...document.querySelectorAll('.hero-dot')];
  if(img){
    const setHero=(i)=>{heroIndex=(i+heroImgs.length)%heroImgs.length; img.src=heroImgs[heroIndex]; dots.forEach((d,k)=>d.classList.toggle('active',k===heroIndex));};
    dots.forEach((d,i)=>d.addEventListener('click',()=>setHero(i)));
    const next=document.getElementById('nextHero'), prev=document.getElementById('prevHero');
    if(next) next.addEventListener('click',()=>setHero(heroIndex+1)); if(prev) prev.addEventListener('click',()=>setHero(heroIndex-1));
    /* setHero(0) init removed (perf 2.5): it transiently swapped the hero to
       embedded_061.webp before the primary controller restored the approved
       slide-1 image — a wasted 144KB download on every load. Manual arrow/dot
       behavior is unchanged. */
    /* Auto-advance DISABLED: hero changes only on user interaction (arrows/dots). */
  }
})();

/* ---- block 18 ---- */
(function(){
  const LOGOS = {
'Rabobank':'' + window.FT_ASSETS + '/embedded_064.png',
'FAO':'' + window.FT_ASSETS + '/embedded_065.png',
'HELVETAS':'' + window.FT_ASSETS + '/embedded_066.png',
'CATIE':'' + window.FT_ASSETS + '/embedded_067.png',
'GIZ':'' + window.FT_ASSETS + '/embedded_068.png',
'CGIAR':'' + window.FT_ASSETS + '/embedded_069.png',
'FarmTree':'' + window.FT_ASSETS + '/embedded_070.png'
};
  const replacementPhoto = '' + window.FT_ASSETS + '/embedded_071_opt.webp';
  function setTextLogo(box,name){
    box.innerHTML = '<span class="logo-text">'+name+'</span>';
  }
  function fixPartners(){
    const track=document.querySelector('#frank-partners .ft-partner-track');
    if(!track) return;
    const items=[
      ['Rabobank', LOGOS.Rabobank, 'case-acorn'],
      ['FAO', LOGOS.FAO, 'platform'],
      ['CATIE', LOGOS.CATIE, 'case-cocoa'],
      ['GIZ', LOGOS.GIZ, 'case-giz'],
      ['HELVETAS', LOGOS.HELVETAS, 'case-nyando'],
      ['CGIAR', LOGOS.CGIAR, 'track']
    ];
    track.innerHTML = items.concat(items).map(([name,src,page]) => {
      if(src) return '<div class="ft-partner-logo" data-page="'+page+'"><img loading="lazy" decoding="async" src="'+src+'" alt="'+name+'"></div>';
      return '<div class="ft-partner-logo" data-page="'+page+'"><span class="logo-text">'+name+'</span></div>';
    }).join('');
  }
  function fixFooterLogo(){
    const footerLogo=document.querySelector('.footer-logo');
    if(!footerLogo) return;
    /* Official brand logo now ships in the static markup as a responsive
       <picture> (assets/brand/*). Do not overwrite it here. */
    footerLogo.setAttribute('data-page','home');
  }
  function fixCounterValues(){
    const values=['50 yrs','4','3','MRV'];
    const metrics=[...document.querySelectorAll('#frank-phase-journey .ft-proof-metric strong')];
    metrics.forEach((el,i)=>{el.dataset.final=values[i]||el.textContent.trim(); if(i<3) el.textContent='0'+(i===0?' yrs':'');});
    function animate(el, final){
      if(el.dataset.finished==='1') return;
      el.dataset.finished='1';
      const m=final.match(/^(\d+)(.*)$/);
      if(!m){el.textContent=final; return;}
      const n=+m[1], suffix=m[2]||'';
      const card=el.closest('.ft-proof-metric');
      if(card) card.classList.add('is-counting');
      let start=null, dur=1250;
      function tick(ts){
        if(!start) start=ts;
        const p=Math.min((ts-start)/dur,1);
        const eased=1-Math.pow(1-p,3);
        el.textContent=Math.round(n*eased)+suffix;
        if(p<1) requestAnimationFrame(tick); else {el.textContent=final; if(card) setTimeout(()=>card.classList.remove('is-counting'),300);}
      }
      requestAnimationFrame(tick);
    }
    const runVisible=()=>metrics.forEach(el=>{ const r=el.getBoundingClientRect(); if(r.top<innerHeight && r.bottom>0) animate(el, el.dataset.final); });
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting) animate(e.target, e.target.dataset.final)}),{threshold:.15});
      metrics.forEach(el=>io.observe(el));
    }
    window.addEventListener('scroll',runVisible,{passive:true});
    setTimeout(runVisible,350);
  }
  function replaceProjectImage(){
    if(!replacementPhoto) return;
    const img=document.querySelector('.split-feature.reverse .feature-image img');
    if(img){ img.src=replacementPhoto; img.removeAttribute('srcset'); }
  }
  function fixPhotoTiles(){
    document.querySelectorAll('.ft-photo-tile').forEach(tile=>{
      const img=tile.querySelector('img');
      if(img){ img.style.display='block'; img.onerror=null; }
    });
  }
  function run(){fixPartners();fixFooterLogo();fixCounterValues();replaceProjectImage();fixPhotoTiles();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  window.addEventListener('load',()=>{fixPartners();fixFooterLogo();replaceProjectImage();});
})();

/* ---- block 19 ---- */
(function(){
  function animateNumber(card){
    if(card.dataset.done === '1') return;
    const target = parseInt(card.dataset.target || '0', 10);
    const suffix = card.dataset.suffix || '';
    const number = card.querySelector('strong');
    if(!number || !target) return;
    card.dataset.done = '1';
    card.classList.add('is-counting');
    const duration = 1350;
    const startTime = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    function frame(now){
      const p = Math.min((now - startTime) / duration, 1);
      const value = Math.round(target * ease(p));
      number.textContent = value + suffix;
      if(p < 1){ requestAnimationFrame(frame); }
      else{ setTimeout(()=>card.classList.remove('is-counting'), 500); }
    }
    number.textContent = '0' + suffix;
    requestAnimationFrame(frame);
  }
  function init(){
    const cards = document.querySelectorAll('.ft-counter-card[data-target]');
    cards.forEach(card => { card.dataset.done = ''; const n=card.querySelector('strong'); if(n) n.textContent='0'+(card.dataset.suffix||''); });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting) animateNumber(entry.target); });
    }, {threshold:.45, rootMargin:'0px 0px -8% 0px'});
    cards.forEach(card => observer.observe(card));
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

try { if(!document.body.getAttribute('data-current-page')) document.body.setAttribute('data-current-page','home'); } catch(e) {}

/* ---- block 20 ---- */
(function(){
  function addMotionClasses(){
    const revealSelectors = [
      'section',
      '.section',
      '.ft-commercial-section',
      '.ft-real-photo-gallery',
      '.ft-testimonials-section',
      '.ft-workflow-section',
      '.ft-faq-section'
    ];

    document.querySelectorAll(revealSelectors.join(',')).forEach(function(el){
      if (!el.classList.contains('ft-reveal-motion')) el.classList.add('ft-reveal-motion');
    });

    const cardSelectors = [
      '.phase-card',
      '.case-card',
      '.ft-proof-card',
      '.ft-proof-metric',
      '.ft-testimonial-card',
      '.ft-faq-item',
      '.ft-workflow-card',
      '.ft-photo-tile',
      '.team-card',
      '.content-card',
      '.feature-card',
      '.ft-partner-logo',
      '.logo-card'
    ];

    document.querySelectorAll(cardSelectors.join(',')).forEach(function(el){
      el.classList.add('ft-motion-card');
    });

    const groupSelectors = [
      '.phase-grid',
      '.case-grid',
      '.ft-photo-grid',
      '.team-grid',
      '.ft-proof-grid',
      '.ft-commercial-grid',
      '.ft-testimonial-track',
      '.ft-faq-list'
    ];

    document.querySelectorAll(groupSelectors.join(',')).forEach(function(group){
      group.classList.add('ft-motion-stagger');
      Array.from(group.children).forEach(function(child, index){
        child.style.setProperty('--ft-i', index);
      });
    });
  }

  function initReveal(){
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('ft-in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.ft-reveal-motion').forEach(function(el){
      observer.observe(el);
    });
  }

  function animateCounters(){
    const numberPattern = /^\+?\d+/;
    const candidates = document.querySelectorAll('.ft-proof-metric strong, .counter strong, .metric strong, .stat strong, [class*="metric"] strong, [class*="counter"] strong');

    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        const el = entry.target;
        if(el.dataset.ftCountDone === '1') return;

        const original = el.textContent.trim();
        const match = original.match(numberPattern);
        if(!match) {
          el.dataset.ftCountDone = '1';
          observer.unobserve(el);
          return;
        }

        const prefix = original.startsWith('+') ? '+' : '';
        const target = parseInt(match[0].replace('+',''), 10);
        const suffix = original.replace(match[0], '');
        let current = 0;
        const duration = 1150;
        const start = performance.now();

        function tick(now){
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.round(target * eased);
          el.textContent = prefix + current + suffix;
          if(progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = original;
            el.dataset.ftCountDone = '1';
          }
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.45 });

    candidates.forEach(function(el){
      observer.observe(el);
    });
  }

  function init(){
    addMotionClasses();
    initReveal();
    animateCounters();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ---- block 21 ---- */
(function(){
/* [router-consolidation 2026-07] removed: duplicate home-only body-class reconciler (hashchange/click timers) */
})();

/* ---- block 22 ---- */
(function(){
  var REQUEST_URL = 'https://tool.farmtree.earth/Identity/Account/Register';
  var PLATFORM_URL = 'https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F';
  var ALIASES = { implementers:'ngos', implementer:'ngos', investors:'investors', investor:'investors', demo:'request' };
  function normalizePage(id){
    id = (id || 'home').toLowerCase();
    return ALIASES[id] || id;
  }

  function markHomeOnlySections(){
    return Array.from(document.querySelectorAll('#page-home .ft-home-only-section'));
  }

  function getCurrentPagePatched(){
    return normalizePage(document.body.getAttribute('data-current-page') || (location.hash || '').replace('#','') || 'home');
  }

  function updateHomeOnly(){
    var current = getCurrentPagePatched();
    var isHome = current === 'home';
    document.body.classList.toggle('ft-page-home', isHome);
    document.body.classList.toggle('ft-page-inner', !isHome);
    markHomeOnlySections().forEach(function(el){ el.style.display = isHome ? '' : 'none'; });
    document.querySelectorAll('.page').forEach(function(page){
      page.classList.toggle('active', page.id === 'page-' + current);
    });
  }

  function patchPerformance(){
    document.querySelectorAll('img').forEach(function(img, i){
      /* Never lazy-load above-the-fold-critical images: the hero (LCP),
         header/mobile logos and the site loader. Runtime-lazying them
         regressed LCP (they paint before scroll on every visit). */
      if(img.id === 'heroImg' || (img.closest && img.closest('.hero,.header,#ftSiteLoader,.mobile-top'))){
        if(img.id === 'heroImg') img.setAttribute('fetchpriority','high');
        img.setAttribute('decoding','async');
        return;
      }
      if(i === 0){ img.setAttribute('fetchpriority','high'); img.setAttribute('decoding','async'); return; }
      if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
      img.setAttribute('decoding','async');
    });
    var idle = window.requestIdleCallback || function(cb){ return setTimeout(cb, 350); };
    idle(function(){ document.body.classList.add('ft-perf-idle'); });
  }

  function addMenuLinks(){
    var cards = Array.from(document.querySelectorAll('#mobileMenu .mobile-card'));
    if(!cards.length) return;
    var farmCard = cards.find(function(c){ return /farmtree/i.test((c.querySelector('h4')||{}).textContent || ''); });
    if(farmCard){
      if(!farmCard.querySelector('[data-page="investors"]')){
        var b1 = document.createElement('button'); b1.dataset.page='investors'; b1.textContent='For investors'; farmCard.appendChild(b1);
      }
      if(!farmCard.querySelector('[data-page="ngos"]')){
        var b2 = document.createElement('button'); b2.dataset.page='ngos'; b2.textContent='For implementers'; farmCard.appendChild(b2);
      }
    }
  }

  function addHeroBuyerCtas(){
    var heroContent = document.querySelector('#page-home .hero-content, #page-home .hero-copy, #page-home .hero-text, #page-home .hero-inner');
    if(heroContent && !heroContent.querySelector('.ft-buyer-ctas')){
      var div = document.createElement('div');
      div.className = 'ft-buyer-ctas';
      div.innerHTML = '<button data-page="investors" type="button">For investors</button><button data-page="ngos" type="button">For implementers</button><a data-ft-action="request-demo" href="https://tool.farmtree.earth/Identity/Account/Register">Request a demo</a>';
      heroContent.appendChild(div);
    }
  }

  function enhanceUseCasePage(pageId, cfg){
    var page = document.getElementById(pageId);
    if(!page || page.dataset.ftEnhanced === 'true') return;
    page.dataset.ftEnhanced = 'true';
    page.innerHTML = [
      '<div class="usecase-page-wrap">',
        '<div class="usecase-hero">',
          '<div class="usecase-visual"><img loading="lazy" decoding="async" src="'+cfg.image+'" alt="'+cfg.imageAlt+'"></div>',
          '<div class="usecase-copy">',
            '<div class="kicker">'+cfg.kicker+'</div>',
            '<h1>'+cfg.title+'</h1>',
            '<p class="lead">'+cfg.lead+'</p>',
            '<div class="usecase-btns">',
              (cfg.primaryExternal ? '<a class="primary" href="'+cfg.primaryHref+'" target="_blank" rel="noopener">'+cfg.primaryText+'</a>' : '<button class="primary" data-page="'+cfg.primaryHref+'" type="button">'+cfg.primaryText+'</button>'),
              '<a class="secondary" data-ft-action="request-demo" href="https://tool.farmtree.earth/Identity/Account/Register">Request a demo</a>',
            '</div>',
          '</div>',
        '</div>',
        '<div class="usecase-grid">',
          cfg.cards.map(function(c){ return '<div class="usecase-card"><h3>'+c.h+'</h3><p>'+c.p+'</p></div>'; }).join(''),
        '</div>',
        '<div class="usecase-stat-row">',
          cfg.stats.map(function(s){ return '<div class="usecase-stat"><strong>'+s.n+'</strong><span>'+s.t+'</span></div>'; }).join(''),
        '</div>',
        '<div class="usecase-mini">',
          '<div class="usecase-note"><h4>'+cfg.note1.h+'</h4><p>'+cfg.note1.p+'</p></div>',
          '<div class="usecase-note"><h4>'+cfg.note2.h+'</h4><p>'+cfg.note2.p+'</p></div>',
        '</div>',
      '</div>'
    ].join('');
  }

/* [router-consolidation 2026-07] removed: ghostwriter patchNavTargets (capture redirects + setPage wrapper) */
/* [router-consolidation 2026-07] removed: ghostwriter openPageFromHash */
  document.addEventListener('DOMContentLoaded', function(){
    patchPerformance();
    markHomeOnlySections();
    addMenuLinks();
    addHeroBuyerCtas();
    enhanceUseCasePage('page-investors', {
      image:'' + window.FT_ASSETS + '/investors-hero_opt.webp',
      imageAlt:'Agroforestry investor field visit',
      kicker:'FOR INVESTORS',
      title:'Premium insight for climate and agroforestry capital',
      lead:'Assess agroforestry opportunities with clearer assumptions, stronger risk framing and investment ready storytelling. This page is designed for investors, funds, family offices and climate finance teams that need decision support before capital is committed.',
      primaryText:'Book an investment review',
      primaryHref:'request',
      primaryExternal:false,
      cards:[
        {h:'Portfolio clarity', p:'Compare scenarios, assumptions and outcomes across projects so investment conversations become faster and more evidence based.'},
        {h:'Risk framing', p:'Translate agronomic and implementation variables into an investor friendly story around feasibility, confidence and expected value.'},
        {h:'Board-ready outputs', p:'Present commercial, carbon and environmental narratives in a format that supports committees, donors and co-investors.'}
      ],
      stats:[
        {n:'4', t:'decision lenses combining finance, carbon, biodiversity and implementation logic'},
        {n:'50 yrs', t:'long-term scenario planning horizon for future-oriented portfolio conversations'},
        {n:'MRV', t:'narrative-ready reporting logic to support impact communication'},
        {n:'1 workflow', t:'from early screening to a stronger investment case'}
      ],
      note1:{h:'Ideal for', p:'Impact investors, blended finance programmes, family offices, DFIs and climate-aligned private capital teams.'},
      note2:{h:'Typical outcome', p:'A clearer investment story, sharper assumptions and a stronger basis for deciding whether a project should move forward.'}
    });
    enhanceUseCasePage('page-ngos', {
      image:'' + window.FT_ASSETS + '/implementers-hero_opt.webp',
      imageAlt:'Field implementers collaborating with farmers',
      kicker:'FOR IMPLEMENTERS',
      title:'Built for field teams, partners and programme delivery',
      lead:'Support implementation teams with practical workflows that connect field evidence, local assumptions and reporting needs. This page is tailored for NGOs, implementing partners and programme managers working close to farmers and landscapes.',
      primaryText:'Explore team workflow',
      primaryHref:'contact',
      primaryExternal:false,
      cards:[
        {h:'Field planning', p:'Structure project assumptions, species choices, labour expectations and scenario logic before implementation starts.'},
        {h:'Learning loops', p:'Bring field observations, team feedback and practical lessons into a more consistent planning and reporting workflow.'},
        {h:'Partner communication', p:'Share outputs with donors, internal teams and communities in a clearer and more professional format.'}
      ],
      stats:[
        {n:'3', t:'core phases to connect planning, field learning and reporting'},
        {n:'1 team', t:'shared workflow for programme managers, field officers and partners'},
        {n:'4 outputs', t:'carbon, finance, hydrology and livelihood narratives in one structure'},
        {n:'Daily', t:'practical relevance for real project operations'}
      ],
      note1:{h:'Ideal for', p:'NGOs, implementation partners, programme coordinators, advisory teams and landscape-level delivery organisations.'},
      note2:{h:'Typical outcome', p:'Less fragmented reporting, clearer field coordination and stronger communication with partners and funders.'}
    });
  });
})();

/* ---- block 23 ---- */
/* [router-consolidation 2026-07] removed: redundant data-current-page click syncer */

/* ---- block 24 ---- */
(function(){
/* [router-consolidation 2026-07] removed: ft-final-behaviour-v2 go()+setPage+capture listener */
  function fixUseCaseImages(){
    var investor=document.querySelector('#page-investors .usecase-visual img');
    if(investor){ investor.src='' + window.FT_ASSETS + '/embedded_020_opt.webp'; investor.alt='Agroforestry investor and field planning discussion'; }
    var impl=document.querySelector('#page-ngos .usecase-visual img');
    if(impl){ impl.src='' + window.FT_ASSETS + '/embedded_023_opt.webp'; impl.alt='Implementers working with farmers in an agroforestry landscape'; }
  }
/* [router-consolidation 2026-07] removed: ft-final-behaviour-v2 activateFromHash */
  document.addEventListener('DOMContentLoaded',function(){
    fixUseCaseImages();
    document.querySelectorAll('img').forEach(function(img,i){
      if(i>0 && !img.loading) img.loading='lazy';
      img.decoding='async';
      img.onerror=function(){ this.style.opacity='.15'; this.alt=this.alt || 'Image loading issue'; };
    });
  });
})();

/* ---- block 25 ---- */
(function(){
/* [router-consolidation 2026-07] removed: v4 go() + bindButtons [data-page] listeners */
  // Preload hero images to reduce first-load lag
  function preloadHero(){
    document.querySelectorAll('.hero-img, .hero img').forEach(img=>{ if(img.src){ const pre=new Image(); pre.src=img.src; } });
    ['' + window.FT_ASSETS + '/embedded_012.webp','' + window.FT_ASSETS + '/embedded_013_opt.webp','' + window.FT_ASSETS + '/embedded_014_opt.webp'].forEach(src=>{ const im=new Image(); im.src=src; });
  }
  // Safer language layer, keeps UI structure unchanged
  const dict={
    nl:{
      'Home':'Home','Solutions':'Oplossingen','Track Record':'Track Record','Platform':'Platform','User Videos':'Gebruikersvideo’s','Cocoa Focus':'Cacao focus','Team':'Team','Vacancies':'Vacatures','Contact us':'Neem contact op','Request a demo':'Demo aanvragen','Contact':'Contact','FarmTree Platform':'FarmTree Platform','English':'English','Nederlands':'Nederlands','Deutsch':'Deutsch',
      'FarmTree Platform':'FarmTree Platform','Plan for and Report on Agroforestry Investments':'Agroforestry investeringen plannen en rapporteren','Credible projections for environmental impact and farmer returns, built with specialised expertise, local data and scientific rigor.':'Betrouwbare prognoses voor milieu-impact en opbrengsten voor boeren, gebouwd met gespecialiseerde expertise, lokale data en wetenschappelijke nauwkeurigheid.','Read more here ↗':'Lees meer ↗','For investors':'Voor investeerders','For implementers':'Voor uitvoerders','Request a demo':'Demo aanvragen',
      'About FarmTree':'Over FarmTree','FarmTree helps you design, implement and monitor agroforestry projects.':'FarmTree helpt u agroforestryprojecten te ontwerpen, implementeren en monitoren.','+90 KPIs':'+90 KPI’s','Key performance indicators directly linking carbon, finance, production, water, biodiversity and livelihoods.':'Prestatie-indicatoren die koolstof, finance, productie, water, biodiversiteit en levensonderhoud direct verbinden.','50 years':'50 jaar','Agroforestry scenario projections for long term planning, investment cases and de risking.':'Agroforestry scenario’s voor langetermijnplanning, investeringscases en risicobeperking.','+900':'+900','Species and inputs in the CAFS database for local calibration and science backed modelling.':'Soorten en invoergegevens in de CAFS database voor lokale kalibratie en wetenschappelijk onderbouwde modellering.',
      'Data backed impact':'Data-onderbouwde impact','The FarmTree Platform':'Het FarmTree Platform','The FarmTree Platform is a software model and online interface created to design agroforestry scenarios and project their impact on carbon, financial and environmental indicators.':'Het FarmTree Platform is een softwaremodel en online interface om agroforestry scenario’s te ontwerpen en impact op koolstof, financiële en milieu-indicatoren te projecteren.','Learn more':'Meer informatie','For project teams':'Voor projectteams','Scale your agroforestry planning capability.':'Vergroot uw capaciteit voor agroforestry planning.','FarmTree helps organisations move from expert led planning to project capture, staff training and independent platform operation.':'FarmTree helpt organisaties van expertgestuurde planning naar projectvastlegging, teamtraining en zelfstandig platformgebruik.','Get started today':'Start vandaag',
      'How FarmTree Works':'Hoe FarmTree werkt','From Project Planning to Investment Reporting':'Van projectplanning naar investeringsrapportage','Define Project Scope':'Projectscope definiëren','Build Agroforestry Model':'Agroforestrymodel bouwen','Run Impact Scenarios':'Impactscenario’s uitvoeren','Generate Reports':'Rapporten genereren','Define project scope':'Projectscope definiëren','Set location, objectives, species assumptions, financial settings and project parameters before modelling starts.':'Stel locatie, doelen, soortaannames, financiële instellingen en projectparameters vast voordat het modelleren begint.',
      'Platform overview':'Platformoverzicht','Field data plus assumptions, translated into decision ready outputs':'Velddata plus aannames, vertaald naar beslisklare outputs','This adds the missing platform explanation Frank highlighted: what goes in, what the model does and what buyers receive. Screenshots can be replaced once Irene provides platform visuals.':'Dit vult de platformuitleg aan die Frank miste: wat erin gaat, wat het model doet en wat kopers ontvangen. Screenshots kunnen worden vervangen zodra Irene platformbeelden levert.','Inputs':'Inputs','Model':'Model','Outputs':'Outputs','Reports':'Rapporten',
      'Project journey':'Projectreis','From project planning to investment reporting':'Van projectplanning naar investeringsrapportage','Turn project ideas into fundable scenarios':'Zet projectideeën om in financierbare scenario’s','Connect field data with scenario models':'Verbind velddata met scenariomodellen','Report clearly to investors and partners':'Rapporteer helder aan investeerders en partners','See service scope ↗':'Bekijk service scope ↗','Explore the platform ↗':'Ontdek het platform ↗','50 yrs':'50 jaar','long term scenario planning horizon':'horizon voor langetermijnscenario’s','flagship proof stories prepared':'belangrijkste proof stories voorbereid','project phases clarified for buyers':'projectfases verduidelijkt voor kopers','reporting and monitoring narrative':'rapportage en monitoringverhaal',
      'References':'Referenties','Partners and programmes connected to FarmTree':'Partners en programma’s verbonden met FarmTree','Selected organisations and programmes connected to FarmTree projects and platform conversations.':'Geselecteerde organisaties en programma’s verbonden met FarmTree projecten en platformgesprekken.',
      'Our ecosystem':'Ons ecosysteem','Rethinking how agroforestry projects are planned and financed':'Opnieuw nadenken over hoe agroforestryprojecten worden gepland en gefinancierd','Why FarmTree?':'Waarom FarmTree?','Growing better land decisions':'Betere landbeslissingen laten groeien','Transparency':'Transparantie','Livelihoods':'Levensonderhoud','Ecology':'Ecologie','Finance':'Financiën','One information base for project design, monitoring and reporting.':'Eén informatiebasis voor projectontwerp, monitoring en rapportage.','Model farmer income, labour needs, yields and long term value.':'Modelleer boereninkomen, arbeidsbehoefte, opbrengsten en langetermijnwaarde.','Estimate carbon, water, biodiversity, soil and erosion indicators.':'Schat koolstof, water, biodiversiteit, bodem en erosie-indicatoren.','Translate complex agroforestry assumptions into investment ready narratives.':'Vertaal complexe agroforestry aannames naar investeringsklare verhalen.',
      'Field evidence':'Veldbewijs','Real project landscapes, farmers and field conditions':'Echte projectlandschappen, boeren en veldomstandigheden','These images bring the prototype closer to the current FarmTree website by showing the practical context behind agroforestry planning, climate risk, cocoa landscapes, farmer livelihoods and field based data collection.':'Deze beelden brengen het prototype dichter bij de huidige FarmTree website door de praktische context achter agroforestryplanning, klimaatrisico, cacaolandschappen, boerenlevensonderhoud en velddata te tonen.',
      'A long road ahead':'Een lange weg vooruit','Deep roots in agroforestry transformation':'Diepe wortels in agroforestrytransformatie','FarmTree helps organisations move from farm level plans to landscape impact, portfolio scaling and evidence based communication with investors, farmers and partners.':'FarmTree helpt organisaties van plannen op boerderijniveau naar landschapsimpact, portfolioschaal en evidence-based communicatie met investeerders, boeren en partners.','Learn more about us':'Meer over ons',
      'Featured cases':'Uitgelichte cases','Four proof stories to make FarmTree tangible':'Vier proof stories om FarmTree tastbaar te maken','Open case ↗':'Open case ↗','F&A':'F&A','Questions about agroforestry modelling? We’re here to help.':'Vragen over agroforestry modellering? We helpen graag.'
    },
    de:{
      'Home':'Startseite','Solutions':'Lösungen','Track Record':'Track Record','Platform':'Plattform','User Videos':'Nutzervideos','Cocoa Focus':'Kakao Fokus','Team':'Team','Vacancies':'Stellenangebote','Contact us':'Kontakt','Request a demo':'Demo anfragen','Contact':'Kontakt','FarmTree Platform':'FarmTree Plattform','English':'English','Nederlands':'Nederlands','Deutsch':'Deutsch',
      'Plan for and Report on Agroforestry Investments':'Agroforst-Investitionen planen und berichten','Credible projections for environmental impact and farmer returns, built with specialised expertise, local data and scientific rigor.':'Glaubwürdige Prognosen für Umweltwirkung und Erträge, basierend auf Fachwissen, lokalen Daten und wissenschaftlicher Genauigkeit.','Read more here ↗':'Mehr lesen ↗','For investors':'Für Investoren','For implementers':'Für Umsetzer','About FarmTree':'Über FarmTree','FarmTree helps you design, implement and monitor agroforestry projects.':'FarmTree hilft Ihnen, Agroforstprojekte zu planen, umzusetzen und zu überwachen.','50 years':'50 Jahre','Data backed impact':'Datengestützte Wirkung','The FarmTree Platform':'Die FarmTree Plattform','Learn more':'Mehr erfahren','For project teams':'Für Projektteams','Scale your agroforestry planning capability.':'Erweitern Sie Ihre Planungskapazität für Agroforst.','Get started today':'Heute starten','How FarmTree Works':'Wie FarmTree funktioniert','From Project Planning to Investment Reporting':'Von Projektplanung zu Investment Reporting','Platform overview':'Plattformüberblick','Field data plus assumptions, translated into decision ready outputs':'Felddaten plus Annahmen, übersetzt in entscheidungsreife Outputs','Inputs':'Inputs','Model':'Modell','Outputs':'Outputs','Reports':'Berichte','Project journey':'Projektreise','From project planning to investment reporting':'Von Projektplanung zu Investment Reporting','Turn project ideas into fundable scenarios':'Projektideen in finanzierbare Szenarien umwandeln','Connect field data with scenario models':'Felddaten mit Szenariomodellen verbinden','Report clearly to investors and partners':'Klar an Investoren und Partner berichten','References':'Referenzen','Partners and programmes connected to FarmTree':'Partner und Programme verbunden mit FarmTree','Our ecosystem':'Unser Ökosystem','Rethinking how agroforestry projects are planned and financed':'Neu denken, wie Agroforstprojekte geplant und finanziert werden','Why FarmTree?':'Warum FarmTree?','Growing better land decisions':'Bessere Landentscheidungen fördern','Transparency':'Transparenz','Livelihoods':'Lebensgrundlagen','Ecology':'Ökologie','Finance':'Finanzen','Field evidence':'Feldnachweis','Real project landscapes, farmers and field conditions':'Reale Projektlandschaften, Landwirte und Feldbedingungen','A long road ahead':'Ein langer Weg voraus','Deep roots in agroforestry transformation':'Tiefe Wurzeln in der Agroforst-Transformation','Learn more about us':'Mehr über uns','Featured cases':'Ausgewählte Fälle','Four proof stories to make FarmTree tangible':'Vier Proof Stories, die FarmTree greifbar machen','Open case ↗':'Fall öffnen ↗','Questions about agroforestry modelling? We’re here to help.':'Fragen zur Agroforst-Modellierung? Wir helfen gerne.'
    }
  };
  const originals=new WeakMap();
  function nodes(){ const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){ if(!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT; const p=n.parentElement; if(!p||['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName)) return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; }}); let a=[],n; while(n=w.nextNode()) a.push(n); return a; }
  function capture(){ nodes().forEach(n=>{ if(!originals.has(n)) originals.set(n,n.nodeValue); }); }
  function apply(lang){ capture(); document.documentElement.lang=lang; const lab=document.getElementById('langLabel'); if(lab) lab.textContent=lang.toUpperCase(); document.querySelectorAll('.lang-option').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang)); nodes().forEach(n=>{ const o=originals.get(n)||n.nodeValue; if(lang==='en'){n.nodeValue=o;return;} const t=o.trim(); const r=(dict[lang]||{})[t]; if(r){ const pre=(o.match(/^\s*/)||[''])[0], suf=(o.match(/\s*$/)||[''])[0]; n.nodeValue=pre+r+suf; }}); }
  window.applyFarmTreeLanguage=apply;
  document.addEventListener('DOMContentLoaded',()=>{ capture(); preloadHero(); document.querySelectorAll('.lang-option,[data-lang]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();apply(b.dataset.lang||'en');})); });
})();

/* ---- block 26 ---- */
/* [router-consolidation 2026-07] removed: duplicate apply()/setPage wrapper with reconciliation timers */

/* ---- block 27 ---- */
/* [router-consolidation 2026-07] removed: ft-stable-router-v6-final-reconcile timers */

/* ---- block 28 ---- */
(function(){
  const ASSETS = {
    logoIcon: '' + window.FT_ASSETS + '/farmtree-icon.png',
    investorHero: '' + window.FT_ASSETS + '/investor-hero-v7_opt.webp',
    implementerHero: '' + window.FT_ASSETS + '/implementers-hero-v7_opt.webp',
    licensesHero: '' + window.FT_ASSETS + '/licenses-hero-v7_opt.webp',
    blogHero: '' + window.FT_ASSETS + '/blog-hero-v7_opt.webp'
  };
  const investorMedia = [
    {img:'' + window.FT_ASSETS + '/investor-card-1_opt.webp', title:'Portfolio clarity', text:'Review assumptions, scenarios and upside in one visual story.'},
    {img:'' + window.FT_ASSETS + '/investor-card-2_opt.webp', title:'Investment narrative', text:'Turn model outputs into clear conversations for committees and partners.'},
    {img:'' + window.FT_ASSETS + '/investor-card-3_opt.webp', title:'Scenario dashboards', text:'See finance, carbon and environmental outcomes without noise.'},
    {img:'' + window.FT_ASSETS + '/investor-card-4_opt.webp', title:'Review sessions', text:'Bring teams together around evidence, not guesswork.'}
  ];
  const implementerMedia = [
    {img:'' + window.FT_ASSETS + '/implementer-card-1_opt.webp', title:'Field observation', text:'Capture local realities with practical notes and structured data.'},
    {img:'' + window.FT_ASSETS + '/implementer-card-2_opt.webp', title:'Planning sessions', text:'Align teams on the ground before implementation starts.'},
    {img:'' + window.FT_ASSETS + '/implementer-card-3_opt.webp', title:'Community learning', text:'Create space for feedback, shared priorities and better delivery.'},
    {img:'' + window.FT_ASSETS + '/implementer-card-4_opt.webp', title:'Partner coordination', text:'Keep programme teams focused on the same picture.'}
  ];
  const blogPosts = {
    fieldnotes:{
      tag:'Field insight',
      title:'Turning field data into investment ready insight',
      read:'6 min read',
      date:'10 May 2026',
      body:[
        'Good investment conversations rarely begin with a polished slide. They begin with field realities, crop choices, labour assumptions, climate context and a team that knows how to connect those facts to decision making. That is where FarmTree creates value.',
        'When local evidence is structured well, the platform can move beyond a spreadsheet exercise. It becomes a living decision environment that helps teams compare scenarios, question assumptions and show why one pathway is stronger than another. This matters because investors are not only looking for promise. They are looking for confidence.',
        'A stronger workflow usually starts with three habits. First, gather field observations in a consistent way. Second, document the reasoning behind the scenario choices. Third, present outputs in a format that is easy to discuss. When those habits are in place, reporting becomes calmer, faster and far more persuasive.'
      ],
      bullets:['Start from real field evidence', 'Translate assumptions into readable scenarios', 'Present outputs in a way that supports action']
    },
    implementers:{
      tag:'Operations',
      title:'What implementers need from a planning platform',
      read:'5 min read',
      date:'06 May 2026',
      body:[
        'Implementers need more than a model. They need a workflow that respects the pace of project delivery. That means practical data capture, simple team coordination and reporting that does not pull people away from the field.',
        'A useful platform helps programme teams bring scattered information into one rhythm. It supports species selection, planning logic, field learning and communication with partners. The result is not just better documentation. It is better alignment across people who need to make decisions together.',
        'The most effective digital experiences for implementers feel calm. They surface the right details, reduce duplication and keep every output connected to the work happening on the ground.'
      ],
      bullets:['Simplify team coordination', 'Reduce fragmented reporting', 'Keep decisions close to field realities']
    },
    cocoa:{
      tag:'Landscape thinking',
      title:'Why scenario thinking matters in cocoa landscapes',
      read:'7 min read',
      date:'01 May 2026',
      body:[
        'Cocoa systems are shaped by uncertainty. Yields, labour, shade trees, income stability and climate resilience all influence whether an intervention remains viable over time. Scenario thinking helps teams explore those choices before they become costly.',
        'Instead of asking whether one design is perfect, scenario work asks a better question. Which pathway is most credible under the conditions we face. That shift helps organisations compare trade offs with more honesty and more discipline.',
        'For teams working in cocoa landscapes, the value of modelling is not abstract. It creates space for better design, clearer communication and a more grounded conversation about risk and opportunity.'
      ],
      bullets:['Compare different pathways early', 'Understand trade offs before scaling', 'Build more credible stories for partners and funders']
    },
    reporting:{
      tag:'Communication',
      title:'Designing reports that teams will actually use',
      read:'4 min read',
      date:'26 April 2026',
      body:[
        'A report should help people move. If it feels heavy, unclear or overcomplicated, it will sit unread. Premium communication is not about adding more pages. It is about shaping the story so the right insight appears at the right moment.',
        'The strongest reports combine structure and restraint. They use clean language, thoughtful visuals and a sequence that respects how decision makers think. What matters first. What matters next. What creates confidence. That simple discipline turns outputs into practical tools.',
        'FarmTree has an opportunity to present technical results with more warmth and more elegance. When data feels accessible, teams are more likely to return to it, trust it and act on it.'
      ],
      bullets:['Lead with the key message', 'Use visuals that clarify, not decorate', 'Keep tone human and confident']
    }
  };

  function whenReady(fn){ if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', fn); } else { fn(); } }

  function renderDiagram(){
    const target = document.getElementById("diagram");
    if(!target) return;
    target.innerHTML = `
      <figure class="ft-simple-diagram" aria-label="FarmTree model system diagram">
        <img loading="lazy" decoding="async" src="${window.FT_ASSETS}/base-technology/home-ecosystem-current-brand.webp" alt="FarmTree model infographic showing site information, climate and terrain inputs, species database, impact monitoring and impact projection"/>
      </figure>`;
  }


  function buildUseCasePage(pageId, cfg){
    const page = document.getElementById('page-' + pageId);
    if(!page) return;
    page.innerHTML = `
      <div class="usecase-page-wrap">
        <div class="usecase-hero">
          <div class="usecase-visual"><img loading="lazy" decoding="async" src="${cfg.image}" alt="${cfg.alt}"></div>
          <div class="usecase-copy">
            <div class="kicker">${cfg.kicker}</div>
            <h1>${cfg.title}</h1>
            <p class="lead">${cfg.lead}</p>
            <div class="usecase-btns">
              <button class="primary" type="button" data-ftmodal="request">${cfg.primary}</button>
              <button class="secondary" type="button" data-page="contact">Contact us</button>
            </div>
          </div>
        </div>
        <div class="usecase-grid">
          ${cfg.cards.map(card => `<article class="usecase-card"><h3>${card.h}</h3><p>${card.p}</p></article>`).join('')}
        </div>
        <div class="usecase-media-grid">
          ${cfg.media.map(item => `<article class="usecase-media-card"><img loading="lazy" decoding="async" src="${item.img}" alt="${item.title}"><div class="usecase-media-copy"><strong>${item.title}</strong><span>${item.text}</span></div></article>`).join('')}
        </div>
        <div class="usecase-mini">
          <article class="usecase-note"><h4>${cfg.note1.h}</h4><p>${cfg.note1.p}</p></article>
          <article class="usecase-note"><h4>${cfg.note2.h}</h4><p>${cfg.note2.p}</p></article>
        </div>
      </div>`;
  }

  function enrichAcknowledgements(){
    const page = document.getElementById('page-acknowledgements');
    if(!page) return;
    page.innerHTML = `
      <div class="subhero"><img loading="lazy" decoding="async" alt="Project partnerships and field realities" src="${window.FT_ASSETS}/embedded_044_opt.webp"><div class="container"><div class="kicker">Acknowledgements</div><h1>Scientific collaboration, field data and project partnerships</h1></div></div>
      <section class="section ft-rich-page"><div class="container">
        <div class="ft-inline-intro"><strong>A shared effort shaped by science, local knowledge and trusted collaboration</strong><p>FarmTree grows stronger when modellers, field teams, researchers, partners and funders work from the same spirit of curiosity and responsibility. This page gives space to the people and organisations that help turn ideas into practical tools, grounded field learning and better decisions.</p></div>
        <div class="ft-info-grid">
          <article class="ft-info-card"><h3>Research partners</h3><p>Our work draws strength from scientific thinking, practical testing and a willingness to challenge assumptions with evidence.</p><ul><li>Universities and research groups supporting agroforestry methods</li><li>Specialists contributing modelling logic and scenario design</li><li>Advisors helping strengthen interpretation and review</li></ul></article>
          <article class="ft-info-card"><h3>Field contributors</h3><p>Local teams and communities provide the context that keeps every output useful, realistic and respectful of place.</p><ul><li>Implementation partners sharing field observations</li><li>Farmer facing teams validating assumptions</li><li>Project staff helping connect data with lived realities</li></ul></article>
          <article class="ft-info-card"><h3>Funding and support</h3><p>Strategic partners and programmes create room for learning, product refinement and responsible growth.</p><ul><li>Climate and landscape programmes opening collaboration pathways</li><li>Commercial and public partners supporting project development</li><li>Stakeholders who value transparent and evidence based planning</li></ul></article>
        </div>
        <div class="ft-ack-band">
          <div class="ft-band-item"><strong>Science first</strong><span>Methods are strongest when they remain curious, transparent and open to review.</span></div>
          <div class="ft-band-item"><strong>Field grounded</strong><span>Local knowledge keeps the platform practical and close to real implementation needs.</span></div>
          <div class="ft-band-item"><strong>Shared learning</strong><span>Partnerships create feedback loops that improve both the tool and the decisions around it.</span></div>
        </div>
        <div class="ft-quote-card">“ FarmTree works best when evidence, experience and collaboration meet in the same place. ”</div>
      </div></section>`;
  }

  function enrichLicenses(){
    const page = document.getElementById('page-licenses');
    if(!page) return;
    page.innerHTML = `
      <div class="subhero"><img loading="lazy" decoding="async" alt="Responsible use of FarmTree platform and software" src="${ASSETS.licensesHero}"><div class="container"><div class="kicker">Licenses</div><h1>Responsible use of data, models and platform outputs</h1></div></div>
      <section class="section ft-rich-page"><div class="container">
        <div class="ft-inline-intro"><strong>A clear software licensing structure builds trust and reduces friction</strong><p>This preview presents a clean licensing framework FarmTree can communicate to clients and partners. It brings together platform access, project use, team onboarding and reporting permissions in language that feels straightforward and professional.</p></div>
        <div class="ft-license-grid">
          <article class="ft-license-card"><h3>Platform access licence</h3><p>For organisations using the FarmTree Platform through named user accounts and approved team access.</p><ul><li>Named user seats and role based access</li><li>Secure login and account administration</li><li>Use of dashboards, scenarios and internal workspaces</li></ul></article>
          <article class="ft-license-card"><h3>Project modelling licence</h3><p>For creating, comparing and refining agroforestry scenarios within a defined project or programme scope.</p><ul><li>Scenario creation and comparison</li><li>Use of model outputs for planning and review</li><li>Project level analysis for internal decision making</li></ul></article>
          <article class="ft-license-card"><h3>Training and team licence</h3><p>For onboarding teams, enabling repeat use and supporting operational confidence across departments.</p><ul><li>Structured team onboarding</li><li>Training materials and guided sessions</li><li>Support for repeatable workflows and team learning</li></ul></article>
          <article class="ft-license-card"><h3>Reporting and export licence</h3><p>For preparing client ready reports, partner communication and approved export of project outputs.</p><ul><li>Report generation and presentation use</li><li>Approved export of visuals and result summaries</li><li>Use in proposals, reviews and stakeholder communication</li></ul></article>
          <article class="ft-license-card"><h3>Data responsibility note</h3><p>Users remain responsible for the quality of project inputs and for applying outputs with professional judgement.</p><ul><li>Input data should be accurate and well documented</li><li>Outputs support decision making, they do not replace it</li><li>Sensitive project data should be handled with care</li></ul></article>
          <article class="ft-license-card"><h3>Software stack note</h3><p>FarmTree may rely on third party components and libraries released under recognised software licences where relevant.</p><ul><li>Common open source families may include MIT and Apache 2.0</li><li>Any third party obligations should be documented clearly</li><li>Client facing terms can summarise external licence dependencies</li></ul></article>
        </div>
      </div></section>`;
  }

  function ensureBlogPage(){
    if(document.getElementById('page-blog')) return;
    const anchor = document.getElementById('page-licenses');
    if(!anchor) return;
    const blog = document.createElement('section');
    blog.className = 'page';
    blog.id = 'page-blog';
    anchor.insertAdjacentElement('afterend', blog);
  }

  function renderBlog(){
    ensureBlogPage();
    const page = document.getElementById('page-blog');
    if(!page) return;
    page.innerHTML = `
      <div class="ft-blog-shell">
        <div class="ft-blog-feature">
          <div class="ft-blog-hero">
            <img loading="lazy" decoding="async" src="${ASSETS.blogHero}" alt="FarmTree blog insights">
            <div class="ft-blog-hero-copy"><span>Blog</span><h1>Field notes, platform insights and stories that keep ideas moving</h1><p>This page turns FarmTree thinking into a premium reading experience. It gives space to practical lessons, platform reflections and field inspired stories in a format that feels elegant, clear and easy to explore.</p></div>
          </div>
          <div class="ft-contact-panel"><h3>Why this page matters</h3><p>A thoughtful blog helps FarmTree sound more human, more confident and more useful. It gives visitors a reason to stay longer, understand the thinking behind the platform and explore the wider story around agroforestry planning.</p><p style="margin-top:14px">The articles below are designed from themes already present across the website, so the page feels consistent with the rest of the experience.</p><button class="ft-blog-cta" type="button" data-ftmodal="request" style="margin-top:18px">Talk to FarmTree</button></div>
        </div>
        <div class="ft-blog-grid">
          ${Object.entries(blogPosts).map(([key, post], i) => `<article class="ft-blog-card${i===0?' active':''}" data-post="${key}"><small>${post.tag}</small><h3>${post.title}</h3><p>${post.body[0].slice(0,140)}...</p></article>`).join('')}
        </div>
        <article class="ft-blog-detail" id="ftBlogDetail"></article>
      </div>`;
    updateBlogDetail('fieldnotes');
  }

  function updateBlogDetail(key){
    const detail = document.getElementById('ftBlogDetail');
    const post = blogPosts[key];
    if(!detail || !post) return;
    document.querySelectorAll('.ft-blog-card').forEach(card => card.classList.toggle('active', card.getAttribute('data-post')===key));
    detail.innerHTML = `<div class="ft-blog-meta"><span>${post.tag}</span><span>${post.read}</span><span>${post.date}</span></div><h2>${post.title}</h2>${post.body.map(p=>`<p>${p}</p>`).join('')}<ul>${post.bullets.map(item=>`<li>${item}</li>`).join('')}</ul>`;
  }

  function addBlogButton(){
    const companyCard = Array.from(document.querySelectorAll('#mobileMenu .mobile-card')).find(card => /company/i.test((card.querySelector('h4')||{}).textContent || ''));
    if(companyCard && !companyCard.querySelector('[data-page="blog"]')){
      const btn = document.createElement('button');
      btn.setAttribute('data-page','blog');
      btn.textContent = 'Blog';
      companyCard.appendChild(btn);
    }
  }

  function rewriteRequestButtons(){
    document.querySelectorAll('[data-page="request"]').forEach(el => {
      el.removeAttribute('data-page');
      el.setAttribute('data-ftmodal','request');
      if(el.tagName === 'A') el.setAttribute('href', '#');
    });
  }

  function buildModal(){
    if(document.getElementById('ftContactModal')) return;
    const overlay = document.createElement('div');
    overlay.className = 'ft-modal-overlay';
    overlay.id = 'ftContactModal';
    overlay.innerHTML = `
      <div class="ft-modal-shell" role="dialog" aria-modal="true" aria-labelledby="ftModalTitle">
        <div class="ft-modal-head">
          <div><h2 id="ftModalTitle">Request information</h2><p>Tell FarmTree a little about your organisation, your goals and the question you want to discuss. This window opens directly on the page so the experience feels smooth and focused.</p></div>
          <button class="ft-modal-close" type="button" aria-label="Close form">×</button>
        </div>
        <div class="ft-modal-body">
          <form id="ftModalForm">
            <input class="ft-hp" type="text" name="_gotcha" id="ftModalHp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div class="ft-modal-grid">
              <div class="ft-modal-field"><label for="ftName">Full name</label><input id="ftName" type="text" placeholder="Your name"></div>
              <div class="ft-modal-field"><label for="ftCompany">Company or organisation</label><input id="ftCompany" type="text" placeholder="Company name"></div>
              <div class="ft-modal-field"><label for="ftEmail">Email address</label><input id="ftEmail" type="email" placeholder="name@company.com"></div>
              <div class="ft-modal-field"><label for="ftRole">Role</label><input id="ftRole" type="text" placeholder="Your role"></div>
              <div class="ft-modal-field"><label for="ftInterest">Area of interest</label><select id="ftInterest"><option>FarmTree Platform</option><option>Investment support</option><option>Implementation workflow</option><option>Project reporting</option><option>General question</option></select></div>
              <div class="ft-modal-field"><label for="ftTiming">Preferred timing</label><input id="ftTiming" type="text" placeholder="This week, next month, flexible"></div>
            </div>
            <div class="ft-modal-field"><label for="ftQuestion">Your question or project brief</label><textarea id="ftQuestion" placeholder="Share your question, your project context or the support you need"></textarea></div>
            <div class="ft-modal-actions"><div class="ft-modal-footnote">A simple human message is enough. FarmTree can follow up with the right next step after reviewing your request.</div><button class="ft-modal-submit" type="submit">Send request</button></div>
            <div class="ft-modal-success" id="ftModalSuccess">Thank you. Your request has been sent to the FarmTree team.</div>
            <div class="ft-modal-error" id="ftModalError" role="alert">Sorry — your request could not be sent. Please check your connection and try again.</div>
          </form>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
    overlay.querySelector('.ft-modal-close').addEventListener('click', closeModal);
    overlay.querySelector('#ftModalForm').addEventListener('submit', function(e){
      e.preventDefault();
      const form = this;
      const success = overlay.querySelector('#ftModalSuccess');
      const error = overlay.querySelector('#ftModalError');
      const submitBtn = overlay.querySelector('.ft-modal-submit');
      error.classList.remove('show');
      if(submitBtn) submitBtn.disabled = true;
      window.ftSubmitLead({
        form: 'contact-modal',
        _gotcha: (overlay.querySelector('#ftModalHp')||{}).value || '',
        name: (overlay.querySelector('#ftName')||{}).value || '',
        company: (overlay.querySelector('#ftCompany')||{}).value || '',
        email: (overlay.querySelector('#ftEmail')||{}).value || '',
        role: (overlay.querySelector('#ftRole')||{}).value || '',
        interest: (overlay.querySelector('#ftInterest')||{}).value || '',
        timing: (overlay.querySelector('#ftTiming')||{}).value || '',
        question: (overlay.querySelector('#ftQuestion')||{}).value || ''
      }).then(function(){
        success.classList.add('show');
        setTimeout(function(){ closeModal(); success.classList.remove('show'); form.reset(); }, 1200);
      }).catch(function(){
        error.classList.add('show');
      }).finally(function(){
        if(submitBtn) submitBtn.disabled = false;
      });
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
  }

  function openModal(){
    const modal = document.getElementById('ftContactModal');
    if(modal){
      modal.classList.add('open');
      /* a11y: move keyboard focus into the dialog */
      const closeBtn = modal.querySelector('.ft-modal-close');
      if(closeBtn) closeBtn.focus();
    }
  }
  /* Authoritative quotation action (ft-cta-actions-v1) opens the modal here.
     buildModal() is idempotent, so this is safe at any time. */
  window.ftOpenContactModal = function(){ buildModal(); openModal(); };
  function closeModal(){
    const modal = document.getElementById('ftContactModal');
    if(modal) modal.classList.remove('open');
  }

  function hookActions(){
    document.addEventListener('click', function(e){
      const modalTrigger = e.target.closest('[data-ftmodal="request"]');
      if(modalTrigger){
        e.preventDefault();
        e.stopPropagation();
        openModal();
        return;
      }
      const postTrigger = e.target.closest('.ft-blog-card[data-post]');
      if(postTrigger){
        e.preventDefault();
        updateBlogDetail(postTrigger.getAttribute('data-post'));
      }
    });
  }

  function init(){
    renderDiagram();
    buildUseCasePage('investors', {
      image: ASSETS.investorHero,
      alt: 'Investor ready FarmTree workspace',
      kicker: 'For investors',
      title: 'Premium insight for climate and agroforestry capital',
      lead: 'FarmTree helps investors, funds and strategic partners assess agroforestry opportunities with more confidence. The platform connects field realities with a clean decision story, so teams can compare scenarios, understand risk and discuss value with greater clarity.',
      primary: 'Book an investment review',
      cards:[
        {h:'Portfolio clarity', p:'Compare scenarios, assumptions and outcomes across projects, so investment conversations become faster, calmer and more evidence based.'},
        {h:'Risk framing', p:'Translate agronomic and implementation variables into an investor friendly story around feasibility, confidence and expected value.'},
        {h:'Board ready outputs', p:'Present commercial, carbon and environmental narratives in a format that supports committees, partners and co investors.'}
      ],
      media: investorMedia,
      note1:{h:'Ideal for', p:'Impact investors, blended finance programmes, family offices, DFIs and climate aligned capital teams looking for a more grounded review process.'},
      note2:{h:'Typical outcome', p:'A clearer investment story, sharper assumptions and a stronger basis for deciding whether a project should move forward.'}
    });
    buildUseCasePage('ngos', {
      image: ASSETS.implementerHero,
      alt: 'Implementer field consultation',
      kicker: 'For implementers',
      title: 'Built for field teams, partners and programme delivery',
      lead: 'FarmTree supports implementation teams with practical workflows that connect field evidence, local assumptions and reporting needs. The experience is designed to help teams work with more structure while keeping decisions close to reality on the ground.',
      primary: 'Explore team workflow',
      cards:[
        {h:'Field planning', p:'Structure project assumptions, species choices, labour expectations and scenario logic before implementation starts.'},
        {h:'Learning loops', p:'Bring field observations, team feedback and practical lessons into a more consistent planning and reporting workflow.'},
        {h:'Partner communication', p:'Share outputs with donors, internal teams and communities in a clearer and more professional format.'}
      ],
      media: implementerMedia,
      note1:{h:'Ideal for', p:'NGOs, implementation partners, programme coordinators, advisory teams and landscape delivery organisations that need a practical working rhythm.'},
      note2:{h:'Typical outcome', p:'Less fragmented reporting, clearer field coordination and stronger communication with partners and funders.'}
    });
    enrichAcknowledgements();
    enrichLicenses();
    renderBlog();
    addBlogButton();
    buildModal();
    rewriteRequestButtons();
    hookActions();
    setTimeout(rewriteRequestButtons, 60);
    setTimeout(rewriteRequestButtons, 300);
    setTimeout(rewriteRequestButtons, 1000);
    window.openContactModal = openModal;
    if(location.hash === '#request'){
      if(history.replaceState) history.replaceState(null, '', '#contact');
      openModal();
    }
/* [router-consolidation 2026-07] removed: blog initial-load nudge */
    const contactBtn = document.querySelector('#page-contact .outline-btn, #page-contact [data-ftmodal="request"]');
    if(contactBtn){ contactBtn.classList.add('ft-contact-inline-btn'); }
  }

  whenReady(init);
})();

/* ---- block 29 ---- */
(function(){
  const V8_POSTS = {
    fieldnotes:{
      slug:'blog-fieldnotes',
      tag:'Field insight',
      title:'Turning field data into investment ready insight',
      image:'' + window.FT_ASSETS + '/home-project-teams-v11.ll.webp',
      author:'FarmTree Editorial Team',
      role:'Field strategy and planning',
      read:'6 min read',
      date:'10 May 2026',
      excerpt:'Good investment conversations start with field realities, clean assumptions and evidence that decision makers can trust.',
      intro:'This article explores how FarmTree can help teams turn field observations, scenario logic and reporting discipline into more credible investor conversations.',
      body:[
        'Good investment conversations rarely begin with a polished slide. They begin with field realities, crop choices, labour assumptions, climate context and a team that knows how to connect those facts to decision making. That is where FarmTree creates value.',
        'When local evidence is structured well, the platform can move beyond a spreadsheet exercise. It becomes a living decision environment that helps teams compare scenarios, question assumptions and show why one pathway is stronger than another. This matters because investors are not only looking for promise. They are looking for confidence.',
        'A stronger workflow usually starts with three habits. First, gather field observations in a consistent way. Second, document the reasoning behind the scenario choices. Third, present outputs in a format that is easy to discuss. When those habits are in place, reporting becomes calmer, faster and far more persuasive.'
      ],
      sections:[
        {h:'Why evidence quality changes the conversation', ps:['The quality of a scenario depends on the quality of the inputs behind it. When field teams can document conditions, species choices, labour assumptions and project constraints in a consistent way, FarmTree can help turn that complexity into a more readable decision story.','This is especially valuable when a team needs to explain not only what a scenario shows, but why it is credible. A strong investment narrative is rarely just a set of outcomes. It is the logic behind those outcomes.']},
        {h:'A cleaner bridge between field teams and investors', ps:['Investors need clarity, but field teams need practicality. The right workflow brings both together. It allows project teams to keep working close to reality while giving investors the level of structure they need to evaluate risk, upside and implementation confidence.']}
      ],
      bullets:['Start from real field evidence','Translate assumptions into readable scenarios','Present outputs in a way that supports action'],
      seo:['Descriptive H1 and H2 structure','Readable introduction above the fold','Clear author, date and reading time','Strong internal navigation back to the blog hub']
    },
    implementers:{
      slug:'blog-implementers',
      tag:'Operations',
      title:'What implementers need from a planning platform',
      image:'' + window.FT_ASSETS + '/implementers-hero-v7_opt.webp',
      author:'FarmTree Editorial Team',
      role:'Programme operations',
      read:'5 min read',
      date:'06 May 2026',
      excerpt:'Implementers need workflows that respect the pace of project delivery and keep reporting close to field realities.',
      intro:'A useful planning platform should reduce friction, help teams stay aligned and support consistent reporting without pulling people away from implementation.',
      body:[
        'Implementers need more than a model. They need a workflow that respects the pace of project delivery. That means practical data capture, simple team coordination and reporting that does not pull people away from the field.',
        'A useful platform helps programme teams bring scattered information into one rhythm. It supports species selection, planning logic, field learning and communication with partners. The result is not just better documentation. It is better alignment across people who need to make decisions together.',
        'The most effective digital experiences for implementers feel calm. They surface the right details, reduce duplication and keep every output connected to the work happening on the ground.'
      ],
      sections:[
        {h:'Design for clarity, not friction', ps:['The interface should make it easy to understand what needs to be done next. Strong UX for implementation teams means reducing clutter, using consistent cards and giving every section a clear purpose.','When a page feels well ordered, teams can spend more time on the project itself and less time decoding the system.']},
        {h:'Better coordination with partners and donors', ps:['Implementers rarely work alone. They need tools that help them communicate with donors, partner organisations and internal teams. That is why reporting outputs, planning summaries and data-backed narratives should feel polished and easy to share.']}
      ],
      bullets:['Simplify team coordination','Reduce fragmented reporting','Keep decisions close to field realities'],
      seo:['Semantic section hierarchy','Internal linking to related use-case pages','Digestible paragraph lengths','Conversion path to request a workflow session']
    },
    cocoa:{
      slug:'blog-cocoa-landscapes',
      tag:'Landscape thinking',
      title:'Why scenario thinking matters in cocoa landscapes',
      image:'' + window.FT_ASSETS + '/embedded_043_opt.webp',
      author:'FarmTree Editorial Team',
      role:'Landscape strategy',
      read:'7 min read',
      date:'01 May 2026',
      excerpt:'Scenario thinking gives cocoa teams a more disciplined way to compare trade offs before they scale.',
      intro:'Cocoa systems are full of uncertainty. Better scenario thinking helps teams explore pathways early and explain trade offs with more confidence.',
      body:[
        'Cocoa systems are shaped by uncertainty. Yields, labour, shade trees, income stability and climate resilience all influence whether an intervention remains viable over time. Scenario thinking helps teams explore those choices before they become costly.',
        'Instead of asking whether one design is perfect, scenario work asks a better question. Which pathway is most credible under the conditions we face. That shift helps organisations compare trade offs with more honesty and more discipline.',
        'For teams working in cocoa landscapes, the value of modelling is not abstract. It creates space for better design, clearer communication and a more grounded conversation about risk and opportunity.'
      ],
      sections:[
        {h:'Compare pathways before scaling', ps:['Good modelling helps teams understand the implications of different species mixes, shade systems, labour profiles and long-term returns before a programme becomes too expensive to change.']},
        {h:'Give stakeholders a clearer story', ps:['Scenario outputs help partners, investors and field teams discuss the same landscape from a shared evidence base. That creates stronger conversations and more disciplined decisions.']}
      ],
      bullets:['Compare different pathways early','Understand trade offs before scaling','Build more credible stories for partners and funders'],
      seo:['Topical relevance around cocoa landscapes','Clear primary keyword in the title','Scannable headings and supporting bullets','Path back to deeper product and case study pages']
    },
    reporting:{
      slug:'blog-report-design',
      tag:'Communication',
      title:'Designing reports that teams will actually use',
      image:'' + window.FT_ASSETS + '/investor-hero-v8.webp',
      author:'FarmTree Editorial Team',
      role:'Reporting and communication',
      read:'4 min read',
      date:'26 April 2026',
      excerpt:'Strong reports help people move from information to action with less friction and more confidence.',
      intro:'Premium communication is not about adding more pages. It is about shaping the story so the right insight appears at the right moment.',
      body:[
        'A report should help people move. If it feels heavy, unclear or overcomplicated, it will sit unread. Premium communication is not about adding more pages. It is about shaping the story so the right insight appears at the right moment.',
        'The strongest reports combine structure and restraint. They use clean language, thoughtful visuals and a sequence that respects how decision makers think. What matters first. What matters next. What creates confidence. That simple discipline turns outputs into practical tools.',
        'FarmTree has an opportunity to present technical results with more warmth and more elegance. When data feels accessible, teams are more likely to return to it, trust it and act on it.'
      ],
      sections:[
        {h:'Make the message scannable', ps:['Readers should be able to understand the core message within a few seconds. That means meaningful headings, clear pull points and visuals that clarify rather than decorate.']},
        {h:'Design for committees and partners', ps:['Reports often move across internal teams, funders and external stakeholders. The more coherent the visual hierarchy, the more likely the report will be used, remembered and shared.']}
      ],
      bullets:['Lead with the key message','Use visuals that clarify, not decorate','Keep tone human and confident'],
      seo:['Semantic article markup','Helpful summaries and metadata','Clear calls to action','Related article discovery paths']
    }
  };

  function whenStable(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>setTimeout(fn, 80));
    else setTimeout(fn, 80);
  }

  function setImage(selector, src, alt){
    const img = document.querySelector(selector);
    if(img){ img.src = src; if(alt) img.alt = alt; }
  }

  function refreshHome(){
    setImage('#page-home .split-feature.reverse .feature-image img','' + window.FT_ASSETS + '/home-project-teams-v11.ll.webp','Project team planning agroforestry scenarios in the field');
    setImage('#page-home .section.cream .feature-image img','' + window.FT_ASSETS + '/home-deep-roots-v11.png','FarmTree field consultation in an agroforestry landscape');
    const diagramIntro = document.querySelector('#page-home #diagram + p.lead');
    if(diagramIntro) diagramIntro.classList.add('ft-diagram-intro');
    const metrics = document.querySelectorAll('#page-home #frank-phase-journey .ft-counter-card span');
    if(metrics.length >= 4){
      metrics[0].textContent = 'long-term scenario planning horizon';
      metrics[1].textContent = 'flagship proof stories prepared';
      metrics[2].textContent = 'project phases clarified for buyers';
      metrics[3].textContent = 'reporting and monitoring narrative';
    }
  }

  function renderImprovedDiagram(){
    const diagram = document.getElementById("diagram");
    if(!diagram) return;
    diagram.innerHTML = `
      <figure class="ft-simple-diagram ft-final-ecosystem" aria-label="FarmTree model system diagram">
        <img loading="lazy" decoding="async" src="${window.FT_ASSETS}/base-technology/home-ecosystem-current-brand.webp" alt="FarmTree model infographic showing site information, automatic upload, species database, impact monitoring and impact projection"/>
      </figure>`;
  }

  function renderBlogIndex(){
    const page = document.getElementById('page-blog');
    if(!page) return;
    const featured = V8_POSTS.fieldnotes;
    const cards = Object.values(V8_POSTS).map(post => `
      <article class="ft-blog-story-card">
        <div class="ft-blog-story-image"><img loading="lazy" decoding="async" src="${post.image}" alt="${post.title}"></div>
        <div class="ft-blog-story-body">
          <div class="label">${post.tag}</div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="ft-blog-story-meta"><span>${post.author}</span><span>${post.read}</span><span>${post.date}</span></div>
          <button class="outline-btn" type="button" data-page="${post.slug}">Read article ↗</button>
        </div>
      </article>`).join('');

    page.innerHTML = `
      <div class="ft-blog-index">
        <div class="ft-blog-topbar">
          <div>
            <div class="ft-blog-eyebrow">FarmTree Blog</div>
            <h1 style="font-size:clamp(40px,4.6vw,68px);line-height:.94;letter-spacing:-.05em;color:#173428;margin-top:14px">Ideas, field notes and platform thinking for modern agroforestry work</h1>
            
          </div>
          <div class="ft-blog-actions"><button class="primary" type="button" data-ftmodal="request">Talk to FarmTree</button><a class="secondary" data-ft-action="platform-login" href="https://tool.farmtree.earth/Identity/Account/Login">Explore the platform</a></div>
        </div>
        <div class="ft-blog-category-bar"><a href="#">All topics</a><a href="#">Field insight</a><a href="#">Operations</a><a href="#">Landscape thinking</a><a href="#">Communication</a></div>
        <div class="ft-blog-featured">
          <article class="ft-blog-feature-card">
            <img loading="lazy" decoding="async" src="${featured.image}" alt="${featured.title}">
            <div class="ft-blog-feature-inner">
              <div class="meta"><span>${featured.tag}</span><span>${featured.author}</span><span>${featured.read}</span><span>${featured.date}</span></div>
              <h1>${featured.title}</h1>
              <p>${featured.excerpt} ${featured.intro}</p>
              <div class="ft-blog-actions"><button class="primary" type="button" data-page="${featured.slug}">Read featured article ↗</button><button class="secondary" type="button" data-ftmodal="request">Request a conversation</button></div>
            </div>
          </article>
          <aside class="ft-blog-sidebar">
            <div class="ft-blog-side-card"><h3>Why this blog matters</h3><p>A thoughtful editorial section helps FarmTree feel more human, more expert and easier to trust. It keeps visitors engaged and creates a stronger bridge between platform value, field realities and stakeholder communication.</p></div>
            
            <div class="ft-blog-side-card"><h3>Contributors</h3><div class="author-list"><div class="ft-author-mini"><div class="ft-author-avatar">FT</div><div><strong>FarmTree Editorial Team</strong><div class="ft-u-muted14">Platform thinking and field communication</div></div></div><div class="ft-author-mini"><div class="ft-author-avatar">AG</div><div><strong>Agroforestry Specialists</strong><div class="ft-u-muted14">Project planning and implementation insight</div></div></div></div></div>
          </aside>
        </div>
        <div class="ft-blog-grid-title"><div><h2>Latest articles</h2><p>Each article opens in its own dedicated page so the reading experience feels calmer and more complete.</p></div><button class="outline-btn" type="button" data-ftmodal="request">Suggest a topic</button></div>
        <div class="ft-blog-list-grid">${cards}</div>
        <div class="ft-blog-bottom-band">
          <div class="ft-blog-band-card"><h3>Editorial direction for FarmTree</h3><p>The most valuable articles will likely combine practical lessons, use-case narratives, implementation reflections and reporting advice. This mirrors the commercial story of the site while helping FarmTree rank for clearer topic clusters over time.</p></div>
          <div class="ft-blog-band-card"><h3>Next SEO ready step</h3><p>Expand the article library, add structured metadata per article when the content moves into the real CMS, and link every article to a relevant service, case study or product page.</p><div class="ft-blog-actions"><button class="primary" type="button" data-page="contact">Contact us</button></div></div>
        </div>
      </div>`;
  }

  function ensurePostPages(){
    const anchor = document.getElementById('page-blog');
    if(!anchor || !anchor.parentNode) return;
    Object.values(V8_POSTS).forEach(post=>{
      let page = document.getElementById('page-' + post.slug);
      if(!page){
        page = document.createElement('section');
        page.className = 'page';
        page.id = 'page-' + post.slug;
        anchor.insertAdjacentElement('afterend', page);
      }
      page.innerHTML = `
        <div class="ft-post-page">
          <div class="ft-post-breadcrumb"><button type="button" data-page="blog">Blog</button><span>›</span><span>${post.tag}</span><span>›</span><span>${post.title}</span></div>
          <div class="ft-post-hero">
            <div class="ft-post-hero-card">
              <img loading="lazy" decoding="async" src="${post.image}" alt="${post.title}">
              <div class="ft-post-hero-inner">
                <div class="tag">${post.tag}</div>
                <h1>${post.title}</h1>
                <div class="ft-post-meta"><span>${post.author}</span><span>${post.role}</span><span>${post.read}</span><span>${post.date}</span></div>
              </div>
            </div>
          </div>
          <div class="ft-post-layout">
            <article>
              <p><strong>Article summary:</strong> ${post.intro}</p>
              ${post.body.map(p=>`<p>${p}</p>`).join('')}
              ${post.sections.map(section=>`<h2>${section.h}</h2>${section.ps.map(p=>`<p>${p}</p>`).join('')}`).join('')}
              <h2>Key takeaways</h2>
              <ul>${post.bullets.map(item=>`<li>${item}</li>`).join('')}</ul>
              <h2>SEO and structure notes</h2>
              <ul>${post.seo.map(item=>`<li>${item}</li>`).join('')}</ul>
            </article>
            <aside class="ft-post-sidebar">
              <div class="ft-post-side-card"><h3>About the author</h3><p><strong>${post.author}</strong><br>${post.role}</p><p style="margin-top:10px">FarmTree content combines field pragmatism, platform thinking and clear communication for decision makers.</p></div>
              <div class="ft-post-side-card"><h3>In this article</h3><ul>${post.sections.map(section=>`<li>${section.h}</li>`).join('')}<li>Key takeaways</li><li>SEO and structure notes</li></ul></div>
              <div class="ft-post-side-card"><h3>Next step</h3><p>If this topic connects with a real project, use the contact flow to discuss how FarmTree can support planning, reporting or stakeholder communication.</p><button class="outline-btn" type="button" data-ftmodal="request" style="margin-top:12px">Talk to FarmTree</button></div>
            </aside>
          </div>
        </div>`;
    });
  }

  function rebuildUseCasePages(){
    var investor = document.getElementById('page-investors');
    if(investor){
      investor.innerHTML = [
        '<div class="ft-aud-page">',

        /* 1 — SUBHERO */
        '<div class="subhero ft-u-minh72">',
          '<img loading="lazy" decoding="async" src="' + window.FT_ASSETS + '/investor-hero-v8.webp" alt="Investment review of agroforestry scenarios">',
          '<div class="container">',
            '<div class="ft-cs-phase"><span class="ft-cs-phase-dot"></span>For investors &amp; climate finance</div>',
            '<h1 style="max-width:860px">Make agroforestry investment decisions with scientific confidence</h1>',
            '<p class="lead ft-u-heronote-660">FarmTree gives investment teams the scenario intelligence they need before capital is committed — and the monitoring framework to track performance long after it is.</p>',
            '<div class="ft-aud-hero-btns">',
              '<button class="pill contact" type="button" data-ftmodal="request">Book an investment review</button>',
              '<button class="ft-aud-btn-ghost" type="button" data-page="case-acorn">Explore ACORN case study</button>',
            '</div>',
          '</div>',
        '</div>',

        /* 2 — CHALLENGES */
        '<section class="ft-aud-section cream">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">The challenge</span>',
            '<h2 class="ft-aud-h2">Why agroforestry investment is hard to evaluate</h2>',
            '<p class="ft-aud-lead">Agroforestry projects are scientifically complex and commercially uncertain. Getting the analysis right requires more than spreadsheets.</p>',
            '<div class="ft-aud-problem-grid">',
              '<div class="ft-aud-problem-card"><h3>Opaque assumptions</h3><p>Projects often arrive with loosely documented species choices, yield estimates and carbon projections that are difficult to verify, stress-test or compare across geographies.</p></div>',
              '<div class="ft-aud-problem-card"><h3>Slow due diligence</h3><p>Getting credible, site-specific projections typically requires engaging external consultants for months — introducing delays, inconsistent methods and high coordination costs.</p></div>',
              '<div class="ft-aud-problem-card"><h3>No common framework</h3><p>Without a shared modelling methodology, comparing two agroforestry projects — or two scenarios for the same project — is difficult and often subjective.</p></div>',
            '</div>',
          '</div>',
        '</section>',

        /* 3 — VALUE */
        '<section class="ft-aud-section">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">How FarmTree helps</span>',
            '<h2 class="ft-aud-h2">From uncertain assumptions to investor-ready scenarios</h2>',
            '<div class="ft-aud-grid-4">',
              '<div class="ft-aud-card"><div class="ft-aud-icon">⊞</div><h3>Scenario comparison</h3><p>Compare land-use interventions, species mixes and investment structures using the same science-based methodology — no more apples-to-oranges analysis.</p></div>',
              '<div class="ft-aud-card"><div class="ft-aud-icon">◈</div><h3>Evidence-based projections</h3><p>Carbon, biomass, farmer income and financial returns modelled using peer-reviewed methods and calibrated to local species and climate data.</p></div>',
              '<div class="ft-aud-card"><div class="ft-aud-icon">⊙</div><h3>Risk and confidence framing</h3><p>Translate agricultural assumptions into a language investors understand — expected ranges, sensitivity to key variables and a confidence level per output.</p></div>',
              '<div class="ft-aud-card"><div class="ft-aud-icon">↗</div><h3>Investor-ready narratives</h3><p>Export scenario summaries that support committee review and co-investment conversations without requiring technical interpretation from the investment team.</p></div>',
            '</div>',
          '</div>',
        '</section>',

        /* 4 — DATA CREDIBILITY */
        '<div class="ft-aud-data-band">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label ft-u-gold">Platform depth</span>',
            '<h2 class="ft-aud-h2 ft-u-white-mb28">The science behind the investment case</h2>',
            '<div class="ft-aud-kpi-strip">',
              '<div class="ft-aud-kpi"><strong>+10</strong><span>Impact KPIs modelled per scenario — carbon, income, water, biodiversity and more</span></div>',
              '<div class="ft-aud-kpi"><strong>50 yrs</strong><span>Long-term projection horizon for planning, investment cases and monitoring</span></div>',
              '<div class="ft-aud-kpi"><strong>+900</strong><span>Species in the CAFS database — local calibration for any geography</span></div>',
              '<div class="ft-aud-kpi"><strong>4</strong><span>Interconnected model domains running in parallel for each scenario</span></div>',
            '</div>',
            '<div class="ft-aud-model-strip">',
              '<div class="ft-aud-model-pill">Carbon<span>Biomass, carbon stock and CRU projections by species</span></div>',
              '<div class="ft-aud-model-pill">Production &amp; Finance<span>Yields, revenues, cash flows and profitability</span></div>',
              '<div class="ft-aud-model-pill">Environment<span>Water balance, soil, nutrients, biodiversity</span></div>',
              '<div class="ft-aud-model-pill">Landscape<span>Multi-site portfolio and programme aggregation</span></div>',
            '</div>',
          '</div>',
        '</div>',

        /* 5 — USE CASES */
        '<section class="ft-aud-section cream">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">How it works in practice</span>',
            '<h2 class="ft-aud-h2">Three ways investors use FarmTree</h2>',
            '<div class="ft-aud-usecase-list">',
              '<div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">01</div><div class="ft-aud-usecase-body"><h3>Pre-investment portfolio screening</h3><p>Run comparative scenario analysis across project candidates before committing capital — using a consistent scientific methodology that makes trade-offs visible and assumptions transparent.</p></div></div>',
              '<div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">02</div><div class="ft-aud-usecase-body"><h3>Investment case preparation</h3><p>Build a structured, science-backed investment narrative that holds up to institutional review — covering carbon, farmer economics, environmental indicators and financial return expectations.</p></div></div>',
              '<div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">03</div><div class="ft-aud-usecase-body"><h3>Post-investment performance monitoring</h3><p>Connect field monitoring data with FarmTree baselines to track whether projects are performing as modelled — and identify where adjustments are needed before the next reporting cycle.</p></div></div>',
            '</div>',
          '</div>',
        '</section>',

        /* 6 — PROOF */
        '<section class="ft-aud-section">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">Real project experience</span>',
            '<h2 class="ft-aud-h2">Used by organisations with capital on the line</h2>',
            '<div class="ft-aud-proof-row">',
              '<div class="ft-aud-proof-quote">"FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue — they do everything."<span class="ft-aud-proof-attr">Mathijs de Bruin — TreeScape</span></div>',
              '<div class="ft-aud-case-link ft-u-pointer" data-page="case-acorn">',
                '<span class="ft-cs-section-label">Case study</span>',
                '<h3>ACORN / Rabobank carbon planning</h3>',
                '<p>FarmTree translated field data from smallholder programmes across three continents into consistent carbon and farmer value projections — enabling portfolio-level comparison for Rabobank\'s ACORN programme.</p>',
                '<span class="ft-aud-cta-link-btn">Read the case study ↗</span>',
              '</div>',
            '</div>',
          '</div>',
        '</section>',

        /* 7 — CTA */
        '<div class="ft-aud-cta-band">',
          '<div class="ft-aud-wrap">',
            '<h2>Ready to evaluate your agroforestry pipeline?</h2>',
            '<p>Book an investment review session with the FarmTree team. We\'ll walk you through a relevant scenario and discuss how FarmTree can support your due diligence process.</p>',
            '<div class="ft-aud-cta-btns">',
              '<button class="pill contact" type="button" data-ftmodal="request">Book an investment review</button>',
              '<button class="ft-aud-btn-ghost" type="button" data-page="contact">Contact the team</button>',
            '</div>',
          '</div>',
        '</div>',

        '</div>' /* ft-aud-page */
      ].join('');
    }

    var ngos = document.getElementById('page-ngos');
    if(ngos){
      ngos.innerHTML = [
        '<div class="ft-aud-page">',

        /* 1 — SUBHERO */
        '<div class="subhero ft-u-minh72">',
          '<img loading="lazy" decoding="async" src="' + window.FT_ASSETS + '/implementers-hero-v7_opt.webp" alt="Field team planning and community coordination">',
          '<div class="container">',
            '<div class="ft-cs-phase"><span class="ft-cs-phase-dot"></span>For implementing partners &amp; field teams</div>',
            '<h1 style="max-width:840px">Clearer planning, better reporting, stronger field decisions</h1>',
            '<p class="lead ft-u-heronote-660">FarmTree helps implementation teams move from fragmented manual planning to consistent, science-backed workflows — designed for the realities of field implementation.</p>',
            '<div class="ft-aud-hero-btns">',
              '<button class="pill contact" type="button" data-ftmodal="request">Explore team workflow</button>',
              '<button class="ft-aud-btn-ghost" type="button" data-page="case-nyando">Read the Nyando case study</button>',
            '</div>',
          '</div>',
        '</div>',

        /* 2 — CHALLENGES */
        '<section class="ft-aud-section cream">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">The challenge</span>',
            '<h2 class="ft-aud-h2">Why field implementation is harder than it looks on paper</h2>',
            '<p class="ft-aud-lead">Implementation teams carry the gap between programme design and field reality — often with limited tools, tight timelines and rising reporting demands.</p>',
            '<div class="ft-aud-problem-grid">',
              '<div class="ft-aud-problem-card"><h3>Manual and disconnected</h3><p>Field planning, monitoring data and partner reporting often live in separate spreadsheets — creating inconsistency, duplication and gaps in the evidence trail that funders eventually notice.</p></div>',
              '<div class="ft-aud-problem-card"><h3>Assumptions that drift</h3><p>Without a shared planning framework, species choices, yield expectations and carbon estimates vary between team members and projects — making it hard to build a coherent programme picture or credible investment case.</p></div>',
              '<div class="ft-aud-problem-card"><h3>Reporting burden</h3><p>Preparing donor updates, partner communication and monitoring reports consumes time and energy that could be spent on implementation — especially when data is not structured for reporting from the start.</p></div>',
            '</div>',
          '</div>',
        '</section>',

        /* 3 — VALUE */
        '<section class="ft-aud-section">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">How FarmTree helps</span>',
            '<h2 class="ft-aud-h2">A planning and reporting foundation built for field teams</h2>',
            '<div class="ft-aud-grid-4">',
              '<div class="ft-aud-card"><div class="ft-aud-icon">⊞</div><h3>Structured field planning</h3><p>Define species choices, planting assumptions, labour needs and financial expectations before implementation — so field teams work from the same shared, documented foundation.</p></div>',
              '<div class="ft-aud-card"><div class="ft-aud-icon">◉</div><h3>Local calibration</h3><p>FarmTree adjusts modelling parameters to match local species, climate conditions, soil types and land-use histories — giving teams projections that reflect their actual context, not generic defaults.</p></div>',
              '<div class="ft-aud-card"><div class="ft-aud-icon">↺</div><h3>Learning loops</h3><p>Compare observed field outcomes with modelled expectations over time — turning field data into a structured feedback process that improves both planning quality and reporting credibility.</p></div>',
              '<div class="ft-aud-card"><div class="ft-aud-icon">↗</div><h3>Partner-ready outputs</h3><p>Generate scenario summaries, impact reports and planning documents that can be shared directly with donors, community groups and institutional partners without additional formatting work.</p></div>',
            '</div>',
          '</div>',
        '</section>',

        /* 4 — DATA CREDIBILITY */
        '<div class="ft-aud-data-band">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label ft-u-gold">What the platform models</span>',
            '<h2 class="ft-aud-h2 ft-u-white-mb28">Science-backed planning indicators, calibrated locally</h2>',
            '<div class="ft-aud-kpi-strip">',
              '<div class="ft-aud-kpi"><strong>+900</strong><span>Species in the CAFS database for local calibration and science-backed modelling</span></div>',
              '<div class="ft-aud-kpi"><strong>50 yrs</strong><span>Projection horizon — long enough to show the full value of agroforestry to farmers and funders</span></div>',
              '<div class="ft-aud-kpi"><strong>4</strong><span>Planning phases supported — from design through implementation, monitoring and reporting</span></div>',
              '<div class="ft-aud-kpi"><strong>+10</strong><span>Impact KPIs modelled per scenario — covering farmer value, carbon and environmental outcomes</span></div>',
            '</div>',
            '<div class="ft-aud-model-strip">',
              '<div class="ft-aud-model-pill">Field planning<span>Species, assumptions, labour and financial logic</span></div>',
              '<div class="ft-aud-model-pill">Scenario comparison<span>Compare options before committing resources</span></div>',
              '<div class="ft-aud-model-pill">Monitoring<span>Connect field data with modelled baselines</span></div>',
              '<div class="ft-aud-model-pill">Reporting<span>Partner-ready outputs from the same data foundation</span></div>',
            '</div>',
          '</div>',
        '</div>',

        /* 5 — USE CASES */
        '<section class="ft-aud-section cream">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">How it works in practice</span>',
            '<h2 class="ft-aud-h2">Three ways implementation teams use FarmTree</h2>',
            '<div class="ft-aud-usecase-list">',
              '<div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">01</div><div class="ft-aud-usecase-body"><h3>Project planning and scoping</h3><p>Use FarmTree at the beginning of a new project to structure species, land-use and financial assumptions before implementation starts — giving the team a shared planning baseline that can be updated as conditions change in the field.</p></div></div>',
              '<div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">02</div><div class="ft-aud-usecase-body"><h3>Field team training and capacity building</h3><p>Help local project staff understand and apply FarmTree\'s planning logic to their specific context and community — reducing dependence on external experts and building internal technical capacity over time.</p></div></div>',
              '<div class="ft-aud-usecase-item"><div class="ft-aud-usecase-num">03</div><div class="ft-aud-usecase-body"><h3>Donor and partner reporting</h3><p>Generate consistent, science-backed monitoring updates and progress reports from the same planning data — reducing the administrative burden on field teams and improving the quality of evidence shared with funders.</p></div></div>',
            '</div>',
          '</div>',
        '</section>',

        /* 6 — PROOF */
        '<section class="ft-aud-section">',
          '<div class="ft-aud-wrap">',
            '<span class="ft-cs-section-label">Real project experience</span>',
            '<h2 class="ft-aud-h2">Used by field teams working in complex landscapes</h2>',
            '<div class="ft-aud-proof-row">',
              '<div class="ft-aud-proof-quote">"The FarmTree Tool and team helped us understand the value of different agroforestry systems and the potential for increased revenue over a few decades."<span class="ft-aud-proof-attr">Mona McCord — SAN</span></div>',
              '<div class="ft-aud-case-link ft-u-pointer" data-page="case-nyando">',
                '<span class="ft-cs-section-label">Case study</span>',
                '<h3>LOSO Nyando — water and landscape resilience</h3>',
                '<p>FarmTree modelled water balance, carbon and farmer value for the LOSO Nyando landscape programme in western Kenya — connecting field evidence with an investment-grade narrative for programme funders.</p>',
                '<span class="ft-aud-cta-link-btn">Read the case study ↗</span>',
              '</div>',
            '</div>',
          '</div>',
        '</section>',

        /* 7 — CTA */
        '<div class="ft-aud-cta-band">',
          '<div class="ft-aud-wrap">',
            '<h2>Ready to bring more structure to your field work?</h2>',
            '<p>Explore how FarmTree can fit into your planning and reporting workflow. The team will walk you through a relevant scenario and discuss what local calibration would look like for your context.</p>',
            '<div class="ft-aud-cta-btns">',
              '<button class="pill contact" type="button" data-ftmodal="request">Explore team workflow</button>',
              '<button class="ft-aud-btn-ghost" type="button" data-page="contact">Contact the team</button>',
            '</div>',
          '</div>',
        '</div>',

        '</div>' /* ft-aud-page */
      ].join('');
    }
  }

  whenStable(function(){
    refreshHome();
    renderImprovedDiagram();
    renderBlogIndex();
    ensurePostPages();
    rebuildUseCasePages();
    // Add blog button to top nav if missing
    const companyCard = Array.from(document.querySelectorAll('#mobileMenu .mobile-card')).find(card => /company/i.test((card.querySelector('h4')||{}).textContent || ''));
    if(companyCard && !companyCard.querySelector('[data-page="blog"]')){
      const btn = document.createElement('button'); btn.setAttribute('data-page','blog'); btn.textContent = 'Blog'; companyCard.appendChild(btn);
    }
  });
})();

/* ---- block 30 ---- */
(function(){
  const imgMap = {
    platform:'' + window.FT_ASSETS + '/investor-card-hero-v8.webp',
    projectTeams:'' + window.FT_ASSETS + '/home-project-teams-v11.ll.webp',
    deepRoots:'' + window.FT_ASSETS + '/home-deep-roots-v11.png',
    investorHero:'' + window.FT_ASSETS + '/investor-hero-v8.webp',
    implementerHero:'' + window.FT_ASSETS + '/implementers-hero-v7_opt.webp'
  };
  function q(sel){ return document.querySelector(sel); }
  function setImg(sel, src, alt){ const el=q(sel); if(el){ el.src=src; if(alt) el.alt=alt; } }
  function ensureBlogLinks(){
    document.querySelectorAll('.footer-links h3').forEach(h=>{
      if((h.textContent||'').trim().toLowerCase()==='about us'){
        const box=h.parentElement;
        if(box && !box.querySelector('[data-page="blog"]')){
          const b=document.createElement('button'); b.type='button'; b.setAttribute('data-page','blog'); b.textContent='Blog'; box.appendChild(b);
        }
      }
    });
    const companyCard=[...document.querySelectorAll('#mobileMenu .mobile-card')].find(c=>/company/i.test((c.querySelector('h4')||{}).textContent||''));
    if(companyCard && !companyCard.querySelector('[data-page="blog"]')){
      const b=document.createElement('button'); b.type='button'; b.setAttribute('data-page','blog'); b.textContent='Blog'; companyCard.appendChild(b);
    }
  }
  function updateHomeImages(){
    /* platform image intentionally handled by ft-app-slider, do not replace it */
    setImg('#page-home .split-feature.reverse .feature-image img', imgMap.projectTeams, 'Field team preparing agroforestry planning scenarios');
    setImg('#page-home .section.cream .feature-image img', imgMap.deepRoots, 'FarmTree agroforestry transformation landscape');
  }
  function refineContact(){
    document.querySelectorAll('#page-contact .outline-btn, #page-contact button').forEach(btn=>{
      if(/open request form/i.test(btn.textContent||'')){
        btn.removeAttribute('data-page');
        btn.setAttribute('data-ftmodal','request');
      }
    });
  }
  function refineUseCaseImages(){
    setImg('#page-investors .usecase-image img', imgMap.investorHero, 'Investor review of agroforestry climate finance scenarios');
    setImg('#page-ngos .usecase-image img', imgMap.implementerHero, 'Implementation teams coordinating agroforestry field work');
  }
  function refineBlog(){
    const blog=q('#page-blog');
    if(!blog) return;
    blog.querySelectorAll('p').forEach(p=>{ p.style.wordSpacing='normal'; });
    blog.querySelectorAll('button').forEach(b=>{ b.style.whiteSpace='nowrap'; });
  }
  function addDiagramLabels(){
    const copy=q('#page-home .ft-v8-ecosystem-copy');
    if(copy && !copy.querySelector('.ft-v9-diagram-note')){
      const note=document.createElement('div');
      note.className='ft-v9-diagram-note';
      note.style.cssText='margin-top:4px;padding:14px 16px;border-radius:18px;background:#F4F7F1;color:#173428;font-weight:700;line-height:1.55';
      note.textContent='A calmer visual rhythm keeps investors, platform logic, project work and outcome indicators in one readable system.';
      copy.appendChild(note);
    }
  }
  function patch(){ ensureBlogLinks(); updateHomeImages(); refineContact(); refineUseCaseImages(); refineBlog(); addDiagramLabels(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,220)); else setTimeout(patch,220);
  window.addEventListener('hashchange',()=>setTimeout(patch,260));
  document.addEventListener('click',()=>setTimeout(patch,260),true);
})();

/* ---- block 31 ---- */
(function(){
  const loader=document.getElementById('ftSiteLoader');
  const hide=()=>{ if(loader) loader.classList.add('is-hidden'); };
  window.addEventListener('load',()=>setTimeout(hide,650));
  setTimeout(hide,2600);
  document.addEventListener('DOMContentLoaded',()=>{
    const spots=[...document.querySelectorAll('.ft-diagram-hotspot')];
    let i=0;
    if(!spots.length) return;
    setInterval(()=>{
      spots.forEach(s=>s.classList.remove('is-active'));
      spots[i%spots.length].classList.add('is-active');
      setTimeout(()=>spots[i%spots.length]?.classList.remove('is-active'),1400);
      i++;
    },2600);
  });
})();

/* ---- block 32 ---- */
(function(){
  const launcher=document.getElementById('ftChatLauncher');
  const panel=document.getElementById('ftChatPanel');
  const close=document.getElementById('ftChatClose');
  const body=document.getElementById('ftChatBody');
  const input=document.getElementById('ftChatInput');
  const send=document.getElementById('ftChatSend');
  const form=document.getElementById('ftChatLeadForm');
  if(!launcher||!panel||!body||!input||!send) return;
  panel.classList.remove('open');

  const answers=[
    {keys:['what does','do','platform'],text:'FarmTree is a software model and online platform for agroforestry scenario planning. It helps teams compare carbon, finance, biodiversity, water and farmer income indicators before and during implementation.'},
    {keys:['demo','book','appointment','calendar','meeting'],text:'I can help you request a demo. Share your name, email and company, and the FarmTree team will follow up with you.',lead:true},
    {keys:['investor','fund','finance','capital'],text:'For investors, FarmTree turns field realities and assumptions into clearer investment narratives, risk framing and portfolio level decision support.'},
    {keys:['implementer','ngo','team','farmer'],text:'For implementers and NGOs, FarmTree supports field planning, data capture, learning loops and partner communication across agroforestry projects.'},
    {keys:['carbon','biodiversity','water','hydrology','income'],text:'FarmTree can model carbon, production and finance, environmental indicators, hydrology, biodiversity and farmer income across long term scenarios.'},
    {keys:['contact','email','phone'],text:'You can contact FarmTree through the contact page or leave your details here and the team can follow up.',lead:true}
  ];
  function add(text,type='bot'){
    const el=document.createElement('div');
    el.className='ft-chat-message '+type;
    el.textContent=text;
    body.appendChild(el);
    body.scrollTop=body.scrollHeight;
  }
  function respond(q){
    const s=q.toLowerCase();
    const found=answers.find(a=>a.keys.some(k=>s.includes(k)));
    const a=found||{text:'That is a good question. In this preview I can explain FarmTree, agroforestry planning, investor reporting, implementer workflows and demo requests. For a detailed answer, leave your contact details and the team can follow up.',lead:true};
    setTimeout(()=>{add(a.text,'bot'); if(a.lead) form.classList.add('open');},250);
  }
  function submit(){
    const q=input.value.trim();
    if(!q) return;
    add(q,'user');
    input.value='';
    respond(q);
  }
  launcher.addEventListener('click',()=>panel.classList.toggle('open'));
  close.addEventListener('click',()=>panel.classList.remove('open'));
  send.addEventListener('click',submit);
  input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
  body.querySelectorAll('.ft-chat-chip').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.q;add(q,'user');respond(q);}));
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(form).entries());
    const btn=form.querySelector('button[type="submit"]');
    if(btn) btn.disabled=true;
    window.ftSubmitLead({form:'chat-widget',...data,page:location.hash||'#home'})
      .then(()=>{
        form.classList.remove('open');
        form.reset();
        add('Thanks. Your request has been sent to the FarmTree team — they will follow up with you.','bot');
      })
      .catch(()=>{
        add('Sorry — your request could not be sent right now. Please try again in a moment, or use the contact page.','bot');
      })
      .finally(()=>{ if(btn) btn.disabled=false; });
  });
})();

/* ---- block 33 ---- */
(function(){
  function setSimpleDiagram(){
    const target = document.getElementById('diagram');
    if(!target) return;
    target.innerHTML = '<figure class="ft-simple-diagram" aria-label="FarmTree model system diagram"><img loading="lazy" decoding="async" src="' + window.FT_ASSETS + '/base-technology/home-ecosystem-current-brand.webp" alt="FarmTree model infographic showing site information, climate and terrain inputs, species database, impact monitoring and impact projection"></figure>';
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setSimpleDiagram); else setSimpleDiagram();
  window.addEventListener('load', setSimpleDiagram);
  window.addEventListener('hashchange', function(){ setTimeout(setSimpleDiagram, 80); setTimeout(setSimpleDiagram, 350); });
  const originalPush = history.pushState;
  history.pushState = function(){ const r = originalPush.apply(this, arguments); setTimeout(setSimpleDiagram, 80); return r; };
})();

/* ---- block 34 ---- */
(function(){
  function startPlatformSlider(){
    var slider=document.querySelector('.ft-app-slider');
    if(!slider || slider.dataset.ready==='1') return;
    slider.dataset.ready='1';
    var slides=[].slice.call(slider.querySelectorAll('.ft-app-slide'));
    var dots=[].slice.call(slider.querySelectorAll('.ft-app-dots span'));
    if(slides.length<2) return;
    var i=0;
    setInterval(function(){
      slides[i].classList.remove('active');
      if(dots[i]) dots[i].classList.remove('active');
      i=(i+1)%slides.length;
      slides[i].classList.add('active');
      if(dots[i]) dots[i].classList.add('active');
    }, 3600);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', startPlatformSlider); else startPlatformSlider();
  document.addEventListener('click', function(){setTimeout(startPlatformSlider,80);});
  window.addEventListener('hashchange', function(){setTimeout(startPlatformSlider,120);});
})();

/* ---- block 35 ---- */
(function(){
  function forcePlatformSlider(){
    /* Phase 6: slider replaced with CSS platform mockup — no-op */
    var slider=document.querySelector('#page-home .ft-platform-screenshot-block .ft-app-slider');
    if(!slider) return;
    if(slider.dataset.finalSliderStarted==='1') return;
    slider.dataset.finalSliderStarted='1';
    var i=0;
    setInterval(function(){
      var slides=[].slice.call(slider.querySelectorAll('.ft-app-slide'));
      var dots=[].slice.call(slider.querySelectorAll('.ft-app-dots span'));
      if(slides.length<2) return;
      slides[i].classList.remove('active'); if(dots[i]) dots[i].classList.remove('active');
      i=(i+1)%slides.length;
      slides[i].classList.add('active'); if(dots[i]) dots[i].classList.add('active');
    }, 3600);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', forcePlatformSlider); else forcePlatformSlider();
  window.addEventListener('load', forcePlatformSlider);
  window.addEventListener('hashchange', function(){setTimeout(forcePlatformSlider,80); setTimeout(forcePlatformSlider,400);});
  document.addEventListener('click', function(){setTimeout(forcePlatformSlider,80);});
})();

/* ---- block 36 ---- */
(function(){
  function show(id){ var el=document.getElementById(id); if(el) el.style.display='block'; }
  function hide(id){ var el=document.getElementById(id); if(el) el.style.display='none'; }
  function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  document.addEventListener('submit', function(e){
    var form = e.target;
    if(form.id !== 'ftRequestPageForm') return;
    e.preventDefault();

    var name    = document.getElementById('ftReqName');
    var email   = document.getElementById('ftReqEmail');
    var company = document.getElementById('ftReqCompany');
    var ok = true;

    hide('ftReqNameErr'); hide('ftReqEmailErr'); hide('ftReqCompanyErr');

    if(!name || !name.value.trim()){
      show('ftReqNameErr'); if(name) name.style.borderColor='rgba(255,150,60,.7)'; ok=false;
    } else { if(name) name.style.borderColor=''; }

    if(!email || !isEmail(email.value.trim())){
      show('ftReqEmailErr'); if(email) email.style.borderColor='rgba(255,150,60,.7)'; ok=false;
    } else { if(email) email.style.borderColor=''; }

    if(!company || !company.value.trim()){
      show('ftReqCompanyErr'); if(company) company.style.borderColor='rgba(255,150,60,.7)'; ok=false;
    } else { if(company) company.style.borderColor=''; }

    if(!ok) return;

    /* Submit to the real endpoint, then show success or error feedback */
    var btn = document.getElementById('ftReqSubmit');
    hide('ftReqSubmitErr');
    if(btn) btn.disabled = true;

    var payload = {
      form: 'request-page',
      _gotcha: (document.getElementById('ftReqHp')||{}).value || '',
      name: name ? name.value.trim() : '',
      email: email ? email.value.trim() : '',
      company: company ? company.value.trim() : '',
      role: (document.getElementById('ftReqRole')||{}).value || '',
      phone: (document.getElementById('ftReqPhone')||{}).value || '',
      website: (document.getElementById('ftReqWeb')||{}).value || '',
      interest: (document.getElementById('ftReqInterest')||{}).value || '',
      message: (document.getElementById('ftReqMsg')||{}).value || ''
    };

    window.ftSubmitLead(payload).then(function(){
      var wrap = document.getElementById('ftRequestFormWrap');
      var success = document.getElementById('ftRequestSuccess');
      if(wrap) wrap.style.display = 'none';
      if(success) success.style.display = 'block';
      window.scrollTo(0,0);
    }).catch(function(){
      show('ftReqSubmitErr');
    }).finally(function(){
      if(btn) btn.disabled = false;
    });
  });
})();

/* ---- block 37 ---- */
(function(){
  function initFaqToggle(){
    var btn = document.getElementById('ftFaqToggleBtn');
    var grid = document.querySelector('.ft-faq-grid');
    if(!btn || !grid) return;

    btn.addEventListener('click', function(){
      var isOpen = grid.classList.toggle('ft-faq-expanded');
      btn.textContent = isOpen ? 'Show fewer questions' : 'Browse all questions';
      if(isOpen){
        grid.scrollIntoView({ behavior:'smooth', block:'nearest' });
        /* Briefly highlight the cards */
        grid.querySelectorAll('article').forEach(function(card, i){
          setTimeout(function(){
            card.style.transition = 'box-shadow .25s ease';
            card.style.boxShadow = '0 0 0 2px rgba(46,106,53,.35)';
            setTimeout(function(){ card.style.boxShadow = ''; }, 600);
          }, i * 60);
        });
      }
    });
  }
  document.addEventListener('DOMContentLoaded', initFaqToggle);
  /* Also run after any dynamic rendering */
  setTimeout(initFaqToggle, 800);
})();

/* ---- block 38 ---- */
(function(){
'use strict';

/* ── MASTER TRANSLATION DICTIONARY ──────────────────────────── */
/* NL = Dutch (professional quality for UI; body copy needs native review)  */
/* DE = German (professional quality for UI; body copy needs native review) */
var FT_DICT = {

  en: {
    /* Navigation */
    'nav.home':      'Home',
    'nav.solutions': 'Solutions',
    'nav.track':     'Track Record',
    'nav.platform':  'FarmTree Platform',
    'nav.videos':    'User Videos',
    'nav.cocoa':     'Cocoa Focus',
    'nav.team':      'Team',
    'nav.vacancies': 'Vacancies',
    'nav.contact':   'Contact us',
    'nav.blog':      'Blog',
    'nav.request':   'Request a demo',
    'nav.ack':       'Acknowledgements',
    'nav.licenses':  'Licenses',
    'nav.contact.btn': 'Contact',

    /* Header buttons */
    'btn.platform':  'FarmTree Platform',
    'btn.signin':    'Sign in',

    /* Mobile menu section headings */
    'mob.main':      'Main',
    'mob.farmtree':  'FarmTree',
    'mob.company':   'Company',
    'mob.legal':     'Forms & Legal',

    /* Hero kickers (slide labels) */
    'hero.s1.kicker': 'Agroforestry Planning',
    'hero.s1.title':  'Plan and Report on Agroforestry Investments',
    'hero.s1.text':   'Create credible projections for environmental impact, farmer value, and long-term investment decisions.',
    'hero.s2.kicker': 'Science-Based Modelling',
    'hero.s2.title':  'Turn Field Data into Investment Scenarios',
    'hero.s2.text':   'Connect climate, soil, species, and project assumptions into clear science-backed projections.',
    'hero.s3.kicker': 'Project Teams',
    'hero.s3.title':  'Support Local Teams with Clearer Planning Tools',
    'hero.s3.text':   'Help project staff compare agroforestry options, understand trade-offs, and communicate value with confidence.',
    'hero.s4.kicker': 'Impact Reporting',
    'hero.s4.title':  'Report Carbon, Farmer Value and Long-Term Performance',
    'hero.s4.text':   'Translate project results into clear reporting for investors, donors, MRV partners, and programme teams.',

    /* CTA buttons */
    'cta.demo':      'Request a demo',
    'cta.quote':     'Ask for a quotation',
    'cta.demofull':  'Request a FarmTree demo ↗',
    'cta.platform':  'FarmTree Platform',
    'cta.explore':   'Explore platform',
    'cta.readmore':  'Read more ↗',
    'cta.learnmore': 'Learn more ↗',
    'cta.contact':   'Contact the team',

    /* Section kickers */
    'kicker.about':       'About FarmTree',
    'kicker.platform':    'The FarmTree Platform',
    'kicker.journey':     'Project journey',
    'kicker.references':  'References',
    'kicker.usecases':    'Use cases',
    'kicker.cases':       'Case studies',
    'kicker.proof':       'Proof stories',
    'kicker.testimonials':'Testimonials',
    'kicker.commercial':  'Commercial layer',
    'kicker.partners':    'Partner perspectives',
    'kicker.faq':         'FAQ',
    'kicker.nextstep':    'Next step',
    'kicker.contact':     'Contact us',
    'kicker.takeaction':  'Take action',
    'kicker.news':        'Latest updates',

    /* FAQ */
    'faq.heading':   'Questions about FarmTree modelling?',
    'faq.sub':       'Common questions about agroforestry modelling, the FarmTree Platform and how to get started. Can\'t find what you need? Contact us directly.',
    'faq.btn':       'Browse all questions',
    'faq.q1':        'What does FarmTree model?',
    'faq.a1':        'FarmTree models production, carbon, hydrology, soil fertility, labour, economics and other impact indicators.',
    'faq.q2':        'Can FarmTree support investment planning?',
    'faq.a2':        'Yes. It helps turn project ideas and local assumptions into credible scenarios and investment cases.',
    'faq.q3':        'How far ahead can FarmTree project?',
    'faq.a3':        'FarmTree can support 50-year projections for planning, investment cases and monitoring.',
    'faq.q4':        'Can local teams use the platform?',
    'faq.a4':        'Yes. Project staff can learn to prepare plans and show options without relying fully on external consultants.',
    'faq.q5':        'How do we request a quote?',
    'faq.a5':        'Use the "Request a demo" or "Ask for a quotation" button anywhere on the site. The FarmTree team will follow up to discuss your scope, context and the right level of support.',

    /* Footer */
    'footer.tagline':   'Join us in growing better agroforestry decisions.',
    'footer.aboutus':   'About Us',
    'footer.platf':     'Platform',
    'footer.address':   'FarmTree B.V.',
    'footer.copy':      'Copyright © 2026 FarmTree B.V. All rights reserved.',

    /* Contact page */
    'contact.heading': 'How can we help?',
    'contact.open':    'Open request form',

    /* Request form */
    'form.heading':    'Contact Us',
    'form.sub':        'Fill in the fields below and the FarmTree team will follow up within one business day.',
    'form.name':       'Name *',
    'form.email':      'Email address *',
    'form.company':    'Company name *',
    'form.role':       'Job title',
    'form.phone':      'Mobile phone',
    'form.website':    'Company website',
    'form.interest':   'What are you interested in?',
    'form.message':    'Message',
    'form.submit':     'Submit request',
    'form.ph.name':    'Enter your name here',
    'form.ph.email':   'Enter your email',
    'form.ph.company': 'Start typing...',
    'form.ph.website': 'Enter link',
    'form.ph.msg':     'Tell us about your project',

    /* Success state */
    'form.success.heading': 'Thank you.',
    'form.success.body':    'The FarmTree team will review your request and be in touch within one business day.',
    'form.success.again':   'Send another request',

    /* Track Record */
    'track.heading':   'Track Record database for FarmTree projects',
    'track.users':     'Active users',
    'track.projects':  'Projects',
    'track.regions':   'Regions',

    /* Platform page */
    'plat.heading':    'A software model and online interface for agroforestry scenarios',
    'plat.sub':        'Design agroforestry scenarios and project carbon, financial and environmental indicators for up to 50 years.',
    'plat.method':     'Model methodology',

    /* Solutions page */
    'services.heading': 'From expert led planning to independent operation',

    /* Pricing page */
    'pricing.heading':  'Scope-based pricing for modelling, reporting and platform support',
    'pricing.sub':      'Talk to us about your scope and we will propose the right combination of services, platform access and support.',

    /* Vacancies */
    'vacancies.heading': 'Join us and help the world quantify trees',
  },

  /* ── DUTCH (NL) ──────────────────────────────────────────── */
  /* [NEEDS_NATIVE_REVIEW] marks professional placeholder translations */
  nl: {
    'nav.home':      'Home',
    'nav.solutions': 'Oplossingen',
    'nav.track':     'Track Record',
    'nav.platform':  'FarmTree Platform',
    'nav.videos':    'Gebruikersvideo\'s',
    'nav.cocoa':     'Cacao Focus',
    'nav.team':      'Team',
    'nav.vacancies': 'Vacatures',
    'nav.contact':   'Neem contact op',
    'nav.blog':      'Blog',
    'nav.request':   'Demo aanvragen',
    'nav.ack':       'Dankwoord',
    'nav.licenses':  'Licenties',
    'nav.contact.btn': 'Contact',

    'btn.platform':  'FarmTree Platform',

    'mob.main':      'Hoofdmenu',
    'mob.farmtree':  'FarmTree',
    'mob.company':   'Over ons',
    'mob.legal':     'Formulieren & Juridisch',

    /* Hero slides */
    'hero.s1.kicker': 'Agroforestry Planning',
    'hero.s1.title':  'Plan en rapporteer over agroforestry-investeringen',
    'hero.s1.text':   'Maak betrouwbare prognoses voor milieu-impact, waarde voor boeren en investeringsbeslissingen op lange termijn.',
    'hero.s2.kicker': 'Wetenschappelijk Modelleren',
    'hero.s2.title':  'Vertaal velddata naar investeringsscenario\'s',
    'hero.s2.text':   'Combineer klimaat, bodem, soorten en projectaannames in heldere, wetenschappelijk onderbouwde prognoses.',
    'hero.s3.kicker': 'Projectteams',
    'hero.s3.title':  'Ondersteun lokale teams met duidelijkere planningstools',
    'hero.s3.text':   'Help projectmedewerkers agroforestry-opties vergelijken, afwegingen begrijpen en waarde communiceren met vertrouwen.',
    'hero.s4.kicker': 'Impact Rapportage',
    'hero.s4.title':  'Rapporteer over koolstof, waarde voor boeren en langetermijnprestaties',
    'hero.s4.text':   'Zet projectresultaten om in heldere rapportage voor investeerders, donoren, MRV-partners en programmatische teams.',

    'cta.demo':      'Demo aanvragen',
    'cta.quote':     'Offerte aanvragen',
    'cta.demofull':  'Vraag een FarmTree demo aan ↗',
    'cta.platform':  'FarmTree Platform',
    'cta.explore':   'Platform verkennen',
    'cta.readmore':  'Lees meer ↗',
    'cta.learnmore': 'Meer informatie ↗',
    'cta.contact':   'Neem contact op',

    'kicker.about':        'Over FarmTree',
    'kicker.platform':     'Het FarmTree Platform',
    'kicker.journey':      'Projectreis',
    'kicker.references':   'Referenties',
    'kicker.usecases':     'Toepassingen',
    'kicker.cases':        'Casestudies',
    'kicker.proof':        'Bewijs',
    'kicker.testimonials': 'Testimonials',
    'kicker.commercial':   'Commercieel',
    'kicker.partners':     'Partnerperspectief',
    'kicker.faq':          'FAQ',
    'kicker.nextstep':     'Volgende stap',
    'kicker.contact':      'Neem contact op',
    'kicker.takeaction':   'Onderneem actie',
    'kicker.news':         'Laatste updates',

    'faq.heading':   'Vragen over agroforestry-modellering? We helpen u graag.',
    'faq.sub':       'Veelgestelde vragen over agroforestry-modellering, het FarmTree Platform en hoe u kunt beginnen.',
    'faq.btn':       'Alle vragen bekijken',
    'faq.q1':        'Wat modelleert FarmTree?',
    'faq.a1':        'FarmTree modelleert productie, koolstof, hydrologie, bodemvruchtbaarheid, arbeid, economie en andere impactindicatoren.',
    'faq.q2':        'Kan FarmTree investeringsplanning ondersteunen?',
    'faq.a2':        'Ja. Het helpt om projectideeën en lokale aannames te vertalen naar geloofwaardige scenario\'s en investeringsplannen.',
    'faq.q3':        'Hoe ver vooruit kan FarmTree projecteren?',
    'faq.a3':        'FarmTree ondersteunt prognoses tot 50 jaar vooruit voor planning, investeringsplannen en monitoring.',
    'faq.q4':        'Kunnen lokale teams het platform gebruiken?',
    'faq.a4':        'Ja. Projectmedewerkers kunnen leren om plannen op te stellen zonder volledig afhankelijk te zijn van externe consultants.',
    'faq.q5':        'Hoe kunnen we een offerte aanvragen?',
    'faq.a5':        'Gebruik de knop "Demo aanvragen" of "Offerte aanvragen" op de site. Het FarmTree-team neemt contact met u op.',

    'footer.tagline':  'Samen werken aan betere agroforestry-beslissingen.',
    'footer.aboutus':  'Over ons',
    'footer.platf':    'Platform',
    'footer.address':  'FarmTree B.V.',
    'footer.copy':     'Copyright © 2026 FarmTree B.V. Alle rechten voorbehouden.',

    'contact.heading': 'Waarmee kunnen we helpen?',
    'contact.open':    'Open aanvraagformulier',

    'form.heading':    'Neem contact op',
    'form.sub':        'Vul de onderstaande velden in. Het FarmTree-team neemt binnen één werkdag contact met u op.',
    'form.name':       'Naam *',
    'form.email':      'E-mailadres *',
    'form.company':    'Bedrijfsnaam *',
    'form.role':       'Functietitel',
    'form.phone':      'Mobiele telefoon',
    'form.website':    'Website van uw bedrijf',
    'form.interest':   'Waar bent u in geïnteresseerd?',
    'form.message':    'Bericht',
    'form.submit':     'Aanvraag verzenden',
    'form.ph.name':    'Vul uw naam in',
    'form.ph.email':   'Vul uw e-mailadres in',
    'form.ph.company': 'Begin met typen...',
    'form.ph.website': 'Vul een link in',
    'form.ph.msg':     'Vertel ons over uw project',

    'form.success.heading': 'Dank u.',
    'form.success.body':    'Het FarmTree-team beoordeelt uw aanvraag en neemt binnenkort contact met u op.',
    'form.success.again':   'Nog een aanvraag verzenden',

    'track.heading':   'Track Record-database voor FarmTree-projecten', /* [NEEDS_NATIVE_REVIEW] */
    'track.users':     'Actieve gebruikers',
    'track.projects':  'Projecten',
    'track.regions':   'Regio\'s',

    'plat.heading':    'Een softwaremodel en online interface voor agroforestry-scenario\'s',
    'plat.sub':        'Ontwerp agroforestry-scenario\'s en projecteer koolstof-, financiële en milieugerelateerde indicatoren tot 50 jaar vooruit.',
    'plat.method':     'Modelmethodologie',

    'services.heading': 'Van expertgestuurde planning naar zelfstandige uitvoering',
    'pricing.heading':  'Scopegebaseerde prijsstelling voor modellering, rapportage en platformondersteuning', /* [NEEDS_NATIVE_REVIEW] */
    'pricing.sub':      'Bespreek uw scope met ons en wij stellen de juiste combinatie van diensten, platformtoegang en ondersteuning voor.',
    'vacancies.heading': 'Sluit u aan en help de wereld bomen te kwantificeren',
  },

  /* ── GERMAN (DE) ─────────────────────────────────────────── */
  /* [NEEDS_NATIVE_REVIEW] marks professional placeholder translations */
  de: {
    'nav.home':      'Startseite',
    'nav.solutions': 'Lösungen',
    'nav.track':     'Track Record',
    'nav.platform':  'FarmTree Plattform',
    'nav.videos':    'Nutzervideos',
    'nav.cocoa':     'Kakao-Fokus',
    'nav.team':      'Team',
    'nav.vacancies': 'Stellenangebote',
    'nav.contact':   'Kontakt aufnehmen',
    'nav.blog':      'Blog',
    'nav.request':   'Demo anfragen',
    'nav.ack':       'Danksagungen',
    'nav.licenses':  'Lizenzen',
    'nav.contact.btn': 'Kontakt',

    'btn.platform':  'FarmTree Plattform',

    'mob.main':      'Hauptmenü',
    'mob.farmtree':  'FarmTree',
    'mob.company':   'Unternehmen',
    'mob.legal':     'Formulare & Rechtliches',

    'hero.s1.kicker': 'Agroforstplanung',
    'hero.s1.title':  'Agroforstinvestitionen planen und dokumentieren',
    'hero.s1.text':   'Erstellen Sie glaubwürdige Projektionen für Umweltwirkungen, landwirtschaftliche Wertschöpfung und langfristige Investitionsentscheidungen.',
    'hero.s2.kicker': 'Wissenschaftliche Modellierung',
    'hero.s2.title':  'Felddaten in Investitionsszenarien umwandeln',
    'hero.s2.text':   'Klima, Boden, Arten und Projektannahmen in klare, wissenschaftlich fundierte Projektionen zusammenführen.',
    'hero.s3.kicker': 'Projektteams',
    'hero.s3.title':  'Lokale Teams mit klaren Planungstools unterstützen',
    'hero.s3.text':   'Helfen Sie Projektmitarbeitern, Agroforstoptionen zu vergleichen, Kompromisse zu verstehen und Werte überzeugend zu kommunizieren.',
    'hero.s4.kicker': 'Wirkungsberichterstattung',
    'hero.s4.title':  'Kohlenstoff, landwirtschaftliche Wertschöpfung und langfristige Leistung berichten',
    'hero.s4.text':   'Projektresultate in klare Berichte für Investoren, Geber, MRV-Partner und Programmteams übersetzen.',

    'cta.demo':      'Demo anfragen',
    'cta.quote':     'Angebot anfragen',
    'cta.demofull':  'FarmTree-Demo anfragen ↗',
    'cta.platform':  'FarmTree Plattform',
    'cta.explore':   'Plattform erkunden',
    'cta.readmore':  'Mehr lesen ↗',
    'cta.learnmore': 'Mehr erfahren ↗',
    'cta.contact':   'Team kontaktieren',

    'kicker.about':        'Über FarmTree',
    'kicker.platform':     'Die FarmTree Plattform',
    'kicker.journey':      'Projektverlauf',
    'kicker.references':   'Referenzen',
    'kicker.usecases':     'Anwendungsfälle',
    'kicker.cases':        'Fallstudien',
    'kicker.proof':        'Erfolgsbelege',
    'kicker.testimonials': 'Referenzen',
    'kicker.commercial':   'Kommerziell',
    'kicker.partners':     'Partnerperspektive',
    'kicker.faq':          'FAQ',
    'kicker.nextstep':     'Nächster Schritt',
    'kicker.contact':      'Kontakt aufnehmen',
    'kicker.takeaction':   'Jetzt handeln',
    'kicker.news':         'Neuigkeiten',

    'faq.heading':   'Fragen zur Agroforstsimulation? Wir helfen Ihnen.',
    'faq.sub':       'Häufige Fragen zur Agroforstmodellierung, zur FarmTree Plattform und zum Einstieg.',
    'faq.btn':       'Alle Fragen ansehen',
    'faq.q1':        'Was modelliert FarmTree?',
    'faq.a1':        'FarmTree modelliert Produktion, Kohlenstoff, Hydrologie, Bodenfruchtbarkeit, Arbeit, Wirtschaft und weitere Wirkungsindikatoren.',
    'faq.q2':        'Kann FarmTree Investitionsplanung unterstützen?',
    'faq.a2':        'Ja. Es hilft dabei, Projektideen und lokale Annahmen in glaubwürdige Szenarien und Investitionspläne zu übersetzen.',
    'faq.q3':        'Wie weit in die Zukunft kann FarmTree projizieren?',
    'faq.a3':        'FarmTree unterstützt 50-Jahres-Projektionen für Planung, Investitionsfälle und Monitoring.',
    'faq.q4':        'Können lokale Teams die Plattform nutzen?',
    'faq.a4':        'Ja. Projektmitarbeiter können lernen, Pläne zu erstellen, ohne vollständig von externen Beratern abhängig zu sein.',
    'faq.q5':        'Wie können wir ein Angebot anfragen?',
    'faq.a5':        'Nutzen Sie den Button "Demo anfragen" oder "Angebot anfragen". Das FarmTree-Team meldet sich, um Umfang und Kontext zu besprechen.',

    'footer.tagline':  'Gemeinsam bessere Agroforstentscheidungen treffen.',
    'footer.aboutus':  'Über uns',
    'footer.platf':    'Plattform',
    'footer.address':  'FarmTree B.V.',
    'footer.copy':     'Copyright © 2026 FarmTree B.V. Alle Rechte vorbehalten.',

    'contact.heading': 'Wie können wir helfen?',
    'contact.open':    'Anfrageformular öffnen',

    'form.heading':    'Kontakt aufnehmen',
    'form.sub':        'Füllen Sie die Felder aus. Das FarmTree-Team meldet sich innerhalb eines Werktages.',
    'form.name':       'Name *',
    'form.email':      'E-Mail-Adresse *',
    'form.company':    'Firmenname *',
    'form.role':       'Berufsbezeichnung',
    'form.phone':      'Mobiltelefon',
    'form.website':    'Unternehmenswebsite',
    'form.interest':   'Woran sind Sie interessiert?',
    'form.message':    'Nachricht',
    'form.submit':     'Anfrage senden',
    'form.ph.name':    'Geben Sie Ihren Namen ein',
    'form.ph.email':   'Geben Sie Ihre E-Mail-Adresse ein',
    'form.ph.company': 'Beginnen Sie zu tippen...',
    'form.ph.website': 'Link eingeben',
    'form.ph.msg':     'Erzählen Sie uns von Ihrem Projekt',

    'form.success.heading': 'Vielen Dank.',
    'form.success.body':    'Das FarmTree-Team wird Ihre Anfrage prüfen und sich in Kürze bei Ihnen melden.',
    'form.success.again':   'Weitere Anfrage senden',

    'track.heading':   'Track-Record-Datenbank für FarmTree-Projekte', /* [NEEDS_NATIVE_REVIEW] */
    'track.users':     'Aktive Nutzer',
    'track.projects':  'Projekte',
    'track.regions':   'Regionen',

    'plat.heading':    'Ein Softwaremodell und Online-Interface für Agroforstszenarien',
    'plat.sub':        'Entwerfen Sie Agroforstszenarien und prognostizieren Sie Kohlenstoff-, Finanz- und Umweltindikatoren für bis zu 50 Jahre.',
    'plat.method':     'Modellmethodik',

    'services.heading': 'Von expertengeführter Planung zum eigenständigen Betrieb',
    'pricing.heading':  'Umfangsbasierte Preisgestaltung für Modellierung, Berichterstattung und Plattformunterstützung', /* [NEEDS_NATIVE_REVIEW] */
    'pricing.sub':      'Besprechen Sie Ihren Umfang mit uns und wir schlagen die richtige Kombination aus Diensten, Plattformzugang und Support vor.',
    'vacancies.heading': 'Helfen Sie mit, Bäume weltweit zu quantifizieren',
  }

}; /* end FT_DICT */

/* ── Expose dictionary globally ─────────────────────────────── */
window.FT_DICT = FT_DICT;

/* ── Current language (read localStorage or default EN) ─────── */
var ftLang = (function(){
  try { return localStorage.getItem('ftLang') || 'en'; } catch(e){ return 'en'; }
})();
window.ftCurrentLang = ftLang;

/* ── Core translation function ──────────────────────────────── */
function t(key){ var d=FT_DICT[ftLang]; return (d && d[key]) || (FT_DICT.en[key]) || ''; }

/* ── Apply [data-i18n] attributes ───────────────────────────── */
function applyDataI18n(){
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var val = t(el.getAttribute('data-i18n'));
    if(val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    var val = t(el.getAttribute('data-i18n-ph'));
    if(val) el.placeholder = val;
  });
}

/* ── Apply to forms specifically ────────────────────────────── */
function applyFormTranslations(){
  var fieldMap = {
    'ftReqName':    { label:'form.name',    ph:'form.ph.name'    },
    'ftReqEmail':   { label:'form.email',   ph:'form.ph.email'   },
    'ftReqCompany': { label:'form.company', ph:'form.ph.company' },
    'ftReqRole':    { label:'form.role'                          },
    'ftReqPhone':   { label:'form.phone'                         },
    'ftReqWeb':     { label:'form.website', ph:'form.ph.website' },
    'ftReqInterest':{ label:'form.interest'                      },
    'ftReqMsg':     { label:'form.message', ph:'form.ph.msg'     }
  };
  Object.keys(fieldMap).forEach(function(id){
    var field = document.getElementById(id);
    if(!field) return;
    var cfg = fieldMap[id];
    /* Update label */
    var label = document.querySelector('label[for="'+id+'"]');
    if(label && cfg.label) label.textContent = t(cfg.label);
    /* Update placeholder */
    if(cfg.ph) field.placeholder = t(cfg.ph) || field.placeholder;
  });
  /* Submit button */
  var submitBtn = document.getElementById('ftReqSubmit');
  if(submitBtn) submitBtn.textContent = t('form.submit');
  /* Success state */
  var sh = document.querySelector('#ftRequestSuccess h2');
  if(sh) sh.textContent = t('form.success.heading');
  var sp = document.querySelector('#ftRequestSuccess p');
  if(sp) sp.textContent = t('form.success.body');
  var sb = document.querySelector('#ftRequestSuccess .pill.contact');
  if(sb) sb.textContent = t('form.success.again');
  /* Form heading */
  var fh = document.querySelector('#ftRequestFormWrap h1');
  if(fh) fh.textContent = t('form.heading');
  var fp = document.querySelector('#ftRequestFormWrap p');
  if(fp) fp.textContent = t('form.sub');
}

/* ── Update hero slides with current language ───────────────── */
function applyHeroTranslations(){
  if(!window.heroes || !window.heroes.length) return;
  window.heroes[0] = [t('hero.s1.kicker'), t('hero.s1.title'), t('hero.s1.text'), window.heroes[0][3], window.heroes[0][4]];
  window.heroes[1] = [t('hero.s2.kicker'), t('hero.s2.title'), t('hero.s2.text'), window.heroes[1][3], window.heroes[1][4]];
  window.heroes[2] = [t('hero.s3.kicker'), t('hero.s3.title'), t('hero.s3.text'), window.heroes[2][3], window.heroes[2][4]];
  window.heroes[3] = [t('hero.s4.kicker'), t('hero.s4.title'), t('hero.s4.text'), window.heroes[3][3], window.heroes[3][4]];
  /* Re-render current hero slide */
  if(typeof window.ftHeroGo === 'function' && window.state){
    var cur = window.state.hero || 0;
    var h = window.heroes[cur];
    var kEl = document.getElementById('heroKicker');
    var tEl = document.getElementById('heroTitle');
    var pEl = document.getElementById('heroText');
    if(kEl) kEl.textContent = h[0];
    if(tEl) tEl.textContent = h[1];
    if(pEl) pEl.textContent = h[2];
  }
}

/* ── Update FAQ section ─────────────────────────────────────── */
function applyFAQTranslations(){
  var faqHead = document.querySelector('.ft-faq-head h2');
  if(faqHead) faqHead.textContent = t('faq.heading');
  var faqSub = document.querySelector('.ft-faq-head p');
  if(faqSub) faqSub.textContent = t('faq.sub');
  var faqBtn = document.getElementById('ftFaqToggleBtn');
  if(faqBtn && faqBtn.textContent.indexOf('…') === -1) faqBtn.textContent = t('faq.btn');
  /* FAQ grid items */
  var articles = document.querySelectorAll('.ft-faq-grid article');
  var faqs = [
    {q:'faq.q1',a:'faq.a1'},{q:'faq.q2',a:'faq.a2'},{q:'faq.q3',a:'faq.a3'},
    {q:'faq.q4',a:'faq.a4'},{q:'faq.q5',a:'faq.a5'}
  ];
  articles.forEach(function(art,i){
    if(!faqs[i]) return;
    var h3 = art.querySelector('h3'); var p = art.querySelector('p');
    if(h3) h3.textContent = t(faqs[i].q);
    if(p)  p.textContent  = t(faqs[i].a);
  });
}

/* ── Update footer ──────────────────────────────────────────── */
function applyFooterTranslations(){
  var ftTop = document.querySelector('.footer-top h2');
  if(ftTop) ftTop.textContent = t('footer.tagline');
  var copy = document.querySelector('.footer-bottom span');
  if(copy) copy.textContent = t('footer.copy');
  /* Footer column headings */
  var footerH3s = document.querySelectorAll('.footer-links h3');
  var colMap = { 'About Us': 'footer.aboutus', 'Platform': 'footer.platf', 'FarmTree B.V.': 'footer.address' };
  footerH3s.forEach(function(h3){
    var key = colMap[h3.textContent.trim()];
    if(key) h3.textContent = t(key);
  });
}

/* ── Re-render JS-generated audience pages ───────────────────── */
/* The investor/ngos pages are rebuilt by rebuildUseCasePages() in the
   main script. After language change, we call it again so the template
   strings reflect the current language.
   NOTE: Full translation of JS-generated body copy requires expanding
   FT_DICT. Current version translates UI chrome; body copy [NEEDS_NATIVE_REVIEW]. */
function rerenderAudiencePages(){
  if(typeof window.rebuildUseCasePagesFT === 'function'){
    window.rebuildUseCasePagesFT();
  }
  /* rebuildUseCasePages is the actual function; call it if accessible */
  try {
    var scripts = document.querySelectorAll('script');
    /* Trigger rebuild by dispatching a custom event that the main script can listen to */
    document.dispatchEvent(new CustomEvent('ftLangChange', { detail: { lang: ftLang } }));
  } catch(e){}
}

/* ── Master setFTLanguage function ──────────────────────────── */
window.setFTLanguage = function(lang){
  if(!FT_DICT[lang]) return;
  ftLang = lang;
  window.ftCurrentLang = lang;

  /* Persist */
  try { localStorage.setItem('ftLang', lang); } catch(e){}

  /* Update html lang attr */
  document.documentElement.lang = lang;

  /* Update langLabel in header */
  var label = document.getElementById('langLabel');
  if(label) label.textContent = lang.toUpperCase();

  /* Update active state on all lang buttons */
  document.querySelectorAll('[data-lang]').forEach(function(btn){
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  /* Apply translations */
  applyDataI18n();
  applyFormTranslations();
  applyHeroTranslations();
  applyFAQTranslations();
  applyFooterTranslations();

  /* Re-render dynamic pages */
  rerenderAudiencePages();

  /* Re-apply after any pending dynamic rendering */
  setTimeout(applyDataI18n, 80);
  setTimeout(function(){ applyFAQTranslations(); applyFooterTranslations(); }, 150);
};

/* ── Wire language buttons ───────────────────────────────────── */
function wireLanguageButtons(){
  document.querySelectorAll('[data-lang]').forEach(function(btn){
    /* Remove any old listeners by cloning */
    var fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', function(e){
      e.stopPropagation();
      window.setFTLanguage(fresh.getAttribute('data-lang'));
    });
  });
}

/* ── Hook into setPage to re-apply after navigation ─────────── */
(function(){
  var originalSetPage = window.setPage;
  if(typeof originalSetPage !== 'function') return;
  window.setPage = function(id){
    originalSetPage(id);
    /* Re-apply language after the new page content is rendered */
    setTimeout(function(){ window.setFTLanguage(ftLang); }, 60);
    setTimeout(function(){ window.setFTLanguage(ftLang); }, 300);
  };
})();

/* ── Initialise on DOMContentLoaded ─────────────────────────── */
function init(){
  wireLanguageButtons();
  /* Apply stored language (or EN default) */
  if(ftLang !== 'en'){
    window.setFTLanguage(ftLang);
  } else {
    /* EN: just wire buttons, update label */
    document.querySelectorAll('[data-lang]').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-lang') === 'en');
    });
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
/* Also run after a short delay to catch all dynamically built content */
setTimeout(function(){ wireLanguageButtons(); if(ftLang !== 'en') window.setFTLanguage(ftLang); }, 900);

})(); /* end ft-language-v25 */

/* ---- block 39 ---- */
(function(){
'use strict';
if(!window.FT_DICT) return;

/* ── Helper ─────────────────────────────────────────────────── */
function add(key, en, nl, de){
  window.FT_DICT.en[key] = en;
  window.FT_DICT.nl[key] = nl || en;
  window.FT_DICT.de[key] = de || en;
}

/* ══════════════════════════════════════════════════════════════
   CASE STUDY PAGES — common UI chrome
   ══════════════════════════════════════════════════════════════ */
add('cs.kicker',     'Case study',
  'Casestudie',
  'Fallstudie');

add('cs.ctx.lbl',    'Context · Challenge · Approach',
  'Context · Uitdaging · Aanpak',
  'Kontext · Herausforderung · Ansatz');

add('cs.out.lbl',    'Key outputs',
  'Belangrijkste resultaten',
  'Wichtigste Ergebnisse');

add('cs.back',       '← Back to overview',
  '← Terug naar overzicht',
  '← Zurück zur Übersicht');

add('cs.bread',      'Case studies',
  'Casestudies',
  'Fallstudien');

add('cs.proof.lbl',  'Real project experience',
  'Praktijkervaring met echte projecten',
  'Echte Projekterfahrung');

/* Case study meta row labels */
add('meta.location',  'Location',         'Locatie',              'Standort');
add('meta.phase',     'Project phase',    'Projectfase',          'Projektphase');
add('meta.focus',     'Focus area',       'Aandachtsgebied',      'Schwerpunkt');
add('meta.horizon',   'Projection horizon','Projectiehorizon',    'Projektionshorizont');
add('meta.standard',  'Standard alignment','Standaard afstemming','Standardausrichtung');
add('meta.geos',      'Geographies',      'Geografieën',      'Geographien');
add('meta.carbon.ap', 'Carbon approach',  'Koolstofaanpak',       'Kohlenstoffansatz');
add('meta.watershed', 'Watershed',        'Stroomgebied',         'Einzugsgebiet');
add('meta.programme', 'Programme',        'Programma',            'Programm');
add('meta.crop',      'Focus crop',       'Hoofdgewas',           'Hauptkultuur');
add('meta.partner',   'Partner',          'Partner',              'Partner');

/* Phase chip labels */
add('phase.01',  'Phase 01  ·  Programme Planning',
  'Fase 01  ·  Programmaplanning',
  'Phase 01  ·  Programmplanung');

add('phase.02',  'Phase 02  ·  Carbon Planning',
  'Fase 02  ·  Koolstofplanning',
  'Phase 02  ·  Kohlenstoffplanung');

add('phase.03',  'Phase 03  ·  Landscape Scenario Planning',
  'Fase 03  ·  Landschapsscenarioplanning',
  'Phase 03  ·  Landschaftsszenarioplanung');

add('phase.04',  'Phase 04  ·  Water Resilience & Monitoring',
  'Fase 04  ·  Waterveerkracht & Monitoring',
  'Phase 04  ·  Wasserresilienz & Monitoring');

/* Case study CTA buttons */
add('cs.cta.giz',    'Discuss a similar project',
  'Bespreek een vergelijkbaar project',
  'Ähnliches Projekt besprechen');

add('cs.cta.acorn',  'Discuss carbon planning',
  'Bespreek koolstofplanning',
  'Kohlenstoffplanung besprechen');

add('cs.cta.cocoa',  'Discuss cocoa landscape planning',
  'Bespreek cacao-landschapsplanning',
  'Kakaolandschaftsplanung besprechen');

add('cs.cta.nyando', 'Discuss landscape investment planning',
  'Bespreek landschapsinvesteringsplanning',
  'Landschaftsinvestitionsplanung besprechen');

add('cs.cta.read',   'Read the case study ↗',
  'Lees de casestudie ↗',
  'Fallstudie lesen ↗');

/* ── GIZ page content ─────────────────────────────────────── */
add('cs.giz.h1',    'Turning project ambition into credible investment scenarios',
  'Projectambities omzetten in geloofwaardige investeringsscenario\'s', /* [NEEDS_NATIVE_REVIEW] */
  'Projektambitionen in glaubwürdige Investitionsszenarien umwandeln'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.giz.strong', 'Understanding the system before committing to the plan',
  'Het systeem begrijpen vóór de planvastlegging', /* [NEEDS_NATIVE_REVIEW] */
  'Das System verstehen, bevor man sich auf den Plan festlegt'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.giz.sub',   'GIZ needed landscape-scale agroforestry scenarios for Madagascar that funders, implementers and local teams could evaluate together — fast.',
  'GIZ had landschapsagroforestry-scenario\'s nodig voor Madagaskar die financiers, uitvoerders en lokale teams samen snel konden beoordelen.', /* [NEEDS_NATIVE_REVIEW] */
  'GIZ benötigte landschaftsweite Agroforstsszenarien für Madagaskar, die Geldgeber, Umsetzer und lokale Teams gemeinsam schnell bewerten konnten.'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.giz.band1',  'Multiple scenarios',  'Meerdere scenario\'s',    'Mehrere Szenarien');
add('cs.giz.band2',  '50-year horizon',     '50-jarige horizon',        '50-Jahres-Horizont');
add('cs.giz.band3',  'GIZ-aligned',         'GIZ-conform',              'GIZ-konform');

add('cs.giz.o1',    'Scenario framework',   'Scenarioraamwerk',         'Szenariorahmen');
add('cs.giz.o2',    'Carbon & income projections', 'Koolstof- & inkomstprognoses', 'Kohlenstoff- & Einkommensprojektionen');
add('cs.giz.o3',    'Investment case narrative', 'Investeringsplan narratief', 'Investitionsfall-Narrativ');

add('cs.giz.used',  'Used by organisations with capital on the line',
  'Gebruikt door organisaties met kapitaal op het spel', /* [NEEDS_NATIVE_REVIEW] */
  'Genutzt von Organisationen mit Kapital auf dem Spiel'); /* [NEEDS_NATIVE_REVIEW] */

/* ── ACORN page content ───────────────────────────────────── */
add('cs.acorn.h1',   'Field data turned into consistent carbon projections at scale',
  'Velddata omgezet in consistente koolstofprognoses op grote schaal', /* [NEEDS_NATIVE_REVIEW] */
  'Felddaten in konsistente Kohlenstoffprojektionen in großem Maßstab umgewandelt'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.acorn.strong','A shared analytical foundation across continents',
  'Een gedeelde analytische basis over continenten heen', /* [NEEDS_NATIVE_REVIEW] */
  'Eine gemeinsame analytische Grundlage über Kontinente hinweg'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.acorn.sub',  'Rabobank ACORN needed a shared scientific methodology to compare smallholder agroforestry projects across three continents — consistently and at portfolio scale.',
  'Rabobank ACORN had een gedeelde wetenschappelijke methode nodig om agroforestry-projecten voor kleinschalige boeren op drie continenten consistent te vergelijken.', /* [NEEDS_NATIVE_REVIEW] */
  'Rabobank ACORN benötigte eine gemeinsame wissenschaftliche Methodik, um Kleinbauern-Agroforstwirtschaftsprojekte auf drei Kontinenten konsistent zu vergleichen.'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.acorn.band1', '3 continents',          '3 continenten',                   '3 Kontinente');
add('cs.acorn.band2', 'Verra VCS aligned',     'Verra VCS-conform',               'Verra VCS-konform');
add('cs.acorn.band3', 'Portfolio-level view',  'Portfolio-overzicht',             'Portfolio-Überblick');

add('cs.acorn.o1',   'Consistent carbon methodology', 'Consistente koolstofmethode',     'Konsistente Kohlenstoffmethodik');
add('cs.acorn.o2',   'Species and context calibration','Soort- en contextkalibratie',    'Art- und Kontextkalibrierung');
add('cs.acorn.o3',   'Farmer value scenarios', 'Scenario\'s voor boerderijwaarde',       'Szenarien für landwirtschaftliche Wertschöpfung');

/* ── Cocoa page content ──────────────────────────────────── */
add('cs.cocoa.h1',   'Shade-tree density and carbon insetting, modelled at landscape scale',
  'Schaduwboomdichtheid en koolstofinsetting, gemodelleerd op landschapsschaal', /* [NEEDS_NATIVE_REVIEW] */
  'Schattbaumdichte und Kohlenstoff-Insetting, auf Landschaftsebene modelliert'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.cocoa.strong','Turning cocoa complexity into comparable scenarios',
  'Cacaocomplexiteit omzetten in vergelijkbare scenario\'s', /* [NEEDS_NATIVE_REVIEW] */
  'Kakao-Komplexität in vergleichbare Szenarien umwandeln'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.cocoa.band1', 'Multiple shade systems',       'Meerdere schaduwsystemen',         'Mehrere Schattensysteme');
add('cs.cocoa.band2', 'Carbon insetting quantified',  'Koolstofinsetting gekwantificeerd', 'Kohlenstoff-Insetting quantifiziert');
add('cs.cocoa.band3', 'Landscape aggregation',        'Landschapsaggregatie',             'Landschaftsaggregation');

add('cs.cocoa.o1',   'Shade scenario comparison',     'Vergelijking schaduwscenario\'s',  'Schattenszenarienvergleich');
add('cs.cocoa.o2',   'Carbon insetting model',        'Koolstofinsettingmodel',           'Kohlenstoff-Insetting-Modell');
add('cs.cocoa.o3',   'Supply chain sustainability case','Duurzaamheidscase voor de toeleveringsketen','Nachhaltigkeitsfall für die Lieferkette');

/* ── Nyando page content ─────────────────────────────────── */
add('cs.nyando.h1',  'Connecting water balance, carbon and farmer value in a single investment case',
  'Waterbalans, koolstof en boerderijwaarde verbinden in één investeringsplan', /* [NEEDS_NATIVE_REVIEW] */
  'Wasserhaushalt, Kohlenstoff und landwirtschaftliche Wertschöpfung in einem einzigen Investitionsfall verbinden'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.nyando.strong','Evidence for a landscape investment decision',
  'Bewijs voor een landschapsinvesteringsbeslissing', /* [NEEDS_NATIVE_REVIEW] */
  'Belege für eine Landschaftsinvestitionsentscheidung'); /* [NEEDS_NATIVE_REVIEW] */

add('cs.nyando.band1','Water + carbon integrated',  'Water + koolstof geïntegreerd', 'Wasser + Kohlenstoff integriert');
add('cs.nyando.band2','Landscape aggregation',      'Landschapsaggregatie',              'Landschaftsaggregation');
add('cs.nyando.band3','Monitoring-ready',           'Klaar voor monitoring',             'Monitoring-bereit');

add('cs.nyando.o1',  'Water resilience projections', 'Waterveerkrachtprognoses',          'Wasserresilienz-Projektionen');
add('cs.nyando.o2',  'Integrated impact model',      'Geïntegreerd impactmodel',     'Integriertes Wirkungsmodell');
add('cs.nyando.o3',  'Monitoring-ready outputs',     'Monitoringklare resultaten',        'Monitoring-bereite Ergebnisse');

/* Common card labels across all case studies */
add('cs.card.context',  'Context',    'Context',    'Kontext');
add('cs.card.challenge','Challenge',  'Uitdaging',  'Herausforderung');
add('cs.card.approach', 'Approach',   'Aanpak',     'Ansatz');

/* ══════════════════════════════════════════════════════════════
   AUDIENCE PAGES — section labels and headings
   ══════════════════════════════════════════════════════════════ */
add('aud.challenge.lbl',  'The challenge',
  'De uitdaging',
  'Die Herausforderung');

add('aud.value.lbl',      'How FarmTree helps',
  'Hoe FarmTree helpt',
  'Wie FarmTree hilft');

add('aud.data.lbl',       'Platform depth',
  'Platformdiepte',
  'Plattformtiefe');

add('aud.data.lbl2',      'What the platform models',
  'Wat het platform modelleert',
  'Was die Plattform modelliert');

add('aud.uc.lbl',         'How it works in practice',
  'Hoe het in de praktijk werkt',
  'Wie es in der Praxis funktioniert');

add('aud.proof.lbl',      'Used by organisations with capital on the line',
  'Gebruikt door organisaties met kapitaal op het spel', /* [NEEDS_NATIVE_REVIEW] */
  'Genutzt von Organisationen mit Kapital auf dem Spiel'); /* [NEEDS_NATIVE_REVIEW] */

add('aud.proof.lbl2',     'Applied in programme design with institutional partners',
  'Toegepast bij programmaontwerp met institutionele partners', /* [NEEDS_NATIVE_REVIEW] */
  'Angewendet im Programmdesign mit institutionellen Partnern'); /* [NEEDS_NATIVE_REVIEW] */

add('aud.proof.lbl3',     'Used by field teams working in complex landscapes',
  'Gebruikt door veldteams die werken in complexe landschappen', /* [NEEDS_NATIVE_REVIEW] */
  'Genutzt von Feldteams, die in komplexen Landschaften arbeiten'); /* [NEEDS_NATIVE_REVIEW] */

/* Investor page */
add('inv.kicker',   'For investors & climate finance',
  'Voor investeerders & klimaatfinanciering',
  'Für Investoren & Klimafinanzierung');

add('inv.h1',       'Make agroforestry investment decisions with scientific confidence',
  'Neem agroforestry-investeringsbeslissingen met wetenschappelijk vertrouwen', /* [NEEDS_NATIVE_REVIEW] */
  'Treffen Sie Agroforstwirtschaft-Investitionsentscheidungen mit wissenschaftlicher Zuversicht'); /* [NEEDS_NATIVE_REVIEW] */

add('inv.sub',      'FarmTree gives investment teams the scenario intelligence they need before capital is committed — and the monitoring framework to track performance long after it is.',
  'FarmTree geeft investeringsteams de scenario-intelligentie die ze nodig hebben vóór de kapitaalinzet — en het monitoringkader om de prestaties daarna te volgen.', /* [NEEDS_NATIVE_REVIEW] */
  'FarmTree gibt Investitionsteams die Szenariointelligenz, die sie vor dem Kapitaleinsatz benötigen — und den Überwachungsrahmen, um die Leistung danach zu verfolgen.'); /* [NEEDS_NATIVE_REVIEW] */

add('inv.challenge.h2', 'Why agroforestry investment is hard to evaluate',
  'Waarom agroforestry-investering moeilijk te beoordelen is', /* [NEEDS_NATIVE_REVIEW] */
  'Warum Agroforstwirtschaft-Investitionen schwer zu bewerten sind'); /* [NEEDS_NATIVE_REVIEW] */

add('inv.value.h2',  'From uncertain assumptions to investor-ready scenarios',
  'Van onzekere aannames naar investeringsklare scenario\'s', /* [NEEDS_NATIVE_REVIEW] */
  'Von unsicheren Annahmen zu investorenbereiten Szenarien'); /* [NEEDS_NATIVE_REVIEW] */

add('inv.data.h2',   'The science behind the investment case',
  'De wetenschap achter het investeringsplan', /* [NEEDS_NATIVE_REVIEW] */
  'Die Wissenschaft hinter dem Investitionsfall'); /* [NEEDS_NATIVE_REVIEW] */

add('inv.uc.h2',     'Three ways investors use FarmTree',
  'Drie manieren waarop investeerders FarmTree gebruiken', /* [NEEDS_NATIVE_REVIEW] */
  'Drei Wege, wie Investoren FarmTree nutzen'); /* [NEEDS_NATIVE_REVIEW] */

add('inv.cta.h2',    'Ready to evaluate your agroforestry pipeline?',
  'Klaar om uw agroforestry-pijplijn te evalueren?', /* [NEEDS_NATIVE_REVIEW] */
  'Bereit, Ihre Agroforstwirtschaft-Pipeline zu bewerten?'); /* [NEEDS_NATIVE_REVIEW] */

add('inv.cta.btn',   'Book an investment review',
  'Plan een investeringsbeoordeling',
  'Investitionsprüfung buchen');

/* Investor problem cards */
add('inv.p1.h',  'Opaque assumptions',    'Ondoorzichtige aannames',  'Undurchsichtige Annahmen');
add('inv.p2.h',  'Slow due diligence',    'Trage due diligence',      'Langsame Due-Diligence');
add('inv.p3.h',  'No common framework',   'Geen gemeenschappelijk kader', 'Kein gemeinsamer Rahmen');

/* Investor value cards */
add('inv.v1.h',  'Scenario comparison',   'Scenariovergelijking',     'Szenariovergleich');
add('inv.v2.h',  'Evidence-based projections','Op bewijs gebaseerde prognoses','Evidenzbasierte Projektionen');
add('inv.v3.h',  'Risk and confidence framing','Risico- en betrouwbaarheidsframing','Risiko- und Vertrauensrahmen');
add('inv.v4.h',  'Investor-ready narratives','Investeringsklare narratieven',  'Investorengerechte Narrative');

/* Investor use cases */
add('inv.uc1.h', 'Pre-investment portfolio screening',
  'Portefeuilleselectie vóór investering',
  'Vorauswahl des Portfolios vor der Investition');
add('inv.uc2.h', 'Investment case preparation',
  'Voorbereiding investeringsplan',
  'Vorbereitung des Investitionsfalls');
add('inv.uc3.h', 'Post-investment performance monitoring',
  'Prestatiemonitoring na investering',
  'Überwachung der Leistung nach der Investition');

/* DFI page */
add('dfi.kicker',   'For DFIs, donors & climate funds',
  'Voor OFI\'s, donoren & klimaatfondsen',
  'Für Entwicklungsbanken, Geber & Klimafonds');

add('dfi.h1',       'Programme-level planning and reporting for climate and landscape investment',
  'Programmaplanning en -rapportage voor klimaat- en landschapsinvesteringen', /* [NEEDS_NATIVE_REVIEW] */
  'Programmplanung und -berichterstattung für Klima- und Landschaftsinvestitionen'); /* [NEEDS_NATIVE_REVIEW] */

add('dfi.challenge.h2','Why large-scale agroforestry programmes are difficult to manage',
  'Waarom grootschalige agroforestry-programma\'s moeilijk te beheren zijn', /* [NEEDS_NATIVE_REVIEW] */
  'Warum großskalige Agroforstprogramme schwer zu managen sind'); /* [NEEDS_NATIVE_REVIEW] */

add('dfi.value.h2',  'From fragmented reporting to programme-wide evidence',
  'Van gefragmenteerde rapportage naar programmabreed bewijs', /* [NEEDS_NATIVE_REVIEW] */
  'Von fragmentierter Berichterstattung zu programmweiten Belegen'); /* [NEEDS_NATIVE_REVIEW] */

add('dfi.data.h2',   'Multi-indicator modelling for programme accountability',
  'Multi-indicatormodellering voor programmaverantwoording', /* [NEEDS_NATIVE_REVIEW] */
  'Mehr-Indikator-Modellierung für die Programmverantwortung'); /* [NEEDS_NATIVE_REVIEW] */

add('dfi.uc.h2',     'Three ways DFIs and donors use FarmTree',
  'Drie manieren waarop OFI\'s en donoren FarmTree gebruiken', /* [NEEDS_NATIVE_REVIEW] */
  'Drei Wege, wie Entwicklungsbanken und Geber FarmTree nutzen'); /* [NEEDS_NATIVE_REVIEW] */

add('dfi.cta.h2',    'Ready to strengthen your programme evidence base?',
  'Klaar om uw programmabewijs te versterken?', /* [NEEDS_NATIVE_REVIEW] */
  'Bereit, Ihre Programmbeweislage zu stärken?'); /* [NEEDS_NATIVE_REVIEW] */

add('dfi.cta.btn',   'Request programme demo',
  'Programma-demo aanvragen',
  'Programm-Demo anfragen');

/* DFI problem cards */
add('dfi.p1.h',  'Inconsistent baselines',    'Inconsistente basislijnen',        'Inkonsistente Ausgangsdaten');
add('dfi.p2.h',  'Accountability gaps',       'Gaten in verantwoording',          'Lücken in der Rechenschaftspflicht');
add('dfi.p3.h',  'Scaling bottlenecks',       'Knelpunten bij opschaling',        'Skalierungsengpässe');

/* DFI value cards */
add('dfi.v1.h',  'Programme scenario design', 'Programmaontwerp voor scenario\'s', 'Programmszenarien-Design');
add('dfi.v2.h',  'Climate & livelihood integration', 'Klimaat- & bestaansintegratie', 'Klima- & Lebensunterhalt-Integration');
add('dfi.v3.h',  'M&E-compatible outputs','M&E-compatibele resultaten',    'M&E-kompatible Ergebnisse');
add('dfi.v4.h',  'Climate fund alignment',    'Afstemming klimaatfondsen',         'Klimafondsausrichtung');

/* DFI use cases */
add('dfi.uc1.h', 'Programme design and feasibility',
  'Programmaontwerp en haalbaarheid',
  'Programmdesign und Machbarkeit');
add('dfi.uc2.h', 'Multi-country portfolio management',
  'Multi-landenbeheer van portefeuilles',
  'Länderübergreifendes Portfoliomanagement');
add('dfi.uc3.h', 'Donor reporting and narrative building',
  'Donorrapportage en narratiefopbouw',
  'Geberberichterstattung und Narrativaufbau');

/* NGO page */
add('ngo.kicker',  'For implementing partners & field teams',
  'Voor implementatiepartners & veldteams',
  'Für Umsetzungspartner & Feldteams');

add('ngo.h1',     'Clearer planning, better reporting, stronger field decisions',
  'Duidelijkere planning, betere rapportage, sterkere veldbeslissingen', /* [NEEDS_NATIVE_REVIEW] */
  'Klarere Planung, bessere Berichterstattung, stärkere Feldentscheidungen'); /* [NEEDS_NATIVE_REVIEW] */

add('ngo.challenge.h2','Why field implementation is harder than it looks on paper',
  'Waarom veldimplementatie moeilijker is dan het er op papier uitziet', /* [NEEDS_NATIVE_REVIEW] */
  'Warum die Feldumsetzung schwieriger ist, als es auf dem Papier aussieht'); /* [NEEDS_NATIVE_REVIEW] */

add('ngo.value.h2',  'A planning and reporting foundation built for field teams',
  'Een planning- en rapportagefundament gebouwd voor veldteams', /* [NEEDS_NATIVE_REVIEW] */
  'Eine Planungs- und Berichterstattungsgrundlage, die für Feldteams entwickelt wurde'); /* [NEEDS_NATIVE_REVIEW] */

add('ngo.data.h2',   'Science-backed planning indicators, calibrated locally',
  'Wetenschappelijk onderbouwde planningsindicatoren, lokaal gekalibreerd', /* [NEEDS_NATIVE_REVIEW] */
  'Wissenschaftlich fundierte Planungsindikatoren, lokal kalibriert'); /* [NEEDS_NATIVE_REVIEW] */

add('ngo.uc.h2',     'Three ways implementation teams use FarmTree',
  'Drie manieren waarop implementatieteams FarmTree gebruiken', /* [NEEDS_NATIVE_REVIEW] */
  'Drei Wege, wie Umsetzungsteams FarmTree nutzen'); /* [NEEDS_NATIVE_REVIEW] */

add('ngo.cta.h2',    'Ready to bring more structure to your field work?',
  'Klaar om meer structuur in uw veldwerk te brengen?', /* [NEEDS_NATIVE_REVIEW] */
  'Bereit, mehr Struktur in Ihre Feldarbeit zu bringen?'); /* [NEEDS_NATIVE_REVIEW] */

add('ngo.cta.btn',   'Explore team workflow',
  'Teamworkflow verkennen',
  'Team-Workflow erkunden');

/* NGO problem cards */
add('ngo.p1.h',  'Manual and disconnected',  'Handmatig en gefragmenteerd',    'Manuell und unverbunden');
add('ngo.p2.h',  'Assumptions that drift',   'Aannames die wegdrijven',        'Annahmen, die auseinanderdriften');
add('ngo.p3.h',  'Reporting burden',         'Rapportagelast',                 'Berichtslast');

/* NGO value cards */
add('ngo.v1.h',  'Structured field planning','Gestructureerde veldplanning',   'Strukturierte Feldplanung');
add('ngo.v2.h',  'Local calibration',        'Lokale kalibratie',              'Lokale Kalibrierung');
add('ngo.v3.h',  'Learning loops',           'Leerlussen',                     'Lernschleifen');
add('ngo.v4.h',  'Partner-ready outputs',    'Partnerklare resultaten',        'Partnergerechte Ergebnisse');

/* NGO use cases */
add('ngo.uc1.h', 'Project planning and scoping',
  'Projectplanning en -omvang bepalen',
  'Projektplanung und -umfangsbestimmung');
add('ngo.uc2.h', 'Field team training and capacity building',
  'Training en capaciteitsopbouw veldteam',
  'Schulung und Kapazitätsaufbau des Feldteams');
add('ngo.uc3.h', 'Donor and partner reporting',
  'Rapportage aan donoren en partners',
  'Geber- und Partnerberichterstattung');

/* Common audience CTA */
add('aud.contact',   'Contact the team',
  'Neem contact op met het team',
  'Das Team kontaktieren');

/* ══════════════════════════════════════════════════════════════
   HOMEPAGE SECTIONS — remaining headings and labels
   ══════════════════════════════════════════════════════════════ */
add('home.news.h2',    'News and insights from FarmTree',
  'Nieuws en inzichten van FarmTree',
  'Neuigkeiten und Einblicke von FarmTree');

add('home.about.h2',   'FarmTree helps you design, de-risk and monitor agroforestry interventions.',
  'FarmTree helpt u agroforestry-interventies te ontwerpen, risico\'s te beperken en te monitoren.',
  'FarmTree hilft Ihnen, Agroforstwirtschaftsmaßnahmen zu planen, Risiken zu minimieren und zu überwachen.');

add('home.eco.h2',     'Rethinking how agroforestry projects are planned and financed.',
  'Heroverweging van hoe agroforestry-projecten worden gepland en gefinancierd.',
  'Neudenken, wie Agroforstprojekte geplant und finanziert werden.');


add('home.journey.h2', 'From project ideas to scaled agroforestry reporting',
  'Van projectideeën naar grootschalige agroforestry-rapportage', /* [NEEDS_NATIVE_REVIEW] */
  'Von Projektideen zur skalierten Agroforstwirtschaftsberichterstattung'); /* [NEEDS_NATIVE_REVIEW] */

add('home.trust.h2',   'Trusted by leading agroforestry and climate organisations.',
  'Vertrouwd door toonaangevende agroforestry- en klimaatorganisaties.',
  'Vertraut von führenden Agroforstwirtschafts- und Klimaorganisationen.');

add('home.uc.h2',      'How different organisations use FarmTree',
  'Hoe verschillende organisaties FarmTree gebruiken',
  'Wie verschiedene Organisationen FarmTree nutzen');

add('home.cs.h2',      'Projects that show what FarmTree makes possible',
  'Projecten die laten zien wat FarmTree mogelijk maakt',
  'Projekte, die zeigen, was FarmTree möglich macht');

add('home.proof.h2',   'Four themes where FarmTree makes agroforestry investment legible',
  'Vier thema\'s waarbij FarmTree agroforestry-investering leesbaar maakt', /* [NEEDS_NATIVE_REVIEW] */
  'Vier Themen, bei denen FarmTree Agroforstwirtschaft-Investitionen verständlich macht'); /* [NEEDS_NATIVE_REVIEW] */

add('home.test.h2',    'What partners say about FarmTree',
  'Wat partners zeggen over FarmTree',
  'Was Partner über FarmTree sagen');

add('home.buyer.h2',   'Who uses FarmTree and how',
  'Wie FarmTree gebruikt en hoe',
  'Wer FarmTree nutzt und wie');

add('home.pstat.h2',   'What organisations say about working with FarmTree',
  'Wat organisaties zeggen over de samenwerking met FarmTree',
  'Was Organisationen über die Zusammenarbeit mit FarmTree sagen');

add('home.cta.h2',     'Join us in growing better agroforestry decisions.',
  'Doe mee aan betere agroforestry-beslissingen.',
  'Helfen Sie uns, bessere Agroforstwirtschaft-Entscheidungen zu treffen.');

/* Homepage news card labels */
add('news.tag1',  'Latest article',  'Nieuwste artikel',   'Neuester Artikel');
add('news.tag2',  'Platform update', 'Platformupdate',     'Plattform-Update');
add('news.tag3',  'Project story',   'Projectverhaal',     'Projektgeschichte');

/* Homepage phase cards */
add('phase.prep',  'Preparation',   'Voorbereiding',  'Vorbereitung');
add('phase.impl',  'Implementation','Implementatie',  'Umsetzung');
add('phase.scal',  'Scaling',       'Opschaling',     'Skalierung');
add('phase.mon',   'Monitoring',    'Monitoring',     'Monitoring');

/* Homepage counter section */
add('cnt.horizon', 'long-term scenario planning horizon',
  'langetermijn scenarioplanning horizon',
  'langfristiger Szenarioplanungshorizont');

add('cnt.proof',   'proof story themes prepared',
  'bewijs-thema\'s voorbereid',
  'Beweis-Themen vorbereitet');

add('cnt.phases',  'project phases clarified for buyers',
  'projectfasen verhelderd voor kopers',
  'Projektphasen für Käufer klärt');

add('cnt.mrv',     'reporting and monitoring narrative',
  'rapportage- en monitoringnarratie',
  'Berichterstattungs- und Überwachungsnarrativ');

/* Homepage buyer paths */
add('buyer.inv.h',    'Investors',           'Investeerders',    'Investoren');
add('buyer.dfi.h',    'DFIs and donors',     'OFI\'s en donoren','Entwicklungsbanken und Geber');
add('buyer.ngo.h',    'NGOs and implementers','NGO\'s en uitvoerders','NGOs und Umsetzer');
add('buyer.inv.btn',  'Investor path ↗', 'Investeerderstraject ↗', 'Investorenpfad ↗');
add('buyer.dfi.btn',  'DFI path ↗',      'OFI-traject ↗',          'Entwicklungsbanken-Pfad ↗');
add('buyer.ngo.btn',  'NGO path ↗',      'NGO-traject ↗',           'NGO-Pfad ↗');
add('buyer.scope.h',  'Talk to us about scope',
  'Bespreek uw scope met ons',
  'Sprechen Sie uns auf Ihren Umfang an');
add('buyer.scope.btn','View pricing structure ↗',
  'Bekijk prijsstructuur ↗',
  'Preisstruktur ansehen ↗');

/* Partner statements */
add('pstat.h1',  'Science that travels well',
  'Wetenschap die goed meereist',   'Wissenschaft, die gut reist');
add('pstat.h2',  'Depth where it matters',
  'Diepgang waar het telt',         'Tiefe, wo sie zählt');
add('pstat.h3',  'Local scenarios, fast',
  'Lokale scenario\'s, snel',       'Lokale Szenarien, schnell');

/* Testimonials section */
add('test.sub',  'Organisations that have worked with FarmTree across Africa, Asia and Latin America on planning, investment and reporting.',
  'Organisaties die met FarmTree hebben samengewerkt in Afrika, Azië en Latijns-Amerika op het gebied van planning, investering en rapportage.',
  'Organisationen, die mit FarmTree in Afrika, Asien und Lateinamerika in den Bereichen Planung, Investition und Berichterstattung zusammengearbeitet haben.');

/* Proof stories */
add('proof.s1.h', 'Programme investment planning',
  'Programmainvesteringsplanning',       'Programmainvestitionsplanung');
add('proof.s2.h', 'Carbon and farmer value modelling',
  'Koolstof- en boerderijwaardestmodellering',  'Kohlenstoff- und Landwirtschaftswertmodellierung');
add('proof.s3.h', 'Cacao landscape scenario planning',
  'Cacao-landschapsscenarioplanning',    'Kakaolandschafts-Szenarioplanung');
add('proof.s4.h', 'Water and landscape resilience monitoring',
  'Water- en landschapsveerkrachtmonitoring', 'Wasser- und Landschaftsresilienz-Überwachung');
add('proof.cta',  'Track Record ↗',  'Track Record ↗',  'Track Record ↗');

/* Target groups */
add('tg.inv.h',  'Investors & climate finance organisations',
  'Investeerders & klimaatfinancieringsorganisaties',
  'Investoren & Klimafinanzierungsorganisationen');
add('tg.dev.h',  'Project developers & programme officers',
  'Projectontwikkelaars & programmaofficieren',
  'Projektentwickler & Programmbeauftragte');
add('tg.sci.h',  'Field experts & scientists',
  'Veldexperts & wetenschappers',
  'Feldexperten & Wissenschaftler');
add('tg.far.h',  'Farmers & farmer organisations',
  'Boeren & boerenorganisaties',
  'Landwirte & Bauernorganisationen');
add('tg.mrv.h',  'MRV platforms & data providers',
  'MRV-platforms & dataproviders',
  'MRV-Plattformen & Datenanbieter');

/* Case study card labels */
add('cs.card.giz.h',    'GIZ / Madagascar programme planning',
  'GIZ / Madagaskar programmaplanning',
  'GIZ / Madagaskar Programmplanung');
add('cs.card.acorn.h',  'ACORN / Rabobank carbon planning',
  'ACORN / Rabobank koolstofplanning',
  'ACORN / Rabobank Kohlenstoffplanung');
add('cs.card.cocoa.h',  'Beyond Beans cocoa landscape planning',
  'Beyond Beans cacao-landschapsplanning',
  'Beyond Beans Kakaolandschaftsplanung');
add('cs.card.nyando.h', 'LOSO Nyando / water resilience',
  'LOSO Nyando / waterveerkracht',
  'LOSO Nyando / Wasserresilienz');

/* ══════════════════════════════════════════════════════════════
   TRACK RECORD PAGE
   ══════════════════════════════════════════════════════════════ */
add('track.h1',    'Track Record database for FarmTree projects',
  'Track Record-database voor FarmTree-projecten',
  'Track-Record-Datenbank für FarmTree-Projekte');
add('track.u.lbl', 'Active users',    'Actieve gebruikers',  'Aktive Nutzer');
add('track.u.p',   'Active FarmTree Tool users.',
  'Actieve gebruikers van de FarmTree Tool.',
  'Aktive Nutzer des FarmTree-Tools.');
add('track.p.lbl', 'Projects',        'Projecten',           'Projekte');
add('track.p.p',   'Projects supported with FarmTree methods and modelling.',
  'Projecten ondersteund met FarmTree-methoden en -modellering.',
  'Projekte, die mit FarmTree-Methoden und -Modellierung unterstützt werden.');
add('track.r.lbl', 'Regions',         'Regio\'s',            'Regionen');
add('track.r.p',   'Agricultural regions impacted.',
  'Landbouwregio\'s met impact.',
  'Betroffene Landwirtschaftsregionen.');
add('track.morogo','Morogoro, Tanzania',  'Morogoro, Tanzania',  'Morogoro, Tansania');
add('track.morogo.p','Watershed reforestation and restoration planning.',
  'Stroomgebied herbebossing en herstelplanning.',
  'Einzugsgebiet-Aufforstung und Wiederherstellungsplanung.');
add('track.acorn','Rabobank Acorn',   'Rabobank Acorn',      'Rabobank Acorn');
add('track.acorn.p','Carbon sequestration projections across Asia, Africa and Latin America.',
  'Koolstofvastleggingsprognoses in Azië, Afrika en Latijns-Amerika.',
  'Kohlenstoffsequestrierungsprojektionen in Asien, Afrika und Lateinamerika.');
add('track.bhutan', 'Bhutan',         'Bhutan',              'Bhutan');
add('track.bhutan.p','Entrepreneurial agroforestry strategy and landscape planning.',
  'Ondernemende agroforestry-strategie en landschapsplanning.',
  'Unternehmerische Agroforstwirtschaftsstrategie und Landschaftsplanung.');
add('track.mal',    'Malaysia',       'Maleisië',        'Malaysia');
add('track.mal.p',  'Integrated pest management in oil palm systems.',
  'Geïntegreerd plaagdierenbeheer in oliepalmsystemen.',
  'Integriertes Schädlingsmanagement in Ölpalmsystemen.');

/* ══════════════════════════════════════════════════════════════
   PLATFORM PAGE
   ══════════════════════════════════════════════════════════════ */
add('plat.h1',   'A software model and online interface for agroforestry scenarios',
  'Een softwaremodel en online interface voor agroforestry-scenario\'s',
  'Ein Softwaremodell und Online-Interface für Agroforstwirtschaftsszenarien');
add('plat.sub',  'Design agroforestry scenarios and project carbon, financial and environmental indicators for up to 50 years.',
  'Ontwerp agroforestry-scenario\'s en projecteer koolstof-, financiële en milieugerelateerde indicatoren tot 50 jaar vooruit.',
  'Entwerfen Sie Agroforstwirtschaftsszenarien und projizieren Sie Kohlenstoff-, Finanz- und Umweltindikatoren bis zu 50 Jahre.');
add('plat.method','Model methodology',  'Modelmethodologie',  'Modellmethodik');
add('plat.method.h2','Carbon, Production & Finance, Environment and Landscape Tool',
  'Koolstof, Productie & Financiën, Milieu en Landschapstool',
  'Kohlenstoff, Produktion & Finanzen, Umwelt und Landschafts-Tool');
add('plat.c.h',   'Carbon',            'Koolstof',            'Kohlenstoff');
add('plat.pf.h',  'Production & Finance', 'Productie & Financiën', 'Produktion & Finanzen');
add('plat.e.h',   'Environment',       'Milieu',              'Umwelt');
add('plat.l.h',   'Landscape Tool',    'Landschapstool',      'Landschafts-Tool');

/* ══════════════════════════════════════════════════════════════
   SOLUTIONS / SERVICES PAGE
   ══════════════════════════════════════════════════════════════ */
add('serv.h1',   'From expert led planning to independent operation',
  'Van expertgestuurde planning naar zelfstandige uitvoering',
  'Von expertengesteuerter Planung zum eigenständigen Betrieb');
add('serv.c1.h', 'Design & Understand',  'Ontwerpen & Begrijpen',  'Entwerfen & Verstehen');
add('serv.c2.h', 'Learn & Capture',      'Leren & Vastleggen',     'Lernen & Erfassen');
add('serv.c3.h', 'Operate & Scale',      'Beheren & Opschalen',    'Betreiben & Skalieren');

/* ══════════════════════════════════════════════════════════════
   PRICING PAGE
   ══════════════════════════════════════════════════════════════ */
add('price.h1',   'Scope-based pricing for modelling, reporting and platform support',
  'Scopegebaseerde prijsstelling voor modellering, rapportage en platformondersteuning', /* [NEEDS_NATIVE_REVIEW] */
  'Umfangsbasierte Preisgestaltung für Modellierung, Berichterstattung und Plattformunterstützung'); /* [NEEDS_NATIVE_REVIEW] */
add('price.c1.h', 'Analysis',          'Analyse',             'Analyse');
add('price.c2.h', 'Platform',          'Platform',            'Plattform');
add('price.c3.h', 'Scale',             'Schalen',             'Skalierung');
add('price.c1.p', 'For defined modelling questions and investment case reviews.',
  'Voor gedefinieerde modelleringsvragen en investeringsplanbeoordelingen.',
  'Für definierte Modellierungsfragen und Investitionsfallprüfungen.');
add('price.c2.p', 'For demo, onboarding and use-case specific platform access.',
  'Voor demo, onboarding en gebruiksscenario-specifieke platformtoegang.',
  'Für Demo, Onboarding und anwendungsfallspezifischen Plattformzugang.');
add('price.c3.p', 'For training, roll-out, field workflows and ongoing monitoring support.',
  'Voor training, uitrol, veldworkflows en doorlopende monitoringondersteuning.',
  'Für Schulung, Rollout, Feld-Workflows und laufende Überwachungsunterstützung.');

/* ══════════════════════════════════════════════════════════════
   COCOA PAGE
   ══════════════════════════════════════════════════════════════ */
add('cocoa.h1',  'Regenerative cocoa planning with long term projections',
  'Regeneratieve cacaoplanning met langetermijnprognoses',
  'Regenerative Kakaoplanung mit langfristigen Projektionen');
add('cocoa.c1',  'Shade tree density',
  'Dichtheid van schaduwbomen',
  'Schattbaumdichte');
add('cocoa.c2',  'Species mix',
  'Soortenmix',
  'Artenmischung');
add('cocoa.c3',  'Farmer income',
  'Boereninkomen',
  'Landwirtschaftliches Einkommen');
add('cocoa.c4',  'Carbon insetting',
  'Koolstofinsetting',
  'Kohlenstoff-Insetting');

/* ══════════════════════════════════════════════════════════════
   TEAM PAGE
   ══════════════════════════════════════════════════════════════ */
add('team.h1',   'A Wageningen based team combining science, modelling and software',
  'Een team uit Wageningen dat wetenschap, modellering en software combineert',
  'Ein Team aus Wageningen, das Wissenschaft, Modellierung und Software verbindet');

/* ══════════════════════════════════════════════════════════════
   VACANCIES PAGE
   ══════════════════════════════════════════════════════════════ */
add('vac.h1',    'Join us and help the world quantify trees',
  'Sluit u aan en help de wereld bomen te kwantificeren',
  'Schließen Sie sich uns an und helfen Sie der Welt, Bäume zu quantifizieren');
add('vac.c1.h',  'Financial Administrative Officer',
  'Financieel Administratief Medewerker', /* [NEEDS_NATIVE_REVIEW] */
  'Finanzverwaltungsbeauftragter'); /* [NEEDS_NATIVE_REVIEW] */
add('vac.c2.h',  'Internship: Modelling erosion',
  'Stage: Erosiemodellering',
  'Praktikum: Erosionsmodellierung');
add('vac.c3.h',  'Plant Database Development',
  'Plantendata base-ontwikkeling',
  'Pflanzendatenbankentwicklung');
add('vac.c4.h',  'MSc & BSc thesis or internship',
  'MSc & BSc thesis of stage',
  'MSc & BSc Abschlussarbeit oder Praktikum');

/* ══════════════════════════════════════════════════════════════
   ACKNOWLEDGEMENTS PAGE
   ══════════════════════════════════════════════════════════════ */
add('ack.h1',    'Scientific collaboration, field data and project partnerships',
  'Wetenschappelijke samenwerking, velddata en projectpartnerschappen', /* [NEEDS_NATIVE_REVIEW] */
  'Wissenschaftliche Zusammenarbeit, Felddaten und Projektpartnerschaften'); /* [NEEDS_NATIVE_REVIEW] */
add('ack.strong','A shared effort shaped by science, local knowledge and trusted collaboration',
  'Een gezamenlijke inspanning gevormd door wetenschap, lokale kennis en vertrouwde samenwerking', /* [NEEDS_NATIVE_REVIEW] */
  'Eine gemeinsame Anstrengung, geprägt durch Wissenschaft, lokales Wissen und vertrauensvolle Zusammenarbeit'); /* [NEEDS_NATIVE_REVIEW] */
add('ack.c1.h',  'Research partners',   'Onderzoekspartners',  'Forschungspartner');
add('ack.c2.h',  'Field contributors',  'Veldbijdragers',      'Feldbeiträger');
add('ack.c3.h',  'Funding and support', 'Financiering en ondersteuning', 'Finanzierung und Unterstützung');
add('ack.b1',    'Science first',       'Wetenschap voorop',   'Wissenschaft zuerst');
add('ack.b2',    'Field grounded',      'Veldverankerd',       'Feldverankert');
add('ack.b3',    'Shared learning',     'Gedeeld leren',       'Gemeinsames Lernen');

/* ══════════════════════════════════════════════════════════════
   LICENSES PAGE
   ══════════════════════════════════════════════════════════════ */
add('lic.h1',    'Responsible use of data, models and platform outputs',
  'Verantwoord gebruik van data, modellen en platformresultaten', /* [NEEDS_NATIVE_REVIEW] */
  'Verantwortungsvoller Umgang mit Daten, Modellen und Plattformergebnissen'); /* [NEEDS_NATIVE_REVIEW] */
add('lic.strong','A clear software licensing structure builds trust and reduces friction',
  'Een heldere softwarelicentiestructuur bouwt vertrouwen op en vermindert wrijving', /* [NEEDS_NATIVE_REVIEW] */
  'Eine klare Softwarelizenzstruktur schafft Vertrauen und reduziert Reibung'); /* [NEEDS_NATIVE_REVIEW] */
add('lic.c1.h',  'Platform access licence',    'Platformtoegangslicentie',     'Plattformzugangslizenz');
add('lic.c2.h',  'Project modelling licence',  'Projectmodelleringslicentie',  'Projektmodellierungslizenz');
add('lic.c3.h',  'Training and team licence',  'Training- en teamlicentie',    'Schulungs- und Teamlizenz');
add('lic.c4.h',  'Reporting and export licence','Rapportage- en exportlicentie','Berichterstattungs- und Exportlizenz');
add('lic.c5.h',  'Data responsibility note',   'Notitie gegevensverantwoordelijkheid','Datenv erantwortungshinweis');
add('lic.c6.h',  'Software stack note',        'Softwarestack-notitie',        'Software-Stack-Hinweis');

/* ══════════════════════════════════════════════════════════════
   CONTACT PAGE
   ══════════════════════════════════════════════════════════════ */
add('cont.h1',   'How can we help?',        'Waarmee kunnen we helpen?',    'Wie können wir helfen?');
add('cont.h2',   'FarmTree B.V.',            'FarmTree B.V.',                'FarmTree B.V.');
add('cont.p1',   'Contact details',          'Contactgegevens',              'Kontaktdaten');
add('cont.open', 'Open request form',        'Open aanvraagformulier',       'Anfrageformular öffnen');

/* ══════════════════════════════════════════════════════════════
   MODAL CONTENT
   ══════════════════════════════════════════════════════════════ */
add('modal.title',  'Request information',
  'Informatie aanvragen',
  'Informationen anfragen');
add('modal.sub',    'Tell FarmTree a little about your organisation, your goals and the question you want to discuss. This window opens directly on the page so the experience feels smooth and focused.',
  'Vertel FarmTree iets over uw organisatie, uw doelstellingen en de vraag die u wilt bespreken.', /* [NEEDS_NATIVE_REVIEW] */
  'Erzählen Sie FarmTree etwas über Ihre Organisation, Ihre Ziele und die Frage, die Sie besprechen möchten.'); /* [NEEDS_NATIVE_REVIEW] */
add('modal.f.name',    'Full name',             'Volledige naam',           'Vollständiger Name');
add('modal.f.company', 'Company or organisation','Bedrijf of organisatie',  'Unternehmen oder Organisation');
add('modal.f.email',   'Email address',          'E-mailadres',             'E-Mail-Adresse');
add('modal.f.role',    'Role',                   'Functie',                 'Funktion');
add('modal.f.interest','Area of interest',       'Interessegebied',         'Interessengebiet');
add('modal.f.timing',  'Preferred timing',       'Voorkeurstijdstip',       'Bevorzugter Zeitpunkt');
add('modal.f.question','Your question or project brief',
  'Uw vraag of projectbeschrijving',
  'Ihre Frage oder Projektbeschreibung');
add('modal.submit',    'Send request',           'Aanvraag versturen',      'Anfrage senden');
add('modal.footnote',  'A simple human message is enough. FarmTree can follow up with the right next step after reviewing your request.',
  'Een eenvoudig bericht is voldoende. FarmTree neemt contact op met de juiste volgende stap.', /* [NEEDS_NATIVE_REVIEW] */
  'Eine einfache Nachricht genügt. FarmTree meldet sich mit dem nächsten Schritt.'); /* [NEEDS_NATIVE_REVIEW] */
add('modal.success',   'Thank you. Your request is ready to be shared with the FarmTree team.',
  'Dank u. Uw aanvraag wordt gedeeld met het FarmTree-team.',
  'Vielen Dank. Ihre Anfrage wird mit dem FarmTree-Team geteilt.');

/* ══════════════════════════════════════════════════════════════
   TESTIMONIALS (verbatim quotes stay in original language
   but attribution lines can be translated)
   ══════════════════════════════════════════════════════════════ */
/* Quotes are intentionally kept in English as sourced quotes */

/* ══════════════════════════════════════════════════════════════
   WALK-TEXT-REPLACE — applies dictionary translations to
   existing DOM text nodes. Uses normalized matching to handle
   non-breaking spaces (&nbsp;) and minor whitespace variation.
   ══════════════════════════════════════════════════════════════ */
window.walkTextReplace = function(lang){
  if(!lang || lang === 'en') return;
  var dict = window.FT_DICT[lang];
  var enDict = window.FT_DICT.en;
  if(!dict || !enDict) return;

  /* Build EN→target lookup (normalized EN key → target value) */
  var lookup = {};
  Object.keys(enDict).forEach(function(key){
    var enVal = enDict[key];
    var tVal  = dict[key];
    if(enVal && tVal && enVal !== tVal){
      /* Store with normalized key (collapse nbsp and extra spaces) */
      var normKey = enVal.replace(/ /g,' ').replace(/\s+/g,' ').trim();
      lookup[normKey] = tVal;
    }
  });

  /* Walk all text nodes, skip script/style */
  var walker = document.createTreeWalker(
    document.body, NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node){
        if(!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = node.parentElement;
        if(!p) return NodeFilter.FILTER_REJECT;
        var t = p.tagName;
        if(t==='SCRIPT'||t==='STYLE'||t==='NOSCRIPT'||t==='CODE'||t==='PRE') return NodeFilter.FILTER_REJECT;
        /* Skip script attribute values */
        if(p.getAttribute && p.getAttribute('onclick')) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  var nodes = [], node;
  while((node = walker.nextNode())) nodes.push(node);

  nodes.forEach(function(n){
    var norm = n.nodeValue.replace(/ /g,' ').replace(/\s+/g,' ').trim();
    if(lookup[norm] !== undefined){
      /* Preserve outer whitespace */
      var lead = n.nodeValue.match(/^[\s ]*/)[0];
      var trail= n.nodeValue.match(/[\s ]*$/)[0];
      n.nodeValue = lead + lookup[norm] + trail;
    }
  });
};

/* ── Apply modal field labels ──────────────────────────────── */
function applyModalTranslations(lang){
  if(!window.FT_DICT[lang]) return;
  function t(k){ return (window.FT_DICT[lang][k]) || (window.FT_DICT.en[k]) || ''; }
  var modal = document.getElementById('ftContactModal');
  if(!modal) return;
  var h2 = modal.querySelector('#ftModalTitle');
  if(h2) h2.textContent = t('modal.title');
  var sub = modal.querySelector('.ft-modal-head p');
  if(sub) sub.textContent = t('modal.sub');
  var fn = modal.querySelector('.ft-modal-footnote');
  if(fn) fn.textContent = t('modal.footnote');
  var sb = modal.querySelector('.ft-modal-submit');
  if(sb) sb.textContent = t('modal.submit');
  /* Field labels */
  var lmap = {
    ftName:'modal.f.name', ftCompany:'modal.f.company',
    ftEmail:'modal.f.email', ftRole:'modal.f.role',
    ftInterest:'modal.f.interest', ftTiming:'modal.f.timing',
    ftQuestion:'modal.f.question'
  };
  Object.keys(lmap).forEach(function(id){
    var label = modal.querySelector('label[for="'+id+'"]');
    if(label) label.textContent = t(lmap[id]);
  });
}

/* ── Wrap setFTLanguage to include walkTextReplace ──────────── */
var prevSetFTLanguage = window.setFTLanguage;
window.setFTLanguage = function(lang){
  prevSetFTLanguage(lang);
  window.walkTextReplace(lang);
  applyModalTranslations(lang);
  /* Run again after any async DOM updates (JS-generated pages) */
  setTimeout(function(){ window.walkTextReplace(lang); applyModalTranslations(lang); }, 250);
  setTimeout(function(){ window.walkTextReplace(lang); }, 600);
};

/* ── Run on DOM ready to apply any saved language ──────────── */
(function initCompletion(){
  var lang = (function(){ try{ return localStorage.getItem('ftLang')||'en'; }catch(e){ return 'en'; } })();
  if(lang !== 'en'){
    function runWalk(){ window.walkTextReplace(lang); applyModalTranslations(lang); }
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(runWalk,100); setTimeout(runWalk,500); });
    } else {
      setTimeout(runWalk, 100);
      setTimeout(runWalk, 500);
    }
  }
})();

/* ══════════════════════════════════════════════════════════════
   PHASE 6 TRANSLATION ADDITIONS — SaaS credibility sections
   ══════════════════════════════════════════════════════════════ */

/* Platform in numbers */
add('p6.num.species',   '200+ Verified species in the CAFS database',
  '200+ Geverifieerde soorten in de CAFS-database',
  '200+ Verifizierte Arten in der CAFS-Datenbank');
add('p6.num.horizon',   '50-year projection horizon',
  '50-jarige projectiehorizon',
  '50-jähriger Projektionshorizont');
add('p6.num.kpis',      '+10 Impact KPIs per scenario',
  '+10 Impact-KPI\'s per scenario',
  '+10 Wirkungs-KPIs pro Szenario');
add('p6.num.domains',   '4 Interconnected model domains',
  '4 Onderling verbonden modelgebieden',
  '4 Miteinander verbundene Modellbereiche');
add('p6.num.countries', '18+ Countries with active projects',
  '18+ Landen met actieve projecten',
  '18+ Länder mit aktiven Projekten');

/* Data flow section */
add('p6.flow.lbl',  'How the model connects',
  'Hoe het model verbindt',
  'Wie das Modell verbindet');
add('p6.flow.h2',   'From site data to investor-ready projections',
  'Van locatiegegevens naar investeringsklare prognoses', /* [NEEDS_NATIVE_REVIEW] */
  'Von Standortdaten zu investitionsbereiten Projektionen'); /* [NEEDS_NATIVE_REVIEW] */
add('p6.flow.n1',   'Site information',     'Locatie-informatie',        'Standortinformationen');
add('p6.flow.n2',   'Climate data',         'Klimaatgegevens',           'Klimadaten');
add('p6.flow.n3',   'Soil & terrain',       'Bodem & terrein',           'Boden & Gelände');
add('p6.flow.n4',   'Species assumptions',  'Soortaannames',             'Artannahmen');
add('p6.flow.n5',   'Scenario modelling',   'Scenariomodellering',       'Szenariomodellierung');
add('p6.flow.n6',   'Impact reporting',     'Impactrapportage',          'Wirkungsberichterstattung');

/* Frame grid card labels */
add('p6.card1.lbl', 'Land type',     'Landtype',     'Landtyp');
add('p6.card1.val', 'Annual crops',  'Gewassenteelt', 'Einjährige Kulturen');
add('p6.card1.tc',  'Tree cover',    'Boomkroon',    'Baumbedeckung');
add('p6.card2.cafs','200+ verified species in the CAFS database',
  '200+ geverifieerde soorten in de CAFS-database',
  '200+ verifizierte Arten in der CAFS-Datenbank');
add('p6.card2.cafs.short','+900 species in CAFS',
  '+900 soorten in CAFS',
  '+900 Arten in CAFS');

/* Method grid numbers (replacing "Step X" text) */
add('p6.meth.find',  'Find & define',       'Vinden & definiëren',    'Finden & Definieren');
add('p6.meth.conn',  'Connect',             'Verbinden',              'Verbinden');
add('p6.meth.kpis',  '10 base indicators',  '10 basisindicatoren',    '10 Basisindikatoren');
add('p6.meth.proj',  'Future projection',   'Toekomstprojectie',      'Zukunftsprojektion');

/* ══════════════════════════════════════════════════════════════
   PHASE 5 TRANSLATION ADDITIONS
   Solutions, Track Record, Pricing
   [NEEDS_NATIVE_REVIEW] = body copy needing native speaker check
   ══════════════════════════════════════════════════════════════ */

/* ── Solutions page ─────────────────────────────────────────── */
add('sol.kicker',  'Solutions',
  'Oplossingen',
  'Lösungen');

add('sol.h1',     'From expert led planning to independent operation',
  'Van expertgestuurde planning naar zelfstandige uitvoering',
  'Von expertengeführter Planung zum eigenständigen Betrieb');

add('sol.how.lbl','How it works',
  'Hoe het werkt',
  'Wie es funktioniert');

add('sol.how.h2', 'A structured journey from scenario design to scaled delivery',
  'Een gestructureerd traject van scenario-ontwerp naar grootschalige uitvoering', /* [NEEDS_NATIVE_REVIEW] */
  'Eine strukturierte Reise vom Szenario-Design zur skalierten Umsetzung'); /* [NEEDS_NATIVE_REVIEW] */

add('sol.svc.lbl','Service areas',
  'Servicegebieden',
  'Servicebereiche');

add('sol.svc.h2', 'Three ways FarmTree supports your agroforestry work',
  'Drie manieren waarop FarmTree uw agroforestry-werk ondersteunt',
  'Drei Wege, wie FarmTree Ihre Agroforstwirtschaftsarbeit unterstützt');

add('sol.plat.lbl','Platform supported',
  'Platformondersteund',
  'Plattformgestützt');

add('sol.plat.h2','Every service is backed by FarmTree\'s science-based modelling platform',
  'Elke service wordt ondersteund door FarmTree\'s wetenschappelijk modelleringsplatform',
  'Jeder Service wird durch FarmTrees wissenschaftsbasierte Modellierungsplattform unterstützt');

add('sol.cta.h2', 'Ready to start your agroforestry journey with FarmTree?',
  'Klaar om uw agroforestry-traject te beginnen met FarmTree?', /* [NEEDS_NATIVE_REVIEW] */
  'Bereit, Ihre Agroforstwirtschaftsreise mit FarmTree zu starten?'); /* [NEEDS_NATIVE_REVIEW] */

/* Step labels */
add('sol.step1.h', 'Understand & Scope',    'Begrijpen & Bepalen',    'Verstehen & Umfang bestimmen');
add('sol.step2.h', 'Design Scenarios',      'Scenario\'s Ontwerpen',  'Szenarien Entwerfen');
add('sol.step3.h', 'Deliver & Train',       'Leveren & Trainen',      'Liefern & Schulen');
add('sol.step4.h', 'Scale & Report',        'Opschalen & Rapporteren','Skalieren & Berichten');

/* Phase card labels */
add('sol.ph1.no',  '01 / Understand & Design', '01 / Begrijpen & Ontwerpen',   '01 / Verstehen & Entwerfen');
add('sol.ph2.no',  '02 / Capture & Learn',     '02 / Vastleggen & Leren',      '02 / Erfassen & Lernen');
add('sol.ph3.no',  '03 / Operate & Scale',     '03 / Beheren & Opschalen',     '03 / Betreiben & Skalieren');

/* Deliverables label */
add('sol.deliverable.lbl','What you receive',
  'Wat u ontvangt',
  'Was Sie erhalten');

/* Case example links */
add('sol.cs.giz',  'Case example: GIZ / Madagascar ↗',
  'Praktijkvoorbeeld: GIZ / Madagaskar ↗',
  'Fallbeispiel: GIZ / Madagaskar ↗');
add('sol.cs.acorn','Case example: ACORN / Rabobank ↗',
  'Praktijkvoorbeeld: ACORN / Rabobank ↗',
  'Fallbeispiel: ACORN / Rabobank ↗');
add('sol.cs.cocoa','Case example: Beyond Beans ↗',
  'Praktijkvoorbeeld: Beyond Beans ↗',
  'Fallbeispiel: Beyond Beans ↗');

/* Platform capability labels */
add('plat.carbon.lbl', 'Carbon',              'Koolstof',            'Kohlenstoff');
add('plat.pf.lbl',     'Production & Finance','Productie & Financiën','Produktion & Finanzen');
add('plat.env.lbl',    'Environment',         'Milieu',              'Umwelt');
add('plat.land.lbl',   'Landscape Tool',      'Landschapstool',      'Landschafts-Tool');

/* Shared CTAs */
add('cta.explore.platform','Explore the platform','Platform verkennen',    'Plattform erkunden');
add('cta.track.record',    'View our Track Record','Bekijk onze Track Record','Track Record ansehen');
add('cta.discuss.scope',   'Discuss your project scope','Bespreek uw projectomvang','Projektumfang besprechen');
add('cta.talk.team',       'Talk to the team',    'Neem contact op met het team','Das Team kontaktieren');
add('cta.read.case',       'Read a case study',   'Lees een casestudie',   'Fallstudie lesen');

/* ── Track Record page ──────────────────────────────────────── */
add('tr.kicker',   'Track Record',
  'Track Record',
  'Track Record');

add('tr.h1',      'A growing database of agroforestry projects supported by FarmTree',
  'Een groeiende database van agroforestry-projecten ondersteund door FarmTree', /* [NEEDS_NATIVE_REVIEW] */
  'Eine wachsende Datenbank von Agroforstwirtschaftsprojekten, die von FarmTree unterstützt werden'); /* [NEEDS_NATIVE_REVIEW] */

add('tr.db.lbl',  'Project database',
  'Projectdatabase',
  'Projektdatenbank');

add('tr.db.h2',   'Selected projects from the FarmTree portfolio',
  'Geselecteerde projecten uit het FarmTree-portfolio', /* [NEEDS_NATIVE_REVIEW] */
  'Ausgewählte Projekte aus dem FarmTree-Portfolio'); /* [NEEDS_NATIVE_REVIEW] */

add('tr.geo.lbl', 'Geographic coverage',
  'Geografische dekking',
  'Geografische Abdeckung');

add('tr.geo.h2',  'Projects across three continents and growing',
  'Projecten op drie continenten, met groeiende aanwezigheid', /* [NEEDS_NATIVE_REVIEW] */
  'Projekte auf drei Kontinenten und wachsend'); /* [NEEDS_NATIVE_REVIEW] */

add('tr.cta.h2',  'Want to discuss what FarmTree has done in your context?',
  'Wilt u bespreken wat FarmTree in uw context heeft gedaan?', /* [NEEDS_NATIVE_REVIEW] */
  'Möchten Sie besprechen, was FarmTree in Ihrem Kontext geleistet hat?'); /* [NEEDS_NATIVE_REVIEW] */

/* Metrics */
add('tr.metric.users',    'Active users',          'Actieve gebruikers',      'Aktive Nutzer');
add('tr.metric.projects', 'Projects supported',    'Projecten ondersteund',   'Projekte unterstützt');
add('tr.metric.countries','Countries reached',     'Landen bereikt',          'Länder erreicht');
add('tr.metric.regions',  'Agricultural regions',  'Landbouwregio\'s',        'Landwirtschaftsregionen');

/* Category chips */
add('tr.chip.all',      'All projects',        'Alle projecten',       'Alle Projekte');
add('tr.chip.planning', 'Investment planning', 'Investeringsplanning', 'Investitionsplanung');
add('tr.chip.carbon',   'Carbon',              'Koolstof',             'Kohlenstoff');
add('tr.chip.cocoa',    'Cocoa',               'Cacao',                'Kakao');
add('tr.chip.water',    'Water',               'Water',                'Wasser');
add('tr.chip.landscape','Landscape',           'Landschap',            'Landschaft');

/* Card CTA */
add('tr.card.cta',      'Read case study ↗',   'Lees casestudie ↗',    'Fallstudie lesen ↗');

/* Project card headings */
add('tr.p.giz.h',    'GIZ / Madagascar Programme Planning',
  'GIZ / Madagaskar Programmaplanning',
  'GIZ / Madagaskar Programmplanung');
add('tr.p.acorn.h',  'ACORN / Rabobank Carbon Planning',
  'ACORN / Rabobank Koolstofplanning',
  'ACORN / Rabobank Kohlenstoffplanung');
add('tr.p.cocoa.h',  'Beyond Beans Cocoa Landscape Planning',
  'Beyond Beans Cacao-Landschapsplanning',
  'Beyond Beans Kakaolandschaftsplanung');
add('tr.p.nyando.h', 'LOSO Nyando Water & Landscape Resilience',
  'LOSO Nyando Water & Landschapsveerkracht',
  'LOSO Nyando Wasser & Landschaftsresilienz');
add('tr.p.morogo.h', 'Morogoro Watershed Reforestation',
  'Morogoro Stroomgebiedherbebossing',
  'Morogoro Einzugsgebiet-Aufforstung');
add('tr.p.bhutan.h', 'Bhutan Agroforestry Strategy',
  'Bhutan Agroforestrystrategie',
  'Bhutan Agroforstwirtschaftsstrategie');
add('tr.p.mal.h',    'Malaysia Integrated Land Use',
  'Maleisië Geïntegreerd Landgebruik',
  'Malaysia Integrierte Landnutzung');
add('tr.p.cgiar.h',  'CGIAR Research Programmes',
  'CGIAR Onderzoeksprogramma\'s',
  'CGIAR Forschungsprogramme');

/* Geographic regions */
add('tr.geo.africa.h',  'Sub-Saharan Africa',    'Sub-Sahara Afrika',    'Subsaharisches Afrika');
add('tr.geo.asia.h',    'Asia & Pacific',         'Azië & Pacific',       'Asien & Pazifik');
add('tr.geo.latam.h',   'Latin America',          'Latijns-Amerika',      'Lateinamerika');

/* ── Pricing page ───────────────────────────────────────────── */
add('price.kicker',   'Pricing',
  'Prijzen',
  'Preisgestaltung');

add('price.h1',       'Scope-based pricing built around your project reality',
  'Scopegebaseerde prijsstelling op basis van uw projectrealiteit', /* [NEEDS_NATIVE_REVIEW] */
  'Umfangsbasierte Preisgestaltung, die auf Ihre Projektrealität zugeschnitten ist'); /* [NEEDS_NATIVE_REVIEW] */

add('price.approach.lbl','Our approach',
  'Onze aanpak',
  'Unser Ansatz');

add('price.approach.h2','Why we price by scope, not by feature',
  'Waarom we naar scope prijzen, niet naar functie',
  'Warum wir nach Umfang und nicht nach Funktionen kalkulieren');

add('price.tiers.lbl',  'Scope tiers',
  'Scopeniveaus',
  'Umfangsstufen');

add('price.tiers.h2',   'Three levels of engagement — choose where to start',
  'Drie niveaus van betrokkenheid — kies waar u wilt beginnen', /* [NEEDS_NATIVE_REVIEW] */
  'Drei Engagement-Ebenen — wählen Sie, wo Sie starten möchten'); /* [NEEDS_NATIVE_REVIEW] */

add('price.scope.lbl',  'Scope factors',
  'Omvangsfactoren',
  'Umfangsfaktoren');

add('price.scope.h2',   'What affects the scope and depth of an engagement',
  'Wat de omvang en diepte van een betrokkenheid beïnvloedt',
  'Was den Umfang und die Tiefe einer Zusammenarbeit beeinflusst');

add('price.faq.lbl',    'Common questions',
  'Veelgestelde vragen',
  'Häufige Fragen');

add('price.faq.h2',     'Frequently asked pricing questions',
  'Veelgestelde vragen over prijzen',
  'Häufig gestellte Fragen zur Preisgestaltung');

add('price.cta.h2',     'Ready to discuss your scope?',
  'Klaar om uw scope te bespreken?', /* [NEEDS_NATIVE_REVIEW] */
  'Bereit, Ihren Umfang zu besprechen?'); /* [NEEDS_NATIVE_REVIEW] */

/* Philosophy cards */
add('price.phil1.h',    'Consultative',    'Consultatief',    'Beratend');
add('price.phil2.h',    'Transparent',     'Transparant',     'Transparent');
add('price.phil3.h',    'Flexible',        'Flexibel',        'Flexibel');

/* Tier labels */
add('price.t1.lbl',     'Tier 01',   'Niveau 01',   'Stufe 01');
add('price.t2.lbl',     'Tier 02',   'Niveau 02',   'Stufe 02');
add('price.t3.lbl',     'Tier 03',   'Niveau 03',   'Stufe 03');
add('price.t1.h',       'Analysis',  'Analyse',     'Analyse');
add('price.t2.h',       'Platform',  'Platform',    'Plattform');
add('price.t3.h',       'Scale',     'Schalen',     'Skalierung');
add('price.t2.popular', 'Most popular','Meest gekozen','Am häufigsten gewählt');

/* Includes label */
add('price.includes',   'What\'s included',  'Wat is inbegrepen',    'Was enthalten ist');
add('price.typical',    'Typical for',       'Typisch voor',         'Typisch für');

/* Tier CTAs */
add('price.t1.cta', 'Request an analysis scope',  'Analyseomvang aanvragen', 'Analyseumfang anfragen');
add('price.t2.cta', 'Request a platform scope',   'Platformomvang aanvragen','Plattformumfang anfragen');
add('price.t3.cta', 'Request a scale scope',      'Schaalomvang aanvragen',  'Skalierungsumfang anfragen');

/* Scope factor headings */
add('pscope.f1.h', 'Number of countries and sites',       'Aantal landen en locaties',        'Anzahl der Länder und Standorte');
add('pscope.f2.h', 'Species and calibration complexity',  'Soort- en kalibratiecomplexiteit', 'Arten- und Kalibrierungskomplexität');
add('pscope.f3.h', 'Team training requirement',           'Trainingsbehoefte team',           'Schulungsbedarf des Teams');
add('pscope.f4.h', 'Reporting format and standard',       'Rapportageformaat en -standaard',  'Berichterstattungsformat und -standard');
add('pscope.f5.h', 'Monitoring and MRV alignment',        'Monitoring en MRV-afstemming',     'Überwachung und MRV-Ausrichtung');
add('pscope.f6.h', 'Frequency of updates and support',    'Frequentie van updates en ondersteuning', 'Häufigkeit von Updates und Support');

/* Pricing FAQ questions */
add('pfaq.q1', 'Do you publish fixed prices?',
  'Publiceert u vaste prijzen?',
  'Veröffentlichen Sie Festpreise?');
add('pfaq.q2', 'Can we start small and expand later?',
  'Kunnen we klein beginnen en later uitbreiden?',
  'Können wir klein anfangen und später expandieren?');
add('pfaq.q3', 'How long does a typical engagement take?',
  'Hoe lang duurt een typische betrokkenheid?',
  'Wie lange dauert eine typische Zusammenarbeit?');
add('pfaq.q4', 'Is there a free trial or introductory session?',
  'Is er een gratis proef of introductiesessie?',
  'Gibt es eine kostenlose Testversion oder Einführungssitzung?');
add('pfaq.q5', 'What is included in ongoing support?',
  'Wat is inbegrepen in doorlopende ondersteuning?',
  'Was ist in der laufenden Unterstützung enthalten?');
add('pfaq.q6', 'Can the outputs be used for investor and donor reporting?',
  'Kunnen de resultaten worden gebruikt voor rapportage aan investeerders en donoren?', /* [NEEDS_NATIVE_REVIEW] */
  'Können die Ergebnisse für Investor- und Geberberichte verwendet werden?'); /* [NEEDS_NATIVE_REVIEW] */

/* CTA buttons shared */
add('cta.request.quote', 'Request a quotation',   'Offerte aanvragen',    'Angebot anfragen');
add('cta.view.services', 'View service areas',    'Bekijk servicegebieden','Servicebereiche ansehen');

})(); /* end ft-lang-completion-v2 */

/* ---- block 40 ---- */
/* Phase 7 — deployment safety guards */
(function(){
'use strict';

/* Guard: catch and silence any remaining 404 image errors cleanly */
document.addEventListener('error', function(e){
  var el = e.target;
  if(el && el.tagName === 'IMG'){
    /* Hide broken images gracefully instead of showing alt-text broken icon */
    el.style.visibility = 'hidden';
    el.style.minHeight = '0';
  }
}, true);

/* Guard: ensure localStorage availability (private mode Safari) */
window._ftStorageSafe = (function(){
  try{ localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return true; }
  catch(e){ return false; }
})();

/* Guard: neutralise any remaining broken slider JS that refs missing images */
var knownMissingImages = ['platform-slide-1.png','platform-slide-2.png'];
var origSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, value){
  if(name === 'src' && typeof value === 'string'){
    var broken = knownMissingImages.some(function(img){ return value.indexOf(img) !== -1; });
    if(broken){ return; } /* skip setting broken src */
  }
  origSetAttribute.call(this, name, value);
};

/* Guard: ensure all [data-page] clicks on elements without matching pages are no-ops */
document.addEventListener('click', function(e){
  var trigger = e.target.closest && e.target.closest('[data-page]');
  if(!trigger) return;
  var pageId = trigger.getAttribute('data-page');
  if(!pageId || pageId.charAt(0) === '$') return; /* skip JS template literals */
  if(!document.getElementById('page-' + pageId)){
    e.stopImmediatePropagation();
  }
}, true);

})(); /* end ft-phase7-deploy-guard */

/* ---- block 41 ---- */
/* Production form transport (Formspree).
   SETUP: create a form at https://formspree.io and replace YOUR_FORM_ID
   below — one place only. See FORMS.md. While the placeholder is present,
   submissions fail safely and users see the error state (no fake success). */
window.FT_FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
window.ftSubmitLead = function(payload){
  return fetch(window.FT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function(r){
    if(!r.ok) throw new Error('Form endpoint returned ' + r.status);
    return r;
  });
};

/* ---- block 42 ---- */
/* Responsive SVG connectors from the Base Technology diagram to its four
   method cards, with a calm staggered light pulse. Progressive enhancement:
   no JS -> no connectors, section unaffected. Geometry from live bounding
   boxes; debounced resize; SMIL pause when offscreen; reduced-motion drops
   the pulses (paths stay). Decorative: aria-hidden, no pointer events. */
(function(){
  var SVGNS='http://www.w3.org/2000/svg';
  function init(){
    var section=document.querySelector('.ft-p6-grid-bg');
    if(!section) return;
    var diagram=section.querySelector('#diagram');
    var grid=section.querySelector('.ft-method-grid');
    if(!diagram||!grid) return;
    var cards=Array.prototype.slice.call(grid.querySelectorAll('article'));
    if(cards.length!==4) return;
    var host=diagram.closest('.container')||section;
    host.classList.add('ft-connect-host');
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var svg=document.createElementNS(SVGNS,'svg');
    svg.setAttribute('class','ft-connect-layer');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    svg.setAttribute('preserveAspectRatio','none');
    var paths=[];
    for(var i=0;i<4;i++){
      var p=document.createElementNS(SVGNS,'path');
      p.setAttribute('class','ft-connect-path');
      p.setAttribute('id','ftConnP'+i);
      svg.appendChild(p); paths.push(p);
    }
    if(!reduce){
      for(var j=0;j<4;j++){
        var c=document.createElementNS(SVGNS,'circle');
        c.setAttribute('class','ft-connect-pulse'); c.setAttribute('r','3.2');
        var am=document.createElementNS(SVGNS,'animateMotion');
        am.setAttribute('dur','2.8s'); am.setAttribute('repeatCount','indefinite');
        am.setAttribute('begin',(j*0.6)+'s'); am.setAttribute('calcMode','spline');
        am.setAttribute('keyTimes','0;1'); am.setAttribute('keySplines','0.4 0 0.2 1');
        var mp=document.createElementNS(SVGNS,'mpath');
        mp.setAttributeNS('http://www.w3.org/1999/xlink','href','#ftConnP'+j);
        mp.setAttribute('href','#ftConnP'+j);
        am.appendChild(mp); c.appendChild(am); svg.appendChild(c);
      }
    }
    host.appendChild(svg);
    function draw(){
      var cr=host.getBoundingClientRect();
      if(!cr.width||!cr.height) return;
      svg.setAttribute('viewBox','0 0 '+cr.width+' '+cr.height);
      svg.setAttribute('width',cr.width); svg.setAttribute('height',cr.height);
      var dr=diagram.getBoundingClientRect();
      var startY=dr.bottom-cr.top;
      var centerX=dr.left+dr.width/2-cr.left;
      var sameRow=Math.abs(cards[0].getBoundingClientRect().top-cards[3].getBoundingClientRect().top)<4;
      for(var i=0;i<4;i++){
        var r=cards[i].getBoundingClientRect();
        var endX=r.left+r.width/2-cr.left, endY=r.top-cr.top, d;
        if(sameRow){
          var sx=centerX+(i-1.5)*(dr.width*0.11);
          var midY=(startY+endY)/2;
          d='M'+sx.toFixed(1)+' '+startY.toFixed(1)+' C '+sx.toFixed(1)+' '+midY.toFixed(1)+' '+endX.toFixed(1)+' '+midY.toFixed(1)+' '+endX.toFixed(1)+' '+endY.toFixed(1);
        }else{
          d='M'+endX.toFixed(1)+' '+(endY-20).toFixed(1)+' L '+endX.toFixed(1)+' '+endY.toFixed(1);
        }
        paths[i].setAttribute('d',d);
      }
    }
    var t, redraw=function(){clearTimeout(t);t=setTimeout(draw,120);};
    window.addEventListener('resize',redraw);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(draw);
    var img=diagram.querySelector('img'); if(img&&!img.complete) img.addEventListener('load',draw);
    /* ResizeObserver on the host catches image-load/font reflow -> pixel-exact
       connectors without continuous polling (debounced) */
    if('ResizeObserver' in window){ new ResizeObserver(redraw).observe(host); }
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting){ draw(); if(!reduce){ try{svg.unpauseAnimations();}catch(err){} } }
        else if(!reduce){ try{svg.pauseAnimations();}catch(err){} }
      });},{rootMargin:'200px'}).observe(section);
    }
    draw(); setTimeout(draw,300); setTimeout(draw,900);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

/* ---- block 43 ---- */
(function(){
  var slider=document.querySelector('.ft-media-slider');
  if(!slider) return;
  var track=slider.querySelector('.ft-ms-track');
  var slides=[].slice.call(slider.querySelectorAll('.ft-ms-slide'));
  var dots=[].slice.call(slider.querySelectorAll('.ft-ms-dot'));
  var prev=slider.querySelector('.ft-ms-prev');
  var next=slider.querySelector('.ft-ms-next');
  var video=slider.querySelector('.ft-ms-video');
  var n=slides.length, i=0, sectionVisible=false;
  var reduceMQ=(window.matchMedia)?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false,addEventListener:null,addListener:null};

  /* Play the decorative loop ONLY when slide 1 is active, the section is
     reasonably visible, the tab is visible and reduced-motion is not set.
     Pause in every other case. Idempotent: never issues duplicate play/pause;
     never restarts the slider; swallows harmless autoplay-rejection errors. */
  function updatePlayback(){
    if(!video) return;
    var shouldPlay = (i===0) && sectionVisible && !document.hidden && !reduceMQ.matches;
    if(shouldPlay){
      if(video.paused){
        video.muted=true;
        var pr=video.play();
        if(pr && pr.catch){ pr.catch(function(){/* autoplay rejection is harmless — do not log */}); }
      }
    } else if(!video.paused){
      video.pause();
    }
  }

  function go(idx){
    i=(idx%n+n)%n;
    track.style.transform='translateX('+(-i*100)+'%)';
    slides.forEach(function(s,k){ s.setAttribute('aria-hidden', k===i?'false':'true'); });
    dots.forEach(function(d,k){
      var on=k===i;
      d.classList.toggle('is-active',on);
      d.setAttribute('aria-selected', on?'true':'false');
    });
    updatePlayback();
  }

  if(prev) prev.addEventListener('click',function(){ go(i-1); });
  if(next) next.addEventListener('click',function(){ go(i+1); });
  dots.forEach(function(d,k){ d.addEventListener('click',function(){ go(k); }); });
  slider.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){ e.preventDefault(); go(i-1); }
    else if(e.key==='ArrowRight'){ e.preventDefault(); go(i+1); }
  });

  if(video){
    video.muted=true; /* required for programmatic play without a user gesture */
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){
        var e=entries[entries.length-1];
        sectionVisible = e.isIntersecting && e.intersectionRatio>=0.25;
        updatePlayback();
      },{threshold:[0,0.25,0.6]});
      io.observe(slider);
    } else { sectionVisible=true; }
    document.addEventListener('visibilitychange',updatePlayback);
    if(reduceMQ.addEventListener) reduceMQ.addEventListener('change',updatePlayback);
    else if(reduceMQ.addListener) reduceMQ.addListener(updatePlayback);
  }

  go(0); /* manual only — no autoplay/timer between slides */
})();
