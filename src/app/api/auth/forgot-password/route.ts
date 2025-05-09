import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { z } from "zod";
import crypto from "crypto";
import { sendEmail } from "~/lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const data: unknown = await request.json();
    const { email } = forgotPasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store the token in the database
    await prisma.passwordResetToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    // Send the reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset your password",
      text: `Click the following link to reset your password: ${resetUrl}`,
      html: `
        <p>Click the following link to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email address" },
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
