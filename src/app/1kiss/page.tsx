import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import songs from "~/components/songsData";

export const metadata: Metadata = {
  title: "1kiss | Maxwell Young",
  description:
    "1kiss by Maxwell Young. Bright, glossy Pop / Alt R&B. Out Friday, July 24.",
  openGraph: {
    title: "1kiss | Maxwell Young",
    description: "your hips / our lips / one kiss",
    images: ["/1kiss/key-art-feed.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/1kiss/key-art-feed.png"],
  },
};

const song = songs.find((item) => item.title === "1kiss")!;
const lyric = song.lyrics?.["1kiss"] ?? "";
const lyricBlocks = lyric.split("\n\n");
const creditLines = song.credits?.split("\n") ?? [];

export default function OneKissPage() {
  return (
    <main className="one-kiss-brand min-h-screen bg-[#05070c] text-[#f5f8ff]">
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
            <div className="mt-10 flex items-center">
              <a
                href={song.links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel-dot border-b border-white pb-1 text-xs uppercase tracking-[0.1em] transition hover:border-[#8ea6ff] hover:text-[#8ea6ff]"
              >
                Follow on Spotify ↗
              </a>
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
          <div>
            <p className="font-pixel-dot text-xs uppercase tracking-[0.14em]">
              The record
            </p>
          </div>
          <div>
            <p className="font-pixel-line max-w-4xl text-2xl leading-[1.02] sm:text-3xl">
              Bright, hyper-tuned Pop / Alt R&amp;B with club-cut vocal chops, a
              bouncy 136 BPM pulse, and a hook built to replay.
            </p>
            <div className="font-pixel-dot mt-8 grid gap-4 border-y border-black/15 py-5 text-[11px] uppercase tracking-[0.1em] sm:grid-cols-3">
              <span>02:03</span>
              <span>136 BPM</span>
              <span>F# / clean</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.28fr_0.72fr] lg:px-12">
          <div>
            <p className="font-pixel-dot text-xs uppercase tracking-[0.1em] text-[#8ea6ff]">
              Lyrics
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {lyricBlocks.map((block) => (
              <p
                key={block}
                className="text-white/82 whitespace-pre-line text-lg font-semibold leading-relaxed"
              >
                {block}
              </p>
            ))}
          </div>
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
          <Link
            href="/"
            className="font-pixel-dot w-fit border-b border-black pb-1 text-xs uppercase tracking-[0.1em] lg:col-start-2"
          >
            Back to the archive ↙
          </Link>
        </div>
      </section>
    </main>
  );
}
