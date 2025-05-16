"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { subscribeToForumTopics } from "~/lib/pusherClient";

const PAGE_SIZE = 10;

const TopicActions = dynamic(() => import("~/components/forum/TopicActions"), {
  ssr: false,
});

export type ForumTopic = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: { name: string | null; username: string | null } | null;
  _count: { replies: number };
};

function ForumTopicSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border-2 border-primary/10 bg-muted/30 p-6 shadow">
      <div className="mb-4 h-6 w-2/3 rounded bg-muted-foreground/20" />
      <div className="mb-2 h-4 w-1/3 rounded bg-muted-foreground/10" />
      <div className="mb-6 h-4 w-full rounded bg-muted-foreground/10" />
      <div className="h-4 w-1/2 rounded bg-muted-foreground/10" />
    </div>
  );
}

export default function ForumTopicsInfinite({
  initialTopics,
  total,
}: {
  initialTopics: ForumTopic[];
  total: number;
}) {
  const [topics, setTopics] = useState<ForumTopic[]>(initialTopics);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTopics.length < total);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/forum/topics?skip=${topics.length}&take=${PAGE_SIZE}`,
      );
      const data: { topics: ForumTopic[]; total: number } = await res.json();
      setTopics((prev) => [...prev, ...data.topics]);
      setHasMore(topics.length + data.topics.length < data.total);
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, topics.length]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void loadMore();
      }
    });
    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  // Real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToForumTopics((newTopic: ForumTopic) => {
      setTopics((prev) => {
        if (prev.some((t) => t.id === newTopic.id)) return prev;
        return [newTopic, ...prev];
      });
    });
    return unsubscribe;
  }, []);

  return (
    <section>
      <h2 className="mb-8 text-2xl font-bold tracking-tight text-primary">
        All Topics
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {topics.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No topics yet. Be the first to start a discussion!
          </div>
        )}
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/forum/${topic.id}`}
            className="group"
            passHref
            legacyBehavior
          >
            <a className="block no-underline">
              <Card className="relative overflow-hidden border-2 border-primary/30 bg-background/80 backdrop-blur-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl">
                <CardHeader className="relative flex items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl font-bold transition-colors group-hover:text-primary">
                      {topic.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      by{" "}
                      {topic.author?.username ? (
                        <span
                          className="cursor-pointer text-primary hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/user/${topic.author?.username}`);
                          }}
                        >
                          {topic.author.username}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </CardDescription>
                  </div>
                  {userRole === "admin" && (
                    <div className="absolute right-3 top-3 z-10">
                      <TopicActions topicId={topic.id} />
                    </div>
                  )}
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
                    <span>{topic._count.replies} replies</span>
                    <span>•</span>
                    <span>
                      Last updated{" "}
                      {new Date(topic.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </a>
          </Link>
        ))}
        {loading &&
          hasMore &&
          Array.from({ length: 2 }).map((_, i) => (
            <ForumTopicSkeleton key={i} />
          ))}
      </div>
      <div ref={loaderRef} className="flex h-12 items-center justify-center">
        {loading && (
          <span className="text-muted-foreground">Loading more...</span>
        )}
        {!hasMore && topics.length > 0 && (
          <div className="animate-fade-in flex flex-col items-center gap-2 text-muted-foreground">
            <span>You&rsquo;ve reached the end of the forum!</span>
          </div>
        )}
      </div>
    </section>
  );
}
