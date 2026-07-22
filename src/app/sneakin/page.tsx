import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "~/components/JsonLd";
import ReleaseLyrics from "~/components/ReleaseLyrics";
import ReleaseNavigation from "~/components/ReleaseNavigation";
import ReleaseRoomShell from "~/components/ReleaseRoomShell";
import TrackedLink from "~/components/TrackedLink";
import songs from "~/components/songsData";

export const metadata: Metadata = {
  title: "Sneakin Drinks Into Bars | Maxwell Young",
  description:
    "Sneakin Drinks Into Bars by Maxwell Young, released April 30, 2026. Artwork, lyrics, and credits.",
  alternates: { canonical: "/sneakin" },
  openGraph: {
    type: "music.song",
    title: "Sneakin Drinks Into Bars | Maxwell Young",
    description: "bar lights / field smoke / highlights",
    url: "/sneakin",
    images: [
      {
        url: "/artworks/SneakinDrinksIntoBars.jpg",
        width: 1200,
        height: 1200,
        alt: "Sneakin Drinks Into Bars artwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/artworks/SneakinDrinksIntoBars.jpg"],
  },
};

const song = songs.find((item) => item.title === "Sneakin Drinks Into Bars")!;
const lyricBlocks = (song.lyrics?.[song.title] ?? "").split("\n\n");
const creditLines = song.credits?.split("\n") ?? [];

export default function SneakinPage() {
  return (
    <ReleaseRoomShell
      title={song.title}
      className="!bg-[#f2ede4] !text-[#141210]"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicRecording",
          name: song.title,
          url: "https://www.maxwellyoung.info/sneakin",
          image:
            "https://www.maxwellyoung.info/artworks/SneakinDrinksIntoBars.jpg",
          datePublished: "2026-04-30",
          genre: "Alternative",
          byArtist: {
            "@type": "Person",
            "@id": "https://www.maxwellyoung.info/#artist",
            name: "Maxwell Young",
          },
        }}
      />

      <section className="border-b border-black/20 px-5 pb-14 pt-28 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="order-2 lg:order-1">
            <p className="font-pixel-dot text-[10px] uppercase tracking-[0.15em] text-black/55">
              Maxwell Young / 30.04.26
            </p>
            <h1 className="font-pixel-line mt-5 max-w-[10ch] text-[clamp(4.4rem,10vw,8.5rem)] leading-[0.77] tracking-[-0.045em]">
              Sneakin Drinks Into Bars
            </h1>
            <p className="font-reenie mt-9 max-w-[16ch] text-4xl leading-[0.9] text-[#c43762] sm:text-5xl">
              bar lights / field smoke / highlights
            </p>
            <TrackedLink
              href={song.links.appleMusic!}
              target="_blank"
              rel="noopener noreferrer"
              event="streaming_destination_clicked"
              eventData={{
                release: song.title,
                service: "apple_music",
                location: "release_room",
              }}
              className="font-pixel-dot mt-9 inline-block border-b border-black pb-1 text-xs uppercase tracking-[0.1em] transition hover:border-[#c43762] hover:text-[#c43762]"
            >
              listen on Apple Music ↗
            </TrackedLink>
          </div>

          <div className="order-1 grid grid-cols-[1fr_0.18fr] gap-3 lg:order-2">
            <div className="relative aspect-square overflow-hidden border border-black/20 bg-black">
              <Image
                src={song.artwork}
                alt="Sneakin Drinks Into Bars artwork"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 82vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-rows-3 gap-3" aria-hidden="true">
              <div className="bg-[#c43762]" />
              <div className="bg-[#344155]" />
              <div className="bg-[#d9b78f]" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#151719] text-[#f6f0e6]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.26fr_0.74fr] lg:px-12">
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.15em] text-[#ef789b]">
            Field notes
          </p>
          <div className="grid gap-px bg-white/15 sm:grid-cols-3">
            {["call off work", "mirror and my match", "find the thread"].map(
              (line, index) => (
                <div
                  key={line}
                  className="min-h-40 bg-[#151719] p-5 sm:min-h-52"
                >
                  <span className="font-pixel-dot text-[10px] text-white/35">
                    0{index + 1}
                  </span>
                  <p className="font-reenie mt-12 text-4xl leading-[0.88] text-white/80">
                    {line}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-black/20">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.26fr_0.74fr] lg:px-12">
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.15em] text-[#c43762]">
            Lyrics
          </p>
          <ReleaseLyrics blocks={lyricBlocks} />
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.26fr_0.74fr] lg:px-12">
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.15em]">
            Credits
          </p>
          <div className="grid gap-3 text-lg font-bold">
            {creditLines.map((line) => (
              <p key={line}>{line.trim()}</p>
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
