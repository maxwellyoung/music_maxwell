"use client";

import { useEffect, useState } from "react";
import { trackSiteEvent } from "~/lib/analytics";

const RELEASE_AT = new Date("2026-07-23T23:00:00+12:00").getTime();

function isReleased() {
  return Date.now() >= RELEASE_AT;
}

type ReleaseMomentProps = {
  spotifyUrl: string;
  compact?: boolean;
};

export default function ReleaseMoment({
  spotifyUrl,
  compact = false,
}: ReleaseMomentProps) {
  const [released, setReleased] = useState(false);

  useEffect(() => {
    const refresh = () => setReleased(isReleased());
    refresh();
    const timeout = window.setInterval(refresh, 30000);
    return () => window.clearInterval(timeout);
  }, []);

  if (!released) {
    return (
      <div className={compact ? "flex items-center gap-3" : "grid gap-3"}>
        <span className="font-pixel-dot text-[10px] uppercase tracking-[0.12em] text-[#b7c8eb]">
          lands Thu 11pm NZST
        </span>
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackSiteEvent("streaming_destination_clicked", {
              release: "1kiss",
              service: "spotify",
              location: compact ? "home" : "release_room",
              state: "pre_release",
            })
          }
          className="font-pixel-dot w-fit border-b border-current pb-1 text-xs uppercase tracking-widest transition hover:text-[#8ea6ff] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-current"
        >
          open on Spotify ↗
        </a>
      </div>
    );
  }

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
          state: "out_now",
        })
      }
      className="font-pixel-dot inline-flex min-h-12 w-fit items-center border border-current px-5 text-xs uppercase tracking-widest transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-current"
    >
      out now — listen on Spotify ↗
    </a>
  );
}
