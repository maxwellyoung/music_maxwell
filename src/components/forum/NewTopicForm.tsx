"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;

export function NewTopicForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

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
        title: "Topic created",
        description: "Your discussion has been posted successfully.",
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

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Start a New Discussion
          </CardTitle>
          <CardDescription>
            Share your thoughts, ask a question, or start a conversation with
            the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none"
              >
                Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="What's on your mind?"
                required
                disabled={isLoading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE_LENGTH}
                className="h-11"
                aria-describedby="title-count"
              />
              <div className="flex justify-end" id="title-count">
                <span
                  className={`text-xs ${
                    title.length > MAX_TITLE_LENGTH * 0.9
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {title.length} / {MAX_TITLE_LENGTH}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="content"
                className="text-sm font-medium leading-none"
              >
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="Share the details of your discussion..."
                required
                disabled={isLoading}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CONTENT_LENGTH}
                className="min-h-[200px] resize-y"
                aria-describedby="content-count"
              />
              <div className="flex justify-end" id="content-count">
                <span
                  className={`text-xs ${
                    content.length > MAX_CONTENT_LENGTH * 0.9
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {content.length.toLocaleString()} /{" "}
                  {MAX_CONTENT_LENGTH.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !isValid}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  "Create Topic"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
