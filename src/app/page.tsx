import Link from "next/link";
import CollectableGrid from "~/components/CollectableGrid";
import HomeHero from "~/components/HomeHero";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <section className="border-b border-black/20 bg-[#d8ff30] text-[#07090d]">
        <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <p className="font-pixel-line text-4xl leading-[0.9] sm:text-5xl">
            your hips / our lips / one kiss
          </p>
          <Link
            href="/1kiss"
            className="font-pixel-dot w-fit border-b border-foreground pb-1 text-xs uppercase tracking-[0.12em] transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            Enter the release ↗
          </Link>
        </div>
      </section>
      <CollectableGrid hideFeaturedInGrid showFeaturedHero={false} />
    </main>
  );
}
