import { prisma } from "~/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchTopics } from "~/components/forum/SearchTopics";
import ForumTopicsInfinite from "~/components/forum/ForumTopicsInfinite";
import type { ForumTopic } from "~/components/forum/ForumTopicsInfinite";

export const metadata: Metadata = {
  title: "Forum | Maxwell Young",
  description:
    "Join the discussion about Maxwell Young's music, upcoming projects, and more.",
};

export const revalidate = 60; // Revalidate this page every 60 seconds for forum best practices

// Mark the page as dynamic
export const dynamic = "force-dynamic";

export default async function ForumPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // Only support infinite scroll for no search query for now
  if (searchParams.q) {
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
    })) as ForumTopic[];
    total = totalRes;
  } catch (err) {
    console.error("Error fetching topics:", err);
    error = "Failed to load topics. Please try again later.";
    topics = [];
    total = 0;
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight">
          Forum
        </h1>
        {/* <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Join the conversation
        </p> */}
      </div>

      <div className="mx-auto max-w-4xl space-y-14">
        {/* Search Bar */}
        <SearchTopics initialQuery={searchParams.q} />

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {/* Infinite Scroll Topics */}
        <ForumTopicsInfinite initialTopics={topics} total={total} />

        {/* Start New Discussion Button */}
        <div className="mt-16 text-center">
          <Link
            href="/forum/new"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Start New Discussion
          </Link>
        </div>
      </div>
    </main>
  );
}
