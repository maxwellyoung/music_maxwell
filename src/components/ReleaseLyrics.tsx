"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";

export default function ReleaseLyrics({
  blocks,
  tone = "light",
}: {
  blocks: string[];
  tone?: "light" | "dark";
}) {
  const [expanded, setExpanded] = useState(false);
  const textClass = tone === "dark" ? "text-white/80" : "text-black/75";

  const renderBlock = (block: string, index: number) => (
    <p
      key={`${index}-${block.slice(0, 18)}`}
      className={cn(
        "whitespace-pre-line text-lg font-semibold leading-relaxed",
        textClass,
      )}
    >
      {block}
    </p>
  );

  return (
    <>
      <div className="sm:hidden">
        <div className="grid gap-8">
          {(expanded ? blocks : blocks.slice(0, 2)).map(renderBlock)}
        </div>
        {blocks.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="border-current/25 mt-10 min-h-12 border-y px-0 text-sm font-bold transition hover:opacity-55 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-current"
            aria-expanded={expanded}
          >
            {expanded
              ? "fold the lyric sheet ↑"
              : "read the complete lyric sheet ↓"}
          </button>
        )}
      </div>
      <div className="hidden gap-x-10 gap-y-8 sm:grid sm:grid-cols-2">
        {blocks.map(renderBlock)}
      </div>
    </>
  );
}
