import type { Metadata } from "next";
import Link from "next/link";
import LedgerWordmark from "~/components/LedgerWordmark";
import { NewTopicForm } from "~/components/forum/NewTopicForm";

export const metadata: Metadata = {
  title: "New Note | Maxwell Young",
  description: "Post a note around Maxwell Young releases.",
  alternates: { canonical: "/forum/new" },
  robots: { index: false, follow: false },
};

export default async function NewTopicPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; content?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="ledger min-h-svh bg-(--ledger-paper) text-(--ledger-ink)">
      <header className="flex items-baseline justify-between px-6 pt-10 sm:px-12 lg:px-20">
        <Link
          href="/"
          className="leading-none transition hover:opacity-60"
          aria-label="Maxwell Young — index"
        >
          <LedgerWordmark />
        </Link>
        <Link
          href="/forum"
          className="text-sm leading-none text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
        >
          ← the wall
        </Link>
      </header>
      <div className="px-6 pb-20 pt-16 sm:px-12 lg:px-20">
        <div className="max-w-2xl">
          <NewTopicForm
            initialTitle={resolvedSearchParams.title}
            initialContent={resolvedSearchParams.content}
          />
        </div>
      </div>
    </main>
  );
}
