import { prisma } from "~/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import dynamicImport from "next/dynamic";

const ForumTopicsInfinite = dynamicImport(
  () => import("~/components/forum/ForumTopicsInfinite"),
  { ssr: false }
);
import type { ForumTopic } from "~/components/forum/ForumTopicsInfinite";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Forum | Maxwell Young",
  description: "Discussions",
};

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const PAGE_SIZE = 20;
  let topics: ForumTopic[] = [];
  let total = 0;

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
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-lg font-medium tracking-tight">Forum</h1>
        </header>

        {/* Topics */}
        <ForumTopicsInfinite initialTopics={topics} total={total} />

        {/* New post */}
        <div className="fixed bottom-8 right-8">
          <Link
            href="/forum/new"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="New discussion"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
