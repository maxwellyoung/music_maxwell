"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import { X } from "lucide-react";

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
    <div className="relative min-w-0 max-w-full overflow-hidden">
      <label
        htmlFor="notes-search"
        className="mb-2 block text-sm text-[rgb(var(--ledger-ink-rgb)/0.40)]"
      >
        Search words or people
      </label>
      <input
        id="notes-search"
        type="search"
        placeholder="bar lights…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`h-10 w-full rounded-none border-0 border-b border-[rgb(var(--ledger-ink-rgb)/0.25)] bg-transparent px-0 pr-9 text-base text-(--ledger-ink) shadow-none transition-opacity placeholder:text-[rgb(var(--ledger-ink-rgb)/0.25)] focus:border-(--ledger-ink) focus:ring-0 ${
          isPending ? "opacity-60" : ""
        }`}
        aria-label="Search notes"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute bottom-2 right-0 flex h-7 w-7 items-center justify-center text-[rgb(var(--ledger-ink-rgb)/0.40)] transition hover:text-(--ledger-ink)"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
