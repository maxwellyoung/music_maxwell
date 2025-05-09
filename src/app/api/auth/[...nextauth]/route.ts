/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// Force dynamic behavior and specify runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Create a simple handler that will be replaced at runtime
const handler = async () => {
  return new Response("NextAuth is not available during build", {
    status: 503,
  });
};

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
