# Globe connection-route removal

Baseline: `d904f00bbddecb2be3980bcf8ac82fac6c6a5552`.

Removed only the connection-pair dataset, spherical route interpolation, route
state, dashed route painter and its initialization/draw calls from Native JS.
The geographic TopoJSON arcs remain: they describe land, not connections.
The projection altitude argument remains because location markers use it.
No route-only CSS existed. No CSS, content, images or other runtime file changed.

The regression test compares the entire source to the baseline with precisely
those removals, preserving all 22 locations, marker rendering and interactions.
Local browser checks passed at 390, 768, 1440 and 1920 pixels: rendered dots,
zero connecting line/dash calls, both pointer/touch axes, four keyboard arrows,
reduced-motion keyboard interaction, zero console errors, overflow or duplicate
IDs. Local JS is served over the existing WordPress fixture without mutating it.
Generated screenshots and reports are excluded under `qa/globe-arcs/`.

Release scope is theme-only, using the existing checksum/state-gated rollback
runner. No reconciler APPLY or database mutation is authorized. Production QA
must run against the deployed bytes at 390, 1440 and 1920 before completion.
