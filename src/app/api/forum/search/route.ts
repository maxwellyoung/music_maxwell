import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { searchLimiter, LIMITS, getClientIdentifier } from "~/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_RESULTS = 50;
const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;

export async function GET(request: Request) {
  // Rate limiting (no auth required for search)
  const identifier = getClientIdentifier(null, request);
  const rateLimitResult = await searchLimiter.check(LIMITS.search, identifier);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many searches. Please wait a moment." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = Math.min(parseInt(searchParams.get("take") ?? "20", 10), MAX_RESULTS);

  // Validate query
  if (!query || query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ topics: [], total: 0 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "Search query too long" },
      { status: 400 }
    );
  }

  try {
    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: { select: { name: true, username: true } },
          _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.topic.count({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    return NextResponse.json({ topics, total });
  } catch (error) {
    console.error("Error searching topics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
