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
    <main className="min-h-screen bg-[#05070c] text-[#f5f8ff]">
      <section className="relative isolate overflow-hidden border-b border-white/15 px-5 pb-16 pt-28 sm:px-8 lg:px-12">
        <Image
          src="/1kiss/signal-bloom-blue.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,12,.94)_0%,rgba(5,7,12,.74)_46%,rgba(5,7,12,.36)_100%)]" />

        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div className="order-2 lg:order-1">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#b7c8eb]">
              Maxwell Young / Ninetynine Records / 24.07.26
            </p>
            <h1 className="mb-0 mt-4 text-[clamp(6rem,16vw,13rem)] font-bold leading-[0.72] tracking-[-0.085em] text-[#f5f8ff]">
              1kiss
            </h1>
            <p className="mt-9 max-w-[12ch] text-4xl font-bold uppercase leading-[0.84] tracking-[-0.055em] sm:text-6xl">
              your hips
              <br />
              our lips
              <br />
              one kiss
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <span className="bg-[#d8ff30] px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#07090d]">
                out Friday
              </span>
              <a
                href={song.links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white pb-1 text-xs font-bold uppercase tracking-[0.18em] transition hover:border-[#32d8ff] hover:text-[#32d8ff]"
              >
                Follow on Spotify ↗
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-square overflow-hidden border-x-[7px] border-[#ff40aa] shadow-2xl shadow-[#32d8ff]/10">
              <Image
                src={song.artwork}
                alt="1kiss artwork"
                fill
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="h-2 w-2/3 bg-[#32d8ff]" />
          </div>
        </div>
      </section>

      <section className="border-b border-white/15 bg-[#eef4ff] text-[#07090d]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-12">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.24em]">
              The record
            </p>
            <div className="mt-5 h-2 w-24 bg-[#ff40aa]" />
          </div>
          <div>
            <p className="max-w-4xl text-3xl font-bold leading-[0.96] tracking-[-0.045em] sm:text-5xl">
              Bright, hyper-tuned Pop / Alt R&amp;B with club-cut vocal chops, a
              bouncy 136 BPM pulse, and a hook built to replay.
            </p>
            <div className="mt-10 grid gap-4 border-y border-black/15 py-6 font-mono text-xs font-bold uppercase tracking-[0.18em] sm:grid-cols-3">
              <span>02:03</span>
              <span>136 BPM</span>
              <span>F# / clean</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-12">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#32d8ff]">
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

      <section className="bg-[#d8ff30] text-[#07090d]">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-12">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em]">
            Credits
          </p>
          <div className="grid gap-3 text-lg font-bold sm:grid-cols-2">
            {creditLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <Link
            href="/"
            className="w-fit border-b border-black pb-1 font-mono text-xs font-bold uppercase tracking-[0.18em]"
          >
            Back to the archive ↙
          </Link>
        </div>
      </section>
    </main>
  );
}
