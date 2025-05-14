"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "~/components/ui/use-toast";
import React from "react";
import { Trash, Flag } from "phosphor-react";
import Image from "next/image";
import Link from "next/link";

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
            <div key={minIndex + "yt"} className="my-4">
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
          <div key={minIndex + "sc"} className="my-4">
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
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
            <div key={minIndex + "sp"} className="my-4">
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
            className="break-all text-primary underline"
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

export default function RepliesList({ replies }: { replies: Reply[] }) {
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
    } catch (err) {
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
    } catch (err) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-2xl">
            <div className="mb-4 text-lg font-semibold text-foreground">
              Report Reply
            </div>
            <textarea
              className="mb-4 w-full rounded border border-input bg-muted px-3 py-2 text-base text-foreground"
              rows={3}
              placeholder="Reason for reporting (required)"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              disabled={reportLoading}
            />
            <div className="flex justify-end gap-4">
              <button
                className="rounded-lg border border-input bg-muted px-4 py-2 font-medium text-muted-foreground hover:bg-muted/80"
                onClick={cancelReport}
                disabled={reportLoading}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white shadow hover:bg-yellow-700"
                onClick={submitReport}
                disabled={reportLoading || !reportReason.trim()}
              >
                {reportLoading ? "Reporting..." : "Report"}
              </button>
            </div>
          </div>
        </div>
      )}
      {replies.map((reply) => (
        <Card
          key={reply.id}
          className="group overflow-hidden border bg-background/80 backdrop-blur-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold transition-colors group-hover:text-primary">
                {reply.author?.username ? (
                  <Link
                    href={`/user/${reply.author.username}`}
                    className="text-primary hover:underline"
                  >
                    {reply.author.username}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Unknown</span>
                )}
                {reply.author?.role === "admin" && (
                  <Image
                    src="/icons/star.svg"
                    alt="Admin"
                    title="Admin"
                    width={20}
                    height={20}
                    className="ml-1 inline-block"
                  />
                )}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {new Date(reply.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base leading-relaxed text-muted-foreground">
              {renderRichContent(reply.content)}
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            {(userRole === "admin" || userId === reply.authorId) && (
              <button
                className="p-1 text-red-400 transition-colors hover:text-red-600"
                onClick={() => handleDelete(reply.id)}
                disabled={deletingId === reply.id}
                title="Delete"
              >
                {deletingId === reply.id ? (
                  <span className="text-xs">Deleting...</span>
                ) : (
                  <Trash size={18} weight="regular" />
                )}
              </button>
            )}
            <button
              className="p-1 text-yellow-700 transition-colors hover:text-yellow-600"
              onClick={() => handleReport(reply.id)}
              title="Report"
            >
              <Flag size={18} weight="regular" />
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
