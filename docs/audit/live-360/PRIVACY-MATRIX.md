# Privacy/data-flow evidence — in progress

This is a technical consistency check, not legal advice or legal approval. The
approved Privacy/Terms bodies remain unchanged. No new legal basis, controller
identity, processor contract, retention period or jurisdiction is invented.

| Surface | Actual/source evidence | Coverage / remaining evidence |
|---|---|---|
| Ordinary visitors | Fresh anonymous browser on Homepage, Contact, Privacy, Terms and Team: same-origin requests; no cookies/localStorage/forms/iframes | VERIFIED five-route sample; all-route network evidence still pending |
| Session presentation state | `wpEmojiSettingsSupports` functional session storage observed; approved policy also describes possible metric-animation session state | No visitor-entered information observed; not a claim that authenticated storage is empty |
| Contact | Mailto-only public actions; no contact-form backend in Native; contact destination info@farmtree.earth | Sample/source verified; email processing outside WordPress requires organisation evidence |
| Newsletter/comments | No subscription UI found; current40public entities comments closed, zero stored comments | Future WordPress default remains open; existing content not changed |
| Authentication | Public registration disabled; administrative accounts/sessions and one expired temporary grant exist in aggregate | Cookie flags, actual credential revocation, MFA and administrative policy remain unverified |
| AI | FT Bot disabled by exact state gate; no public widget or public browser AI requests in sample | Installed provider plugin does not imply public processing; administrative integrations require separate coverage |
| Fonts/assets | Native fonts and documentary assets self-hosted; no Google font request in sample | Source/runtime consistency verified within inspected scope |
| External destinations | Linked Platform, LinkedIn, YouTube, privacy-conscious map and editorial sources | Following links sends a request to destination; link presence alone is not an embedded third-party request |
| Hosting | Vimexx integration and access-log/AWStats history evidenced; backups outside webroot | Exact retention, access policy, encryption, contracts and deletion/restore practice require host/company evidence |
| Telemetry | SeedProd usage telemetry and Extendify Insights opt-out reflected in protected settings | Site Assistant login/partner administrative hooks are not all proven disabled by Insights opt-out; no public tracking observed |
| Professional data | Public Team names/roles/biographies/portraits and outbound professional links | Publication permissions/organisational lawful-basis evidence not supplied by runtime |
| New motion controls | Local source stores independent pause only in memory; no cookies/storage/network added | Production verification pending motion release |

The current published policy explicitly distinguishes mailto contact,
administrative authentication, public professional information, host logs/backups,
external links and disabled public AI. Observed samples support those technical
distinctions. They do not prove all legal/organisational statements or establish
fixed retention. No cookie-consent legal conclusion is inferred solely from a
five-route sample or the absence of a banner.

Evidence: `qa/live-360/security/browser.json`,
`qa/live-360/security/plugin-advisories.md`, independent security assessment,
`wordpress/wp-content/plugins/farmtree-content/data/english-pages.json`,
and RELEASE-01 protected-state checks. No personal account names, tokens,
credentials or raw request logs are included.
