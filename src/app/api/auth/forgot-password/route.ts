import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "~/lib/prisma";
import { hashToken, sendResetEmail } from "~/lib/auth-utils";
import { forgotPasswordSchema } from "~/lib/validations";
import { rateLimit } from "~/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = rateLimit({
  interval: 60 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await limiter.check(5, ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many reset attempts. Please try again later." },
      { status: 429 },
    );
  }

  const parseResult = forgotPasswordSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors[0]?.message ?? "Invalid email" },
      { status: 400 },
    );
  }
  const { email } = parseResult.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal user existence
    return new Response(null, { status: 204 });
  }

  const selector = randomBytes(16).toString("hex");
  const verifier = randomBytes(32).toString("hex");
  const rawToken = `${selector}.${verifier}`;
  const tokenHash = await hashToken(verifier);
  const expires = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.passwordResetToken.upsert({
    where: { userId: user.id },
    update: { token: tokenHash, tokenSelector: selector, expires },
    create: { userId: user.id, token: tokenHash, tokenSelector: selector, expires },
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
