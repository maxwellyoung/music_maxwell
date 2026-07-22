import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import JsonLd from "~/components/JsonLd";
import ReleaseAudio from "~/components/ReleaseAudio";
import ReleaseLyrics from "~/components/ReleaseLyrics";
import ReleaseNavigation from "~/components/ReleaseNavigation";
import ReleaseRoomShell from "~/components/ReleaseRoomShell";
import TrackedLink from "~/components/TrackedLink";
import songs from "~/components/songsData";

const TurnItUpCartGame = dynamic(() => import("~/components/TurnItUpCartGame"));

export const metadata: Metadata = {
  title: "Turn It Up — Maxwell Young & Thom Haha",
  description:
    "Turn It Up by Maxwell Young and Thom Haha, released April 4, 2025. Music, official film, lyrics, credits, and cart game.",
  alternates: { canonical: "/turn-it-up" },
  openGraph: {
    type: "music.song",
    title: "Turn It Up | Maxwell Young & Thom Haha",
    url: "/turn-it-up",
    images: [
      {
        url: "/artworks/TurnItUp.webp",
        width: 1200,
        height: 1200,
        alt: "Turn It Up artwork",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/artworks/TurnItUp.webp"] },
};

const song = songs.find((item) => item.title === "Turn It Up")!;
const lyricBlocks = (song.lyrics?.[song.title] ?? "").split("\n\n");
const creditLines = song.credits?.split("\n").map((line) => line.trim()) ?? [];

const links = [
  ["Spotify", song.links.spotify],
  ["Apple Music", song.links.appleMusic],
  ["YouTube", song.links.youtube],
  ["SoundCloud", song.links.soundCloud],
] as const;

export default function TurnItUpPage() {
  return (
    <ReleaseRoomShell title={song.title}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicRecording",
          name: song.title,
          url: "https://www.maxwellyoung.info/turn-it-up",
          image: "https://www.maxwellyoung.info/artworks/TurnItUp.webp",
          datePublished: "2025-04-04",
          duration: "PT2M17S",
          genre: "Alternative",
          byArtist: [
            { "@type": "Person", name: "Maxwell Young" },
            { "@type": "Person", name: "Thom Haha" },
          ],
          sameAs: links.map(([, href]) => href).filter(Boolean),
        }}
      />

      <section className="border-b border-[#152018]/20 px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52634d]">
              Maxwell Young &amp; Thom Haha / 04.04.25
            </p>
            <h1 className="mt-5 max-w-[7ch] text-[clamp(5rem,13vw,10rem)] leading-[0.76] tracking-[-0.065em]">
              Turn It Up
            </h1>
            <dl className="mt-9 grid max-w-xl grid-cols-3 border-y border-[#152018]/20 text-sm">
              <div className="py-4">
                <dt className="text-xs text-[#52634d]">Runtime</dt>
                <dd className="mt-1 font-bold">02:17</dd>
              </div>
              <div className="border-x border-[#152018]/20 px-4 py-4">
                <dt className="text-xs text-[#52634d]">Format</dt>
                <dd className="mt-1 font-bold">Single</dd>
              </div>
              <div className="py-4 pl-4">
                <dt className="text-xs text-[#52634d]">Film</dt>
                <dd className="mt-1 font-bold">MiniDV</dd>
              </div>
            </dl>
            <div className="mt-8 max-w-md border-b border-[#152018]/20 pb-5">
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
                    className="border-b border-[#152018]/35 pb-1 text-sm font-bold transition hover:border-[#6f8468] hover:text-[#52634d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6f8468]"
                  >
                    {label} ↗
                  </TrackedLink>
                ) : null,
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden border border-[#152018]/20 bg-[#dfe7d9]">
              <Image
                src={song.artwork}
                alt="Turn It Up artwork"
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#152018]/20 bg-[#dfe7d9]/80 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52634d]">
              01 / Cart run
            </p>
            <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-[#152018]/60">
              Move the cart. Catch seven cans before three get past you.
            </p>
          </div>
          <TurnItUpCartGame />
        </div>
      </section>

      <section className="border-b border-[#152018]/20 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52634d]">
            02 / Film
          </p>
          <div>
            <TrackedLink
              href={song.videoLink!}
              target="_blank"
              rel="noopener noreferrer"
              event="film_opened"
              eventData={{ release: song.title, location: "release_room" }}
              className="group relative block aspect-video overflow-hidden border border-[#152018]/25 bg-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6f8468]/45"
            >
              <Image
                src="https://img.youtube.com/vi/YzKTnAIGqvg/maxresdefault.jpg"
                alt="Turn It Up official video thumbnail"
                fill
                sizes="(min-width: 1024px) 75vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.015]"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/10 transition group-hover:bg-black/25">
                <span className="grid h-16 w-16 place-items-center border border-white bg-black/55 text-white">
                  ▶
                </span>
              </span>
            </TrackedLink>
            <div className="mt-4 grid gap-2 text-sm font-bold sm:grid-cols-2">
              <p>Directed by Tom Shackleton</p>
              <p>Shot on MiniDV</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#152018]/20 px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52634d]">
            Lyrics
          </p>
          <ReleaseLyrics blocks={lyricBlocks} />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[0.25fr_0.75fr]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#52634d]">
            Credits
          </p>
          <div className="grid gap-3 text-lg font-bold sm:grid-cols-2">
            {creditLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <TrackedLink
              href={song.links.microsite!}
              target="_blank"
              rel="noopener noreferrer"
              event="release_site_opened"
              eventData={{ release: song.title, location: "release_room" }}
              className="mt-3 w-fit border-b border-[#152018] pb-1 text-sm"
            >
              original release site ↗
            </TrackedLink>
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
