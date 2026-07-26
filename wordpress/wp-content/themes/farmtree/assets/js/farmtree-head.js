/* FarmTree head bundle — CTA capture listener + early hash router.
   Loaded in <head>; both defer real DOM work to DOMContentLoaded. */

/* ==== ft-cta-actions-v1 ==== */
/* CTA semantics (final product decision, 2026-07):
   - platform-login / request-demo controls are NATIVE ANCHORS with exact
     approved hrefs. JavaScript does not reproduce their navigation —
     normal click, keyboard Enter, Cmd/Ctrl-click, middle-click, copy
     link and open-in-new-tab all behave natively. The data-ft-action
     attribute on them is classification/analytics only.
   - request-quotation is the one scripted action: it opens the on-site
     contact modal. Registered in <head> (first capture listener) so no
     legacy handler can compete. */
(function(){
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-ft-action="request-quotation"]') : null;
    if(!t) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if(typeof window.ftOpenContactModal === 'function') window.ftOpenContactModal();
  }, true);
})();

/* ==== ft-stable-router-v6-early ==== */
(function(){
  "use strict";
  var REQUEST_URL = 'https://tool.farmtree.earth/Identity/Account/Register';
  var PLATFORM_URL = 'https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F';

  function normalize(id){
    id = String(id || 'home').replace(/^#/, '').trim().toLowerCase();
    if(!id || id === '/' || id === 'homepage' || id === 'main' || id === 'main-content') return 'home';
    var map = {
      'solutions':'services',
      'solution':'services',
      'track-record':'track',
      'trackrecord':'track',
      'user-videos':'videos',
      'user-video':'videos',
      'cocoa-focus':'cocoa',
      'contact-us':'contact',
      'request-demo':'request',
      'request-a-demo':'request',
      'implementers':'ngos',
      'implementation':'ngos',
      'farmtree-platform':'platform'
    };
    return map[id] || id;
  }

  function pageExists(id){ return !!document.getElementById('page-' + id); }

  function setClasses(id){
    var isHome = id === 'home';
    document.body.setAttribute('data-current-page', id);
    document.body.classList.toggle('ft-page-home', isHome);
    document.body.classList.toggle('ft-page-inner', !isHome);
    document.body.classList.toggle('ft-current-home', isHome);
    document.body.classList.toggle('ft-current-inner', !isHome);
  }

  function render(id, options){
    options = options || {};
    id = normalize(id);

    if(id === 'platform'){
      if(options.external === true){ window.location.href = PLATFORM_URL; return; }
      /* keep the visual page available if a local page exists, otherwise open the platform */
      if(!pageExists(id)){ window.location.href = PLATFORM_URL; return; }
    }
    if(id === 'request' && options.external === true){ window.location.href = REQUEST_URL; return; }

    if(!pageExists(id)) id = 'home';
    setClasses(id);

    var isHome = id === 'home';
    document.querySelectorAll('main > section').forEach(function(section){
      var isPage = section.classList.contains('page');
      if(isPage){
        var active = section.id === 'page-' + id;
        section.classList.toggle('active', active);
        section.hidden = !active;
        section.style.display = active ? 'block' : 'none';
        section.setAttribute('aria-hidden', active ? 'false' : 'true');
      }else{
        section.hidden = !isHome;
        section.style.display = isHome ? '' : 'none';
        section.setAttribute('aria-hidden', isHome ? 'false' : 'true');
      }
    });

    var menu = document.getElementById('mobileMenu') || document.querySelector('.overlay-menu');
    if(menu){ menu.classList.remove('open','active','is-open'); }

    if(options.updateHash !== false){
      var newHash = '#' + id;
      if(location.hash !== newHash){
        /* user-initiated menu navigation preserves Back/Forward history;
           initial-load / reconciliation renders keep replaceState */
        if(options.push === true && history.pushState) history.pushState(null, '', newHash);
        else if(history.replaceState) history.replaceState(null, '', newHash);
        else location.hash = newHash;
      }
      try{ window.dispatchEvent(new CustomEvent('ft:navigated',{detail:{id:id}})); }catch(err){}
    }
    if(options.scroll !== false){ window.scrollTo({top:0, behavior: options.instant ? 'auto' : 'smooth'}); }
  }

  window.ftRenderPage = render;
  window.showPage = function(id){ render(id); };
  window.setPage = function(id){ render(id); };

  document.addEventListener('click', function(e){
    /* External destinations (Platform / Register / LinkedIn / YouTube) are native
       anchors — never intercept them, so they navigate and escape the WordPress
       Customizer preview iframe via target="_blank". */
    var extA = e.target.closest && e.target.closest('a[href]');
    if(extA && (extA.target === '_blank' || /^https?:\/\//i.test(extA.getAttribute('href') || ''))) return;
    var trigger = e.target.closest && e.target.closest('[data-page]');
    if(!trigger) return;
    var raw = trigger.getAttribute('data-page');
    var id = normalize(raw);
    var txt = (trigger.textContent || '').trim().toLowerCase();

/* [router-consolidation 2026-07] removed: early-router dead platform-external click branch */
    /* (CTA cleanup 2026-07) text-matched 'request/demo/book' redirect removed —
       demo CTAs now use the authoritative data-ft-action="request-demo". */

    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    render(id, {instant:false, push: !!trigger.closest('#mobileMenu')});
  }, true);

  window.addEventListener('hashchange', function(){
    var id = normalize(location.hash || 'home');
    if(id !== 'request') render(id, {updateHash:false, instant:true, scroll:true});
  });

  function initial(){
    var id = normalize(location.hash || 'home');
    render(id, {updateHash:true, instant:true, scroll:false});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initial);
  else initial();
  window.addEventListener('load', function(){ render(normalize(location.hash || document.body.getAttribute('data-current-page') || 'home'), {updateHash:false, instant:true, scroll:false}); });
})();
