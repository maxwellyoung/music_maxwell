import Link from "next/link";
import Image from "next/image";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const rooms = await prisma.listeningRoom.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tracks: true } },
    },
  });

  return (
    <div className="min-h-screen">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-medium">Listening Rooms</h1>
          <p className="text-muted-foreground mt-2">
            Enter a room. Press play. Listen.
          </p>
        </header>

        {rooms.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No rooms available yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.slug}`}
                className="group block"
              >
                <article className="flex gap-6 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  {room.coverImage && (
                    <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={room.coverImage}
                        alt={room.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-medium group-hover:text-primary transition-colors">
                      {room.title}
                    </h2>
                    {room.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {room.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                      {room._count.tracks} track{room._count.tracks !== 1 ? "s" : ""}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
