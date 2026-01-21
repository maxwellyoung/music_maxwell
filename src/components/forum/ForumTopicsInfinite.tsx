"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  anonName?: string | null;
  _count: { replies: number };
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/forum/topics?skip=${topics.length}&take=${PAGE_SIZE}`
      );
      const data: { topics: ForumTopic[]; total: number } = await res.json();
      setTopics((prev) => [...prev, ...data.topics]);
      setHasMore(topics.length + data.topics.length < data.total);
    } catch {
      // silently handle
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

  useEffect(() => {
    const unsubscribe = subscribeToForumTopics((newTopic: ForumTopic) => {
      setTopics((prev) => {
        if (prev.some((t) => t.id === newTopic.id)) return prev;
        return [newTopic, ...prev];
      });
    });
    return unsubscribe;
  }, []);

  if (topics.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm tracking-wide text-muted-foreground">
          No discussions yet
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-1">
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: index * 0.03 }}
        >
          <Link href={`/forum/${topic.id}`} className="group block">
            <article className="relative border-b border-border py-6 transition-colors duration-300 hover:bg-muted/30">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  {/* Title */}
                  <h3 className="font-medium leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-foreground">
                    {topic.title}
                  </h3>

                  {/* Preview */}
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {topic.content}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                    <span className="transition-colors group-hover:text-foreground">
                      {topic.author?.username ?? topic.anonName ?? "anon"}
                    </span>
                    <span className="text-muted-foreground/50">·</span>
                    <span>{formatRelativeTime(topic.updatedAt)}</span>
                    {topic._count.replies > 0 && (
                      <>
                        <span className="text-muted-foreground/50">·</span>
                        <span>
                          {topic._count.replies}{" "}
                          {topic._count.replies === 1 ? "reply" : "replies"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Admin actions */}
                {userRole === "admin" && (
                  <div
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => e.preventDefault()}
                  >
                    <TopicActions topicId={topic.id} />
                  </div>
                )}
              </div>
            </article>
          </Link>
        </motion.div>
      ))}

      {/* Load more trigger */}
      <div ref={loaderRef} className="h-20" />

      {loading && (
        <div className="py-8 text-center">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border border-muted-foreground/40 border-t-muted-foreground" />
        </div>
      )}

      {!hasMore && topics.length > 0 && (
        <p className="py-12 text-center text-xs tracking-wide text-muted-foreground/60">
          end
        </p>
      )}
    </section>
  );
}
