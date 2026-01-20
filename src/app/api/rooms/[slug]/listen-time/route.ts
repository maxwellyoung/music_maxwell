import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

// POST: Record accumulated listen time for a track
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { sessionToken, trackId, seconds } = body as {
      sessionToken?: string;
      trackId?: string;
      seconds?: number;
    };

    if (!sessionToken || !trackId || typeof seconds !== "number") {
      return NextResponse.json(
        { error: "Session token, track ID, and seconds required" },
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

    // Upsert listen time
    const listenTime = await prisma.listenTime.upsert({
      where: {
        sessionId_trackId: {
          sessionId: session.id,
          trackId,
        },
      },
      update: {
        seconds: { increment: seconds },
      },
      create: {
        sessionId: session.id,
        trackId,
        seconds,
      },
    });

    return NextResponse.json({
      trackId,
      totalSeconds: listenTime.seconds,
    });
  } catch (error) {
    console.error("Error recording listen time:", error);
    return NextResponse.json(
      { error: "Failed to record listen time" },
      { status: 500 }
    );
  }
}
