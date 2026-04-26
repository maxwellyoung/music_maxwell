import { prisma } from "~/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchTopics } from "~/components/forum/SearchTopics";
import ForumTopicsInfinite, {
  type ForumTopic,
} from "~/components/forum/ForumTopicsInfinite";

export const metadata: Metadata = {
  title: "Notes | Maxwell Young",
  description: "Notes and threads around Maxwell Young releases.",
};

// Use dynamic rendering for real-time forum data
export const dynamic = "force-dynamic";

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  // Only support infinite scroll for no search query for now
  if (resolvedSearchParams.q) {
    // fallback to old logic for search
    // ... existing code for search (can be refactored later)
  }

  // Fetch first page of topics and total count
  const PAGE_SIZE = 10;
  let topics: ForumTopic[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const [topicsRes, totalRes] = await Promise.all([
      prisma.topic.findMany({
        skip: 0,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, username: true } },
          _count: { select: { replies: true } },
        },
      }),
      prisma.topic.count(),
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
    <main className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mx-auto mb-12 max-w-4xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Maxwell Young
        </p>
        <h1 className="mb-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Notes
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Release talk, links, questions, and stray thoughts from listeners.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-10">
        {/* Search Bar */}
        <SearchTopics initialQuery={resolvedSearchParams.q} />

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {/* Infinite Scroll Topics */}
        <ForumTopicsInfinite initialTopics={topics} total={total} />

        {/* New note button */}
        <div className="mt-16">
          <Link
            href="/forum/new"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-md transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            New Note
          </Link>
        </div>
      </div>
    </main>
  );
}
