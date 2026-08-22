"use client";

const KEY = "ledger-scheme";

// One character, one decision: override the system scheme for the ledger.
// The pre-paint script in the root layout applies the stored choice before
// hydration so there is no flash. The glyph's rotation is pure CSS keyed
// off the same scheme selectors as the palette, so the server and the
// client always agree on the markup.
export default function LedgerLightSwitch() {
  const toggle = () => {
    const stored = document.documentElement.dataset.ledger;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const effectiveDark = stored ? stored === "dark" : systemDark;
    const next = effectiveDark ? "light" : "dark";
    document.documentElement.dataset.ledger = next;
    localStorage.setItem(KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle ink mode"
      title="Ink mode"
      className="ledger-switch inline-block transition-[color,transform] duration-300 [transition-timing-function:var(--ease-in-out-strong)] hover:text-(--ledger-ink) active:scale-90"
    >
      ◐
    </button>
  );
}
