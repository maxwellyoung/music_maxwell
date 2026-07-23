# 1kiss public evidence and publication decision

**Reviewed:** 23 July 2026

## Factual evidence

The public 1kiss facts are retained because they match the campaign's canonical `CREDITS-LYRICS.md` record. That record is marked verified in the campaign execution board and aligned to the lyric sheet supplied on 16 June.

| Claim | Public value | Evidence state |
| --- | --- | --- |
| Release date | 24 July 2026 | Campaign credits record; Spotify delivery verified in the execution board |
| Runtime | 2:03 | Campaign delivery metadata and press record |
| Tempo | 136 BPM | Campaign credits record |
| Key centre | F# | Campaign credits record |
| Content rating | Clean | Campaign credits record |

The approved WAV container measures 124.316563 seconds. That source-file duration is recorded separately from the 2:03 delivery runtime and does not override the public DSP metadata.

## Publication decision

The following material is intentionally public in the 1kiss release room:

- the full approved lyrics;
- the 18-second homepage excerpt;
- release artwork, factual credits, and delivery metadata.

The four designed vertical films were removed from the release room and public manifest on 23 July. They remain recoverable campaign exports, but they are not part of the lasting song artefact and are no longer linked from the public experience.

This decision does **not** publish the full WAV master, stems, the unreleased full-length video source, private campaign planning, contact lists, budgets, or unapproved press drafts.

The stable machine-readable public boundary is:

`/releases/manifest.json`

Downstream tools such as Video Lab should consume that versioned manifest rather than import website components or scrape route markup. The contract is:

- `schemaVersion` controls the response shape;
- `catalogueVersion` identifies the catalogue snapshot;
- `releases[].id` and `releases[].slug` are the same stable public identity;
- `publication` is the explicit public/private decision for lyrics and films;
- `streaming` distinguishes available, scheduled, and unavailable services;
- `media` exposes only public derivative paths and the approved master checksum, never a local master path.
