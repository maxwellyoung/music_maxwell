import type { Metadata } from "next";
import Link from "next/link";
import LedgerWordmark from "~/components/LedgerWordmark";
import releases from "~/data/releases";

// The Part About the Archive: every fact the catalogue holds, one dense
// typewriter table, linked only from the colophon.
export const metadata: Metadata = {
  title: "Appendix | Maxwell Young",
  description: "The complete catalogue of Maxwell Young releases, as data.",
  robots: { index: false, follow: true },
};

const detail = (release: (typeof releases)[number], label: string) =>
  release.details?.find((d) => d.label === label)?.value ?? "—";

export default function AppendixPage() {
  return (
    <main className="ledger min-h-svh bg-(--ledger-paper) text-(--ledger-ink)">
      <header className="flex items-baseline justify-between px-6 pt-10 sm:px-12 lg:px-20">
        <Link
          href="/"
          className="leading-none transition hover:opacity-60"
          aria-label="Maxwell Young — index"
        >
          <LedgerWordmark />
        </Link>
        <Link
          href="/"
          className="text-sm leading-none text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
        >
          ← index
        </Link>
      </header>

      <div className="px-6 pb-20 pt-16 sm:px-12 lg:px-20">
        <p className="mb-10 font-mono text-xs text-[rgb(var(--ledger-ink-rgb)/0.40)]">
          Appendix. The part about the archive.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl border-collapse font-mono text-xs leading-6">
            <thead>
              <tr className="border-b border-[rgb(var(--ledger-ink-rgb)/0.25)] text-left text-[rgb(var(--ledger-ink-rgb)/0.40)]">
                <th className="py-2 pr-4 font-normal">nº</th>
                <th className="py-2 pr-4 font-normal">title</th>
                <th className="py-2 pr-4 font-normal">form</th>
                <th className="py-2 pr-4 font-normal">date</th>
                <th className="py-2 pr-4 font-normal">length</th>
                <th className="py-2 pr-4 font-normal">tempo</th>
                <th className="py-2 pr-4 font-normal">key</th>
                <th className="py-2 font-normal">texts</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {releases.map((release, index) => (
                <tr
                  key={release.slug}
                  className="border-b border-[rgb(var(--ledger-ink-rgb)/0.10)] align-top"
                >
                  <td className="py-2 pr-4 text-[rgb(var(--ledger-ink-rgb)/0.35)]">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="py-2 pr-4">
                    <Link
                      href={`/r/${release.slug}`}
                      className="transition hover:text-[rgb(var(--ledger-ink-rgb)/0.55)]"
                    >
                      {release.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 lowercase text-[rgb(var(--ledger-ink-rgb)/0.55)]">
                    {release.releaseType ?? "release"}
                  </td>
                  <td className="py-2 pr-4 text-[rgb(var(--ledger-ink-rgb)/0.55)]">
                    {release.releaseDate ?? "—"}
                  </td>
                  <td className="py-2 pr-4 text-[rgb(var(--ledger-ink-rgb)/0.55)]">
                    {release.duration ?? "—"}
                  </td>
                  <td className="py-2 pr-4 text-[rgb(var(--ledger-ink-rgb)/0.55)]">
                    {detail(release, "Tempo")}
                  </td>
                  <td className="py-2 pr-4 text-[rgb(var(--ledger-ink-rgb)/0.55)]">
                    {detail(release, "Key")}
                  </td>
                  <td className="py-2 text-[rgb(var(--ledger-ink-rgb)/0.55)]">
                    {release.lyrics ? Object.keys(release.lyrics).length : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 max-w-prose font-mono text-xs leading-6 text-[rgb(var(--ledger-ink-rgb)/0.35)]">
          {releases.length} entries. Compiled from the official catalogue;
          omissions are silences, not absences.
        </p>
      </div>
    </main>
  );
}
