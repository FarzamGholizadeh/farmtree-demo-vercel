/* Focused regression suite for the Power-to-project-staff media slider video
   optimisation (2026-07-24). Covers: slide 1 = <video> (not the production GIF),
   webm+mp4 sources, poster, GIF preserved-but-unreferenced, manual (no autoplay
   between slides), play/pause lifecycle (slide state, offscreen, reduced-motion),
   static screenshot slide 2, References/Testimonials colours, zero console errors.
   Usage: node qa/tools/media-slider-regression.js [baseUrl]                    */
const puppeteer = require('puppeteer-core');
const BASE = process.argv[2] || 'http://localhost:8899/index.html';
const ORIGIN = BASE.replace(/\/index\.html.*$/, '');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const settle = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const failures = [];
  const A = (n, c, d) => { if (!c) failures.push(`${n}: ${d}`); };

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = [];
  const media = [];
  page.on('pageerror', e => errs.push('pageerror:' + e.message.slice(0, 80)));
  page.on('console', m => { if (m.type() === 'error') errs.push('console:' + m.text().slice(0, 80)); });
  page.on('request', r => { const u = r.url(); if (/power-project-staff|\.gif(\?|$)/.test(u)) media.push(u.split('/').pop()); });

  await page.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await settle(600);
  await page.evaluate(() => document.querySelector('.overlap.ft-platform-screenshot-block').scrollIntoView({ block: 'center' }));
  await settle(1600);

  // (1-6) element + sources + poster + manual + colours
  const dom = await page.evaluate(() => {
    const sl = document.querySelector('.ft-media-slider');
    const s1 = sl.querySelector('.ft-ms-slide');
    const v = sl.querySelector('.ft-ms-video');
    const s2img = document.querySelectorAll('.ft-ms-slide')[1].querySelector('img');
    return {
      slide1Tag: v ? v.tagName : (s1.querySelector('img') ? 'IMG' : 'none'),
      slide1HasGif: sl.innerHTML.includes('.gif'),
      webm: !!v && !!v.querySelector('source[type="video/webm"]'),
      mp4: !!v && !!v.querySelector('source[type="video/mp4"]'),
      webmBeforeMp4: !!v && v.querySelector('source').type === 'video/webm',
      poster: v ? (v.getAttribute('poster') || '') : '',
      controls: v ? v.controls : true,
      muted: v ? v.muted : false, loop: v ? v.loop : false,
      currentSrc: v ? v.currentSrc.split('/').pop() : '',
      slide2Img: s2img ? s2img.getAttribute('src').split('/').pop() : '',
      slide2Natural: s2img ? (s2img.naturalWidth + 'x' + s2img.naturalHeight) : '',
      refBg: getComputedStyle(document.getElementById('frank-partners')).backgroundColor,
      testiBg: getComputedStyle(document.getElementById('testimonials')).backgroundColor,
      objFit: v ? getComputedStyle(v).objectFit : ''
    };
  });
  A('1. slide 1 is a <video> element', dom.slide1Tag === 'VIDEO', dom.slide1Tag);
  A('1. slide 1 markup has no GIF', dom.slide1HasGif === false, 'gif referenced');
  A('2. WebM source exists', dom.webm, 'missing');
  A('3. MP4 fallback source exists', dom.mp4, 'missing');
  A('3. WebM is preferred (first source)', dom.webmBeforeMp4, 'mp4 first');
  A('4. poster (webp) exists', /poster\.webp$/.test(dom.poster), dom.poster);
  A('   no native controls; muted; loop; object-fit contain', !dom.controls && dom.muted && dom.loop && dom.objFit === 'contain', JSON.stringify(dom));
  A('   Chrome selects webm as currentSrc', /\.webm$/.test(dom.currentSrc), dom.currentSrc);
  A('11. static screenshot remains slide 2 (690x343)', dom.slide2Img === 'power-project-staff-plot-definition.png' && dom.slide2Natural === '690x343', dom.slide2Img + ' ' + dom.slide2Natural);
  A('12. References remains #F5F0E4', dom.refBg === 'rgb(245, 240, 228)', dom.refBg);
  A('13. Testimonials remains #DCE7D2', dom.testiBg === 'rgb(220, 231, 210)', dom.testiBg);

  // (6) plays on slide 1 visible; manual (no autoplay between slides)
  const playing = await page.evaluate(() => { const v = document.querySelector('.ft-ms-video'); return v.paused === false && v.currentTime > 0; });
  A('6. video plays on slide 1 while visible', playing, 'not playing');

  // (7) pause on slide 2 ; (8) resume on slide 1
  await page.click('.ft-ms-next'); await settle(700);
  const onS2 = await page.evaluate(() => ({ paused: document.querySelector('.ft-ms-video').paused, dot: [...document.querySelectorAll('.ft-ms-dot')].findIndex(d => d.classList.contains('is-active')) }));
  A('6. manual slider — advancing is user-driven, lands on slide 2', onS2.dot === 1, 'dot=' + onS2.dot);
  A('7. video pauses when slide 2 active', onS2.paused === true, 'still playing');
  await page.click('.ft-ms-prev'); await settle(900);
  const onS1 = await page.evaluate(() => document.querySelector('.ft-ms-video').paused);
  A('8. video resumes when slide 1 active', onS1 === false, 'did not resume');

  // (9) pause when section offscreen
  await page.evaluate(() => window.scrollTo(0, 0)); await settle(900);
  const offscreen = await page.evaluate(() => document.querySelector('.ft-ms-video').paused);
  A('9. video pauses when section offscreen', offscreen === true, 'still playing offscreen');

  // (5) GIF not referenced by page + snapshot the LIVE-page network/console
  //     state BEFORE any diagnostic gif-path navigation below.
  const html = await page.evaluate(() => document.documentElement.outerHTML);
  A('5. index.html does not reference any .gif', !/\.gif/.test(html), 'gif referenced in DOM');
  const liveMedia = media.slice();
  const liveErrs = errs.slice();
  A('   live page requested no .gif', !liveMedia.some(u => /\.gif$/.test(u)), JSON.stringify(liveMedia));
  A('   no simultaneous webm+mp4 (mp4 not fetched in Chrome)', !liveMedia.some(u => /\.mp4$/.test(u)), JSON.stringify(liveMedia));
  A('14. zero console/page errors', liveErrs.length === 0, JSON.stringify(liveErrs));
  await page.close();

  // (5) original GIF preserved at audit path / old path gone — on a throwaway
  //     page so the intentional 404 probe cannot pollute the live-page trackers.
  const probe = await browser.newPage();
  const gifResp = await probe.goto(`${ORIGIN}/assets/media/source/power-project-staff-landscape-original.gif`, { waitUntil: 'domcontentloaded' });
  A('5. original GIF preserved at audit path (200)', gifResp.status() === 200, gifResp.status());
  const oldResp = await probe.goto(`${ORIGIN}/assets/media/power-project-staff-landscape.gif`);
  A('5. old production GIF path no longer served (404)', oldResp.status() === 404, oldResp.status());
  await probe.close();

  // (10) reduced motion prevents autoplay; poster shown; slider still usable
  const rp = await browser.newPage();
  await rp.setViewport({ width: 1280, height: 900 });
  await rp.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const rerrs = []; rp.on('pageerror', e => rerrs.push(e.message.slice(0, 80)));
  await rp.goto(`${BASE}#home`, { waitUntil: 'networkidle2' });
  await rp.evaluate(() => document.querySelector('.overlap.ft-platform-screenshot-block').scrollIntoView({ block: 'center' }));
  await settle(1500);
  const rm = await rp.evaluate(() => { const v = document.querySelector('.ft-ms-video'); return { paused: v.paused, ct: v.currentTime, poster: !!v.getAttribute('poster'), shown: !!document.querySelector('.ft-media-slider').offsetParent }; });
  A('10. reduced-motion: video does not autoplay', rm.paused === true && rm.ct === 0, JSON.stringify(rm));
  A('10. reduced-motion: poster present + slider not hidden', rm.poster && rm.shown, JSON.stringify(rm));
  await rp.click('.ft-ms-next'); await settle(500);
  const rmDot = await rp.evaluate(() => [...document.querySelectorAll('.ft-ms-dot')].findIndex(d => d.classList.contains('is-active')));
  A('10. reduced-motion: controls still work (reaches slide 2)', rmDot === 1, 'dot=' + rmDot);
  A('10. reduced-motion: no console errors', rerrs.length === 0, JSON.stringify(rerrs));
  await rp.close();

  await browser.close();
  if (failures.length) { console.error('FAIL:'); failures.forEach(f => console.error(' -', f)); process.exit(1); }
  console.log('PASS: media slider video (element, sources, poster, GIF preserved+unreferenced, manual, play/pause lifecycle, reduced-motion, static slide 2, References/Testimonials colours, zero errors) all verified.');
})().catch(e => { console.error('TEST CRASH:', e.message); process.exit(1); });
