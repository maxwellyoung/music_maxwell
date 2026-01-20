"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EmailCapture } from "~/components/EmailCapture";
import { trackPresave } from "~/components/providers/PostHogProvider";

interface TrackData {
  id: string;
  title: string;
  releaseDate: string;
  description?: string;
  genres?: string[];
  moods?: string[];
  links?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm sm:h-24 sm:w-24">
        <span className="text-4xl font-bold tabular-nums text-white sm:text-5xl">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-sm uppercase tracking-wider text-white/50">
        {label}
      </span>
    </motion.div>
  );
}

function ShareButton({
  platform,
  url,
  title,
}: {
  platform: "twitter" | "facebook" | "copy";
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Pre-save "${title}" by Maxwell Young! ${url}`)}`,
        "_blank",
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else {
      void navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const icons = {
    twitter: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    facebook: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    copy: copied ? (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  };

  return (
    <button
      onClick={handleShare}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
    >
      {icons[platform]}
    </button>
  );
}

export function PresaveClient({ track }: { track: TrackData }) {
  const timeLeft = useCountdown(track.releaseDate);
  const releaseDate = new Date(track.releaseDate);
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isReleased = new Date() >= releaseDate;

  const pageUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://maxwellyoung.info/presave/${track.id}`;

  const handlePresaveClick = (platform: string) => {
    trackPresave(track.title, platform);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <Image
          src={`/artworks/${track.id}.webp`}
          alt=""
          fill
          className="object-cover opacity-20 blur-3xl"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          {/* Artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8 h-64 w-64 overflow-hidden rounded-2xl shadow-2xl sm:h-80 sm:w-80"
          >
            <Image
              src={`/artworks/${track.id}.webp`}
              alt={track.title}
              fill
              className={`object-cover ${!isReleased ? "blur-xl brightness-75" : ""}`}
              priority
            />
            {!isReleased && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-white drop-shadow-lg">?</span>
              </div>
            )}
          </motion.div>

          {/* Title & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-white/50">
              {isReleased ? "Out Now" : "New Single"}
            </p>
            <h1 className="mb-2 text-4xl font-bold text-white sm:text-6xl">{track.title}</h1>
            <p className="text-lg text-white/60">Maxwell Young</p>
            <p className="mt-4 text-white/40">{formattedDate}</p>
          </motion.div>

          {/* Description */}
          {track.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-lg text-white/70"
            >
              {track.description}
            </motion.p>
          )}

          {/* Genres & Moods */}
          {((track.genres?.length ?? 0) > 0 || (track.moods?.length ?? 0) > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex flex-wrap justify-center gap-2"
            >
              {track.genres?.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {genre}
                </span>
              ))}
              {track.moods?.map((mood) => (
                <span
                  key={mood}
                  className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300"
                >
                  {mood}
                </span>
              ))}
            </motion.div>
          )}

          {/* Countdown or Streaming Links */}
          {!isReleased ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex gap-4"
              >
                <CountdownUnit value={timeLeft.days} label="Days" />
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                <CountdownUnit value={timeLeft.seconds} label="Seconds" />
              </motion.div>

              {/* Pre-save buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex flex-col gap-4 sm:flex-row"
              >
                {track.links?.spotify && (
                  <a
                    href={track.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handlePresaveClick("spotify")}
                    className="flex items-center gap-3 rounded-full bg-[#1DB954] px-8 py-4 font-medium text-white transition-all hover:scale-105 hover:bg-[#1DB954]/90"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Pre-save on Spotify
                  </a>
                )}
                {track.links?.appleMusic && (
                  <a
                    href={track.links.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handlePresaveClick("apple")}
                    className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#FA233B] to-[#FB5C74] px-8 py-4 font-medium text-white transition-all hover:scale-105"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15C17.734.01 17.463 0 16.974 0H7.026c-.49 0-.76.01-1.163.014-.525.015-1.046.057-1.56.15-.673.121-1.304.353-1.878.727C1.307 1.663.562 2.663.245 3.974.07 4.693.006 5.426.006 6.163c-.002.54 0 1.08 0 1.62v8.434c0 .54-.002 1.08 0 1.62 0 .738.064 1.47.238 2.189.317 1.312 1.062 2.312 2.18 3.044.574.374 1.204.606 1.878.727.515.093 1.036.135 1.56.15.404.004.674.014 1.163.014h9.948c.49 0 .76-.01 1.163-.014.526-.015 1.047-.057 1.563-.15.674-.121 1.304-.353 1.878-.727 1.118-.732 1.863-1.732 2.18-3.044.176-.72.24-1.451.24-2.189.002-.54 0-1.08 0-1.62V7.783c0-.54.002-1.08 0-1.62v-.039zm-6.537 6.29v4.804c0 .246-.018.492-.065.734-.106.521-.357.93-.795 1.214-.28.181-.597.271-.932.271-.318 0-.622-.076-.912-.226l-4.05-2.095c-.318-.164-.575-.393-.768-.688-.193-.294-.29-.625-.29-.99v-4.803c0-.246.018-.492.066-.734.106-.52.356-.93.794-1.214.28-.181.597-.271.933-.271.318 0 .621.076.911.226l4.05 2.095c.318.164.576.393.769.688.193.294.289.625.289.99z" />
                    </svg>
                    Pre-add on Apple Music
                  </a>
                )}
              </motion.div>

              {/* Email capture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-12 w-full max-w-md"
              >
                <p className="mb-4 text-sm text-white/50">
                  Get notified when this drops
                </p>
                <EmailCapture
                  source={`presave-${track.id}`}
                  variant="hero"
                />
              </motion.div>
            </>
          ) : (
            /* Released - show streaming links */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col gap-4 sm:flex-row"
            >
              {track.links?.spotify && (
                <a
                  href={track.links.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-full bg-[#1DB954] px-8 py-4 font-medium text-white transition-all hover:scale-105"
                >
                  Listen on Spotify
                </a>
              )}
              {track.links?.appleMusic && (
                <a
                  href={track.links.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#FA233B] to-[#FB5C74] px-8 py-4 font-medium text-white transition-all hover:scale-105"
                >
                  Listen on Apple Music
                </a>
              )}
            </motion.div>
          )}

          {/* Share buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <p className="mb-4 text-sm text-white/40">Share</p>
            <div className="flex gap-3">
              <ShareButton platform="twitter" url={pageUrl} title={track.title} />
              <ShareButton platform="facebook" url={pageUrl} title={track.title} />
              <ShareButton platform="copy" url={pageUrl} title={track.title} />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
