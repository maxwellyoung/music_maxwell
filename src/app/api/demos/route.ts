import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET /api/demos - List all demos
export async function GET() {
  const demos = await prisma.demo.findMany({
    orderBy: { createdAt: "desc" },
    include: { comments: true },
  });
  return NextResponse.json(demos);
}

// POST /api/demos - Create a new demo
export async function POST(req: NextRequest) {
  const { title, description, link, status } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const demo = await prisma.demo.create({
    data: { title, description, link, status },
  });
  return NextResponse.json(demo, { status: 201 });
}
