/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// Skip static optimization for this dynamic auth route
export const dynamic = "force-dynamic";

// Use Node.js runtime for NextAuth to allow Node built-ins like 'crypto'
export const runtime = "nodejs";

// Handle GET with dynamic imports to avoid build-time bundling
export async function GET(request: Request) {
  // Use NextAuth's App Router entrypoint to avoid core dependencies
  const { default: NextAuth } = await import("next-auth/next");
  const { authOptions } = await import("~/lib/auth");
  // @ts-expect-error Argument type mismatch across nested next-auth modules
  return NextAuth(authOptions)(request);
}

// Handle POST with dynamic imports
export async function POST(request: Request) {
  const { default: NextAuth } = await import("next-auth/next");
  const { authOptions } = await import("~/lib/auth");
  // @ts-expect-error Argument type mismatch across nested next-auth modules
  return NextAuth(authOptions)(request);
}
