import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { triggerNewForumTopic } from "~/lib/pusherServer";
import { containsBannedWords } from "~/lib/constants";
import {
  createTopicSchema,
  deleteTopicSchema,
  listTopicsSchema,
} from "~/lib/validations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const releaseWallWhere = {
  OR: [
    { createdAt: { gte: new Date("2026-04-01T00:00:00.000Z") } },
    { title: { contains: "sneakin", mode: "insensitive" as const } },
    { content: { contains: "sneakin", mode: "insensitive" as const } },
    { title: { contains: "bar lights", mode: "insensitive" as const } },
    { content: { contains: "bar lights", mode: "insensitive" as const } },
    { title: { contains: "false alarm", mode: "insensitive" as const } },
    { content: { contains: "false alarm", mode: "insensitive" as const } },
  ],
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parseResult = createTopicSchema.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { title, content } = parseResult.data;

    // Check for offensive/banned words in title or content
    if (containsBannedWords(title) || containsBannedWords(content)) {
      return NextResponse.json(
        { error: "Your topic contains inappropriate language." },
        { status: 400 },
      );
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
    const parseResult = deleteTopicSchema.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { topicId } = parseResult.data;

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
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parseResult = listTopicsSchema.safeParse({
    skip: searchParams.get("skip") ?? undefined,
    take: searchParams.get("take") ?? undefined,
  });
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors[0]?.message ?? "Invalid pagination" },
      { status: 400 },
    );
  }
  const { skip, take } = parseResult.data;

  try {
    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where: releaseWallWhere,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, username: true } },
          _count: { select: { replies: true } },
        },
      }),
      prisma.topic.count({ where: releaseWallWhere }),
    ]);

    return NextResponse.json({ topics, total });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}
