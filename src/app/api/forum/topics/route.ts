import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 },
      );
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
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
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { topicId } = await request.json();
    if (!topicId) {
      return NextResponse.json({ error: "Missing topicId" }, { status: 400 });
    }

    // Fetch the topic to check permissions
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { author: { select: { id: true, role: true } } },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Only allow if admin or author
    const isAdmin = (session.user as any).role === "admin";
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
