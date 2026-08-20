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
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterFrame = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      window.cancelAnimationFrame(meterFrame.current);
      window.dispatchEvent(
        new CustomEvent("ledger:audio-level", { detail: 0 }),
      );
      audio?.pause();
    };
  }, []);

  // Broadcast the playback level so listening surfaces (the Sky Tower)
  // can move with the music. Wired lazily on first play.
  const startMeter = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!analyserRef.current) {
      try {
        const AudioContextCtor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextCtor) return;
        const context = new AudioContextCtor();
        const source = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(context.destination);
        analyserRef.current = analyser;
      } catch {
        return; // metering is decoration; playback still works
      }
    }
    const data = new Uint8Array(analyserRef.current.fftSize);
    const tick = () => {
      const analyser = analyserRef.current;
      const element = audioRef.current;
      if (!analyser || !element) return;
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const value of data) {
        const centered = (value - 128) / 128;
        sum += centered * centered;
      }
      const rms = Math.sqrt(sum / data.length);
      window.dispatchEvent(
        new CustomEvent("ledger:audio-level", { detail: Math.min(1, rms * 3) }),
      );
      if (!element.paused && !element.ended) {
        meterFrame.current = window.requestAnimationFrame(tick);
      } else {
        window.dispatchEvent(
          new CustomEvent("ledger:audio-level", { detail: 0 }),
        );
      }
    };
    meterFrame.current = window.requestAnimationFrame(tick);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
        startMeter();
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
        className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-(--ledger-ink) focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--ledger-ink)"
      >
        {playing ? "❚❚ pause" : "▸ play excerpt"}
      </button>
      <span className="tabular-nums text-[rgb(var(--ledger-ink-rgb)/0.40)]" aria-hidden="true">
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
