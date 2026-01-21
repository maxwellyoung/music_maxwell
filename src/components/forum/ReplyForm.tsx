"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

export default function ReplyForm({
  topicId,
  onSuccess,
}: {
  topicId: string;
  onSuccess?: () => void;
}) {
  const { data: session, status } = useSession();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="border-t border-white/[0.04] pt-8">
        <button
          onClick={() => signIn()}
          className="text-sm text-muted-foreground/40 underline underline-offset-4 transition-colors hover:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:rounded"
        >
          Sign in to reply
        </button>
      </div>
    );
  }

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
        let errorMsg = "Could not post reply";
        if (res.status === 400) {
          try {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
          } catch {}
        }
        throw new Error(errorMsg);
      }
      setContent("");
      toast({ description: "Posted" });
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : "Could not post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/[0.04] pt-8">
      <textarea
        className="w-full resize-none border-0 bg-transparent text-foreground/80 leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        placeholder="Write a reply…"
        aria-label="Reply content"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        disabled={isLoading}
      />
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50"
        >
          {isLoading ? "Posting…" : "Reply"}
        </button>
      </div>
    </form>
  );
}
