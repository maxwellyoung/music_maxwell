import { songs } from "~/components/songsData";

const SITE_URL = "https://maxwellyoung.info";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Maxwell Young - New Releases</title>
    <link>${SITE_URL}</link>
    <description>New music releases from Maxwell Young, alt-pop artist from Wellington, NZ</description>
    <language>en-nz</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/artworks/wintour.webp</url>
      <title>Maxwell Young</title>
      <link>${SITE_URL}</link>
    </image>
    ${songs
      .map(
        (song, index) => `
    <item>
      <title>${escapeXml(song.title)}</title>
      <link>${song.links.spotify}</link>
      <description>${escapeXml(`New release from ${song.artist}. Listen now on Spotify, Apple Music, and YouTube.`)}</description>
      <pubDate>${new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1000).toUTCString()}</pubDate>
      <guid isPermaLink="false">${song.links.spotify}</guid>
      <enclosure url="${SITE_URL}${song.artwork}" type="image/webp"/>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
