"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
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
    return null;
  }

  if (!session) {
    return (
      <Card className="mt-12 border-2 border-primary/10 bg-background/80 shadow-md backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add a Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={() => signIn()}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Sign in to reply
          </button>
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
      if (!res.ok) throw new Error("Failed to post reply");
      setContent("");
      toast({ title: "Reply posted!" });
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not post reply.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mt-12 border-2 border-primary/10 bg-background/80 shadow-md backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add a Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-input bg-white px-4 py-3 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share your thoughts..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? "Posting..." : "Post Reply"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
