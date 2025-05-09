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
    const { replyId, reason } = await request.json();
    if (!replyId || !reason) {
      return NextResponse.json(
        { error: "Missing replyId or reason" },
        { status: 400 },
      );
    }

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
