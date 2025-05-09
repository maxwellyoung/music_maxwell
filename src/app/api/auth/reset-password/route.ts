import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const data: unknown = await request.json();
    const { token, password } = resetPasswordSchema.parse(data);

    // Find the token and check if it's valid
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update the user's password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
