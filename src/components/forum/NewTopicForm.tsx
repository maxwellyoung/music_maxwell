"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LockKeyhole, Sparkles } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

interface TopicResponse {
  id: string;
}

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;
const DRAFT_KEY = "maxwell-notes-draft";

const prompts = [
  {
    label: "a favourite line",
    title: "the line I kept",
    content: "the line that followed me home was...",
  },
  {
    label: "a false alarm",
    title: "false alarm",
    content: "for a second I thought...",
  },
  {
    label: "after the song",
    title: "when it ended",
    content: "the room felt different because...",
  },
];

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
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            New fragment
          </p>
          <h1 className="mb-3 mt-3 text-5xl leading-[0.92] tracking-[-0.05em] sm:text-7xl">
            Leave one.
          </h1>
          <p className="font-reenie text-4xl leading-none text-foreground/60">
            write it before it disappears
          </p>
        </div>

        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-foreground/40">
            Need a way in?
          </p>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => {
                  setTitle(prompt.title);
                  setContent(prompt.content);
                }}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-foreground/20 px-4 text-sm text-foreground/65 transition hover:-rotate-1 hover:border-primary hover:bg-primary hover:text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <div className="mb-2 flex items-end justify-between gap-4">
              <label
                htmlFor="title"
                className="text-xs font-bold uppercase tracking-[0.18em]"
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
              className="h-16 w-full rounded-none border-0 border-b-2 border-foreground bg-transparent px-0 text-2xl shadow-none placeholder:text-foreground/20 focus:border-primary focus:ring-0"
              aria-describedby="title-count"
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between gap-4">
              <label
                htmlFor="content"
                className="text-xs font-bold uppercase tracking-[0.18em]"
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
              className="min-h-[260px] w-full resize-y rounded-none border border-foreground/25 bg-white/25 px-5 py-4 text-lg leading-relaxed shadow-none placeholder:text-foreground/20 focus:border-primary focus:ring-primary"
              aria-describedby="content-count"
            />
          </div>

          {!session && status !== "loading" && (
            <div className="bg-accent/8 flex gap-3 border-l-2 border-accent px-4 py-3 text-sm leading-relaxed text-foreground/65">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Your draft will wait here while Google signs you in.
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-foreground/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="min-h-11 text-left text-xs font-bold uppercase tracking-[0.16em] text-foreground/45 transition hover:text-foreground"
            >
              Keep it to myself
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValid || status === "loading"}
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-foreground px-6 text-xs font-bold uppercase tracking-[0.18em] text-background transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-35"
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
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground/40">
          Live preview
        </p>
        <div className="relative mx-auto max-w-md rotate-[1.5deg] bg-[#ff789a] px-7 pb-10 pt-8 shadow-[10px_14px_0_rgba(17,16,15,0.12)] transition-transform duration-300 hover:rotate-0 sm:px-9 sm:pb-14">
          <span className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-2 bg-[#d9ff5f]/85 mix-blend-multiply" />
          <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.22em] text-black/45">
            a note from you
          </p>
          <h2 className="mb-5 break-words text-4xl leading-[0.95] tracking-[-0.045em] text-black sm:text-5xl">
            {previewTitle}
          </h2>
          <p className="whitespace-pre-wrap break-words text-lg leading-relaxed text-black/65">
            {previewContent}
          </p>
        </div>
        <p className="font-reenie mt-8 text-center text-3xl leading-none text-foreground/45">
          links become playable in replies
        </p>
      </aside>
    </div>
  );
}
