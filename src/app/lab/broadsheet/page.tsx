import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import releases, { getReleaseBySlug } from "~/data/releases";

export const metadata: Metadata = {
  title: "Lab C — Broadsheet | Maxwell Young",
};

const year = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

export default function BroadsheetLabPage() {
  const featured = getReleaseBySlug("1kiss")!;
  const rest = releases.slice(1);
  const years = [...new Set(rest.map((r) => year(r.releaseDate)))].filter(
    Boolean,
  );

  return (
    <main className="min-h-svh bg-[#f2ede4] px-5 py-10 text-[#141310] sm:px-10 lg:px-16">
      {/* Masthead */}
      <header className="border-b-4 border-[#141310] pb-4">
        <div className="flex items-baseline justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
          <span>Tāmaki Makaurau / Wellington</span>
          <span>Est. 2016 · alt-pop</span>
        </div>
        <h1 className="mt-3 text-[clamp(3.2rem,10vw,8.5rem)] font-bold leading-[0.82] tracking-[-0.05em]">
          Maxwell Young
        </h1>
      </header>

      {/* Lead story */}
      <section className="grid gap-8 border-b border-black/20 py-10 lg:grid-cols-[0.62fr_0.38fr]">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
              New single · out now
            </p>
            <h2 className="mt-3 max-w-[12ch] text-5xl font-bold leading-[0.9] tracking-[-0.04em] sm:text-7xl">
              {featured.title}: your hips, our lips
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-black/70">
              Bright, hyper-tuned pop with club-cut vocal chops and a hook
              built to replay. Two minutes three, 136 BPM, F sharp, clean.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <Link
              href={featured.releasePath ?? "/"}
              className="border-b-2 border-[#141310] pb-0.5 text-sm font-bold uppercase tracking-[0.16em] transition hover:opacity-60"
            >
              Enter the release
            </Link>
            <a
              href={featured.links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b-2 border-black/25 pb-0.5 text-sm font-bold uppercase tracking-[0.16em] text-black/60 transition hover:border-[#141310] hover:text-[#141310]"
            >
              Listen
            </a>
          </div>
        </div>
        <Link
          href={featured.releasePath ?? "/"}
          className="relative block aspect-square overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141310] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f2ede4]"
        >
          <Image
            src={featured.artwork}
            alt={`${featured.title} artwork`}
            fill
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
        </Link>
      </section>

      {/* Index */}
      <section className="py-10" aria-label="Discography index">
        <div className="mb-6 flex items-baseline justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
            The complete record · {releases.length} entries
          </h3>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/30">
            {years.at(-1)}–{years[0]}
          </span>
        </div>
        <div className="columns-1 gap-10 sm:columns-2 lg:columns-3">
          {rest.map((release) => (
            <Link
              key={release.slug}
              href={release.releasePath ?? "/#archive"}
              className="group mb-5 flex break-inside-avoid items-baseline gap-3 border-b border-black/15 pb-2 focus-visible:outline-none"
            >
              <span className="relative block h-10 w-10 shrink-0 self-center overflow-hidden">
                <Image
                  src={release.artwork}
                  alt=""
                  fill
                  sizes="2.5rem"
                  className="object-cover grayscale transition duration-300 group-hover:grayscale-0"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-bold leading-tight tracking-[-0.02em] transition group-hover:underline group-hover:decoration-black/30 group-hover:underline-offset-4 group-focus-visible:underline">
                  {release.title}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">
                  {release.releaseType ?? "Release"} ·{" "}
                  {release.releaseDate ?? ""}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-baseline justify-between gap-3 border-t-4 border-[#141310] pt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black/50">
        <span>© 2026 Maxwell Young</span>
        <span className="flex gap-4">
          <a
            href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[#141310]"
          >
            Spotify
          </a>
          <Link href="/forum" className="transition hover:text-[#141310]">
            Notes
          </Link>
          <Link href="/quiz" className="transition hover:text-[#141310]">
            Quiz
          </Link>
        </span>
      </footer>
    </main>
  );
}
