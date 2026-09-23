"use client";
import { useEffect, useId, useRef } from "react";

// Ledger paper over a dimmed page; hairlines, no rounding, two actions.
// Focus lands on "cancel" when it opens and returns to whatever opened
// it when it closes; Escape and the backdrop both cancel.
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
  const messageId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      openerRef.current?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div
      className="ledger fixed inset-0 z-50 flex items-center justify-center bg-[rgb(var(--ledger-paper-rgb)/0.85)] px-6"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={messageId}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm border border-[rgb(var(--ledger-ink-rgb)/0.20)] bg-(--ledger-paper) p-6 text-(--ledger-ink)"
      >
        <p id={messageId} className="mb-6 text-base leading-snug">
          {message}
        </p>
        <div className="flex items-center justify-end gap-6 text-sm">
          <button
            ref={cancelRef}
            type="button"
            className="text-(--ledger-secondary) transition hover:text-(--ledger-ink)"
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
