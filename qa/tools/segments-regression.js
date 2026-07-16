/* Regression suite for the 2026-07 approved changes:
   footer socials, About proof row + icon, Customer Segments removal,
   ten segment pages, hamburger-menu segment navigation.
   Usage: node qa/tools/segments-regression.js [baseUrl]                */
const puppeteer = require('puppeteer-core');
const BASE = process.argv[2] || 'http://localhost:8899/index.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const REG = 'https://tool.farmtree.earth/Identity/Account/Register';
const SEGMENTS = {
  'advisors': 'Consultancy & Agroforestry Advisors',
  'development-banks-donors': 'Development Banks & Donor Organisations',
  'ngos-conservation': 'NGOs & Conservation Organisations',
  'nbs-carbon': 'NbS & Carbon Project Developers',
  'mrv-esg': 'MRV & ESG Platforms',
  'government-parastatals': 'Government & Parastatals',
  'industry-associations': 'Industry Associations & MSPs',
  'large-agri-corporates': 'Large Agri-Corporates',
  'social-enterprise': 'Social Enterprise',
  'implementation-organisations': 'Implementation Organisations'
};

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const failures = [];
  const A = (name, cond, detail) => { if (!cond) failures.push(`${name}: ${detail}`); };
  const settle = ms => new Promise(r => setTimeout(r, ms));
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  page.on('pageerror', e => failures.push(`pageerror: ${e.message.slice(0, 90)}`));

  // ---------- FOOTER (checks 1-6) ----------
  await page.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await settle(1100);
  const foot = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.socials > *')];
    return items.map(el => ({
      tag: el.tagName, href: el.getAttribute('href'), target: el.getAttribute('target'),
      rel: el.getAttribute('rel'), label: el.getAttribute('aria-label'), title: el.getAttribute('title'),
      focusable: el.tabIndex >= 0, svg: !!el.querySelector('svg')
    }));
  });
  A('footer LinkedIn href', foot[0]?.href === 'https://www.linkedin.com/company/farmtree-b-v', JSON.stringify(foot[0]));
  A('footer YouTube href', foot[1]?.href === 'https://www.youtube.com/@farmtree8168', JSON.stringify(foot[1]));
  A('footer target/rel', foot[0]?.target === '_blank' && foot[0]?.rel === 'noopener noreferrer' &&
    foot[1]?.target === '_blank' && foot[1]?.rel === 'noopener noreferrer', JSON.stringify([foot[0], foot[1]]));
  A('footer accessible names', foot[0]?.label === 'FarmTree on LinkedIn' && foot[1]?.label === 'FarmTree on YouTube', 'labels');
  A('footer keyboard focusable', foot[0]?.focusable && foot[1]?.focusable, 'tabIndex');
  A('footer YouTube svg present', foot[1]?.svg === true, 'svg missing');
  const footMod = await page.evaluate(() => {
    const a = document.querySelector('.socials a');
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true });
    a.dispatchEvent(ev); return ev.defaultPrevented;
  });
  A('footer no JS navigation interference', footMod === false, 'modifier click prevented');
  await page.bringToFront(); // the modifier-click opened a background tab; rAF freezes on hidden pages

  // ---------- ABOUT (final 4-card design, 2026-07-15) ----------
  await page.evaluate(() => document.querySelector('.ft-about-feedback').scrollIntoView({ block: 'center' }));
  await settle(1200);
  const about = await page.evaluate(() => ({
    slogan: [...document.querySelectorAll('.ft-about-feedback .big-title')].map(h => h.textContent.trim()),
    oldCards: ['+10 KPIs', '50 years', 'Science-based'].filter(t =>
      [...document.querySelectorAll('.ft-about-feedback h3')].some(h => h.textContent.trim() === t)),
    proofRow: !!document.querySelector('.about-proof-grid'),
    cards: [...document.querySelectorAll('.ft-track-metrics .metric')].map(m =>
      m.querySelector('h3').textContent.trim() + '|' + m.querySelector('p').textContent.trim()),
    svgs: document.querySelectorAll('.ft-track-metrics .metric-icon svg').length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }));
  A('about slogan removed', about.slogan.length === 0, JSON.stringify(about.slogan));
  A('about old capability cards removed', about.oldCards.length === 0, JSON.stringify(about.oldCards));
  A('about compact proof row removed', !about.proofRow, 'still present');
  A('about exactly four primary cards, exact values+labels', JSON.stringify(about.cards) === JSON.stringify([
    '+100|Active FarmTree Tool users', '+30|Projects', '+40|Agricultural regions impacted', '+1,000,000|Farmers indirectly reached'
  ]), JSON.stringify(about.cards));
  A('about four ring icons', about.svgs === 4, about.svgs);
  A('about no horizontal overflow', !about.overflow, 'overflow');

  // ---------- HOMEPAGE REMOVAL (checks 12-15) ----------
  const home = await page.evaluate(() => ({
    segSection: !!document.getElementById('frank-usecases-pricing'),
    segCards: document.querySelectorAll('.ft-seg-card').length,
    segControls: !!document.getElementById('ftSegPrev') || !!document.getElementById('ftSegDots'),
    faq: !!document.getElementById('faq'), partners: !!document.getElementById('partner-statements'),
    testimonials: !!document.getElementById('testimonials')
  }));
  A('homepage segments section absent', !home.segSection, 'still present');
  A('homepage no orphaned carousel controls', home.segCards === 0 && !home.segControls, JSON.stringify(home));
  A('homepage surrounding sections render', home.faq && home.partners && home.testimonials, JSON.stringify(home));

  // ---------- MENU (checks 16-20) ----------
  await page.evaluate(() => document.getElementById('openMenu').click());
  await settle(400);
  const menu = await page.evaluate(() => {
    const links = [...document.querySelectorAll('.ft-menu-seg-grid [data-page]')];
    const m = document.getElementById('mobileMenu');
    return { routes: links.map(l => l.dataset.page), scrollOK: getComputedStyle(m).overflowY !== 'visible' };
  });
  A('menu 10 segment links', menu.routes.length === 10, menu.routes.length);
  A('menu routes correct', Object.keys(SEGMENTS).every(s => menu.routes.includes('segment-' + s)), JSON.stringify(menu.routes));
  A('menu scrollable', menu.scrollOK, 'overflow visible');
  await page.evaluate(() => document.querySelector('.ft-menu-seg-grid [data-page="segment-social-enterprise"]').click());
  await settle(800);
  const afterClick = await page.evaluate(() => ({
    page: [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none').map(x => x.id),
    menuOpen: document.getElementById('mobileMenu').classList.contains('open')
  }));
  A('menu click opens route + closes menu', afterClick.page[0] === 'page-segment-social-enterprise' && !afterClick.menuOpen, JSON.stringify(afterClick));
  // menu navigation must PUSH history: Back returns to the pre-click route,
  // Forward re-enters the destination (fails on replaceState semantics)
  await page.goBack(); await settle(600);
  const histBack = await page.evaluate(() => ({ hash: location.hash, page: [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none')[0]?.id }));
  A('menu nav Back returns to previous route', histBack.hash === '#home' && histBack.page === 'page-home', JSON.stringify(histBack));
  await page.goForward(); await settle(600);
  const histFwd = await page.evaluate(() => ({ hash: location.hash, page: [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none')[0]?.id }));
  A('menu nav Forward re-enters route', histFwd.hash === '#segment-social-enterprise' && histFwd.page === 'page-segment-social-enterprise', JSON.stringify(histFwd));

  // ---------- SEGMENT PAGES (checks 21-30) ----------
  for (const [slug, title] of Object.entries(SEGMENTS)) {
    await page.goto(`${BASE}#segment-${slug}`, { waitUntil: 'networkidle2' });
    await settle(650);
    const st = await page.evaluate(() => {
      const vis = [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none');
      const pg = vis[0];
      return {
        vis: vis.map(v => v.id), h1: pg?.querySelector('h1')?.textContent.trim(),
        demo: pg?.querySelector('a[data-ft-action="request-demo"]')?.getAttribute('href'),
        modalBtn: !!pg?.querySelector('[data-ftmodal="request"]'),
        outputs: pg ? pg.querySelectorAll('.ft-seg-outputs li').length : 0,
        context: pg?.querySelector('.ft-seg-section p')?.textContent.length > 60
      };
    });
    A(`#segment-${slug} single active + H1`, st.vis.length === 1 && st.vis[0] === `page-segment-${slug}` && st.h1 === title, JSON.stringify(st));
    A(`#segment-${slug} demo href`, st.demo === REG, st.demo);
    A(`#segment-${slug} modal + content`, st.modalBtn && st.outputs === 4 && st.context, JSON.stringify(st));
  }
  // refresh persistence + history on the last route
  await page.reload({ waitUntil: 'networkidle2' }); await settle(700);
  let cur = await page.evaluate(() => [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none')[0]?.id);
  A('segment refresh persistence', cur === 'page-segment-implementation-organisations', cur);
  await page.evaluate(() => { location.hash = 'segment-advisors'; }); await settle(600);
  await page.goBack(); await settle(600);
  cur = await page.evaluate(() => [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none')[0]?.id);
  A('segment history back', cur === 'page-segment-implementation-organisations', cur);
  await page.goForward(); await settle(600);
  cur = await page.evaluate(() => [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none')[0]?.id);
  A('segment history forward', cur === 'page-segment-advisors', cur);
  // Talk to FarmTree -> modal, no navigation
  await page.evaluate(() => document.querySelector('.page.active [data-ftmodal="request"]')?.click());
  await settle(600);
  A('segment Talk to FarmTree modal', await page.evaluate(() => !!document.getElementById('ftContactModal')?.classList.contains('open')), 'modal closed');


  // ---------- BENTO MENU + CLOSE CONTROL (2026-07-15) ----------
  await page.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await settle(1000);
  await page.evaluate(() => document.getElementById('openMenu').click());
  await settle(400);
  const bento = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#mobileMenu .mobile-card h4')].map(h => h.textContent.trim());
    const cb = document.getElementById('closeMenu');
    const r = cb.getBoundingClientRect();
    const svg = cb.querySelector('svg')?.getBoundingClientRect();
    const segCard = [...document.querySelectorAll('#mobileMenu .mobile-card')].find(c => /customer segments/i.test(c.querySelector('h4').textContent));
    return {
      cards, closeBox: [Math.round(r.width), Math.round(r.height)],
      centered: svg ? Math.abs((svg.left + svg.width / 2) - (r.left + r.width / 2)) < 2 && Math.abs((svg.top + svg.height / 2) - (r.top + r.height / 2)) < 2 : false,
      ariaName: cb.getAttribute('aria-label'),
      segCardDedicated: !!segCard && segCard.querySelectorAll('[data-page^="segment-"]').length === 10,
      caseLink: !!document.querySelector('#mobileMenu [data-page="case-studies"]'),
      menuScrolls: getComputedStyle(document.getElementById('mobileMenu')).overflowY !== 'visible',
      menuOverflowX: document.getElementById('mobileMenu').scrollWidth > document.getElementById('mobileMenu').clientWidth,
      platformAnchor: document.querySelector('#mobileMenu a[data-ft-action="platform-login"]')?.getAttribute('href') === 'https://tool.farmtree.earth/Identity/Account/Login'
    };
  });
  A('menu five bento cards', JSON.stringify(bento.cards) === JSON.stringify(['Main', 'FarmTree', 'Company', 'Customer segments', 'Forms & Legal']), JSON.stringify(bento.cards));
  A('menu close >=44px', bento.closeBox[0] >= 44 && bento.closeBox[1] >= 44, JSON.stringify(bento.closeBox));
  A('menu close icon centred', bento.centered, 'off-centre');
  A('menu close accessible name', bento.ariaName === 'Close menu', bento.ariaName);
  A('menu dedicated segments card (10 links)', bento.segCardDedicated, 'missing/incomplete');
  A('menu Case Studies link', bento.caseLink, 'missing');
  A('menu scrollable + no overflow-x', bento.menuScrolls && !bento.menuOverflowX, JSON.stringify(bento));
  A('menu native external platform anchor', bento.platformAnchor, 'wrong');
  // Escape closes + focus returns
  await page.keyboard.press('Escape'); await settle(300);
  const esc = await page.evaluate(() => ({ open: document.getElementById('mobileMenu').classList.contains('open'), focus: document.activeElement.id }));
  A('menu Escape closes + focus returns', !esc.open && esc.focus === 'openMenu', JSON.stringify(esc));

  // ---------- SECTION BACKGROUND TOKENS ----------
  const tokens = await page.evaluate(() => ({
    base: getComputedStyle(document.querySelector('.ft-p6-grid-bg')).backgroundColor,
    refs: getComputedStyle(document.getElementById('frank-partners')).backgroundColor,
    use: getComputedStyle(document.getElementById('target-groups')).backgroundColor
  }));
  A('base-technology token', tokens.base === 'rgb(250, 248, 241)', tokens.base);
  A('references pale-green token', tokens.refs === 'rgb(235, 242, 234)', tokens.refs);
  A('use-cases warm-sand token', tokens.use === 'rgb(246, 239, 223)', tokens.use);
  A('tokens mutually distinct', new Set([tokens.base, tokens.refs, tokens.use]).size === 3, 'collision');

  // ---------- CASE STUDIES ----------
  const csHome = await page.evaluate(() => !!document.getElementById('case-study-cards'));
  A('case studies absent from home', !csHome, 'still on home');
  await page.goto(`${BASE}#case-studies`, { waitUntil: 'networkidle2' });
  await settle(800);
  const cs = await page.evaluate(() => {
    const vis = [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none');
    const pg = vis[0];
    return {
      vis: vis.map(v => v.id), h1: pg?.querySelector('h1')?.textContent.trim(), title: document.title,
      cards: pg ? pg.querySelectorAll('.ft-case-grid article').length : 0,
      cardTitles: pg ? [...pg.querySelectorAll('.ft-case-grid article h3')].map(h => h.textContent.trim()) : [],
      demo: pg?.querySelector('a[data-ft-action="request-demo"]')?.getAttribute('href'),
      modalBtn: !!pg?.querySelector('[data-ftmodal="request"]')
    };
  });
  A('case-studies direct load', cs.vis.length === 1 && cs.vis[0] === 'page-case-studies', JSON.stringify(cs.vis));
  A('case-studies H1', cs.h1 === 'Projects that show what FarmTree makes possible', cs.h1);
  A('case-studies title', cs.title === 'Case Studies | FarmTree', cs.title);
  A('case-studies four preserved cards', cs.cards === 4 && JSON.stringify(cs.cardTitles) === JSON.stringify([
    'GIZ / Madagascar programme planning', 'ACORN / Rabobank carbon planning',
    'Beyond Beans cocoa landscape planning', 'LOSO Nyando / water resilience']), JSON.stringify(cs.cardTitles));
  A('case-studies demo href', cs.demo === REG, cs.demo);
  A('case-studies modal btn', cs.modalBtn, 'missing');
  await page.reload({ waitUntil: 'networkidle2' }); await settle(700);
  A('case-studies refresh', await page.evaluate(() => location.hash) === '#case-studies', 'hash lost');
  await page.evaluate(() => { location.hash = 'home'; }); await settle(600);
  await page.goBack(); await settle(600);
  A('case-studies history back', await page.evaluate(() =>
    [...document.querySelectorAll('.page.active')].filter(x => getComputedStyle(x).display !== 'none')[0]?.id) === 'page-case-studies', 'back failed');

  // ---------- FAQ HEADING ----------
  await page.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await settle(900);
  const faqD = await page.evaluate(() => {
    const h = document.querySelector('.ft-faq-head h2');
    const lines = Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight));
    const s = document.getElementById('faq');
    return { text: h.textContent, lines, secOv: s.scrollWidth - s.clientWidth };
  });
  A('faq exact wording', faqD.text === 'Questions about FarmTree modelling?', faqD.text);
  A('faq one line at 1280 desktop', faqD.lines === 1 && faqD.secOv === 0, JSON.stringify(faqD));

  await browser.close();
  if (failures.length) { console.error('FAIL:'); failures.forEach(f => console.error(' -', f)); process.exit(1); }
  console.log('PASS: footer socials, About proof row/icon, segments removal, menu, and all 10 segment pages verified.');
})().catch(e => { console.error('TEST CRASH:', e.message); process.exit(1); });
