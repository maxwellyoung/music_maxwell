import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

// PUT: Update playback position
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { sessionToken, trackId, position } = body as {
      sessionToken?: string;
      trackId?: string;
      position?: number;
    };

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token required" },
        { status: 400 }
      );
    }

    // Find the room and session
    const room = await prisma.listeningRoom.findUnique({
      where: { slug },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const session = await prisma.listeningSession.findFirst({
      where: {
        sessionToken,
        roomId: room.id,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Update position
    await prisma.listeningSession.update({
      where: { id: session.id },
      data: {
        currentTrackId: trackId ?? session.currentTrackId,
        currentPosition: position ?? session.currentPosition,
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating position:", error);
    return NextResponse.json(
      { error: "Failed to update position" },
      { status: 500 }
    );
  }
}
