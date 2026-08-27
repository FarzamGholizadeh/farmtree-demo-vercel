/**
 * Accessible interactions and progressive motion for the FarmTree native theme.
 *
 * The Homepage hero never advances on a timer. Visitors remain in control of
 * every image change. Decorative motion never controls content state and is
 * removed when reduced motion is requested.
 */
(function () {
    'use strict';

    const heroSelector = '.ft-home-hero';
    const heroSlideSelector = '.ft-home-hero-slide';
    const heroDotSelector = '[data-ft-hero-dot]';
    const platformSelector = '.ft-platform-visual';
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
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => selectSlide(index));
        });

        previousButton?.addEventListener('click', () => selectSlide(currentIndex - 1));
        nextButton?.addEventListener('click', () => selectSlide(currentIndex + 1));

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

        selectSlide(currentIndex);
    }

    function initialisePlatform(carousel) {
        const video = carousel.querySelector('.ft-platform-video-slide video');
        const videoDescription = carousel.querySelector('.ft-platform-video-description');
        const videoToggle = carousel.querySelector('[data-ft-platform-video-toggle]');

        if (!video || !videoToggle || carousel.dataset.ftPlatformReady === 'true') {
            return;
        }

        carousel.dataset.ftPlatformReady = 'true';
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'FarmTree Platform landscape animation');
        if (videoDescription) {
            videoDescription.id = videoDescription.id || 'ft-platform-video-description';
            carousel.setAttribute('aria-describedby', videoDescription.id);
        }

        let sectionVisible = false;
        let userPausedVideo = false;
        let userRequestedVideo = false;

        function updateVideoToggle() {
            if (!video || !videoToggle) {
                return;
            }

            const isPlaying = !video.paused;

            videoToggle.textContent = isPlaying ? 'Pause video' : 'Play video';
            videoToggle.setAttribute(
                'aria-label',
                isPlaying ? 'Pause landscape video' : 'Play landscape video'
            );
        }

        function updateVideoPlayback() {
            if (!video) {
                return;
            }

            const shouldPlay = (
                sectionVisible &&
                !document.hidden &&
                !userPausedVideo &&
                (!reducedMotionQuery.matches || userRequestedVideo)
            );

            if (shouldPlay && video.paused) {
                video.muted = true;
                const playRequest = video.play();

                playRequest?.catch(() => {
                    // Browser autoplay rejection is harmless; the poster remains visible.
                    updateVideoToggle();
                });
            } else if (!shouldPlay && !video.paused) {
                video.pause();
            }

            updateVideoToggle();
        }

        videoToggle?.addEventListener('click', () => {
            if (video.paused) {
                userPausedVideo = false;
                userRequestedVideo = true;
                updateVideoPlayback();
            } else {
                userPausedVideo = true;
                userRequestedVideo = false;
                video.pause();
            }
        });

        video.muted = true;
        video.setAttribute('aria-hidden', 'true');
        video.setAttribute('tabindex', '-1');
        video.addEventListener('play', updateVideoToggle);
        video.addEventListener('pause', updateVideoToggle);

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                const entry = entries.at(-1);

                sectionVisible = Boolean(
                    entry?.isIntersecting && entry.intersectionRatio >= 0.25
                );
                updateVideoPlayback();
            }, { threshold: [0, 0.25, 0.6] });

            observer.observe(carousel);
        } else {
            sectionVisible = true;
        }

        document.addEventListener('visibilitychange', updateVideoPlayback);
        reducedMotionQuery.addEventListener?.('change', updateVideoPlayback);
        updateVideoPlayback();
    }

    function initialiseMotion() {
        const targets = document.querySelectorAll([
            '.ft-home-section-heading',
            '.ft-platform-copy',
            '.ft-platform-visual',
            '.ft-technology-model',
            '.ft-home-inputs > .wp-block-column',
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
            const items = Array.from(rail.children);

            track.className = 'ft-moving-rail-track';
            items.forEach((item) => track.append(item));
            items.forEach((item) => {
                const clone = item.cloneNode(true);

                clone.setAttribute('aria-hidden', 'true');
                clone.querySelectorAll('a, button, input, summary, [tabindex]').forEach((control) => {
                    control.setAttribute('tabindex', '-1');
                });
                track.append(clone);
            });
            rail.append(track);
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
        document.querySelectorAll(platformSelector).forEach(initialisePlatform);
        initialiseLanguageSelector();
        initialiseBentoGroups();
        initialiseFaqDetails();
        initialiseQuotationDialog();
        initialiseMotion();
        initialiseMovingRails();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise, { once: true });
    } else {
        initialise();
    }
}());
