"use client";

import { ArrowDownRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import OneKissBlakeField from "~/components/OneKissBlakeField";
import OneKissHeroVisual from "~/components/OneKissHeroVisual";
import ReleaseMoment from "~/components/ReleaseMoment";
import { findTimedLyrics } from "~/data/timedLyrics";
import { trackSiteEvent } from "~/lib/analytics";
import { getTimedLyricFrame } from "~/lib/timedLyrics";
import styles from "./HomeHero.module.css";

type HomeHeroProps = {
  release: {
    slug: string;
    title: string;
    artist: string;
    releaseDate?: string;
    releasePath: string;
    spotifyUrl: string;
  };
  presentation: {
    excerpt: string;
    excerptSeconds: number;
    standbyLine: string;
    cues: readonly { at: number; line: string }[];
  };
};

export default function HomeHero({ release, presentation }: HomeHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrame = useRef(0);
  const lastPlaybackPaint = useRef(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const excerptStarted = useRef(false);
  const excerptCompleted = useRef(false);
  const timedLyrics = useMemo(
    () =>
      findTimedLyrics({
        slug: release.slug,
        previewUrl: presentation.excerpt,
        lyricVersion: release.title,
      }),
    [presentation.excerpt, release.slug, release.title],
  );
  const timedFrame = timedLyrics
    ? getTimedLyricFrame(timedLyrics.lines, currentTime)
    : undefined;
  const duration = timedLyrics?.duration ?? presentation.excerptSeconds;
  const progress = Math.min(currentTime / duration, 1);
  const cueIndex = presentation.cues.reduce(
    (latest, cue, index) => (cue.at <= currentTime ? index : latest),
    0,
  );
  const visibleLine = timedLyrics
    ? timedFrame?.active?.text
    : presentation.cues[cueIndex]?.line;

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsHeroVisible(Boolean(entry?.isIntersecting));
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying || !isHeroVisible) return;

    const update = () => {
      const now = performance.now();
      if (now - lastPlaybackPaint.current >= 1000 / 30) {
        lastPlaybackPaint.current = now;
        setCurrentTime(audio.currentTime);
      }
      if (!audio.paused && !audio.ended) {
        animationFrame.current = window.requestAnimationFrame(update);
      }
    };

    lastPlaybackPaint.current = 0;
    animationFrame.current = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(animationFrame.current);
  }, [isHeroVisible, isPlaying]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setHasStarted(true);
        if (!excerptStarted.current) {
          excerptStarted.current = true;
          trackSiteEvent("audio_excerpt_started", {
            release: release.slug,
            location: "home_hero",
          });
        }
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const syncPlayback = () => {
    const audio = audioRef.current;
    if (!audio || isPlaying) return;
    setCurrentTime(audio.currentTime);
  };

  return (
    <section
      id="listen"
      ref={heroRef}
      className="relative isolate min-h-svh overflow-hidden bg-[#05070c] text-[#f5f8ff]"
    >
      <OneKissBlakeField
        active={isPlaying && isHeroVisible}
        reduceMotion={Boolean(reduceMotion)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,.9)_0%,rgba(5,7,12,.52)_48%,rgba(5,7,12,.1)_100%)]" />

      <div className="absolute -inset-x-[2%] top-[25%] h-[44vh] sm:left-[35%] sm:right-[-4%] sm:top-[7%] sm:h-[78vh]">
        <OneKissHeroVisual
          active={isPlaying && isHeroVisible}
          progress={progress}
          reduceMotion={Boolean(reduceMotion)}
        />
      </div>

      <div className="relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-between px-5 pb-7 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12">
        <div className={`${styles.titleEntrance} relative z-10`}>
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#b7c8eb] sm:text-xs">
            {release.artist} / {release.releaseDate}
          </p>
          <h1 className="font-pixel-line mb-0 mt-3 text-[clamp(5.5rem,14vw,11rem)] leading-[0.74] tracking-[-0.05em] text-[#f5f8ff]">
            {release.title}
          </h1>
        </div>

        <div
          className={`${styles.controlsEntrance} relative z-10 mt-auto grid gap-5 pt-[48vh] sm:max-w-[38%] sm:pt-0`}
        >
          <div className="min-h-[6.5rem] sm:min-h-[7.5rem]" aria-hidden="true">
            <p className="font-pixel-line max-w-[15ch] text-3xl uppercase leading-[0.88] sm:text-4xl lg:text-5xl">
              {hasStarted && timedFrame?.active ? (
                <span aria-hidden="true">
                  {timedFrame.words.map((word) => {
                    const wordStyle = {
                      clipPath: `inset(0 ${100 - word.progress * 100}% 0 0)`,
                    } as CSSProperties;

                    return (
                      <span
                        className="relative mr-[0.22em] inline-block text-white/25"
                        key={`${word.text}-${word.start}`}
                      >
                        {word.text}
                        <span
                          className="absolute inset-0 overflow-hidden whitespace-nowrap text-[#f5f8ff] will-change-[clip-path]"
                          style={wordStyle}
                        >
                          {word.text}
                        </span>
                      </span>
                    );
                  })}
                  <span className="sr-only">{timedFrame.active.text}</span>
                </span>
              ) : hasStarted ? (
                visibleLine
              ) : (
                presentation.standbyLine
              )}
            </p>
          </div>
          <p className="sr-only">
            An {presentation.excerptSeconds}-second excerpt from {release.title}
            .
          </p>
          <div className="grid max-w-sm gap-4">
            <ReleaseMoment spotifyUrl={release.spotifyUrl} compact />
            <button
              type="button"
              onClick={() => void togglePlayback()}
              aria-pressed={isPlaying}
              className="font-pixel-dot group flex min-h-12 w-full items-center gap-3 border-y border-white/25 py-3 text-left text-xs uppercase tracking-[0.1em] transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span
                className="grid h-8 w-8 place-items-center border border-current"
                aria-hidden="true"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" />
                )}
              </span>
              <span>{isPlaying ? "pause the hook" : "hear 18 seconds"}</span>
              <span className="ml-auto tabular-nums text-white/55">
                00:
                {String(
                  Math.round(progress * presentation.excerptSeconds),
                ).padStart(2, "0")}
              </span>
            </button>
            <div
              className="h-px overflow-hidden bg-white/20"
              aria-hidden="true"
            >
              <div
                className="h-full origin-left bg-[#8ea6ff] will-change-transform"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
            <Link
              href={release.releasePath}
              onClick={() =>
                trackSiteEvent("release_entered", {
                  release: release.slug,
                  location: "home_hero",
                })
              }
              className="font-pixel-dot group inline-flex min-h-12 items-center gap-3 border-b border-[#f5f8ff] pb-1 text-xs uppercase tracking-[0.1em] transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              enter {release.title}
              <ArrowDownRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={presentation.excerpt}
        preload="metadata"
        onTimeUpdate={syncPlayback}
        onPause={(event) => {
          setIsPlaying(false);
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => {
          if (!excerptCompleted.current) {
            excerptCompleted.current = true;
            trackSiteEvent("audio_excerpt_completed", {
              release: release.slug,
              location: "home_hero",
            });
          }
          setIsPlaying(false);
          setCurrentTime(0);
          setHasStarted(false);
        }}
      />
    </section>
  );
}
