"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const RELEASE_DATE = new Date("2026-04-30T00:00:00+12:00");

const fragments = [
  {
    text: "false alarms",
    href: "/forum/new?title=false%20alarms&content=we%20make%20it%20up%20as%20we%20go%20along",
  },
  {
    text: "mirror / match",
    href: "/forum/new?title=mirror%20and%20match&content=you%27re%20blood%20and%20smoke",
  },
  {
    text: "find the thread",
    href: "/forum/new?title=find%20the%20thread&content=we%20lose%20the%20plot",
  },
];

function getReleaseLine() {
  const diff = RELEASE_DATE.getTime() - Date.now();
  if (diff <= 0) return "out now";

  const hours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
  if (hours < 24) return `${hours} hours`;

  const days = Math.ceil(hours / 24);
  if (days === 1) return "tomorrow";
  return `${days} days`;
}

export default function SneakinLeadup() {
  const [releaseLine, setReleaseLine] = useState("Apr 30");

  useEffect(() => {
    setReleaseLine(getReleaseLine());
    const timer = window.setInterval(
      () => setReleaseLine(getReleaseLine()),
      60000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex max-w-xl items-center justify-between gap-4 border-y border-foreground/10 py-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/45">
          Thursday
        </span>
        <span className="font-reenie text-3xl leading-none text-foreground/70">
          {releaseLine}
        </span>
      </div>

      <div className="flex max-w-xl flex-wrap gap-2">
        {fragments.map((fragment) => (
          <Link
            key={fragment.text}
            href={fragment.href}
            className="rounded-full border border-foreground/10 bg-background/45 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-foreground/50 transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {fragment.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
