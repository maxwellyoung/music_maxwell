import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, verifyAdminRole } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";

// GET: List all rooms (including inactive) for admin
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin role from database
  const isAdmin = await verifyAdminRole(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const rooms = await prisma.listeningRoom.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { tracks: true, sessions: true },
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

// POST: Create a new room
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await verifyAdminRole(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, coverImage } = body as {
      title?: string;
      slug?: string;
      description?: string;
      coverImage?: string;
    };

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await prisma.listeningRoom.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A room with this slug already exists" },
        { status: 400 }
      );
    }

    const room = await prisma.listeningRoom.create({
      data: {
        title,
        slug,
        description: description ?? null,
        coverImage: coverImage ?? null,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
