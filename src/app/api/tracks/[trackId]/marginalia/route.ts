import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import {
  triggerNewMarginalia,
  triggerMarginaliaDeleted,
} from "~/lib/pusherServer";

export const dynamic = "force-dynamic";

// GET: Fetch marginalia for a track
export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;
    const { searchParams } = new URL(request.url);
    const includeArtist = searchParams.get("includeArtist") === "true";

    const marginalia = await prisma.marginalia.findMany({
      where: {
        trackId,
        // Only show non-faded marginalia unless we're including artist notes
        ...(includeArtist ? {} : { isFaded: false }),
      },
      include: {
        session: {
          select: { pseudonym: true },
        },
        replies: {
          include: {
            session: { select: { pseudonym: true } },
          },
        },
      },
      orderBy: { timestamp: "asc" },
    });

    // Transform to include pseudonym at top level
    const transformed = marginalia.map((m) => ({
      id: m.id,
      content: m.content,
      timestamp: m.timestamp,
      pseudonym: m.session.pseudonym,
      isArtist: m.isArtist,
      createdAt: m.createdAt,
      parentId: m.parentId,
      isFaded: m.isFaded,
      replies: m.replies.map((r) => ({
        id: r.id,
        content: r.content,
        timestamp: r.timestamp,
        pseudonym: r.session.pseudonym,
        isArtist: r.isArtist,
        createdAt: r.createdAt,
      })),
    }));

    return NextResponse.json({ marginalia: transformed });
  } catch (error) {
    console.error("Error fetching marginalia:", error);
    return NextResponse.json(
      { error: "Failed to fetch marginalia" },
      { status: 500 }
    );
  }
}

// POST: Create new marginalia
export async function POST(
  request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;
    const body = await request.json();
    const { sessionToken, content, timestamp, parentId } = body as {
      sessionToken?: string;
      content?: string;
      timestamp?: number;
      parentId?: string;
    };

    if (!sessionToken || !content || typeof timestamp !== "number") {
      return NextResponse.json(
        { error: "Session token, content, and timestamp required" },
        { status: 400 }
      );
    }

    // Content length limit
    if (content.length > 500) {
      return NextResponse.json(
        { error: "Content must be 500 characters or less" },
        { status: 400 }
      );
    }

    // Find the track
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: { room: true },
    });

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    // Find the session
    const session = await prisma.listeningSession.findFirst({
      where: {
        sessionToken,
        roomId: track.roomId,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if this is an artist (admin user linked to session)
    const authSession = await getServerSession(authOptions);
    const isArtist = authSession?.user?.role === "admin";

    // If this is a reply, update parent's lastRepliedAt
    if (parentId) {
      await prisma.marginalia.update({
        where: { id: parentId },
        data: { lastRepliedAt: new Date() },
      });
    }

    const marginalia = await prisma.marginalia.create({
      data: {
        trackId,
        sessionId: session.id,
        content,
        timestamp,
        parentId: parentId ?? null,
        isArtist,
        artistId: isArtist ? authSession?.user?.id : null,
      },
      include: {
        session: { select: { pseudonym: true } },
      },
    });

    const payload = {
      id: marginalia.id,
      content: marginalia.content,
      timestamp: marginalia.timestamp,
      pseudonym: marginalia.session.pseudonym,
      isArtist: marginalia.isArtist,
      createdAt: marginalia.createdAt,
      parentId: marginalia.parentId,
    };

    // Broadcast via Pusher
    await triggerNewMarginalia(trackId, payload);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error creating marginalia:", error);
    return NextResponse.json(
      { error: "Failed to create marginalia" },
      { status: 500 }
    );
  }
}

// DELETE: Remove marginalia (artist only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  const authSession = await getServerSession(authOptions);
  if (!authSession?.user || authSession.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { trackId } = await params;
    const body = await request.json();
    const { marginaliaId } = body as { marginaliaId?: string };

    if (!marginaliaId) {
      return NextResponse.json(
        { error: "Marginalia ID required" },
        { status: 400 }
      );
    }

    await prisma.marginalia.delete({
      where: { id: marginaliaId },
    });

    // Broadcast deletion
    await triggerMarginaliaDeleted(trackId, marginaliaId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting marginalia:", error);
    return NextResponse.json(
      { error: "Failed to delete marginalia" },
      { status: 500 }
    );
  }
}
