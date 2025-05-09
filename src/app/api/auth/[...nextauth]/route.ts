/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth from "next-auth";
import { authOptions } from "~/lib/auth";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export const GET: (req: NextRequest) => Promise<Response> = handler;
export const POST: (req: NextRequest) => Promise<Response> = handler;
