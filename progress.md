Original prompt: Implement the full archive to artefact sheet to release world system end to end, including restrained world markers, factual release sheets, release-specific material language, and bespoke interactions for Turn It Up, 1kiss, and Wintour.

## Decisions

- Keep the archive calm; expressive behavior belongs in sheets and release rooms.
- Remove the entire In company testimonial/cosign section. Maxwell found it cringe and embarrassing; do not replace it with another social-proof strip.
- Relationships with other artists belong as factual credits inside relevant releases.
- Do not invent BPM, key, collaborators, or production facts. Unknown values stay absent.

## Progress

- Removed the In company section from `CollectableGrid.tsx`.
- Added a shared release-world registry and material-aware room shell.
- Added verified factual sheet data for 1kiss, Wintour, and Turn It Up. Apple Music reports Turn It Up at 2:17.
- Archive cards with rooms now carry a small, persistent `world ↗` marker.
- Song sheets now inherit signal, cart-grid, editorial, field-note, or air material tokens and render structured factual details.
- Built the deterministic Turn It Up cart/can canvas game with keyboard, pointer, fullscreen, text-state, and time-step hooks.
- Built the accessible Wintour red crop comparator from the two existing artwork files.
- Added full Turn It Up and Wintour release rooms with factual metadata, listening links, films, credits, and their bespoke interactions.
- Deterministic browser harness confirmed the cart game starts, accepts pointer and keyboard lane input, updates text state, and reaches the loss state without console errors. Adjusted the canvas HUD after screenshot inspection.
- Deterministic QA also reached the 7/7 win state with zero misses and zero console errors.
- Added Wintour lyrics from the repo's existing Wintour source, added both new rooms to the sitemap, and moved every existing room onto the shared shell.
- Removed the leftover unsourced Flying promotional sentence; the section now contains release facts only.

## TODO

- None. Local implementation and QA are complete. Production deployment remains intentionally unperformed pending an explicit deploy request.
