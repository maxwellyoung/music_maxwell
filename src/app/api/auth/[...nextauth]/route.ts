/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// Force dynamic behavior
export const dynamic = "force-dynamic";

// Handle auth requests
const handler = NextAuth(authOptions);

// Export route handlers with build-time check
export async function GET(request: Request) {
  if (process.env.NEXT_PHASE === "build") {
    return new Response(null, { status: 204 });
  }
  return handler(request);
}

export async function POST(request: Request) {
  if (process.env.NEXT_PHASE === "build") {
    return new Response(null, { status: 204 });
  }
  return handler(request);
}
