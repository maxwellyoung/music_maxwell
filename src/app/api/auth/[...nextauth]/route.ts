/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";

// Use edge runtime
export const runtime = "edge";

export async function GET(request: Request) {
  console.log("[Auth API] GET invoked - NODE_ENV:", process.env.NODE_ENV);
  const handler = NextAuth(authOptions);
  return handler(request);
}

export async function POST(request: Request) {
  console.log("[Auth API] POST invoked - NODE_ENV:", process.env.NODE_ENV);
  const handler = NextAuth(authOptions);
  return handler(request);
}
