import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function DELETE(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use a transaction to ensure atomic deletion
    await prisma.$transaction(async (tx) => {
      // Delete all reports by this user
      await tx.report.deleteMany({
        where: { reporterId: user.id },
      });

      // Delete all reports on replies by this user
      await tx.report.deleteMany({
        where: { reply: { authorId: user.id } },
      });

      // Delete all replies by the user
      await tx.reply.deleteMany({
        where: { authorId: user.id },
      });

      // Delete all replies on topics by the user (to handle foreign keys)
      await tx.reply.deleteMany({
        where: { topic: { authorId: user.id } },
      });

      // Delete all topics by the user
      await tx.topic.deleteMany({
        where: { authorId: user.id },
      });

      // Delete the user (cascades to sessions, accounts, password reset tokens)
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json({ message: "Account deleted" });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2003":
          return NextResponse.json(
            {
              error:
                "Cannot delete user: User has related data that needs to be deleted first",
            },
            { status: 400 },
          );
        case "P2025":
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 },
          );
        default:
          return NextResponse.json(
            { error: "Database error occurred" },
            { status: 500 },
          );
      }
    }

    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
