import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import releases, { getReleaseBySlug } from "~/data/releases";

export const metadata: Metadata = {
  title: "Lab B — Void | Maxwell Young",
};

const year = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

export default function VoidLabPage() {
  const featured = getReleaseBySlug("1kiss")!;

  return (
    <main className="min-h-svh bg-[#060607] text-[#e8e8e6]">
      <section className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-white/35">
          Maxwell Young
        </p>
        <Link
          href={featured.releasePath ?? "/"}
          className="group mt-10 block focus-visible:outline-none"
        >
          <span className="relative block h-[68vmin] w-[68vmin] max-w-[34rem] overflow-hidden sm:h-[56vmin] sm:w-[56vmin]">
            <Image
              src={featured.artwork}
              alt={`${featured.title} artwork`}
              fill
              priority
              sizes="(min-width: 640px) 56vmin, 68vmin"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
            <span className="absolute inset-0 ring-1 ring-inset ring-white/10 transition group-focus-visible:ring-2 group-focus-visible:ring-white" />
          </span>
        </Link>
        <h1 className="mb-0 mt-10 text-sm font-medium tracking-wide text-[#e8e8e6]">
          {featured.title}
        </h1>
        <p className="mt-1 text-sm text-white/35">out now</p>
      </section>

      <section
        className="mx-auto max-w-md px-6 pb-32 text-center"
        aria-label="Discography"
      >
        <ol className="space-y-2 text-sm leading-relaxed text-white/45">
          {releases.slice(1).map((release) => (
            <li key={release.slug}>
              <Link
                href={release.releasePath ?? "/#archive"}
                className="transition hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                {release.title}
                <span className="text-white/25">
                  {" "}
                  — {year(release.releaseDate)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex justify-center gap-6 text-[11px] uppercase tracking-[0.22em] text-white/30">
          <a
            href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Spotify
          </a>
          <Link href="/forum" className="transition hover:text-white">
            Notes
          </Link>
          <a
            href="https://instagram.com/maxwell_young"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
