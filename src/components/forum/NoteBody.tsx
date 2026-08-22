"use client";

import { renderRichContent } from "./richContent";

// Notes get the same links and embeds as echoes.
export default function NoteBody({ content }: { content: string }) {
  return (
    <>
      {content.split("\n\n").map((paragraph, index) => (
        <p
          key={index}
          className="mb-5 max-w-prose whitespace-pre-line text-base leading-7 text-[rgb(var(--ledger-ink-rgb)/0.85)] [overflow-wrap:anywhere]"
        >
          {renderRichContent(paragraph)}
        </p>
      ))}
    </>
  );
}
