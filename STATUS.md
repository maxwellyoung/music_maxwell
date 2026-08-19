# Status

Last updated: 2026-07-23

## Current State

- Music Maxwell remains the sensitive public music-site lane.
- The deployed implementation was recovered onto `codex/music-site-consolidation-20260722` before consolidation work began.
- The public model is archive → artefact sheet → optional release world.
- Only 1kiss, Wintour, and Turn It Up are declared release worlds.
- Listener Notes remains available by direct route but is not promoted globally while empty.

## Next Useful Move

- Keep Video Lab and other downstream tools on the versioned `/releases/manifest.json` boundary.
- Reconcile the separate dirty `preview` checkout only after this branch is safely pushed.

## Blockers / Risks

- A second dirty checkout still contains an alternative implementation and must not be overwritten casually.
- Env recovery history means secrets should be treated carefully and rotated before production use if stale.
- Public music pages must not leak unreleased release planning.

## Verification

- `pnpm release:check` passes on Node 24.14.0: 5 catalogue/manifest tests, TypeScript, ESLint, and the optimized Next.js build.
- Production-mode local requests return 200 for `/`, `/1kiss`, `/turn-it-up`, `/wintour`, `/releases/manifest.json`, and `/sitemap.xml`.
- Browser QA covers the archive year filters, the Videostar/Cleopatra lyrics selector, 1kiss film playback, the Turn It Up cart run, the Wintour crop comparator, and mobile archive/sheet layouts.
- The manifest contains 17 stable public release records. The 1kiss social-film derivatives remain archived but are no longer exposed in its release room or manifest.

## Notes For Codex

- Read `AGENTS.md` first.
- Use Liner for release truth; use this repo for the public site implementation.
- One production site, one clean branch, one typed release registry; never deploy from a dirty worktree.
