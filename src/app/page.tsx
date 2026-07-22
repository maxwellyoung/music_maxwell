import type { Metadata } from "next";
import dynamic from "next/dynamic";
import HomeHero from "~/components/HomeHero";
import { getReleaseBySlug } from "~/data/releases";
import { siteConfig } from "~/data/siteConfig";

const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"));

export const metadata: Metadata = {
  title: "Maxwell Young — Music, releases, and archive",
  description:
    "Maxwell Young releases, artwork, lyrics, films, credits, and archive.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const featuredRelease = getReleaseBySlug(siteConfig.featuredReleaseSlug)!;

  return (
    <main>
      <HomeHero
        release={{
          slug: featuredRelease.slug,
          title: featuredRelease.title,
          artist: featuredRelease.artist,
          releaseDate: featuredRelease.releaseDate,
          releasePath: featuredRelease.releasePath!,
        }}
        presentation={siteConfig.featuredHero}
      />
      <CollectableGrid hideFeaturedInGrid showFeaturedHero={false} />
    </main>
  );
}
