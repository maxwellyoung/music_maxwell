import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

// GET: List all active rooms
export async function GET() {
  try {
    const rooms = await prisma.listeningRoom.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        coverImage: true,
        createdAt: true,
        _count: {
          select: { tracks: true },
        },
      },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
