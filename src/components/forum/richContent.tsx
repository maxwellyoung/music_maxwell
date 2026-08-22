import type * as React from "react";

// Utility to auto-link URLs and embed YouTube/SoundCloud
export function renderRichContent(text: string) {
  if (!text) return null;
  // YouTube (match full URL, including extra params)
  const ytRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=([\w-]{11})([^\s]*)?|youtu\.be\/([\w-]{11})([^\s]*)?)/g;
  // SoundCloud
  const scRegex = /https?:\/\/soundcloud\.com\/[\w\-\/]+/g;
  // Spotify (track, album, playlist, episode)
  const spotifyRegex =
    /https?:\/\/(?:open\.)?spotify\.com\/(track|album|playlist|episode)\/([\w\d]+)(\?si=[\w\d]+)?/g;
  // Generic URL
  const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g;

  const parts: (string | React.JSX.Element)[] = [];
  const textCopy = text;

  // Helper to push plain text
  const pushText = (start: number, end: number) => {
    if (start < end) parts.push(textCopy.slice(start, end));
  };

  // Find all YouTube, SoundCloud, Spotify links and replace with embeds
  const regexes = [ytRegex, scRegex, spotifyRegex, urlRegex];
  let minIndex = -1;
  let minMatch: RegExpExecArray | null = null;
  let minType = -1;
  let cursor = 0;
  while (cursor < textCopy.length) {
    minIndex = -1;
    minMatch = null;
    minType = -1;
    for (let i = 0; i < regexes.length; i++) {
      const regex = regexes[i];
      if (!regex) continue;
      if (typeof regex.lastIndex === "number") {
        regex.lastIndex = cursor;
      }
      const m = typeof regex.exec === "function" ? regex.exec(textCopy) : null;
      if (
        m &&
        (minIndex === -1 || (typeof m.index === "number" && m.index < minIndex))
      ) {
        minIndex = m.index ?? -1;
        minMatch = m;
        minType = i;
      }
    }
    if (!minMatch) {
      pushText(cursor, textCopy.length);
      break;
    }
    pushText(cursor, minIndex);
    if (minMatch) {
      const url = minMatch[0] ?? null;
      if (!url) {
        cursor = minIndex + 1;
        continue;
      }
      if (minType === 0) {
        // YouTube
        let videoId: string | null = null;
        if (minMatch[1])
          videoId = minMatch[1]; // youtube.com/watch?v=...
        else if (minMatch[3]) videoId = minMatch[3]; // youtu.be/...
        if (videoId) {
          parts.push(
            <div
              key={minIndex + "yt"}
              className="my-5 overflow-hidden bg-black"
            >
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>,
          );
        }
      } else if (minType === 1) {
        // SoundCloud
        parts.push(
          <div
            key={minIndex + "sc"}
            className="my-5 overflow-hidden"
          >
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              title="SoundCloud player"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
            />
          </div>,
        );
      } else if (minType === 2) {
        // Spotify
        const type = minMatch[1];
        const id = minMatch[2];
        if (type && id) {
          parts.push(
            <div
              key={minIndex + "sp"}
              className="my-5 overflow-hidden"
            >
              <iframe
                src={`https://open.spotify.com/embed/${type}/${id}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title="Spotify player"
              />
            </div>,
          );
        }
      } else {
        // Generic URL
        parts.push(
          <a
            key={minIndex + "url"}
            href={url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-(--ledger-ink)"
          >
            {url}
          </a>,
        );
      }
      cursor = minIndex + (url ? url.length : 1);
    } else {
      cursor = minIndex + 1;
    }
  }
  return parts.map((part, i) =>
    typeof part === "string" ? <span key={i}>{part}</span> : part,
  );
}
