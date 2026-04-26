import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sneakin Drinks | Maxwell Young",
  description: "Artwork for Sneakin Drinks Into Bars.",
};

const covers = [
  {
    title: "sneakin-base",
    note: "the one",
    src: "/artworks/SneakinDrinksIntoBars.jpg",
  },
  {
    title: "bar lights",
    note: "louder",
    src: "/artworks/SneakinDrinksAltCover.png",
  },
  {
    title: "after midnight",
    note: "smoke / mirror",
    src: "/artworks/SneakinDrinksAltDark.png",
  },
  {
    title: "field smoke",
    note: "heat",
    src: "/artworks/SneakinDrinksAltPink.png",
  },
];

export default function SneakinDrinksArtworkPage() {
  const [baseCover, ...supportCovers] = covers;

  return (
    <main className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/45">
              Apr 30
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-none tracking-tight sm:text-7xl">
              Sneakin Drinks Into Bars
            </h1>
            <p className="font-reenie mt-4 max-w-2xl text-3xl leading-none text-muted-foreground sm:text-4xl">
              bar lights / field smoke / highlights
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex w-fit rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background shadow-md transition hover:bg-foreground/85"
          >
            Releases
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          {baseCover && (
            <article>
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-black shadow-xl shadow-foreground/10">
                <Image
                  src={baseCover.src}
                  alt={`${baseCover.title} for Sneakin Drinks Into Bars`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h2 className="mt-4 text-2xl font-semibold lowercase tracking-tight">
                {baseCover.title}
              </h2>
              <p className="font-reenie mt-1 text-3xl leading-none text-muted-foreground">
                {baseCover.note}
              </p>
            </article>
          )}

          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {supportCovers.map((cover) => (
              <article key={cover.title} className="group">
                <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-black shadow-md transition group-hover:-translate-y-1 group-hover:shadow-xl">
                  <Image
                    src={cover.src}
                    alt={`${cover.title} for Sneakin Drinks Into Bars`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold lowercase tracking-tight">
                  {cover.title}
                </h2>
                <p className="font-reenie mt-1 text-2xl leading-none text-muted-foreground">
                  {cover.note}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
