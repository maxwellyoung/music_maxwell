import JsonLd from "~/components/JsonLd";
import OneKissTransmission from "~/components/OneKissTransmission";
import ReleaseMoment from "~/components/ReleaseMoment";
import ReleaseLyrics from "~/components/ReleaseLyrics";
import ReleaseNavigation from "~/components/ReleaseNavigation";
import ReleaseRoomShell from "~/components/ReleaseRoomShell";
import { oneKissReleaseMedia } from "~/data/releaseMedia";
import { getReleaseBySlug, getStreamingDestinations } from "~/data/releases";
import { createReleaseMetadata } from "~/lib/releaseMetadata";

const song = getReleaseBySlug("1kiss")!;

export const metadata = createReleaseMetadata(song, {
  title: "1kiss by Maxwell Young — Listen Now",
  description:
    "Listen to 1kiss by Maxwell Young on Spotify, Apple Music, YouTube Music, TIDAL and Deezer. Explore the artwork, credits and complete lyrics.",
});
const streamingDestinations = getStreamingDestinations(song);
const lyric = song.lyrics?.["1kiss"] ?? "";
const lyricBlocks = lyric.split("\n\n");
const creditLines = song.credits?.split("\n") ?? [];

export default function OneKissPage() {
  return (
    <ReleaseRoomShell
      slug={song.slug}
      className="one-kiss-brand !bg-[#05070c] !text-[#f5f8ff]"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicRecording",
          "@id": "https://www.maxwellyoung.info/1kiss#recording",
          name: "1kiss",
          url: "https://www.maxwellyoung.info/1kiss",
          image: "https://www.maxwellyoung.info/artworks/1kiss.jpg",
          datePublished: "2026-07-24",
          duration: "PT2M3S",
          genre: ["Pop", "Alternative R&B"],
          byArtist: {
            "@type": "Person",
            "@id": "https://www.maxwellyoung.info/#artist",
            name: "Maxwell Young",
          },
          sameAs: streamingDestinations.map(({ href }) => href),
          inAlbum: {
            "@type": "MusicAlbum",
            name: "1kiss",
            albumReleaseType: "SingleRelease",
          },
        }}
      />

      <OneKissTransmission
        artworkUrl={song.artwork}
        excerptUrl={song.previewUrl!}
        masterSha256={oneKissReleaseMedia.audioMaster.sha256}
        links={song.links}
      />

      <section className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:px-12 lg:py-24">
          <p className="font-pixel-dot text-xs uppercase tracking-[0.1em] text-[#8ea6ff]">
            A / 03 / lyrics
          </p>
          <ReleaseLyrics blocks={lyricBlocks} tone="dark" />
        </div>
      </section>

      <section className="bg-[#f2ede4] text-[#07090d]">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:px-12 lg:py-24">
          <p className="font-pixel-dot text-xs uppercase tracking-[0.14em]">
            A / 04 / credits
          </p>
          <div>
            <div className="grid gap-3 text-lg font-bold sm:grid-cols-2">
              {creditLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-12 border-t border-black/15 pt-8">
              <ReleaseMoment links={song.links} />
            </div>
          </div>
          <ReleaseNavigation
            currentSlug={song.slug}
            className="lg:col-start-2"
          />
        </div>
      </section>
    </ReleaseRoomShell>
  );
}
