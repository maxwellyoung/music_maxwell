"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useDebounce } from "~/hooks/useDebounce";

// One ruled field, no label: it sits on the standfirst line beside the
// count, and the count answers it. The URL is the source of truth; the
// field only pushes once its debounce has settled on something else.
export function SearchTopics({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const current = initialQuery ?? "";
  const [query, setQuery] = useState(current);
  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 300);
  const lastServer = useRef(current);

  // One pass, two jobs, never both. When the URL changes underneath the
  // field (the clear link, back and forward) and the field still shows
  // the previous URL's query, the field follows and nothing is pushed.
  // Otherwise the field pushes once its debounce has settled on
  // something other than the URL. Text typed mid-flight is left alone.
  useEffect(() => {
    if (current !== lastServer.current) {
      const previous = lastServer.current;
      lastServer.current = current;
      if (query === previous) setQuery(current);
      return;
    }
    if (debouncedQuery !== query || debouncedQuery === current) return;
    startTransition(() => {
      router.push(
        debouncedQuery
          ? `/forum?q=${encodeURIComponent(debouncedQuery)}`
          : "/forum",
      );
    });
  }, [current, debouncedQuery, query, router]);

  return (
    <input
      id="notes-search"
      type="search"
      placeholder="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search notes"
      className={`h-8 w-full rounded-none border-0 border-b border-[rgb(var(--ledger-ink-rgb)/0.25)] bg-transparent px-0 text-sm text-(--ledger-ink) shadow-none transition-opacity placeholder:text-(--ledger-secondary) focus:border-(--ledger-ink) focus:ring-0 sm:w-44 ${
        isPending ? "opacity-60" : ""
      }`}
    />
  );
}
