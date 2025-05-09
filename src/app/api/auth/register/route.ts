import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "~/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

// Force dynamic behavior and specify runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Create a minimal handler for build time
const handler = async (request: Request) => {
  // During build time, return a simple response
  if (process.env.NODE_ENV !== "production") {
    return new Response("Registration is not available during build", {
      status: 503,
    });
  }

  try {
    const data: unknown = await request.json();
    const { email, password, name } = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
};

export { handler as POST };
