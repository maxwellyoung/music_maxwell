import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "~/components/JsonLd";
import ReleaseAudio from "~/components/ReleaseAudio";
import ReleaseLyrics from "~/components/ReleaseLyrics";
import ReleaseNavigation from "~/components/ReleaseNavigation";
import ReleaseRoomShell from "~/components/ReleaseRoomShell";
import TrackedLink from "~/components/TrackedLink";
import WintourCoverCut from "~/components/WintourCoverCut";
import songs from "~/components/songsData";

export const metadata: Metadata = {
  title: "Wintour — Maxwell Young",
  description:
    "Wintour by Maxwell Young, released April 25, 2025. Artwork, film, credits, and listening links.",
  alternates: { canonical: "/wintour" },
  openGraph: {
    type: "music.song",
    title: "Wintour | Maxwell Young",
    url: "/wintour",
    images: [
      {
        url: "/artworks/wintour.webp",
        width: 1200,
        height: 1200,
        alt: "Wintour artwork",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/artworks/wintour.webp"] },
};

const song = songs.find((item) => item.title === "Wintour")!;
const lyricBlocks = (song.lyrics?.[song.title] ?? "").split("\n\n");
const links = [
  ["Spotify", song.links.spotify],
  ["Apple Music", song.links.appleMusic],
  ["YouTube", song.links.youtube],
  ["Tidal", song.links.tidal],
] as const;

export default function WintourPage() {
  return (
    <ReleaseRoomShell title={song.title}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicRecording",
          name: song.title,
          url: "https://www.maxwellyoung.info/wintour",
          image: "https://www.maxwellyoung.info/artworks/wintour.webp",
          datePublished: "2025-04-25",
          duration: "PT1M19S",
          byArtist: {
            "@type": "Person",
            "@id": "https://www.maxwellyoung.info/#artist",
            name: "Maxwell Young",
          },
          sameAs: links.map(([, href]) => href).filter(Boolean),
        }}
      />

      <section className="border-b border-black/20 px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c61f36]">
              Maxwell Young / 25.04.25
            </p>
            <h1 className="mt-5 text-[clamp(5.5rem,15vw,11rem)] leading-[0.72] tracking-[-0.07em]">
              Wintour
            </h1>
            <dl className="mt-10 grid max-w-xl grid-cols-2 border-y border-black/20 text-sm sm:grid-cols-4">
              {[
                ["Runtime", "01:19"],
                ["Format", "Single"],
                ["Production", "Eddie Johnston"],
                ["Artwork", "Elijah Broughton"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-black/20 px-3 py-4 first:pl-0 sm:border-l sm:first:border-l-0"
                >
                  <dt className="text-xs text-black/50">{label}</dt>
                  <dd className="mt-1 font-bold">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 max-w-md border-b border-black/20 pb-5">
              <ReleaseAudio src={song.previewUrl!} release={song.title} />
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              {links.map(([label, href]) =>
                href ? (
                  <TrackedLink
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    event="streaming_destination_clicked"
                    eventData={{
                      release: song.title,
                      service: label.toLowerCase().replace(" ", "_"),
                      location: "release_room",
                    }}
                    className="border-b border-black/30 pb-1 text-sm font-bold transition hover:border-[#c61f36] hover:text-[#c61f36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c61f36]"
                  >
                    {label} ↗
                  </TrackedLink>
                ) : null,
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden border border-black/20 bg-[#ded9cf]">
              <Image
                src={song.artwork}
                alt="Wintour artwork"
                fill
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c61f36]">
              01 / Artwork
            </p>
            <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-black/55">
              Two crops of the same frame. Move the red line to compare them.
            </p>
          </div>
          <WintourCoverCut />
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#111] px-5 py-16 text-[#efede6] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ef5268]">
            02 / Film
          </p>
          <TrackedLink
            href={song.videoLink!}
            target="_blank"
            rel="noopener noreferrer"
            event="film_opened"
            eventData={{ release: song.title, location: "release_room" }}
            className="group relative block aspect-video overflow-hidden border border-white/25 bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c61f36]"
          >
            <Image
              src="https://img.youtube.com/vi/CVpatk_f0tg/maxresdefault.jpg"
              alt="Wintour film thumbnail"
              fill
              sizes="(min-width: 1024px) 75vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.015]"
            />
            <span className="absolute inset-0 grid place-items-center bg-black/15 transition group-hover:bg-black/30">
              <span className="grid h-16 w-16 place-items-center border border-white bg-black/60 text-white">
                ▶
              </span>
            </span>
          </TrackedLink>
        </div>
      </section>

      <section className="border-b border-black/20 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c61f36]">
            Lyrics
          </p>
          <ReleaseLyrics blocks={lyricBlocks} />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c61f36]">
            Credits
          </p>
          <div className="grid gap-3 text-lg font-bold sm:grid-cols-2">
            <p>Produced by Maxwell Young &amp; Eddie Johnston</p>
            <p>Artwork by Elijah Broughton</p>
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
