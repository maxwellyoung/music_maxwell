import { prisma } from "~/lib/prisma";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { SearchTopics } from "~/components/forum/SearchTopics";

// Explicit type for forum topics
export type ForumTopic = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: { name: string | null } | null;
  replies: any[];
};

export const metadata: Metadata = {
  title: "Forum | Maxwell Young",
  description:
    "Join the discussion about Maxwell Young's music, upcoming projects, and more.",
};

export default async function ForumPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  let topics: ForumTopic[] = [];
  let error: string | null = null;

  try {
    // Fetch topics based on search query if present
    topics = searchParams.q
      ? await prisma.topic.findMany({
          where: {
            OR: [
              { title: { contains: searchParams.q, mode: "insensitive" } },
              { content: { contains: searchParams.q, mode: "insensitive" } },
            ],
          },
          include: {
            author: { select: { name: true } },
            replies: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.topic.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { name: true } },
            replies: true,
          },
        });
  } catch (err) {
    console.error("Error fetching topics:", err);
    error = "Failed to load topics. Please try again later.";
    topics = [];
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

        {/* All Topics Grid */}
        <section>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-primary">
            {searchParams.q ? "Search Results" : "All Topics"}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {topics.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">
                {searchParams.q
                  ? "No topics found matching your search."
                  : "No topics yet. Be the first to start a discussion!"}
              </div>
            )}
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/forum/${topic.id}`}
                className="group"
              >
                <Card className="relative overflow-hidden border-2 border-primary/30 bg-background/80 backdrop-blur-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold transition-colors group-hover:text-primary">
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      by {topic.author?.name ?? "Unknown"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {topic.content.length > 180
                        ? topic.content.slice(0, 180) + "..."
                        : topic.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{topic.replies.length} replies</span>
                      <span>•</span>
                      <span>
                        Last updated{" "}
                        {new Date(topic.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>

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
