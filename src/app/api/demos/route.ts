import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { createDemoSchema } from "~/lib/validations";

// GET /api/demos - List all demos
export async function GET() {
  try {
    const demos = await prisma.demo.findMany({
      orderBy: { createdAt: "desc" },
      include: { comments: true },
    });
    return NextResponse.json(demos);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch demos" },
      { status: 500 },
    );
  }
}

// POST /api/demos - Create a new demo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = createDemoSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { title, description, link, status } = parseResult.data;

    const demo = await prisma.demo.create({
      data: {
        title,
        description: description ?? null,
        link: link || null,
        status: status ?? "unfinished",
      },
    });
    return NextResponse.json(demo, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create demo" },
      { status: 500 },
    );
  }
}
