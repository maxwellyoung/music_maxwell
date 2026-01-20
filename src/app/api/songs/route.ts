import { NextResponse } from "next/server";
import { songs, type Song } from "~/components/songsData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const artist = searchParams.get("artist");
  const limit = searchParams.get("limit");

  let filtered: Song[] = songs;

  // Filter by title (case-insensitive partial match)
  if (title) {
    filtered = filtered.filter((song) =>
      song.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // Filter by artist (case-insensitive partial match)
  if (artist) {
    filtered = filtered.filter((song) =>
      song.artist.toLowerCase().includes(artist.toLowerCase())
    );
  }

  // Apply limit
  if (limit) {
    const limitNum = parseInt(limit, 10);
    if (!isNaN(limitNum) && limitNum > 0) {
      filtered = filtered.slice(0, limitNum);
    }
  }

  return NextResponse.json({
    count: filtered.length,
    songs: filtered,
  });
}
