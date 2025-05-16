import type { Metadata } from "next";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { prisma } from "~/lib/prisma";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import Link from "next/link";
import { Button } from "~/components/ui/button";

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
  title: "Topic | Maxwell Young Forum",
  description: "Join the discussion about Maxwell Young's music and art.",
};

export const revalidate = 60; // Revalidate this page every 60 seconds for forum best practices

export default async function TopicPage({
  params,
}: {
  params: { topicId: string };
}) {
  const session = await getServerSession(authOptions);
  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
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
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center text-2xl text-muted-foreground">
          Topic not found.
        </div>
      </main>
    );
  }

  interface UserWithRole {
    id: string;
    role?: string;
  }
  const user = session?.user as UserWithRole | undefined;
  const canModify = user?.id === topic.authorId || user?.role === "admin";

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-14">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/forum" passHref legacyBehavior>
            <Button
              variant="outline"
              className="px-5 py-2 text-base font-semibold"
            >
              ← Back to Forum
            </Button>
          </Link>
        </div>
        {/* Topic Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <h1 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight">
              {topic.title}
            </h1>
            {canModify && <TopicActions topicId={topic.id} />}
          </div>
          <div className="flex items-center gap-4 text-base font-medium text-muted-foreground">
            <span>
              Posted by{" "}
              {topic.author?.username ? (
                <Link
                  href={`/user/${topic.author.username}`}
                  className="text-primary hover:underline"
                >
                  {topic.author.username}
                </Link>
              ) : (
                <span className="text-muted-foreground">Unknown</span>
              )}
            </span>
            <span>•</span>
            <span>{topic.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Main Topic Content */}
        <Card className="border-2 border-primary/10 bg-background/80 shadow-lg backdrop-blur-lg">
          <CardContent className="p-8">
            <div className="prose max-w-none text-lg text-foreground">
              {topic.content
                .split("\n\n")
                .map((paragraph: string, index: number) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-12" />

        {/* Replies Section */}
        <section>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-primary">
            Replies{" "}
            <span className="text-base font-normal text-muted-foreground">
              ({topic.replies.length})
            </span>
          </h2>
          <RepliesList replies={topic.replies} />
        </section>

        {/* Reply Form (functional) */}
        <ReplyForm topicId={topic.id} />
      </div>
    </main>
  );
}
