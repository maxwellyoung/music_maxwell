import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Sneakin Drinks Artwork | Maxwell Young",
  description: "Artwork for Sneakin Drinks Into Bars by Maxwell Young.",
  openGraph: {
    images: ["/artworks/SneakinDrinksIntoBars.jpg"],
  },
};

const artwork = {
  title: "sneakin-base",
  note: "the one",
  src: "/artworks/SneakinDrinksIntoBars.jpg",
  date: "30 Apr 2026",
  format: "Single artwork",
};

export default function SneakinDrinksArtworkPage() {
  return (
    <main className="min-h-screen bg-[#11100f] text-white">
      <div className="px-5 pt-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-white/20 pb-5">
          <Link
            href="/sneakin"
            className="group inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            The release
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
            Artwork archive · 001
          </p>
        </div>
      </div>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.62fr_0.38fr] lg:items-end lg:gap-16">
          <div className="group relative aspect-square overflow-hidden bg-black">
            <Image
              src={artwork.src}
              alt={`${artwork.title} for Sneakin Drinks Into Bars`}
              fill
              priority
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.015]"
            />
            <div className="pointer-events-none absolute inset-0 border border-white/10" />
            <span className="font-reenie absolute bottom-5 right-6 rotate-[-5deg] text-3xl text-white/65 sm:text-4xl">
              {artwork.note}
            </span>
          </div>

          <div className="pb-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
              {artwork.date}
            </p>
            <h1 className="mb-6 mt-4 text-5xl leading-[0.86] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              Sneakin
              <br />
              Drinks
              <br />
              Into Bars
            </h1>
            <p className="font-reenie text-4xl leading-[0.85] text-white/60">
              bar lights / field smoke / highlights
            </p>

            <dl className="mt-10 border-b border-white/20">
              {[
                ["File", artwork.title],
                ["Format", artwork.format],
                ["Status", "Final cover"],
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="flex justify-between gap-5 border-t border-white/20 py-3 text-sm"
                >
                  <dt className="font-bold uppercase tracking-[0.14em] text-white/35">
                    {term}
                  </dt>
                  <dd className="text-right text-white/70">{detail}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={artwork.src}
                download
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
              >
                <Download className="h-4 w-4" />
                Save cover
              </a>
              <Link
                href="/forum/new?title=the%20cover&content=the%20detail%20I%20kept%20looking%20at%20was..."
                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-white hover:text-white"
              >
                Leave a note
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/20 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-8 sm:grid-cols-3">
          {[
            {
              label: "Listen",
              title: "The release page",
              href: "/sneakin",
            },
            {
              label: "Respond",
              title: "Notes from the wall",
              href: "/forum",
            },
            {
              label: "Play",
              title: "Test your memory",
              href: "/quiz",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border-t border-white/20 py-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                {item.label}
              </p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <h2 className="mb-0 text-2xl text-white transition group-hover:text-white/70">
                  {item.title}
                </h2>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
