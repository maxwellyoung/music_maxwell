"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Plus, Music } from "lucide-react";
import Link from "next/link";

type Room = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isActive: boolean;
  _count: { tracks: number };
};

export default function AdminRoomsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Auth check
  useEffect(() => {
    if (status === "loading") return;
    const user = session?.user as { role?: string } | undefined;
    if (!user || user.role !== "admin") {
      router.replace("/");
    }
  }, [session, status, router]);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/rooms");
      if (res.ok) {
        const data = (await res.json()) as { rooms?: Room[] };
        setRooms(data.rooms ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  const user = session?.user as { role?: string } | undefined;
  if (status === "loading" || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Listening Rooms</h1>
          <p className="text-muted-foreground text-sm">
            Manage rooms and tracks
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          <Plus size={16} />
          New Room
        </button>
      </div>

      {showCreateForm && (
        <CreateRoomForm
          onClose={() => setShowCreateForm(false)}
          onCreated={() => {
            setShowCreateForm(false);
            void fetchRooms();
          }}
        />
      )}

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading rooms...
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          No rooms yet. Create your first room.
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{room.title}</h3>
                  {!room.isActive && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  /{room.slug} · {room._count.tracks} track
                  {room._count.tracks !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/rooms/${room.slug}`}
                  className="p-2 hover:bg-muted rounded"
                  title="Manage tracks"
                >
                  <Music size={16} />
                </Link>
                <Link
                  href={`/rooms/${room.slug}`}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                  target="_blank"
                >
                  Preview
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function CreateRoomForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    setSlug(generated);
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
        }),
      });

      if (res.ok) {
        onCreated();
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to create room");
      }
    } catch {
      setError("Failed to create room");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-card">
      <h2 className="text-lg font-medium mb-4">Create New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Room title"
            className="w-full px-3 py-2 border rounded bg-background"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="room-slug"
            className="w-full px-3 py-2 border rounded bg-background font-mono text-sm"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL: /rooms/{slug || "..."}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this room"
            rows={2}
            className="w-full px-3 py-2 border rounded bg-background resize-none"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Room"}
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
