"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "~/components/ui/use-toast";
import Link from "next/link";
import { pusherClient } from "~/lib/pusherClient";
import { renderRichContent } from "./richContent";

// Type for a reply
type Reply = {
  id: string;
  content: string;
  createdAt: string | Date;
  authorId: string;
  author?: {
    name?: string | null;
    role?: string | null;
    username?: string | null;
  };
};

export default function RepliesList({
  replies: initialReplies,
  topicId,
}: {
  replies: Reply[];
  topicId: string;
}) {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const userId = session?.user?.id;
  const router = useRouter();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [toReportId, setToReportId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);

  // router.refresh() re-renders the page with fresh replies; take them,
  // otherwise a just-pinned echo only shows up via Pusher or a reload.
  useEffect(() => {
    setReplies(initialReplies);
  }, [initialReplies]);

  useEffect(() => {
    // Subscribe to real-time new replies for this topic
    const channelName = `forum-replies-${topicId}`;
    const channel = pusherClient.subscribe(channelName);
    const handleNewReply = (reply: Reply) => {
      setReplies((prev) => {
        // Avoid duplicates
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
    setToDeleteId(replyId);
    setConfirmOpen(true);
  }
  async function confirmDelete() {
    if (!toDeleteId) return;
    setDeletingId(toDeleteId);
    setConfirmOpen(false);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId: toDeleteId }),
      });
      if (!res.ok) throw new Error("Failed to delete reply");
      router.refresh();
    } catch {
      toast({ title: "Failed to delete reply", variant: "destructive" });
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  }
  function cancelDelete() {
    setConfirmOpen(false);
    setToDeleteId(null);
  }

  function handleReport(replyId: string) {
    setToReportId(replyId);
    setReportOpen(true);
    setReportReason("");
  }
  async function submitReport() {
    if (!toReportId || !reportReason.trim()) return;
    setReportLoading(true);
    try {
      const res = await fetch("/api/forum/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId: toReportId, reason: reportReason }),
      });
      if (!res.ok) throw new Error("Failed to report reply");
      toast({
        title: "Reply reported",
        description: "Thank you for your feedback.",
      });
      setReportOpen(false);
      setToReportId(null);
      setReportReason("");
    } catch {
      toast({ title: "Failed to report reply", variant: "destructive" });
    } finally {
      setReportLoading(false);
    }
  }
  function cancelReport() {
    setReportOpen(false);
    setToReportId(null);
    setReportReason("");
  }

  const shortDate = (value: string | Date) =>
    new Date(value).toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <ConfirmModal
        open={confirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Take this echo down?"
        confirmLabel="take down"
      />
      {reportOpen && (
        <div
          className="ledger fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--ledger-paper-rgb)/0.85)] px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-reply-title"
        >
          <div className="w-full max-w-sm border border-[rgb(var(--ledger-ink-rgb)/0.20)] bg-(--ledger-paper) p-6 text-(--ledger-ink)">
            <label
              id="report-reply-title"
              htmlFor="report-reason"
              className="mb-3 block text-base leading-snug"
            >
              Report this echo. Say why.
            </label>
            <textarea
              id="report-reason"
              className="w-full rounded-none border border-[rgb(var(--ledger-ink-rgb)/0.20)] bg-transparent px-3 py-2 text-sm leading-6 text-(--ledger-ink) shadow-none focus:border-(--ledger-ink) focus:ring-0"
              rows={3}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              disabled={reportLoading}
            />
            <div className="mt-5 flex items-center justify-end gap-6 text-sm">
              <button
                type="button"
                className="text-[rgb(var(--ledger-ink-rgb)/0.45)] transition hover:text-(--ledger-ink)"
                onClick={cancelReport}
                disabled={reportLoading}
              >
                cancel
              </button>
              <button
                type="button"
                className="min-h-10 border border-(--ledger-ink) px-4 transition hover:bg-(--ledger-ink) hover:text-(--ledger-paper) disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-(--ledger-ink)"
                onClick={submitReport}
                disabled={reportLoading || !reportReason.trim()}
              >
                {reportLoading ? "reporting" : "report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {replies.length > 0 && (
        <ol className="mt-4">
          {replies.map((reply, index) => {
            const mine = userRole === "admin" || userId === reply.authorId;
            return (
              <li
                key={reply.id}
                className="grid gap-x-6 gap-y-3 border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] py-6 sm:grid-cols-[2.5rem_1fr]"
              >
                <span className="text-sm tabular-nums leading-7 text-[rgb(var(--ledger-ink-rgb)/0.30)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="mb-0 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      {reply.author?.username ? (
                        <Link
                          href={`/user/${reply.author.username}`}
                          className="text-(--ledger-ink) transition hover:text-[rgb(var(--ledger-ink-rgb)/0.60)]"
                        >
                          {reply.author.username}
                        </Link>
                      ) : (
                        <span>anonymous</span>
                      )}
                      {reply.author?.role === "admin" && (
                        <span className="text-[rgb(var(--ledger-ink-rgb)/0.30)]">
                          admin
                        </span>
                      )}
                      <span>{shortDate(reply.createdAt)}</span>
                    </span>
                    <span className="flex items-baseline gap-x-3 text-xs">
                      {mine && (
                        <button
                          type="button"
                          className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-(--ledger-ink) disabled:opacity-40"
                          onClick={() => handleDelete(reply.id)}
                          disabled={deletingId === reply.id}
                        >
                          {deletingId === reply.id ? "taking down" : "take down"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-(--ledger-ink)"
                        onClick={() => handleReport(reply.id)}
                      >
                        report
                      </button>
                    </span>
                  </p>
                  <div className="mt-3 whitespace-pre-wrap text-base leading-7 text-[rgb(var(--ledger-ink-rgb)/0.85)] [overflow-wrap:anywhere]">
                    {renderRichContent(reply.content)}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
