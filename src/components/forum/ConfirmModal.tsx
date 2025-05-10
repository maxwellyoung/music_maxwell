"use client";
import { useEffect } from "react";

export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  message,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-2xl">
        <div className="mb-6 text-lg font-semibold text-foreground">
          {message}
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="rounded-lg border border-input bg-muted px-4 py-2 font-medium text-muted-foreground hover:bg-muted/80"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-destructive px-4 py-2 font-semibold text-destructive-foreground shadow hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
