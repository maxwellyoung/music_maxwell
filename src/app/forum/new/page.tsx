import type { Metadata } from "next";
import Link from "next/link";
import { NewTopicForm } from "~/components/forum/NewTopicForm";

export const metadata: Metadata = {
  title: "New Topic | Maxwell Young",
  description: "Start a discussion",
};

export default function NewTopicPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <Link
          href="/forum"
          className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground/40 transition-colors hover:text-muted-foreground/60"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Forum
        </Link>

        <header className="mb-12">
          <h1 className="text-lg font-medium tracking-tight">New discussion</h1>
        </header>

        <NewTopicForm />
      </div>
    </main>
  );
}
