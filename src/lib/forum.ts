import type { Prisma } from "@prisma/client";

const releaseWallWhere: Prisma.TopicWhereInput = {
  OR: [
    { createdAt: { gte: new Date("2026-04-01T00:00:00.000Z") } },
    { title: { contains: "sneakin", mode: "insensitive" } },
    { content: { contains: "sneakin", mode: "insensitive" } },
    { title: { contains: "bar lights", mode: "insensitive" } },
    { content: { contains: "bar lights", mode: "insensitive" } },
    { title: { contains: "false alarm", mode: "insensitive" } },
    { content: { contains: "false alarm", mode: "insensitive" } },
  ],
};

export function getReleaseWallWhere(query?: string): Prisma.TopicWhereInput {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return releaseWallWhere;
  }

  return {
    AND: [
      releaseWallWhere,
      {
        OR: [
          { title: { contains: trimmedQuery, mode: "insensitive" } },
          { content: { contains: trimmedQuery, mode: "insensitive" } },
          {
            author: {
              username: { contains: trimmedQuery, mode: "insensitive" },
            },
          },
        ],
      },
    ],
  };
}
