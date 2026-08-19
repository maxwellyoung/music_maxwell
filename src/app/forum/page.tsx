import { prisma } from "~/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchTopics } from "~/components/forum/SearchTopics";
import ForumTopicsInfinite, {
  type ForumTopic,
} from "~/components/forum/ForumTopicsInfinite";
import { getReleaseWallWhere } from "~/lib/forum";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Notes | Maxwell Young",
  description: "Short notes around Maxwell Young releases.",
};

// Use dynamic rendering for real-time forum data
export const dynamic = "force-dynamic";

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.slice(0, 100).trim();
  const where = getReleaseWallWhere(query);

  // Fetch first page of topics and total count
  const PAGE_SIZE = 10;
  let topics: ForumTopic[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const [topicsRes, totalRes] = await Promise.all([
      prisma.topic.findMany({
        where,
        skip: 0,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, username: true } },
          _count: { select: { replies: true } },
        },
      }),
      prisma.topic.count({ where }),
    ]);
    topics = topicsRes.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));
    total = totalRes;
  } catch {
    error = "Failed to load topics. Please try again later.";
    topics = [];
    total = 0;
  }

  return (
    <main className="notes-canvas min-h-screen">
      <section className="border-b border-foreground/15 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.68fr_0.32fr] lg:items-end">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-foreground/55">
                The wall is live · {total}{" "}
                {query
                  ? total === 1
                    ? "match"
                    : "matches"
                  : total === 1
                    ? "fragment"
                    : "fragments"}
              </p>
            </div>
            <h1 className="mb-0 text-[clamp(5rem,16vw,13rem)] font-bold leading-[0.72] tracking-[-0.075em]">
              Notes
            </h1>
          </div>
          <div className="lg:pb-2">
            <p className="font-reenie max-w-md text-4xl leading-[0.9] text-foreground/70 sm:text-5xl">
              leave a line / a false alarm / something you almost said
            </p>
            <Link
              href="/forum/new"
              className="group mt-8 inline-flex min-h-12 items-center gap-3 border-b-2 border-foreground pb-1 text-sm font-bold uppercase tracking-[0.18em] transition hover:border-accent hover:text-accent"
            >
              Pin something up
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Find a fragment
              </p>
              <SearchTopics initialQuery={query} />
              <div className="mt-8 border-t border-foreground/15 pt-5 text-sm leading-relaxed text-foreground/55">
                Notes can hold words, links, YouTube, SoundCloud, and Spotify.
                Sign in when you want to leave one of your own.
              </div>
            </aside>

            <div>
              {query && (
                <div className="mb-8 flex items-end justify-between gap-4 border-b border-foreground/15 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/45">
                      Search results
                    </p>
                    <h2 className="mb-0 mt-1 text-3xl tracking-tight">
                      “{query}”
                    </h2>
                  </div>
                  <Link
                    href="/forum"
                    className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/50 hover:text-accent"
                  >
                    Clear
                  </Link>
                </div>
              )}

              {error && (
                <div className="border-y border-destructive/30 py-5 text-destructive">
                  {error}
                </div>
              )}

              <ForumTopicsInfinite
                initialTopics={topics}
                total={total}
                query={query}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
