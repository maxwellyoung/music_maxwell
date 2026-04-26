import type { Metadata } from "next";
import Link from "next/link";
import { NewTopicForm } from "~/components/forum/NewTopicForm";
import { Button } from "~/components/ui/button";

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
    <main className="container mx-auto px-4 py-12 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/forum" passHref legacyBehavior>
            <Button
              variant="outline"
              className="px-5 py-2 text-base font-semibold"
            >
              ← Back to Notes
            </Button>
          </Link>
        </div>
        <NewTopicForm
          initialTitle={resolvedSearchParams.title}
          initialContent={resolvedSearchParams.content}
        />
      </div>
    </main>
  );
}
