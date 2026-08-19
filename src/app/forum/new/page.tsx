import type { Metadata } from "next";
import Link from "next/link";
import { NewTopicForm } from "~/components/forum/NewTopicForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "New Note | Maxwell Young",
  description: "Post a note around Maxwell Young releases.",
};

export default async function NewTopicPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; content?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="notes-canvas min-h-screen px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <Link
          href="/forum"
          className="group mb-12 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground/50 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to the wall
        </Link>
        <NewTopicForm
          initialTitle={resolvedSearchParams.title}
          initialContent={resolvedSearchParams.content}
        />
      </div>
    </main>
  );
}
