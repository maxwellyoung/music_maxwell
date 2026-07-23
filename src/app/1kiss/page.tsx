import Image from "next/image";
import JsonLd from "~/components/JsonLd";
import ReleaseMoment from "~/components/ReleaseMoment";
import ReleaseLyrics from "~/components/ReleaseLyrics";
import ReleaseNavigation from "~/components/ReleaseNavigation";
import ReleaseRoomShell from "~/components/ReleaseRoomShell";
import { getReleaseBySlug } from "~/data/releases";
import { createReleaseMetadata } from "~/lib/releaseMetadata";

const song = getReleaseBySlug("1kiss")!;

export const metadata = createReleaseMetadata(song, {
  title: "1kiss | Maxwell Young",
  description:
    "1kiss by Maxwell Young, released July 24, 2026. Lyrics, credits, artwork, and listening links.",
});
const spotifyUrl = song.links.spotify!;
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
          sameAs: spotifyUrl,
          inAlbum: {
            "@type": "MusicAlbum",
            name: "1kiss",
            albumReleaseType: "SingleRelease",
          },
        }}
      />

      <section className="border-b border-white/15 px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div className="order-2 lg:order-1">
            <p className="font-pixel-dot text-[11px] uppercase tracking-[0.16em] text-[#b7c8eb]">
              Maxwell Young / 24.07.26
            </p>
            <h1 className="font-pixel-line mb-0 mt-4 text-[clamp(5rem,12vw,9rem)] leading-[0.74] tracking-[-0.05em] text-[#f5f8ff]">
              1kiss
            </h1>
            <p className="font-pixel-line mt-9 max-w-[12ch] text-3xl uppercase leading-[0.88] sm:text-4xl">
              your hips
              <br />
              our lips
              <br />
              one kiss
            </p>
            <div className="mt-10">
              <ReleaseMoment spotifyUrl={spotifyUrl} />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden border border-white/20">
              <Image
                src={song.artwork}
                alt="1kiss artwork"
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/15 bg-[#f2ede4] text-[#07090d]">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:px-12">
          <p className="font-pixel-dot text-xs uppercase tracking-[0.14em]">
            Details
          </p>
          <div>
            <div className="font-pixel-dot grid gap-4 border-y border-black/15 py-5 text-[11px] uppercase tracking-[0.1em] sm:grid-cols-3">
              <span>Single</span>
              <span>02:03</span>
              <span>136 BPM</span>
              <span>F#</span>
              <span>Clean</span>
              <span>Ninetynine Records</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:px-12">
          <p className="font-pixel-dot text-xs uppercase tracking-[0.1em] text-[#8ea6ff]">
            Lyrics
          </p>
          <ReleaseLyrics blocks={lyricBlocks} tone="dark" />
        </div>
      </section>

      <section className="bg-[#f2ede4] text-[#07090d]">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:px-12">
          <p className="font-pixel-dot text-xs uppercase tracking-[0.14em]">
            Credits
          </p>
          <div className="grid gap-3 text-lg font-bold sm:grid-cols-2">
            {creditLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
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
