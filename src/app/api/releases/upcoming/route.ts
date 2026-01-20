import { NextResponse } from "next/server";
import { getUpcomingReleases } from "~/data/releases";

export async function GET() {
  try {
    const upcomingTracks = getUpcomingReleases();

    const releases = upcomingTracks.map((track) => ({
      id: track.id,
      title: track.title,
      releaseDate: track.targetRelease,
      artwork: `/artworks/${track.id}.webp`,
      blurredArtwork: `/artworks/${track.id}.webp`,
      presaveLinks: track.links
        ? {
            spotify: track.links.spotify,
            apple: track.links.appleMusic,
          }
        : undefined,
    }));

    return NextResponse.json({ releases }, { status: 200 });
  } catch (error) {
    console.error("[Releases API] Error:", error);
    return NextResponse.json({ releases: [] }, { status: 200 });
  }
}
