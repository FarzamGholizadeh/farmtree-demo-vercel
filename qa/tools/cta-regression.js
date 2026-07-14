/* CTA regression test (final product decision):
   - every platform-entry control -> exactly LOGIN, one navigation, no modal
   - every Request-a-Demo control -> exactly REGISTER, one navigation, no modal
   - Ask for a Quotation -> opens the on-site modal, NO navigation
   - keyboard Enter activation; desktop + mobile; zero page errors.
   Fails (exit 1) on any mismatch. Usage: node cta-regression.js [baseUrl] */
const puppeteer = require('puppeteer-core');
const BASE = process.argv[2] || 'http://localhost:8899/index.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LOGIN = 'https://tool.farmtree.earth/Identity/Account/Login';
const REGISTER = 'https://tool.farmtree.earth/Identity/Account/Register';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const failures = [];
  const settle = ms => new Promise(r => setTimeout(r, ms));

  async function newPage(w, h) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h });
    p.__navs = [];
    p.on('pageerror', e => failures.push(`pageerror: ${e.message.slice(0, 90)}`));
    await p.setRequestInterception(true);
    p.on('request', r => {
      if (r.isNavigationRequest() && r.url().startsWith('https://tool.farmtree.earth')) {
        p.__navs.push(r.url()); r.abort();
      } else r.continue();
    });
    return p;
  }
  const modalOpen = p => p.evaluate(() =>
    !!document.getElementById('ftContactModal')?.classList.contains('open'));
  const closeModal = p => p.evaluate(() =>
    document.getElementById('ftContactModal')?.classList.remove('open'));

  /* click `desc` via `clickFn`, assert exactly one navigation to `expected`
     (or a modal if expected==='MODAL'), never both. */
  async function checkAction(p, desc, clickFn, expected, returnHash) {
    p.__navs = []; await closeModal(p);
    const ok = await clickFn();
    if (ok === false) { failures.push(`${desc}: control not found`); return; }
    await settle(700);
    const navs = p.__navs, modal = expected === 'MODAL' ? await modalOpen(p) : null;
    if (expected === 'MODAL') {
      if (!modal) failures.push(`${desc}: modal did not open`);
      if (navs.length) failures.push(`${desc}: unexpected navigation ${navs}`);
    } else {
      if (navs.length !== 1) failures.push(`${desc}: expected 1 navigation, got ${navs.length} [${navs}]`);
      else if (navs[0] !== expected) failures.push(`${desc}: navigated to ${navs[0]} != ${expected}`);
      /* aborted top-level navigation blanks the document -> reload for next check */
      await p.goto(`${BASE}#${returnHash || 'home'}`, { waitUntil: 'networkidle2' });
      await settle(1100);
    }
  }
  const byText = (p, sel, text) => p.evaluate((s, t) => {
    const el = [...document.querySelectorAll(s)].find(e => e.textContent.trim() === t);
    if (!el) return false; el.click(); return true;
  }, sel, text);

  // ---------- DESKTOP 1280 ----------
  let p = await newPage(1280, 900);
  await p.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await settle(1300);

  await checkAction(p, 'header FarmTree Platform pill', () => byText(p, '.header .pill.tech', 'FarmTree Platform'), LOGIN);
  await checkAction(p, '"See the platform"', () => byText(p, 'button', 'See the platform'), LOGIN);
  await checkAction(p, 'footer FarmTree Platform', () => byText(p, '.footer button', 'FarmTree Platform'), LOGIN);
  await checkAction(p, 'hero Request a demo', () => byText(p, '.ft-hero-cta-row button', 'Request a demo ↗'), REGISTER);
  await checkAction(p, 'final CTA Request a demo', () => byText(p, '.ft-final-cta-row button', 'Request a demo'), REGISTER);
  await checkAction(p, 'footer Request a FarmTree demo', () => byText(p, '.footer button', 'Request a FarmTree demo ↗'), REGISTER);
  await checkAction(p, 'injected buyer-ctas Request a demo', () => p.evaluate(() => {
    const el = document.querySelector('.ft-buyer-ctas [data-ft-action="request-demo"]');
    if (!el) return false; el.click(); return true;
  }), REGISTER);
  await checkAction(p, 'hero Ask for a quotation', () => byText(p, '.ft-hero-cta-row button', 'Ask for a quotation ↗'), 'MODAL');
  await checkAction(p, 'final CTA Ask for a quotation', () => byText(p, '.ft-final-cta-row button', 'Ask for a quotation'), 'MODAL');

  // keyboard Enter activation
  p.__navs = []; await closeModal(p);
  await p.goto(`${BASE}#home`, { waitUntil: 'networkidle2' }); await settle(1100);
  await p.evaluate(() => [...document.querySelectorAll('.ft-hero-cta-row button')]
    .find(b => b.textContent.includes('Request a demo'))?.focus());
  await p.keyboard.press('Enter'); await settle(700);
  if (p.__navs.length !== 1 || p.__navs[0] !== REGISTER)
    failures.push(`keyboard Enter on hero demo: ${JSON.stringify(p.__navs)}`);
  await p.goto(`${BASE}#home`, { waitUntil: 'networkidle2' }); await settle(1100);
  p.__navs = [];
  await p.evaluate(() => [...document.querySelectorAll('.ft-hero-cta-row button')]
    .find(b => b.textContent.includes('quotation'))?.focus());
  await p.keyboard.press('Enter'); await settle(700);
  if (!(await modalOpen(p)) || p.__navs.length)
    failures.push(`keyboard Enter on quotation: modal=${await modalOpen(p)} navs=${p.__navs.length}`);

  // use-case page injected demo button
  await closeModal(p);
  // global invariant: every demo/platform-entry-labeled control carries the
  // authoritative data-ft-action (catches stragglers on any page, incl. hidden)
  const stragglers = await p.evaluate(() => {
    const demoLabels = ['request a demo', 'request a demo \u2197', 'request a farmtree demo \u2197'];
    const out = [];
    document.querySelectorAll('button, a').forEach(el => {
      const t = el.textContent.trim().toLowerCase();
      if (demoLabels.includes(t) && el.dataset.ftAction !== 'request-demo')
        out.push('demo-label without request-demo action: ' + t + ' [' + (el.className || el.tagName) + ']');
      if ((t === 'farmtree platform' || t === 'see the platform' || (t === 'platform' && el.closest('#mobileMenu')))
          && el.dataset.ftAction !== 'platform-login')
        out.push('platform-entry label without platform-login action: ' + t + ' [' + (el.className || el.tagName) + ']');
    });
    return out;
  });
  stragglers.forEach(sg => failures.push('straggler: ' + sg));
  await p.close();

  // ---------- MOBILE 390 ----------
  p = await newPage(390, 844);
  await p.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await settle(1300);
  await checkAction(p, 'mobile menu Platform', async () => {
    await p.evaluate(() => document.getElementById('openMenu')?.click()); await settle(350);
    return byText(p, '#mobileMenu button', 'Platform');
  }, LOGIN);
  await checkAction(p, 'mobile menu Request a demo', async () => {
    await p.evaluate(() => document.getElementById('openMenu')?.click()); await settle(350);
    return byText(p, '#mobileMenu button', 'Request a demo');
  }, REGISTER);
  await p.evaluate(() => document.getElementById('closeMenu')?.click()); await settle(300);
  await checkAction(p, 'mobile hero Request a demo', () => byText(p, '.ft-hero-cta-row button', 'Request a demo ↗'), REGISTER);
  await checkAction(p, 'mobile hero Ask for a quotation', () => byText(p, '.ft-hero-cta-row button', 'Ask for a quotation ↗'), 'MODAL');
  await p.close();

  await browser.close();
  if (failures.length) { console.error('FAIL:'); failures.forEach(f => console.error(' -', f)); process.exit(1); }
  console.log('PASS: all platform-entry -> Login, all demo -> Register, quotation -> modal; single action per activation; keyboard OK; 0 errors.');
})().catch(e => { console.error('TEST CRASH:', e.message); process.exit(1); });
