import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export const metadata: Metadata = {
  title: "Topic | Maxwell Young Forum",
  description: "Join the discussion about Maxwell Young's music and art.",
};

// This would typically come from a database
const mockTopic = {
  id: "in-my-20s-discussion",
  title: "In My 20s - Album Discussion",
  author: "maxwell_young",
  createdAt: "2024-03-15",
  content: `I'm excited to share some thoughts about the upcoming album "In My 20s". This project represents a significant evolution in my musical journey, blending alternative pop with experimental textures and cinematic visuals.

The album explores themes of growth, self-discovery, and the complex emotions that come with navigating your twenties. Each track tells a story, and I'm curious to hear your interpretations and expectations.`,
  replies: [
    {
      id: 1,
      author: "music_lover",
      content:
        "I'm really looking forward to hearing how you've evolved since Birthday Girl. The snippets I've heard so far sound incredible!",
      createdAt: "2024-03-15",
    },
    {
      id: 2,
      author: "art_enthusiast",
      content:
        "The visual elements you've been teasing on Instagram are fascinating. How do they connect to the music?",
      createdAt: "2024-03-16",
    },
  ],
};

export default async function TopicPage({
  params: _params,
}: {
  params: { topicId: string };
}) {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-14">
        {/* Topic Header */}
        <div className="mb-10">
          <h1 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight">
            {mockTopic.title}
          </h1>
          <div className="flex items-center gap-4 text-base font-medium text-muted-foreground">
            <span>Posted by {mockTopic.author}</span>
            <span>•</span>
            <span>{mockTopic.createdAt}</span>
          </div>
        </div>

        {/* Main Topic Content */}
        <Card className="border-2 border-primary/10 bg-background/80 shadow-lg backdrop-blur-lg">
          <CardContent className="p-8">
            <div className="prose max-w-none text-lg text-foreground">
              {mockTopic.content.split("\n\n").map((paragraph, index) => (
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
              ({mockTopic.replies.length})
            </span>
          </h2>
          <div className="space-y-8">
            {mockTopic.replies.map((reply) => (
              <Card
                key={reply.id}
                className="group overflow-hidden border bg-background/80 backdrop-blur-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold transition-colors group-hover:text-primary">
                      {reply.author}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {reply.createdAt}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {reply.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Reply Form */}
        <Card className="mt-12 border-2 border-primary/10 bg-background/80 shadow-md backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Add a Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <textarea
                  className="min-h-[120px] w-full rounded-xl border border-input bg-white px-4 py-3 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Share your thoughts..."
                  rows={5}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                Post Reply
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
