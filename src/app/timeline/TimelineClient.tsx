"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ExternalLink } from "lucide-react";

interface Release {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  type: "single" | "album" | "ep";
  date: string;
  links?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
}

interface UpcomingRelease {
  id: string;
  title: string;
  targetRelease: string;
  status: string;
}

interface TimelineClientProps {
  releases: Release[];
  upcoming: UpcomingRelease[];
}

function groupByYear(
  releases: Release[]
): Record<string, Release[]> {
  return releases.reduce(
    (acc, release) => {
      const year = new Date(release.date).getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(release);
      return acc;
    },
    {} as Record<string, Release[]>
  );
}

export function TimelineClient({ releases, upcoming }: TimelineClientProps) {
  const [expandedYear, setExpandedYear] = useState<string | null>(
    new Date().getFullYear().toString()
  );

  const groupedReleases = groupByYear(releases);
  const years = Object.keys(groupedReleases).sort((a, b) => Number(b) - Number(a));

  // Add upcoming year if there are upcoming releases
  const upcomingYear = upcoming.length > 0 ? "Upcoming" : null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-foreground">Timeline</h1>
        <p className="text-muted-foreground">
          A journey through the discography
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />

        {/* Upcoming releases */}
        {upcomingYear && upcoming.length > 0 && (
          <div className="mb-12">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() =>
                setExpandedYear(expandedYear === "Upcoming" ? null : "Upcoming")
              }
              className="relative mb-4 flex items-center gap-3 pl-10 md:pl-0 md:mx-auto"
            >
              <div className="absolute left-2.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background md:left-1/2 md:-translate-x-1/2" />
              <span className="text-2xl font-bold text-primary">
                {upcomingYear}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {upcoming.length} coming
              </span>
            </motion.button>

            {expandedYear === "Upcoming" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-10 space-y-3 md:ml-0 md:grid md:grid-cols-2 md:gap-4 md:space-y-0"
              >
                {upcoming.map((release, index) => (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/presave/${release.id}`}
                      className="flex items-center gap-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {release.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(release.targetRelease).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-primary">Pre-save →</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Released years */}
        {years.map((year, yearIndex) => (
          <div key={year} className="mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: yearIndex * 0.1 }}
              onClick={() =>
                setExpandedYear(expandedYear === year ? null : year)
              }
              className="relative mb-4 flex items-center gap-3 pl-10 md:pl-0 md:mx-auto"
            >
              <div className="absolute left-2.5 h-3 w-3 rounded-full bg-foreground/20 ring-4 ring-background md:left-1/2 md:-translate-x-1/2" />
              <span className="text-2xl font-bold text-foreground">{year}</span>
              <span className="text-sm text-muted-foreground">
                {groupedReleases[year]?.length ?? 0} releases
              </span>
            </motion.button>

            {expandedYear === year && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-10 space-y-3 md:ml-0 md:grid md:grid-cols-2 md:gap-4 md:space-y-0"
              >
                {groupedReleases[year]?.map((release, index) => (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={release.artwork}
                        alt={release.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate font-medium text-foreground">
                        {release.title}
                      </h3>
                      <p className="truncate text-sm text-muted-foreground">
                        {release.artist}
                      </p>
                    </div>
                    {release.links?.spotify && (
                      <a
                        href={release.links.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
