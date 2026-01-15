import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "~/lib/validations";

const HASH_ROUNDS = 12;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to change your password" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parseResult = changePasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { currentPassword, newPassword } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user has a password, verify current password
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 },
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 },
        );
      }
    }

    // Hash and update new password (use consistent hash rounds)
    const hashedPassword = await bcrypt.hash(newPassword, HASH_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
