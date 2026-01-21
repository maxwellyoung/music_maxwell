"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";

interface TopicResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string | null;
}

export function NewTopicForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [anonName, setAnonName] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      const response = await fetch("/api/forum/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          anonName: session?.user ? null : anonName || null,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to create topic";
        if (response.status === 400) {
          try {
            const data = await response.json();
            errorMsg = data.error || errorMsg;
          } catch {}
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as TopicResponse;
      toast({ description: "Posted" });
      router.push(`/forum/${data.id}`);
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Sign-in hint for anonymous users */}
      {!session?.user && (
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
          <p className="text-sm text-muted-foreground">
            Posting anonymously.{" "}
            <button
              type="button"
              onClick={() => signIn("google")}
              className="text-foreground underline underline-offset-2 hover:no-underline"
            >
              Sign in
            </button>
            {" "}for attribution.
          </p>
          <input
            type="text"
            value={anonName}
            onChange={(e) => setAnonName(e.target.value)}
            placeholder="Optional nickname…"
            maxLength={30}
            className="mt-3 w-full border-0 border-b border-foreground/10 bg-transparent py-2 text-sm placeholder:text-muted-foreground/30 focus:border-foreground/20 focus:outline-none"
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="sr-only">Topic title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Title…"
          required
          disabled={isLoading}
          autoFocus
          className="w-full border-0 border-b border-foreground/10 bg-transparent py-3 text-xl font-medium tracking-tight placeholder:text-muted-foreground/30 focus:border-foreground/20 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="sr-only">Topic content</label>
        <textarea
          id="content"
          name="content"
          placeholder="What's on your mind…"
          required
          disabled={isLoading}
          rows={8}
          className="w-full resize-none border-0 bg-transparent text-foreground/80 leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-foreground/5 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="text-sm text-muted-foreground/40 transition-colors hover:text-muted-foreground/60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
