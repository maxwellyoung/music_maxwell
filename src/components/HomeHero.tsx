"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import OneKissBlakeField from "~/components/OneKissBlakeField";
import { findTimedLyrics } from "~/data/timedLyrics";
import { trackSiteEvent } from "~/lib/analytics";
import { getTimedLyricFrame } from "~/lib/timedLyrics";

type HomeHeroProps = {
  release: {
    slug: string;
    title: string;
    artist: string;
    releaseDate?: string;
    releasePath: string;
  };
  presentation: {
    stills: readonly [string, ...string[]];
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
  const reduceMotion = useReducedMotion();
  const isHeroInView = useInView(heroRef, { amount: 0.25 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [portraitIndex, setPortraitIndex] = useState(0);
  const excerptStarted = useRef(false);
  const excerptCompleted = useRef(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const frameY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const timedLyrics = findTimedLyrics({
    slug: release.slug,
    previewUrl: presentation.excerpt,
    lyricVersion: release.title,
  });
  const timedFrame = timedLyrics
    ? getTimedLyricFrame(timedLyrics.lines, currentTime)
    : undefined;
  const duration = timedLyrics?.duration ?? presentation.excerptSeconds;
  const progress = Math.min(currentTime / duration, 1);
  const portraitSegmentSeconds =
    presentation.excerptSeconds / presentation.stills.length;
  const syncedPortraitIndex = Math.min(
    Math.floor(currentTime / portraitSegmentSeconds),
    presentation.stills.length - 1,
  );
  const activePortraitIndex = isPlaying ? syncedPortraitIndex : portraitIndex;
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
    if (
      reduceMotion ||
      hasStarted ||
      !isHeroInView ||
      presentation.stills.length < 2
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setPortraitIndex((current) => (current + 1) % presentation.stills.length);
    }, 6800);

    return () => window.clearInterval(interval);
  }, [hasStarted, isHeroInView, presentation.stills.length, reduceMotion]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const update = () => {
      setCurrentTime(audio.currentTime);
      if (!audio.paused && !audio.ended) {
        animationFrame.current = window.requestAnimationFrame(update);
      }
    };

    animationFrame.current = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(animationFrame.current);
  }, [isPlaying]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        setPortraitIndex(
          Math.min(
            Math.floor(audio.currentTime / portraitSegmentSeconds),
            presentation.stills.length - 1,
          ),
        );
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
        active={isPlaying}
        reduceMotion={Boolean(reduceMotion)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,.9)_0%,rgba(5,7,12,.52)_48%,rgba(5,7,12,.1)_100%)]" />

      <motion.div
        className="absolute inset-x-0 top-[31%] h-[38vh] overflow-hidden border-y border-white/20 sm:left-[42%] sm:right-0 sm:top-[20%] sm:h-[57vh] sm:border"
        style={{ y: frameY }}
        role="img"
        aria-label={`${release.artist} performing ${release.title}`}
      >
        <motion.div
          className="absolute inset-0"
          animate={
            isPlaying && !reduceMotion
              ? { x: [0, 5, -3, 0], scale: [1, 1.025, 1.012, 1] }
              : { x: 0, scale: 1 }
          }
          transition={
            isPlaying && !reduceMotion
              ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.2 }
          }
        >
          {presentation.stills.map((still, index) => (
            <motion.div
              aria-hidden={index !== activePortraitIndex}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: index === activePortraitIndex ? 1 : 0 }}
              key={still}
              transition={{
                duration: reduceMotion ? 0.01 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src={still}
                alt=""
                fill
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                sizes="(min-width: 640px) 58vw, 100vw"
                className="object-cover object-center"
              />
            </motion.div>
          ))}
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-[58%] h-px bg-[#8ea6ff] mix-blend-screen"
            animate={{ opacity: isPlaying ? [0.15, 0.9, 0.15] : 0.15 }}
            transition={{ duration: 1.15, repeat: isPlaying ? Infinity : 0 }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-between px-5 pb-7 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#b7c8eb] sm:text-xs">
            {release.artist} / {release.releaseDate}
          </p>
          <h1 className="font-pixel-line mb-0 mt-3 text-[clamp(5.5rem,14vw,11rem)] leading-[0.74] tracking-tighter text-[#f5f8ff]">
            {release.title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-auto grid gap-7 pt-[48vh] sm:max-w-[38%] sm:pt-0"
        >
          <div className="min-h-26 sm:min-h-30" aria-hidden="true">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
              className="font-pixel-line max-w-[15ch] text-3xl uppercase leading-[0.88] sm:text-4xl lg:text-5xl"
            >
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
            </motion.p>
          </div>
          <p className="sr-only">
            An {presentation.excerptSeconds}-second excerpt from {release.title}
            .
          </p>
          <div className="grid max-w-sm gap-4">
            <button
              type="button"
              onClick={() => void togglePlayback()}
              aria-pressed={isPlaying}
              className="font-pixel-dot group flex min-h-12 w-full items-center gap-3 border-y border-white/25 py-3 text-left text-xs uppercase tracking-widest transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
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
              className="font-pixel-dot group inline-flex min-h-12 items-center gap-3 border-b border-[#f5f8ff] pb-1 text-xs uppercase tracking-widest transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
            >
              enter {release.title}
              <ArrowDownRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.div>
      </motion.div>
      <audio
        ref={audioRef}
        src={presentation.excerpt}
        preload="metadata"
        onTimeUpdate={syncPlayback}
        onPause={(event) => {
          setIsPlaying(false);
          setCurrentTime(event.currentTarget.currentTime);
          setPortraitIndex(
            Math.min(
              Math.floor(
                event.currentTarget.currentTime / portraitSegmentSeconds,
              ),
              presentation.stills.length - 1,
            ),
          );
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
          setPortraitIndex(0);
        }}
      />
    </section>
  );
}
