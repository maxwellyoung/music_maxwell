"use client";

import { useEffect, useRef, useState } from "react";

// Jeremy Blake rule: colour enters the ledger only through sound.
// The page stays paper until an excerpt plays; then the release's own
// bloom washes the viewport at a few percent, breathing with the level.
export default function LedgerBloom() {
  const [visible, setVisible] = useState(false);
  const levelRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onLevel = (event: Event) => {
      targetRef.current = Math.min(
        1,
        (event as CustomEvent<number>).detail ?? 0,
      );
      if (targetRef.current > 0) setVisible(true);
    };
    window.addEventListener("ledger:audio-level", onLevel);

    const tick = () => {
      rafRef.current = window.requestAnimationFrame(tick);
      const level = levelRef.current;
      const next = level + (targetRef.current - level) * 0.06;
      levelRef.current = next;
      if (washRef.current) {
        washRef.current.style.opacity = String(next * 0.09);
      }
      if (next < 0.003 && targetRef.current === 0) setVisible(false);
    };
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("ledger:audio-level", onLevel);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={washRef}
      aria-hidden="true"
      data-ledger-bloom
      className="ledger-bloom pointer-events-none fixed inset-0 z-40"
      style={{
        opacity: 0,
        backgroundImage: "url(/1kiss/signal-bloom-blue.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
