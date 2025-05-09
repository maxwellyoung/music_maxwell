import NextAuth, { type NextAuthOptions } from "next-auth";
import { authOptions } from "~/lib/auth";

const handler = NextAuth(authOptions) as unknown as {
  GET: (req: Request) => Promise<Response>;
  POST: (req: Request) => Promise<Response>;
};

export { handler as GET, handler as POST };
