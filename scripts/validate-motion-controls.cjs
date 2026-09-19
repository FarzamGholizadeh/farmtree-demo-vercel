// Production/local read-only motion controls; never modifies stored content/state.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const puppeteer = require('puppeteer-core');
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const names = ['Platform animation', 'hero slides', 'partner logos', 'testimonials', 'globe animation', 'field quotes'];
const selector = name => `[data-ft-motion-control="${name}"]`;
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const rows = [], errors = [];
  const evidenceDirectory = `qa/live-360/motion/${base.includes('localhost') ? 'local' : 'production'}-screenshots`;
  fs.mkdirSync(evidenceDirectory, { recursive: true });
  try {
    for (const width of [320,390,1440,1920]) {
      const page = await browser.newPage();
      const gifRequests = [];
      page.on('request', request => { if (request.url().endsWith('/final-tools-review-11s-to-40s-2x.gif')) gifRequests.push(request.url()); });
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.setViewport({ width, height: 1000, hasTouch: width < 500, isMobile: width < 500 });
      if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
      await page.evaluateOnNewDocument(() => {
        window.motionCLS = 0;
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.motionCLS += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      assert.equal((await page.goto(base, { waitUntil: 'networkidle2' })).status(), 200);
      await page.waitForSelector(selector('field quotes'));
      await page.evaluate(() => document.fonts.ready);
      await pause(500);
      // Freeze the initial-load measurement before synthetic scrolling/input.
      // The later observation is diagnostic only, not a second load CLS score.
      const initialLoadCLS = await page.evaluate(() => window.motionCLS);
      assert.ok(initialLoadCLS < 0.1, `Initial motion controls CLS ${initialLoadCLS} at${width}`);
      assert.deepEqual(gifRequests, [], 'Below-fold GIF must not request on initial load');
      const animationURL = await page.$eval('.ft-platform-gif img', e => e.dataset.ftAnimationSrc);
      assert.equal(animationURL, new URL('wp-content/themes/farmtree-native/assets/media/final-tools-review-11s-to-40s-2x.gif', base).href);
      // Programmatic toggles deliberately avoid scrolling the offscreen control.
      await page.$eval(selector('Platform animation'), e => { e.click(); e.click(); });
      await pause(250);
      assert.deepEqual(gifRequests, [], 'Offscreen resume must not start initial GIF request');
      const gifAttributes = () => page.$eval('.ft-platform-gif img', image => ({
        alt: image.getAttribute('alt'), width: image.getAttribute('width'), height: image.getAttribute('height'),
        srcset: image.getAttribute('srcset'), sizes: image.getAttribute('sizes')
      }));
      const originalGifAttributes = await gifAttributes();
      assert.ok(originalGifAttributes.alt && originalGifAttributes.width && originalGifAttributes.height);
      const heroGeometry = await page.evaluate(() => {
        const button = document.querySelector('.ft-motion-control-row--hero button').getBoundingClientRect();
        const dots = document.querySelector('.ft-home-hero-dots').getBoundingClientRect();
        const hero = document.querySelector('.ft-home-hero').getBoundingClientRect();
        return {
          overlapping: button.left < dots.right && button.right > dots.left && button.top < dots.bottom && button.bottom > dots.top,
          insideHero: button.left >= hero.left && button.right <= hero.right && button.top >= hero.top && button.bottom <= hero.bottom,
          button: button.toJSON(), dots: dots.toJSON()
        };
      });
      assert.ok(!heroGeometry.overlapping && heroGeometry.insideHero, `Hero control geometry ${JSON.stringify(heroGeometry)}`);
      assert.equal(await page.$$eval('[data-ft-motion-control]', elements => elements.length), names.length);
      const controls = [];
      const screenshots = [];
      for (const name of names) {
        const button = await page.$(selector(name));
        await button.evaluate(e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await pause(180);
        if (name === 'Platform animation') {
          await page.waitForFunction(() => document.querySelector('.ft-platform-gif img').getAttribute('src') === document.querySelector('.ft-platform-gif img').dataset.ftAnimationSrc);
          assert.ok(gifRequests.includes(animationURL), 'Viewport entry requests exact approved GIF');
        }
        controls.push(await button.evaluate(e => { const r = e.getBoundingClientRect(); return { name: e.textContent, width: r.width, height: r.height, minHeight: parseFloat(getComputedStyle(e).minHeight), targetExists: !!document.getElementById(e.getAttribute('aria-controls')) }; }));
        width < 500 ? await button.tap() : await button.click();
        assert.equal(await button.evaluate(e => e.getAttribute('aria-pressed')), 'true');
        assert.equal(await button.$eval('.ft-motion-toggle-state', e => e.textContent), 'Paused');
        await pause(1000); // Let existing scroll-reveal opacity/translation finish.
        const screenshot = `${evidenceDirectory}/${width}-${name.replaceAll(' ', '-')}.png`;
        await page.screenshot({ path: screenshot });
        screenshots.push(screenshot);
      }
      controls.forEach(c => assert.ok(c.width >= 43.99 && c.height >= 43.99 && c.minHeight >= 44 && c.targetExists, JSON.stringify(c)));
      // Focus/pointer leaving controls must not silently resume the user's pause.
      await page.evaluate(() => document.activeElement.blur());
      await page.mouse.move(0,0);
      await page.$eval('[data-ft-globe-shell]', e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(() => ['ready','reduced'].includes(document.querySelector('[data-ft-globe-shell]')?.dataset.ftGlobeState));
      await pause(300);
      const snapshot = async () => {
        const value = await page.evaluate(() => ({
          hero: [...document.querySelectorAll('.ft-home-hero-slide')].findIndex(e => e.classList.contains('is-active')),
          heroImageMotion: getComputedStyle(document.querySelector('.ft-home-hero-slide.is-active img')).animationPlayState,
          quote: [...document.querySelectorAll('[data-ft-footer-quotes] p')].find(e => !e.hidden)?.textContent,
          gif: document.querySelector('.ft-platform-gif img')?.currentSrc,
          tracks: [...document.querySelectorAll('.ft-moving-rail-track')].map(e => ({ transform: getComputedStyle(e).transform, state: getComputedStyle(e).animationPlayState })),
          canvas: document.querySelector('[data-ft-globe]')?.toDataURL(),
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          clones: [...document.querySelectorAll('[data-ft-rail-clone]')].every(e => e.inert && e.getAttribute('aria-hidden') === 'true')
        }));
        value.canvas = crypto.createHash('sha256').update(value.canvas || '').digest('hex');
        return value;
      };
      const before = await snapshot();
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const axeViolations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa'] } })).violations);
      assert.deepEqual(axeViolations, [], 'Default motion controls accessibility');
      await pause(8100);
      const after = await snapshot();
      assert.deepEqual(after, before, 'Paused motion changes after user leaves controls');
      assert.equal(before.heroImageMotion, 'paused', 'Hero image breathing must pause with slides');
      assert.ok(before.gif.includes('poster.png') && before.tracks.every(t => t.state === 'paused') && before.clones && !before.overflow);
      assert.deepEqual(await gifAttributes(), originalGifAttributes, 'GIF pause must preserve alt/dimensions/responsive attributes');
      await page.focus('[data-ft-globe]');
      await page.keyboard.press('ArrowRight');
      const keyboardGlobe = (await snapshot()).canvas;
      assert.notEqual(keyboardGlobe, before.canvas, 'Paused globe keyboard rotation');
      const canvasBox = await page.$eval('[data-ft-globe]', e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.mouse.move(canvasBox.x, canvasBox.y); await page.mouse.down();
      await page.mouse.move(canvasBox.x + 35, canvasBox.y + 10, { steps: 5 }); await page.mouse.up();
      const draggedGlobe = (await snapshot()).canvas;
      assert.notEqual(draggedGlobe, keyboardGlobe, 'Paused globe pointer rotation');
      await pause(1000);
      assert.equal((await snapshot()).canvas, draggedGlobe, 'Manual rotation must not restart paused autoplay');
      await page.$eval(selector('Platform animation'), e => e.click());
      await pause(250);
      assert.ok(await page.$eval('.ft-platform-gif img', e => e.getAttribute('src').endsWith('poster.png')), 'Paused GIF resumed offscreen must remain poster');
      await page.$eval(selector('Platform animation'), e => e.click());
      // Keyboard toggle works independently; then restore pause.
      await page.focus(selector('field quotes')); await page.keyboard.press('Space');
      assert.equal(await page.$eval(selector('field quotes'), e => e.getAttribute('aria-pressed')), 'false');
      await pause(7300);
      assert.notEqual((await snapshot()).quote, before.quote);
      await page.keyboard.press('Space');
      for (const name of names) {
        await page.focus(selector(name));
        await page.keyboard.press('Space');
      }
      // Offscreen resume intentionally keeps the poster until viewport entry.
      await page.$eval('.ft-platform-media-frame', e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('.ft-platform-gif img').currentSrc.endsWith('.gif'));
      await page.evaluate(() => document.activeElement.blur());
      await page.$eval('[data-ft-globe-shell]', e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.mouse.move(0,0);
      await pause(250);
      const resumedBefore = await snapshot();
      await pause(6100);
      const resumedAfter = await snapshot();
      assert.ok(resumedAfter.gif.endsWith('.gif'));
      assert.deepEqual(await gifAttributes(), originalGifAttributes, 'GIF resume must preserve alt/dimensions/responsive attributes');
      assert.notEqual(resumedAfter.hero, resumedBefore.hero, 'Hero fails to resume');
      assert.notEqual(resumedAfter.canvas, resumedBefore.canvas, 'Globe fails to resume');
      resumedAfter.tracks.forEach((track, index) => assert.notEqual(track.transform, resumedBefore.tracks[index].transform, 'Rail fails to resume'));
      for (const name of names) {
        await page.focus(selector(name));
        await page.keyboard.press('Space');
      }
      // OS reduced motion wins over a previously unpaused user setting.
      await page.focus(selector('field quotes'));
      await page.keyboard.press('Space');
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await pause(250);
      assert.ok(await page.$$eval('[data-ft-motion-control]', elements => elements.every(e => e.disabled && e.getAttribute('aria-pressed') === 'true')));
      assert.ok(await page.$eval('.ft-testimonial-cards', e => e.tabIndex === 0 && e.getAttribute('role') === 'region'));
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await pause(250);
      assert.ok(await page.$$eval('[data-ft-motion-control]', elements => elements.every(e => !e.disabled && e.getAttribute('aria-pressed') === (e.dataset.ftMotionControl === 'field quotes' ? 'false' : 'true'))));
      const metrics = { initialLoadCLS, observedSessionShiftSum: await page.evaluate(() => window.motionCLS) };
      rows.push({ width, controls, heroGeometry, screenshots, gifAttributes: originalGifAttributes, stableForMs: 8100, keyboardResume: true, reducedMotionOverride: true, metrics });
      await page.close();
    }
    const reducedPage = await browser.newPage();
    const reducedGIFRequests = [];
    reducedPage.on('request', r => { if (r.url().endsWith('/final-tools-review-11s-to-40s-2x.gif')) reducedGIFRequests.push(r.url()); });
    reducedPage.on('pageerror', error => errors.push(error.message));
    reducedPage.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await reducedPage.setViewport({ width: 390, height: 1000 });
    if (base.includes('localhost')) await reducedPage.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
    await reducedPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await reducedPage.goto(base, { waitUntil: 'networkidle2' });
    await reducedPage.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    assert.deepEqual(await reducedPage.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa'] } })).violations), [], 'Reduced-motion controls accessibility');
    assert.equal(await reducedPage.$$eval('[data-ft-motion-control]', e => e.length), 6);
    assert.ok(await reducedPage.$$eval('[data-ft-motion-control]', e => e.every(button => button.disabled && button.getAttribute('aria-pressed') === 'true')));
    assert.ok(await reducedPage.$eval('.ft-testimonial-cards', e => e.tabIndex === 0 && e.getAttribute('role') === 'region'));
    await reducedPage.$eval('.ft-platform-media-frame', e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await pause(300);
    assert.deepEqual(reducedGIFRequests, [], 'Reduced-motion viewport entry must not fetch GIF');
    await reducedPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await pause(300);
    assert.equal(await reducedPage.$$eval('[data-ft-motion-control]', e => e.length), 6, 'Preference change duplicates controls');
    assert.equal(await reducedPage.$$eval('.ft-moving-rail-track', e => e.length), 2, 'Preference change must initialize both rails');
    assert.ok(await reducedPage.$$eval('[data-ft-motion-control]', e => e.every(button => !button.disabled && button.getAttribute('aria-pressed') === 'false')));
    assert.equal(reducedGIFRequests.length, 1, 'Visible normal-motion transition starts GIF');
    rows.push({ initialReducedMotion: true, transitionToNormal: true, duplicateControls: 0 });
    await reducedPage.close();
    const noJSPage = await browser.newPage();
    await noJSPage.setJavaScriptEnabled(false);
    const noJSGIFRequests = [];
    noJSPage.on('request', r => { if (r.url().endsWith('/final-tools-review-11s-to-40s-2x.gif')) noJSGIFRequests.push(r.url()); });
    if (base.includes('localhost')) await noJSPage.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
    await noJSPage.goto(base, { waitUntil: 'networkidle2' });
    assert.ok(await noJSPage.$eval('.ft-platform-gif img', e => e.getAttribute('src').endsWith('poster.png')));
    assert.deepEqual(noJSGIFRequests, [], 'No-JS must retain poster without fetching GIF');
    rows.push({ noJSPoster: true, noJSGIFRequests: 0 });
    await noJSPage.close();
    assert.deepEqual(errors, []);
    console.log('PASS: 4 motion-control viewports plus initial reduced-motion transition');
  } finally {
    fs.mkdirSync('qa/live-360/motion', { recursive: true });
    fs.writeFileSync(`qa/live-360/motion/${base.includes('localhost') ? 'local' : 'production'}.json`, JSON.stringify({ rows, errors }, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
