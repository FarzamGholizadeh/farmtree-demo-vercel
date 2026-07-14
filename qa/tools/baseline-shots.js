/* Full baseline screenshot matrix. Usage: node baseline-shots.js <outDir> */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'final-hardening', 'baseline');
fs.mkdirSync(OUT, { recursive: true });
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROUTES = ['home','platform','track','services','team','cocoa','cocoa-focus',
  'investors','ngos','dfi','pricing','contact','videos','blog'];
const WIDTHS = [320,375,390,430,768,1024,1280,1440,1920];

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const overflows = [];
  for (const route of ROUTES) {
    for (const w of WIDTHS) {
      const p = await browser.newPage();
      await p.setViewport({ width: w, height: 1000 });
      try {
        await p.goto(`http://localhost:8899/index.html#${route}`, { waitUntil: 'networkidle2', timeout: 25000 });
        await new Promise(r => setTimeout(r, 1000));
        const ov = await p.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth);
        if (ov) overflows.push(`${route}@${w}`);
        await p.screenshot({ path: `${OUT}/${route}-${w}.png`, fullPage: true });
      } catch (e) { overflows.push(`${route}@${w}: CAPTURE FAIL ${e.message.slice(0,50)}`); }
      await p.close();
    }
  }
  fs.writeFileSync(`${OUT}/overflow-report.json`, JSON.stringify({ horizontalOverflows: overflows }, null, 2));
  console.log(`done: ${ROUTES.length * WIDTHS.length} shots; overflows:`, overflows.length ? overflows : 'none');
  await browser.close();
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
