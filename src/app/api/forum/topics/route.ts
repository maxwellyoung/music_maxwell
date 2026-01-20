import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { triggerNewForumTopic } from "~/lib/pusherServer";
import { forumLimiter, LIMITS, getClientIdentifier } from "~/lib/rate-limit";
import { checkContentModeration, validateLength, CONTENT_LIMITS } from "~/lib/moderation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const identifier = getClientIdentifier(session.user.id, request);
  const rateLimitResult = await forumLimiter.check(LIMITS.createTopic, identifier);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before creating another topic." },
      { status: 429 }
    );
  }

  try {
    const data: unknown = await request.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("title" in data) ||
      !("content" in data)
    ) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 },
      );
    }
    const { title, content } = data as { title: string; content: string };

    // Validate content length
    const titleValidation = validateLength(title, CONTENT_LIMITS.topicTitle);
    if (!titleValidation.valid) {
      return NextResponse.json({ error: titleValidation.reason }, { status: 400 });
    }
    const contentValidation = validateLength(content, CONTENT_LIMITS.topicContent);
    if (!contentValidation.valid) {
      return NextResponse.json({ error: contentValidation.reason }, { status: 400 });
    }

    // Check for offensive/banned words
    const moderation = checkContentModeration(title, content);
    if (!moderation.passed) {
      return NextResponse.json({ error: moderation.reason }, { status: 400 });
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
      include: {
        author: { select: { name: true, username: true } },
        _count: { select: { replies: true } },
      },
    });

    // Broadcast new topic event
    await triggerNewForumTopic({
      id: topic.id,
      title: topic.title,
      content: topic.content,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      author: topic.author,
      _count: topic._count,
    });

    return NextResponse.json({
      id: topic.id,
      title: topic.title,
      content: topic.content,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      authorId: topic.authorId,
    });
  } catch (error) {
    console.error("Error creating topic:", error);
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
    const data: unknown = await request.json();
    if (typeof data !== "object" || data === null || !("topicId" in data)) {
      return NextResponse.json({ error: "Missing topicId" }, { status: 400 });
    }
    const { topicId } = data as { topicId: string };

    // Fetch the topic to check permissions
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { author: { select: { id: true, role: true } } },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Only allow if admin or author
    const isAdmin = (session.user as { role?: string })?.role === "admin";
    const isAuthor = session.user.id === topic.authorId;
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete all replies first (due to foreign key constraints)
    await prisma.reply.deleteMany({
      where: { topicId },
    });

    // Then delete the topic
    await prisma.topic.delete({
      where: { id: topicId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "10", 10);

  try {
    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, username: true } },
          _count: { select: { replies: true } },
        },
      }),
      prisma.topic.count(),
    ]);

    return NextResponse.json({ topics, total });
  } catch (error) {
    console.error("Error fetching topics (GET):", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}
