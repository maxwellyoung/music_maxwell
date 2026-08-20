"use client";

import { useEffect, useRef, useState } from "react";
import { pause, play, state } from "~/lib/ledgerPlayer";

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
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const frame = useRef(0);

  // Track the shared player; this control only owns its own src.
  useEffect(() => {
    const onPlayer = (event: Event) => {
      const detail = (event as CustomEvent<{ src: string; playing: boolean }>)
        .detail;
      setPlaying(detail.playing && detail.src === src);
    };
    window.addEventListener("ledger:player", onPlayer);
    return () => window.removeEventListener("ledger:player", onPlayer);
  }, [src]);

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const s = state();
      if (s.src === src) {
        setTime(s.time);
        if (s.duration) setDuration(s.duration);
      }
      frame.current = window.requestAnimationFrame(tick);
    };
    frame.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame.current);
  }, [playing, src]);

  // The tab title plays along while this excerpt sounds.
  useEffect(() => {
    if (!title || !playing) return;
    const original = document.title;
    document.title = `▶ ${title} — Maxwell Young`;
    return () => {
      document.title = original;
    };
  }, [playing, title]);

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
          className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition-[text-decoration-color,transform] duration-150 [transition-timing-function:var(--ease-out-strong)] hover:decoration-(--ledger-ink) focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--ledger-ink) active:scale-[0.97]"
        >
          <span
            key={playing ? "pause" : "play"}
            className="label-morph inline-block"
          >
            {playing ? "❚❚ pause" : "▸ play excerpt"}
          </span>
        </button>
        <span
          className="tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]"
          aria-hidden="true"
        >
          {format(time)}
          {duration ? ` / ${format(duration)}` : ""}
        </span>
      </div>
      {/* A hairline keeps the time; scaleX only, smoothed between ticks. */}
      <div
        aria-hidden="true"
        className={`mt-3 h-px w-full overflow-hidden bg-[rgb(var(--ledger-ink-rgb)/0.12)] transition-opacity duration-300 ${
          playing || time > 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full w-full origin-left bg-(--ledger-ink)"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
