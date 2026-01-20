"use client";

import { useState, useCallback } from "react";
import { useListeningSession } from "~/hooks/useListeningSession";
import { RoomPlayer, type Track } from "./RoomPlayer";
import { MarginaliaPanel } from "./MarginaliaPanel";
import { getDecayState, getUnlockTimeRequired } from "~/lib/rooms";
import { cn } from "~/lib/utils";

type RoomData = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  tracks: Array<{
    id: string;
    title: string;
    audioUrl: string;
    duration: number;
    trackNumber: number;
    releasedAt: string;
    decayStartAt: string | null;
    isArchived: boolean;
  }>;
};

type ListeningRoomProps = {
  room: RoomData;
};

export function ListeningRoom({ room }: ListeningRoomProps) {
  const {
    session,
    isLoading,
    error,
    sessionToken,
    updatePosition,
    recordListenTime,
    getListenTime,
  } = useListeningSession(room.slug);

  const [currentTrackId, setCurrentTrackId] = useState<string | null>(
    session?.currentTrackId ?? room.tracks[0]?.id ?? null
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [mobileView, setMobileView] = useState<"player" | "notes">("player");

  // Process tracks with decay state and unlock status
  const processedTracks: Track[] = room.tracks.map((track) => {
    const decayState = getDecayState({
      decayStartAt: track.decayStartAt ? new Date(track.decayStartAt) : null,
      isArchived: track.isArchived,
    });

    const requiredTime = getUnlockTimeRequired({
      duration: track.duration,
      isArchived: track.isArchived,
    });

    const listenTime = getListenTime(track.id);
    const isUnlocked = decayState !== "archived" || listenTime >= requiredTime;

    return {
      id: track.id,
      title: track.title,
      audioUrl: track.audioUrl,
      duration: track.duration,
      trackNumber: track.trackNumber,
      decayState,
      isUnlocked,
    };
  });

  // Handlers
  const handleTimeUpdate = useCallback(
    (trackId: string, time: number) => {
      setCurrentTime(time);
      if (trackId !== currentTrackId) {
        setCurrentTrackId(trackId);
      }
    },
    [currentTrackId]
  );

  const handleTrackChange = useCallback((trackId: string) => {
    setCurrentTrackId(trackId);
    setCurrentTime(0);
  }, []);

  const handlePositionSync = useCallback(
    (trackId: string, position: number) => {
      void updatePosition(trackId, position);
    },
    [updatePosition]
  );

  const handleListenTimeAccumulated = useCallback(
    (trackId: string, seconds: number) => {
      void recordListenTime(trackId, seconds);
    },
    [recordListenTime]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">
            Entering room...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-destructive">
          <p>Failed to enter room</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Room header */}
      <header className="border-b">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-medium">{room.title}</h1>
          {room.description && (
            <p className="text-muted-foreground mt-1">{room.description}</p>
          )}
        </div>
      </header>

      {/* Mobile view toggle */}
      <div className="lg:hidden border-b">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setMobileView("player")}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                mobileView === "player"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              Player
            </button>
            <button
              onClick={() => setMobileView("notes")}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                mobileView === "notes"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
            >
              Notes
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Desktop: side-by-side layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {/* Player section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <RoomPlayer
                tracks={processedTracks}
                initialTrackId={session?.currentTrackId}
                initialPosition={session?.currentPosition}
                onTimeUpdate={handleTimeUpdate}
                onTrackChange={handleTrackChange}
                onPositionSync={handlePositionSync}
                onListenTimeAccumulated={handleListenTimeAccumulated}
              />
            </div>
          </div>

          {/* Marginalia panel */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border h-[600px] flex flex-col">
              {currentTrackId ? (
                <MarginaliaPanel
                  trackId={currentTrackId}
                  currentTime={currentTime}
                  sessionToken={sessionToken}
                  pseudonym={session?.pseudonym ?? "Anonymous"}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Select a track to view notes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: tabbed layout */}
        <div className="lg:hidden">
          {mobileView === "player" ? (
            <div className="bg-card rounded-lg border p-4">
              <RoomPlayer
                tracks={processedTracks}
                initialTrackId={session?.currentTrackId}
                initialPosition={session?.currentPosition}
                onTimeUpdate={handleTimeUpdate}
                onTrackChange={handleTrackChange}
                onPositionSync={handlePositionSync}
                onListenTimeAccumulated={handleListenTimeAccumulated}
              />
            </div>
          ) : (
            <div className="bg-card rounded-lg border h-[calc(100vh-220px)] min-h-[400px] flex flex-col">
              {currentTrackId ? (
                <MarginaliaPanel
                  trackId={currentTrackId}
                  currentTime={currentTime}
                  sessionToken={sessionToken}
                  pseudonym={session?.pseudonym ?? "Anonymous"}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Select a track to view notes
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Session info (subtle footer) */}
      <footer className="border-t mt-8">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">
            Listening as <span className="font-mono">{session?.pseudonym}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
