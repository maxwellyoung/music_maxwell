import { oneKissReleaseMedia } from "../data/releaseMedia.ts";
import releases, {
  coreStreamingServices,
  getStreamingAvailability,
  getStreamingDestinations,
} from "../data/releases.ts";

export const createPublicReleaseManifest = () => ({
  schemaVersion: 1 as const,
  catalogueVersion: "2026-07-24",
  releases: releases.map((release) => {
    const isOneKiss = release.slug === "1kiss";

    return {
      id: release.slug,
      slug: release.slug,
      title: release.title,
      artist: release.artist,
      releaseDate: release.releaseDate ?? null,
      duration: release.duration ?? null,
      releaseType: release.releaseType ?? null,
      artwork: release.artwork,
      pagePath: release.releasePath ?? null,
      world: release.world ?? null,
      publication: {
        lyrics: release.lyrics ? ("public" as const) : ("none" as const),
        films: isOneKiss
          ? oneKissReleaseMedia.publication.films
          : ("none" as const),
      },
      streaming: Object.fromEntries(
        coreStreamingServices.map((service) => [
          service,
          getStreamingAvailability(release, service),
        ]),
      ),
      streamingDestinations: getStreamingDestinations(release),
      media: {
        audioMasterSha256: isOneKiss
          ? oneKissReleaseMedia.audioMaster.sha256
          : null,
        films: [],
      },
    };
  }),
});
