"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface UpcomingRelease {
  id: string;
  title: string;
  releaseDate: string;
  artwork?: string;
  presaveLinks?: {
    spotify?: string;
    apple?: string;
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

function CountdownDisplay({ timeLeft }: { timeLeft: TimeLeft }) {
  return (
    <div className="flex items-center gap-1 font-mono text-sm text-muted-foreground">
      <span>{timeLeft.days}d</span>
      <span className="text-muted-foreground/50">:</span>
      <span>{timeLeft.hours.toString().padStart(2, "0")}h</span>
      <span className="text-muted-foreground/50">:</span>
      <span>{timeLeft.minutes.toString().padStart(2, "0")}m</span>
      <span className="text-muted-foreground/50">:</span>
      <span>{timeLeft.seconds.toString().padStart(2, "0")}s</span>
    </div>
  );
}

export function UpcomingReleases() {
  const [nextRelease, setNextRelease] = useState<UpcomingRelease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await fetch("/api/releases/upcoming");
        if (response.ok) {
          const data = (await response.json()) as { releases?: UpcomingRelease[] };
          const releases = data.releases ?? [];
          // Get the soonest release only
          if (releases.length > 0) {
            const sorted = [...releases].sort(
              (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
            );
            setNextRelease(sorted[0] ?? null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch upcoming releases:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchReleases();
  }, []);

  const timeLeft = useCountdown(nextRelease?.releaseDate ?? new Date().toISOString());

  if (loading || !nextRelease) {
    return null;
  }

  const releaseDate = new Date(nextRelease.releaseDate);
  const formattedDate = releaseDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden border-b border-border bg-gradient-to-r from-primary/5 to-transparent"
    >
      <div className="container mx-auto px-4">
        <Link
          href={`/presave/${nextRelease.id}`}
          className="flex items-center justify-between py-3 transition-colors hover:bg-primary/5"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              New Single
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="font-medium text-foreground">{nextRelease.title}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-4">
            <CountdownDisplay timeLeft={timeLeft} />
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
              Pre-save
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
