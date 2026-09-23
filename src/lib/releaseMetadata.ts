import type { Metadata } from "next";

import type { Song } from "../data/releases";

export const homepageDescription =
  "The official Maxwell Young release archive, with songs, lyrics, artwork, credits, and listening links gathered in one place.";

export function createReleaseDescription(release: Song): string {
  const year = release.releaseDate?.match(/\d{4}$/)?.[0];
  const kind = release.releaseType?.toLowerCase() ?? "release";
  const features = [
    "artwork",
    ...(release.lyrics ? ["lyrics"] : []),
    ...(release.credits ? ["credits"] : []),
    ...(Object.values(release.links).some(Boolean)
      ? ["verified listening links"]
      : []),
  ];
  const finalFeature = features.pop();
  const featureList = features.length
    ? `${features.join(", ")}, and ${finalFeature}`
    : finalFeature;

  return `${release.title} by Maxwell Young (${kind}${year ? `, ${year}` : ""}). Official ${featureList} from the public catalogue.`;
}

type ReleaseMetadataOptions = {
  description: string;
  title?: string;
};

export const createReleaseMetadata = (
  release: Song,
  { description, title }: ReleaseMetadataOptions,
): Metadata => {
  const pageTitle = title ?? `${release.title} | Maxwell Young`;
  const canonical = release.releasePath ?? `/r/${release.slug}`;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      type: "music.song",
      title: pageTitle,
      description,
      url: canonical,
      images: [
        {
          url: release.artwork,
          width: 1200,
          height: 1200,
          alt: `${release.title} artwork`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [release.artwork],
    },
  };
};
