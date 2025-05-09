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
        throw new Error("Failed to create topic");
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
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-primary/10 transition-all duration-500">
      <Card className="card animate-fade-in w-full max-w-xl bg-background/80 p-10 shadow-xl backdrop-blur-lg">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight">
          Start a New Discussion
        </h1>
        <p className="mb-8 text-center text-base text-muted-foreground">
          Share your thoughts, ask a question, or start a conversation.
        </p>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter topic title"
              required
              disabled={isLoading}
              className="h-12 text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Content
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="What do you want to discuss?"
              required
              disabled={isLoading}
              className="min-h-[180px] text-base"
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="rounded-lg px-6 py-3 text-base font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-lg px-8 py-3 text-base font-semibold shadow-md"
            >
              {isLoading ? "Creating..." : "Create Topic"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
