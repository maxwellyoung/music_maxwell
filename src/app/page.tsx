import type { Metadata } from "next";
import MinimalIndex, { type MarginNote } from "~/components/MinimalIndex";
import { getReleaseWallWhere } from "~/lib/forum";
import { prisma } from "~/lib/prisma";

export const metadata: Metadata = {
  title: "Maxwell Young — Music, releases, and archive",
  description:
    "Maxwell Young releases, artwork, lyrics, films, credits, and archive.",
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function Home() {
  // The wall is decoration here — the page must render fine without it.
  let notes: MarginNote[] = [];
  try {
    const topics = await prisma.topic.findMany({
      where: getReleaseWallWhere(),
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        author: { select: { username: true, name: true } },
      },
    });
    notes = topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      author: topic.author.username ?? topic.author.name ?? "someone",
    }));
  } catch {
    notes = [];
  }

  return <MinimalIndex notes={notes} />;
}
