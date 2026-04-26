import Image from "next/image";
import Link from "next/link";
import CollectableGrid from "~/components/CollectableGrid";
import songs from "~/components/songsData";

export default function Home() {
  const featuredSong = songs[0]!;

  return (
    <main className="min-h-[90vh]">
      <section className="container mx-auto px-4 pb-2 pt-8 sm:px-6 md:px-8">
        <div className="mb-12 grid gap-7 rounded-[1.6rem] border border-foreground/10 bg-[#f1eadf]/55 p-5 shadow-sm shadow-foreground/5 sm:p-6 md:grid-cols-[1.04fr_0.96fr] md:items-center">
          <div className="space-y-5 md:pl-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/45">
              Apr 30
            </p>
            <div>
              <h1 className="max-w-4xl text-5xl leading-[0.88] tracking-[-0.04em] text-foreground sm:text-7xl md:text-8xl">
                {featuredSong.title}
              </h1>
              <p className="font-reenie mt-4 max-w-xl text-3xl leading-none text-foreground/65 sm:text-4xl">
                bar lights / field smoke / highlights
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/artwork/sneakin-drinks"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Artwork
              </Link>
              <Link
                href="/forum/new?title=Sneakin%20Drinks&content=leave%20a%20line%20/%20a%20false%20alarm%20/%20something%20you%20almost%20said"
                className="rounded-full bg-background/65 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-foreground/65 transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Leave A Note
              </Link>
            </div>
          </div>
          <Link
            href="/artwork/sneakin-drinks"
            className="group relative block aspect-square overflow-hidden rounded-[1.25rem] bg-black shadow-xl shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            aria-label="Open Sneakin Drinks artwork"
          >
            <Image
              src={featuredSong.artwork}
              alt={featuredSong.title}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        </div>
        <CollectableGrid showFeaturedHero={false} />
      </section>
    </main>
  );
}
