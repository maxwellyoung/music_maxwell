"use client";

import { renderRichContent } from "./richContent";

// Notes get the same links and embeds as echoes.
export default function NoteBody({ content }: { content: string }) {
  return (
    <>
      {content.split("\n\n").map((paragraph, index) => (
        <div
          key={index}
          className="mb-5 max-w-prose text-base leading-7 [overflow-wrap:anywhere] whitespace-pre-line text-[rgb(var(--ledger-ink-rgb)/0.85)]"
        >
          {renderRichContent(paragraph)}
        </div>
      ))}
    </>
  );
}
