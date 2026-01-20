"use client";

import { useEffect, useState, useCallback } from "react";

// Simple ID generator (crypto.randomUUID fallback)
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const SESSION_KEY = "listening-session";

export type ListenTime = {
  trackId: string;
  seconds: number;
};

export type ListeningSessionData = {
  sessionId: string;
  pseudonym: string;
  currentTrackId: string | null;
  currentPosition: number;
  listenTime: ListenTime[];
};

export function useListeningSession(roomSlug: string) {
  const [session, setSession] = useState<ListeningSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get or create session token
  const getSessionToken = useCallback(() => {
    if (typeof window === "undefined") return null;

    const storageKey = `${SESSION_KEY}-${roomSlug}`;
    let token = localStorage.getItem(storageKey);

    if (!token) {
      token = generateId();
      localStorage.setItem(storageKey, token);
    }

    return token;
  }, [roomSlug]);

  // Initialize session
  useEffect(() => {
    async function initSession() {
      const token = getSessionToken();
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/rooms/${roomSlug}/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: token }),
        });

        if (!res.ok) {
          throw new Error("Failed to create session");
        }

        const data = await res.json();
        setSession({
          sessionId: data.sessionId,
          pseudonym: data.pseudonym,
          currentTrackId: data.currentTrackId,
          currentPosition: data.currentPosition,
          listenTime: data.listenTime || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    void initSession();
  }, [roomSlug, getSessionToken]);

  // Update playback position
  const updatePosition = useCallback(
    async (trackId: string, position: number) => {
      const token = getSessionToken();
      if (!token) return;

      try {
        await fetch(`/api/rooms/${roomSlug}/position`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: token, trackId, position }),
        });
      } catch (err) {
        console.error("Failed to update position:", err);
      }
    },
    [roomSlug, getSessionToken]
  );

  // Record listen time
  const recordListenTime = useCallback(
    async (trackId: string, seconds: number) => {
      const token = getSessionToken();
      if (!token || seconds <= 0) return;

      try {
        const res = await fetch(`/api/rooms/${roomSlug}/listen-time`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: token, trackId, seconds }),
        });

        if (res.ok) {
          const data = await res.json();
          // Update local listen time
          setSession((prev) => {
            if (!prev) return prev;
            const existing = prev.listenTime.find(
              (lt) => lt.trackId === trackId
            );
            if (existing) {
              return {
                ...prev,
                listenTime: prev.listenTime.map((lt) =>
                  lt.trackId === trackId
                    ? { ...lt, seconds: data.totalSeconds }
                    : lt
                ),
              };
            } else {
              return {
                ...prev,
                listenTime: [
                  ...prev.listenTime,
                  { trackId, seconds: data.totalSeconds },
                ],
              };
            }
          });
        }
      } catch (err) {
        console.error("Failed to record listen time:", err);
      }
    },
    [roomSlug, getSessionToken]
  );

  // Get listen time for a track
  const getListenTime = useCallback(
    (trackId: string): number => {
      if (!session) return 0;
      const lt = session.listenTime.find((l) => l.trackId === trackId);
      return lt?.seconds ?? 0;
    },
    [session]
  );

  return {
    session,
    isLoading,
    error,
    sessionToken: getSessionToken(),
    updatePosition,
    recordListenTime,
    getListenTime,
  };
}
