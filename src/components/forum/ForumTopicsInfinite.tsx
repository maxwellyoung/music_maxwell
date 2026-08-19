"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { subscribeToForumTopics } from "~/lib/pusherClient";
import { ArrowUpRight, MessageCircle } from "lucide-react";

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
    <div className="animate-pulse border-t border-foreground/10 py-8">
      <div className="mb-4 h-8 w-2/3 bg-foreground/10" />
      <div className="mb-2 h-4 w-full bg-foreground/5" />
      <div className="h-4 w-1/2 bg-foreground/5" />
    </div>
  );
}

export default function ForumTopicsInfinite({
  initialTopics,
  total,
  query,
}: {
  initialTopics: ForumTopic[];
  total: number;
  query?: string;
}) {
  const [topics, setTopics] = useState<ForumTopic[]>(initialTopics);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTopics.length < total);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/forum/topics?skip=${topics.length}&take=${PAGE_SIZE}${
          query ? `&q=${encodeURIComponent(query)}` : ""
        }`,
      );
      const data: { topics: ForumTopic[]; total: number } = await res.json();
      setTopics((prev) => [...prev, ...data.topics]);
      setHasMore(topics.length + data.topics.length < data.total);
    } catch {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, topics.length, query]);

  useEffect(() => {
    setTopics(initialTopics);
    setHasMore(initialTopics.length < total);
  }, [initialTopics, total, query]);

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
    if (query) return;

    const unsubscribe = subscribeToForumTopics((newTopic: ForumTopic) => {
      setTopics((prev) => {
        if (prev.some((t) => t.id === newTopic.id)) return prev;
        return [newTopic, ...prev];
      });
    });
    return unsubscribe;
  }, [query]);

  return (
    <section aria-label="Notes" className="min-w-0 overflow-hidden">
      <div className="border-b border-foreground/15">
        {topics.length === 0 && (
          <div className="border-t border-foreground/15 py-16">
            <p className="font-pixel-line text-2xl leading-none text-foreground/65 sm:text-3xl">
              {query ? "No notes matched." : "No notes yet."}
            </p>
            {query && (
              <p className="mt-3 max-w-md text-sm text-foreground/45">
                Try a shorter word or username.
              </p>
            )}
          </div>
        )}
        {topics.map((topic, index) => (
          <article
            key={topic.id}
            className="wall-note group relative grid gap-5 border-t border-foreground/15 py-8 pl-5 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-7 sm:py-10 sm:pl-7"
          >
            <div className="font-pixel-dot text-sm leading-none text-primary/70">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0">
              <Link
                href={`/forum/${topic.id}`}
                className="block focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
              >
                <h3 className="font-pixel-line mb-3 max-w-3xl text-3xl leading-[0.98] transition-colors group-hover:text-primary sm:text-4xl">
                  {topic.title}
                </h3>
                <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-foreground/60">
                  {topic.content.length > 240
                    ? `${topic.content.slice(0, 240).trim()}…`
                    : topic.content}
                </p>
              </Link>
              <div className="font-pixel-dot mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-widest text-foreground/45">
                {topic.author?.username ? (
                  <Link
                    href={`/user/${topic.author.username}`}
                    className="relative z-10 transition-colors hover:text-accent"
                  >
                    @{topic.author.username}
                  </Link>
                ) : (
                  <span>anonymous</span>
                )}
                <span>
                  {new Date(topic.updatedAt).toLocaleDateString("en-NZ", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {topic._count.replies}{" "}
                  {topic._count.replies === 1 ? "echo" : "echoes"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Link
                href={`/forum/${topic.id}`}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 transition group-hover:-rotate-6 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                aria-label={`Read ${topic.title}`}
              >
                <ArrowUpRight className="h-5 w-5" />
              </Link>
              {userRole === "admin" && <TopicActions topicId={topic.id} />}
            </div>
          </article>
        ))}
        {loading &&
          hasMore &&
          Array.from({ length: 2 }).map((_, i) => (
            <ForumTopicSkeleton key={i} />
          ))}
      </div>
      <div
        ref={loaderRef}
        className="flex min-h-20 items-center justify-center"
      >
        {loading && (
          <span className="font-pixel-dot text-[11px] uppercase tracking-widest text-foreground/45">
            loading more
          </span>
        )}
        {!hasMore && topics.length > 0 && (
          <div className="font-pixel-dot flex items-center gap-3 text-[11px] uppercase tracking-widest text-foreground/35">
            <span className="h-px w-8 bg-foreground/20" />
            <span>End of the wall</span>
            <span className="h-px w-8 bg-foreground/20" />
          </div>
        )}
      </div>
    </section>
  );
}
