"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import ConfirmModal from "./ConfirmModal";
import { Trash2 } from "lucide-react";

interface TopicActionsProps {
  topicId: string;
}

export default function TopicActions({ topicId }: TopicActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/forum/topics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      if (!res.ok) throw new Error("Failed to delete topic");
      toast({ title: "Topic deleted successfully" });
      router.push("/forum");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  }

  function cancelDelete() {
    setConfirmOpen(false);
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="group ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-transparent p-0 text-muted-foreground transition hover:border-destructive hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/40"
        aria-label="Delete Topic"
        title="Delete Topic"
      >
        {isDeleting ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>

      <ConfirmModal
        open={confirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this topic? This action cannot be undone."
      />
    </>
  );
}
