/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Initialize NextAuth with explicit configuration
const handler = NextAuth({
  ...authOptions,
  // Ensure we're using the correct adapter
  adapter: authOptions.adapter,
  // Ensure we're using the correct providers
  providers: authOptions.providers,
  // Ensure we're using the correct session strategy
  session: authOptions.session,
  // Ensure we're using the correct pages
  pages: authOptions.pages,
  // Ensure we're using the correct callbacks
  callbacks: authOptions.callbacks,
  // Add debug mode for development
  debug: process.env.NODE_ENV === "development",
});

export async function GET(req: NextRequest): Promise<Response> {
  return handler(req) as Promise<Response>;
}

export async function POST(req: NextRequest): Promise<Response> {
  return handler(req) as Promise<Response>;
}
