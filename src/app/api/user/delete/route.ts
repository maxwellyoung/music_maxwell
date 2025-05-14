import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("Attempting to delete user:", session.user.email);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      console.log("User not found:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Found user with ID:", user.id);

    try {
      // Delete all replies by the user
      const deletedReplies = await prisma.reply.deleteMany({
        where: { authorId: user.id },
      });
      console.log("Deleted replies:", deletedReplies.count);
    } catch (error) {
      console.error("Error deleting replies:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma error code:", error.code);
        console.error("Prisma error meta:", error.meta);
      }
    }

    try {
      // Delete all topics by the user
      const deletedTopics = await prisma.topic.deleteMany({
        where: { authorId: user.id },
      });
      console.log("Deleted topics:", deletedTopics.count);
    } catch (error) {
      console.error("Error deleting topics:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma error code:", error.code);
        console.error("Prisma error meta:", error.meta);
      }
    }

    try {
      // Delete the user
      const deletedUser = await prisma.user.delete({
        where: { id: user.id },
      });
      console.log("Deleted user:", deletedUser.id);
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma error code:", error.code);
        console.error("Prisma error meta:", error.meta);
      }
      throw error; // Re-throw to be caught by outer try-catch
    }

    return NextResponse.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Error in delete account process:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error details:", {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });

      // Handle specific Prisma errors
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
            { error: `Database error: ${error.message}` },
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
