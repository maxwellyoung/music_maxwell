import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "~/lib/prisma";
import { hashToken, sendResetEmail } from "~/lib/auth-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal user existence
    return new Response(null, { status: 204 });
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = await hashToken(rawToken);
  const expires = new Date(Date.now() + 30 * 60 * 1000);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).passwordResetToken.upsert({
    where: { userId: user.id },
    update: { token: tokenHash, expires },
    create: { userId: user.id, token: tokenHash, expires },
  });

  try {
    await sendResetEmail({ to: email, token: rawToken });
  } catch (err) {
    console.error("Failed to send reset email", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  return new Response(null, { status: 204 });
}
