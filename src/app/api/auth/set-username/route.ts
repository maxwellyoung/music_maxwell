import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return new NextResponse("Invalid username", { status: 400 });
    }

    // Update the user's name
    await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    return new NextResponse("Username updated successfully", { status: 200 });
  } catch (error) {
    console.error("[SET_USERNAME]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
