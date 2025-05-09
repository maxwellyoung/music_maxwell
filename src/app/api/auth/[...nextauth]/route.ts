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

// Only initialize NextAuth if we're not in a build context
const handler =
  process.env.NODE_ENV === "production"
    ? NextAuth(authOptions)
    : async () => {
        console.log("[NextAuth] Skipping initialization during build");
        return new Response("NextAuth is not available during build", {
          status: 503,
        });
      };

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
