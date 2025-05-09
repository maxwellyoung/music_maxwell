/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// Force dynamic behavior
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Create the handler outside of the route handlers
const handler = NextAuth(authOptions);

// Export the handler directly
export { handler as GET, handler as POST };
