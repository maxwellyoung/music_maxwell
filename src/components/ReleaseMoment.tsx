"use client";

import { useEffect, useState } from "react";
import { trackSiteEvent } from "~/lib/analytics";
import {
  getReleasePhase,
  ONE_KISS_RELEASE_DATE,
  type ReleasePhase,
} from "~/lib/releasePhase";

type ReleaseMomentProps = {
  spotifyUrl: string;
  compact?: boolean;
};

export default function ReleaseMoment({
  spotifyUrl,
  compact = false,
}: ReleaseMomentProps) {
  const [phase, setPhase] = useState<ReleasePhase>("upcoming");

  useEffect(() => {
    const refresh = () =>
      setPhase(getReleasePhase(ONE_KISS_RELEASE_DATE, new Date()));
    refresh();
    const timeout = window.setInterval(refresh, 60000);
    return () => window.clearInterval(timeout);
  }, []);

  const status =
    phase === "upcoming"
      ? "July 24"
      : phase === "release_day"
        ? "out today"
        : "out now";
  const action = phase === "upcoming" ? "open on Spotify" : "listen on Spotify";

  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackSiteEvent("streaming_destination_clicked", {
          release: "1kiss",
          service: "spotify",
          location: compact ? "home" : "release_room",
          state: phase,
        })
      }
      className={
        compact
          ? "font-pixel-dot group flex min-h-12 w-full items-center gap-3 border border-[#f5f8ff] bg-[#f5f8ff] px-4 text-xs uppercase tracking-[0.1em] text-[#05070c] transition hover:border-[#8ea6ff] hover:bg-[#8ea6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          : "font-pixel-dot inline-flex min-h-12 w-fit items-center border border-current px-5 text-xs uppercase tracking-[0.1em] transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      }
      aria-label={`${status} — ${action}`}
    >
      <span aria-live="polite">{status}</span>
      <span aria-hidden="true">—</span>
      <span>{action}</span>
      <span
        className={compact ? "ml-auto transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "ml-2"}
        aria-hidden="true"
      >
        ↗
      </span>
    </a>
  );
}
