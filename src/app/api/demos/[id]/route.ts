import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET /api/demos/[id] - Get a single demo by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  const demo = await prisma.demo.findUnique({
    where: { id },
    include: { comments: true },
  });
  if (!demo) {
    return NextResponse.json({ error: "Demo not found" }, { status: 404 });
  }
  return NextResponse.json(demo);
}
