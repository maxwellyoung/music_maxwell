import assert from "node:assert/strict";
import test from "node:test";
import {
  getReleasePhase,
  ONE_KISS_RELEASE_DATE,
} from "./releasePhase.ts";

test("1kiss rolls into release day at midnight in each visitor timezone", () => {
  const instant = new Date("2026-07-23T12:05:00.000Z");

  assert.equal(
    getReleasePhase(ONE_KISS_RELEASE_DATE, instant, "Pacific/Auckland"),
    "release_day",
  );
  assert.equal(
    getReleasePhase(ONE_KISS_RELEASE_DATE, instant, "America/Los_Angeles"),
    "upcoming",
  );
});

test("release day remains local throughout July 24", () => {
  const instant = new Date("2026-07-24T10:00:00.000Z");

  assert.equal(
    getReleasePhase(ONE_KISS_RELEASE_DATE, instant, "America/Los_Angeles"),
    "release_day",
  );
});

test("1kiss becomes out now after the visitor's local release day", () => {
  const instant = new Date("2026-07-25T00:00:00.000Z");

  assert.equal(
    getReleasePhase(ONE_KISS_RELEASE_DATE, instant, "Pacific/Auckland"),
    "released",
  );
});
