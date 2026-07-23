import assert from "node:assert/strict";
import test from "node:test";

import { createReleaseMetadata } from "../lib/releaseMetadata.ts";
import { createPublicReleaseManifest } from "../lib/releaseManifest.ts";
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
    getStreamingAvailability(getReleaseBySlug("1kiss")!, "appleMusic")
      .status,
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
  assert.equal(
    oneKiss.media.audioMasterSha256,
    "ad136da37bf6ba9ecfd7dd2603ed807355fcbbdfdfe1456c00aabfb15951efde",
  );
  assert.equal(JSON.stringify(manifest).includes("/Users/"), false);
});
