import type { Metadata } from "next";
import Link from "next/link";
import ForumTopicsInfinite, {
  type ForumTopic,
} from "~/components/forum/ForumTopicsInfinite";
import { SearchTopics } from "~/components/forum/SearchTopics";
import SquareShell from "~/components/forum/SquareShell";
import { getReleaseWallWhere } from "~/lib/forum";
import { prisma } from "~/lib/prisma";

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
    error = "The square could not load. Try again shortly.";
  }

  const count = query
    ? `${total} ${total === 1 ? "match" : "matches"}`
    : `${total} ${total === 1 ? "note" : "notes"}`;

  return (
    <SquareShell back={{ href: "/", label: "index" }} monument>
      {/* Standfirst: what the room is, and the one thing to do in it. */}
      <section className="max-w-2xl" aria-label="Town square">
        <p className="text-xl leading-snug sm:text-2xl">
          <span className="font-semibold">Town square.</span>{" "}
          <span className="text-[rgb(var(--ledger-ink-rgb)/0.45)]">
            Notes left around the releases.
          </span>
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <p className="mb-0 flex items-baseline gap-x-5 text-sm">
            <Link
              href="/forum/new"
              className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-(--ledger-ink)"
            >
              leave a note
            </Link>
            <span className="tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]">
              {count}
              {query && (
                <>
                  {" · "}
                  <Link
                    href="/forum"
                    className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-(--ledger-ink)"
                  >
                    clear
                  </Link>
                </>
              )}
            </span>
          </p>
          <SearchTopics initialQuery={query} />
        </div>
      </section>

      {error && (
        <p className="mt-10 max-w-2xl text-sm text-[rgb(var(--ledger-ink-rgb)/0.60)]">
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
    </SquareShell>
  );
}
