"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import releases from "~/data/releases";

// Loads three.js after paint, desktop only; never blocks the ledger text.
const LedgerSkyTower = dynamic(() => import("~/components/LedgerSkyTower"), {
  ssr: false,
});

const year = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

export type MarginNote = { id: string; title: string; author: string };

// The ledger homepage: text-first, artwork only on intent.
export default function MinimalIndex({
  notes = [],
}: {
  notes?: MarginNote[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const activeRelease = releases.find((r) => r.slug === active);

  return (
    <main className="ledger min-h-svh bg-[var(--ledger-paper)] px-6 py-16 text-[var(--ledger-ink)] sm:px-12 lg:px-20">
      <header className="max-w-xl">
        <h1 className="mb-0 text-sm font-medium">Maxwell Young</h1>
        <p className="mt-1 text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">
          Alt-pop from Aotearoa. {releases.length} releases, 2018–2026.
        </p>
        <p className="mt-6 text-sm leading-relaxed">
          <Link
            href="/1kiss"
            className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-[var(--ledger-ink)]"
          >
            1kiss
          </Link>{" "}
          is out now.
        </p>
      </header>

      <section className="mt-16 max-w-2xl" aria-label="Discography">
        <ol className="border-t border-[rgb(var(--ledger-ink-rgb)/0.10)]">
          {releases.map((release) => (
            <li key={release.slug}>
              <Link
                href={`/r/${release.slug}`}
                onMouseEnter={() => setActive(release.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(release.slug)}
                onBlur={() => setActive(null)}
                className="group flex items-baseline justify-between gap-6 border-b border-[rgb(var(--ledger-ink-rgb)/0.10)] py-3 text-sm transition-colors hover:bg-[var(--ledger-ink)] hover:px-3 hover:text-[var(--ledger-paper)] focus-visible:bg-[var(--ledger-ink)] focus-visible:px-3 focus-visible:text-[var(--ledger-paper)] focus-visible:outline-none"
              >
                <span className="font-medium">{release.title}</span>
                <span className="shrink-0 tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)] group-hover:text-[rgb(var(--ledger-paper-rgb)/0.60)] group-focus-visible:text-[rgb(var(--ledger-paper-rgb)/0.60)]">
                  {release.releaseType?.toLowerCase() ?? "release"} ·{" "}
                  {year(release.releaseDate)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {notes.length > 0 && (
        <section className="mt-16 max-w-2xl" aria-label="Latest notes">
          <p className="text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">from the wall —</p>
          <ul className="mt-2 space-y-1">
            {notes.map((note) => (
              <li key={note.id} className="text-sm leading-relaxed">
                <Link
                  href={`/forum/${note.id}`}
                  className="text-[rgb(var(--ledger-ink-rgb)/0.70)] transition hover:text-[var(--ledger-ink)]"
                >
                  “{note.title}”
                  <span className="text-[rgb(var(--ledger-ink-rgb)/0.35)]"> — {note.author}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            <Link
              href="/forum"
              className="text-[rgb(var(--ledger-ink-rgb)/0.40)] underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-[var(--ledger-ink)] hover:decoration-[var(--ledger-ink)]"
            >
              leave something behind
            </Link>
          </p>
        </section>
      )}

      <footer className="mt-16 flex max-w-2xl flex-wrap gap-x-5 gap-y-2 text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">
        <Link href="/forum" className="transition hover:text-[var(--ledger-ink)]">
          Notes
        </Link>
        <a
          href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-[var(--ledger-ink)]"
        >
          Spotify
        </a>
        <a
          href="https://instagram.com/maxwell_young"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-[var(--ledger-ink)]"
        >
          Instagram
        </a>
        <a
          href="https://www.youtube.com/@maxwell_young"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-[var(--ledger-ink)]"
        >
          YouTube
        </a>
      </footer>

      {/* Right column: the dithered Sky Tower keeps quiet residence; a
          release's artwork fades in over it while its row is held. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-8 top-1/2 hidden h-72 w-72 -translate-y-1/2 lg:block xl:right-24 xl:h-96 xl:w-96"
      >
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            activeRelease ? "opacity-0" : "opacity-100"
          }`}
        >
          <LedgerSkyTower />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
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
      </div>
    </main>
  );
}
