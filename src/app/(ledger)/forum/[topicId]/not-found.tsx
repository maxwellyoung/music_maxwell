import Link from "next/link";
import SquareShell from "~/components/forum/SquareShell";

// A note that is no longer in the square, in the square's own frame,
// with a real 404 behind it.
export default function NoteNotFound() {
  return (
    <SquareShell back={{ href: "/forum", label: "the square" }}>
      <p className="max-w-2xl text-xl leading-snug sm:text-2xl">
        <span className="font-semibold">Gone.</span>{" "}
        <span className="text-[rgb(var(--ledger-ink-rgb)/0.45)]">
          This note is no longer in the square.
        </span>
      </p>
      <p className="mt-5 text-sm">
        <Link
          href="/forum"
          className="underline decoration-[rgb(var(--ledger-ink-rgb)/0.25)] underline-offset-4 transition hover:decoration-(--ledger-ink)"
        >
          back to the wall
        </Link>
      </p>
    </SquareShell>
  );
}
