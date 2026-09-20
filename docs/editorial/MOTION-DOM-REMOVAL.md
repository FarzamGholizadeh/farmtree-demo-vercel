# Motion UI source removal

Scoped successor to deployed `ffd494f6342ac34209d684f5b4b59112c37caa94`.
Removes the shared button/wrapper/ID factory, globe directional button creation,
associated listeners and all obsolete control CSS, including Hero dot offset
that reserved room for the removed control. No hidden replacement panel exists.

Existing motion surfaces are keyboard focusable with a visible focus ring and
Space stop/restart support; no added element is required. Globe arrows operate
on the canvas itself. Reduced-motion callbacks remain effective. Hero arrows,
dots and swipe retain their original handlers and responsive breakpoints. Hero
first-input autoplay gate and the entire counter initializer remain unchanged.
No Content, managed manifest, route, publication or visibility configuration change.

The old button-only regression fixtures are replaced by the focused DOM-removal
harness. It checks six local widths and three production widths, three loads per
width, counter re-entry, Hero navigation/swipe, globe horizontal/vertical keyboard
and pointer/touch rotation, Platform poster, rails and field quotes, absence of
removed DOM, reduced motion, console and overflow. Local candidate JS/CSS are
response overrides; live mode has no overrides. Reports/screenshots are retained
under ignored `qa/motion-dom-removal/`. Physical-device and full AT certification
are not claimed. Existing anonymous WP smoke and theme deployment gates apply.

Attempt limit: at most two production remediation cycles. Fresh backup and exact
artifact/public-state checks gate deployment. No reconciliation or database writes.
Both original IDE and prior isolated News workspaces remain untouched.
