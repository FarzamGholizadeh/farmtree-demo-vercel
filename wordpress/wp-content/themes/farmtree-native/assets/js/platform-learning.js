(() => {
    'use strict';
    const classroom = document.querySelector('.ft-learning-classroom');
    if (!classroom) return;
    const records = [...document.querySelectorAll('.ft-learning-card')].flatMap(card => {
        const link = card.querySelector('.ft-learning-youtube a');
        let url;
        try { url = new URL(link.href); } catch { return []; }
        const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
        if (url.protocol !== 'https:' || !['www.youtube.com', 'youtube.com', 'youtu.be'].includes(url.hostname) || !/^[A-Za-z0-9_-]{11}$/.test(id || '')) return [];
        return [{card, id, url: 'https://www.youtube.com/watch?v=' + id,
            title: card.querySelector('h3')?.textContent.trim() || 'FarmTree video',
            module: card.querySelector('.ft-learning-module')?.textContent.trim() || 'Platform videos',
            description: card.querySelector('.ft-learning-description')?.textContent.trim() || '',
            duration: card.querySelector('.ft-learning-duration')?.textContent.trim() || '',
            image: card.querySelector('img')}];
    });
    if (!records.length) return;
    const unique = records.filter((record, i) => records.findIndex(r => r.id === record.id) === i);
    const el = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text) node.textContent = text;
        if (className) node.className = className;
        return node;
    };
    const button = (text, action) => {
        const node = el('button', text);
        node.type = 'button'; node.addEventListener('click', action);
        return node;
    };
    const main = el('section', '', 'ft-learning-active');
    main.setAttribute('aria-labelledby', 'ft-learning-title');
    const player = el('div', '', 'ft-learning-player');
    const info = el('div', '', 'ft-learning-info');
    const meta = el('p', '', 'ft-learning-module');
    const heading = el('h2'); heading.id = 'ft-learning-title'; heading.tabIndex = -1;
    const description = el('p');
    const external = el('a', 'Watch on YouTube ↗');
    external.target = '_blank'; external.rel = 'noopener noreferrer';
    const privacy = el('p', 'YouTube stays unloaded until you choose to load the player. This shares request information with YouTube/Google; their privacy practices apply. ', 'ft-learning-privacy');
    const policy = el('a', 'Privacy Policy'); policy.href = '/privacy/'; privacy.append(policy);
    const controls = el('div', '', 'ft-learning-step');
    let current = 0;
    const previous = button('← Previous lesson', () => select(current - 1, true));
    const next = button('Next lesson →', () => select(current + 1, true));
    controls.append(previous, next);
    info.append(meta, heading, description, external, controls, privacy);
    main.append(player, info);
    const navigation = el('details', '', 'ft-learning-navigation');
    const summary = el('summary', 'Lessons · ' + unique.length);
    const nav = el('nav'); nav.setAttribute('aria-label', 'Platform video lessons');
    navigation.append(summary, nav);
    const navButtons = [];
    const groups = new Map();
    unique.forEach((record, index) => {
        if (!groups.has(record.module)) {
            const section = el('div', '', 'ft-learning-nav-group');
            section.append(el('h3', record.module));
            const list = el('ol'); section.append(list); nav.append(section); groups.set(record.module, list);
        }
        const item = el('li');
        const choice = button(String(index + 1).padStart(2, '0') + '  ' + record.title, () => select(index, true));
        choice.setAttribute('aria-controls', 'ft-learning-title');
        item.append(choice); groups.get(record.module).append(item); navButtons.push(choice);
        const play = button('Play lesson', () => select(index, true));
        play.setAttribute('aria-label', 'Play lesson: ' + record.title);
        record.card.append(play);
        if (record.image) record.image.loading = 'lazy';
    });
    function select(index, focus = false) {
        if (!unique[index]) return;
        current = index;
        const record = unique[index];
        player.replaceChildren(); // Destroys the previous iframe and stops playback.
        if (record.image) {
            const poster = record.image.cloneNode();
            poster.removeAttribute('id'); poster.alt = ''; poster.loading = 'eager';
            poster.setAttribute('fetchpriority', index === 0 ? 'high' : 'auto');
            player.append(poster);
        }
        const load = button('▶ Load YouTube player', () => {
            const iframe = document.createElement('iframe');
            iframe.title = record.title + ' — YouTube video';
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + record.id + '?autoplay=0&rel=0';
            iframe.allow = 'encrypted-media; picture-in-picture; fullscreen';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.width = '960'; iframe.height = '540';
            player.replaceChildren(iframe);
            iframe.focus();
        });
        load.setAttribute('aria-label', 'Load YouTube player: ' + record.title);
        player.append(load);
        meta.textContent = record.module + (record.duration ? ' · ' + record.duration : '');
        heading.textContent = record.title;
        description.textContent = record.description;
        external.href = record.url;
        previous.disabled = index === 0; next.disabled = index === unique.length - 1;
        navButtons.forEach((node, i) => {
            if (i === index) node.setAttribute('aria-current', 'true');
            else node.removeAttribute('aria-current');
        });
        if (focus) {
            heading.focus({preventScroll: true});
            classroom.scrollIntoView({block: 'start', behavior: 'instant'});
        }
    }
    classroom.replaceChildren(main, navigation);
    classroom.classList.add('is-enhanced');
    const desktop = matchMedia('(min-width: 900px)');
    const adapt = () => { navigation.open = desktop.matches; };
    desktop.addEventListener('change', adapt); adapt(); select(0);
})();
