import type { Song } from "../data/releases.ts";

export type ReleaseSummary = Pick<
  Song,
  "slug" | "title" | "artwork" | "releaseDate" | "releaseType" | "previewUrl"
>;

// Keep lyrics, credits and platform metadata on the server for the index.
export function summarizeRelease(release: Song): ReleaseSummary {
  const { slug, title, artwork, releaseDate, releaseType, previewUrl } =
    release;
  return { slug, title, artwork, releaseDate, releaseType, previewUrl };
}
