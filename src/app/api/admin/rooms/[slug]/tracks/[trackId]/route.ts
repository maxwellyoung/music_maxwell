import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

// PUT: Update a track
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; trackId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { trackId } = await params;
    const body = await request.json();
    const { title, audioUrl, duration, decayStartAt, isArchived } = body as {
      title?: string;
      audioUrl?: string;
      duration?: number;
      decayStartAt?: string | null;
      isArchived?: boolean;
    };

    const track = await prisma.track.update({
      where: { id: trackId },
      data: {
        ...(title !== undefined && { title }),
        ...(audioUrl !== undefined && { audioUrl }),
        ...(duration !== undefined && { duration }),
        ...(decayStartAt !== undefined && {
          decayStartAt: decayStartAt ? new Date(decayStartAt) : null,
        }),
        ...(isArchived !== undefined && { isArchived }),
      },
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error("Error updating track:", error);
    return NextResponse.json(
      { error: "Failed to update track" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a track
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; trackId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { trackId } = await params;

    await prisma.track.delete({
      where: { id: trackId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting track:", error);
    return NextResponse.json(
      { error: "Failed to delete track" },
      { status: 500 }
    );
  }
}
