"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import releases from "~/data/releases";

const year = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

// The ledger homepage: text-first, artwork only on intent.
export default function MinimalIndex() {
  const [active, setActive] = useState<string | null>(null);
  const activeRelease = releases.find((r) => r.slug === active);

  return (
    <main className="min-h-svh bg-[#fafaf7] px-6 py-16 text-[#111] sm:px-12 lg:px-20">
      <header className="max-w-xl">
        <h1 className="mb-0 text-sm font-medium">Maxwell Young</h1>
        <p className="mt-1 text-sm text-black/40">
          Alt-pop from Aotearoa. {releases.length} releases, 2018–2026.
        </p>
        <p className="mt-6 text-sm leading-relaxed">
          <Link
            href="/1kiss"
            className="underline decoration-black/25 underline-offset-4 transition hover:decoration-black"
          >
            1kiss
          </Link>{" "}
          is out now.
        </p>
      </header>

      <section className="mt-16 max-w-2xl" aria-label="Discography">
        <ol className="border-t border-black/10">
          {releases.map((release) => (
            <li key={release.slug}>
              <Link
                href={`/r/${release.slug}`}
                onMouseEnter={() => setActive(release.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(release.slug)}
                onBlur={() => setActive(null)}
                className="group flex items-baseline justify-between gap-6 border-b border-black/10 py-3 text-sm transition-colors hover:bg-black hover:px-3 hover:text-white focus-visible:bg-black focus-visible:px-3 focus-visible:text-white focus-visible:outline-none"
              >
                <span className="font-medium">{release.title}</span>
                <span className="shrink-0 tabular-nums text-black/40 group-hover:text-white/60 group-focus-visible:text-white/60">
                  {release.releaseType?.toLowerCase() ?? "release"} ·{" "}
                  {year(release.releaseDate)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-16 flex max-w-2xl flex-wrap gap-x-5 gap-y-2 text-sm text-black/40">
        <Link href="/forum" className="transition hover:text-black">
          Notes
        </Link>
        <Link href="/quiz" className="transition hover:text-black">
          Quiz
        </Link>
        <Link href="/artwork" className="transition hover:text-black">
          Artwork
        </Link>
        <a
          href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-black"
        >
          Spotify
        </a>
        <a
          href="https://instagram.com/maxwell_young"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-black"
        >
          Instagram
        </a>
        <a
          href="https://www.youtube.com/@maxwell_young"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-black"
        >
          YouTube
        </a>
      </footer>

      {/* Artwork surfaces only while a row is held. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed right-8 top-1/2 hidden h-72 w-72 -translate-y-1/2 transition-opacity duration-200 lg:block xl:right-24 xl:h-96 xl:w-96 ${
          activeRelease ? "opacity-100" : "opacity-0"
        }`}
      >
        {activeRelease && (
          <Image
            src={activeRelease.artwork}
            alt=""
            fill
            sizes="24rem"
            className="object-cover"
          />
        )}
      </div>
    </main>
  );
}
