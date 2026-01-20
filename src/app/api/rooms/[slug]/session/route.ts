import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { generatePseudonym } from "~/lib/rooms";

export const dynamic = "force-dynamic";

// POST: Create or resume a listening session
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { sessionToken } = body as { sessionToken?: string };

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token required" },
        { status: 400 }
      );
    }

    // Find the room
    const room = await prisma.listeningRoom.findUnique({
      where: { slug, isActive: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Try to find existing session
    let session = await prisma.listeningSession.findFirst({
      where: {
        sessionToken,
        roomId: room.id,
      },
      include: {
        listenTime: true,
      },
    });

    if (session) {
      // Update last active time
      await prisma.listeningSession.update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() },
      });

      return NextResponse.json({
        sessionId: session.id,
        pseudonym: session.pseudonym,
        currentTrackId: session.currentTrackId,
        currentPosition: session.currentPosition,
        listenTime: session.listenTime,
      });
    }

    // Create new session
    const sessionCount = await prisma.listeningSession.count({
      where: { roomId: room.id },
    });

    const pseudonym = generatePseudonym(sessionCount);

    session = await prisma.listeningSession.create({
      data: {
        sessionToken,
        pseudonym,
        roomId: room.id,
      },
      include: {
        listenTime: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      pseudonym: session.pseudonym,
      currentTrackId: session.currentTrackId,
      currentPosition: session.currentPosition,
      listenTime: session.listenTime,
    });
  } catch (error) {
    console.error("Error managing session:", error);
    return NextResponse.json(
      { error: "Failed to manage session" },
      { status: 500 }
    );
  }
}
