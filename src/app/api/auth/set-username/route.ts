import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { username } = await request.json();
  if (!username || typeof username !== "string" || username.length < 3) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }
  // Check if username is taken
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 },
    );
  }
  // Update user
  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  });
  return NextResponse.json({ success: true });
}
