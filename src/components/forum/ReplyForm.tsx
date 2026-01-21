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
  const [anonName, setAnonName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (status === "loading") return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          topicId,
          anonName: session?.user ? null : anonName || null,
        }),
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
      setAnonName("");
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
    <form onSubmit={handleSubmit} className="border-t border-foreground/5 pt-8">
      {/* Sign-in hint for anonymous users */}
      {!session?.user && (
        <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
          <input
            type="text"
            value={anonName}
            onChange={(e) => setAnonName(e.target.value)}
            placeholder="Nickname (optional)"
            maxLength={30}
            className="w-32 border-0 border-b border-foreground/10 bg-transparent py-1 text-sm placeholder:text-muted-foreground/30 focus:border-foreground/20 focus:outline-none"
          />
          <span className="text-muted-foreground/40">or</span>
          <button
            type="button"
            onClick={() => signIn("google")}
            className="text-foreground underline underline-offset-2 hover:no-underline"
          >
            sign in
          </button>
        </div>
      )}

      <textarea
        className="w-full resize-none border-0 bg-transparent text-foreground/80 leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none"
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
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Posting…" : "Reply"}
        </button>
      </div>
    </form>
  );
}
