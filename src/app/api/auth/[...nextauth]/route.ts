/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// Force dynamic behavior and specify runtime
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Add logging for environment variables
console.log("[NextAuth] Environment check:", {
  hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  nodeEnv: process.env.NODE_ENV,
});

// Create and export the handler
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
