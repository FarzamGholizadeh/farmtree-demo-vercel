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
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
            }, 6000);
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

        let touchStartX = 0;
        let touchStartY = 0;
        hero.addEventListener('touchstart', (event) => {
            const touch = event.changedTouches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });
        hero.addEventListener('touchend', (event) => {
            if (!window.matchMedia('(max-width: 768px)').matches) {
                return;
            }
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                selectSlide(currentIndex + (deltaX < 0 ? 1 : -1));
            }
        }, { passive: true });

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
            '.ft-native-footer-top',
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
        document.querySelectorAll('.ft-partner-logos, .ft-trust-quotes').forEach((rail) => {
            if (rail.dataset.ftRailReady === 'true' || reducedMotionQuery.matches) {
                return;
            }

            rail.dataset.ftRailReady = 'true';
            rail.classList.add('ft-moving-rail');
            const track = document.createElement('div');
            const sequence = document.createElement('div');
            const items = Array.from(rail.children);

            track.className = 'ft-moving-rail-track';
            sequence.className = 'ft-moving-rail-sequence';
            items.forEach((item) => sequence.append(item));
            const clone = sequence.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button, input, summary, [tabindex]').forEach((control) => {
                control.setAttribute('tabindex', '-1');
            });
            track.append(sequence, clone);
            rail.append(track);

            const updateDistance = () => {
                track.style.setProperty('--ft-rail-distance', `${sequence.getBoundingClientRect().width}px`);
            };
            window.requestAnimationFrame(updateDistance);
            if ('ResizeObserver' in window) {
                new ResizeObserver(updateDistance).observe(sequence);
            }
        });
    }

    function initialiseGlobes() {
        document.querySelectorAll('[data-ft-globe-shell]').forEach((shell) => {
            const canvas = shell.querySelector('[data-ft-globe]');
            if (!canvas || canvas.dataset.ftGlobeReady === 'true') {
                return;
            }

            canvas.dataset.ftGlobeReady = 'true';
            let context = null;
            let points = [];
            let markers = [];
            let rotation = -0.35;
            let frame = null;
            let lastFrameTime = 0;
            let isVisible = false;
            let isDragging = false;
            let previousPointerX = 0;
            let activated = false;

            function resizeCanvas() {
                const size = Math.max(240, Math.round(canvas.getBoundingClientRect().width));
                const ratio = Math.min(window.devicePixelRatio || 1, 2);
                const width = Math.round(size * ratio);

                if (canvas.width !== width || canvas.height !== width) {
                    canvas.width = width;
                    canvas.height = width;
                }

                return { size: width, ratio };
            }

            function draw(time = 0) {
                if (!context) {
                    return;
                }

                const { size, ratio } = resizeCanvas();
                const centre = size / 2;
                const radius = size * 0.385;
                const green = [0, 97, 63];
                const gold = [211, 176, 107];

                context.clearRect(0, 0, size, size);
                const atmosphere = context.createRadialGradient(
                    centre - radius * 0.28,
                    centre - radius * 0.34,
                    radius * 0.06,
                    centre,
                    centre,
                    radius * 1.12
                );
                atmosphere.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
                atmosphere.addColorStop(0.55, 'rgba(220, 231, 210, 0.72)');
                atmosphere.addColorStop(0.88, 'rgba(0, 97, 63, 0.13)');
                atmosphere.addColorStop(1, 'rgba(0, 97, 63, 0)');
                context.fillStyle = atmosphere;
                context.beginPath();
                context.arc(centre, centre, radius * 1.1, 0, Math.PI * 2);
                context.fill();

                context.strokeStyle = 'rgba(0, 97, 63, 0.22)';
                context.lineWidth = Math.max(1, ratio);
                context.beginPath();
                context.arc(centre, centre, radius, 0, Math.PI * 2);
                context.stroke();

                points.forEach((point) => {
                    const longitude = point.longitude + rotation;
                    const x = point.cosLatitude * Math.sin(longitude);
                    const z = point.cosLatitude * Math.cos(longitude);
                    if (z < -0.08) {
                        return;
                    }
                    const y = point.sinLatitude;
                    const depth = Math.max(0, (z + 0.08) / 1.08);
                    const dotRadius = (0.75 + (depth * 1.05)) * ratio;
                    context.fillStyle = `rgba(${green.join(', ')}, ${0.12 + (depth * 0.58)})`;
                    context.beginPath();
                    context.arc(centre + (x * radius), centre - (y * radius), dotRadius, 0, Math.PI * 2);
                    context.fill();
                });

                markers.forEach((marker, index) => {
                    const longitude = marker.longitude + rotation;
                    const x = marker.cosLatitude * Math.sin(longitude);
                    const z = marker.cosLatitude * Math.cos(longitude);
                    if (z < 0.02) {
                        return;
                    }
                    const y = marker.sinLatitude;
                    const depth = Math.max(0, z);
                    const markerX = centre + (x * radius);
                    const markerY = centre - (y * radius);
                    const pulse = reducedMotionQuery.matches
                        ? 0
                        : Math.max(0, Math.sin((time / 650) + index)) * 2.4 * ratio;

                    context.strokeStyle = `rgba(${gold.join(', ')}, ${0.2 + (depth * 0.42)})`;
                    context.lineWidth = Math.max(1, ratio);
                    context.beginPath();
                    context.arc(markerX, markerY, (6 * ratio) + pulse, 0, Math.PI * 2);
                    context.stroke();
                    context.fillStyle = `rgba(${gold.join(', ')}, ${0.7 + (depth * 0.3)})`;
                    context.beginPath();
                    context.arc(markerX, markerY, 3.2 * ratio, 0, Math.PI * 2);
                    context.fill();
                });
            }

            function render(time) {
                frame = null;
                if (!isVisible || !context) {
                    return;
                }

                const elapsed = lastFrameTime ? Math.min(40, time - lastFrameTime) : 16;
                lastFrameTime = time;
                if (!reducedMotionQuery.matches && !isDragging) {
                    rotation += elapsed * 0.000055;
                }
                draw(time);
                if (!reducedMotionQuery.matches) {
                    frame = window.requestAnimationFrame(render);
                }
            }

            function requestRender() {
                if (frame === null && isVisible) {
                    frame = window.requestAnimationFrame(render);
                }
            }

            function activate() {
                if (activated) {
                    requestRender();
                    return;
                }

                context = canvas.getContext('2d', { alpha: true });
                if (!context) {
                    shell.dataset.ftGlobeState = 'unavailable';
                    return;
                }

                points = [];
                for (let latitude = -80; latitude <= 80; latitude += 10) {
                    const latitudeRadians = latitude * (Math.PI / 180);
                    for (let longitude = 0; longitude < 360; longitude += 12) {
                        points.push({
                            longitude: longitude * (Math.PI / 180),
                            cosLatitude: Math.cos(latitudeRadians),
                            sinLatitude: Math.sin(latitudeRadians)
                        });
                    }
                }
                markers = [
                    [7, 18],
                    [44, -4],
                    [-18, 27],
                    [24, -31],
                    [-40, -16],
                    [61, 22]
                ].map(([longitude, latitude]) => {
                    const latitudeRadians = latitude * (Math.PI / 180);
                    return {
                        longitude: longitude * (Math.PI / 180),
                        cosLatitude: Math.cos(latitudeRadians),
                        sinLatitude: Math.sin(latitudeRadians)
                    };
                });
                activated = true;
                shell.dataset.ftGlobeState = reducedMotionQuery.matches ? 'reduced' : 'ready';

                canvas.addEventListener('pointerdown', (event) => {
                    isDragging = true;
                    previousPointerX = event.clientX;
                    canvas.setPointerCapture?.(event.pointerId);
                });
                canvas.addEventListener('pointermove', (event) => {
                    if (!isDragging) {
                        return;
                    }
                    rotation += (event.clientX - previousPointerX) * 0.008;
                    previousPointerX = event.clientX;
                    draw(performance.now());
                });
                const stopDragging = (event) => {
                    if (!isDragging) {
                        return;
                    }
                    isDragging = false;
                    canvas.releasePointerCapture?.(event.pointerId);
                    requestRender();
                };
                canvas.addEventListener('pointerup', stopDragging);
                canvas.addEventListener('pointercancel', stopDragging);
                canvas.addEventListener('keydown', (event) => {
                    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                        return;
                    }
                    event.preventDefault();
                    rotation += event.key === 'ArrowLeft' ? -0.12 : 0.12;
                    draw(performance.now());
                });
                if ('ResizeObserver' in window) {
                    new ResizeObserver(() => draw(performance.now())).observe(shell);
                }
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
                }, { rootMargin: '240px 0px', threshold: 0.01 });
                observer.observe(shell);
            } else {
                isVisible = true;
                activate();
            }

            reducedMotionQuery.addEventListener?.('change', () => {
                shell.dataset.ftGlobeState = reducedMotionQuery.matches ? 'reduced' : 'ready';
                if (reducedMotionQuery.matches && frame !== null) {
                    window.cancelAnimationFrame(frame);
                    frame = null;
                }
                draw(performance.now());
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
