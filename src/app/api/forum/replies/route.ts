import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { triggerNewForumReply } from "~/lib/pusherServer";
import { containsBannedWords, RATE_LIMITS } from "~/lib/constants";
import { rateLimit } from "~/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limiter instance using LRU cache (works in serverless)
const replyRateLimiter = rateLimit({
  interval: RATE_LIMITS.REPLY_INTERVAL_MS,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting: 1 reply per 10 seconds per user
  const rateLimitResult = await replyRateLimiter.check(
    RATE_LIMITS.REPLY_MAX_PER_INTERVAL,
    session.user.id,
  );
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "You are replying too fast. Please wait a few seconds." },
      { status: 429 },
    );
  }

  try {
    const data = (await request.json()) as Record<string, unknown>;
    if (
      typeof data !== "object" ||
      data === null ||
      !("content" in data) ||
      !("topicId" in data)
    ) {
      return NextResponse.json(
        { error: "Missing content or topicId" },
        { status: 400 },
      );
    }
    const { content, topicId } = data as { content: string; topicId: string };

    // Check for offensive/banned words in content
    if (containsBannedWords(content)) {
      return NextResponse.json(
        { error: "Your reply contains inappropriate language." },
        { status: 400 },
      );
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        topicId,
        authorId: session.user.id,
      },
    });

    // Broadcast new reply event
    await triggerNewForumReply(topicId, reply);

    return NextResponse.json(reply);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = (await request.json()) as Record<string, unknown>;
    if (typeof data !== "object" || data === null || !("replyId" in data)) {
      return NextResponse.json({ error: "Missing replyId" }, { status: 400 });
    }
    const { replyId } = data as { replyId: string };

    // Fetch the reply to check permissions
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: { author: { select: { id: true, role: true } } },
    });
    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }

    // Only allow if admin or author
    const isAdmin = (session.user as { role?: string })?.role === "admin";
    const isAuthor = session.user.id === reply.authorId;
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.reply.delete({ where: { id: replyId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
