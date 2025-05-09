import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
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
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    username?: string | null;
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

// Initialize the Prisma adapter only in production
const prismaAdapter =
  process.env.NODE_ENV === "production" ? PrismaAdapter(prisma) : undefined;

// Create auth options with minimal configuration for build
export const authOptions: NextAuthOptions = {
  adapter: prismaAdapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Skip authorization during build
        if (process.env.NODE_ENV !== "production") {
          console.log("[NextAuth] Skipping authorization during build");
          return null;
        }

        console.log("[NextAuth] Attempting to authorize credentials");
        if (!credentials?.email || !credentials?.password) {
          console.log("[NextAuth] Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
            },
          });

          if (!user?.password) {
            console.log("[NextAuth] User not found or no password");
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            console.log("[NextAuth] Invalid password");
            return null;
          }

          console.log("[NextAuth] Authorization successful");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error("[NextAuth] Authorization error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (process.env.NODE_ENV !== "production") {
        return token;
      }
      console.log("[NextAuth] JWT Callback - Token:", token);
      if (user && isUser(user)) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username ?? null;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (process.env.NODE_ENV !== "production") {
        return session;
      }
      console.log("[NextAuth] Session Callback - Token:", token);
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.username = token.username ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Only enable debug mode in production
  debug: process.env.NODE_ENV === "production",
};
