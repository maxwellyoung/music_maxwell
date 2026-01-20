import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { triggerNewForumReply } from "~/lib/pusherServer";
import { forumLimiter, LIMITS, getClientIdentifier } from "~/lib/rate-limit";
import { checkContentModeration, validateLength, CONTENT_LIMITS } from "~/lib/moderation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REPLIES_PER_PAGE = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId");
  const cursor = searchParams.get("cursor"); // ID of last reply for cursor-based pagination
  const limit = Math.min(
    parseInt(searchParams.get("limit") ?? String(REPLIES_PER_PAGE), 10),
    50 // Max 50 per request
  );

  if (!topicId) {
    return NextResponse.json({ error: "Missing topicId" }, { status: 400 });
  }

  try {
    const replies = await prisma.reply.findMany({
      where: { topicId },
      include: {
        author: { select: { name: true, role: true, username: true, id: true } },
      },
      orderBy: { createdAt: "asc" },
      take: limit + 1, // Fetch one extra to check if there are more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor itself
      }),
    });

    const hasMore = replies.length > limit;
    const repliesPage = hasMore ? replies.slice(0, limit) : replies;
    const nextCursor = hasMore ? repliesPage[repliesPage.length - 1]?.id : null;

    return NextResponse.json({
      replies: repliesPage,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const identifier = getClientIdentifier(session.user.id, request);
  const rateLimitResult = await forumLimiter.check(LIMITS.createReply, identifier);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "You are replying too fast. Please wait a moment." },
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

    // Validate content length
    const contentValidation = validateLength(content, CONTENT_LIMITS.replyContent);
    if (!contentValidation.valid) {
      return NextResponse.json({ error: contentValidation.reason }, { status: 400 });
    }

    // Check for offensive/banned words
    const moderation = checkContentModeration(content);
    if (!moderation.passed) {
      return NextResponse.json({ error: moderation.reason }, { status: 400 });
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
  } catch (error) {
    console.error("Error creating reply:", error);
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
  } catch (error) {
    console.error("Error deleting reply:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
