import dynamic from "next/dynamic";
import Link from "next/link";
import LedgerLightSwitch from "~/components/LedgerLightSwitch";
import LedgerWordmark from "~/components/LedgerWordmark";

const LedgerSkyTower = dynamic(() => import("~/components/LedgerSkyTower"));

// The square's three pages share one frame so they read as one room:
// the index letterhead, a single way back on the right, the index
// colophon. The Beehive only presides over the wall itself.
export default function SquareShell({
  back,
  monument = false,
  children,
}: {
  back: { href: string; label: string };
  monument?: boolean;
  children: React.ReactNode;
}) {
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
          href={back.href}
          className="text-sm leading-none text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
        >
          ← {back.label}
        </Link>
      </header>

      <div
        className={`px-6 pb-20 pt-16 sm:px-12 lg:px-20 ${
          monument ? "lg:pr-[46vw]" : ""
        }`}
      >
        {children}

        <footer className="mt-24 max-w-2xl pt-4">
          <div
            aria-hidden="true"
            className="mb-4 h-px w-full bg-linear-to-r from-[rgb(var(--ledger-ink-rgb)/0.20)] via-[rgb(var(--ledger-ink-rgb)/0.10)] to-transparent"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-xs text-[rgb(var(--ledger-ink-rgb)/0.35)]">
            <span className="tabular-nums">© 2026 Maxwell Young</span>
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <Link href="/" className="transition hover:text-(--ledger-ink)">
                index
              </Link>
              <Link
                href="/forum"
                className="transition hover:text-(--ledger-ink)"
              >
                town square
              </Link>
              <LedgerLightSwitch />
            </span>
          </div>
        </footer>
      </div>

      {monument && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 right-0 hidden w-[42vw] lg:block"
        >
          <LedgerSkyTower monument="beehive" />
        </div>
      )}
    </main>
  );
}
