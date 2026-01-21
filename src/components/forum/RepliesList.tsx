"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";
import Link from "next/link";
import { pusherClient } from "~/lib/pusherClient";

type Reply = {
  id: string;
  content: string;
  createdAt: string | Date;
  authorId: string | null;
  anonName?: string | null;
  author?: {
    id?: string;
    name?: string | null;
    role?: string | null;
    username?: string | null;
  } | null;
};

type RepliesListProps = {
  replies: Reply[];
  topicId: string;
  initialHasMore?: boolean;
  initialCursor?: string | null;
  totalCount?: number;
};

function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RepliesList({
  replies: initialReplies,
  topicId,
  initialHasMore = false,
  initialCursor = null,
  totalCount,
}: RepliesListProps) {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const userId = session?.user?.id;
  const router = useRouter();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMoreReplies() {
    if (!hasMore || loadingMore || !cursor) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/forum/replies?topicId=${topicId}&cursor=${cursor}&limit=20`
      );
      if (!res.ok) throw new Error("Failed to load more replies");
      const data = (await res.json()) as {
        replies: Reply[];
        hasMore: boolean;
        nextCursor: string | null;
      };
      setReplies((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newReplies = data.replies.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newReplies];
      });
      setHasMore(data.hasMore);
      setCursor(data.nextCursor);
    } catch {
      toast({ description: "Failed to load replies", variant: "destructive" });
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const channelName = `forum-replies-${topicId}`;
    const channel = pusherClient.subscribe(channelName);
    const handleNewReply = (reply: Reply) => {
      setReplies((prev) => {
        if (prev.some((r) => r.id === reply.id)) return prev;
        return [...prev, reply];
      });
    };
    channel.bind("new-reply", handleNewReply);
    return () => {
      channel.unbind("new-reply", handleNewReply);
      pusherClient.unsubscribe(channelName);
    };
  }, [topicId]);

  async function handleDelete(replyId: string) {
    if (!confirm("Delete this reply?")) return;
    setDeletingId(replyId);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch {
      toast({ description: "Failed to delete", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  }

  if (replies.length === 0) {
    return (
      <p className="py-8 text-sm text-muted-foreground">No replies yet</p>
    );
  }

  return (
    <div className="space-y-6">
      {replies.map((reply) => (
        <article
          key={reply.id}
          className="group border-b border-border pb-6"
        >
          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
            {reply.author?.username ? (
              <Link
                href={`/user/${reply.author.username}`}
                className="transition-colors hover:text-foreground"
              >
                {reply.author.username}
              </Link>
            ) : (
              <span>{reply.anonName ?? "anon"}</span>
            )}
            {reply.author?.role === "admin" && (
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wider">
                mod
              </span>
            )}
            <span className="text-muted-foreground/50">·</span>
            <span>{formatRelativeTime(reply.createdAt)}</span>

            {(userRole === "admin" || userId === reply.authorId) && (
              <button
                onClick={() => handleDelete(reply.id)}
                disabled={deletingId === reply.id}
                className="ml-auto text-muted-foreground/50 opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
              >
                {deletingId === reply.id ? "..." : "delete"}
              </button>
            )}
          </div>

          <p className="whitespace-pre-wrap leading-relaxed text-foreground">
            {reply.content}
          </p>
        </article>
      ))}

      {hasMore && (
        <button
          onClick={loadMoreReplies}
          disabled={loadingMore}
          className="w-full py-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {loadingMore
            ? "Loading..."
            : `Load more (${replies.length}${totalCount ? ` of ${totalCount}` : ""})`}
        </button>
      )}
    </div>
  );
}
