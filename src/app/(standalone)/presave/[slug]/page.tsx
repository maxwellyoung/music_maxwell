import type { Metadata } from "next";
import { PresaveClient } from "./PresaveClient";
import { getReleaseById, releasesData } from "~/data/releases";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = getReleaseById(slug);

  if (!track) {
    return {
      title: "Pre-save | Maxwell Young",
    };
  }

  return {
    title: `Pre-save "${track.title}" | Maxwell Young`,
    description: `Pre-save "${track.title}" by Maxwell Young. Releasing ${new Date(track.targetRelease).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`,
    openGraph: {
      title: `Pre-save "${track.title}" | Maxwell Young`,
      description: `Be the first to hear "${track.title}" when it drops.`,
      images: [`/artworks/${track.id}.webp`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Pre-save "${track.title}" | Maxwell Young`,
      images: [`/artworks/${track.id}.webp`],
    },
  };
}

// Generate static params for all known releases
export function generateStaticParams() {
  const allTracks = [...releasesData.tracks, ...releasesData.released];
  return allTracks.map((track) => ({
    slug: track.id,
  }));
}

export default async function PresavePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = getReleaseById(slug);

  if (!track) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Not Found</h1>
          <p className="text-white/60">This release doesn&apos;t exist yet.</p>
        </div>
      </main>
    );
  }

  return (
    <PresaveClient
      track={{
        id: track.id,
        title: track.title,
        releaseDate: track.targetRelease,
        description: track.pitch.description,
        genres: track.pitch.genres,
        moods: track.pitch.moods,
        links: track.links,
      }}
    />
  );
}
