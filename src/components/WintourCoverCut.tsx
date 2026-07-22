"use client";

import Image from "next/image";
import { useState } from "react";

export default function WintourCoverCut() {
  const [position, setPosition] = useState(52);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-black/25 bg-[#d9d6cf]">
        <Image
          src="/artworks/wintour.webp"
          alt="Wintour square artwork crop"
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src="/artworks/wintour-cover.webp"
            alt="Wintour portrait artwork crop"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-[3px] bg-[#c61f36]"
          style={{ left: `calc(${position}% - 1px)` }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 h-14 w-6 -translate-x-1/2 -translate-y-1/2 border border-black bg-[#efede6]" />
        </div>
        <span className="absolute left-3 top-3 bg-[#efede6]/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">
          portrait crop
        </span>
        <span className="absolute right-3 top-3 bg-[#efede6]/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">
          square crop
        </span>
      </div>
      <label className="mt-4 grid gap-2 text-xs font-bold uppercase tracking-[0.12em] sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span>portrait</span>
        <input
          type="range"
          min="8"
          max="92"
          value={position}
          onChange={(event) => setPosition(Number(event.currentTarget.value))}
          className="h-11 w-full cursor-ew-resize accent-[#c61f36]"
          aria-label="Compare the portrait and square Wintour artwork crops"
        />
        <span>square</span>
      </label>
    </div>
  );
}
