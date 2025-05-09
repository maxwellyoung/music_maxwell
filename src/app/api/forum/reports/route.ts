import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data: unknown = await request.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("replyId" in data) ||
      !("reason" in data)
    ) {
      return NextResponse.json(
        { error: "Missing replyId or reason" },
        { status: 400 },
      );
    }
    const { replyId, reason } = data as { replyId: string; reason: string };

    // Create the report in the database
    const report = await prisma.report.create({
      data: {
        replyId,
        reason,
        reporterId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to report reply" },
      { status: 500 },
    );
  }
}
