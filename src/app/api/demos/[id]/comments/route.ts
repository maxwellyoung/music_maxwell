import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

// GET /api/demos/[id]/comments - List comments for a demo
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const demoId = Number(params.id);
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
  { params }: { params: { id: string } },
) {
  const demoId = Number(params.id);
  if (isNaN(demoId)) {
    return NextResponse.json({ error: "Invalid demo ID" }, { status: 400 });
  }
  const { author, content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }
  const comment = await prisma.comment.create({
    data: { demoId, author, content },
  });
  return NextResponse.json(comment, { status: 201 });
}
