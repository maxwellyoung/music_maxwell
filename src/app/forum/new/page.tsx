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
        <NewTopicForm />
      </div>
    </main>
  );
}
