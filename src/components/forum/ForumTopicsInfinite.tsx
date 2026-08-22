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

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function ForumTopicSkeleton() {
  return (
    <div className="animate-pulse border-b border-[rgb(var(--ledger-ink-rgb)/0.10)] py-3">
      <div className="h-4 w-1/2 bg-[rgb(var(--ledger-ink-rgb)/0.08)]" />
    </div>
  );
}

// The wall is ruled like the discography: one row per note, title on
// the left, who and when on the right, the whole row inverting on hover.
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
      // The rule at the bottom simply stays; a retry comes with the next scroll.
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
      {topics.length === 0 && !loading && (
        <p className="border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] pt-4 text-sm text-[rgb(var(--ledger-ink-rgb)/0.45)]">
          {query ? "Nothing matched." : "Nothing on the wall yet."}
        </p>
      )}
      {topics.length > 0 && (
        <ol className="border-t border-[rgb(var(--ledger-ink-rgb)/0.10)]">
          {topics.map((topic) => (
            <li key={topic.id} className="flex items-stretch">
              <Link
                href={`/forum/${topic.id}`}
                className="group flex min-w-0 flex-1 items-baseline justify-between gap-6 border-b border-[rgb(var(--ledger-ink-rgb)/0.10)] py-3 text-sm transition-colors duration-150 hover:bg-(--ledger-ink) hover:text-(--ledger-paper) focus-visible:bg-(--ledger-ink) focus-visible:text-(--ledger-paper) focus-visible:outline-hidden"
              >
                <span className="min-w-0 transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:translate-x-3 group-focus-visible:translate-x-3">
                  <span className="block truncate font-medium">
                    {topic.title}
                  </span>
                  <span className="mt-0.5 hidden truncate text-[rgb(var(--ledger-ink-rgb)/0.45)] transition-colors group-hover:text-[rgb(var(--ledger-paper-rgb)/0.60)] group-focus-visible:text-[rgb(var(--ledger-paper-rgb)/0.60)] sm:block">
                    {topic.content}
                  </span>
                </span>
                <span className="shrink-0 whitespace-nowrap tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)] transition-[color,transform] duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:-translate-x-3 group-hover:text-[rgb(var(--ledger-paper-rgb)/0.60)] group-focus-visible:-translate-x-3 group-focus-visible:text-[rgb(var(--ledger-paper-rgb)/0.60)]">
                  {topic.author?.username ?? "anonymous"} ·{" "}
                  {shortDate(topic.createdAt)}
                  {topic._count.replies > 0 && (
                    <>
                      {" · "}
                      {topic._count.replies}{" "}
                      {topic._count.replies === 1 ? "echo" : "echoes"}
                    </>
                  )}
                </span>
              </Link>
              {userRole === "admin" && (
                <span className="flex items-center border-b border-[rgb(var(--ledger-ink-rgb)/0.10)] pl-4">
                  <TopicActions topicId={topic.id} />
                </span>
              )}
            </li>
          ))}
          {loading &&
            hasMore &&
            Array.from({ length: 2 }).map((_, i) => (
              <li key={i}>
                <ForumTopicSkeleton />
              </li>
            ))}
        </ol>
      )}
      <div ref={loaderRef} className="min-h-12" aria-hidden="true" />
    </section>
  );
}
