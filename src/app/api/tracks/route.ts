import { NextResponse } from "next/server";
import { songs } from "~/components/songsData";
import { releasesData, getUpcomingReleases } from "~/data/releases";

export interface UnifiedTrack {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  releaseDate: string;
  status: "released" | "upcoming";
  collection?: string;
  links?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    microsite?: string;
  };
}

// Real release dates mapping (should eventually move to songsData itself)
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

export async function GET() {
  try {
    // Convert released songs to unified format
    const releasedTracks: UnifiedTrack[] = songs.map((song) => ({
      id: song.title.toLowerCase().replace(/\s+/g, "-"),
      title: song.title,
      artist: song.artist,
      artwork: song.artwork,
      releaseDate: releaseDates[song.title] ?? "2020-01-01",
      status: "released",
      links: song.links,
    }));

    // Convert upcoming releases to unified format
    const upcomingTracks: UnifiedTrack[] = getUpcomingReleases().map((track) => ({
      id: track.id,
      title: track.title,
      artist: releasesData.config.artistName,
      artwork: `/artworks/${track.id}.webp`,
      releaseDate: track.targetRelease,
      status: "upcoming",
      collection: track.collection,
      links: track.links,
    }));

    // Combine and sort by date (newest first)
    const allTracks = [...upcomingTracks, ...releasedTracks].sort(
      (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );

    return NextResponse.json({
      tracks: allTracks,
      upcoming: upcomingTracks,
      released: releasedTracks,
      config: {
        artistName: releasesData.config.artistName,
        nextRelease: upcomingTracks[0] ?? null,
      },
    });
  } catch (error) {
    console.error("[Tracks API] Error:", error);
    return NextResponse.json({ tracks: [], error: "Failed to fetch tracks" }, { status: 500 });
  }
}
