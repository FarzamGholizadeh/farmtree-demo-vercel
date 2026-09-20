# Platform learning hub — bounded release

Baseline: 6a63d14f1a976efac25dd0f0d6e3185e27d22050.
Scope: /user-videos/ presentation, verified local JPEG posters, and one exact
Privacy Policy paragraph correction describing optional YouTube playback.
No Content plugin, managed manifest, stored Page, publication or option changes.

## Sources

The official @farmtree8168 Videos tab contains 27 public videos, with no further
pagination. 25 Platform/instruction videos are included. Two field documentaries
are excluded, not deleted. IDs, titles, duration labels and thumbnail URLs are
recorded in PLATFORM-VIDEO-SOURCES.json. Each official watch page reported the
same channel ID and playable-in-embed status. Descriptions are concise paraphrases
of official descriptions and the historical farmtree.earth/user-videos page.
Earlier walkthroughs are labelled explicitly. No transcripts/dates were invented;
no VideoObject is emitted without complete verified metadata.

## Editing without source-code changes

In WordPress, open Appearance → Editor → Design → Templates and select the
User Videos page template (page-user-videos). Use List View to find the
“Explore all Platform videos” group and its lesson-card groups.

- Heading: lesson title.
- Module paragraph: grouping.
- Description paragraph: lesson description.
- Duration paragraph: optional verified time; remove if unknown.
- “Watch on YouTube” link: exact HTTPS watch URL or youtu.be URL.
- Image block: replace the poster through the ordinary Media Library interface.
  Keep posters in the FarmTree Media Library to avoid third-party thumbnail requests.
- Reorder, duplicate or remove a complete lesson-card Group using List View.

Keep the existing CSS classes when duplicating a card. The URL supplies the
video ID. Navigation and the active player are derived from these editable
blocks, not a second JavaScript inventory. A Site Editor save creates a normal
WordPress template customization; runtime defaults never overwrite that content.
The ordinary Page body is not the library. No user accounts/progress tracking
or additional CPT/database migration are introduced.

## Privacy and playback

Posters are first-party theme assets. No MP4 files were downloaded. No third-party
requests occur before “Load YouTube player.” Only one privacy-enhanced iframe is
created, with autoplay=0 and a meaningful title; switching destroys it. The exact
YouTube backlink remains available if embedding fails. Loading the player is
explicitly disclosed as sending technical request information to YouTube/Google.

The theme's exact-match paragraph filter replaces only the existing false
“does not embed those services” statement on /privacy/. It does not rewrite or
persist legal text. This feature disclosure is coupled to the runtime and rolls
back with it. Other existing policy paragraphs are unchanged.

## Validation and release

Local WordPress: isolated port 8890, not the existing workspace fixture.
Gutenberg: 25 valid core-block lesson cards/images/links and valid serialization.
Browser: 320/360/390/414/768/1024/1440/1920; every lesson selected, previous/next,
keyboard, no pre-load third-party request, real YouTube playback, zero overflow
or duplicate IDs, scoped WCAG A/AA axe checks, reduced-motion operation.
All poster URLs and exact original backlinks checked; no fake progress states.
Generated evidence and screenshots live in ignored qa/video-hub/.
The classroom reserves space before JavaScript enhancement to prevent the
overview jumping during initial loading. No-script visitors retain the card grid
and exact YouTube links; the reserved space is removed when scripting is disabled.

Release uses the existing theme-only checksum/state gates, fresh off-webroot
backup and rollback-protected directory swap. No reconciliation or APPLY.
Production QA must pass before completion. Existing workspaces remain intact.
