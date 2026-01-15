"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
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
      <Card className="mt-8 border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="mt-8 border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Join the Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Sign in to share your thoughts and join the conversation.
          </p>
          <Button
            onClick={() => signIn()}
            size="lg"
            className="w-full sm:w-auto"
            aria-label="Sign in to reply to this topic"
          >
            Sign in to reply
          </Button>
        </CardContent>
      </Card>
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
              errorMsg = data.error || errorMsg;
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
    <Card className="mt-8 border border-border/50 bg-background/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Add a Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isLoading}
              aria-label="Reply content"
              className="min-h-[120px] resize-y"
              maxLength={maxChars}
            />
            <div className="flex justify-end">
              <span
                className={`text-xs ${
                  charCount > maxChars * 0.9
                    ? "text-destructive"
                    : "text-muted-foreground"
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
            >
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Posting...
                </>
              ) : (
                "Post Reply"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
