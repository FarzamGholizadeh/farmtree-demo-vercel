/* FarmTree AI — public chat widget.
 * All replies come from the server. This script never invents answers and never
 * receives the API key. Bot text is inserted with textContent only (no HTML). */
(function () {
    'use strict';

    var CFG = window.FT_AI_CFG;
    if (!CFG || !CFG.restUrl) { return; }

    var root = document.getElementById('ft-ai-root');
    if (!root) { return; }

    var launcher = document.getElementById('ft-ai-launcher');
    var panel    = document.getElementById('ft-ai-panel');
    var closeBtn = document.getElementById('ft-ai-close');
    var log      = document.getElementById('ft-ai-log');
    var quick    = document.getElementById('ft-ai-quick');
    var form     = document.getElementById('ft-ai-form');
    var input    = document.getElementById('ft-ai-input');
    var sendBtn  = document.getElementById('ft-ai-send');
    var titleEl  = document.getElementById('ft-ai-title');

    var i18n = CFG.i18n || {};
    var history = [];       // [{role, content}]
    var busy = false;
    var greeted = false;
    var lastUserMessage = '';

    titleEl.textContent = i18n.title || 'Assistant';
    input.setAttribute('placeholder', i18n.placeholder || '');
    launcher.setAttribute('aria-label', i18n.launch || '');
    root.hidden = false;

    // ---- session id (per tab; not personal) ----
    var session = '';
    try {
        session = sessionStorage.getItem('ft_ai_session') || '';
        if (!session) {
            session = 's-' + Math.abs(hashStr(String(navigator.userAgent) + location.pathname + performance.now())).toString(36);
            sessionStorage.setItem('ft_ai_session', session);
        }
    } catch (e) { session = 's-anon'; }

    function hashStr(s) { var h = 0, i; for (i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i) | 0; } return h; }

    // ---- open / close ----
    function open() {
        root.classList.add('is-open');
        panel.hidden = false;
        launcher.setAttribute('aria-expanded', 'true');
        if (!greeted) {
            greeted = true;
            addBot(i18n.greeting || '');
            renderQuick();
        }
        setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
        root.classList.remove('is-open');
        panel.hidden = true;
        launcher.setAttribute('aria-expanded', 'false');
        launcher.focus();
    }
    launcher.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && root.classList.contains('is-open')) { close(); }
    });

    // ---- quick replies from enabled skills ----
    function renderQuick() {
        quick.textContent = '';
        var skills = Array.isArray(CFG.skills) ? CFG.skills : [];
        if (!skills.length) { quick.hidden = true; return; }
        quick.hidden = false;
        skills.slice(0, 6).forEach(function (s) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'ft-ai-chip';
            b.textContent = s.label;
            b.addEventListener('click', function () {
                if (busy) { return; }
                submit(s.label);
            });
            quick.appendChild(b);
        });
    }

    // ---- message rendering (textContent only) ----
    function addMsg(role, text) {
        var el = document.createElement('div');
        el.className = 'ft-ai-msg ft-ai-msg--' + (role === 'user' ? 'user' : 'bot');
        el.textContent = text;
        log.appendChild(el);
        scroll();
        return el;
    }
    function addUser(text) { addMsg('user', text); }
    function addBot(text, sources) {
        var el = addMsg('bot', text);
        if (sources && sources.length) {
            var box = document.createElement('div');
            box.className = 'ft-ai-sources';
            var h = document.createElement('strong');
            h.textContent = i18n.sources || 'Sources';
            box.appendChild(h);
            sources.forEach(function (s) {
                if (!s || !s.url || !/^https?:\/\//i.test(s.url)) { return; }
                var a = document.createElement('a');
                a.href = s.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = s.title || s.url;
                box.appendChild(a);
            });
            el.appendChild(box);
        }
        return el;
    }

    var typingEl = null;
    function showTyping() {
        typingEl = document.createElement('div');
        typingEl.className = 'ft-ai-msg ft-ai-msg--bot';
        typingEl.setAttribute('aria-label', i18n.thinking || 'Thinking');
        var t = document.createElement('span');
        t.className = 'ft-ai-typing';
        t.appendChild(document.createElement('span'));
        t.appendChild(document.createElement('span'));
        t.appendChild(document.createElement('span'));
        typingEl.appendChild(t);
        log.appendChild(typingEl);
        scroll();
    }
    function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }

    function showError(message) {
        hideTyping();
        var box = document.createElement('div');
        box.className = 'ft-ai-error';
        var p = document.createElement('div');
        p.textContent = message || i18n.error || 'Error';
        box.appendChild(p);
        if (lastUserMessage) {
            var r = document.createElement('button');
            r.type = 'button';
            r.className = 'ft-ai-retry';
            r.textContent = i18n.retry || 'Retry';
            r.addEventListener('click', function () { box.remove(); submit(lastUserMessage, true); });
            box.appendChild(r);
        }
        log.appendChild(box);
        scroll();
    }

    function scroll() { log.scrollTop = log.scrollHeight; }

    // ---- send ----
    function submit(message, isRetry) {
        message = String(message || '').trim();
        if (!message || busy) { return; }
        if (CFG.maxLen && message.length > CFG.maxLen) { message = message.slice(0, CFG.maxLen); }
        if (!isRetry) { addUser(message); }
        lastUserMessage = message;
        setBusy(true);
        showTyping();

        var payloadHistory = history.slice(-(CFG.maxHistory || 8));

        fetch(CFG.restUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': CFG.nonce || '',
                'X-FT-AI-Nonce': CFG.altNonce || ''
            },
            credentials: 'same-origin',
            body: JSON.stringify({ message: message, session: session, history: payloadHistory })
        }).then(function (res) {
            return res.json().then(function (data) { return { status: res.status, data: data }; });
        }).then(function (r) {
            hideTyping();
            setBusy(false);
            var d = r.data || {};
            if (r.status === 200 && d.ok && typeof d.reply === 'string') {
                addBot(d.reply, d.sources);
                history.push({ role: 'user', content: message });
                history.push({ role: 'assistant', content: d.reply });
                if (history.length > 40) { history = history.slice(-40); }
                return;
            }
            if (r.status === 429) { showError(i18n.rateLimited || i18n.error); return; }
            if (r.status === 503) { showError(i18n.unavailable || i18n.error); return; }
            showError((d && d.message) ? d.message : i18n.error);
        }).catch(function () {
            hideTyping();
            setBusy(false);
            showError(i18n.error);
        });
    }

    function setBusy(v) {
        busy = v;
        sendBtn.disabled = v;
        input.readOnly = v;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value;
        input.value = '';
        autosize();
        submit(v);
    });

    // Enter to send, Shift+Enter for newline.
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    });
    input.addEventListener('input', autosize);
    function autosize() {
        input.style.height = 'auto';
        input.style.height = Math.min(120, input.scrollHeight) + 'px';
    }

    // ---- hide launcher while the theme's mobile (Bento) menu is open ----
    (function watchMenu() {
        var selector = CFG.menuOpenSelector || '';
        if (!selector) { return; }
        function check() {
            var open = false;
            try { open = !!document.querySelector(selector); } catch (e) { open = false; }
            root.classList.toggle('is-menu-open', open);
        }
        var mo = new MutationObserver(check);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        check();
    }());
}());
