import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "~/lib/prisma";
import { z } from "zod";
import { rateLimit } from "../../../../lib/rate-limit";

// Enhanced validation schema with better error messages and constraints
const registerSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(255, "Email is too long")
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Name can only contain letters, numbers, underscores, and hyphens",
    )
    .transform((name) => name.trim()),
});

// Force dynamic behavior and specify runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

// Create a minimal handler for build time
const handler = async (request: Request) => {
  // During build time, return a simple response
  if (process.env.NODE_ENV !== "production") {
    return new Response("Registration is not available during build", {
      status: 503,
    });
  }

  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await limiter.check(5, ip); // 5 requests per hour
    if (!success) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 },
      );
    }

    // Validate request method
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 },
      );
    }

    // Parse and validate request body
    const data: unknown = await request.json();
    const validationResult = registerSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    const { email, password, name } = validationResult.data;

    // Check for existing user (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          { name: { equals: name, mode: "insensitive" } },
        ],
      },
      select: { email: true, name: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Account already exists",
          details:
            existingUser.email.toLowerCase() === email.toLowerCase()
              ? "This email is already registered"
              : "This username is already taken",
        },
        { status: 409 },
      );
    }

    // Hash password with increased security
    const hashedPassword = await hash(password, 12);

    // Create user with transaction to ensure data consistency
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      // Create user profile or other related data here if needed
      // await tx.userProfile.create({ ... })

      return newUser;
    });

    // Return success response with sanitized user data
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Content-Security-Policy": "default-src 'self'",
        },
      },
    );
  } catch (error) {
    // Log error with proper error handling
    console.error("Registration error:", error);

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    // Handle Prisma errors
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "string" &&
      error.code.startsWith("P")
    ) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 },
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
};

export { handler as POST };
