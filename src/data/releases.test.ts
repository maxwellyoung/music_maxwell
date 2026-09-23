import assert from "node:assert/strict";
import test from "node:test";

import sitemap from "../app/sitemap.ts";
import {
  createReleaseDescription,
  createReleaseMetadata,
  homepageDescription,
} from "../lib/releaseMetadata.ts";
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
  releaseRooms,
  validateReleaseCatalogue,
} from "./releases.ts";

test("the public catalogue has stable unique release identities", () => {
  assert.equal(releases.length, 17);
  assert.equal(new Set(releases.map((release) => release.slug)).size, 17);
  assert.equal(getReleaseBySlug("turn-it-up")?.title, "Turn It Up");
  assert.deepEqual(validateReleaseCatalogue(), []);
});

test("the public catalogue is ordered newest first", () => {
  const releaseTime = (releaseDate: string | undefined) => {
    assert.ok(releaseDate, "every public release has a release date");
    const preciseDate = /^\d{4}$/.test(releaseDate)
      ? `December 31, ${releaseDate}`
      : releaseDate;
    const time = Date.parse(preciseDate);
    assert.ok(Number.isFinite(time), `invalid release date: ${releaseDate}`);
    return time;
  };
  const releaseTimes = releases.map((release) =>
    releaseTime(release.releaseDate),
  );

  for (let index = 1; index < releaseTimes.length; index += 1) {
    assert.ok(
      releaseTimes[index - 1]! >= releaseTimes[index]!,
      `${releases[index - 1]!.slug} must not precede a newer release`,
    );
  }
  assert.equal(releaseTimes[0], Math.max(...releaseTimes));
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

test("release metadata is generated from the catalogue identity", () => {
  const release = getReleaseBySlug("1kiss")!;
  const metadata = createReleaseMetadata(release, {
    description: "1kiss by Maxwell Young.",
  });

  assert.equal(metadata.alternates?.canonical, "/r/1kiss");
  assert.equal(metadata.openGraph?.url, "/r/1kiss");
  assert.deepEqual(metadata.twitter?.images, ["/artworks/1kiss.jpg"]);

  const releaseWithoutPath = getReleaseBySlug("flying")!;
  const fallbackMetadata = createReleaseMetadata(releaseWithoutPath, {
    description: createReleaseDescription(releaseWithoutPath),
  });
  assert.equal(fallbackMetadata.alternates?.canonical, "/r/flying");
  assert.equal(fallbackMetadata.openGraph?.url, "/r/flying");
});

test("public metadata descriptions are factual and useful", () => {
  assert.ok(homepageDescription.length >= 120);
  assert.ok(homepageDescription.length <= 160);
  for (const fact of [
    "official Maxwell Young release archive",
    "lyrics",
    "artwork",
    "credits",
    "listening links",
  ]) {
    assert.ok(homepageDescription.includes(fact));
  }

  for (const release of releases) {
    const description = createReleaseDescription(release);
    assert.ok(description.length >= 120, `${release.slug} is too short`);
    assert.ok(description.length <= 160, `${release.slug} is too long`);
    assert.ok(description.includes(release.title));
    assert.ok(description.includes("Maxwell Young"));
    assert.ok(description.includes("artwork"));
    assert.ok(description.includes("lyrics"));
    assert.ok(description.includes("listening links"));
    assert.equal(description.includes("credits"), Boolean(release.credits));
  }
});

test("sitemap contains canonical public reads and excludes private or write routes", () => {
  const urls = sitemap().map((entry) => entry.url);
  const count = (url: string) => urls.filter((candidate) => candidate === url).length;
  const origin = "https://www.maxwellyoung.info";

  for (const path of [
    "/artwork",
    "/artwork/sneakin-drinks",
    "/questions",
    "/forum",
  ]) {
    assert.equal(count(`${origin}${path}`), 1, path);
  }
  for (const release of releases) {
    const path = release.releasePath ?? `/r/${release.slug}`;
    assert.equal(count(`${origin}${path}`), 1, path);
  }
  for (const path of [
    "/index-of-everything",
    "/forum/new",
    "/login",
    "/settings",
    "/lab",
    "/auth/signin",
  ]) {
    assert.equal(count(`${origin}${path}`), 0, path);
  }
  assert.equal(urls.some((url) => url.includes("?")), false);
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
