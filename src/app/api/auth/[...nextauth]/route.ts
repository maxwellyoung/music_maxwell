/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// Force dynamic behavior and use edge runtime
export const dynamic = "force-dynamic";
export const runtime = "edge";

// Create a handler that returns appropriate response based on environment
const createHandler = () => {
  if (process.env.NEXT_PHASE === "build") {
    return () => new Response(null, { status: 204 });
  }
  return NextAuth(authOptions);
};

// Export the handlers
const handler = createHandler();
export const GET = handler;
export const POST = handler;
