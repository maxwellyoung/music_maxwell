"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { subscribeToForumTopics } from "~/lib/pusherClient";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

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
    <section aria-label="Notes">
      {!query && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mb-0 text-xs font-bold uppercase tracking-[0.2em] text-foreground/45">
            Latest fragments
          </h2>
          <span className="font-reenie text-2xl leading-none text-primary">
            newest first
          </span>
        </div>
      )}
      <div className="border-b border-foreground/15">
        {topics.length === 0 && (
          <div className="border-t border-foreground/15 py-16">
            <p className="font-reenie text-4xl leading-none text-foreground/60">
              {query
                ? "nothing matched that scribble"
                : "nothing on the wall yet"}
            </p>
            <p className="mt-3 max-w-md text-sm text-foreground/45">
              {query
                ? "Try a lyric, username, or a shorter piece of the thought."
                : "Be the first person to pin something up."}
            </p>
          </div>
        )}
        {topics.map((topic, index) => (
          <motion.article
            key={topic.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.2) }}
            className="group relative grid gap-5 border-t border-foreground/15 py-8 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-7 sm:py-10"
          >
            <div className="font-reenie text-3xl leading-none text-primary/75">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="min-w-0">
              <Link
                href={`/forum/${topic.id}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <h3 className="mb-3 max-w-3xl text-3xl font-semibold leading-[1.02] tracking-[-0.035em] transition-colors group-hover:text-primary sm:text-4xl">
                  {topic.title}
                </h3>
                <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-foreground/60">
                  {topic.content.length > 240
                    ? `${topic.content.slice(0, 240).trim()}…`
                    : topic.content}
                </p>
              </Link>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-foreground/40">
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
          </motion.article>
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
          <span className="font-reenie text-2xl text-foreground/50">
            finding more fragments...
          </span>
        )}
        {!hasMore && topics.length > 0 && (
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-foreground/35">
            <span className="h-px w-8 bg-foreground/20" />
            <span>End of the wall</span>
            <span className="h-px w-8 bg-foreground/20" />
          </div>
        )}
      </div>
    </section>
  );
}
