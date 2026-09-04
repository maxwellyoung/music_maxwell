import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { triggerNewForumReply } from "~/lib/pusherServer";
import { containsBannedWords, RATE_LIMITS } from "~/lib/constants";
import { rateLimit } from "~/lib/rate-limit";
import {
  anonymousAuthorId,
  anonymousWallCeiling,
  requestIp,
} from "~/lib/anonAuthor";
import { createReplySchema, deleteReplySchema } from "~/lib/validations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limiter instance using LRU cache (works in serverless)
const replyRateLimiter = rateLimit({
  interval: RATE_LIMITS.REPLY_INTERVAL_MS,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  // Unsigned echoes are allowed for now; anonymous callers rate-limit
  // by address instead of account. The in-memory limiter runs before
  // anything touches the database.
  const limiterToken = session?.user?.id ?? `anon-reply:${requestIp(request)}`;
  const rateLimitResult = await replyRateLimiter.check(
    RATE_LIMITS.REPLY_MAX_PER_INTERVAL,
    limiterToken,
  );
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "You are replying too fast. Please wait a few seconds." },
      { status: 429 },
    );
  }

  try {
    const parseResult = createReplySchema.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { content, topicId } = parseResult.data;

    // Check for offensive/banned words in content
    if (containsBannedWords(content)) {
      return NextResponse.json(
        { error: "Your reply contains inappropriate language." },
        { status: 400 },
      );
    }

    // A missing note is a 404, not a foreign-key failure dressed as a 500.
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });
    if (!topic) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (!session?.user?.id && !(await anonymousWallCeiling(6))) {
      return NextResponse.json(
        { error: "The square is busy — try again in a minute." },
        { status: 429 },
      );
    }
    const authorId = session?.user?.id ?? (await anonymousAuthorId());

    // The broadcast payload carries the author, so other readers see the
    // name on a signed echo rather than "anonymous" until they reload.
    const reply = await prisma.reply.create({
      data: {
        content,
        topicId,
        authorId,
      },
      include: {
        author: { select: { name: true, role: true, username: true } },
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
    const parseResult = deleteReplySchema.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { replyId } = parseResult.data;

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

    // Report.replyId is ON DELETE RESTRICT, so the reports on an echo go
    // with it — otherwise the one echo someone reported is the one echo
    // that can never be taken down.
    await prisma.$transaction([
      prisma.report.deleteMany({ where: { replyId } }),
      prisma.reply.delete({ where: { id: replyId } }),
    ]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
