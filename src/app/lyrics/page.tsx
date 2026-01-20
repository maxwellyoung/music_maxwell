import type { Metadata } from "next";
import { LyricsSearchClient } from "./LyricsSearchClient";
import { songs } from "~/components/songsData";

export const metadata: Metadata = {
  title: "Lyrics | Maxwell Young",
  description: "Search and explore lyrics from all Maxwell Young songs.",
};

export default function LyricsPage() {
  // Extract all lyrics data
  const lyricsData = songs
    .filter((song) => song.lyrics && Object.keys(song.lyrics).length > 0)
    .map((song) => ({
      songTitle: song.title,
      artist: song.artist,
      artwork: song.artwork,
      lyrics: song.lyrics ?? {},
      spotifyLink: song.links.spotify,
    }));

  return <LyricsSearchClient songs={lyricsData} />;
}
