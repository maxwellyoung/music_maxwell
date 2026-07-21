import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReplyForm from "~/components/forum/ReplyForm";
import RepliesList from "~/components/forum/RepliesList";
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

  if (!topic) {
    return (
      <main className="notes-canvas flex min-h-[70vh] items-center px-5 py-16">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h1 className="font-pixel-line text-4xl">
            This note is no longer on the wall.
          </h1>
          <Link
            href="/forum"
            className="font-pixel-dot mt-8 inline-flex border-b-2 border-foreground pb-1 text-xs uppercase tracking-[0.1em]"
          >
            Back to Notes
          </Link>
        </div>
      </main>
    );
  }

  const user = session?.user as { id: string; role?: string } | undefined;
  const canModify = user?.id === topic.authorId || user?.role === "admin";

  return (
    <main className="notes-canvas min-h-screen">
      <div className="border-b border-foreground/15 px-5 py-5 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1120px] items-center">
          <Link
            href="/forum"
            className="font-pixel-dot group inline-flex min-h-11 items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-foreground/55 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            The wall
          </Link>
        </div>
      </div>

      <article className="px-5 py-12 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[0.25fr_0.75fr] lg:gap-16">
            <aside className="lg:pt-3">
              <p className="font-pixel-dot mb-2 text-[11px] uppercase tracking-[0.1em] text-foreground/40">
                Pinned by
              </p>
              {topic.author?.username ? (
                <Link
                  href={`/user/${topic.author.username}`}
                  className="text-lg font-semibold text-primary transition hover:text-accent"
                >
                  @{topic.author.username}
                </Link>
              ) : (
                <p className="text-lg text-foreground/55">anonymous</p>
              )}
              <p className="font-pixel-dot mt-5 text-[11px] uppercase tracking-[0.1em] text-foreground/40">
                {topic.createdAt.toLocaleDateString("en-NZ", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {canModify && (
                <div className="mt-8">
                  <TopicActions topicId={topic.id} />
                </div>
              )}
            </aside>

            <div>
              <h1 className="font-pixel-line mb-10 max-w-5xl break-words text-4xl leading-[0.92] sm:text-6xl">
                {topic.title}
              </h1>
              <div className="max-w-3xl border-l-2 border-primary pl-6 sm:pl-10">
                {topic.content
                  .split("\n\n")
                  .map((paragraph: string, index: number) => (
                    <p
                      key={index}
                      className="text-foreground/78 mb-7 whitespace-pre-line text-xl leading-relaxed sm:text-2xl"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-[#11100f] px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-10 flex items-end justify-between gap-5 border-b border-white/20 pb-5">
            <h2 className="font-pixel-line mb-0 text-4xl text-white sm:text-5xl">
              echoes<span className="font-pixel-dot text-[#8ea6ff]">.</span>
            </h2>
            <span className="font-pixel-dot text-[11px] uppercase tracking-[0.1em] text-white/45">
              {topic.replies.length || "no"}{" "}
              {topic.replies.length === 1 ? "reply" : "replies"}
            </span>
          </div>
          <RepliesList replies={topic.replies} topicId={topic.id} />
          <ReplyForm topicId={topic.id} />
        </div>
      </section>
    </main>
  );
}
