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

export const metadata: Metadata = {
  title: "Forum | Maxwell Young",
  description:
    "Join the discussion about Maxwell Young's music, upcoming projects, and more.",
};

// This would typically come from a database
const mockTopics = [
  {
    id: "in-my-20s-discussion",
    title: "In My 20s - Album Discussion",
    description: "Share your thoughts on the upcoming 2025 project",
    content:
      "Join the conversation about the highly anticipated new album, its themes, and what it means for Maxwell's artistic journey.",
    replies: 24,
    lastUpdated: "2 days ago",
    status: "Featured",
  },
  {
    id: "birthday-girl-appreciation",
    title: "Birthday Girl EP Appreciation",
    description: "Discuss your favorite tracks from the 2022 EP",
    content:
      "A deep dive into the EP that marked a significant shift in Maxwell's musical direction. Share your favorite moments and interpretations.",
    replies: 42,
    lastUpdated: "1 week ago",
    status: "Popular",
  },
  {
    id: "live-show-experiences",
    title: "Live Show Experiences",
    description: "Share your memories from Maxwell's concerts",
    content:
      "From intimate venues to festival stages, share your favorite moments from live performances and connect with other fans.",
    replies: 15,
    lastUpdated: "3 days ago",
  },
  {
    id: "music-production",
    title: "Music Production Discussion",
    description: "Talk about production techniques and influences",
    content:
      "Explore the technical aspects of Maxwell's music, from production choices to musical influences and creative process.",
    replies: 8,
    lastUpdated: "5 days ago",
  },
];

export default function ForumPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight">
          Forum
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Join the conversation about music, art, and everything in between
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-14">
        {/* Search Bar */}
        <div className="relative mb-10">
          <input
            type="search"
            placeholder="Search topics..."
            className="w-full rounded-xl border border-border bg-white px-5 py-3 pl-12 text-lg shadow transition placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <svg
            className="absolute left-4 top-3.5 h-6 w-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Featured Discussions */}
        <section>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-primary">
            Featured Discussions
          </h2>
          <div className="grid gap-8">
            {mockTopics
              .filter((topic) => topic.status)
              .map((topic) => (
                <Link
                  key={topic.id}
                  href={`/forum/${topic.id}`}
                  className="group"
                >
                  <Card className="relative overflow-hidden border-2 border-primary/30 bg-background/80 backdrop-blur-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl">
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary/80" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold transition-colors group-hover:text-primary">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {topic.content}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{topic.replies} replies</span>
                        <span>•</span>
                        <span>Last updated {topic.lastUpdated}</span>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {topic.status}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Recent Topics */}
        <section>
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Recent Topics
          </h2>
          <div className="grid gap-8">
            {mockTopics
              .filter((topic) => !topic.status)
              .map((topic) => (
                <Link
                  key={topic.id}
                  href={`/forum/${topic.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border bg-background/80 backdrop-blur-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold transition-colors group-hover:text-primary">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {topic.content}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{topic.replies} replies</span>
                        <span>•</span>
                        <span>Last updated {topic.lastUpdated}</span>
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
