import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "~/lib/prisma";
import { verifyToken } from "~/lib/auth-utils";
import { resetPasswordSchema } from "~/lib/validations";
import { rateLimit } from "~/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = rateLimit({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await limiter.check(10, ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many reset attempts. Please try again later." },
      { status: 429 },
    );
  }

  const parseResult = resetPasswordSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
  const { token, password } = parseResult.data;
  const [selector, verifier] = token.split(".");

  if (!selector || !verifier) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  const record = await prisma.passwordResetToken.findFirst({
    where: { tokenSelector: selector, expires: { gt: new Date() } },
  });

  if (!record || !(await verifyToken(verifier, record.token))) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  const hashedPassword = await hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { userId: record.userId },
    }),
  ]);

  return new Response(null, { status: 204 });
}
