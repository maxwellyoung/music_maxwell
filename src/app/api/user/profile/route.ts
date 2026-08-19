import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { updateProfileSchema } from "~/lib/validations";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      bio: true,
      socialLinks: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateProfileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid profile" },
      { status: 400 },
    );
  }

  const profile = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      bio: parsed.data.bio || null,
      socialLinks: parsed.data.socialLinks,
    },
    select: {
      username: true,
      bio: true,
      socialLinks: true,
    },
  });

  return NextResponse.json(profile);
}
