"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { subscribeToMarginalia, type Marginalia } from "~/lib/pusherClient";
import { cn } from "~/lib/utils";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

type MarginaliaPanelProps = {
  trackId: string;
  currentTime: number;
  sessionToken: string | null;
  pseudonym: string;
};

type MarginaliaWithReplies = Marginalia & {
  isFaded?: boolean;
  replies?: Marginalia[];
};

export function MarginaliaPanel({
  trackId,
  currentTime,
  sessionToken,
  pseudonym,
}: MarginaliaPanelProps) {
  const { toast } = useToast();
  const [marginalia, setMarginalia] = useState<MarginaliaWithReplies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch initial marginalia
  useEffect(() => {
    async function fetchMarginalia() {
      try {
        const res = await fetch(`/api/tracks/${trackId}/marginalia`);
        if (res.ok) {
          const data = (await res.json()) as { marginalia?: MarginaliaWithReplies[] };
          setMarginalia(data.marginalia ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch marginalia:", err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchMarginalia();
  }, [trackId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToMarginalia(
      trackId,
      (newMarginalia) => {
        setMarginalia((prev) => {
          // Check for duplicates
          if (prev.some((m) => m.id === newMarginalia.id)) return prev;

          // If it's a reply, add to parent's replies
          if (newMarginalia.parentId) {
            return prev.map((m) =>
              m.id === newMarginalia.parentId
                ? { ...m, replies: [...(m.replies ?? []), newMarginalia] }
                : m
            );
          }

          // Add to list sorted by timestamp
          const updated = [...prev, { ...newMarginalia, replies: [] }];
          return updated.sort((a, b) => a.timestamp - b.timestamp);
        });
      },
      ({ marginaliaId }) => {
        setMarginalia((prev) =>
          prev.filter((m) => {
            if (m.id === marginaliaId) return false;
            // Also filter from replies
            if (m.replies) {
              m.replies = m.replies.filter((r) => r.id !== marginaliaId);
            }
            return true;
          })
        );
      }
    );

    return unsubscribe;
  }, [trackId]);

  // Submit new marginalia
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!sessionToken || !inputValue.trim() || isSubmitting) return;

      setIsSubmitting(true);
      try {
        const res = await fetch(`/api/tracks/${trackId}/marginalia`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionToken,
            content: inputValue.trim(),
            timestamp: currentTime,
            parentId: replyingTo,
          }),
        });

        if (res.ok) {
          setInputValue("");
          setReplyingTo(null);
        } else {
          const data = await res.json();
          toast({
            title: "Failed to post note",
            description: data.error || "Please try again",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Failed to submit marginalia:", err);
        toast({
          title: "Connection error",
          description: "Could not post note. Check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [sessionToken, inputValue, currentTime, trackId, replyingTo, isSubmitting, toast]
  );

  // Format timestamp as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if marginalia is near current playback position (within 5 seconds)
  const isNearCurrent = (timestamp: number) => {
    return Math.abs(timestamp - currentTime) < 5;
  };

  // Calculate days since creation
  const getDaysOld = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <MessageCircle size={14} />
          Marginalia
        </h3>
        <span className="text-xs text-muted-foreground">
          as {pseudonym}
        </span>
      </div>

      {/* Marginalia list */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {marginalia.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No notes yet. Be the first to leave a mark.
          </p>
        ) : (
          marginalia.map((m) => {
            const daysOld = getDaysOld(m.createdAt);
            const fadeOpacity = m.isFaded ? 0.4 : daysOld > 20 ? 0.6 : 1;

            return (
              <div
                key={m.id}
                className={cn(
                  "transition-all",
                  isNearCurrent(m.timestamp) && "ring-1 ring-primary/30 rounded"
                )}
                style={{ opacity: fadeOpacity }}
              >
                {/* Main note */}
                <div className="p-2 rounded bg-muted/30">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className={cn(
                        "text-xs font-mono",
                        m.isArtist ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {m.isArtist ? "artist" : m.pseudonym}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatTime(m.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{m.content}</p>
                  <button
                    onClick={() => setReplyingTo(m.id)}
                    className="text-[10px] text-muted-foreground hover:text-foreground mt-1"
                  >
                    reply
                  </button>
                </div>

                {/* Replies */}
                {m.replies && m.replies.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2 border-l border-muted pl-3">
                    {m.replies.map((reply) => (
                      <div key={reply.id} className="p-2 rounded bg-muted/20">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span
                            className={cn(
                              "text-xs font-mono",
                              reply.isArtist ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            {reply.isArtist ? "artist" : reply.pseudonym}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        {replyingTo && (
          <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
            <span>replying to note</span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="hover:text-foreground"
            >
              cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`note at ${formatTime(currentTime)}...`}
            maxLength={500}
            className="flex-1 bg-muted/50 rounded px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
