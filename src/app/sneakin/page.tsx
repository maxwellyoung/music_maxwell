import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import songs from "~/components/songsData";

export const metadata: Metadata = {
  title: "Sneakin Drinks Into Bars | Maxwell Young",
  description: "Sneakin Drinks Into Bars by Maxwell Young. Out Thursday.",
  openGraph: {
    title: "Sneakin Drinks Into Bars | Maxwell Young",
    description: "bar lights / field smoke / highlights",
    images: ["/artworks/SneakinDrinksIntoBars.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/artworks/SneakinDrinksIntoBars.jpg"],
  },
};

const lyric = songs[0]?.lyrics?.["Sneakin Drinks Into Bars"] ?? "";
const lyricBlocks = lyric.split("\n\n");

export default function SneakinPage() {
  const song = songs[0]!;

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 pb-16 pt-8 sm:px-6 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="order-2 space-y-8 lg:order-1">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-foreground/45">
                Apr 30 / Thursday
              </p>
              <h1 className="max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl">
                {song.title}
              </h1>
              <p className="font-reenie mt-5 max-w-2xl text-3xl leading-none text-foreground/65 sm:text-4xl">
                bar lights / field smoke / highlights
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/forum/new?title=bar%20lights&content=field%20smoke%20/%20highlights"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Leave A Note
              </Link>
              <Link
                href="/artwork/sneakin-drinks"
                className="rounded-full bg-background/65 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-foreground/65 transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Artwork
              </Link>
            </div>

            <div className="grid gap-3 border-y border-foreground/10 py-5 sm:grid-cols-3">
              {["call off work", "mirror and my match", "find the thread"].map(
                (line) => (
                  <p
                    key={line}
                    className="font-reenie text-3xl leading-none text-foreground/70"
                  >
                    {line}
                  </p>
                ),
              )}
            </div>
          </div>

          <Link
            href="/artwork/sneakin-drinks"
            className="order-1 block lg:order-2"
            aria-label="Open Sneakin Drinks artwork"
          >
            <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-black shadow-2xl shadow-accent/10">
              <Image
                src={song.artwork}
                alt={song.title}
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover transition duration-500 hover:scale-[1.025]"
              />
            </div>
          </Link>
        </div>
      </section>

      <section className="border-y border-foreground/10 bg-[#f4efe7]/55">
        <div className="container mx-auto grid gap-10 px-4 py-14 sm:px-6 md:px-8 lg:grid-cols-[0.38fr_0.62fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
              Lyrics
            </p>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            {lyricBlocks.map((block) => (
              <p
                key={block}
                className="whitespace-pre-line text-lg font-semibold leading-relaxed text-foreground/80"
              >
                {block}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 sm:px-6 md:px-8">
        <div className="flex flex-col gap-5 border-y border-foreground/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-foreground/45">
              Wall
            </p>
            <h2 className="font-reenie mt-2 text-4xl leading-none text-foreground/70">
              leave a line / a false alarm / something almost said
            </h2>
          </div>
          <Link
            href="/forum"
            className="inline-flex w-fit rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background transition hover:bg-foreground/85"
          >
            Notes
          </Link>
        </div>
      </section>
    </main>
  );
}
