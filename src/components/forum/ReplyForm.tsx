"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
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

  if (status === "loading") {
    return (
      <div className="mt-10 flex items-center justify-center border-t border-white/20 py-10">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#8ea6ff] border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mt-12 border-t border-white/20 pt-10">
        <p className="font-pixel-dot text-[11px] uppercase tracking-widest text-[#8ea6ff]">
          Add your voice
        </p>
        <h3 className="font-pixel-line mb-3 mt-2 text-3xl text-white">
          leave an echo.
        </h3>
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/50">
          Sign in to reply. Your username appears beside anything you leave on
          the wall.
        </p>
        <Button
          onClick={() => signIn()}
          className="font-pixel-dot h-12 rounded-none bg-white px-6 text-[11px] uppercase tracking-widest text-black hover:bg-[#8ea6ff]"
          aria-label="Sign in to reply to this topic"
        >
          Sign in to reply
        </Button>
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
        let errorMsg = "Could not post reply.";
        if (res.status === 400) {
          try {
            const data = await res.json();
            if (data.error?.toLowerCase().includes("inappropriate")) {
              errorMsg = "Your reply contains inappropriate language.";
            } else {
              errorMsg = data.error ?? errorMsg;
            }
          } catch {}
        }
        throw new Error(errorMsg);
      }
      setContent("");
      toast({ title: "Reply posted!" });
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Could not post reply.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const charCount = content.length;
  const maxChars = 5000;

  return (
    <div className="mt-12 border-t border-white/20 pt-10">
      <p className="font-pixel-dot text-[11px] uppercase tracking-widest text-[#8ea6ff]">
        Add your voice
      </p>
      <h3 className="font-pixel-line mb-6 mt-2 text-3xl text-white">
        leave an echo.
      </h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Textarea
            placeholder="type it before it disappears..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
            aria-label="Reply content"
            className="min-h-[150px] resize-y rounded-none border border-white/25 bg-white/5 text-white shadow-none placeholder:text-white/25 focus:border-[#8ea6ff] focus:ring-[#8ea6ff]"
            maxLength={maxChars}
          />
          <div className="flex justify-end">
            <span
              className={`text-xs ${
                charCount > maxChars * 0.9
                  ? "text-destructive"
                  : "text-white/35"
              }`}
            >
              {charCount.toLocaleString()} / {maxChars.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !content.trim()}
            aria-label={isLoading ? "Posting reply" : "Post reply"}
            className="font-pixel-dot rounded-none bg-white px-7 text-[11px] uppercase tracking-widest text-black hover:bg-[#8ea6ff]"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Pinning...
              </>
            ) : (
              "Pin reply"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
