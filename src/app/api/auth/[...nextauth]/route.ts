/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// Skip static optimization for this dynamic auth route
export const dynamic = "force-dynamic";

// Use Node.js runtime for NextAuth to allow Node built-ins like 'crypto'
export const runtime = "nodejs";

// Handle GET with dynamic imports
export async function GET(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NextAuthAny = (await import("next-auth/next")).default as any;
  const { authOptions } = await import("~/lib/auth");
  return NextAuthAny(authOptions)(request);
}

// Handle POST with dynamic imports
export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NextAuthAny = (await import("next-auth/next")).default as any;
  const { authOptions } = await import("~/lib/auth");
  return NextAuthAny(authOptions)(request);
}
