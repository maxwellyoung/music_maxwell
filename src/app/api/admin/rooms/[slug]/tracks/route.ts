import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

// POST: Add a track to a room
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, audioUrl, duration, decayStartAt } = body as {
      title?: string;
      audioUrl?: string;
      duration?: number;
      decayStartAt?: string;
    };

    if (!title || !audioUrl || typeof duration !== "number") {
      return NextResponse.json(
        { error: "Title, audio URL, and duration are required" },
        { status: 400 }
      );
    }

    // Find the room
    const room = await prisma.listeningRoom.findUnique({
      where: { slug },
      include: {
        _count: { select: { tracks: true } },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Create track with next track number
    const track = await prisma.track.create({
      data: {
        title,
        audioUrl,
        duration,
        trackNumber: room._count.tracks + 1,
        roomId: room.id,
        decayStartAt: decayStartAt ? new Date(decayStartAt) : null,
      },
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error("Error creating track:", error);
    return NextResponse.json(
      { error: "Failed to create track" },
      { status: 500 }
    );
  }
}

// PUT: Reorder tracks
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { trackOrder } = body as { trackOrder?: string[] };

    if (!trackOrder || !Array.isArray(trackOrder)) {
      return NextResponse.json(
        { error: "Track order array required" },
        { status: 400 }
      );
    }

    // Find the room
    const room = await prisma.listeningRoom.findUnique({
      where: { slug },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Update each track's order
    await Promise.all(
      trackOrder.map((trackId, index) =>
        prisma.track.update({
          where: { id: trackId },
          data: { trackNumber: index + 1 },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering tracks:", error);
    return NextResponse.json(
      { error: "Failed to reorder tracks" },
      { status: 500 }
    );
  }
}
