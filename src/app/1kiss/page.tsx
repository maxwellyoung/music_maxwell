import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import JsonLd from "~/components/JsonLd";
import ReleaseMoment from "~/components/ReleaseMoment";
import ReleaseLyrics from "~/components/ReleaseLyrics";
import ReleaseNavigation from "~/components/ReleaseNavigation";
import ReleaseRoomShell from "~/components/ReleaseRoomShell";
import songs from "~/components/songsData";

const CampaignReel = dynamic(() => import("~/components/CampaignReel"));

export const metadata: Metadata = {
  title: "1kiss — lyrics, artwork, credits, and short films | Maxwell Young",
  description:
    "1kiss by Maxwell Young: an electric pop and alt-R&B single released July 24, 2026, with lyrics, credits, artwork, and four short films.",
  alternates: { canonical: "/1kiss" },
  openGraph: {
    type: "music.song",
    title: "1kiss | Maxwell Young",
    description: "your hips / our lips / one kiss",
    url: "/1kiss",
    images: [
      {
        url: "/1kiss/key-art-feed.png",
        width: 1080,
        height: 1350,
        alt: "1kiss by Maxwell Young",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/1kiss/key-art-feed.png"],
  },
};

const song = songs.find((item) => item.title === "1kiss")!;
const spotifyUrl = song.links.spotify!;
const lyric = song.lyrics?.["1kiss"] ?? "";
const lyricBlocks = lyric.split("\n\n");
const creditLines = song.credits?.split("\n") ?? [];

export default function OneKissPage() {
  return (
    <ReleaseRoomShell
      title={song.title}
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
            The record
          </p>
          <div>
            <p className="font-pixel-line max-w-4xl text-2xl leading-[1.02] sm:text-3xl">
              Bright, hyper-tuned pop and alt-R&amp;B with club-cut vocal chops,
              a bouncy 136 BPM pulse, and a hook built to replay.
            </p>
            <div className="font-pixel-dot mt-8 grid gap-4 border-y border-black/15 py-5 text-[11px] uppercase tracking-[0.1em] sm:grid-cols-3">
              <span>02:03</span>
              <span>136 BPM</span>
              <span>F# / clean</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/15 bg-[#0b0e17]">
        <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 lg:px-12">
          <div className="mb-10 grid gap-3 border-t border-white/20 pt-5 md:grid-cols-[0.28fr_0.72fr]">
            <p className="font-pixel-dot text-xs uppercase tracking-[0.14em] text-[#8ea6ff]">
              18 seconds
            </p>
            <div>
              <h2 className="font-pixel-line mb-0 max-w-[12ch] text-4xl uppercase leading-[0.9] text-[#f5f8ff] sm:text-5xl">
                pick a feeling
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60">
                Choose a way in, or scramble it. Each signal lasts 18 seconds
                and stays quiet until you press play.
              </p>
            </div>
          </div>
          <CampaignReel />
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
            currentTitle={song.title}
            className="lg:col-start-2"
          />
        </div>
      </section>
    </ReleaseRoomShell>
  );
}
