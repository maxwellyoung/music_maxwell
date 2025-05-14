import type { Metadata } from "next";
import Link from "next/link";
import { NewTopicForm } from "~/components/forum/NewTopicForm";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "New Topic | Maxwell Young Forum",
  description: "Start a new discussion in the Maxwell Young forum.",
};

export default function NewTopicPage() {
  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/forum" passHref legacyBehavior>
            <Button
              variant="outline"
              className="px-5 py-2 text-base font-semibold"
            >
              ← Back to Forum
            </Button>
          </Link>
        </div>
        <NewTopicForm />
      </div>
    </main>
  );
}
