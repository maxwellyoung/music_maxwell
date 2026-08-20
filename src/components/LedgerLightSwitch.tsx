"use client";

import { useEffect, useState } from "react";

const KEY = "ledger-scheme";

// One character, one decision: override the system scheme for the ledger.
// The pre-paint script in the root layout applies the stored choice before
// hydration so there is no flash.
export default function LedgerLightSwitch() {
  const [scheme, setScheme] = useState<string | null>(null);

  useEffect(() => {
    setScheme(document.documentElement.dataset.ledger ?? null);
  }, []);

  const toggle = () => {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const effectiveDark = scheme ? scheme === "dark" : systemDark;
    const next = effectiveDark ? "light" : "dark";
    document.documentElement.dataset.ledger = next;
    localStorage.setItem(KEY, next);
    setScheme(next);
  };

  const systemDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const effectiveDark = scheme ? scheme === "dark" : systemDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle ink mode"
      title="Ink mode"
      className={`inline-block transition-[color,transform] duration-300 [transition-timing-function:var(--ease-in-out-strong)] hover:text-(--ledger-ink) active:scale-90 ${
        effectiveDark ? "rotate-180" : "rotate-0"
      }`}
    >
      ◐
    </button>
  );
}
