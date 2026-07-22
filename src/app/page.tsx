import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import HomeHero from "~/components/HomeHero";

const CollectableGrid = dynamic(() => import("~/components/CollectableGrid"));

export const metadata: Metadata = {
  title: "Maxwell Young — Music, releases, and archive",
  description:
    "Enter the music of Maxwell Young: new single 1kiss, release artwork, lyrics, videos, credits, and an evolving archive from Aotearoa.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <HomeHero />
      <section className="border-b border-black/15 bg-[#f2ede4] text-[#07090d]">
        <div className="mx-auto grid max-w-[1440px] gap-7 border-l-2 border-[#3157ec] px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <p className="font-pixel-line max-w-[22ch] text-3xl leading-[0.94] sm:text-4xl">
            a bright record with the fear left in.
          </p>
          <Link
            href="/1kiss"
            className="font-pixel-dot w-fit border-b border-foreground pb-1 text-xs uppercase tracking-[0.08em] transition hover:border-[#3157ec] hover:text-[#3157ec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            lyrics, credits, details ↗
          </Link>
        </div>
      </section>
      <CollectableGrid hideFeaturedInGrid showFeaturedHero={false} />
    </main>
  );
}
