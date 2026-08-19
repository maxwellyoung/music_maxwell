"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "~/components/ui/use-toast";
import { Trash, Flag } from "phosphor-react";
import Image from "next/image";
import Link from "next/link";
import { pusherClient } from "~/lib/pusherClient";

// Type for a reply
type Reply = {
  id: string;
  content: string;
  createdAt: string | Date;
  authorId: string;
  author?: {
    name?: string | null;
    role?: string | null;
    username?: string | null;
  };
};

// Utility to auto-link URLs and embed YouTube/SoundCloud
function renderRichContent(text: string) {
  if (!text) return null;
  // YouTube (match full URL, including extra params)
  const ytRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=([\w-]{11})([^\s]*)?|youtu\.be\/([\w-]{11})([^\s]*)?)/g;
  // SoundCloud
  const scRegex = /https?:\/\/soundcloud\.com\/[\w\-\/]+/g;
  // Spotify (track, album, playlist, episode)
  const spotifyRegex =
    /https?:\/\/(?:open\.)?spotify\.com\/(track|album|playlist|episode)\/([\w\d]+)(\?si=[\w\d]+)?/g;
  // Generic URL
  const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g;

  const parts: (string | JSX.Element)[] = [];
  const textCopy = text;

  // Helper to push plain text
  const pushText = (start: number, end: number) => {
    if (start < end) parts.push(textCopy.slice(start, end));
  };

  // Find all YouTube, SoundCloud, Spotify links and replace with embeds
  const regexes = [ytRegex, scRegex, spotifyRegex, urlRegex];
  let minIndex = -1;
  let minMatch: RegExpExecArray | null = null;
  let minType = -1;
  let cursor = 0;
  while (cursor < textCopy.length) {
    minIndex = -1;
    minMatch = null;
    minType = -1;
    for (let i = 0; i < regexes.length; i++) {
      const regex = regexes[i];
      if (!regex) continue;
      if (typeof regex.lastIndex === "number") {
        regex.lastIndex = cursor;
      }
      const m = typeof regex.exec === "function" ? regex.exec(textCopy) : null;
      if (
        m &&
        (minIndex === -1 || (typeof m.index === "number" && m.index < minIndex))
      ) {
        minIndex = m.index ?? -1;
        minMatch = m;
        minType = i;
      }
    }
    if (!minMatch) {
      pushText(cursor, textCopy.length);
      break;
    }
    pushText(cursor, minIndex);
    if (minMatch) {
      const url = minMatch[0] ?? null;
      if (!url) {
        cursor = minIndex + 1;
        continue;
      }
      if (minType === 0) {
        // YouTube
        let videoId: string | null = null;
        if (minMatch[1])
          videoId = minMatch[1]; // youtube.com/watch?v=...
        else if (minMatch[3]) videoId = minMatch[3]; // youtu.be/...
        if (videoId) {
          parts.push(
            <div
              key={minIndex + "yt"}
              className="my-5 overflow-hidden rounded-xl bg-black"
            >
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>,
          );
        }
      } else if (minType === 1) {
        // SoundCloud
        parts.push(
          <div
            key={minIndex + "sc"}
            className="my-5 overflow-hidden rounded-xl bg-white"
          >
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              title="SoundCloud player"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
            />
          </div>,
        );
      } else if (minType === 2) {
        // Spotify
        const type = minMatch[1];
        const id = minMatch[2];
        if (type && id) {
          parts.push(
            <div
              key={minIndex + "sp"}
              className="my-5 overflow-hidden rounded-xl"
            >
              <iframe
                src={`https://open.spotify.com/embed/${type}/${id}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title="Spotify player"
              />
            </div>,
          );
        }
      } else {
        // Generic URL
        parts.push(
          <a
            key={minIndex + "url"}
            href={url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[#8ea6ff] underline decoration-white/25 underline-offset-4"
          >
            {url}
          </a>,
        );
      }
      cursor = minIndex + (url ? url.length : 1);
    } else {
      cursor = minIndex + 1;
    }
  }
  return parts.map((part, i) =>
    typeof part === "string" ? <span key={i}>{part}</span> : part,
  );
}

export default function RepliesList({
  replies: initialReplies,
  topicId,
}: {
  replies: Reply[];
  topicId: string;
}) {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const userId = session?.user?.id;
  const router = useRouter();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [toReportId, setToReportId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);

  useEffect(() => {
    // Subscribe to real-time new replies for this topic
    const channelName = `forum-replies-${topicId}`;
    const channel = pusherClient.subscribe(channelName);
    const handleNewReply = (reply: Reply) => {
      setReplies((prev) => {
        // Avoid duplicates
        if (prev.some((r) => r.id === reply.id)) return prev;
        return [...prev, reply];
      });
    };
    channel.bind("new-reply", handleNewReply);
    return () => {
      channel.unbind("new-reply", handleNewReply);
      pusherClient.unsubscribe(channelName);
    };
  }, [topicId]);

  async function handleDelete(replyId: string) {
    setToDeleteId(replyId);
    setConfirmOpen(true);
  }
  async function confirmDelete() {
    if (!toDeleteId) return;
    setDeletingId(toDeleteId);
    setConfirmOpen(false);
    try {
      const res = await fetch("/api/forum/replies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId: toDeleteId }),
      });
      if (!res.ok) throw new Error("Failed to delete reply");
      router.refresh();
    } catch {
      toast({ title: "Failed to delete reply", variant: "destructive" });
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  }
  function cancelDelete() {
    setConfirmOpen(false);
    setToDeleteId(null);
  }

  function handleReport(replyId: string) {
    setToReportId(replyId);
    setReportOpen(true);
    setReportReason("");
  }
  async function submitReport() {
    if (!toReportId || !reportReason.trim()) return;
    setReportLoading(true);
    try {
      const res = await fetch("/api/forum/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId: toReportId, reason: reportReason }),
      });
      if (!res.ok) throw new Error("Failed to report reply");
      toast({
        title: "Reply reported",
        description: "Thank you for your feedback.",
      });
      setReportOpen(false);
      setToReportId(null);
      setReportReason("");
    } catch {
      toast({ title: "Failed to report reply", variant: "destructive" });
    } finally {
      setReportLoading(false);
    }
  }
  function cancelReport() {
    setReportOpen(false);
    setToReportId(null);
    setReportReason("");
  }

  return (
    <div className="space-y-8">
      <ConfirmModal
        open={confirmOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this reply?"
      />
      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-reply-title"
        >
          <div className="w-[calc(100%-2rem)] max-w-sm bg-[#f2ede4] p-8 text-[#11100f] shadow-2xl">
            <div
              id="report-reply-title"
              className="font-pixel-line mb-4 text-2xl"
            >
              report reply.
            </div>
            <textarea
              className="mb-4 w-full rounded-none border border-black/20 bg-transparent px-3 py-2 text-base text-[#11100f]"
              rows={3}
              placeholder="Reason for reporting (required)"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              disabled={reportLoading}
            />
            <div className="flex justify-end gap-4">
              <button
                className="border border-black/20 px-4 py-2 font-medium hover:bg-black/5"
                onClick={cancelReport}
                disabled={reportLoading}
              >
                Cancel
              </button>
              <button
                className="bg-[#11100f] px-4 py-2 font-semibold text-white hover:bg-black/80"
                onClick={submitReport}
                disabled={reportLoading || !reportReason.trim()}
              >
                {reportLoading ? "Reporting..." : "Report"}
              </button>
            </div>
          </div>
        </div>
      )}
      {replies.length === 0 && (
        <div className="border-b border-white/20 py-12">
          <p className="font-pixel-line text-2xl leading-none text-white/65">
            no echoes yet.
          </p>
          <p className="mt-3 text-sm text-white/40">
            There is room for the first response.
          </p>
        </div>
      )}
      {replies.map((reply, index) => (
        <article
          key={reply.id}
          className="group grid gap-5 border-b border-white/20 py-8 sm:grid-cols-[3.5rem_1fr] sm:gap-8 sm:py-10"
        >
          <div className="font-pixel-dot text-sm leading-none text-[#8ea6ff]">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="font-pixel-dot flex items-center gap-2 text-[11px] uppercase tracking-[0.1em]">
                {reply.author?.username ? (
                  <Link
                    href={`/user/${reply.author.username}`}
                    className="text-white transition hover:text-[#8ea6ff]"
                  >
                    @{reply.author.username}
                  </Link>
                ) : (
                  <span className="text-white/45">Unknown</span>
                )}
                {reply.author?.role === "admin" && (
                  <Image
                    src="/icons/star.svg"
                    alt="Admin"
                    title="Admin"
                    width={20}
                    height={20}
                    className="ml-1 inline-block invert"
                  />
                )}
              </div>
              <span className="font-pixel-dot text-[11px] uppercase tracking-[0.1em] text-white/35">
                {new Date(reply.createdAt).toLocaleDateString("en-NZ", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="text-white/72 whitespace-pre-wrap text-lg leading-relaxed">
              {renderRichContent(reply.content)}
            </div>
            <div className="mt-6 flex gap-3">
              {(userRole === "admin" || userId === reply.authorId) && (
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/35 transition-colors hover:border-red-400 hover:text-red-400"
                  onClick={() => handleDelete(reply.id)}
                  disabled={deletingId === reply.id}
                  title="Delete"
                  aria-label="Delete reply"
                >
                  {deletingId === reply.id ? (
                    <span className="text-xs">Deleting...</span>
                  ) : (
                    <Trash size={18} weight="regular" />
                  )}
                </button>
              )}
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/35 transition-colors hover:border-[#8ea6ff] hover:text-[#8ea6ff]"
                onClick={() => handleReport(reply.id)}
                title="Report"
                aria-label="Report reply"
              >
                <Flag size={18} weight="regular" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
