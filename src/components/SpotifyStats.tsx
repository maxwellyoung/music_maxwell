"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Music2, Headphones } from "lucide-react";

interface SpotifyStatsProps {
  monthlyListeners?: number;
  followers?: number;
  topCities?: { name: string; listeners: number }[];
  variant?: "full" | "compact";
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

export function SpotifyStats({
  monthlyListeners = 22000,
  followers = 8500,
  topCities = [
    { name: "Wellington", listeners: 3200 },
    { name: "Auckland", listeners: 2800 },
    { name: "Los Angeles", listeners: 1500 },
  ],
  variant = "full",
}: SpotifyStatsProps) {
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5"
      >
        <Headphones className="h-4 w-4 text-[#1DB954]" />
        <span className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {formatNumber(monthlyListeners)}
          </span>{" "}
          monthly listeners
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]/10">
          <Music2 className="h-5 w-5 text-[#1DB954]" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Spotify Stats</h3>
          <p className="text-sm text-muted-foreground">Updated weekly</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-background/50 p-4">
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <Headphones className="h-4 w-4" />
            <span className="text-sm">Monthly Listeners</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(monthlyListeners)}
          </p>
        </div>

        <div className="rounded-xl bg-background/50 p-4">
          <div className="mb-1 flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Followers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatNumber(followers)}
          </p>
        </div>
      </div>

      {topCities.length > 0 && (
        <div className="mt-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Top Cities</span>
          </div>
          <div className="space-y-2">
            {topCities.map((city, index) => {
              const maxListeners = topCities[0]?.listeners ?? 1;
              return (
                <div key={city.name} className="flex items-center gap-3">
                  <span className="w-4 text-sm text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {city.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(city.listeners)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(city.listeners / maxListeners) * 100}%`,
                        }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        className="h-full rounded-full bg-[#1DB954]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <a
        href="https://open.spotify.com/artist/5HONdRTLNvBjlD2LirKp0q"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-sm text-[#1DB954] transition-colors hover:underline"
      >
        Listen on Spotify →
      </a>
    </motion.div>
  );
}
