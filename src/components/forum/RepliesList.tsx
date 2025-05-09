"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "~/components/ui/use-toast";

export default function RepliesList({ replies }: { replies: any[] }) {
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
    } catch (err) {
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
    } catch (err) {
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

  return (
    <div className="space-y-8">
      <ConfirmModal
        open={confirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this reply?"
      />
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-2xl">
            <div className="mb-4 text-lg font-semibold text-foreground">
              Report Reply
            </div>
            <textarea
              className="mb-4 w-full rounded border border-input bg-muted px-3 py-2 text-base text-foreground"
              rows={3}
              placeholder="Reason for reporting (required)"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              disabled={reportLoading}
            />
            <div className="flex justify-end gap-4">
              <button
                className="rounded-lg border border-input bg-muted px-4 py-2 font-medium text-muted-foreground hover:bg-muted/80"
                onClick={cancelReport}
                disabled={reportLoading}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow hover:bg-yellow-700"
                onClick={submitReport}
                disabled={reportLoading || !reportReason.trim()}
              >
                {reportLoading ? "Reporting..." : "Report"}
              </button>
            </div>
          </div>
        </div>
      )}
      {replies.map((reply) => (
        <Card
          key={reply.id}
          className="group overflow-hidden border bg-background/80 backdrop-blur-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold transition-colors group-hover:text-primary">
                {reply.author?.name ?? "Unknown"}
                {reply.author?.role === "admin" && (
                  <img
                    src="/icons/star.svg"
                    alt="Admin"
                    title="Admin"
                    className="ml-1 inline-block h-5 w-5"
                  />
                )}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {new Date(reply.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-muted-foreground">
              {reply.content}
            </p>
          </CardContent>
          <CardFooter className="flex gap-4">
            {(userRole === "admin" || userId === reply.authorId) && (
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(reply.id)}
                disabled={deletingId === reply.id}
              >
                {deletingId === reply.id ? "Deleting..." : "Delete"}
              </button>
            )}
            <button
              className="text-yellow-600 hover:underline"
              onClick={() => handleReport(reply.id)}
            >
              Report
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
