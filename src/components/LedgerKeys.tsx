"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// The ledger under the hands: one small map of quiet keys.
//   esc      blur the field you're typing in, else return to the index
//   ↑ / ↓    walk the discography rows (focus doubles as cover reveal)
//   ← / →    previous / next release on /r pages
//   /        focus search on the wall
export default function LedgerKeys() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.isContentEditable);

      if (event.key === "Escape") {
        if (typing) {
          target.blur();
          return;
        }
        if (pathname !== "/") {
          event.preventDefault();
          router.push("/");
        }
        return;
      }

      if (typing) return;

      if (
        pathname === "/" &&
        (event.key === "ArrowDown" || event.key === "ArrowUp")
      ) {
        const rows = Array.from(
          document.querySelectorAll<HTMLAnchorElement>("ol a"),
        );
        if (rows.length === 0) return;
        event.preventDefault();
        const current = rows.indexOf(
          document.activeElement as HTMLAnchorElement,
        );
        const next =
          event.key === "ArrowDown"
            ? Math.min(current + 1, rows.length - 1)
            : Math.max(current - 1, 0);
        rows[next]?.focus();
        return;
      }

      if (
        pathname.startsWith("/r/") &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")
      ) {
        const link = document.querySelector<HTMLAnchorElement>(
          event.key === "ArrowLeft"
            ? "[data-ledger-prev]"
            : "[data-ledger-next]",
        );
        if (link) {
          event.preventDefault();
          link.click();
        }
        return;
      }

      if (pathname === "/forum" && event.key === "/") {
        const search = document.getElementById("notes-search");
        if (search) {
          event.preventDefault();
          search.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  return null;
}
