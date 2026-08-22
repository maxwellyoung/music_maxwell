"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

const MAX_CHARS = 5000;

export default function ReplyForm({
  topicId,
  onSuccess,
}: {
  topicId: string;
  onSuccess?: () => void;
}) {
  const { status } = useSession();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, topicId }),
      });
      if (!res.ok) {
        let errorMsg = "The echo did not go up. Try again.";
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error?.toLowerCase().includes("inappropriate")) {
            errorMsg = "The wall does not take that language.";
          } else if (data.error && res.status !== 500) {
            errorMsg = data.error;
          }
        } catch {}
        throw new Error(errorMsg);
      }
      setContent("");
      toast({ title: "Pinned." });
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      toast({
        title: "Not pinned.",
        description:
          err instanceof Error ? err.message : "The echo did not go up.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="mt-12 border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] pt-8"
      onSubmit={handleSubmit}
    >
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <label
          htmlFor="reply-content"
          className="text-[rgb(var(--ledger-ink-rgb)/0.40)]"
        >
          leave an echo
        </label>
        <span
          className={`text-xs tabular-nums ${
            content.length > MAX_CHARS * 0.9
              ? "text-(--ledger-ink)"
              : "text-[rgb(var(--ledger-ink-rgb)/0.30)]"
          }`}
        >
          {content.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>
      <textarea
        id="reply-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={isLoading}
        maxLength={MAX_CHARS}
        rows={5}
        className="mt-3 w-full resize-y rounded-none border border-[rgb(var(--ledger-ink-rgb)/0.20)] bg-transparent px-4 py-3 text-base leading-7 text-(--ledger-ink) shadow-none focus:border-(--ledger-ink) focus:ring-0 disabled:opacity-50"
      />
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !content.trim() || status === "loading"}
          className="min-h-11 border border-(--ledger-ink) px-5 text-sm transition hover:bg-(--ledger-ink) hover:text-(--ledger-paper) disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-(--ledger-ink)"
        >
          {isLoading ? "pinning" : "pin it"}
        </button>
      </div>
    </form>
  );
}
