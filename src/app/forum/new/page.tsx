import type { Metadata } from "next";
import { NewTopicForm } from "~/components/forum/NewTopicForm";

export const metadata: Metadata = {
  title: "New Topic | Maxwell Young Forum",
  description: "Start a new discussion in the Maxwell Young forum.",
};

export default function NewTopicPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            New Discussion
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your thoughts and start a conversation
          </p>
        </div>

        <NewTopicForm />
      </div>
    </main>
  );
}
