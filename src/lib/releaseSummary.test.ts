import assert from "node:assert/strict";
import { test } from "node:test";
import releases from "../data/releases.ts";
import { summarizeRelease } from "./releaseSummary.ts";

test("homepage summaries preserve release identity without shipping lyrics, credits or platform metadata", () => {
  for (const release of releases) {
    const summary = summarizeRelease(release);
    assert.equal(summary.slug, release.slug);
    assert.equal(summary.title, release.title);
    assert.equal(summary.artwork, release.artwork);
    assert.deepEqual(Object.keys(summary).sort(), [
      "artwork",
      "previewUrl",
      "releaseDate",
      "releaseType",
      "slug",
      "title",
    ]);
  }
  assert.ok(
    JSON.stringify(releases.map(summarizeRelease)).length <
      JSON.stringify(releases).length / 3,
  );
});
