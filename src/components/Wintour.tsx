"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause, X, Plus, ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Wintour() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [releaseDate] = useState(new Date("2025-04-25T00:00:00"));
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [hasMounted, setHasMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<"main" | "about">("main");
  const [showLyrics, setShowLyrics] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Lyrics data structured for visual presentation
  const lyrics = [
    "yea im on anna wintour diet",
    "plus that shit straight from her privates",
    "i told u before no crying",
    "i'll take care of you girl",
    "i walk towards the college",
    "not rich, so im back at college",
    "still unbutton the collar",
    "the label says its top dollar",
    "and i",
    "girl i just hopped out the way",
    "and u know why i say that",
    "girl i just hopped up to you you you",
    "girl i just hopped out the way way",
    "i feel like britney spears caus i'm always misunderstood",
    "take me lucky, take me toxic",
    "let me jump inside ur pool",
    "i'm on demon, there's no reason why i'm acting such a fool",
    "gets outrageous on occasion",
    "i make anybody cool",
    "fuck a slut shame, fuck the gossip",
    "clean ur shit, shut up and mop it",
    "there's one thing i'm never stopping",
    "find myself a worthy option",
    "run these streets",
    "i run ur mind",
    "i tell why, i never lie",
    "i don't know why u make it feel like that",
  ];

  function getTimeLeft() {
    const now = new Date();
    const difference = releaseDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  // Countdown timer effect
  useEffect(() => {
    // mark client has mounted to avoid hydration mismatch
    setHasMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && progressRef.current) {
        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        progressRef.current.style.width = `${progress}%`;
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        void audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Custom cursor logic
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  const cursorEnter = (text: string, variant = "text") => {
    setCursorText(text);
    setCursorVariant(variant);
  };

  const cursorLeave = () => {
    setCursorText("");
    setCursorVariant("default");
  };

  const variants = {
    default: {
      height: 32,
      width: 32,
      x: cursor.x - 16,
      y: cursor.y - 16,
      backgroundColor: "rgba(209, 59, 36, 0)",
      mixBlendMode: "difference" as const,
    },
    text: {
      height: 80,
      width: 80,
      x: cursor.x - 40,
      y: cursor.y - 40,
      backgroundColor: "rgba(209, 59, 36, 0.2)",
      mixBlendMode: "normal" as const,
    },
    button: {
      height: 64,
      width: 64,
      x: cursor.x - 32,
      y: cursor.y - 32,
      backgroundColor: "rgba(209, 59, 36, 0.5)",
      mixBlendMode: "difference" as const,
    },
  };

  // Close lyrics overlay on ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLyrics) {
        setShowLyrics(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showLyrics]);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#f5f4f0] text-[#111]">
      {/* Custom cursor */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-50 hidden items-center justify-center rounded-full font-mono text-xs uppercase tracking-widest md:flex"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        {cursorText}
      </motion.div>
      <main className="relative h-full w-full">
        {/* Lyrics overlay */}
        <AnimatePresence>
          {showLyrics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onClick={() => setShowLyrics(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-h-[90vh] w-full max-w-screen-md overflow-auto rounded-lg border-2 border-[hsl(var(--rust))] bg-[#111] text-[#f5f4f0] shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative px-6 py-8 md:py-12">
                  <button
                    onClick={() => setShowLyrics(false)}
                    className="hover:text-rust absolute right-4 top-4 z-50 text-[#f5f4f0] transition-colors"
                    onMouseEnter={() => cursorEnter("CLOSE", "button")}
                    onMouseLeave={cursorLeave}
                  >
                    <X size={24} />
                  </button>

                  <h2 className="text-rust mb-8 text-center font-mono text-4xl uppercase md:text-5xl">
                    LYRICS
                  </h2>

                  <div className="space-y-4">
                    {lyrics.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.02, duration: 0.4 }}
                        className="font-mono text-lg uppercase leading-snug md:text-xl"
                        onMouseEnter={() => cursorEnter("", "text")}
                        onMouseLeave={cursorLeave}
                      >
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-12">
          {/* Image section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[50vh] md:col-span-7 md:h-screen"
          >
            <Image
              src="/artworks/wintour-cover.webp"
              alt="Cover art for Maxwell Young's 'Wintour' featuring a jumper silhouette"
              fill
              className="object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
          </motion.div>

          {/* Content section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex flex-col p-8 md:col-span-5 md:p-12"
          >
            <header className="mb-16 flex items-start justify-between">
              <div>
                <h1 className="font-mono text-xs uppercase tracking-widest text-black/50">
                  NEW SINGLE
                </h1>
                <h1 className="text-xl font-medium tracking-tight">
                  Maxwell Young
                </h1>
              </div>
              <nav className="flex items-center space-x-6">
                <button
                  onClick={() => setActiveSection("main")}
                  className={cn(
                    "border-b-2 pb-1 text-xs uppercase transition-all",
                    activeSection === "main"
                      ? "border-rust text-rust"
                      : "border-transparent hover:border-black/20",
                  )}
                  onMouseEnter={() => cursorEnter("VIEW", "text")}
                  onMouseLeave={cursorLeave}
                >
                  Main
                </button>
                <button
                  onClick={() => setActiveSection("about")}
                  className={cn(
                    "border-b-2 pb-1 text-xs uppercase transition-all",
                    activeSection === "about"
                      ? "border-rust text-rust"
                      : "border-transparent hover:border-black/20",
                  )}
                  onMouseEnter={() => cursorEnter("VIEW", "text")}
                  onMouseLeave={cursorLeave}
                >
                  About
                </button>
              </nav>
            </header>

            {activeSection === "main" && (
              <div className="flex flex-1 flex-col justify-between">
                <div className="mb-auto">
                  <h2 className="text-rust mb-2 text-6xl font-bold uppercase tracking-tighter md:text-8xl">
                    Wintour
                  </h2>
                  <div className="mt-8 flex items-center">
                    <div className="mr-4 font-mono text-xs uppercase tracking-widest text-black/50">
                      Release
                    </div>
                    <div className="text-lg font-semibold tracking-tight text-black">
                      25 April 2025
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-8">
                  <button
                    onClick={() => setShowLyrics(true)}
                    className="bg-rust hover:bg-rust/90 inline-flex items-center space-x-2 rounded-md px-5 py-3 text-sm font-medium uppercase text-white transition-colors"
                    onMouseEnter={() => cursorEnter("LYRICS", "button")}
                    onMouseLeave={cursorLeave}
                  >
                    <span>View Lyrics</span>
                    <ArrowRight
                      size={18}
                      className="transform transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayback}
                      className="bg-rust hover:bg-rust/90 flex h-16 w-16 items-center justify-center rounded-full text-white transition-colors"
                      onMouseEnter={() =>
                        cursorEnter(isPlaying ? "PAUSE" : "PLAY", "button")
                      }
                      onMouseLeave={cursorLeave}
                    >
                      {isPlaying ? (
                        <Pause size={22} />
                      ) : (
                        <Play size={22} className="ml-1" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="relative h-1 overflow-hidden rounded-full bg-black/20">
                        <div
                          ref={progressRef}
                          className="bg-rust absolute left-0 top-0 h-full"
                          style={{ width: "0%" }}
                        />
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="font-mono text-xs text-black/50">
                          {isPlaying ? "PLAYING PREVIEW" : "PREVIEW"}
                        </span>
                        <span className="font-mono text-xs text-black/50">
                          01:19
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/10 pt-6">
                    <div className="mb-2 flex space-x-2">
                      <span className="font-mono text-xs uppercase tracking-widest text-black/50">
                        Countdown
                      </span>
                      <div className="bg-rust mt-1 h-2 w-2 animate-pulse rounded-full"></div>
                    </div>
                    <div suppressHydrationWarning className="font-mono text-xl">
                      {hasMounted ? (
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={`${timeLeft.days}-${timeLeft.hours}-${timeLeft.minutes}-${timeLeft.seconds}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            {timeLeft.days > 0 ? (
                              <span>
                                {timeLeft.days}D {timeLeft.hours}H{" "}
                                {timeLeft.minutes}M {timeLeft.seconds}S
                              </span>
                            ) : (
                              <span>
                                {timeLeft.hours}H {timeLeft.minutes}M{" "}
                                {timeLeft.seconds}S
                              </span>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      ) : null}
                    </div>
                  </div>

                  <button
                    className="flex w-full items-center justify-center space-x-2 bg-black px-6 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-black/90"
                    onMouseEnter={() => cursorEnter("SAVE", "button")}
                    onMouseLeave={cursorLeave}
                  >
                    <span>Pre-save</span>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeSection === "about" && (
              <div className="flex flex-1 flex-col">
                <div>
                  <h2 className="text-rust mb-6 text-4xl font-bold uppercase tracking-tighter">
                    About the Single
                  </h2>
                  <p className="mb-4 leading-relaxed text-black/80">
                    Pop song.
                  </p>
                  <p className="mb-4 leading-relaxed text-black/80">
                    Recorded in Auckland, New Zealand.
                  </p>
                  <div className="border-rust mt-12 border-l-2 pl-4">
                    <p className="font-medium text-black/80">
                      Written & produced by Maxwell Young
                      <br />
                      Mixed and co-produced by Eddie Johnston
                      <br />
                      Artwork by Elijah Broughton
                    </p>
                  </div>

                  <div className="mt-12">
                    <button
                      onClick={() => setShowLyrics(true)}
                      className="bg-rust hover:bg-rust/90 inline-flex items-center space-x-2 rounded-md px-5 py-3 text-sm font-medium uppercase text-white transition-colors"
                      onMouseEnter={() => cursorEnter("LYRICS", "button")}
                      onMouseLeave={cursorLeave}
                    >
                      <span className="font-medium">View Lyrics</span>
                      <ArrowRight
                        size={18}
                        className="transform transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <footer className="mt-12 border-t border-black/10 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 font-mono text-xs uppercase tracking-widest text-black/50">
                    Connect
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <a
                      href="#"
                      className="hover:text-rust text-sm transition-colors"
                      onMouseEnter={() => cursorEnter("SPOTIFY", "text")}
                      onMouseLeave={cursorLeave}
                    >
                      Spotify
                    </a>
                    <a
                      href="#"
                      className="hover:text-rust text-sm transition-colors"
                      onMouseEnter={() => cursorEnter("APPLE", "text")}
                      onMouseLeave={cursorLeave}
                    >
                      Apple
                    </a>
                    <a
                      href="#"
                      className="hover:text-rust text-sm transition-colors"
                      onMouseEnter={() => cursorEnter("IG", "text")}
                      onMouseLeave={cursorLeave}
                    >
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="hover:text-rust text-sm transition-colors"
                      onMouseEnter={() => cursorEnter("TW", "text")}
                      onMouseLeave={cursorLeave}
                    >
                      Twitter
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2 font-mono text-xs uppercase tracking-widest text-black/50">
                    © 2025
                  </div>
                  <div className="text-sm">All Rights Reserved</div>
                </div>
              </div>
            </footer>
          </motion.div>
        </div>

        <audio
          ref={audioRef}
          src="https://ildii12az7.ufs.sh/f/wzsKGXUR0TSZ41xUVtolzU5k3FcGZ8dJQj92ALRwW0BhoKHe"
          preload="none"
        />

        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-black/10 bg-[#f5f4f0] p-4 md:hidden">
          <button
            className="flex w-full items-center justify-center space-x-2 bg-black px-6 py-4 text-sm uppercase tracking-widest text-white transition-colors hover:bg-black/90"
            onMouseEnter={() => cursorEnter("SAVE", "button")}
            onMouseLeave={cursorLeave}
          >
            <span>Pre-save</span>
            <Plus size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
