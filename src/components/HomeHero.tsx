"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackSiteEvent } from "~/lib/analytics";

const lyricCues = [
  { at: 0, line: "i'm on the way down" },
  { at: 2.3, line: "it's like this midas" },
  { at: 4.5, line: "your hips / our lips" },
  { at: 6.6, line: "one kiss" },
  { at: 8.3, line: "i couldn't wait" },
  { at: 10.4, line: "now it's priceless" },
  { at: 12.4, line: "smiling stunned since miley" },
  { at: 15.2, line: "one kiss" },
] as const;

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cueIndex, setCueIndex] = useState(2);
  const excerptStarted = useRef(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const frameY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        if (!excerptStarted.current) {
          excerptStarted.current = true;
          trackSiteEvent("audio_excerpt_started", {
            release: "1kiss",
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
    if (!audio) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 18;
    setProgress(Math.min(audio.currentTime / duration, 1));
    const nextCue = lyricCues.reduce(
      (latest, cue, index) => (cue.at <= audio.currentTime ? index : latest),
      0,
    );
    setCueIndex(Math.max(0, nextCue));
  };

  return (
    <section
      id="listen"
      ref={heroRef}
      className="relative isolate min-h-svh overflow-hidden bg-[#05070c] text-[#f5f8ff]"
    >
      <Image
        src="/1kiss/signal-bloom-blue.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,.9)_0%,rgba(5,7,12,.64)_48%,rgba(5,7,12,.18)_100%)]" />

      <motion.div
        className="absolute inset-x-0 top-[31%] h-[38vh] overflow-hidden border-y border-white/20 sm:left-[42%] sm:right-0 sm:top-[20%] sm:h-[57vh] sm:border"
        style={{ y: frameY }}
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
          <Image
            src="/1kiss/still-hook.jpg"
            alt="Maxwell Young performing 1kiss"
            fill
            priority
            sizes="(min-width: 640px) 58vw, 100vw"
            className="object-cover object-center"
          />
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
            Maxwell Young / 24.07.26
          </p>
          <h1 className="font-pixel-line mb-0 mt-3 text-[clamp(5.5rem,14vw,11rem)] leading-[0.74] tracking-[-0.05em] text-[#f5f8ff]">
            1kiss
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-auto grid gap-7 pt-[48vh] sm:max-w-[38%] sm:pt-0"
        >
          <div className="min-h-[6.5rem] sm:min-h-[7.5rem]" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={isPlaying ? lyricCues[cueIndex]?.line : "your hips / our lips / one kiss"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
                className="font-pixel-line max-w-[15ch] text-3xl uppercase leading-[0.88] sm:text-4xl lg:text-5xl"
              >
                {isPlaying
                  ? lyricCues[cueIndex]?.line
                  : "your hips / our lips / one kiss"}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="sr-only">An 18-second excerpt from 1kiss.</p>
          <div className="grid max-w-sm gap-4">
            <button
              type="button"
              onClick={() => void togglePlayback()}
              aria-pressed={isPlaying}
              className="font-pixel-dot group flex min-h-12 w-full items-center gap-3 border-y border-white/25 py-3 text-left text-xs uppercase tracking-[0.1em] transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className="grid h-8 w-8 place-items-center border border-current" aria-hidden="true">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
              </span>
              <span>{isPlaying ? "pause the hook" : "hear 18 seconds"}</span>
              <span className="ml-auto tabular-nums text-white/55">00:{String(Math.round(progress * 18)).padStart(2, "0")}</span>
            </button>
            <div className="h-px overflow-hidden bg-white/20" aria-hidden="true">
              <div
                className="h-full bg-[#8ea6ff] transition-[width] duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <Link
              href="/1kiss"
              onClick={() =>
                trackSiteEvent("release_entered", {
                  release: "1kiss",
                  location: "home_hero",
                })
              }
              className="font-pixel-dot group inline-flex min-h-12 items-center gap-3 border-b border-[#f5f8ff] pb-1 text-xs uppercase tracking-[0.1em] transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              enter 1kiss
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
        src="/1kiss/1kiss-hook.m4a"
        preload="metadata"
        onTimeUpdate={syncPlayback}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onEnded={() => {
          trackSiteEvent("audio_excerpt_completed", {
            release: "1kiss",
            location: "home_hero",
          });
          setIsPlaying(false);
          setProgress(0);
          setCueIndex(2);
        }}
      />
    </section>
  );
}
