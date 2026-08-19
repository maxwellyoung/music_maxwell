import type { Metadata } from "next";

import type { Song } from "../data/releases";

type ReleaseMetadataOptions = {
  description: string;
  title?: string;
};

export const createReleaseMetadata = (
  release: Song,
  { description, title }: ReleaseMetadataOptions,
): Metadata => {
  const pageTitle = title ?? `${release.title} | Maxwell Young`;
  const canonical = release.releasePath ?? "/";

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
