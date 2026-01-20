"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "~/lib/utils";

export type Track = {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  trackNumber: number;
  decayState: "visible" | "fading" | "archived";
  isUnlocked?: boolean;
};

type RoomPlayerProps = {
  tracks: Track[];
  initialTrackId?: string | null;
  initialPosition?: number;
  onTimeUpdate?: (trackId: string, currentTime: number) => void;
  onTrackChange?: (trackId: string) => void;
  onPositionSync?: (trackId: string, position: number) => void;
  onListenTimeAccumulated?: (trackId: string, seconds: number) => void;
};

export function RoomPlayer({
  tracks,
  initialTrackId,
  initialPosition = 0,
  onTimeUpdate,
  onTrackChange,
  onPositionSync,
  onListenTimeAccumulated,
}: RoomPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    if (initialTrackId) {
      const idx = tracks.findIndex((t) => t.id === initialTrackId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track accumulated listen time for sync
  const listenTimeRef = useRef(0);

  const currentTrack = tracks[currentTrackIndex];
  const playableTracks = tracks.filter(
    (t) => t.decayState !== "archived" || t.isUnlocked
  );

  // Set initial position when track loads
  useEffect(() => {
    if (audioRef.current && isLoaded && initialPosition > 0 && currentTime === 0) {
      audioRef.current.currentTime = initialPosition;
    }
  }, [isLoaded, initialPosition, currentTime]);

  // Sync position every 10 seconds
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      if (audioRef.current && onPositionSync) {
        onPositionSync(currentTrack.id, audioRef.current.currentTime);
      }
      // Also sync accumulated listen time
      if (listenTimeRef.current > 0 && onListenTimeAccumulated) {
        onListenTimeAccumulated(currentTrack.id, listenTimeRef.current);
        listenTimeRef.current = 0;
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, onPositionSync, onListenTimeAccumulated]);

  // Track listen time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      listenTimeRef.current += 1;
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle track end - auto advance
  const handleEnded = useCallback(() => {
    // Sync remaining listen time
    if (listenTimeRef.current > 0 && onListenTimeAccumulated && currentTrack) {
      onListenTimeAccumulated(currentTrack.id, listenTimeRef.current);
      listenTimeRef.current = 0;
    }

    const nextIndex = currentTrackIndex + 1;
    const nextTrack = playableTracks[nextIndex];
    if (nextIndex < playableTracks.length && nextTrack) {
      const actualIndex = tracks.findIndex((t) => t.id === nextTrack.id);
      setCurrentTrackIndex(actualIndex);
      onTrackChange?.(nextTrack.id);
      setIsLoaded(false);
    } else {
      // End of playlist
      setIsPlaying(false);
    }
  }, [currentTrackIndex, playableTracks, tracks, currentTrack, onTrackChange, onListenTimeAccumulated]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (currentTrack) {
        onTimeUpdate?.(currentTrack.id, audioRef.current.currentTime);
      }
    }
  }, [currentTrack, onTimeUpdate]);

  // Handle metadata loaded
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoaded(true);
    }
  }, []);

  // Toggle play/pause
  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    // Check if track is locked
    if (currentTrack.decayState === "archived" && !currentTrack.isUnlocked) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      // Sync position on pause
      if (onPositionSync) {
        onPositionSync(currentTrack.id, audioRef.current.currentTime);
      }
      // Sync listen time on pause
      if (listenTimeRef.current > 0 && onListenTimeAccumulated) {
        onListenTimeAccumulated(currentTrack.id, listenTimeRef.current);
        listenTimeRef.current = 0;
      }
    } else {
      void audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack, onPositionSync, onListenTimeAccumulated]);

  // Select track (only if unlocked)
  const selectTrack = useCallback(
    (index: number) => {
      const track = tracks[index];
      if (!track) return;
      if (track.decayState === "archived" && !track.isUnlocked) return;

      // Sync current track's listen time before switching
      if (listenTimeRef.current > 0 && onListenTimeAccumulated && currentTrack) {
        onListenTimeAccumulated(currentTrack.id, listenTimeRef.current);
        listenTimeRef.current = 0;
      }

      setCurrentTrackIndex(index);
      setIsLoaded(false);
      setCurrentTime(0);
      onTrackChange?.(track.id);

      // Auto-play when selecting a track
      setTimeout(() => {
        if (audioRef.current) {
          void audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    },
    [tracks, currentTrack, onTrackChange, onListenTimeAccumulated]
  );

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        No tracks available
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Track list */}
      <div className="mb-6 space-y-1">
        {tracks.map((track, index) => {
          const isLocked = track.decayState === "archived" && !track.isUnlocked;
          const isCurrent = index === currentTrackIndex;

          return (
            <button
              key={track.id}
              onClick={() => selectTrack(index)}
              disabled={isLocked}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left transition-all rounded",
                isCurrent
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/50",
                track.decayState === "fading" && "opacity-60",
                isLocked && "opacity-30 cursor-not-allowed"
              )}
            >
              <span className="w-6 text-xs text-muted-foreground font-mono">
                {track.trackNumber.toString().padStart(2, "0")}
              </span>
              <span className="flex-1 truncate text-sm">{track.title}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {formatTime(track.duration)}
              </span>
              {isLocked && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  locked
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Player controls */}
      <div className="border-t pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium truncate flex-1">
            {currentTrack.title}
          </span>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Progress bar (visual only, no seeking) */}
        <div className="relative h-1 bg-muted rounded-full overflow-hidden mb-4">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Play button */}
        <div className="flex justify-center">
          <button
            onClick={togglePlayback}
            disabled={currentTrack.decayState === "archived" && !currentTrack.isUnlocked}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
    </div>
  );
}
