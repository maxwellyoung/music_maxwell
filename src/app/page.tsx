import Link from "next/link";
import CollectableGrid from "~/components/CollectableGrid";
import HomeHero from "~/components/HomeHero";

export default function Home() {
  return (
    <main>
      <HomeHero />
      <section className="border-b border-foreground/20 bg-[#d9f85c] text-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-12">
          <p className="font-reenie text-4xl leading-[0.9] sm:text-5xl">
            fluent in false alarms · mirror and my match · we find the thread
          </p>
          <Link
            href="/forum/new?title=bar%20lights&content=field%20smoke%20/%20highlights"
            className="w-fit border-b border-foreground pb-1 text-xs font-bold uppercase tracking-[0.2em] transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          >
            Leave a note ↗
          </Link>
        </div>
      </section>
      <CollectableGrid hideFeaturedInGrid showFeaturedHero={false} />
    </main>
  );
}
