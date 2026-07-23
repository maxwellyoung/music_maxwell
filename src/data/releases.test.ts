import assert from "node:assert/strict";
import test from "node:test";

import { createReleaseMetadata } from "../lib/releaseMetadata.ts";
import { createPublicReleaseManifest } from "../lib/releaseManifest.ts";
import {
  lyricLineAt,
  oneKissTimedHook,
  wordProgress,
} from "./oneKissExperience.ts";
import timedLyrics, {
  findTimedLyrics,
  timedLyricsStaticAudit,
  validateTimedLyricsRecord,
} from "./timedLyrics.ts";
import { getTimedLyricFrame } from "../lib/timedLyrics.ts";
import releases, {
  coreStreamingServices,
  getReleaseBySlug,
  getStreamingAvailability,
  getStreamingDestinations,
  releaseRooms,
  validateReleaseCatalogue,
} from "./releases.ts";

test("the public catalogue has stable unique release identities", () => {
  assert.equal(releases.length, 17);
  assert.equal(new Set(releases.map((release) => release.slug)).size, 17);
  assert.equal(getReleaseBySlug("turn-it-up")?.title, "Turn It Up");
  assert.deepEqual(validateReleaseCatalogue(), []);
});

test("only releases with an earned interaction are promoted as worlds", () => {
  assert.deepEqual(
    releaseRooms.map((release) => release.slug),
    ["1kiss", "wintour", "turn-it-up"],
  );
});

test("core streaming omissions are explicit rather than silent", () => {
  const unverified = releases.flatMap((release) =>
    coreStreamingServices
      .filter(
        (service) =>
          getStreamingAvailability(release, service).status === "unverified",
      )
      .map((service) => `${release.slug}:${service}`),
  );

  assert.deepEqual(unverified, []);
  assert.equal(
    getStreamingAvailability(getReleaseBySlug("1kiss")!, "appleMusic").status,
    "available",
  );
});

test("1kiss exposes only exact verified streaming destinations", () => {
  const release = getReleaseBySlug("1kiss")!;

  assert.deepEqual(
    getStreamingDestinations(release).map(({ service, label, href }) => ({
      service,
      label,
      href,
    })),
    [
      {
        service: "spotify",
        label: "Spotify",
        href: "https://open.spotify.com/album/6wfYz79P1goRvwJxX6dI7n",
      },
      {
        service: "apple_music",
        label: "Apple Music",
        href: "https://music.apple.com/nz/album/1kiss/6783834681?i=6783834682",
      },
      {
        service: "youtube_music",
        label: "YouTube Music",
        href: "https://music.youtube.com/watch?v=nyYu3LQ9b50",
      },
      {
        service: "tidal",
        label: "TIDAL",
        href: "https://tidal.com/track/536251647",
      },
      {
        service: "deezer",
        label: "Deezer",
        href: "https://www.deezer.com/track/4110752161",
      },
    ],
  );
  assert.equal(
    getStreamingAvailability(release, "youtube").status,
    "available",
  );
  assert.equal(getStreamingAvailability(release, "tidal").status, "available");
  assert.equal(
    getStreamingAvailability(release, "pandora").status,
    "scheduled",
  );
});

test("release metadata is generated from the catalogue identity", () => {
  const release = getReleaseBySlug("1kiss")!;
  const metadata = createReleaseMetadata(release, {
    description: "1kiss by Maxwell Young.",
  });

  assert.equal(metadata.alternates?.canonical, "/1kiss");
  assert.equal(metadata.openGraph?.url, "/1kiss");
  assert.deepEqual(metadata.twitter?.images, ["/artworks/1kiss.jpg"]);
});

test("the downstream manifest exposes only stable public release data", () => {
  const manifest = createPublicReleaseManifest();
  const oneKiss = manifest.releases.find((release) => release.id === "1kiss")!;

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.releases.length, 17);
  assert.equal(oneKiss.slug, "1kiss");
  assert.equal(oneKiss.publication.lyrics, "public");
  assert.equal(oneKiss.publication.films, "none");
  assert.equal(oneKiss.media.films.length, 0);
  assert.deepEqual(
    oneKiss.streamingDestinations.map(({ service }) => service),
    ["spotify", "apple_music", "youtube_music", "tidal", "deezer"],
  );
  assert.equal(
    oneKiss.media.audioMasterSha256,
    "ad136da37bf6ba9ecfd7dd2603ed807355fcbbdfdfe1456c00aabfb15951efde",
  );
  assert.equal(JSON.stringify(manifest).includes("/Users/"), false);
});

test("the 1kiss excerpt resolves lyric lines and word fills from real cue time", () => {
  assert.equal(lyricLineAt(0), 0);
  assert.equal(lyricLineAt(3.4), 1);
  assert.equal(lyricLineAt(4), -1);
  assert.equal(lyricLineAt(11.3), 6);
  assert.equal(lyricLineAt(13), -1);

  const midas = oneKissTimedHook[0].words[3];
  assert.equal(wordProgress(1, midas), 0);
  assert.equal(wordProgress(2.1, midas), 1);
  assert.ok(wordProgress(1.6, midas) > 0);
});

test("a timed lyric frame exposes previous, active, and next lines", () => {
  const frame = getTimedLyricFrame(oneKissTimedHook, 5.6);

  assert.equal(frame.previous?.text, "one kiss");
  assert.equal(frame.active?.text, "i couldn’t wait");
  assert.equal(frame.next?.text, "now it’s priceless");
  assert.deepEqual(
    frame.words.map((word) => word.state),
    ["complete", "active", "pending"],
  );
});

test("timed lyrics are enabled only for the exact aligned preview and lyric version", () => {
  assert.equal(
    findTimedLyrics({
      slug: "1kiss",
      previewUrl: "/1kiss/1kiss-hook.m4a",
      lyricVersion: "1kiss",
    })?.lines.length,
    7,
  );
  assert.equal(
    findTimedLyrics({
      slug: "1kiss",
      previewUrl: "/1kiss/another-cut.m4a",
      lyricVersion: "1kiss",
    }),
    undefined,
  );
});

test("every enabled timeline stays within its exact preview boundary", () => {
  assert.deepEqual(
    timedLyrics.flatMap((record) => validateTimedLyricsRecord(record)),
    [],
  );
});

test("every lyric-bearing preview is explicitly timed or intentionally static", () => {
  const eligible = releases
    .filter((release) => release.previewUrl && release.lyrics)
    .map((release) => release.slug)
    .sort();
  const decided = [
    ...timedLyrics.map((record) => record.slug),
    ...timedLyricsStaticAudit.map((record) => record.slug),
  ].sort();

  assert.deepEqual(decided, eligible);
});
