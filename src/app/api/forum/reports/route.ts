import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { createReportSchema } from "~/lib/validations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parseResult = createReportSchema.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { replyId, reason } = parseResult.data;

    // Create the report in the database
    const report = await prisma.report.create({
      data: {
        replyId,
        reason,
        reporterId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch {
    return NextResponse.json(
      { error: "Failed to report reply" },
      { status: 500 },
    );
  }
}
