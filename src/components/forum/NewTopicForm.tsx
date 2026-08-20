"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

interface TopicResponse {
  id: string;
}

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;
const DRAFT_KEY = "maxwell-notes-draft";

export function NewTopicForm({
  initialTitle = "",
  initialContent = "",
}: {
  initialTitle?: string;
  initialContent?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (initialTitle || initialContent) return;

    try {
      const draft = window.sessionStorage.getItem(DRAFT_KEY);
      if (!draft) return;
      const parsed = JSON.parse(draft) as { title?: string; content?: string };
      setTitle(parsed.title ?? "");
      setContent(parsed.content ?? "");
    } catch {
      window.sessionStorage.removeItem(DRAFT_KEY);
    }
  }, [initialContent, initialTitle]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      window.sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, content }),
      );
      await signIn("google", { callbackUrl: "/forum/new" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forum/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to pin this note. Please try again.";
        if (response.status === 400) {
          try {
            const data = await response.json();
            if (data.error?.toLowerCase().includes("inappropriate")) {
              errorMsg = "This note contains language the wall cannot accept.";
            } else {
              errorMsg = data.error ?? errorMsg;
            }
          } catch {}
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as TopicResponse;
      window.sessionStorage.removeItem(DRAFT_KEY);
      toast({
        title: "Pinned to the wall",
        description: "Your note is live.",
      });
      router.push(`/forum/${data.id}`);
    } catch (error) {
      toast({
        title: "Could not pin note",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isValid = title.trim().length > 0 && content.trim().length > 0;
  const previewTitle = title.trim() || "your line goes here";
  const previewContent = content.trim() || "something almost said...";

  return (
    <div className="grid gap-12 lg:grid-cols-[0.58fr_0.42fr] lg:gap-16">
      <div>
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.12em] text-[rgb(var(--ledger-ink-rgb)/0.45)]">
            New fragment
          </p>
          <h1 className="font-medium mb-3 mt-3 text-4xl leading-[0.9] sm:text-6xl">
            leave one<span className="text-[rgb(var(--ledger-ink-rgb)/0.45)]">.</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-foreground/55 sm:text-lg">
            A heading and whatever you want to leave behind.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <div className="mb-2 flex items-end justify-between gap-4">
              <label
                htmlFor="title"
                className="text-[11px] uppercase tracking-widest"
              >
                Heading
              </label>
              <span
                id="title-count"
                className={`text-xs ${
                  title.length > MAX_TITLE_LENGTH * 0.9
                    ? "text-destructive"
                    : "text-foreground/35"
                }`}
              >
                {title.length} / {MAX_TITLE_LENGTH}
              </span>
            </div>
            <input
              id="title"
              name="title"
              placeholder="bar lights / field smoke / highlights"
              required
              disabled={isLoading}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={MAX_TITLE_LENGTH}
              className="h-16 w-full rounded-none border-0 border-b-2 border-foreground bg-transparent px-0 text-2xl shadow-none placeholder:text-foreground/20 focus:border-(--ledger-ink) focus:ring-0"
              aria-describedby="title-count"
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between gap-4">
              <label
                htmlFor="content"
                className="text-[11px] uppercase tracking-widest"
              >
                Note
              </label>
              <span
                id="content-count"
                className={`text-xs ${
                  content.length > MAX_CONTENT_LENGTH * 0.9
                    ? "text-destructive"
                    : "text-foreground/35"
                }`}
              >
                {content.length.toLocaleString()} /{" "}
                {MAX_CONTENT_LENGTH.toLocaleString()}
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              placeholder="leave it here..."
              required
              disabled={isLoading}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={MAX_CONTENT_LENGTH}
              className="min-h-[260px] w-full resize-y rounded-none border border-foreground/25 bg-[rgb(var(--ledger-ink-rgb)/0.04)] px-5 py-4 text-lg leading-relaxed shadow-none placeholder:text-foreground/20 focus:border-(--ledger-ink) focus:ring-0"
              aria-describedby="content-count"
            />
          </div>

          {!session && status !== "loading" && (
            <div className="flex gap-3 border-l-2 border-(--ledger-ink) bg-[rgb(var(--ledger-ink-rgb)/0.04)] px-4 py-3 text-sm leading-relaxed text-foreground/65">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(var(--ledger-ink-rgb)/0.45)]" />
              Your draft will wait here while Google signs you in.
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-foreground/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="min-h-11 text-left text-[11px] uppercase tracking-widest text-foreground/45 transition hover:text-foreground"
            >
              Keep it to myself
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValid || status === "loading"}
              className="group inline-flex min-h-12 items-center justify-center gap-3 border border-foreground bg-foreground px-6 text-[11px] uppercase tracking-widest text-background transition hover:border-(--ledger-ink) hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isLoading
                ? "Pinning..."
                : session
                  ? "Pin to the wall"
                  : "Sign in & pin"}
              {!isLoading && (
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        </form>
      </div>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="relative mx-auto max-w-md border border-foreground/20 bg-[rgb(var(--ledger-ink-rgb)/0.04)] px-7 pb-10 pt-8 shadow-[7px_9px_0_rgba(49,87,236,0.12)] sm:px-9 sm:pb-14">
          <p className="mb-8 text-[10px] uppercase tracking-widest text-foreground/40">
            a note from you
          </p>
          <h2 className="font-medium mb-5 wrap-break-word text-3xl leading-[0.94] text-foreground sm:text-4xl">
            {previewTitle}
          </h2>
          <p className="whitespace-pre-wrap wrap-break-word text-lg leading-relaxed text-foreground/60">
            {previewContent}
          </p>
        </div>
      </aside>
    </div>
  );
}
