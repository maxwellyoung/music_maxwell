/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// Force dynamic behavior
export const dynamic = "force-dynamic";

// Create handlers for both GET and POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
