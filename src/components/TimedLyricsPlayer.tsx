"use client";

import { Pause, Play } from "lucide-react";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type { TimedLyricsRecord } from "~/data/timedLyrics";
import { getTimedLyricFrame, type TimedLyricLine } from "~/lib/timedLyrics";
import { trackSiteEvent } from "~/lib/analytics";
import styles from "./TimedLyricsPlayer.module.css";

function clockTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0")}:${(safeSeconds % 60).toString().padStart(2, "0")}`;
}

export default function TimedLyricsPlayer({
  record,
  release,
  id,
}: {
  record: TimedLyricsRecord;
  release: string;
  id?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrame = useRef(0);
  const started = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = getTimedLyricFrame(record.lines, currentTime);
  const progress = Math.min(currentTime / record.duration, 1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing) return;

    const update = () => {
      setCurrentTime(audio.currentTime);
      if (!audio.paused && !audio.ended) {
        animationFrame.current = window.requestAnimationFrame(update);
      }
    };

    animationFrame.current = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(animationFrame.current);
  }, [playing]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0;
      try {
        await audio.play();
        if (!started.current) {
          started.current = true;
          trackSiteEvent("audio_excerpt_started", {
            release,
            location: "timed_lyrics",
          });
        }
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(time, 0), record.duration);
    setCurrentTime(audio.currentTime);
  };

  const seekFromRuler = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    seekTo(
      ((event.clientX - bounds.left) / Math.max(bounds.width, 1)) *
        record.duration,
    );
  };

  const playerStyle = {
    "--timed-progress": `${progress * 100}%`,
  } as CSSProperties;

  const lineButton = (
    line: TimedLyricLine | undefined,
    tone: "previous" | "next",
  ) => (
    <button
      type="button"
      className={`${styles.line} ${styles[tone]} font-pixel-line`}
      onClick={() => line && seekTo(line.start)}
      disabled={!line}
      aria-label={line ? `Seek to ${line.text}` : undefined}
    >
      {line?.text ?? "\u00a0"}
    </button>
  );

  return (
    <section
      id={id}
      className={styles.player}
      style={playerStyle}
      aria-label={`Timed lyrics for ${release}`}
    >
      <div className={styles.header}>
        <button
          type="button"
          onClick={() => void togglePlayback()}
          className="grid h-11 w-11 place-items-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--sheet-accent)"
          aria-label={playing ? `Pause ${release}` : `Play ${release}`}
        >
          <span className={styles.play} aria-hidden="true">
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </span>
        </button>
        <span className="font-pixel-dot text-[10px] uppercase tracking-[0.14em] opacity-55">
          {playing ? "lyrics live" : "play with lyrics"}
        </span>
        <span className="font-pixel-dot text-[10px] tabular-nums tracking-widest opacity-50">
          {clockTime(currentTime)} / {clockTime(record.duration)}
        </span>
      </div>

      <div className={styles.stage}>
        {lineButton(frame.previous, "previous")}
        <button
          type="button"
          className={`${styles.line} ${styles.active} font-pixel-line`}
          onClick={() => frame.active && seekTo(frame.active.start)}
          disabled={!frame.active}
          aria-label={
            frame.active ? `Replay ${frame.active.text}` : "Instrumental"
          }
        >
          <span aria-hidden="true">
            {frame.words.map((word) => {
              const wordStyle = {
                "--word-progress": `${word.progress * 100}%`,
              } as CSSProperties;

              return (
                <span
                  className={styles.word}
                  style={wordStyle}
                  key={`${word.text}-${word.start}`}
                >
                  {word.text}
                  <span className={styles.wordFill}>{word.text}</span>
                </span>
              );
            })}
          </span>
          <span className="sr-only">{frame.active?.text}</span>
        </button>
        {lineButton(frame.next, "next")}
      </div>

      <div
        className={styles.ruler}
        onClick={seekFromRuler}
        role="slider"
        tabIndex={0}
        aria-label={`Seek through ${release}`}
        aria-valuemin={0}
        aria-valuemax={Math.round(record.duration)}
        aria-valuenow={Math.round(currentTime)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            seekTo(currentTime + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            seekTo(currentTime - 1);
          }
        }}
      >
        <div className={styles.track}>
          <div className={styles.fill} />
        </div>
        <div
          className={`${styles.ticks} font-pixel-dot text-[9px] tabular-nums tracking-widest`}
          aria-hidden="true"
        >
          <span>00:00</span>
          <span>{clockTime(record.duration / 2)}</span>
          <span>{clockTime(record.duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={record.previewUrl}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={(event) => {
          setPlaying(false);
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onTimeUpdate={(event) => {
          if (!playing) setCurrentTime(event.currentTarget.currentTime);
        }}
        onEnded={(event) => {
          setPlaying(false);
          setCurrentTime(event.currentTarget.duration || record.duration);
          trackSiteEvent("audio_excerpt_completed", {
            release,
            location: "timed_lyrics",
          });
        }}
      />
    </section>
  );
}
