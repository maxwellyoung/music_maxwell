import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ topics: [] });
  }

  try {
    const topics = await prisma.topic.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        author: { select: { name: true } },
        replies: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ topics });
  } catch (error) {
    console.error("Error searching topics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
