"use client";
import { useEffect } from "react";

// Ledger paper over a dimmed page; hairlines, no rounding, two actions.
export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  message,
  confirmLabel = "delete",
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  confirmLabel?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div
      className="ledger fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--ledger-paper-rgb)/0.85)] px-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm border border-[rgb(var(--ledger-ink-rgb)/0.20)] bg-(--ledger-paper) p-6 text-(--ledger-ink)">
        <p className="mb-6 text-base leading-snug">{message}</p>
        <div className="flex items-center justify-end gap-6 text-sm">
          <button
            type="button"
            className="text-[rgb(var(--ledger-ink-rgb)/0.45)] transition hover:text-(--ledger-ink)"
            onClick={onCancel}
          >
            cancel
          </button>
          <button
            type="button"
            className="min-h-10 border border-(--ledger-ink) px-4 transition hover:bg-(--ledger-ink) hover:text-(--ledger-paper)"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
