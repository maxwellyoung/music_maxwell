import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "~/lib/prisma";
import { verifyToken } from "~/lib/auth-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* eslint-disable */

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (
    !token ||
    typeof token !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Find all valid tokens
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokens = await (prisma as any).passwordResetToken.findMany({
    where: { expires: { gt: new Date() } },
  });

  let record: any = null;
  for (const t of tokens) {
    if (await verifyToken(token, t.token)) {
      record = t;
      break;
    }
  }

  if (!record) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashedPassword },
  });

  // Delete token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).passwordResetToken.delete({
    where: { userId: record.userId },
  });

  return new Response(null, { status: 204 });
}
