import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import type { JWT } from "next-auth/jwt";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: User & { needsUserName?: boolean };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    username?: string | null;
    needsUserName?: boolean;
  }
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    typeof obj.id === "string" &&
    "email" in obj &&
    typeof obj.email === "string" &&
    "name" in obj &&
    (obj.name === null || typeof obj.name === "string")
  );
}

// Generate a unique username from email or name
async function generateUniqueUsername(
  email: string,
  name: string | null,
): Promise<string> {
  const base = name
    ? name.toLowerCase().replace(/[^a-z0-9]/g, "")
    : email.split("@")[0];
  let username = base;
  let counter = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return username ?? "";
    }

    username = `${base}${counter}`;
    counter++;
  }
}

// Create auth options with proper environment variable handling
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser && !dbUser.username) {
          // Generate a username, but mark as needing update
          const username = await generateUniqueUsername(
            user.email!,
            user.name ?? null,
          );
          await prisma.user.update({
            where: { email: user.email! },
            data: { username, needsUserName: true },
          });
          (user as any).username = username;
          (user as any).needsUserName = true;
        } else if (dbUser) {
          (user as any).username = dbUser.username;
          (user as any).needsUserName = dbUser.needsUserName ?? false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? null;
        session.user.email = token.email as string;
        session.user.username = (token as any).username as string | undefined;
        session.user.needsUserName = (token as any).needsUserName as
          | boolean
          | undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id as string;
        token.name = (user as any).name ?? null;
        token.email = (user as any).email as string;
        token.username = (user as any).username as string | undefined;
        token.needsUserName = (user as any).needsUserName as
          | boolean
          | undefined;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
