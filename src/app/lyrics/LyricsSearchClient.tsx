"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Music, ExternalLink, X } from "lucide-react";

interface SongLyrics {
  songTitle: string;
  artist: string;
  artwork: string;
  lyrics: Record<string, string>;
  spotifyLink: string;
}

interface SearchResult {
  songTitle: string;
  trackTitle: string;
  artist: string;
  artwork: string;
  spotifyLink: string;
  matchedLines: string[];
  fullLyrics: string;
}

interface LyricsSearchClientProps {
  songs: SongLyrics[];
}

export function LyricsSearchClient({ songs }: LyricsSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    for (const song of songs) {
      for (const [trackTitle, lyrics] of Object.entries(song.lyrics)) {
        const lines = lyrics.split("\n");
        const matchedLines = lines.filter((line) =>
          line.toLowerCase().includes(query)
        );

        if (matchedLines.length > 0) {
          results.push({
            songTitle: song.songTitle,
            trackTitle,
            artist: song.artist,
            artwork: song.artwork,
            spotifyLink: song.spotifyLink,
            matchedLines: matchedLines.slice(0, 3), // Show up to 3 matched lines
            fullLyrics: lyrics,
          });
        }
      }
    }

    return results;
  }, [searchQuery, songs]);

  // All songs for browsing
  const allSongs = useMemo(() => {
    const result: SearchResult[] = [];
    for (const song of songs) {
      for (const [trackTitle, lyrics] of Object.entries(song.lyrics)) {
        result.push({
          songTitle: song.songTitle,
          trackTitle,
          artist: song.artist,
          artwork: song.artwork,
          spotifyLink: song.spotifyLink,
          matchedLines: [],
          fullLyrics: lyrics,
        });
      }
    }
    return result;
  }, [songs]);

  const displaySongs = searchQuery.length >= 2 ? searchResults : allSongs;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-foreground">Lyrics</h1>
        <p className="text-muted-foreground">
          Search for any line across all songs
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lyrics... (e.g. 'freewheelin', 'turn it up')"
          className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </motion.div>

      {/* Results count */}
      {searchQuery.length >= 2 && (
        <p className="mb-4 text-sm text-muted-foreground">
          {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
          for &quot;{searchQuery}&quot;
        </p>
      )}

      {/* Results Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {displaySongs.map((result, index) => (
            <motion.button
              key={`${result.songTitle}-${result.trackTitle}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedResult(result)}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30 hover:bg-card/80"
            >
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={result.artwork}
                  alt={result.songTitle}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-medium text-foreground">
                  {result.trackTitle}
                </h3>
                <p className="mb-2 truncate text-sm text-muted-foreground">
                  {result.artist}
                </p>
                {result.matchedLines.length > 0 && (
                  <div className="space-y-1">
                    {result.matchedLines.map((line, i) => (
                      <p
                        key={i}
                        className="truncate text-xs text-muted-foreground"
                      >
                        <span className="text-primary">&quot;</span>
                        {highlightMatch(line, searchQuery)}
                        <span className="text-primary">&quot;</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <Music className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {searchQuery.length >= 2 && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <Music className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No lyrics found matching &quot;{searchQuery}&quot;
          </p>
        </motion.div>
      )}

      {/* Lyrics Modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center gap-4 border-b border-border p-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={selectedResult.artwork}
                    alt={selectedResult.songTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    {selectedResult.trackTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedResult.artist}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedResult.spotifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#1DB954] p-2 text-white transition-colors hover:bg-[#1DB954]/90"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Lyrics */}
              <div className="max-h-[60vh] overflow-y-auto p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/80">
                  {searchQuery
                    ? highlightLyrics(selectedResult.fullLyrics, searchQuery)
                    : selectedResult.fullLyrics}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-primary/20 text-primary">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function highlightLyrics(lyrics: string, query: string): React.ReactNode {
  if (!query) return lyrics;

  const lines = lyrics.split("\n");

  return lines.map((line, i) => (
    <span key={i}>
      {highlightMatch(line, query)}
      {"\n"}
    </span>
  ));
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
