<?php if (!defined('ABSPATH')) exit; ?>
<div role="status" aria-label="Loading FarmTree website" class="ft-site-loader" id="ftSiteLoader">
<div class="ft-loader-core">
<div class="ft-loader-logo"><picture><source type="image/webp" srcset="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.webp'); ?>"/><img width="320" height="117" alt="" aria-hidden="true" loading="eager" decoding="async" src="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.png'); ?>"/></picture></div>
</div>
</div>

<div class="site">
<header class="header">
<div class="header-inner">
<button type="button" class="logo-btn" data-page="home"><span class="logo-wrap"><picture><source type="image/webp" srcset="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.webp'); ?> 320w, <?php echo farmtree_asset('brand/farmtree-logo-primary-640.webp'); ?> 640w, <?php echo farmtree_asset('brand/farmtree-logo-primary-1024.webp'); ?> 1024w" sizes="110px"/><img src="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.png'); ?>" srcset="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.png'); ?> 320w, <?php echo farmtree_asset('brand/farmtree-logo-primary-640.png'); ?> 640w, <?php echo farmtree_asset('brand/farmtree-logo-primary-1024.png'); ?> 1024w" sizes="110px" width="320" height="117" alt="FarmTree homepage" loading="eager" decoding="async"/></picture></span></button>
<nav aria-label="Main navigation" class="nav nav-minimal">
<button type="button" class="nav-item" data-page="home">Home</button>
<button type="button" class="nav-item" data-page="request">Design tool</button></nav>
<div class="header-actions">
<button type="button" class="pill contact" data-i18n="contact" data-page="contact">Contact</button>
<a class="pill tech" target="_blank" rel="noopener noreferrer" data-ft-action="platform-login" href="https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F">FarmTree Platform</a>
<div role="group" aria-label="Language switcher" class="lang-switcher">
<button aria-expanded="false" aria-haspopup="true" aria-label="Switch language" class="lang-toggle" type="button">
<span class="globe">◎</span>
<span id="langLabel">EN</span>
</button>
<div class="lang-panel" role="menu">
<button class="lang-option active" data-lang="en" role="menuitem" type="button">English</button>
<button class="lang-option" data-lang="nl" role="menuitem" type="button">Nederlands</button>
<button class="lang-option" data-lang="de" role="menuitem" type="button">Deutsch</button>
</div>
</div>
<button class="menu-btn" id="openMenu" type="button" aria-label="Open navigation menu">☰</button>
</div>
</div>
</header>
<div class="mobile-menu" id="mobileMenu">
<div class="mobile-top">
<button type="button" class="logo-btn" data-page="home"><span class="logo-wrap"><picture><source type="image/webp" srcset="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.webp'); ?> 320w, <?php echo farmtree_asset('brand/farmtree-logo-primary-640.webp'); ?> 640w, <?php echo farmtree_asset('brand/farmtree-logo-primary-1024.webp'); ?> 1024w" sizes="110px"/><img src="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.png'); ?>" srcset="<?php echo farmtree_asset('brand/farmtree-logo-primary-320.png'); ?> 320w, <?php echo farmtree_asset('brand/farmtree-logo-primary-640.png'); ?> 640w, <?php echo farmtree_asset('brand/farmtree-logo-primary-1024.png'); ?> 1024w" sizes="110px" width="320" height="117" alt="FarmTree homepage" loading="eager" decoding="async"/></picture></span></button>
<button class="lang-btn ft-menu-close" id="closeMenu" type="button" aria-label="Close menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
<div class="mobile-grid ft-bento">
<div class="mobile-card ft-b-main"><h4>Main</h4><button type="button" data-page="home">Home</button><button type="button" data-page="services">Solutions</button><button type="button" data-page="track">Track Record</button></div>
<div class="mobile-card ft-b-farmtree"><h4>FarmTree</h4><a target="_blank" rel="noopener noreferrer" data-ft-action="platform-login" href="https://tool.farmtree.earth/Identity/Account/Login?ReturnUrl=%2F">Platform</a><button type="button" data-page="videos">User Videos</button><button type="button" data-page="cocoa">Cocoa Focus</button><button type="button" data-page="case-studies">Case Studies</button><button type="button" data-page="investors">For Investors</button><button type="button" data-page="ngos">For Implementers</button></div>
<div class="mobile-card ft-b-company"><h4>Company</h4><button type="button" data-page="team">Team</button><button type="button" data-page="vacancies">Vacancies</button><button type="button" data-page="contact">Contact us</button><button type="button" data-page="blog">Blog</button></div>
<div class="mobile-card ft-b-segments"><h4>Customer segments</h4>
<div class="ft-menu-seg-grid">
<button type="button" data-page="segment-advisors">Advisors</button>
<button type="button" data-page="segment-development-banks-donors">Development Banks &amp; Donors</button>
<button type="button" data-page="segment-ngos-conservation">NGOs &amp; Conservation</button>
<button type="button" data-page="segment-nbs-carbon">NbS &amp; Carbon Developers</button>
<button type="button" data-page="segment-mrv-esg">MRV &amp; ESG Platforms</button>
<button type="button" data-page="segment-government-parastatals">Government &amp; Parastatals</button>
<button type="button" data-page="segment-industry-associations">Industry Associations &amp; MSPs</button>
<button type="button" data-page="segment-large-agri-corporates">Large Agri-Corporates</button>
<button type="button" data-page="segment-social-enterprise">Social Enterprise</button>
<button type="button" data-page="segment-implementation-organisations">Implementation Organisations</button>
</div></div>
<div class="mobile-card ft-b-forms"><h4>Forms &amp; Legal</h4><a target="_blank" rel="noopener noreferrer" data-ft-action="request-demo" href="https://tool.farmtree.earth/Identity/Account/Register">Request a demo</a><button type="button" data-page="acknowledgements">Acknowledgements</button><button type="button" data-page="licenses">Licenses</button></div>
</div>
</div>
