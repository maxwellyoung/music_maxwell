"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";

interface TopicResponse {
  id: string;
}

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;
const DRAFT_KEY = "maxwell-notes-draft";

const field =
  "w-full rounded-none bg-transparent px-0 text-(--ledger-ink) shadow-none focus:ring-0 disabled:opacity-50";

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
        // The square explains itself (rate limits, busy wall, banned
        // words); relay that rather than a generic line.
        let errorMsg = "The note did not go up. Try again.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error?.toLowerCase().includes("inappropriate")) {
            errorMsg = "The wall does not take that language.";
          } else if (data.error && response.status !== 500) {
            errorMsg = data.error;
          }
        } catch {}
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as TopicResponse;
      window.sessionStorage.removeItem(DRAFT_KEY);
      toast({ title: "Pinned." });
      router.push(`/forum/${data.id}`);
    } catch (error) {
      toast({
        title: "Not pinned.",
        description:
          error instanceof Error ? error.message : "The note did not go up.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isValid = title.trim().length > 0 && content.trim().length > 0;
  const signedOut = !session && status !== "loading";

  return (
    <>
      <section aria-label="Leave a note">
        <h1 className="mb-0 text-xl font-normal leading-snug sm:text-2xl">
          <span className="font-semibold">Leave a note.</span>{" "}
          <span className="text-[rgb(var(--ledger-ink-rgb)/0.45)]">
            A heading, then whatever you want on the wall.
          </span>
        </h1>
      </section>

      <form onSubmit={onSubmit} className="mt-12 space-y-10">
        <div>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <label
              htmlFor="title"
              className="text-[rgb(var(--ledger-ink-rgb)/0.40)]"
            >
              heading
            </label>
            <span
              id="title-count"
              className={`text-xs tabular-nums ${
                title.length > MAX_TITLE_LENGTH * 0.9
                  ? "text-(--ledger-ink)"
                  : "text-[rgb(var(--ledger-ink-rgb)/0.30)]"
              }`}
            >
              {title.length} / {MAX_TITLE_LENGTH}
            </span>
          </div>
          <input
            id="title"
            name="title"
            required
            disabled={isLoading}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            autoComplete="off"
            className={`${field} h-14 border-0 border-b border-[rgb(var(--ledger-ink-rgb)/0.25)] text-xl font-medium focus:border-(--ledger-ink) sm:text-2xl`}
            aria-describedby="title-count"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <label
              htmlFor="content"
              className="text-[rgb(var(--ledger-ink-rgb)/0.40)]"
            >
              note
            </label>
            <span
              id="content-count"
              className={`text-xs tabular-nums ${
                content.length > MAX_CONTENT_LENGTH * 0.9
                  ? "text-(--ledger-ink)"
                  : "text-[rgb(var(--ledger-ink-rgb)/0.30)]"
              }`}
            >
              {content.length.toLocaleString()} /{" "}
              {MAX_CONTENT_LENGTH.toLocaleString()}
            </span>
          </div>
          <textarea
            id="content"
            name="content"
            required
            disabled={isLoading}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={MAX_CONTENT_LENGTH}
            rows={9}
            className={`${field} mt-3 resize-y border border-[rgb(var(--ledger-ink-rgb)/0.20)] px-4 py-3 text-base leading-7 focus:border-(--ledger-ink)`}
            aria-describedby="content-count"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-[rgb(var(--ledger-ink-rgb)/0.10)] pt-6 text-sm">
          <p className="mb-0 max-w-md leading-relaxed text-[rgb(var(--ledger-ink-rgb)/0.45)]">
            {signedOut ? (
              <>
                Goes up unsigned.{" "}
                <button
                  type="button"
                  onClick={() => {
                    window.sessionStorage.setItem(
                      DRAFT_KEY,
                      JSON.stringify({ title, content }),
                    );
                    void signIn("google", { callbackUrl: "/forum/new" });
                  }}
                  className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:text-(--ledger-ink) hover:decoration-(--ledger-ink)"
                >
                  Sign in
                </button>{" "}
                to put a name on it; the draft is kept.
              </>
            ) : session?.user ? (
              <>Signed as {session.user.name ?? "you"}.</>
            ) : null}
          </p>
          <span className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => router.push("/forum")}
              disabled={isLoading}
              className="text-[rgb(var(--ledger-ink-rgb)/0.45)] transition hover:text-(--ledger-ink)"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValid || status === "loading"}
              className="min-h-11 border border-(--ledger-ink) px-5 transition hover:bg-(--ledger-ink) hover:text-(--ledger-paper) disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-(--ledger-ink)"
            >
              {isLoading ? "pinning" : "pin it"}
            </button>
          </span>
        </div>
      </form>
    </>
  );
}
