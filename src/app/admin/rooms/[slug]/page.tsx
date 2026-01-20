"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";

type Track = {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  trackNumber: number;
  decayStartAt: string | null;
  isArchived: boolean;
};

type Room = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isActive: boolean;
  tracks: Track[];
};

export default function AdminRoomDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTrack, setShowAddTrack] = useState(false);

  // Auth check
  useEffect(() => {
    if (status === "loading") return;
    const user = session?.user as { role?: string } | undefined;
    if (!user || user.role !== "admin") {
      router.replace("/");
    }
  }, [session, status, router]);

  // Fetch room
  const fetchRoom = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/rooms/${slug}`);
      if (res.ok) {
        const data = (await res.json()) as Room;
        setRoom(data);
      } else {
        router.replace("/admin/rooms");
      }
    } catch (err) {
      console.error("Failed to fetch room:", err);
    } finally {
      setIsLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    if (slug) void fetchRoom();
  }, [slug, fetchRoom]);

  const deleteTrack = async (trackId: string) => {
    if (!confirm("Delete this track? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/rooms/${slug}/tracks/${trackId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        void fetchRoom();
      }
    } catch (err) {
      console.error("Failed to delete track:", err);
    }
  };

  const user = session?.user as { role?: string } | undefined;
  if (status === "loading" || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading room...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Room not found
      </div>
    );
  }

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/admin/rooms"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={14} />
        Back to Rooms
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{room.title}</h1>
          <p className="text-muted-foreground text-sm">/{room.slug}</p>
        </div>
        <Link
          href={`/rooms/${room.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 border rounded"
          target="_blank"
        >
          Preview Room
        </Link>
      </div>

      {/* Tracks section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Tracks</h2>
          <button
            onClick={() => setShowAddTrack(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90"
          >
            <Plus size={14} />
            Add Track
          </button>
        </div>

        {showAddTrack && (
          <AddTrackForm
            roomSlug={room.slug}
            nextTrackNumber={(room.tracks.length || 0) + 1}
            onClose={() => setShowAddTrack(false)}
            onAdded={() => {
              setShowAddTrack(false);
              void fetchRoom();
            }}
          />
        )}

        {room.tracks.length === 0 ? (
          <div className="text-center py-8 border rounded-lg text-muted-foreground">
            No tracks yet. Add your first track.
          </div>
        ) : (
          <div className="space-y-2">
            {room.tracks
              .sort((a, b) => a.trackNumber - b.trackNumber)
              .map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                >
                  <span className="text-muted-foreground w-6 text-center font-mono text-sm">
                    {track.trackNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(track.duration)}
                      {track.isArchived && " · archived"}
                      {track.decayStartAt && !track.isArchived && " · decaying"}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTrack(track.id)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                    title="Delete track"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}

function AddTrackForm({
  roomSlug,
  nextTrackNumber,
  onClose,
  onAdded,
}: {
  roomSlug: string;
  nextTrackNumber: number;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [trackNumber, setTrackNumber] = useState(nextTrackNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !audioUrl || duration <= 0) {
      setError("Please fill in all required fields and upload audio");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/rooms/${roomSlug}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          audioUrl,
          duration,
          trackNumber,
        }),
      });

      if (res.ok) {
        onAdded();
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to add track");
      }
    } catch {
      setError("Failed to add track");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get audio duration from uploaded file
  const handleAudioUploaded = (url: string) => {
    setAudioUrl(url);
    // Create temporary audio element to get duration
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(Math.round(audio.duration));
    });
  };

  return (
    <div className="mb-6 p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-medium mb-4">Add Track</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Track title"
            className="w-full px-3 py-2 border rounded bg-background"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Track Number</label>
          <input
            type="number"
            value={trackNumber}
            onChange={(e) => setTrackNumber(parseInt(e.target.value) || 1)}
            min={1}
            className="w-24 px-3 py-2 border rounded bg-background"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Audio File</label>
          {audioUrl ? (
            <div className="flex items-center gap-3 p-3 border rounded bg-muted/30">
              <audio src={audioUrl} controls className="h-8" />
              <span className="text-sm text-muted-foreground">
                {formatDuration(duration)}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAudioUrl("");
                  setDuration(0);
                }}
                className="text-xs text-muted-foreground hover:text-foreground ml-auto"
              >
                Remove
              </button>
            </div>
          ) : (
            <UploadButton
              endpoint="trackAudio"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) {
                  handleAudioUploaded(res[0].url);
                }
              }}
              onUploadError={(error: Error) => {
                setError(`Upload failed: ${error.message}`);
              }}
            />
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !audioUrl}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Track"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
