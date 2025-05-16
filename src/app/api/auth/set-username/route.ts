import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

// Add your own list of banned words
const bannedWords = ["moist", "faggot", "retard", "nazi", "hitler"];

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { username } = await req.json();

    if (
      !username ||
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 20
    ) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters." },
        { status: 400 },
      );
    }

    // Username must be URL-safe: only letters, numbers, underscores, hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username can only contain letters, numbers, underscores, and hyphens.",
        },
        { status: 400 },
      );
    }

    // Check for offensive/banned words
    const lowerUsername = username.toLowerCase();
    if (bannedWords.some((word) => lowerUsername.includes(word))) {
      return new NextResponse("Username contains inappropriate language", {
        status: 400,
      });
    }

    // Check for duplicate username
    const existing = await prisma.user.findUnique({
      where: { username },
    });
    if (existing) {
      return new NextResponse("Username already taken", { status: 409 });
    }

    // Update the user's username and set needsUserName to false
    await prisma.user.update({
      where: { email: session.user.email },
      data: { username, needsUserName: false },
    });

    return new NextResponse("Username updated successfully", { status: 200 });
  } catch (error) {
    console.error("[SET_USERNAME]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
