/* Regression suite for the 2026-07-15 UX/brand pass:
   workflow removal, F&Q copy, diagram connectors, title system + density,
   favicon/loader/assistant branding, diagram logo.
   Usage: node qa/tools/pass4-regression.js [baseUrl]                     */
const puppeteer = require('puppeteer-core');
const BASE = process.argv[2] || 'http://localhost:8899/index.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const failures = [];
  const A = (n, c, d) => { if (!c) failures.push(`${n}: ${d}`); };
  const settle = ms => new Promise(r => setTimeout(r, ms));
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  page.on('pageerror', e => failures.push(`pageerror: ${e.message.slice(0, 90)}`));

  // ---- Homepage workflow removal (1-5) ----
  await page.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await settle(1200);
  const wf = await page.evaluate(() => ({
    section: !!document.getElementById('workflow'),
    heading: document.body.textContent.includes('Four commercial workflow steps'),
    kicker: [...document.querySelectorAll('.ft-workflow-kicker')].length,
    cards: document.body.textContent.includes('Make an investment plan') && document.body.textContent.includes('Generate impact report')
  }));
  A('workflow section removed', !wf.section, 'present');
  A('workflow heading removed', !wf.heading, 'present');
  A('workflow kicker removed', wf.kicker === 0, wf.kicker);
  A('workflow cards removed', !wf.cards, 'present');

  // ---- F&Q copy (6-10) ----
  const faq = await page.evaluate(() => {
    const eb = document.querySelector('.ft-faq-head .ft-section-label').textContent;
    const h = document.querySelector('.ft-faq-head h2');
    const arts = document.querySelectorAll('.ft-faq-grid article').length;
    const lines = Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight));
    return { eb, heading: h.textContent, arts, lines, secOv: document.getElementById('faq').scrollWidth - document.getElementById('faq').clientWidth };
  });
  A('F&Q eyebrow', faq.eb === 'F&Q', faq.eb);
  A('FAQ heading updated', faq.heading === 'Questions about FarmTree modelling?', faq.heading);
  A('FAQ accordion present', faq.arts >= 5, faq.arts);
  A('FAQ heading one line + no overflow @1440', faq.lines === 1 && faq.secOv === 0, JSON.stringify(faq));

  // ---- Base Technology connectors (11-17) ----
  await page.evaluate(() => document.querySelector('.ft-p6-grid-bg').scrollIntoView({ block: 'center' }));
  await settle(1500);
  const conn = await page.evaluate(() => {
    const paths = [...document.querySelectorAll('.ft-connect-path')];
    const cards = [...document.querySelectorAll('.ft-method-grid article')];
    const host = document.querySelector('.ft-connect-host')?.getBoundingClientRect();
    const aligned = host && paths.length === 4 && paths.every((p, i) => {
      const m = p.getAttribute('d').match(/([\d.]+) ([\d.]+)$/); const r = cards[i].getBoundingClientRect();
      return Math.abs(+m[1] - (r.left + r.width / 2 - host.left)) < 2 && Math.abs(+m[2] - (r.top - host.top)) < 2;
    });
    return { count: paths.length, aligned, pulses: document.querySelectorAll('.ft-connect-pulse').length, aria: document.querySelector('.ft-connect-layer')?.getAttribute('aria-hidden') };
  });
  A('four connectors', conn.count === 4, conn.count);
  A('connectors terminate at cards', conn.aligned, 'misaligned');
  A('moving-light pulses', conn.pulses === 4, conn.pulses);
  A('connector layer decorative', conn.aria === 'true', conn.aria);
  // reduced motion: pulses dropped
  const p2 = await browser.newPage();
  await p2.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p2.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await p2.evaluate(() => document.querySelector('.ft-p6-grid-bg').scrollIntoView({ block: 'center' }));
  await settle(1000);
  const rm = await p2.evaluate(() => ({ paths: document.querySelectorAll('.ft-connect-path').length, pulses: document.querySelectorAll('.ft-connect-pulse').length }));
  A('reduced-motion keeps paths, drops pulses', rm.paths === 4 && rm.pulses === 0, JSON.stringify(rm));
  await p2.close();

  // ---- Title system + density (18-28) ----
  const forbidden = await page.evaluate(() => {
    const bodyCs = getComputedStyle(document.body); const htmlCs = getComputedStyle(document.documentElement);
    return { bodyZoom: bodyCs.zoom, bodyTransform: bodyCs.transform, htmlTransform: htmlCs.transform, viewport: document.querySelector('meta[name=viewport]').content };
  });
  A('no document transform scale', forbidden.bodyTransform === 'none' && forbidden.htmlTransform === 'none', JSON.stringify(forbidden));
  A('viewport meta unchanged', forbidden.viewport.includes('initial-scale=1'), forbidden.viewport);
  for (const w of [768, 1024, 1280, 1440, 1920]) {
    const p = await browser.newPage(); await p.setViewport({ width: w, height: 1000 });
    await p.goto(`${BASE}#home`, { waitUntil: 'networkidle2' }); await settle(800);
    const t = await p.evaluate(() => {
      const heads = [...new Set([...document.querySelectorAll('main > section:not(.page) .ft-commercial-head h2, main > section:not(.page) .big-title, main > section:not(.page) .ft-testimonials-head h2')])];
      return { over2: heads.filter(h => Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)) > 2).length, trunc: heads.some(h => h.scrollWidth > h.clientWidth + 2), docOv: document.documentElement.scrollWidth > document.documentElement.clientWidth, sectPad: parseFloat(getComputedStyle(document.getElementById('target-groups')).paddingTop) };
    });
    A(`titles <=2 lines @${w}`, t.over2 === 0, t.over2);
    A(`no title truncation @${w}`, !t.trunc, 'truncated');
    A(`no horizontal overflow @${w}`, !t.docOv, 'overflow');
    if (w === 1440) A('desktop density applied (section pad reduced <=110)', t.sectPad <= 110, t.sectPad);
    await p.close();
  }

  // ---- Brand assets (29-37) ----
  const brand = await page.evaluate(() => ({
    favicons: [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map(l => l.getAttribute('href')),
    oldIcons: document.head.innerHTML.includes('assets/icons/icon-'),
    loaderSrc: document.querySelector('.ft-loader-logo img')?.getAttribute('src'),
    diagramSrc: document.querySelector('#diagram img')?.currentSrc.split('/').pop()
  }));
  A('favicons point to brand favicons', brand.favicons.some(h => h && h.includes('favicons/favicon-')) && brand.favicons.some(h => h === 'favicon.ico'), JSON.stringify(brand.favicons));
  A('no old icon favicon refs', !brand.oldIcons, 'old refs present');
  A('loader uses brand logo derivative', /farmtree-logo-primary/.test(brand.loaderSrc), brand.loaderSrc);
  A('diagram uses branded derivative', brand.diagramSrc === 'home-ecosystem-current-brand.webp', brand.diagramSrc);
  // assistant logo
  await page.evaluate(() => document.getElementById('ftChatLauncher').click());
  await settle(600);
  const asst = await page.evaluate(() => {
    const i = document.querySelector('.ft-chat-avatar img'); const r = i.getBoundingClientRect();
    const c = document.getElementById('ftChatClose').getBoundingClientRect();
    return { alt: i.alt, w: Math.round(r.width), overlap: r.right > c.left, title: document.querySelector('.ft-chat-head h3').textContent, close: !!document.getElementById('ftChatClose') };
  });
  A('assistant logo alt=FarmTree', asst.alt === 'FarmTree', asst.alt);
  A('assistant logo sized + no overlap', asst.w >= 60 && !asst.overlap, JSON.stringify(asst));
  A('assistant title + close preserved', asst.title === 'FarmTree Support' && asst.close, JSON.stringify(asst));
  // favicon 200s
  for (const f of ['favicon.ico', 'assets/brand/favicons/favicon-32.png', 'assets/brand/favicons/favicon-192.png', 'assets/brand/favicons/favicon-180.png']) {
    const resp = await page.goto(`http://localhost:8899/${f}`);
    A(`favicon 200: ${f}`, resp.status() === 200, resp.status());
  }

  await browser.close();
  if (failures.length) { console.error('FAIL:'); failures.forEach(f => console.error(' -', f)); process.exit(1); }
  console.log('PASS: workflow removal, F&Q, connectors, title/density, brand assets all verified.');
})().catch(e => { console.error('TEST CRASH:', e.message); process.exit(1); });
