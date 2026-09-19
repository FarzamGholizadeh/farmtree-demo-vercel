// WCAG 1.4.12 spacing probe, not a standalone conformance determination.
// Only this browser DOM changes; no WordPress content or settings are written.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base), 'Unapproved target');
const routes = ['/', '/platform/', '/solutions/', '/customer-segments/investors/', '/proof-stories/farm-value-projection/', '/blog/'];
const widths = [320, 390, 768, 1440];
const out = `qa/live-360/text-spacing-${base.includes('localhost') ? 'local' : 'production'}`;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const override = `body * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
body p { margin-block-end: 2em !important; }`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const report = { base, started: new Date().toISOString(), status: 'IN_PROGRESS', rows: [], errors: [], limits: [
    'Six representative routes, not all public pages/states; reduced motion makes the text/geometry comparison stable.',
    'DOM text ranges and ancestor clipping are diagnostics, not proof of inaccessible content. Intentional rails, scrollable areas and pre-existing truncation require review.',
    'Controls receive the same spacing override. Pseudo-element/generated text and assistive-technology reading were not directly inspected.',
    'No actual screen-reader listening, physical-device or browser-chrome zoom testing. Zero overflow alone cannot establish SC1.4.12.',
    'Closed disclosure bodies are excluded from visible-text geometry; their expanded states still require separate checks.'
  ] };
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    for (const route of routes) for (const width of widths) {
      const context = await browser.createBrowserContext();
      try {
        const page = await context.newPage();
        await page.setViewport({ width, height: 1000 });
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
        page.on('pageerror', e => report.errors.push({ route, width, message: e.message }));
        page.on('console', e => { if (e.type() === 'error') report.errors.push({ route, width, message: e.text() }); });
        const status = (await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded', timeout: 60000 })).status();
        assert.equal(status, 200);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 850) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 40)); }
          scrollTo({ top: 0, behavior: 'instant' });
        });
        await pause(500);
        const inspect = () => page.evaluate(() => {
          const path = e => {
            if (e.id) return `#${CSS.escape(e.id)}`;
            const parts = [];
            while (e && e !== document.body) {
              const parent = e.parentElement;
              parts.unshift(`${e.tagName.toLowerCase()}:nth-child(${parent ? [...parent.children].indexOf(e) + 1 : 1})`);
              e = parent;
            }
            return `body>${parts.join('>')}`;
          };
          const visible = e => {
            if (e.closest('[hidden],[inert],[aria-hidden="true"],script,style,noscript')) return false;
            for (let a = e; a; a = a.parentElement) {
              // Closed details can retain text-range rectangles and stale
              // computed values in Chromium despite not rendering their body.
              // Only the first summary is visible while the disclosure is shut.
              if (a.tagName === 'DETAILS' && !a.open && !a.querySelector(':scope > summary')?.contains(e)) return false;
              const s = getComputedStyle(a);
              if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
            }
            return true;
          };
          const texts = [], clips = [], computed = [];
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let node;
          while ((node = walker.nextNode())) {
            const text = node.textContent.trim(), e = node.parentElement;
            if (!text || !e || !visible(e)) continue;
            const range = document.createRange(); range.selectNodeContents(node);
            const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
            if (!rects.length) continue;
            const selector = path(e), key = `${selector}:${[...e.childNodes].indexOf(node)}`;
            texts.push({ key, selector, text });
            const s = getComputedStyle(e), font = parseFloat(s.fontSize);
            if (font > 0) computed.push({ selector, text: text.slice(0, 90), font, line: parseFloat(s.lineHeight), letter: parseFloat(s.letterSpacing), word: parseFloat(s.wordSpacing), paragraph: e.tagName === 'P', paragraphMargin: parseFloat(s.marginBlockEnd) });
            for (let ancestor = e; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
              const style = getComputedStyle(ancestor), r = ancestor.getBoundingClientRect();
              const clipX = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX);
              const clipY = ['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY);
              if (!clipX && !clipY) continue;
              const left = r.left + ancestor.clientLeft, top = r.top + ancestor.clientTop;
              const outside = rects.some(t => (clipX && (t.left < left - 2 || t.right > left + ancestor.clientWidth + 2)) || (clipY && (t.top < top - 2 || t.bottom > top + ancestor.clientHeight + 2)));
              if (!outside) continue;
              const rail = !!ancestor.closest('.ft-partner-logos,.ft-testimonial-cards,.ft-moving-rail');
              const scrollable = ['auto', 'scroll'].includes(style.overflowX) || ['auto', 'scroll'].includes(style.overflowY);
              clips.push({ key, selector, text: text.slice(0, 180), ancestor: path(ancestor), overflowX: style.overflowX, overflowY: style.overflowY, classification: rail ? 'intentional-rail-review' : scrollable ? 'scrollable-review' : 'clipping-review', textRect: range.getBoundingClientRect().toJSON(), clipRect: r.toJSON(), ellipsis: s.textOverflow, lineClamp: s.webkitLineClamp });
              break;
            }
          }
          const metrics = [...document.querySelectorAll('.ft-metric-value')].map(e => {
            const range = document.createRange(); range.selectNodeContents(e);
            const card = e.closest('.ft-metric-card').getBoundingClientRect();
            return { text: e.textContent, box: e.getBoundingClientRect().toJSON(), card: card.toJSON(), contained: [...range.getClientRects()].every(r => r.left >= card.left - 1 && r.right <= card.right + 1 && r.top >= card.top - 1 && r.bottom <= card.bottom + 1) };
          });
          return { texts, clips, computed, metrics, overflow: document.documentElement.scrollWidth > innerWidth + 1, scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth };
        });
        const before = await inspect();
        // Compare normal metric geometry with the former nowrap behavior in
        // this same DOM; the accessibility fix must not redesign default cards.
        const legacyMetricStyle = await page.addStyleTag({ content: '.ft-metric-card .ft-metric-value { white-space: nowrap !important; text-wrap: nowrap !important; overflow-wrap: normal !important; }' });
        assert.ok(await page.$$eval('.ft-metric-value', elements => elements.every(e => {
          const s = getComputedStyle(e);
          return s.whiteSpace === 'nowrap' && s.textWrap === 'nowrap' && s.overflowWrap === 'normal';
        })), 'Former metric nowrap behavior must actually be applied before comparison');
        const legacyMetrics = (await inspect()).metrics;
        await legacyMetricStyle.evaluate(e => e.remove());
        assert.deepEqual(before.metrics, legacyMetrics, 'Default metric card geometry changed');
        await page.addStyleTag({ content: override });
        await pause(500);
        const after = await inspect();
        assert.ok(after.computed.length > 0, 'No visible text inspected');
        const overrideFailures = after.computed.filter(s => ![s.line, s.letter, s.word].every(Number.isFinite) || Math.abs(s.line / s.font - 1.5) > 0.02 || Math.abs(s.letter / s.font - 0.12) > 0.01 || Math.abs(s.word / s.font - 0.16) > 0.01 || (s.paragraph && s.paragraphMargin / s.font < 1.99));
        const afterKeys = new Set(after.texts.map(t => `${t.key}:${t.text}`));
        const missingText = before.texts.filter(t => !afterKeys.has(`${t.key}:${t.text}`));
        const baselineClipKeys = new Set(before.clips.map(c => `${c.key}:${c.ancestor}`));
        const clips = after.clips.map(c => ({ ...c, newlyObserved: !baselineClipKeys.has(`${c.key}:${c.ancestor}`) }));
        const name = `${route === '/' ? 'home' : route.replaceAll('/', '-').replace(/^-|-$/g, '')}-${width}`;
        const screenshot = `${out}/${name}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        const metricScreenshot = after.metrics.length ? `${out}/${name}-metrics.png` : null;
        if (metricScreenshot) await (await page.$('.ft-metric-card:last-child')).screenshot({ path: metricScreenshot });
        const areaScreenshots = [];
        // Capture up to six unique suspected regions; retain every diagnostic
        // in JSON rather than implying this screenshot cap is complete review.
        for (const [index, c] of [...new Map(clips.map(c => [c.ancestor, c])).values()].slice(0, 6).entries()) {
          const element = await page.$(c.ancestor);
          if (!element) continue;
          await element.evaluate(e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
          const file = `${out}/${name}-area-${index + 1}.png`;
          await page.screenshot({ path: file }); areaScreenshots.push({ file, ancestor: c.ancestor });
        }
        const row = { route, width, status, baselineOverflow: before.overflow, overflow: after.overflow, metrics: after.metrics, defaultMetricGeometryPreserved: true, visibleTextCountBefore: before.texts.length, visibleTextCountAfter: after.texts.length, computed: after.computed, overrideFailures, missingText, clips, screenshot, metricScreenshot, areaScreenshots };
        report.rows.push(row);
        console.log(`${route}@${width}: overrides${overrideFailures.length} overflow${after.overflow} missing${missingText.length} clippingReview${clips.length}`);
      } finally { await context.close(); }
    }
    const failures = report.rows.filter(r => r.overrideFailures.length || r.overflow || r.missingText.length || r.metrics.some(m => !m.contained));
    report.status = failures.length || report.errors.length ? 'FAIL_OR_REVIEW_REQUIRED' : report.rows.some(r => r.clips.length) ? 'AUTOMATED_GATES_PASS_MANUAL_CLIPPING_REVIEW_REQUIRED' : 'AUTOMATED_GATES_PASS_MANUAL_CRITERION_REVIEW_REQUIRED';
    assert.equal(failures.length, 0, 'Spacing override, overflow or missing-visible-text needs investigation; inspect report');
    assert.deepEqual(report.errors, []);
  } catch (e) { report.failure = e.stack; throw e; }
  finally { fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
