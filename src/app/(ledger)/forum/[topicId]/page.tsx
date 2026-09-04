import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import NoteBody from "~/components/forum/NoteBody";
import RepliesList from "~/components/forum/RepliesList";
import ReplyForm from "~/components/forum/ReplyForm";
import SquareShell from "~/components/forum/SquareShell";
import TopicActions from "~/components/forum/TopicActions";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

// One query serves both the metadata and the page within a request.
const getTopic = cache((topicId: string) =>
  prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      author: { select: { name: true, id: true, username: true } },
      replies: {
        include: {
          author: { select: { name: true, role: true, username: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  }),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicId: string }>;
}): Promise<Metadata> {
  const topic = await getTopic((await params).topicId);
  if (!topic) {
    return { title: "Note — Maxwell Young", robots: { index: false } };
  }
  const excerpt = topic.content.replace(/\s+/g, " ").trim();
  return {
    title: `${topic.title} — Maxwell Young`,
    description:
      excerpt.length > 160 ? `${excerpt.slice(0, 157).trimEnd()}…` : excerpt,
    alternates: { canonical: `/forum/${topic.id}` },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const [session, topic] = await Promise.all([
    getServerSession(authOptions),
    getTopic(topicId),
  ]);

  if (!topic) notFound();

  const user = session?.user as { id: string; role?: string } | undefined;
  const canModify = user?.id === topic.authorId || user?.role === "admin";
  const replyCount = topic.replies.length;

  return (
    <SquareShell back={{ href: "/forum", label: "the square" }}>
      <article className="max-w-2xl">
        <h1 className="mb-0 text-xl font-semibold leading-snug [overflow-wrap:anywhere] sm:text-2xl">
          {topic.title}
        </h1>
        <p className="mb-0 mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]">
          {topic.author?.username ? (
            <Link
              href={`/user/${topic.author.username}`}
              className="transition hover:text-(--ledger-ink)"
            >
              {topic.author.username}
            </Link>
          ) : (
            <span>anonymous</span>
          )}
          <span>
            {topic.createdAt.toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          {canModify && <TopicActions topicId={topic.id} />}
        </p>

        <div className="mt-10 border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] pt-8">
          <NoteBody content={topic.content} />
        </div>

        <section
          className="mt-16"
          aria-label="Echoes"
        >
          <p className="mb-0 flex items-baseline justify-between text-sm">
            <span className="font-semibold">Echoes.</span>
            <span className="tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]">
              {replyCount === 0 ? "none yet" : replyCount}
            </span>
          </p>
          <RepliesList replies={topic.replies} topicId={topic.id} />
          <ReplyForm topicId={topic.id} />
        </section>
      </article>
    </SquareShell>
  );
}
