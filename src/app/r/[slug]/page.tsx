import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MinimalExcerpt from "~/components/MinimalExcerpt";
import releases, { getReleaseBySlug } from "~/data/releases";

type Props = { params: { slug: string } };

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

export function generateMetadata({ params }: Props): Metadata {
  const release = getReleaseBySlug(params.slug);
  if (!release) return {};
  return {
    title: `${release.title} | Maxwell Young`,
    description: `${release.title} by Maxwell Young — ${release.releaseType ?? "release"}, ${release.releaseDate ?? ""}. Lyrics, credits, and listening links.`,
    alternates: { canonical: release.releasePath ?? `/r/${release.slug}` },
    openGraph: { images: [release.artwork] },
    twitter: { card: "summary_large_image", images: [release.artwork] },
  };
}

export default function MinimalReleasePage({ params }: Props) {
  const release = getReleaseBySlug(params.slug);
  if (!release) notFound();

  const index = releases.findIndex((r) => r.slug === release.slug);
  const prev = releases[index - 1];
  const next = releases[index + 1];
  const lyricVersions = Object.entries(release.lyrics ?? {});
  const listenLinks = streamingEntries(release);

  return (
    <main className="min-h-svh bg-[#fafaf7] px-6 py-16 text-[#111] sm:px-12 lg:px-20">
      <header className="flex max-w-2xl items-baseline justify-between text-sm">
        <Link
          href="/"
          className="font-medium transition hover:text-black/50"
        >
          Maxwell Young
        </Link>
        <Link href="/" className="text-black/40 transition hover:text-black">
          ← index
        </Link>
      </header>

      <article className="mt-16 max-w-2xl">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="mb-0 text-2xl font-medium tracking-[-0.01em]">
              {release.title}
            </h1>
            <p className="mt-1 text-sm text-black/40">
              {release.releaseType?.toLowerCase() ?? "release"}
              {release.releaseDate ? ` · ${release.releaseDate}` : ""}
              {release.duration ? ` · ${release.duration}` : ""}
            </p>
          </div>
          <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32">
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
          <dl className="mt-8 max-w-prose text-sm leading-7 text-black/50">
            {release.details.map((detail) => (
              <div key={detail.label} className="flex gap-3">
                <dt className="w-24 shrink-0 text-black/35">{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {(listenLinks.length > 0 || release.releasePath) && (
          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-black/10 pt-4 text-sm">
            {listenLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-black/25 underline-offset-4 transition hover:decoration-black"
              >
                {label}
              </a>
            ))}
            {release.releasePath && (
              <Link
                href={release.releasePath}
                className="text-black/40 transition hover:text-black"
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
          <section className="mt-12 border-t border-black/10 pt-4">
            {lyricVersions.map(([version, text]) => (
              <details key={version} className="group py-2">
                <summary className="cursor-pointer list-none text-sm font-medium transition hover:text-black/50">
                  <span className="mr-2 inline-block text-black/30 transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {lyricVersions.length > 1 ? `Lyrics — ${version}` : "Lyrics"}
                </summary>
                <p className="mt-4 max-w-prose whitespace-pre-line pl-5 text-sm leading-7 text-black/70">
                  {text}
                </p>
              </details>
            ))}
            {release.credits && (
              <details className="group border-t border-black/10 py-2">
                <summary className="cursor-pointer list-none text-sm font-medium transition hover:text-black/50">
                  <span className="mr-2 inline-block text-black/30 transition-transform group-open:rotate-90">
                    ›
                  </span>
                  Credits
                </summary>
                <p className="mt-4 max-w-prose whitespace-pre-line pl-5 text-sm leading-7 text-black/70">
                  {release.credits}
                </p>
              </details>
            )}
          </section>
        )}
      </article>

      <nav
        className="mt-16 flex max-w-2xl justify-between gap-6 border-t border-black/10 pt-4 text-sm"
        aria-label="Adjacent releases"
      >
        {prev ? (
          <Link
            href={`/r/${prev.slug}`}
            className="text-black/40 transition hover:text-black"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/r/${next.slug}`}
            className="text-right text-black/40 transition hover:text-black"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <footer className="mt-16 max-w-2xl text-sm text-black/30">
        {year(release.releaseDate) || "—"} · Maxwell Young
      </footer>
    </main>
  );
}
