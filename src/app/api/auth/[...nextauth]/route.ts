/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest): Promise<Response> {
  return handler(req) as Promise<Response>;
}

export async function POST(req: NextRequest): Promise<Response> {
  return handler(req) as Promise<Response>;
}
