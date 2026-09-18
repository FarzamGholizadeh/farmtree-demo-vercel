/**
 * Accessible interactions and progressive motion for the FarmTree native theme.
 *
 * Motion never controls access to content and is removed when reduced motion
 * is requested. The Homepage hero advances calmly while pausing for direct
 * pointer or keyboard interaction.
 */
(function () {
    'use strict';

    const heroSelector = '.ft-home-hero';
    const heroSlideSelector = '.ft-home-hero-slide';
    const heroDotSelector = '[data-ft-hero-dot]';
    const heroAutoplayDelay = 5000;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const interactionScriptUrl = document.currentScript?.src || '';
    const worldLandUrl = interactionScriptUrl
        ? new URL('../data/world-land-110m.json', interactionScriptUrl)
        : null;

    function initialiseHero(hero, heroIndex) {
        const slides = Array.from(hero.querySelectorAll(heroSlideSelector));
        const dots = Array.from(hero.querySelectorAll(heroDotSelector));
        const currentContent = hero.querySelector('.ft-home-hero-current');
        const currentKicker = currentContent?.querySelector('.ft-home-hero-current-kicker');
        const currentHeading = currentContent?.querySelector('.ft-home-hero-current-heading');
        const currentText = currentContent?.querySelector('.ft-home-hero-current-text');
        const copySources = Array.from(hero.querySelectorAll('.ft-home-hero-copy-source'));
        const sourceContainer = hero.querySelector('.ft-home-hero-copy-sources');
        const previousButton = hero.querySelector('[data-ft-hero-prev]');
        const nextButton = hero.querySelector('[data-ft-hero-next]');

        if (
            slides.length < 2 ||
            dots.length !== slides.length ||
            copySources.length !== slides.length - 1 ||
            !currentContent ||
            !currentKicker ||
            !currentHeading ||
            !currentText ||
            hero.dataset.ftHeroReady === 'true'
        ) {
            return;
        }

        hero.dataset.ftHeroReady = 'true';

        const messages = [
            {
                kicker: currentKicker.innerHTML,
                heading: currentHeading.innerHTML,
                headingText: currentHeading.textContent?.trim(),
                text: currentText.innerHTML
            },
            ...copySources.map((source) => {
                const kicker = source.querySelector('.ft-native-eyebrow');
                const heading = source.querySelector('h2');
                const text = source.querySelector('.has-lead-font-size');

                return {
                    kicker: kicker?.innerHTML || '',
                    heading: heading?.innerHTML || '',
                    headingText: heading?.textContent?.trim() || '',
                    text: text?.innerHTML || ''
                };
            })
        ];

        sourceContainer?.setAttribute('aria-hidden', 'true');
        currentContent.id = currentContent.id || `ft-home-hero-copy-${heroIndex + 1}`;
        currentHeading.id = currentHeading.id || `${currentContent.id}-heading`;
        currentContent.setAttribute('role', 'group');
        currentContent.setAttribute('aria-labelledby', currentHeading.id);

        let status = hero.querySelector('[data-ft-hero-status]');

        if (!status) {
            status = document.createElement('p');
            status.className = 'ft-home-hero-status screen-reader-text';
            status.dataset.ftHeroStatus = '';
            hero.append(status);
        }

        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.setAttribute('aria-atomic', 'true');

        let currentIndex = Math.max(
            0,
            slides.findIndex((slide) => slide.classList.contains('is-active'))
        );
        let animationFrame = null;
        let autoAdvanceTimer = null;
        let interactionPaused = false;

        function stopAutoAdvance() {
            window.clearTimeout(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }

        function scheduleAutoAdvance() {
            stopAutoAdvance();
            if (reducedMotionQuery.matches || interactionPaused || document.hidden) {
                return;
            }
            autoAdvanceTimer = window.setTimeout(() => {
                selectSlide(currentIndex + 1, { automatic: true });
                scheduleAutoAdvance();
            }, heroAutoplayDelay);
        }

        function labelFor(index) {
            const image = slides[index].querySelector('img');

            return dots[index].getAttribute('aria-label') || image?.alt || `Hero slide ${index + 1}`;
        }

        function headlineFor(index) {
            return messages[index].headingText || labelFor(index);
        }

        function updateStatus(index) {
            status.textContent = `${labelFor(index)}: ${headlineFor(index)}, slide ${index + 1} of ${slides.length}`;
        }

        function selectSlide(nextIndex, options = {}) {
            const normalisedIndex = (nextIndex + slides.length) % slides.length;
            const message = messages[normalisedIndex];

            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
            }
            hero.classList.remove('is-hero-changing');

            slides.forEach((slide, index) => {
                const isCurrent = index === normalisedIndex;
                const slideId = slide.id || `ft-home-hero-slide-${heroIndex + 1}-${index + 1}`;

                slide.id = slideId;
                slide.classList.toggle('is-active', isCurrent);
                slide.hidden = !isCurrent;
                slide.setAttribute('role', 'group');
                slide.setAttribute('aria-roledescription', 'slide');
                slide.setAttribute('aria-label', `${index + 1} of ${slides.length}: ${labelFor(index)}`);
                slide.setAttribute('aria-hidden', String(!isCurrent));

                dots[index].classList.toggle('is-active', isCurrent);
                dots[index].setAttribute('aria-pressed', String(isCurrent));
                dots[index].setAttribute('aria-controls', `${slideId} ${currentContent.id}`);
                dots[index].setAttribute('tabindex', isCurrent ? '0' : '-1');
            });

            currentKicker.innerHTML = message.kicker;
            currentHeading.innerHTML = message.heading;
            currentText.innerHTML = message.text;

            currentIndex = normalisedIndex;
            updateStatus(currentIndex);

            if (!reducedMotionQuery.matches) {
                animationFrame = window.requestAnimationFrame(() => {
                    hero.classList.add('is-hero-changing');
                    animationFrame = null;
                });
            }

            if (options.focus) {
                dots[currentIndex].focus();
            }

            if (!options.automatic) {
                scheduleAutoAdvance();
            }
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => selectSlide(index));
        });

        previousButton?.addEventListener('click', () => selectSlide(currentIndex - 1));
        nextButton?.addEventListener('click', () => selectSlide(currentIndex + 1));

        let swipePointerId = null;
        let swipeStartX = 0;
        let swipeStartY = 0;
        hero.addEventListener('pointerdown', (event) => {
            if (!event.isPrimary || !window.matchMedia('(max-width: 768px)').matches) {
                return;
            }
            swipePointerId = event.pointerId;
            swipeStartX = event.clientX;
            swipeStartY = event.clientY;
        });
        hero.addEventListener('pointerup', (event) => {
            if (!window.matchMedia('(max-width: 768px)').matches) {
                return;
            }
            if (swipePointerId === null || event.pointerId !== swipePointerId) {
                return;
            }
            const deltaX = event.clientX - swipeStartX;
            const deltaY = event.clientY - swipeStartY;
            swipePointerId = null;
            if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                selectSlide(currentIndex + (deltaX < 0 ? 1 : -1));
            }
        });
        hero.addEventListener('pointercancel', () => {
            swipePointerId = null;
        });

        hero.querySelector('.ft-home-hero-dots')?.addEventListener('keydown', (event) => {
            const keyTargets = {
                ArrowLeft: currentIndex - 1,
                ArrowRight: currentIndex + 1,
                Home: 0,
                End: slides.length - 1
            };

            if (!(event.key in keyTargets)) {
                return;
            }

            event.preventDefault();
            selectSlide(keyTargets[event.key], { focus: true });
        });

        hero.addEventListener('pointerenter', () => {
            interactionPaused = true;
            stopAutoAdvance();
        });
        hero.addEventListener('pointerleave', () => {
            interactionPaused = false;
            scheduleAutoAdvance();
        });
        hero.addEventListener('focusin', () => {
            interactionPaused = true;
            stopAutoAdvance();
        });
        hero.addEventListener('focusout', () => {
            window.requestAnimationFrame(() => {
                interactionPaused = hero.contains(document.activeElement);
                scheduleAutoAdvance();
            });
        });
        document.addEventListener('visibilitychange', scheduleAutoAdvance);
        reducedMotionQuery.addEventListener?.('change', scheduleAutoAdvance);

        selectSlide(currentIndex);
        scheduleAutoAdvance();
    }

    function initialiseCounters() {
        const values = Array.from(document.querySelectorAll('.ft-metric-value'));
        const section = document.querySelector('.ft-home-metrics');
        if (!section || values.length === 0) {
            return;
        }

        const finalValues = values.map((value) => value.textContent.trim());
        const alreadyAnimated = window.sessionStorage?.getItem('ft-metrics-animated') === 'true';
        if (reducedMotionQuery.matches || alreadyAnimated || !('IntersectionObserver' in window)) {
            values.forEach((value, index) => { value.textContent = finalValues[index]; });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) {
                return;
            }
            observer.disconnect();
            window.sessionStorage?.setItem('ft-metrics-animated', 'true');
            values.forEach((value, index) => {
                const original = finalValues[index];
                const target = Number(original.replace(/[^0-9]/g, ''));
                const prefix = original.startsWith('+') ? '+' : '';
                const start = performance.now() + (index * 90);
                const duration = 1100;
                function frame(now) {
                    const progress = Math.max(0, Math.min(1, (now - start) / duration));
                    const eased = 1 - Math.pow(1 - progress, 3);
                    value.textContent = `${prefix}${Math.round(target * eased).toLocaleString('en-GB')}`;
                    if (progress < 1) {
                        window.requestAnimationFrame(frame);
                    } else {
                        value.textContent = original;
                    }
                }
                window.requestAnimationFrame(frame);
            });
        }, { threshold: 0.35 });
        observer.observe(section);
    }

    function initialiseHeaderState() {
        const header = document.querySelector('.ft-native-site-header');
        if (!header) {
            return;
        }
        let previousY = window.scrollY;
        let scheduled = false;
        function update() {
            const currentY = window.scrollY;
            header.classList.toggle('is-scrolled', currentY > 80);
            document.documentElement.classList.toggle('ft-scroll-up', currentY < previousY && currentY > 120);
            previousY = currentY;
            scheduled = false;
        }
        window.addEventListener('scroll', () => {
            if (!scheduled) {
                scheduled = true;
                window.requestAnimationFrame(update);
            }
        }, { passive: true });
        update();
    }

    function initialiseFooterQuotes() {
        const shell = document.querySelector('[data-ft-footer-quotes]');
        const quotes = Array.from(shell?.querySelectorAll('p') || []);
        if (!shell || quotes.length < 2 || reducedMotionQuery.matches) {
            return;
        }
        let index = 0;
        window.setInterval(() => {
            quotes[index].hidden = true;
            index = (index + 1) % quotes.length;
            quotes[index].hidden = false;
        }, 7000);
    }

    function initialiseMotion() {
        const targets = document.querySelectorAll([
            '.ft-home-section-heading',
            '.ft-platform-copy',
            '.ft-platform-visual',
            '.ft-technology-model',
            '.ft-home-inputs > .wp-block-column',
            '.ft-globe-copy',
            '.ft-globe-stage',
            '.ft-trust-quote',
            '.ft-proof-card',
            '.ft-faq-list > details',
            '.ft-news-item',
            '.ft-final-cta > *',
            '.ft-native-footer-grid'
        ].join(','));

        targets.forEach((target, index) => {
            target.classList.add('ft-motion-target');
            target.style.setProperty('--ft-motion-order', String(index % 4));
        });

        if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
            targets.forEach((target) => target.classList.add('is-visible'));
            return;
        }

        document.documentElement.classList.add('ft-motion-ready');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        targets.forEach((target) => observer.observe(target));
    }

    function initialiseMovingRails() {
        document.querySelectorAll('.ft-partner-logos, .ft-testimonial-cards').forEach((rail) => {
            const isTestimonialRail = rail.classList.contains('ft-testimonial-cards');
            if (rail.dataset.ftRailReady === 'true' || reducedMotionQuery.matches) {
                return;
            }

            rail.dataset.ftRailReady = 'true';
            rail.classList.add('ft-moving-rail');
            const track = document.createElement('div');
            const sequence = document.createElement('div');
            const items = Array.from(rail.children);
            const startIndex = isTestimonialRail
                ? 0
                : Math.min(4, Math.max(0, items.length - 1));
            const rotatedItems = items.slice(startIndex).concat(items.slice(0, startIndex));

            track.className = 'ft-moving-rail-track';
            sequence.className = 'ft-moving-rail-sequence';
            if (isTestimonialRail) {
                sequence.dataset.ftRailOriginal = 'true';
                rail.dataset.ftRailStart = 'middle-sequence-card-3';
                rail.dataset.ftRailFocalCard = String(Math.min(3, Math.max(1, items.length)));
            } else {
                rail.dataset.ftRailStart = String(startIndex + 1);
            }
            rotatedItems.forEach((item) => sequence.append(item));
            track.append(sequence);
            rail.append(track);

            const createClone = (side = 'after') => {
                const clone = sequence.cloneNode(true);
                delete clone.dataset.ftRailOriginal;
                clone.dataset.ftRailClone = side;
                clone.setAttribute('aria-hidden', 'true');
                clone.setAttribute('inert', '');
                clone.inert = true;
                clone.querySelectorAll('.ft-motion-target').forEach((element) => element.classList.add('is-visible'));
                clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
                clone.querySelectorAll('a, button, input, summary, [tabindex]').forEach((control) => {
                    control.setAttribute('tabindex', '-1');
                });
                return clone;
            };
            const fillTestimonialTrack = () => {
                const sequenceWidth = sequence.getBoundingClientRect().width;
                const railWidth = rail.clientWidth;
                if (sequenceWidth <= 0 || railWidth <= 0) {
                    return;
                }

                const sideCopies = Math.max(2, Math.ceil(railWidth / sequenceWidth) + 1);
                const sequenceCount = (sideCopies * 2) + 1;
                const existingSideCopies = Number(rail.dataset.ftRailSideCopies || 0);
                if (existingSideCopies !== sideCopies) {
                    track.querySelectorAll('.ft-moving-rail-sequence[aria-hidden="true"]').forEach((clone) => clone.remove());
                    const before = document.createDocumentFragment();
                    const after = document.createDocumentFragment();
                    for (let index = 0; index < sideCopies; index += 1) {
                        before.append(createClone('before'));
                        after.append(createClone('after'));
                    }
                    track.prepend(before);
                    track.append(after);
                    rail.dataset.ftRailSideCopies = String(sideCopies);
                }

                const focalIndex = Math.min(2, Math.max(0, sequence.children.length - 1));
                const focalCard = sequence.children[focalIndex];
                const focalCenter = (focalCard.offsetLeft - sequence.offsetLeft) + (focalCard.getBoundingClientRect().width / 2);
                const initialOffset = (railWidth / 2) - ((sideCopies * sequenceWidth) + focalCenter);

                track.style.setProperty('--ft-testimonial-start-x', `${initialOffset}px`);
                track.style.setProperty('--ft-rail-distance', `${sequenceWidth}px`);
                rail.dataset.ftRailSequenceCount = String(sequenceCount);
                rail.dataset.ftRailSequenceWidth = String(Math.round(sequenceWidth));
                rail.dataset.ftRailViewportWidth = String(railWidth);
                rail.dataset.ftRailInitialOffset = String(Math.round(initialOffset));
                rail.classList.add('is-ready');
            };
            const fillTrack = () => {
                if (isTestimonialRail) {
                    fillTestimonialTrack();
                    return;
                }
                const sequenceWidth = sequence.getBoundingClientRect().width;
                if (sequenceWidth <= 0) {
                    return;
                }
                const sequenceCount = Math.max(3, Math.ceil((rail.clientWidth * 2) / sequenceWidth) + 1);
                const existingClones = Array.from(track.querySelectorAll('.ft-moving-rail-sequence[aria-hidden="true"]'));
                const fragment = document.createDocumentFragment();
                for (let index = existingClones.length + 1; index < sequenceCount; index += 1) {
                    fragment.append(createClone());
                }
                track.append(fragment);
                existingClones.slice(sequenceCount - 1).forEach((clone) => clone.remove());
                track.style.setProperty('--ft-rail-distance', `${sequenceWidth}px`);
            };
            fillTrack();
            window.requestAnimationFrame(fillTrack);
            if ('ResizeObserver' in window) {
                const observer = new ResizeObserver(fillTrack);
                observer.observe(rail);
                observer.observe(sequence);
            }
        });
    }

    function initialiseGlobes() {
        const degrees = Math.PI / 180;
        const rotationPerFrame = 0.00135;
        const fallbackLandPolygons = [
            [[-168, 70], [-145, 72], [-128, 60], [-124, 49], [-117, 33], [-105, 22], [-97, 17], [-84, 9], [-78, 18], [-81, 27], [-74, 40], [-61, 48], [-53, 59], [-62, 72], [-98, 81], [-135, 76]],
            [[-81, 12], [-70, 10], [-61, 5], [-50, -2], [-35, -8], [-43, -23], [-54, -34], [-66, -55], [-74, -48], [-78, -20]],
            [[-17, 36], [5, 37], [28, 33], [42, 20], [51, 10], [43, -13], [31, -35], [18, -35], [5, -25], [-8, 5]],
            [[-10, 36], [-11, 57], [5, 71], [33, 72], [65, 78], [100, 72], [128, 61], [163, 61], [178, 50], [153, 41], [135, 34], [124, 20], [109, 5], [104, -7], [94, 5], [80, 8], [71, 23], [57, 26], [45, 39], [31, 42], [19, 35], [8, 43]],
            [[112, -11], [131, -10], [153, -27], [146, -39], [124, -36], [113, -24]],
            [[-52, 60], [-44, 60], [-20, 70], [-28, 82], [-50, 83], [-62, 72]],
            [[43, -12], [50, -16], [49, -26], [44, -25]],
            [[128, 31], [143, 44], [146, 35], [137, 30]]
        ];
        const globeLocations = [
            { name: 'Kenya', coordinates: [37.91, 0.02] },
            { name: 'Tanzania', coordinates: [34.89, -6.37] },
            { name: 'Uganda', coordinates: [32.29, 1.37] },
            { name: 'Brazil', coordinates: [-51.93, -14.24] },
            { name: 'Benin', coordinates: [2.32, 9.31] },
            { name: 'Ghana', coordinates: [-1.02, 7.95] },
            { name: 'Nigeria', coordinates: [8.68, 9.08] },
            { name: 'Senegal', coordinates: [-14.45, 14.5] },
            { name: 'Indonesia', coordinates: [113.92, -0.79] },
            { name: 'Ethiopia', coordinates: [40.49, 9.15] },
            { name: 'Bhutan', coordinates: [90.43, 27.51] },
            { name: 'Colombia', coordinates: [-74.3, 4.57] },
            { name: 'Peru', coordinates: [-75.02, -9.19] },
            { name: 'Netherlands', coordinates: [5.29, 52.13] },
            { name: 'United Kingdom', coordinates: [-3.44, 55.38] },
            { name: 'Hungary', coordinates: [19.5, 47.16] },
            { name: 'France', coordinates: [2.21, 46.23] },
            { name: 'Bulgaria', coordinates: [25.49, 42.73] },
            { name: 'Belgium', coordinates: [4.47, 50.5] },
            { name: 'Denmark', coordinates: [9.5, 56.26] },
            { name: 'Iran', coordinates: [53.69, 32.43] },
            { name: 'Jordan', coordinates: [36.24, 30.59] }
        ];
        const markerCoordinates = globeLocations.map(({ coordinates }) => coordinates);
        const arcPairs = [
            [13, 0], [13, 3], [13, 8], [13, 9], [13, 10],
            [13, 11], [13, 12], [13, 14], [13, 15], [13, 16],
            [13, 17], [13, 18], [13, 19], [13, 20], [13, 21],
            [0, 1], [0, 2], [5, 4], [5, 6], [5, 7]
        ];

        function pointInPolygon(longitude, latitude, polygon) {
            let inside = false;
            for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
                const [x1, y1] = polygon[index];
                const [x2, y2] = polygon[previous];
                const intersects = ((y1 > latitude) !== (y2 > latitude)) &&
                    (longitude < ((x2 - x1) * (latitude - y1)) / ((y2 - y1) || 0.00001) + x1);
                if (intersects) {
                    inside = !inside;
                }
            }
            return inside;
        }

        function normalisePolygon(outer, holes = []) {
            const longitudes = outer.map(([longitude]) => longitude);
            const latitudes = outer.map(([, latitude]) => latitude);
            return {
                bounds: [Math.min(...longitudes), Math.min(...latitudes), Math.max(...longitudes), Math.max(...latitudes)],
                holes,
                outer
            };
        }

        function decodeTopology(topology) {
            const [scaleX, scaleY] = topology.transform.scale;
            const [translateX, translateY] = topology.transform.translate;
            const decodedArcs = topology.arcs.map((arc) => {
                let x = 0;
                let y = 0;
                return arc.map(([deltaX, deltaY]) => {
                    x += deltaX;
                    y += deltaY;
                    return [(x * scaleX) + translateX, (y * scaleY) + translateY];
                });
            });
            const coordinatesForArc = (reference) => {
                const coordinates = decodedArcs[reference < 0 ? ~reference : reference] || [];
                return reference < 0 ? [...coordinates].reverse() : coordinates;
            };
            const coordinatesForRing = (references) => references.flatMap((reference, index) => {
                const coordinates = coordinatesForArc(reference);
                return index === 0 ? coordinates : coordinates.slice(1);
            });
            const polygons = [];

            topology.objects.land.geometries.forEach((geometry) => {
                const polygonGroups = geometry.type === 'MultiPolygon' ? geometry.arcs : [geometry.arcs];
                polygonGroups.forEach((ringReferences) => {
                    const rings = ringReferences.map(coordinatesForRing).filter((ring) => ring.length >= 3);
                    if (rings[0]) {
                        polygons.push(normalisePolygon(rings[0], rings.slice(1)));
                    }
                });
            });
            return polygons;
        }

        async function loadLandPolygons() {
            if (!worldLandUrl) {
                return { source: 'fallback', polygons: fallbackLandPolygons.map((polygon) => normalisePolygon(polygon)) };
            }
            try {
                const response = await fetch(worldLandUrl, { credentials: 'same-origin' });
                if (!response.ok) {
                    throw new Error(`World land topology returned ${response.status}`);
                }
                const polygons = decodeTopology(await response.json());
                if (polygons.length < 50) {
                    throw new Error('World land topology is incomplete');
                }
                return { source: 'natural-earth-110m', polygons };
            } catch (_error) {
                return { source: 'fallback', polygons: fallbackLandPolygons.map((polygon) => normalisePolygon(polygon)) };
            }
        }

        function pointInLand(longitude, latitude, polygons) {
            return polygons.some(({ bounds, holes, outer }) => (
                longitude >= bounds[0]
                && latitude >= bounds[1]
                && longitude <= bounds[2]
                && latitude <= bounds[3]
                && pointInPolygon(longitude, latitude, outer)
                && !holes.some((hole) => pointInPolygon(longitude, latitude, hole))
            ));
        }

        function vectorFor(longitude, latitude) {
            const lon = longitude * degrees;
            const lat = latitude * degrees;
            return {
                x: Math.cos(lat) * Math.sin(lon),
                y: Math.sin(lat),
                z: Math.cos(lat) * Math.cos(lon)
            };
        }

        function rotateVector(vector, rotation, pitch = 0, altitude = 1) {
            const sine = Math.sin(rotation);
            const cosine = Math.cos(rotation);
            const pitchSine = Math.sin(pitch);
            const pitchCosine = Math.cos(pitch);
            const yawX = (vector.x * cosine) + (vector.z * sine);
            const yawZ = (vector.z * cosine) - (vector.x * sine);
            return {
                x: yawX * altitude,
                y: ((vector.y * pitchCosine) + (yawZ * pitchSine)) * altitude,
                z: ((yawZ * pitchCosine) - (vector.y * pitchSine)) * altitude
            };
        }

        function arcBetween(start, end) {
            const startVector = vectorFor(...start);
            const endVector = vectorFor(...end);
            const dot = Math.max(-1, Math.min(1,
                (startVector.x * endVector.x) +
                (startVector.y * endVector.y) +
                (startVector.z * endVector.z)
            ));
            const angle = Math.acos(dot);
            const sine = Math.sin(angle) || 1;
            return Array.from({ length: 42 }, (_, index) => {
                const progress = index / 41;
                const a = Math.sin((1 - progress) * angle) / sine;
                const b = Math.sin(progress * angle) / sine;
                const vector = {
                    x: (startVector.x * a) + (endVector.x * b),
                    y: (startVector.y * a) + (endVector.y * b),
                    z: (startVector.z * a) + (endVector.z * b)
                };
                const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
                return {
                    vector: { x: vector.x / length, y: vector.y / length, z: vector.z / length },
                    altitude: 1 + (Math.sin(progress * Math.PI) * 0.11)
                };
            });
        }

        async function loadEarthTexture(url) {
            if (!url) {
                return null;
            }
            try {
                const image = new Image();
                image.decoding = 'async';
                image.src = url;
                if (typeof image.decode === 'function') {
                    await image.decode();
                } else {
                    await new Promise((resolve, reject) => {
                        image.addEventListener('load', resolve, { once: true });
                        image.addEventListener('error', reject, { once: true });
                    });
                }
                const textureCanvas = document.createElement('canvas');
                textureCanvas.width = image.naturalWidth;
                textureCanvas.height = image.naturalHeight;
                const textureContext = textureCanvas.getContext('2d', { alpha: false, willReadFrequently: true });
                if (!textureContext) {
                    return null;
                }
                textureContext.drawImage(image, 0, 0);
                return {
                    data: textureContext.getImageData(0, 0, textureCanvas.width, textureCanvas.height).data,
                    height: textureCanvas.height,
                    width: textureCanvas.width
                };
            } catch (_error) {
                return null;
            }
        }

        const landPolygonPromise = loadLandPolygons();

        document.querySelectorAll('[data-ft-globe-shell]').forEach((shell) => {
            const canvas = shell.querySelector('[data-ft-globe]');
            if (!canvas || canvas.dataset.ftGlobeReady === 'true') {
                return;
            }

            canvas.dataset.ftGlobeReady = 'true';
            canvas.dataset.ftGlobeRenderer = 'native-canvas-blue-marble';
            canvas.dataset.ftGlobeSpeed = String(rotationPerFrame);
            let context = null;
            let earthTexture = null;
            let landPoints = [];
            let markers = [];
            let arcs = [];
            let sphereBuffer = null;
            let sphereContext = null;
            let sphereImage = null;
            let sphereSamples = null;
            let rotation = -0.42;
            let pitch = -0.08;
            let frame = null;
            let lastFrameTime = 0;
            let isVisible = false;
            let isDragging = false;
            let previousPointerX = 0;
            let previousPointerY = 0;
            let resumeStrength = 1;
            let activated = false;
            let isActivating = false;

            function resizeCanvas() {
                const displaySize = Math.max(240, Math.round(canvas.getBoundingClientRect().width));
                const ratio = Math.min(window.devicePixelRatio || 1, 2);
                const size = Math.round(displaySize * ratio);
                if (canvas.width !== size || canvas.height !== size) {
                    canvas.width = size;
                    canvas.height = size;
                }
                return { size, ratio };
            }

            function prepareSphereBuffer(renderSize) {
                if (sphereBuffer?.width === renderSize) {
                    return;
                }
                sphereBuffer = document.createElement('canvas');
                sphereBuffer.width = renderSize;
                sphereBuffer.height = renderSize;
                sphereContext = sphereBuffer.getContext('2d', { alpha: true });
                sphereImage = sphereContext?.createImageData(renderSize, renderSize) || null;
                const samples = [];
                const half = renderSize / 2;
                for (let y = 0; y < renderSize; y += 1) {
                    const viewY = 1 - (((y + 0.5) / half));
                    for (let x = 0; x < renderSize; x += 1) {
                        const viewX = ((x + 0.5) / half) - 1;
                        const radial = (viewX * viewX) + (viewY * viewY);
                        if (radial > 1) {
                            continue;
                        }
                        samples.push({
                            alpha: Math.min(1, (1 - radial) * 42),
                            offset: ((y * renderSize) + x) * 4,
                            viewX,
                            viewY,
                            viewZ: Math.sqrt(1 - radial)
                        });
                    }
                }
                sphereSamples = samples;
            }

            function drawEarthTexture(centre, radius, ratio) {
                if (!earthTexture || !sphereContext || !sphereImage || !sphereSamples) {
                    return false;
                }
                const output = sphereImage.data;
                const sine = Math.sin(rotation);
                const cosine = Math.cos(rotation);
                const pitchSine = Math.sin(pitch);
                const pitchCosine = Math.cos(pitch);
                sphereSamples.forEach(({ alpha, offset, viewX, viewY, viewZ }) => {
                    const worldY = (viewY * pitchCosine) - (viewZ * pitchSine);
                    const yawZ = (viewY * pitchSine) + (viewZ * pitchCosine);
                    const worldX = (viewX * cosine) - (yawZ * sine);
                    const worldZ = (viewX * sine) + (yawZ * cosine);
                    const textureX = Math.min(
                        earthTexture.width - 1,
                        Math.max(0, Math.floor((((Math.atan2(worldX, worldZ) / (Math.PI * 2)) + 1.5) % 1) * earthTexture.width))
                    );
                    const textureY = Math.min(
                        earthTexture.height - 1,
                        Math.max(0, Math.floor((0.5 - (Math.asin(Math.max(-1, Math.min(1, worldY))) / Math.PI)) * earthTexture.height))
                    );
                    const textureOffset = ((textureY * earthTexture.width) + textureX) * 4;
                    const light = Math.max(0, ((-viewX * 0.38) + (-viewY * 0.28) + (viewZ * 0.88)) / 1.02);
                    const red = earthTexture.data[textureOffset];
                    const green = earthTexture.data[textureOffset + 1];
                    const blue = earthTexture.data[textureOffset + 2];
                    const isDeepOcean = red < 32 && green < 42 && blue < 58;
                    const brightness = 0.7 + (light * 0.4);
                    const oceanBrightness = 0.72 + (light * 0.28);
                    output[offset] = isDeepOcean ? (9 + (red * 0.55)) * oceanBrightness : red * brightness;
                    output[offset + 1] = isDeepOcean ? (43 + (green * 0.58)) * oceanBrightness : green * brightness;
                    output[offset + 2] = isDeepOcean ? (62 + (blue * 0.62)) * oceanBrightness : blue * brightness;
                    output[offset + 3] = 255 * alpha;
                });
                sphereContext.putImageData(sphereImage, 0, 0);
                context.drawImage(sphereBuffer, centre - radius, centre - radius, radius * 2, radius * 2);

                const atmosphere = context.createRadialGradient(
                    centre - (radius * 0.22), centre - (radius * 0.28), radius * 0.12,
                    centre, centre, radius
                );
                atmosphere.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
                atmosphere.addColorStop(0.72, 'rgba(255, 255, 255, 0)');
                atmosphere.addColorStop(0.93, 'rgba(133, 202, 220, 0.04)');
                atmosphere.addColorStop(1, 'rgba(183, 223, 229, 0.42)');
                context.fillStyle = atmosphere;
                context.beginPath();
                context.arc(centre, centre, radius, 0, Math.PI * 2);
                context.fill();
                context.strokeStyle = 'rgba(172, 220, 225, 0.52)';
                context.lineWidth = Math.max(1.15 * ratio, 1);
                context.stroke();
                return true;
            }

            function drawArc(arc, centre, radius, ratio, time, arcIndex) {
                context.save();
                context.beginPath();
                let drawing = false;
                arc.forEach(({ vector, altitude }) => {
                    const point = rotateVector(vector, rotation, pitch, altitude);
                    if (point.z <= 0.015) {
                        drawing = false;
                        return;
                    }
                    const x = centre + (point.x * radius);
                    const y = centre - (point.y * radius);
                    if (!drawing) {
                        context.moveTo(x, y);
                        drawing = true;
                    } else {
                        context.lineTo(x, y);
                    }
                });
                context.strokeStyle = 'rgba(226, 129, 48, 0.64)';
                context.lineWidth = Math.max(1.08 * ratio, 1);
                if (!reducedMotionQuery.matches) {
                    context.setLineDash([7 * ratio, 5 * ratio]);
                    context.lineDashOffset = -(((time * 0.018) + (arcIndex * 9)) % (24 * ratio));
                }
                context.stroke();
                context.restore();
            }

            function draw(time = performance.now()) {
                if (!context) {
                    return;
                }
                canvas.dataset.ftGlobeRotation = rotation.toFixed(4);
                canvas.dataset.ftGlobePitch = pitch.toFixed(4);
                const { size, ratio } = resizeCanvas();
                const centre = size / 2;
                const radius = size * 0.4;
                const renderSize = Math.round(Math.min(520, Math.max(280, (radius * 2) / ratio)));
                prepareSphereBuffer(renderSize);
                context.clearRect(0, 0, size, size);

                const glow = context.createRadialGradient(
                    centre - (radius * 0.28), centre - (radius * 0.32), radius * 0.08,
                    centre, centre, radius * 1.08
                );
                glow.addColorStop(0, 'rgba(251, 253, 244, 0.86)');
                glow.addColorStop(0.68, 'rgba(235, 242, 221, 0.62)');
                glow.addColorStop(0.92, 'rgba(0, 97, 63, 0.11)');
                glow.addColorStop(1, 'rgba(0, 97, 63, 0)');
                context.fillStyle = glow;
                context.beginPath();
                context.arc(centre, centre, radius * 1.08, 0, Math.PI * 2);
                context.fill();

                if (!drawEarthTexture(centre, radius, ratio)) {
                    context.fillStyle = 'rgba(244, 248, 234, 0.78)';
                    context.beginPath();
                    context.arc(centre, centre, radius, 0, Math.PI * 2);
                    context.fill();
                    landPoints.forEach((vector) => {
                        const point = rotateVector(vector, rotation, pitch);
                        if (point.z <= 0) {
                            return;
                        }
                        const depth = Math.min(1, point.z);
                        context.fillStyle = `rgba(0, 97, 63, ${0.38 + (depth * 0.5)})`;
                        context.beginPath();
                        context.arc(
                            centre + (point.x * radius),
                            centre - (point.y * radius),
                            (0.72 + (depth * 0.58)) * ratio,
                            0,
                            Math.PI * 2
                        );
                        context.fill();
                    });
                }

                arcs.forEach((arc, arcIndex) => drawArc(arc, centre, radius, ratio, time, arcIndex));
                markers.forEach((vector, markerIndex) => {
                    const point = rotateVector(vector, rotation, pitch, 1.015);
                    if (point.z <= 0.02) {
                        return;
                    }
                    const x = centre + (point.x * radius);
                    const y = centre - (point.y * radius);
                    context.fillStyle = 'rgba(236, 143, 61, 0.98)';
                    context.beginPath();
                    context.arc(x, y, 2.15 * ratio, 0, Math.PI * 2);
                    context.fill();
                    context.strokeStyle = 'rgba(255, 230, 188, 0.84)';
                    context.lineWidth = Math.max(ratio, 1);
                    context.beginPath();
                    context.arc(x, y, 4.15 * ratio, 0, Math.PI * 2);
                    context.stroke();

                    if (!reducedMotionQuery.matches) {
                        const pulse = 5.3 + ((Math.sin((time / 420) + markerIndex) + 1) * 1.05);
                        context.strokeStyle = 'rgba(236, 143, 61, 0.28)';
                        context.beginPath();
                        context.arc(x, y, pulse * ratio, 0, Math.PI * 2);
                        context.stroke();
                    }
                });
            }

            function render(time) {
                frame = null;
                if (!isVisible || document.hidden || !context) {
                    return;
                }
                const elapsed = lastFrameTime ? Math.min(40, time - lastFrameTime) : (1000 / 60);
                lastFrameTime = time;
                if (!reducedMotionQuery.matches && !isDragging) {
                    resumeStrength = Math.min(1, resumeStrength + (elapsed / 1800));
                    rotation += rotationPerFrame * (elapsed / (1000 / 60)) * resumeStrength;
                }
                draw(time);
                if (!reducedMotionQuery.matches) {
                    frame = window.requestAnimationFrame(render);
                }
            }

            function requestRender() {
                if (frame === null && isVisible && !document.hidden) {
                    frame = window.requestAnimationFrame(render);
                }
            }

            async function activate() {
                if (activated || isActivating) {
                    requestRender();
                    return;
                }
                isActivating = true;
                context = canvas.getContext('2d', { alpha: true });
                if (!context) {
                    shell.dataset.ftGlobeState = 'unavailable';
                    isActivating = false;
                    return;
                }

                shell.dataset.ftGlobeState = 'loading';
                const [land, texture] = await Promise.all([
                    landPolygonPromise,
                    loadEarthTexture(shell.dataset.ftEarthTexture)
                ]);
                earthTexture = texture;
                if (!earthTexture) {
                    for (let latitude = -84; latitude <= 84; latitude += 2.25) {
                        for (let longitude = -179; longitude <= 179; longitude += 2.25) {
                            if (pointInLand(longitude, latitude, land.polygons)) {
                                landPoints.push(vectorFor(longitude, latitude));
                            }
                        }
                    }
                }
                markers = markerCoordinates.map((coordinates) => vectorFor(...coordinates));
                arcs = arcPairs.map(([from, to]) => arcBetween(markerCoordinates[from], markerCoordinates[to]));
                activated = true;
                isActivating = false;
                shell.dataset.ftGlobeState = reducedMotionQuery.matches ? 'reduced' : 'ready';
                shell.dataset.ftGlobePoints = String(landPoints.length);
                shell.dataset.ftGlobeMap = earthTexture ? 'nasa-blue-marble-january' : land.source;
                shell.dataset.ftGlobeTexture = earthTexture ? 'ready' : 'fallback';
                canvas.dataset.ftGlobeLocationCount = String(globeLocations.length);
                canvas.dataset.ftGlobeLocations = globeLocations.map(({ name }) => name).join('|');

                canvas.addEventListener('pointerdown', (event) => {
                    isDragging = true;
                    resumeStrength = 0;
                    previousPointerX = event.clientX;
                    previousPointerY = event.clientY;
                    canvas.setPointerCapture?.(event.pointerId);
                });
                canvas.addEventListener('pointermove', (event) => {
                    if (!isDragging) {
                        return;
                    }
                    rotation += (event.clientX - previousPointerX) * 0.006;
                    pitch = Math.max(-1.15, Math.min(1.15, pitch - ((event.clientY - previousPointerY) * 0.006)));
                    previousPointerX = event.clientX;
                    previousPointerY = event.clientY;
                    draw();
                });
                const stopDragging = (event) => {
                    if (!isDragging) {
                        return;
                    }
                    isDragging = false;
                    resumeStrength = 0;
                    canvas.releasePointerCapture?.(event.pointerId);
                    requestRender();
                };
                canvas.addEventListener('pointerup', stopDragging);
                canvas.addEventListener('pointercancel', stopDragging);
                canvas.addEventListener('keydown', (event) => {
                    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                        return;
                    }
                    event.preventDefault();
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        rotation += event.key === 'ArrowLeft' ? -0.1 : 0.1;
                    } else {
                        pitch = Math.max(-1.15, Math.min(1.15, pitch + (event.key === 'ArrowUp' ? 0.1 : -0.1)));
                    }
                    resumeStrength = 0;
                    draw();
                });
                if ('ResizeObserver' in window) {
                    new ResizeObserver(() => draw()).observe(shell);
                }
                draw();
                requestRender();
            }

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    isVisible = entries.some((entry) => entry.isIntersecting);
                    if (isVisible) {
                        activate();
                    } else if (frame !== null) {
                        window.cancelAnimationFrame(frame);
                        frame = null;
                        lastFrameTime = 0;
                    }
                }, { rootMargin: '180px 0px', threshold: 0.01 });
                observer.observe(shell);
            } else {
                isVisible = true;
                activate();
            }

            document.addEventListener('visibilitychange', () => {
                if (document.hidden && frame !== null) {
                    window.cancelAnimationFrame(frame);
                    frame = null;
                    lastFrameTime = 0;
                } else {
                    requestRender();
                }
            });
            reducedMotionQuery.addEventListener?.('change', () => {
                shell.dataset.ftGlobeState = reducedMotionQuery.matches ? 'reduced' : 'ready';
                if (reducedMotionQuery.matches && frame !== null) {
                    window.cancelAnimationFrame(frame);
                    frame = null;
                }
                draw();
                requestRender();
            });
        });
    }

    function initialiseLanguageSelector() {
        const selector = document.querySelector('.ft-native-language');
        const summary = selector?.querySelector('summary');

        if (!selector || !summary) {
            return;
        }

        selector.addEventListener('keydown', (event) => {
            if (
                event.target === summary &&
                !event.repeat &&
                (event.key === 'Enter' || event.key === ' ')
            ) {
                event.preventDefault();
                selector.open = !selector.open;
                return;
            }

            if (event.key === 'Escape' && selector.open) {
                selector.removeAttribute('open');
                summary.focus();
            }
        });

        document.addEventListener('click', (event) => {
            if (selector.open && !selector.contains(event.target)) {
                selector.removeAttribute('open');
            }
        });
    }

    function initialiseBentoGroups() {
        document.querySelectorAll(
            '.ft-native-menu-card > .wp-block-navigation-submenu__toggle'
        ).forEach((heading) => {
            if (heading.previousElementSibling?.classList.contains('ft-native-menu-card-heading')) {
                return;
            }

            const semanticHeading = document.createElement('h2');

            semanticHeading.className = 'ft-native-menu-card-heading';
            semanticHeading.textContent = heading.textContent.trim();
            heading.before(semanticHeading);
            heading.hidden = true;
            heading.setAttribute('aria-hidden', 'true');
            heading.setAttribute('tabindex', '-1');
        });
    }

    function initialiseMenuOverlay() {
        const navigation = document.querySelector('.ft-native-menu-trigger');
        const overlay = navigation?.querySelector('.wp-block-navigation__responsive-container');
        const openButton = navigation?.querySelector('.wp-block-navigation__responsive-container-open');
        const closeButton = overlay?.querySelector('.wp-block-navigation__responsive-container-close');
        const content = overlay?.querySelector('.wp-block-navigation__responsive-container-content');
        if (!navigation || !overlay || !openButton || !closeButton || !content) {
            return;
        }

        const topbar = document.createElement('div');
        const brand = document.createElement('span');
        topbar.className = 'ft-native-menu-topbar';
        brand.className = 'ft-native-menu-brand';
        brand.setAttribute('role', 'img');
        brand.setAttribute('aria-label', 'FarmTree');
        topbar.append(brand, closeButton);
        overlay.prepend(topbar);

        const backgroundTargets = Array.from(document.querySelectorAll([
            'main',
            '.ft-native-site-footer',
            '.ft-native-logo-shell',
            '.ft-native-primary-nav',
            '.ft-native-header-actions > .wp-block-buttons',
            '.ft-native-language'
        ].join(',')));
        const previousBodyStyles = {};
        const previousAriaHidden = new Map();
        let savedScrollY = 0;
        let pendingScrollY = null;
        let returnFocus = null;
        let pendingReturnFocus = null;
        let locked = false;

        function captureOpenIntent() {
            if (locked || pendingScrollY !== null) {
                return;
            }
            pendingScrollY = window.scrollY;
            pendingReturnFocus = openButton;
        }

        openButton.addEventListener('pointerdown', captureOpenIntent, true);
        openButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                captureOpenIntent();
            }
        }, true);
        openButton.addEventListener('click', captureOpenIntent, true);

        function focusableElements() {
            return Array.from(overlay.querySelectorAll(
                'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
            )).filter((element) => !element.hidden && element.getClientRects().length > 0);
        }

        function isolateBackground(active) {
            backgroundTargets.forEach((target) => {
                if (active) {
                    previousAriaHidden.set(target, target.getAttribute('aria-hidden'));
                    target.setAttribute('aria-hidden', 'true');
                    target.inert = true;
                    return;
                }
                target.inert = false;
                const previous = previousAriaHidden.get(target);
                if (previous === null || previous === undefined) {
                    target.removeAttribute('aria-hidden');
                } else {
                    target.setAttribute('aria-hidden', previous);
                }
            });
            if (!active) {
                previousAriaHidden.clear();
            }
        }

        function lockPage() {
            if (locked) {
                return;
            }
            locked = true;
            savedScrollY = pendingScrollY ?? window.scrollY;
            returnFocus = pendingReturnFocus ?? (
                document.activeElement === openButton ? openButton : document.activeElement
            );
            pendingScrollY = null;
            pendingReturnFocus = null;
            ['position', 'top', 'left', 'right', 'width', 'overflow'].forEach((property) => {
                previousBodyStyles[property] = document.body.style[property];
            });
            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('ft-menu-open');
            document.documentElement.classList.add('ft-menu-open');
            isolateBackground(true);
            window.requestAnimationFrame(() => closeButton.focus());
        }

        function unlockPage() {
            if (!locked) {
                return;
            }
            locked = false;
            const previousScrollBehavior = document.documentElement.style.scrollBehavior;
            Object.entries(previousBodyStyles).forEach(([property, value]) => {
                document.body.style[property] = value;
            });
            document.body.classList.remove('ft-menu-open');
            document.documentElement.classList.remove('ft-menu-open');
            isolateBackground(false);
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, savedScrollY);
            window.requestAnimationFrame(() => {
                document.documentElement.style.scrollBehavior = previousScrollBehavior;
                if (returnFocus?.isConnected) {
                    returnFocus.focus();
                } else {
                    openButton.focus();
                }
                returnFocus = null;
            });
        }

        function synchroniseState() {
            if (overlay.classList.contains('is-menu-open')) {
                lockPage();
            } else {
                unlockPage();
            }
        }

        overlay.addEventListener('keydown', (event) => {
            if (!overlay.classList.contains('is-menu-open')) {
                return;
            }
            if (event.key === 'Escape' && !event.repeat) {
                event.preventDefault();
                closeButton.click();
                return;
            }
            if (event.key !== 'Tab') {
                return;
            }
            const focusable = focusableElements();
            const first = focusable[0];
            const last = focusable.at(-1);
            if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        });

        new MutationObserver(synchroniseState).observe(overlay, {
            attributes: true,
            attributeFilter: ['class']
        });
        window.addEventListener('pagehide', unlockPage);
        synchroniseState();
    }

    function initialiseFaqDetails() {
        document.querySelectorAll('.ft-faq-list summary').forEach((summary) => {
            summary.addEventListener('keydown', (event) => {
                if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) {
                    return;
                }

                event.preventDefault();
                summary.parentElement.open = !summary.parentElement.open;
            });
        });
    }

    function initialiseQuotationDialog() {
        const dialog = document.querySelector('[data-ft-quotation-dialog]');
        const triggers = Array.from(document.querySelectorAll(
            '.ft-native-quotation-action a, a.ft-native-quotation-action'
        ));

        if (!dialog || triggers.length === 0 || typeof dialog.showModal !== 'function') {
            return;
        }

        const closeButton = dialog.querySelector('[data-ft-quotation-close]');
        let returnFocus = null;

        function closeDialog() {
            if (dialog.open) {
                dialog.close();
            }
        }

        function openDialog(event) {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            event.preventDefault();
            returnFocus = event.currentTarget;
            dialog.showModal();
            document.body.classList.add('ft-quotation-open');
            closeButton?.focus();
        }

        triggers.forEach((trigger) => trigger.addEventListener('click', openDialog));
        closeButton?.addEventListener('click', closeDialog);
        dialog.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                const focusable = Array.from(dialog.querySelectorAll(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )).filter((element) => !element.hidden && element.getClientRects().length > 0);
                const first = focusable[0];
                const last = focusable.at(-1);

                if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }

            if (event.key === 'Escape' && !event.defaultPrevented && !event.repeat) {
                event.preventDefault();
                closeDialog();
            }
        });
        dialog.addEventListener('cancel', (event) => {
            event.preventDefault();
            closeDialog();
        });
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                closeDialog();
            }
        });
        dialog.addEventListener('close', () => {
            document.body.classList.remove('ft-quotation-open');
            returnFocus?.focus();
            returnFocus = null;
        });
    }

    function initialise() {
        document.querySelectorAll(heroSelector).forEach(initialiseHero);
        initialiseLanguageSelector();
        initialiseBentoGroups();
        initialiseMenuOverlay();
        initialiseFaqDetails();
        initialiseQuotationDialog();
        initialiseMotion();
        initialiseMovingRails();
        initialiseGlobes();
        initialiseCounters();
        initialiseHeaderState();
        initialiseFooterQuotes();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise, { once: true });
    } else {
        initialise();
    }
}());
