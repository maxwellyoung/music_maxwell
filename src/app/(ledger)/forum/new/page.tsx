import type { Metadata } from "next";
import { NewTopicForm } from "~/components/forum/NewTopicForm";
import SquareShell from "~/components/forum/SquareShell";

export const metadata: Metadata = {
  title: "Leave a note — Maxwell Young",
  description: "Leave a note in the town square.",
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
    <SquareShell back={{ href: "/forum", label: "the square" }}>
      <div className="max-w-2xl">
        <NewTopicForm
          initialTitle={resolvedSearchParams.title}
          initialContent={resolvedSearchParams.content}
        />
      </div>
    </SquareShell>
  );
}
