import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { getDecayState } from "~/lib/rooms";

export const dynamic = "force-dynamic";

// GET: Room details with tracks
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Add decay state to each track
    const tracksWithDecay = room.tracks.map((track) => ({
      ...track,
      decayState: getDecayState(track),
    }));

    return NextResponse.json({
      ...room,
      tracks: tracksWithDecay,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}
