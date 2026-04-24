import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { createDemoCommentSchema } from "~/lib/validations";

// GET /api/demos/[id]/comments - List comments for a demo
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const demoId = Number(id);
  if (isNaN(demoId)) {
    return NextResponse.json({ error: "Invalid demo ID" }, { status: 400 });
  }
  const comments = await prisma.comment.findMany({
    where: { demoId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

// POST /api/demos/[id]/comments - Add a comment to a demo
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const demoId = Number(id);
  if (isNaN(demoId)) {
    return NextResponse.json({ error: "Invalid demo ID" }, { status: 400 });
  }
  const parseResult = createDemoCommentSchema.safeParse(await req.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { author, content } = parseResult.data;
  const displayName =
    author ?? session.user.username ?? session.user.name ?? "User";
  const comment = await prisma.comment.create({
    data: { demoId, author: displayName, content },
  });
  return NextResponse.json(comment, { status: 201 });
}
