import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LedgerLightSwitch from "~/components/LedgerLightSwitch";
import MinimalExcerpt from "~/components/MinimalExcerpt";
import releases, { getReleaseBySlug } from "~/data/releases";

type Props = { params: Promise<{ slug: string }> };

const year = (date?: string) => date?.match(/\d{4}$/)?.[0] ?? "";

const streamingEntries = (release: (typeof releases)[number]) =>
  [
    { label: "Spotify", href: release.links.spotify },
    { label: "Apple Music", href: release.links.appleMusic },
    { label: "YouTube", href: release.links.youtube },
    { label: "Tidal", href: release.links.tidal },
    { label: "Pandora", href: release.links.pandora },
    { label: "All platforms", href: release.links.smartLink },
  ].filter((entry): entry is { label: string; href: string } =>
    Boolean(entry.href),
  );

export function generateStaticParams() {
  return releases.map((release) => ({ slug: release.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const release = getReleaseBySlug((await params).slug);
  if (!release) return {};
  return {
    title: `${release.title} | Maxwell Young`,
    description: `${release.title} by Maxwell Young — ${release.releaseType ?? "release"}, ${release.releaseDate ?? ""}. Lyrics, credits, and listening links.`,
    alternates: { canonical: release.releasePath ?? `/r/${release.slug}` },
    twitter: { card: "summary_large_image" },
  };
}

export default async function MinimalReleasePage({ params }: Props) {
  const release = getReleaseBySlug((await params).slug);
  if (!release) notFound();

  const index = releases.findIndex((r) => r.slug === release.slug);
  const prev = releases[index - 1];
  const next = releases[index + 1];
  const lyricVersions = Object.entries(release.lyrics ?? {});
  const listenLinks = streamingEntries(release);

  return (
    <main className="ledger min-h-svh bg-(--ledger-paper) text-(--ledger-ink)">
      <header className="sticky top-0 z-20 border-b border-[rgb(var(--ledger-ink-rgb)/0.15)] bg-(--ledger-paper) px-6 sm:px-12 lg:px-20">
        <div className="flex h-14 items-baseline justify-between pt-[1.15rem]">
          <Link
            href="/"
            className="text-lg font-semibold leading-none tracking-[-0.02em] transition hover:text-[rgb(var(--ledger-ink-rgb)/0.60)]"
          >
            Maxwell Young
          </Link>
          <Link
            href="/"
            className="text-sm leading-none text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
          >
            ← index
          </Link>
        </div>
      </header>

      <div className="px-6 pb-20 pt-14 sm:px-12 lg:px-20">
      <article className="max-w-2xl">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="mb-0 text-2xl font-medium tracking-[-0.01em]">
              {release.title}
            </h1>
            <p className="mt-1 text-sm tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]">
              {release.releaseType?.toLowerCase() ?? "release"}
              {release.releaseDate ? ` · ${release.releaseDate}` : ""}
              {release.duration ? ` · ${release.duration}` : ""}
            </p>
          </div>
          <div
            className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32"
            style={{ viewTransitionName: "release-cover" }}
          >
            <Image
              src={release.artwork}
              alt={`${release.title} artwork`}
              fill
              priority
              sizes="8rem"
              className="object-cover"
            />
          </div>
        </div>

        {release.details && release.details.length > 0 && (
          <dl className="mt-8 max-w-prose text-sm leading-7 text-[rgb(var(--ledger-ink-rgb)/0.50)]">
            {release.details.map((detail) => (
              <div key={detail.label} className="flex gap-3">
                <dt className="w-24 shrink-0 text-[rgb(var(--ledger-ink-rgb)/0.35)]">{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {(listenLinks.length > 0 || release.releasePath) && (
          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] pt-4 text-sm">
            {listenLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-(--ledger-ink)"
              >
                {label}
              </a>
            ))}
            {release.releasePath && (
              <Link
                href={release.releasePath}
                className="text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
              >
                Enter the release room ↗
              </Link>
            )}
          </div>
        )}

        {release.previewUrl && (
          <div className="mt-8">
            <MinimalExcerpt src={release.previewUrl} />
          </div>
        )}

        {lyricVersions.length > 0 && (
          <section className="mt-12 border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] pt-4">
            {lyricVersions.map(([version, text]) => (
              <details key={version} className="group py-2">
                <summary className="cursor-pointer list-none text-sm font-medium transition hover:text-[rgb(var(--ledger-ink-rgb)/0.50)]">
                  <span className="mr-2 inline-block text-[rgb(var(--ledger-ink-rgb)/0.30)] transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {lyricVersions.length > 1 ? `Lyrics — ${version}` : "Lyrics"}
                </summary>
                <p className="mt-4 max-w-prose whitespace-pre-line pl-5 text-sm leading-7 text-[rgb(var(--ledger-ink-rgb)/0.70)]">
                  {text}
                </p>
              </details>
            ))}
            {release.credits && (
              <details className="group border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] py-2">
                <summary className="cursor-pointer list-none text-sm font-medium transition hover:text-[rgb(var(--ledger-ink-rgb)/0.50)]">
                  <span className="mr-2 inline-block text-[rgb(var(--ledger-ink-rgb)/0.30)] transition-transform group-open:rotate-90">
                    ›
                  </span>
                  Credits
                </summary>
                <p className="mt-4 max-w-prose whitespace-pre-line pl-5 text-sm leading-7 text-[rgb(var(--ledger-ink-rgb)/0.70)]">
                  {release.credits}
                </p>
              </details>
            )}
          </section>
        )}
      </article>

      <nav
        className="mt-16 flex max-w-2xl justify-between gap-6 border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] pt-4 text-sm"
        aria-label="Adjacent releases"
      >
        {prev ? (
          <Link
            href={`/r/${prev.slug}`}
            className="text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/r/${next.slug}`}
            className="text-right text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <footer className="mt-24 max-w-2xl border-t border-[rgb(var(--ledger-ink-rgb)/0.15)] pt-5">
        <div className="flex items-baseline justify-between gap-8 text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">
          <span className="tabular-nums">
            {year(release.releaseDate) || "—"} · Maxwell Young · Aotearoa
          </span>
          <LedgerLightSwitch />
        </div>
      </footer>
      </div>
    </main>
  );
}
