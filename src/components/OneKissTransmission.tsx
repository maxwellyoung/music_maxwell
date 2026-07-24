"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  oneKissHookDuration,
  oneKissTimedHook,
} from "~/data/oneKissExperience";
import type { Song } from "~/data/releases";
import { trackSiteEvent } from "~/lib/analytics";
import { getTimedLyricFrame, type TimedLyricLine } from "~/lib/timedLyrics";
import styles from "./OneKissTransmission.module.css";
import ReleaseMoment from "./ReleaseMoment";

type OneKissTransmissionProps = {
  artworkUrl: string;
  excerptUrl: string;
  masterSha256: string;
  links: Song["links"];
};

function formatTime(seconds: number) {
  return `00:${Math.floor(seconds).toString().padStart(2, "0")}`;
}

export default function OneKissTransmission({
  artworkUrl,
  excerptUrl,
  masterSha256,
  links,
}: OneKissTransmissionProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrame = useRef(0);
  const started = useRef(false);
  const completed = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const progress = Math.min(currentTime / oneKissHookDuration, 1);
  const lyricFrame = getTimedLyricFrame(oneKissTimedHook, currentTime);

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
            release: "1kiss",
            location: "release_transmission",
          });
        }
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  const seek = (event: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((event.clientX - bounds.left) / bounds.width, 0),
      1,
    );
    audio.currentTime = ratio * oneKissHookDuration;
    setCurrentTime(audio.currentTime);
  };

  const stageStyle = {
    "--signal-progress": `${progress * 100}%`,
  } as CSSProperties;

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(time, 0), oneKissHookDuration);
    setCurrentTime(audio.currentTime);
  };

  const lyricContext = (
    line: TimedLyricLine | undefined,
    tone: "previous" | "next",
  ) => (
    <button
      type="button"
      className={`${styles.lyricContext} ${styles[tone]} font-pixel-line`}
      onClick={() => line && seekTo(line.start)}
      disabled={!line}
      aria-label={line ? `Seek to ${line.text}` : undefined}
    >
      {line?.text ?? "\u00a0"}
    </button>
  );

  return (
    <>
      <section
        className={`${styles.stage} ${playing ? styles.playing : ""}`}
        style={stageStyle}
        aria-label="1kiss release transmission"
      >
        <div className={styles.backdrop} aria-hidden="true" />
        <div className={styles.frame} aria-hidden="true">
          <Image
            src="/1kiss/still-hook.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 760px) 54vw, 82vw"
            className="object-cover"
          />
        </div>
        <div className={styles.scan} aria-hidden="true" />

        <div className={styles.chrome}>
          <header className={styles.mast}>
            <p className="font-pixel-dot text-[10px] uppercase tracking-[0.17em] text-[#b7c8eb] sm:text-xs">
              Maxwell Young / 24.07.26 / AKL
            </p>
            <h1 className={`${styles.title} font-pixel-line`}>1kiss</h1>
          </header>

          <div className={styles.console}>
            <div className={styles.lyricWindow}>
              <p className="font-pixel-dot text-[10px] uppercase tracking-[0.14em] text-[#8ea6ff]">
                {playing ? (
                  <span className={styles.live}>live lyric</span>
                ) : lyricFrame.active ? (
                  "lyric timeline"
                ) : (
                  "instrumental"
                )}
              </p>
              <p className="sr-only" aria-live="polite">
                {lyricFrame.active?.text ?? "Instrumental"}
              </p>
              <div className={styles.lyricRail}>
                {lyricContext(lyricFrame.previous, "previous")}
                <button
                  type="button"
                  className={`${styles.lyricLine} ${
                    lyricFrame.active && lyricFrame.active.text.length > 20
                      ? styles.longLine
                      : ""
                  } font-pixel-line`}
                  onClick={() =>
                    lyricFrame.active && seekTo(lyricFrame.active.start)
                  }
                  disabled={!lyricFrame.active}
                  aria-label={
                    lyricFrame.active
                      ? `Replay ${lyricFrame.active.text}`
                      : "Instrumental"
                  }
                >
                  <span aria-hidden="true">
                    {lyricFrame.words.map((word) => {
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
                  <span className="sr-only">{lyricFrame.active?.text}</span>
                </button>
                {lyricContext(lyricFrame.next, "next")}
              </div>
            </div>

            <div className={styles.transport}>
              <button
                type="button"
                onClick={() => void togglePlayback()}
                className={`${styles.transportButton} font-pixel-dot text-[11px] uppercase tracking-[0.12em] transition hover:text-[#d8ff00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ff00]`}
                aria-label={
                  playing ? "Pause 1kiss excerpt" : "Play 1kiss excerpt"
                }
              >
                <span className={styles.playIcon} aria-hidden="true">
                  {playing ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="ml-0.5 h-4 w-4" />
                  )}
                </span>
                <span>{playing ? "pause signal" : "open signal"}</span>
                <span className="tabular-nums text-white/55">
                  {formatTime(currentTime)} / 00:18
                </span>
              </button>

              <div
                className={styles.ruler}
                onClick={seek}
                role="slider"
                tabIndex={0}
                aria-label="Seek through the 1kiss excerpt"
                aria-valuemin={0}
                aria-valuemax={oneKissHookDuration}
                aria-valuenow={Math.round(currentTime)}
                onKeyDown={(event) => {
                  const audio = audioRef.current;
                  if (!audio) return;
                  if (event.key === "ArrowRight") {
                    audio.currentTime = Math.min(
                      audio.currentTime + 1,
                      oneKissHookDuration,
                    );
                  }
                  if (event.key === "ArrowLeft") {
                    audio.currentTime = Math.max(audio.currentTime - 1, 0);
                  }
                  setCurrentTime(audio.currentTime);
                }}
              >
                <div className={styles.rulerTrack}>
                  <div className={styles.rulerFill} />
                </div>
                <div
                  className={`${styles.ticks} font-pixel-dot text-[9px] tracking-[0.12em]`}
                  aria-hidden="true"
                >
                  <span>00</span>
                  <span>06</span>
                  <span>12</span>
                  <span>18</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.listenDock}>
          <ReleaseMoment links={links} compact location="release_room" />
        </div>

        <audio
          ref={audioRef}
          src={excerptUrl}
          preload="metadata"
          onTimeUpdate={(event) => {
            if (!playing) setCurrentTime(event.currentTarget.currentTime);
          }}
          onPlay={() => setPlaying(true)}
          onPause={(event) => {
            setPlaying(false);
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onEnded={(event) => {
            setPlaying(false);
            setCurrentTime(event.currentTarget.duration || oneKissHookDuration);
            if (!completed.current) {
              completed.current = true;
              trackSiteEvent("audio_excerpt_completed", {
                release: "1kiss",
                location: "release_transmission",
              });
            }
          }}
        />
      </section>

      <section className={styles.packet} aria-labelledby="release-record-title">
        <div className={styles.packetIndex}>
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#8ea6ff]">
            1kiss / release record
          </p>
          <h2
            id="release-record-title"
            className={`${styles.packetTitle} font-pixel-line mt-4 max-w-[8ch] text-6xl uppercase leading-[0.78] sm:text-7xl`}
          >
            24 jul 2026
          </h2>
          <p className="font-pixel-dot mt-8 max-w-[28ch] text-[10px] uppercase leading-relaxed tracking-[0.12em] text-white/45">
            Audio / artwork / lyric / record data
          </p>
        </div>

        <div className={styles.packetBody}>
          <article className={styles.artifact}>
            <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#8ea6ff]">
              A / 01 / cover artwork
            </p>
            <div className={styles.artwork}>
              <Image
                src={artworkUrl}
                alt="1kiss cover artwork"
                fill
                sizes="(min-width: 760px) 54vw, 100vw"
                className="object-cover"
              />
            </div>
          </article>

          <article className={styles.artifact}>
            <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#8ea6ff]">
              A / 02 / record data
            </p>
            <div className={styles.dataGrid}>
              {[
                ["Format", "Single"],
                ["Runtime", "02:03"],
                ["Tempo", "136 BPM"],
                ["Key", "F#"],
                ["Content", "Clean"],
                ["Label", "Ninetynine Records"],
              ].map(([label, value]) => (
                <div className={styles.dataCell} key={label}>
                  <p className="font-pixel-dot text-[9px] uppercase tracking-[0.14em] text-white/40">
                    {label}
                  </p>
                  <p className="mt-4 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-white/20 pt-5">
              <p className="font-pixel-dot text-[9px] uppercase tracking-[0.14em] text-white/40">
                Approved master / SHA-256
              </p>
              <p
                className={`${styles.hash} font-pixel-dot mt-4 text-[10px] leading-relaxed tracking-[0.08em] text-white/65`}
              >
                {masterSha256}
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
