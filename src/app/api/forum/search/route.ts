import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { getReleaseWallWhere } from "~/lib/forum";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.slice(0, 100);

  if (!query) {
    return NextResponse.json({ topics: [] });
  }

  try {
    const topics = await prisma.topic.findMany({
      where: getReleaseWallWhere(query),
      include: {
        author: { select: { name: true, username: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit search results
    });

    return NextResponse.json({ topics });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
