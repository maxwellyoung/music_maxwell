import { notFound } from "next/navigation";
import { prisma } from "~/lib/prisma";
import { ListeningRoom } from "~/components/rooms/ListeningRoom";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function RoomPage({ params }: { params: Params }) {
  const { slug } = await params;

  const room = await prisma.listeningRoom.findUnique({
    where: { slug, isActive: true },
    include: {
      tracks: {
        orderBy: { trackNumber: "asc" },
      },
    },
  });

  if (!room) {
    notFound();
  }

  // Serialize dates for client component
  const serializedRoom = {
    id: room.id,
    slug: room.slug,
    title: room.title,
    description: room.description,
    coverImage: room.coverImage,
    tracks: room.tracks.map((track) => ({
      id: track.id,
      title: track.title,
      audioUrl: track.audioUrl,
      duration: track.duration,
      trackNumber: track.trackNumber,
      releasedAt: track.releasedAt.toISOString(),
      decayStartAt: track.decayStartAt?.toISOString() ?? null,
      isArchived: track.isArchived,
    })),
  };

  return <ListeningRoom room={serializedRoom} />;
}
