"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import ConfirmModal from "./ConfirmModal";

interface TopicActionsProps {
  topicId: string;
}

export default function TopicActions({ topicId }: TopicActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/forum/topics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      if (!res.ok) throw new Error("Failed to delete topic");
      toast({ title: "Note taken down." });
      router.push("/forum");
      router.refresh();
    } catch {
      toast({
        title: "Could not take the note down.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={isDeleting}
        className="text-xs text-[rgb(var(--ledger-ink-rgb)/0.40)] underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-(--ledger-ink) disabled:opacity-40"
      >
        {isDeleting ? "taking down" : "take down"}
      </button>

      <ConfirmModal
        open={confirmOpen}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        message="Take this note down? Its echoes go with it."
        confirmLabel="take down"
      />
    </>
  );
}
