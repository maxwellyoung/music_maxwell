import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        message: true,
        name: true,
        location: true,
        createdAt: true,
        author: {
          select: {
            image: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Failed to fetch guestbook entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { message, name, location } = body as {
      message: string;
      name: string;
      location?: string;
    };

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        message: message.trim(),
        name: name.trim(),
        location: location?.trim() ?? null,
        authorId: session?.user?.id ?? null,
      },
      select: {
        id: true,
        message: true,
        name: true,
        location: true,
        createdAt: true,
        author: {
          select: {
            image: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to create guestbook entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}
