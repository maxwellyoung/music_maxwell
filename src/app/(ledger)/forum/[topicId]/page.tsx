import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import LedgerWordmark from "~/components/LedgerWordmark";
import RepliesList from "~/components/forum/RepliesList";
import ReplyForm from "~/components/forum/ReplyForm";
import TopicActions from "~/components/forum/TopicActions";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export const metadata: Metadata = {
  title: "Note | Maxwell Young",
  description: "A note around Maxwell Young's music and art.",
};

export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const session = await getServerSession(authOptions);
  const topic = await prisma.topic.findUnique({
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
  });

  const header = (
    <header className="flex items-baseline justify-between px-6 pt-10 sm:px-12 lg:px-20">
      <Link
        href="/"
        className="leading-none transition hover:opacity-60"
        aria-label="Maxwell Young — index"
      >
        <LedgerWordmark />
      </Link>
      <Link
        href="/forum"
        className="text-sm leading-none text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
      >
        ← the wall
      </Link>
    </header>
  );

  if (!topic) {
    return (
      <main className="ledger min-h-svh bg-(--ledger-paper) text-(--ledger-ink)">
        {header}
        <div className="px-6 pb-20 pt-16 sm:px-12 lg:px-20">
          <p className="max-w-2xl text-xl">
            This note is no longer on the wall.
          </p>
          <Link
            href="/forum"
            className="mt-4 inline-block text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)] underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-(--ledger-ink)"
          >
            back to the wall
          </Link>
        </div>
      </main>
    );
  }

  const user = session?.user as { id: string; role?: string } | undefined;
  const canModify = user?.id === topic.authorId || user?.role === "admin";

  return (
    <main className="ledger min-h-svh bg-(--ledger-paper) text-(--ledger-ink)">
      {header}
      <div className="px-6 pb-20 pt-16 sm:px-12 lg:px-20">
        <article className="max-w-2xl">
          <h1 className="mb-0 text-2xl font-medium leading-snug tracking-[-0.01em] [overflow-wrap:anywhere]">
            {topic.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]">
            {topic.author?.username ? (
              <Link
                href={`/user/${topic.author.username}`}
                className="transition hover:text-(--ledger-ink)"
              >
                @{topic.author.username}
              </Link>
            ) : (
              <span>anonymous</span>
            )}
            <span>
              {topic.createdAt.toLocaleDateString("en-NZ", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            {canModify && <TopicActions topicId={topic.id} />}
          </div>

          <div className="mt-8 border-t border-[rgb(var(--ledger-ink-rgb)/0.12)] pt-6">
            {topic.content.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="mb-5 max-w-prose whitespace-pre-line text-base leading-7 text-[rgb(var(--ledger-ink-rgb)/0.80)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <section className="mt-14 border-t border-[rgb(var(--ledger-ink-rgb)/0.12)] pt-5">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="mb-0 text-base font-medium">Echoes</h2>
              <span className="text-xs tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.35)]">
                {topic.replies.length || "none yet"}
              </span>
            </div>
            <RepliesList replies={topic.replies} topicId={topic.id} />
            <ReplyForm topicId={topic.id} />
          </section>
        </article>
      </div>
    </main>
  );
}
