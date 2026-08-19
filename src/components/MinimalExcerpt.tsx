"use client";

import { useEffect, useRef, useState } from "react";

const format = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

// Text-only excerpt player so /r pages keep the ledger language
// instead of the browser's gray audio chrome.
export default function MinimalExcerpt({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="flex items-baseline gap-4 text-sm">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className="underline decoration-black/25 underline-offset-4 transition hover:decoration-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        {playing ? "❚❚ pause" : "▸ play excerpt"}
      </button>
      <span className="tabular-nums text-black/40" aria-hidden="true">
        {format(time)}
        {duration ? ` / ${format(duration)}` : ""}
      </span>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- instrumental music excerpt */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
      />
    </div>
  );
}
