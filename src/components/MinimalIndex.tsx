"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LedgerLightSwitch from "~/components/LedgerLightSwitch";
import LedgerWordmark from "~/components/LedgerWordmark";
import MinimalExcerpt from "~/components/MinimalExcerpt";
import releases, { getReleaseBySlug } from "~/data/releases";

// Loads three.js after paint, desktop only; never blocks the ledger text.
const LedgerSkyTower = dynamic(() => import("~/components/LedgerSkyTower"), {
  ssr: false,
});

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
  const featured = getReleaseBySlug("1kiss");

  return (
    <main className="ledger min-h-svh bg-(--ledger-paper) text-(--ledger-ink)">
      {/* Letterhead: the wordmark alone, two-tone, nothing else. */}
      <header className="px-6 pt-10 sm:px-12 lg:px-20">
        <h1 className="mb-0 leading-none">
          <LedgerWordmark />
          <span className="sr-only">Maxwell Young</span>
        </h1>
      </header>

      <div className="px-6 pb-20 pt-16 sm:px-12 lg:px-20 lg:pr-[46vw]">
        {/* Standfirst: the current record, playable in place. */}
        <section className="max-w-2xl" aria-label="Now playing">
          <p className="text-xl leading-snug sm:text-2xl">
            <Link
              href="/1kiss"
              className="font-semibold underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-[6px] transition hover:decoration-(--ledger-ink)"
            >
              1kiss
            </Link>{" "}
            <span className="text-[rgb(var(--ledger-ink-rgb)/0.45)]">
              is out now.
            </span>
          </p>
          {featured?.previewUrl && (
            <div className="mt-4">
              <MinimalExcerpt src={featured.previewUrl} />
            </div>
          )}
        </section>

        <section className="mt-14 max-w-2xl" aria-label="Discography">
          <ol className="border-t border-[rgb(var(--ledger-ink-rgb)/0.10)]">
            {releases.map((release, index) => (
              <li
                key={release.slug}
                style={{ "--row": index } as React.CSSProperties}
              >
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

        {/* Colophon: one hairline, one quiet line. */}
        <footer className="mt-24 max-w-2xl border-t border-[rgb(var(--ledger-ink-rgb)/0.12)] pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-xs text-[rgb(var(--ledger-ink-rgb)/0.35)]">
            <span className="tabular-nums">© 2026 Maxwell Young</span>
            <span className="flex items-baseline gap-x-4">
              <Link
                href="/forum"
                className="transition hover:text-(--ledger-ink)"
              >
                Notes
              </Link>
              <a
                href="https://birds.silk.cx/@maxwell"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-(--ledger-ink)"
              >
                Silk
              </a>
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
              <LedgerLightSwitch />
            </span>
          </div>
        </footer>
      </div>

      {/* Right column: the dithered Sky Tower stands fitted below the
          masthead; a release's artwork fades in over it while its row is
          held. */}
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
