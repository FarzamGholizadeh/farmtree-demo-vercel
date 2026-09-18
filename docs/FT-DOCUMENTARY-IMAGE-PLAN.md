# Approved documentary photograph placement

The numbered source manifest is `config/farmtree-documentary-images.json`.
It preserves upload order, not the mismatched descriptions in the brief after
image 06. Every alt describes visible content without assigning identities,
locations, project membership or measured outcomes.

## Placement map (before asset preparation)

| Image | Placement | Purpose |
| --- | --- | --- |
| 15, 11, 19, 20 | Existing Homepage four-slide hero | Replace illustrative photography, retain layout and motion |
| 20 | Platform, below introduction | Field layout context, not a product screenshot |
| 10, 12 | Solutions, contextual editorial figures | Plant observation and varied field conditions |
| 01, 08 | Proof Stories index, after introduction/list | Documentary field and harvest context, not evidence for a particular case study |
| 02, 17 | Customer Segments index, after introduction/list | Field visits and mixed production context |
| 14 | News & Insights index, after article listing | Field context, not falsely attributed to a news event |
| 03–07, 09, 13, 16, 18 | Reserved, not shipped | Avoid redundant imagery or unsupported story associations |

Image 05 remains unused: the brief limits its placement to the inside of a
relevant Proof Story, and no such attribution is established. Existing individual
Proof Story content, portraits, news thumbnails, logos and Platform demonstration
remain unchanged. Selection is deliberate; no decorative gallery is added.

## Export specification

Selected images receive 1920×1080 hero, 1200×900 content, 800×800 card and
480×360 preview exports in AVIF, WebP and JPEG. Crops are deterministic and
originals remain untouched; no retouching, colour changes, invented content,
outpainting or object removal. EXIF/location metadata is not shipped.
The first Homepage image is eager/high priority. All other images are lazy,
with intrinsic dimensions and responsive sources. Core Image blocks keep alt
text/captions editable; the theme supplies responsive picture sources at render
time only for approved documentary filenames.

## Release boundary

This is local release preparation only. No push, production content update or
deployment is authorized by the photographic integration request. Existing
managed ownership/conflict rules remain unchanged; a future release requires
a fresh reviewed dry-run and explicit deployment approval.

## Final export and placement table

Every selected row has hero (1920×1080), content (1200×900), card (800×800)
and preview (480×360) variants, each in AVIF/WebP/JPEG. The basename below is
followed by `-hero`, `-content`, `-card` or `-preview` and the format extension.
All edits are crop/compression only, with metadata stripped; no scene alteration.

| Image | Page / section | Filename basename | Exact alt text |
| --- | --- | --- | --- |
| 01 | proof-stories: Field context | farmtree-dryland-field-context | Two people standing beside vegetation in an open, rocky field |
| 02 | customer-segments: Field visits | farmtree-community-field-visit | People walking through dry crop stalks beneath scattered trees |
| 08 | proof-stories: Harvest context | farmtree-onion-harvest-under-trees | Two people seated beside harvested onions under trees |
| 10 | solutions: Field observation | farmtree-plant-observation | Two people examining long green pods on a plant |
| 11 | home: Hero slide 2 | farmtree-agroforestry-field-system | Green ground vegetation growing between rows of small trees |
| 12 | solutions: Landscape context | farmtree-dryland-tree-landscape | Scattered trees and patches of green vegetation in a sandy field |
| 14 | blog: Editorial field context | farmtree-green-field-climate-context | Green crops bordered by trees beneath an overcast sky |
| 15 | home: Hero slide 1 | farmtree-integrated-agroforestry-cropping | Tall green crops growing between leafy trees |
| 17 | customer-segments: Mixed production context | farmtree-mixed-garden-papaya | Papaya trees, mixed crops and a small shelter in a garden with people |
| 19 | home: Hero slide 3 | farmtree-mixed-agricultural-landscape | Trees and low crops on sandy ground beside rural structures |
| 20 | home,platform: Hero slide 4; Platform field-layout context | farmtree-structured-field-plots | Rectangular green crop beds divided by earthen paths and small trees |

Reserved originals (no generated assets or runtime inclusion): 03, 04, 05, 06,
07, 09, 13, 16 and 18. Their proposed future roles remain in the JSON manifest.

## Reproduction and verification

Run `npm ci`, then `npm run images:prepare -- /absolute/source/directory`.
Original filename mapping is in the plan; source hashes and output hashes are
in `config/farmtree-documentary-exports.json`. Both files stay outside the
deployable webroot. Run `npm test` to check all 132 exports, dimensions, hashes,
metadata removal, budgets and release classification. The 132 variants total
23,117,325 bytes; browsers fetch a selected size/format, not the complete set.
The first hero AVIF is 221,107 bytes desktop and 69,528 bytes mobile.

Run `npm run wp:bootstrap` only for the local loopback fixture, then
`npm run wp:verify` and `npm run wp:verify:anonymous`. The anonymous suite also
checks all 12 picture placements on six pages. Core Image blocks retain editable
image URLs, alt text and captions; layout and responsive source generation are
theme-controlled. Replacing a photo with ordinary Media Library content bypasses
the documentary handler and leaves native WordPress behavior intact.

Local browser evidence lives in ignored `qa/screenshots/documentary-pages` and
`qa/screenshots/documentary-home`. The 54-view photo matrix covers 320, 375, 390,
430, 768, 1024, 1280, 1440 and 1920 px. The WordPress editor parser verifies all
12 documentary core Image blocks. Production verification remains pending.

## Review and rollback

Generated managed-content changes are restricted to Home, Platform, Solutions,
Proof Stories index, Customer Segments index and Blog. No entity slug, publication
status, legal text, individual Proof Story, News post, team record or reconciler
ownership policy changes. Carousel accessibility labels match the new scenes.
A future approved deployment must checksum-stage the entire audited runtime and
review its new managed-content dry-run before applying these six page updates.
Rollback requires the previous runtime artifact and pre-apply six-page snapshots;
reverting code alone does not restore saved WordPress page bodies.
