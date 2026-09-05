"use client";

import { useEffect, useRef, useState } from "react";

// Sound adds a faint wash. No loop or image is needed while the page is quiet.
export default function LedgerBloom() {
  const [visible, setVisible] = useState(false);
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let level = 0;
    let target = 0;
    let frame = 0;
    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      level = 0;
      setVisible(false);
    };
    const tick = () => {
      level += (target - level) * 0.06;
      if (washRef.current) washRef.current.style.opacity = String(level * 0.09);
      if (level < 0.003 && target === 0) {
        stop();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      if (motion.matches || document.visibilityState !== "visible") {
        stop();
        return;
      }
      if (target > 0 && !frame) {
        setVisible(true);
        frame = window.requestAnimationFrame(tick);
      }
    };
    const onLevel = (event: Event) => {
      target = Math.min(
        1,
        Math.max(0, (event as CustomEvent<number>).detail ?? 0),
      );
      sync();
    };
    window.addEventListener("ledger:audio-level", onLevel);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("ledger:audio-level", onLevel);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
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
