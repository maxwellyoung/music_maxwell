import type { MetadataRoute } from "next";

import releases from "~/data/releases";

const origin = "https://www.maxwellyoung.info";

export default function sitemap(): MetadataRoute.Sitemap {
  const releasePages = releases.flatMap((release) =>
    release.releasePath
      ? [
          {
            url: `${origin}${release.releasePath}`,
            changeFrequency: "monthly" as const,
            priority: release.world ? 0.9 : 0.7,
          },
        ]
      : [],
  );

  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    ...releasePages,
    { url: `${origin}/artwork`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${origin}/quiz`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${origin}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
