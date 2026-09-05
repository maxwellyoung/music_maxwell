"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  pause,
  play,
  state,
  serverState,
  stop,
  subscribe,
} from "~/lib/ledgerPlayer";

const format = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

// Text-only excerpt control over the shared ledger voice.
export default function MinimalExcerpt({
  src,
  title,
}: {
  src: string;
  title?: string;
}) {
  const player = useSyncExternalStore(subscribe, state, serverState);
  const ownsSource = player.src === src;
  const playing = ownsSource && player.playing;
  const time = ownsSource ? player.time : 0;
  const duration = ownsSource ? player.duration : null;
  const error = ownsSource ? player.error : null;

  // Leaving this control stops its excerpt. There is no invisible player
  // continuing on another page, and focus/hover never starts a new source.
  useEffect(() => () => stop(src), [src]);

  const toggle = () => {
    const s = state();
    if (s.playing && s.src === src) {
      pause();
    } else {
      void play(src);
    }
  };

  const progress = duration ? Math.min(time / duration, 1) : 0;

  return (
    <div className="max-w-sm">
      <div className="flex items-baseline gap-4 text-sm">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={`${playing ? "Pause" : "Play"} ${title ?? "audio"} excerpt`}
          className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition-[text-decoration-color,transform] duration-150 [transition-timing-function:var(--ease-out-strong)] hover:decoration-(--ledger-ink) focus-visible:ring-2 focus-visible:ring-(--ledger-ink) focus-visible:outline-hidden active:scale-[0.97]"
        >
          <span
            key={playing ? "pause" : "play"}
            className="label-morph inline-block"
          >
            {playing ? "❚❚ pause" : "▸ play excerpt"}
          </span>
        </button>
        <span
          className="text-(--ledger-secondary) tabular-nums"
          aria-hidden="true"
        >
          {format(time)}
          {duration ? ` / ${format(duration)}` : ""}
        </span>
      </div>
      {error && (
        <p role="status" className="mt-3 text-sm text-(--ledger-secondary)">
          {error}
        </p>
      )}
      {/* Media timeupdate events keep the control out of the animation loop. */}
      <div
        aria-hidden="true"
        className={`mt-3 h-px w-full overflow-hidden bg-[rgb(var(--ledger-ink-rgb)/0.12)] transition-opacity duration-300 ${
          playing || time > 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full w-full origin-left bg-(--ledger-ink) transition-transform duration-200 motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
