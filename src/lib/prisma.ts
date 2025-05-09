import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var prisma` for hot-reloading in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (globalForPrisma.prisma = new PrismaClient({
    log: ["query"],
  }));

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
