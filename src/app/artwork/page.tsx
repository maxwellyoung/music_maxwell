import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import releases from "~/data/releases";

export const metadata: Metadata = {
  title: "Artwork | Maxwell Young",
  description:
    "Every Maxwell Young cover in one place — singles, EPs, and albums from the official catalogue.",
};

const releaseYear = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

export default function ArtworkIndexPage() {
  const covers = releases.filter((release) => release.artwork);
  const years = [...new Set(covers.map((r) => releaseYear(r.releaseDate)))]
    .filter(Boolean)
    .sort((a, b) => Number(b) - Number(a));

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 pb-24 pt-10 sm:px-8 lg:px-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-foreground/45">
        Covers · {covers.length} of them
      </p>
      <h1 className="mb-0 mt-4 text-6xl leading-[0.84] tracking-[-0.05em] sm:text-8xl">
        The artwork
      </h1>
      <p className="font-reenie mt-6 max-w-xl text-3xl leading-none text-foreground/60 sm:text-4xl">
        every sleeve, {years.at(-1)}–{years[0]}
      </p>

      <div className="mt-12 space-y-16">
        {years.map((year) => (
          <section key={year}>
            <div className="mb-6 flex items-baseline gap-4 border-b border-foreground/25 pb-3">
              <h2 className="mb-0 text-2xl tracking-[-0.03em]">{year}</h2>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/40">
                {(() => {
                  const count = covers.filter(
                    (r) => releaseYear(r.releaseDate) === year,
                  ).length;
                  return `${count} ${count === 1 ? "cover" : "covers"}`;
                })()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {covers
                .filter((release) => releaseYear(release.releaseDate) === year)
                .map((release) => {
                  const href = release.releasePath ?? "/#archive";
                  return (
                    <Link
                      key={release.slug}
                      href={href}
                      className="group focus-visible:outline-none"
                    >
                      <div className="relative aspect-square overflow-hidden bg-black group-focus-visible:ring-2 group-focus-visible:ring-foreground group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background">
                        <Image
                          src={release.artwork}
                          alt={`${release.title} cover artwork`}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                      </div>
                      <div className="mt-3 border-t border-foreground/15 pt-2">
                        <h3 className="mb-0 text-base leading-tight tracking-[-0.02em]">
                          {release.title}
                        </h3>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">
                          {release.releaseType ?? "Release"}
                          {release.releaseDate ? ` · ${release.releaseDate}` : ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 border-t border-foreground/25 pt-6">
        <Link
          href="/artwork/sneakin-drinks"
          className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/55 transition hover:text-foreground"
        >
          The Sneakin Drinks Into Bars cover, up close ↗
        </Link>
      </div>
    </main>
  );
}
