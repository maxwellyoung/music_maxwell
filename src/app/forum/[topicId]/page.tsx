import type { Metadata } from "next";
import { prisma } from "~/lib/prisma";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import Link from "next/link";

const ReplyForm = dynamic(() => import("~/components/forum/ReplyForm"), {
  ssr: false,
});
const RepliesList = dynamic(() => import("~/components/forum/RepliesList"), {
  ssr: false,
});
const TopicActions = dynamic(() => import("~/components/forum/TopicActions"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Topic | Maxwell Young",
  description: "Discussion",
};

export const revalidate = 60;

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function TopicPage({
  params,
}: {
  params: { topicId: string };
}) {
  const session = await getServerSession(authOptions);
  const INITIAL_REPLIES_LIMIT = 20;

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    include: {
      author: { select: { name: true, id: true, username: true } },
      replies: {
        include: {
          author: {
            select: { name: true, role: true, username: true, id: true },
          },
        },
        orderBy: { createdAt: "asc" },
        take: INITIAL_REPLIES_LIMIT + 1,
      },
      _count: {
        select: { replies: true },
      },
    },
  });

  if (!topic) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-sm text-muted-foreground">Topic not found</p>
          <Link
            href="/forum"
            className="mt-4 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Back to forum
          </Link>
        </div>
      </main>
    );
  }

  const totalReplies = topic._count?.replies ?? 0;
  const hasMoreReplies = topic.replies.length > INITIAL_REPLIES_LIMIT;
  const initialReplies = hasMoreReplies
    ? topic.replies.slice(0, INITIAL_REPLIES_LIMIT)
    : topic.replies;
  const nextCursor = hasMoreReplies
    ? initialReplies[initialReplies.length - 1]?.id
    : null;

  interface UserWithRole {
    id: string;
    role?: string;
  }
  const user = session?.user as UserWithRole | undefined;
  const canModify = user?.id === topic.authorId || user?.role === "admin";

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/forum"
          className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Forum
        </Link>

        {/* Topic header */}
        <header className="mb-12">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
              {topic.title}
            </h1>
            {canModify && (
              <div className="shrink-0">
                <TopicActions topicId={topic.id} />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            {topic.author?.username ? (
              <Link
                href={`/user/${topic.author.username}`}
                className="transition-colors hover:text-foreground"
              >
                {topic.author.username}
              </Link>
            ) : (
              <span>anon</span>
            )}
            <span className="text-muted-foreground/50">·</span>
            <span>{formatDate(topic.createdAt)}</span>
          </div>
        </header>

        {/* Content */}
        <article className="mb-16">
          <div className="space-y-4 text-foreground leading-relaxed">
            {topic.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Replies */}
        <section className="border-t border-border pt-12">
          <h2 className="mb-8 text-sm font-medium tracking-wide text-muted-foreground">
            {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
          </h2>
          <RepliesList
            replies={initialReplies}
            topicId={topic.id}
            initialHasMore={hasMoreReplies}
            initialCursor={nextCursor}
            totalCount={totalReplies}
          />
        </section>

        {/* Reply form */}
        <div className="mt-12">
          <ReplyForm topicId={topic.id} />
        </div>
      </div>
    </main>
  );
}
