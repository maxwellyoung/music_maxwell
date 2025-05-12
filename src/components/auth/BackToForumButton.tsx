"use client";

export default function BackToForumButton() {
  return (
    <button
      className="mt-6 w-auto rounded bg-accent px-6 py-2 text-accent-foreground transition hover:bg-accent/80"
      onClick={() => (window.location.href = "/forum")}
    >
      Back to Forum
    </button>
  );
}
