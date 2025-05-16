import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username?: string | null;
  hasPassword?: boolean;
}

declare module "next-auth" {
  interface Session {
    user: User & { needsUserName?: boolean; role?: string };
    maxAge?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    username?: string | null;
    needsUserName?: boolean;
    hasPassword?: boolean;
    role?: string;
  }
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

// Add a type for the user object in signIn callback
interface CallbackUser extends User {
  needsUserName?: boolean;
}

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
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, ..._rest }) {
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        const callbackUser = user as CallbackUser;
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
          callbackUser.username = username;
          callbackUser.needsUserName = true;
        } else if (dbUser) {
          callbackUser.username = dbUser.username ?? undefined;
          callbackUser.needsUserName = dbUser.needsUserName ?? false;
        }
        // Set hasPassword based on dbUser.password
        if (dbUser) {
          callbackUser.hasPassword = !!dbUser.password;
        }
      }
      return true;
    },
    async session({ session, token, ..._rest }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name ?? null;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.needsUserName = token.needsUserName;
        session.user.hasPassword = token.hasPassword;
        session.user.role = token.role;
      }
      // Set session maxAge based on rememberMe param if available
      if ((_rest as { req?: { body?: unknown } })?.req?.body) {
        let rememberMe = null;
        try {
          let body = (_rest as { req?: { body?: unknown } }).req?.body;
          if (typeof body === "string") {
            body = JSON.parse(body);
          }
          rememberMe = (body as { rememberMe?: string })?.rememberMe;
        } catch {}
        if (rememberMe === "0") {
          // Session cookie (expires on browser close)
          session.maxAge = null;
        } else if (rememberMe === "1") {
          // 30 days
          session.maxAge = 60 * 60 * 24 * 30;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: typeof user.email === "string" ? user.email : "" },
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            needsUserName: true,
            password: true,
            role: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name ?? null;
          token.email = typeof dbUser.email === "string" ? dbUser.email : "";
          token.username = dbUser.username ?? undefined;
          token.needsUserName = dbUser.needsUserName ?? false;
          token.hasPassword = !!dbUser.password;
          token.role = dbUser.role;
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "",
};
