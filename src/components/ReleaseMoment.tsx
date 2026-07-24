"use client";

import { memo, useEffect, useState } from "react";
import { getStreamingDestinations, type Song } from "~/data/releases";
import { trackSiteEvent } from "~/lib/analytics";
import {
  getReleasePhase,
  ONE_KISS_RELEASE_DATE,
  type ReleasePhase,
} from "~/lib/releasePhase";

type ReleaseMomentProps = {
  links: Song["links"];
  compact?: boolean;
  location?: "home" | "release_room";
};

function ReleaseMoment({
  links,
  compact = false,
  location,
}: ReleaseMomentProps) {
  const [phase, setPhase] = useState<ReleasePhase>("upcoming");
  const destinations = getStreamingDestinations({ links });

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
  const action = phase === "upcoming" ? "open the release" : "listen now";

  return (
    <div
      className={
        compact
          ? "font-pixel-dot w-full border border-[#f5f8ff] bg-[#f5f8ff] text-[#05070c]"
          : "font-pixel-dot w-full border-y border-current"
      }
    >
      <div className="flex min-h-11 items-center gap-2 px-4 text-[0.7rem] uppercase tracking-[0.1em]">
        <span aria-live="polite">{status}</span>
        <span aria-hidden="true">—</span>
        <span>{action}</span>
      </div>
      <div
        className={
          compact
            ? "flex flex-wrap border-t border-[#05070c]/20 px-4 py-2"
            : "border-current/20 flex flex-wrap border-t py-2"
        }
        aria-label={`${status} — ${action}`}
      >
        {destinations.map((destination) => (
          <a
            key={destination.service}
            href={destination.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackSiteEvent("streaming_destination_clicked", {
                release: "1kiss",
                service: destination.service,
                location: location ?? (compact ? "home" : "release_room"),
                state: phase,
              })
            }
            className={
              compact
                ? "group mr-4 inline-flex min-h-9 items-center gap-1.5 border-b border-[#05070c]/35 text-[0.68rem] uppercase tracking-[0.08em] transition hover:border-[#526dca] hover:text-[#526dca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526dca]"
                : "border-current/45 group mr-5 inline-flex min-h-10 items-center gap-1.5 border-b text-xs uppercase tracking-[0.08em] transition hover:border-[#526dca] hover:text-[#526dca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            }
            aria-label={`Listen on ${destination.label}`}
          >
            <span className="sm:hidden">
              {destination.shortLabel ?? destination.label}
            </span>
            <span className="hidden sm:inline">{destination.label}</span>
            <span
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default memo(ReleaseMoment);
