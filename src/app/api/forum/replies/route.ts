import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { triggerNewForumReply } from "~/lib/pusherServer";
import { RATE_LIMITS } from "~/lib/constants";
import { rateLimit } from "~/lib/rate-limit";
import {
  anonymousAuthorId,
  anonymousWallCeiling,
  requestIp,
} from "~/lib/anonAuthor";
import { deleteReplySchema } from "~/lib/validations";
import { createReplyPostHandler } from "~/lib/forumWriteHandlers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limiter instance using LRU cache (works in serverless)
const replyRateLimiter = rateLimit({
  interval: RATE_LIMITS.REPLY_INTERVAL_MS,
  uniqueTokenPerInterval: 500,
});

export const POST = createReplyPostHandler({
  getSession: () => getServerSession(authOptions),
  checkLimit: (limit, token) => replyRateLimiter.check(limit, token),
  requestIp,
  anonymousWallCeiling,
  anonymousAuthorId,
  findTopic: (topicId) =>
    prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    }),
  createReply: (input) => prisma.reply.create(input),
  broadcastReply: triggerNewForumReply,
});

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
