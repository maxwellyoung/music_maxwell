import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        username: true,
        name: true,
        bio: true,
        socialLinks: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
