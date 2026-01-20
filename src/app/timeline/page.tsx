import type { Metadata } from "next";
import { TimelineClient } from "./TimelineClient";
import { songs } from "~/components/songsData";
import { getUpcomingReleases } from "~/data/releases";

export const metadata: Metadata = {
  title: "Timeline | Maxwell Young",
  description: "Complete discography and release timeline of Maxwell Young.",
};

// Real release dates for existing songs (add more as needed)
const releaseDates: Record<string, string> = {
  "Wintour": "2024-02-14",
  "Turn It Up": "2024-01-26",
  "Freewheelin'": "2023-11-17",
  "Birthday Girl": "2022-10-21",
  "Only Romantics": "2021-07-23",
  "Daydreamer": "2019-06-14",
  "Nites Like This": "2018-09-28",
  "Overthinking": "2017-11-03",
};

export default async function TimelinePage() {
  const upcomingReleases = getUpcomingReleases().map((t) => ({
    id: t.id,
    title: t.title,
    targetRelease: t.targetRelease,
    status: t.status,
  }));

  // Convert songs to timeline format with real dates where available
  const releasedSongs = songs.map((song) => {
    // Use real date if available, otherwise estimate based on known releases
    const dateStr = releaseDates[song.title] ?? "2020-01-01";
    return {
      id: song.title.toLowerCase().replace(/\s+/g, "-"),
      title: song.title,
      artist: song.artist,
      artwork: song.artwork,
      type: "single" as const,
      date: dateStr,
      links: song.links,
    };
  });

  // Sort by date descending (newest first)
  releasedSongs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <TimelineClient
      releases={releasedSongs}
      upcoming={upcomingReleases}
    />
  );
}
