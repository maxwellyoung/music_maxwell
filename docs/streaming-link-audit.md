# Streaming-link audit

**Checked:** 22 July 2026
**Method:** existing canonical artist links cross-checked against Songlink/Odesli's New Zealand catalogue response.

The public catalogue exposes a URL only when one is known. Core-service omissions are represented in `src/data/releases.ts` as `scheduled`, `unavailable`, or `unverified`; they are never silently treated as an available destination.

## Known exceptions

- `1kiss`: Spotify is present before release; Apple Music, YouTube, Tidal, and Pandora are marked scheduled.
- `Turn It Up`: Pandora was confirmed through Odesli; Tidal was not returned and is marked unavailable.
- `Cherry Pie / Lose U Too`: Spotify was not returned and is marked unavailable.
- `Dread!` and `No. 5`: Tidal was not returned and is marked unavailable.
- `Only Romantics` and `Daydreamer`: Pandora was not returned and is marked unavailable.

Recheck scheduled destinations after the release is live. Do not invent URLs from search-result pages.
