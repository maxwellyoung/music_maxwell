"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LedgerLightSwitch from "~/components/LedgerLightSwitch";
import LedgerWordmark from "~/components/LedgerWordmark";
import MinimalExcerpt from "~/components/MinimalExcerpt";
import type { ReleaseSummary } from "~/lib/releaseSummary";

// Loads three.js after paint, desktop only; never blocks the ledger text.
const LedgerSkyTower = dynamic(() => import("~/components/LedgerSkyTower"), {
  ssr: false,
});

const year = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

// The ledger homepage: text-first, artwork only on intent. Marginalia
// streams in through notesSlot so the index never waits on the database.
export default function MinimalIndex({
  notesSlot,
  releases,
}: {
  releases: ReleaseSummary[];
  notesSlot?: React.ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const activeRelease = releases.find((r) => r.slug === active);
  const featured = releases[0];
  const recentReleases = releases.slice(0, 6);

  // Hover and keyboard focus reveal artwork; only the play control starts audio.

  return (
    <main className="ledger min-h-svh bg-(--ledger-paper) text-(--ledger-ink)">
      {/* Letterhead: the wordmark alone, two-tone, nothing else. */}
      <header className="px-6 pt-10 sm:px-12 lg:px-20">
        <h1 className="mb-0 leading-none">
          <span className="sr-only">Maxwell Young</span>
          <LedgerWordmark decorative />
        </h1>
      </header>

      <div className="px-6 pt-16 pb-20 sm:px-12 lg:px-20 lg:pr-[46vw]">
        {/* Standfirst: the current record, playable in place. */}
        {featured && (
          <section
            className="max-w-2xl"
            aria-label="Latest release"
          >
            <p className="text-xl leading-snug sm:text-2xl">
              <Link
                href={`/r/${featured.slug}`}
                className="font-semibold underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-[6px] transition hover:decoration-(--ledger-ink)"
              >
                {featured.title}
              </Link>{" "}
              <span className="text-(--ledger-secondary) italic">
                is out now.
              </span>
            </p>
            {featured.previewUrl && (
              <div className="mt-4">
                <MinimalExcerpt
                  src={featured.previewUrl}
                  title={featured.title}
                />
              </div>
            )}
          </section>
        )}

        {recentReleases.length > 0 && (
          <section
            className="mt-12 lg:hidden"
            aria-labelledby="recent-releases-heading"
          >
            <div className="flex max-w-2xl items-baseline justify-between gap-6">
              <h2
                id="recent-releases-heading"
                className="mb-0 text-sm leading-none font-medium"
              >
                Recent releases
              </h2>
              <Link
                href="/artwork"
                className="text-xs text-(--ledger-secondary) underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-(--ledger-ink) focus-visible:ring-2 focus-visible:ring-(--ledger-ink) focus-visible:outline-hidden"
              >
                All artwork
              </Link>
            </div>
            <div
              className="-mx-6 mt-4 overflow-x-auto px-6 pb-3 sm:-mx-12 sm:px-12"
              data-recent-sleeves
            >
              <ol className="flex w-max gap-3">
                {recentReleases.map((release) => (
                  <li
                    key={release.slug}
                    className="w-[36vw] min-w-34 max-w-40 shrink-0"
                  >
                    <Link
                      href={`/r/${release.slug}`}
                      className="group block focus-visible:ring-2 focus-visible:ring-(--ledger-ink) focus-visible:ring-offset-4 focus-visible:ring-offset-(--ledger-paper) focus-visible:outline-hidden"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[rgb(var(--ledger-ink-rgb)/0.04)]">
                        <Image
                          src={release.artwork}
                          alt={`${release.title} artwork`}
                          fill
                          sizes="(max-width: 377px) 136px, (max-width: 444px) 36vw, 160px"
                          className="object-cover"
                        />
                      </div>
                      <span className="mt-2 block text-sm leading-snug font-medium">
                        {release.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-(--ledger-secondary) tabular-nums">
                        {year(release.releaseDate)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

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
                  className="group flex items-baseline justify-between gap-6 border-b border-[rgb(var(--ledger-ink-rgb)/0.10)] py-3 text-sm transition-colors duration-150 hover:bg-(--ledger-ink) hover:text-(--ledger-paper) focus-visible:bg-(--ledger-ink) focus-visible:text-(--ledger-paper) focus-visible:outline-hidden"
                >
                  <span className="font-medium transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:translate-x-3 group-focus-visible:translate-x-3">
                    {release.title}
                  </span>
                  <span className="shrink-0 text-(--ledger-secondary) tabular-nums transition-[color,transform] duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:-translate-x-3 group-hover:text-[rgb(var(--ledger-paper-rgb)/0.60)] group-focus-visible:-translate-x-3 group-focus-visible:text-[rgb(var(--ledger-paper-rgb)/0.60)]">
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
        <footer className="mt-24 max-w-2xl pt-4">
          <div
            aria-hidden="true"
            className="mb-4 h-px w-full bg-linear-to-r from-[rgb(var(--ledger-ink-rgb)/0.20)] via-[rgb(var(--ledger-ink-rgb)/0.10)] to-transparent"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-xs text-(--ledger-secondary)">
            <span className="tabular-nums">
              © 2026 Maxwell Young
              <span className="hidden text-(--ledger-secondary) lg:inline">
                {" "}
                · ↑↓ browse · esc home ·{" "}
                <Link
                  href="/index-of-everything"
                  className="transition hover:text-(--ledger-secondary)"
                >
                  appendix
                </Link>
              </span>
            </span>
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <Link
                href="/questions"
                className="transition hover:text-(--ledger-ink)"
              >
                A few questions
              </Link>
              <Link
                href="/forum"
                className="transition hover:text-(--ledger-ink)"
              >
                Town square
              </Link>
              {[
                [
                  "Spotify",
                  "https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q",
                ],
                [
                  "Apple Music",
                  "https://music.apple.com/nz/artist/maxwell-young/1113632139",
                ],
                ["TikTok", "https://www.tiktok.com/@internetmaxwell"],
                ["Instagram", "https://instagram.com/maxwell_young"],
                ["YouTube", "https://www.youtube.com/@maxwell_young"],
                ["Bandcamp", "https://maxwellyoung.bandcamp.com"],
                ["X", "https://twitter.com/internetmaxwell"],
                ["Silk", "https://birds.silk.cx/@maxwell"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-(--ledger-ink)"
                >
                  {label}
                </a>
              ))}
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
          className={`absolute inset-0 transition-opacity [transition-timing-function:var(--ease-out-strong)] ${
            activeRelease
              ? "opacity-0 duration-150"
              : "opacity-100 duration-500"
          }`}
        >
          <LedgerSkyTower active={!activeRelease} />
        </div>
        <div
          className={`absolute top-1/2 left-1/2 h-[24rem] w-[24rem] max-w-[36vw] -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] [transition-timing-function:var(--ease-out-strong)] xl:h-[28rem] xl:w-[28rem] ${
            activeRelease
              ? "scale-100 opacity-100 duration-250"
              : "scale-[0.985] opacity-0 duration-150"
          }`}
        >
          {activeRelease && (
            <div
              key={activeRelease.slug}
              className="cover-condense absolute inset-0"
            >
              <Image
                src={activeRelease.artwork}
                alt=""
                fill
                sizes="28rem"
                className="object-cover"
                style={{ viewTransitionName: "release-cover" }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
