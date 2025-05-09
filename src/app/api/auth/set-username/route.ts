import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name } = await request.json();
  if (!name || typeof name !== "string" || name.length < 3) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }
  // Check if name is taken
  const existing = await prisma.user.findFirst({ where: { name } });
  if (existing) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 },
    );
  }
  // Update user
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });
  return NextResponse.json({ success: true });
}
