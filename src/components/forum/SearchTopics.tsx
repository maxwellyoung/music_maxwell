"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useDebounce } from "~/hooks/useDebounce";

// One ruled field, no label: it sits on the standfirst line beside the
// count, and the count answers it.
export function SearchTopics({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 300);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (debouncedQuery !== initialQuery) {
      startTransition(() => {
        router.push(
          `/forum${debouncedQuery ? `?${createQueryString("q", debouncedQuery)}` : ""}`,
        );
      });
    }
  }, [debouncedQuery, createQueryString, router, initialQuery]);

  return (
    <input
      id="notes-search"
      type="search"
      placeholder="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search notes"
      className={`h-8 w-full rounded-none border-0 border-b border-[rgb(var(--ledger-ink-rgb)/0.25)] bg-transparent px-0 text-sm text-(--ledger-ink) shadow-none transition-opacity placeholder:text-[rgb(var(--ledger-ink-rgb)/0.30)] focus:border-(--ledger-ink) focus:ring-0 sm:w-44 ${
        isPending ? "opacity-60" : ""
      }`}
    />
  );
}
