"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";

interface TopicResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export function NewTopicForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      const response = await fetch("/api/forum/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to create topic. Please try again.";
        if (response.status === 400) {
          try {
            const data = await response.json();
            if (data.error?.toLowerCase().includes("inappropriate")) {
              errorMsg = "Your topic contains inappropriate language.";
            } else {
              errorMsg = data.error || errorMsg;
            }
          } catch {}
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as TopicResponse;
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
      router.push(`/forum/${data.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center transition-all duration-500">
      <Card className="card animate-fade-in w-full max-w-xl bg-background/80 p-4 shadow-xl backdrop-blur-lg transition-all duration-300 sm:p-6 md:p-10">
        <h1 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Start a New Discussion
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground sm:text-base">
          Share your thoughts, ask a question, or start a conversation.
        </p>
        <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-base"
            >
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter topic title"
              required
              disabled={isLoading}
              className="h-10 text-base font-medium transition-colors focus:ring-2 focus:ring-primary sm:h-12 sm:text-lg"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-base"
            >
              Content
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="What do you want to discuss?"
              required
              disabled={isLoading}
              className="min-h-[120px] text-sm transition-colors focus:ring-2 focus:ring-primary sm:min-h-[180px] sm:text-base"
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted sm:px-6 sm:py-3 sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg px-6 py-2 text-sm font-semibold shadow-md transition-colors hover:bg-primary/90 sm:px-8 sm:py-3 sm:text-base"
            >
              {isLoading ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
