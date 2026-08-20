"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
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
    <div className="animate-pulse border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] py-6">
      <div className="mb-3 h-5 w-2/3 bg-[rgb(var(--ledger-ink-rgb)/0.10)]" />
      <div className="h-4 w-1/2 bg-[rgb(var(--ledger-ink-rgb)/0.06)]" />
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
    <section aria-label="Notes" className="min-w-0">
      <div className="border-b border-[rgb(var(--ledger-ink-rgb)/0.10)]">
        {topics.length === 0 && (
          <div className="border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] py-12">
            <p className="text-base text-[rgb(var(--ledger-ink-rgb)/0.60)]">
              {query ? "No notes matched." : "No notes yet — be first."}
            </p>
            {query && (
              <p className="mt-2 text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">
                Try a shorter word or username.
              </p>
            )}
          </div>
        )}
        {topics.map((topic) => (
          <article
            key={topic.id}
            className="group relative border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] py-5"
          >
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/forum/${topic.id}`}
                className="min-w-0 flex-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--ledger-ink)"
              >
                <h3 className="mb-1 text-base font-medium leading-snug transition-colors group-hover:text-[rgb(var(--ledger-ink-rgb)/0.60)]">
                  {topic.title}
                </h3>
                <p className="max-w-prose text-sm leading-relaxed text-[rgb(var(--ledger-ink-rgb)/0.55)]">
                  {topic.content.length > 180
                    ? `${topic.content.slice(0, 180).trim()}…`
                    : topic.content}
                </p>
              </Link>
              {userRole === "admin" && <TopicActions topicId={topic.id} />}
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.35)]">
              {topic.author?.username ? (
                <Link
                  href={`/user/${topic.author.username}`}
                  className="relative z-10 transition-colors hover:text-(--ledger-ink)"
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
              <span>
                {topic._count.replies}{" "}
                {topic._count.replies === 1 ? "echo" : "echoes"}
              </span>
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
        className="flex min-h-16 items-center justify-center"
      >
        {loading && (
          <span className="text-xs text-[rgb(var(--ledger-ink-rgb)/0.40)]">
            loading more
          </span>
        )}
        {!hasMore && topics.length > 0 && (
          <span className="text-xs text-[rgb(var(--ledger-ink-rgb)/0.30)]">
            — end of the wall —
          </span>
        )}
      </div>
    </section>
  );
}
