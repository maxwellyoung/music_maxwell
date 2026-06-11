import Image from "next/image";
import Link from "next/link";
import CollectableGrid from "~/components/CollectableGrid";
import SneakinLeadup from "~/components/SneakinLeadup";
import songs from "~/components/songsData";

export default function Home() {
  const featuredSong = songs[0]!;
  const releaseRail = songs.slice(1, 6);

  return (
    <main className="min-h-[90vh]">
      <section className="container mx-auto px-4 pb-2 pt-8 sm:px-6 md:px-8">
        <div className="mb-12 grid gap-7 rounded-[1.6rem] border border-foreground/10 bg-[#f1eadf]/55 p-5 shadow-sm shadow-foreground/5 sm:p-6 md:grid-cols-[1.04fr_0.96fr] md:items-center">
          <div className="space-y-5 md:pl-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/45">
              Apr 30
            </p>
            <div>
              <h1 className="max-w-4xl text-5xl leading-[0.88] tracking-[-0.04em] text-foreground sm:text-7xl md:text-8xl">
                {featuredSong.title}
              </h1>
              <p className="font-reenie mt-4 max-w-xl text-3xl leading-none text-foreground/65 sm:text-4xl">
                bar lights / field smoke / highlights
              </p>
            </div>
            <SneakinLeadup />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sneakin"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-background transition hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Sneakin
              </Link>
              <Link
                href="/forum/new?title=bar%20lights&content=field%20smoke%20/%20highlights"
                className="rounded-full bg-background/65 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-foreground/65 transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Leave A Note
              </Link>
            </div>
          </div>
          <Link
            href="/sneakin"
            className="group relative block aspect-square overflow-hidden rounded-[1.25rem] bg-black shadow-xl shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            aria-label="Open Sneakin Drinks artwork"
          >
            <Image
              src={featuredSong.artwork}
              alt={featuredSong.title}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        </div>
        <section
          aria-label="Recent releases"
          className="mb-10 overflow-hidden rounded-[1.25rem] border border-foreground/10 bg-background/55 p-3 shadow-sm shadow-foreground/5"
        >
          <div className="mb-3 flex items-center justify-between gap-4 px-2">
            <h2 className="mb-0 text-sm font-bold uppercase tracking-[0.18em] text-foreground/50">
              Release field
            </h2>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/35">
              Tap artwork
            </span>
          </div>
          <div className="release-rail flex gap-3 overflow-x-auto pb-2">
            {releaseRail.map((song) => {
              const href =
                song.links.microsite ??
                song.links.smartLink ??
                song.links.appleMusic ??
                song.links.spotify ??
                song.links.youtube ??
                "/";
              const isExternal = href.startsWith("http");

              return (
                <Link
                  key={song.title}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="release-card group relative block aspect-[4/5] w-[176px] shrink-0 overflow-hidden rounded-[1rem] bg-foreground text-background shadow-md shadow-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 sm:w-[210px]"
                  aria-label={`Open ${song.title}`}
                >
                  <Image
                    src={song.artwork}
                    alt={song.title}
                    fill
                    sizes="220px"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="release-card__veil absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="line-clamp-2 text-lg font-bold leading-[0.95] tracking-[-0.04em]">
                      {song.title}
                    </p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/58">
                      {song.releaseType ?? "Release"}
                      {song.duration ? ` / ${song.duration}` : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <CollectableGrid hideFeaturedInGrid showFeaturedHero={false} />
      </section>
    </main>
  );
}
