import { prisma } from "~/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SearchTopics } from "~/components/forum/SearchTopics";
import ForumTopicsInfinite, {
  type ForumTopic,
} from "~/components/forum/ForumTopicsInfinite";
import { getReleaseWallWhere } from "~/lib/forum";

export const metadata: Metadata = {
  title: "Notes — Maxwell Young",
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

  const hasListenerNotes = Boolean(query) || total > 0;

  return (
    <main className="notes-canvas min-h-screen">
      <section className="border-b border-foreground/15 px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1120px]">
          <h1 className="font-pixel-line mb-8 text-[clamp(4.75rem,11vw,9rem)] leading-[0.72] tracking-[-0.045em]">
            notes<span className="font-pixel-dot text-primary">.</span>
          </h1>
          <div className="flex flex-col gap-7 border-t border-foreground/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-lg leading-relaxed text-foreground/65 sm:text-xl">
              Listener notes on the music.
            </p>
            <Link
              href="/forum/new"
              className="font-pixel-dot group inline-flex min-h-11 w-fit items-center gap-3 border-b border-foreground pb-1 text-[11px] uppercase tracking-[0.1em] transition hover:border-primary hover:text-primary"
            >
              leave a note
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1120px]">
          {hasListenerNotes && (
            <div className="mb-10 grid min-w-0 gap-8 border-b border-foreground/15 pb-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="max-w-xl">
                <SearchTopics initialQuery={query} />
              </div>
              {query ? (
                <div className="flex items-center gap-4">
                  <p className="font-pixel-dot text-[11px] uppercase tracking-[0.1em] text-foreground/45">
                    {total} {total === 1 ? "match" : "matches"}
                  </p>
                  <Link
                    href="/forum"
                    className="font-pixel-dot text-[11px] uppercase tracking-[0.1em] text-primary hover:underline"
                  >
                    clear
                  </Link>
                </div>
              ) : (
                <p className="font-pixel-dot text-[11px] uppercase tracking-[0.1em] text-foreground/45">
                  latest first
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mb-8 border-y border-destructive/30 py-4 text-destructive">
              {error}
            </div>
          )}

          <div className="mb-5 flex items-end justify-between border-b border-foreground/15 pb-4">
            <h2 className="mb-0 text-xl font-bold tracking-[-0.03em]">
              Listener notes
            </h2>
            {!hasListenerNotes && !query && (
              <span className="text-xs tabular-nums text-foreground/45">0</span>
            )}
          </div>
          <ForumTopicsInfinite
            initialTopics={topics}
            total={total}
            query={query}
          />
        </div>
      </section>
    </main>
  );
}
