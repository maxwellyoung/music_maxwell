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

import LedgerLightSwitch from "~/components/LedgerLightSwitch";

const year = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

// The ledger homepage: text-first, artwork only on intent. Marginalia
// streams in through notesSlot so the index never waits on the database.
export default function MinimalIndex({
  notesSlot,
}: {
  notesSlot?: React.ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const activeRelease = releases.find((r) => r.slug === active);

  return (
    <main className="ledger min-h-svh bg-(--ledger-paper) px-6 py-16 text-(--ledger-ink) sm:px-12 lg:px-20">
      <header className="max-w-xl">
        <h1 className="mb-0 text-sm font-medium">Maxwell Young</h1>
        <p className="mt-1 text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">
          Alt-pop from Aotearoa. {releases.length} releases, 2018–2026.
        </p>
        <p className="mt-6 text-sm leading-relaxed">
          <Link
            href="/1kiss"
            className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-(--ledger-ink)"
          >
            1kiss
          </Link>{" "}
          is out now.
        </p>
      </header>

      <section className="mt-16 max-w-2xl" aria-label="Discography">
        <ol className="border-t border-[rgb(var(--ledger-ink-rgb)/0.10)]">
          {releases.map((release, index) => (
            <li key={release.slug} style={{ "--row": index } as React.CSSProperties}>
              <Link
                href={`/r/${release.slug}`}
                onMouseEnter={() => setActive(release.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(release.slug)}
                onBlur={() => setActive(null)}
                className="group flex items-baseline justify-between gap-6 border-b border-[rgb(var(--ledger-ink-rgb)/0.10)] py-3 text-sm transition-colors hover:bg-(--ledger-ink) hover:px-3 hover:text-(--ledger-paper) focus-visible:bg-(--ledger-ink) focus-visible:px-3 focus-visible:text-(--ledger-paper) focus-visible:outline-hidden"
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

      {notesSlot}

      <footer className="mt-16 flex max-w-2xl flex-wrap items-baseline gap-x-5 gap-y-2 text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">
        <LedgerLightSwitch />
        <Link href="/forum" className="transition hover:text-(--ledger-ink)">
          Notes
        </Link>
        <a
          href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-(--ledger-ink)"
        >
          Spotify
        </a>
        <a
          href="https://instagram.com/maxwell_young"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-(--ledger-ink)"
        >
          Instagram
        </a>
        <a
          href="https://www.youtube.com/@maxwell_young"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-(--ledger-ink)"
        >
          YouTube
        </a>
      </footer>

      {/* Right column: the dithered Sky Tower stands full-height; a
          release's artwork fades in over it while its row is held. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 right-0 hidden w-[42vw] lg:block"
      >
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            activeRelease ? "opacity-0" : "opacity-100"
          }`}
        >
          <LedgerSkyTower />
        </div>
        <div
          className={`absolute left-1/2 top-1/2 h-[24rem] w-[24rem] max-w-[36vw] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 xl:h-[28rem] xl:w-[28rem] ${
            activeRelease ? "opacity-100" : "opacity-0"
          }`}
        >
          {activeRelease && (
            <Image
              src={activeRelease.artwork}
              alt=""
              fill
              sizes="28rem"
              className="object-cover"
              style={{ viewTransitionName: "release-cover" }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
