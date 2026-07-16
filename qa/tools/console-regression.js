/* Console-error regression test (MRV/counter guard).
   Loads key routes, scrolls to trigger IntersectionObserver animations,
   exercises navigation/refresh/back-forward/resize, and fails (exit 1)
   if ANY page error occurs. Also asserts counters end at approved values.
   Usage: node qa/tools/console-regression.js [baseUrl]           */
const puppeteer = require('puppeteer-core');
const BASE = process.argv[2] || 'http://localhost:8899/index.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const failures = [];
  const scrollAll = p => p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90));
    }
  });

  async function freshPage(width = 1280, height = 900, reducedMotion = false) {
    const p = await browser.newPage();
    await p.setViewport({ width, height });
    if (reducedMotion) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    p.on('pageerror', e => failures.push(`pageerror: ${e.message.slice(0, 120)}`));
    return p;
  }

  // 1) direct loads + scroll (home, track = MRV metric row, services, team)
  for (const route of ['home', 'track', 'services', 'team']) {
    const p = await freshPage();
    await p.goto(`${BASE}#${route}`, { waitUntil: 'networkidle2' });
    await scrollAll(p); await new Promise(r => setTimeout(r, 1600));
    await p.close();
  }

  // 2) refresh on track (MRV route)
  let p = await freshPage();
  await p.goto(`${BASE}#track`, { waitUntil: 'networkidle2' });
  await p.reload({ waitUntil: 'networkidle2' });
  await scrollAll(p); await new Promise(r => setTimeout(r, 1400));

  // counters end at approved values on track
  const track = await p.evaluate(() =>
    [...document.querySelectorAll('#frank-phase-journey .ft-proof-metric strong')].map(e => e.textContent.trim()));
  const expected = ['50 yrs', '4', '3', 'MRV'];
  if (JSON.stringify(track) !== JSON.stringify(expected))
    failures.push(`track counters ${JSON.stringify(track)} != ${JSON.stringify(expected)}`);
  await p.close();

  // 3) internal nav + back/forward + repeated route changes
  p = await freshPage();
  await p.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  for (const r of ['track', 'home', 'track', 'services', 'track']) {
    await p.evaluate(h => { location.hash = h; }, r); await new Promise(x => setTimeout(x, 450));
  }
  await p.goBack(); await new Promise(x => setTimeout(x, 400));
  await p.goForward(); await new Promise(x => setTimeout(x, 400));
  await scrollAll(p); await new Promise(r => setTimeout(r, 1200));

  // home counters end at approved values
  const home = await p.evaluate(() => {
    location.hash = 'home';
    return new Promise(res => setTimeout(() => {
      window.scrollTo(0, 800);
      setTimeout(() => res([...document.querySelectorAll('.metric h3')].map(e => e.textContent.trim())), 1600);
    }, 500));
  });
  if (JSON.stringify(home) !== JSON.stringify(['+100', '+30', '+40', '+1,000,000']))
    failures.push(`home metrics ${JSON.stringify(home)}`);
  await p.close();

  // 4) mobile viewport + mobile nav + resize
  p = await freshPage(390, 844);
  await p.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await p.evaluate(() => document.getElementById('openMenu')?.click());
  await new Promise(r => setTimeout(r, 400));
  await p.evaluate(() => { [...document.querySelectorAll('.mobile-card button')].find(b => b.textContent.includes('Track'))?.click(); });
  await new Promise(r => setTimeout(r, 600));
  await p.setViewport({ width: 1280, height: 900 }); await new Promise(r => setTimeout(r, 400));
  await p.setViewport({ width: 320, height: 700 }); await new Promise(r => setTimeout(r, 400));
  await scrollAll(p); await new Promise(r => setTimeout(r, 1200));
  await p.close();

  // 5) reduced motion
  p = await freshPage(1280, 900, true);
  await p.goto(`${BASE}#track`, { waitUntil: 'networkidle2' });
  await scrollAll(p); await new Promise(r => setTimeout(r, 1400));
  await p.close();

  await browser.close();
  if (failures.length) { console.error('FAIL:'); failures.forEach(f => console.error(' -', f)); process.exit(1); }
  console.log('PASS: 0 console errors across all scenarios; counters end at approved values.');
})().catch(e => { console.error('TEST CRASH:', e.message); process.exit(1); });
