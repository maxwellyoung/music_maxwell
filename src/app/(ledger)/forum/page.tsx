import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import LedgerLightSwitch from "~/components/LedgerLightSwitch";
import LedgerWordmark from "~/components/LedgerWordmark";
import ForumTopicsInfinite, {
  type ForumTopic,
} from "~/components/forum/ForumTopicsInfinite";
import { SearchTopics } from "~/components/forum/SearchTopics";
import { getReleaseWallWhere } from "~/lib/forum";
import { prisma } from "~/lib/prisma";

const LedgerSkyTower = dynamic(() => import("~/components/LedgerSkyTower"));

export const metadata: Metadata = {
  title: "Town square — Maxwell Young",
  description: "Listener notes on Maxwell Young releases.",
  alternates: { canonical: "/forum" },
};

export const revalidate = 30;

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.slice(0, 100).trim();
  const where = getReleaseWallWhere(query);
  const pageSize = 10;
  let topics: ForumTopic[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const [topicsRes, totalRes] = await Promise.all([
      prisma.topic.findMany({
        where,
        skip: 0,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, username: true } },
          _count: { select: { replies: true } },
        },
      }),
      prisma.topic.count({ where }),
    ]);
    topics = topicsRes.map((topic) => ({
      ...topic,
      createdAt: topic.createdAt.toISOString(),
      updatedAt: topic.updatedAt.toISOString(),
    }));
    total = totalRes;
  } catch {
    error = "The wall could not load. Please try again shortly.";
  }

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

      <div className="px-6 pb-20 pt-16 sm:px-12 lg:px-20 lg:pr-[46vw]">
        <section className="max-w-2xl" aria-label="Notes">
          <p className="text-xl leading-snug sm:text-2xl">
            <span className="font-semibold">Town square.</span>{" "}
            <span className="text-[rgb(var(--ledger-ink-rgb)/0.45)]">
              Leave something behind.
            </span>
          </p>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
            <Link
              href="/forum/new"
              className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-(--ledger-ink)"
            >
              leave a note
            </Link>
            {query ? (
              <span className="text-[rgb(var(--ledger-ink-rgb)/0.40)]">
                {total} {total === 1 ? "match" : "matches"} ·{" "}
                <Link
                  href="/forum"
                  className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-(--ledger-ink)"
                >
                  clear
                </Link>
              </span>
            ) : (
              <span className="tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]">
                {total} in the square
              </span>
            )}
          </div>
        </section>

        <section className="mt-10 max-w-2xl">
          <SearchTopics initialQuery={query} />
        </section>

        {error && (
          <p className="mt-10 max-w-2xl border-t border-[rgb(var(--ledger-ink-rgb)/0.12)] pt-4 text-sm text-[rgb(var(--ledger-ink-rgb)/0.60)]">
            {error}
          </p>
        )}

        <div className="mt-10 max-w-2xl">
          <ForumTopicsInfinite
            initialTopics={topics}
            total={total}
            query={query}
          />
        </div>

        {/* The Beehive watches the square — crude, kafkaesque, on purpose. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 right-0 hidden w-[42vw] lg:block"
        >
          <LedgerSkyTower monument="beehive" />
        </div>

        <footer className="mt-24 max-w-2xl border-t border-[rgb(var(--ledger-ink-rgb)/0.12)] pt-4">
          <div className="flex items-baseline justify-between gap-8 text-xs text-[rgb(var(--ledger-ink-rgb)/0.35)]">
            <span className="tabular-nums">© 2026 Maxwell Young</span>
            <LedgerLightSwitch />
          </div>
        </footer>
      </div>
    </main>
  );
}
