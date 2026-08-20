import Link from "next/link";
import { getReleaseWallWhere } from "~/lib/forum";
import { prisma } from "~/lib/prisma";

// Server-only marginalia; streamed under Suspense so the index paints first.
// Renders nothing when the wall is empty or the database is unreachable.
export default async function MarginNotes() {
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
    if (topics.length === 0) return null;

    return (
      <section className="mt-16 max-w-2xl" aria-label="Latest from the square">
        <p className="text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]">
          from the square —
        </p>
        <ul className="hang mt-2 space-y-1">
          {topics.map((topic) => (
            <li key={topic.id} className="text-sm leading-relaxed">
              <Link
                href={`/forum/${topic.id}`}
                className="text-[rgb(var(--ledger-ink-rgb)/0.70)] transition hover:text-[var(--ledger-ink)]"
              >
                “{topic.title}”
                <span className="text-[rgb(var(--ledger-ink-rgb)/0.35)]">
                  {" "}
                  — {topic.author.username ?? topic.author.name ?? "someone"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          <Link
            href="/forum"
            className="text-[rgb(var(--ledger-ink-rgb)/0.40)] underline decoration-[rgb(var(--ledger-ink-rgb)/0.20)] underline-offset-4 transition hover:text-[var(--ledger-ink)] hover:decoration-[var(--ledger-ink)]"
          >
            leave something behind
          </Link>
        </p>
      </section>
    );
  } catch {
    return null;
  }
}
