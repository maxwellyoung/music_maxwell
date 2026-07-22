import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "~/components/JsonLd";
import ReleaseAudio from "~/components/ReleaseAudio";
import ReleaseNavigation from "~/components/ReleaseNavigation";
import ReleaseRoomShell from "~/components/ReleaseRoomShell";
import TrackedLink from "~/components/TrackedLink";
import songs from "~/components/songsData";

export const metadata: Metadata = {
  title: "Flying | Maxwell Young",
  description:
    "Flying by Maxwell Young, released April 4, 2026. Listen, view the artwork, and read the release details.",
  alternates: { canonical: "/flying" },
  openGraph: {
    type: "music.song",
    title: "Flying | Maxwell Young",
    description: "Flying by Maxwell Young — 01:52, released April 4, 2026.",
    url: "/flying",
    images: [
      {
        url: "/artworks/Flying.jpg",
        width: 1200,
        height: 1200,
        alt: "Flying artwork",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/artworks/Flying.jpg"] },
};

const song = songs.find((item) => item.title === "Flying")!;
const smartLink = song.links.smartLink!;

export default function FlyingPage() {
  return (
    <ReleaseRoomShell
      title={song.title}
      className="!bg-[#dce9f2] !text-[#102230]"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicRecording",
          name: "Flying",
          url: "https://www.maxwellyoung.info/flying",
          image: "https://www.maxwellyoung.info/artworks/Flying.jpg",
          datePublished: "2026-04-04",
          duration: "PT1M52S",
          genre: "Alternative",
          byArtist: {
            "@type": "Person",
            "@id": "https://www.maxwellyoung.info/#artist",
            name: "Maxwell Young",
          },
          sameAs: smartLink,
        }}
      />

      <section className="px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1160px] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#315b76]">
              Maxwell Young / 04.04.26
            </p>
            <h1 className="font-pixel-line mt-4 text-[clamp(6rem,16vw,12rem)] leading-[0.72] tracking-[-0.06em]">
              Flying
            </h1>
            <div className="mt-9 max-w-md border-y border-[#102230]/20 py-4">
              <ReleaseAudio src={song.previewUrl!} release="Flying" />
            </div>
            <TrackedLink
              href={smartLink}
              target="_blank"
              rel="noopener noreferrer"
              event="streaming_destination_clicked"
              eventData={{
                release: "Flying",
                service: "all_links",
                location: "release_room",
              }}
              className="font-pixel-dot mt-8 inline-flex min-h-12 items-center border border-[#102230] px-5 text-xs uppercase tracking-[0.1em] transition hover:bg-[#102230] hover:text-[#dce9f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#102230]"
            >
              listen everywhere ↗
            </TrackedLink>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden border border-[#102230]/25 bg-white/30">
              <Image
                src={song.artwork}
                alt="Flying artwork"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="font-pixel-dot grid grid-cols-[auto_1fr_auto] items-center gap-4 border-x border-b border-[#102230]/25 px-4 py-3 text-[10px] uppercase tracking-[0.1em]">
              <span>00:00</span>
              <span className="h-px bg-[#102230]/35">
                <span className="block h-px w-[72%] bg-[#315b76]" />
              </span>
              <span>01:52</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#102230]/20 bg-[#f5efe5] text-[#171717]">
        <div className="mx-auto grid max-w-[1160px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:px-12">
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.15em] text-[#315b76]">
            Release details
          </p>
          <div className="font-pixel-dot grid gap-px bg-black/15 sm:grid-cols-3">
            {["single", "01:52", "released 04.04.26"].map((fact) => (
              <p
                key={fact}
                className="bg-[#f5efe5] px-4 py-5 text-[10px] uppercase tracking-[0.12em]"
              >
                {fact}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1160px] gap-8 lg:grid-cols-[0.28fr_0.72fr]">
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.15em] text-[#315b76]">
            Credits
          </p>
          <div className="space-y-2 text-lg font-bold">
            <p>Maxwell Young — Flying</p>
            <p>Released April 4, 2026</p>
            <p>Single · 1:52</p>
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
