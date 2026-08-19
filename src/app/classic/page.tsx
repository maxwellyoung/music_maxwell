import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import HomeHero from "~/components/HomeHero";
import { getReleaseBySlug } from "~/data/releases";
import { siteConfig } from "~/data/siteConfig";

const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"));

// The pre-minimal homepage, kept whole while the ledger design leads.
export const metadata: Metadata = {
  title: "Maxwell Young — Classic home",
  description:
    "Maxwell Young releases, artwork, lyrics, films, credits, and archive.",
  robots: { index: false, follow: true },
};

export default function ClassicHome() {
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
      <div className="mb-10 mt-4 text-center">
        <Link
          href="/quiz"
          className="font-reenie text-2xl text-foreground/45 transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          shuffle the liner notes →
        </Link>
      </div>
    </main>
  );
}
