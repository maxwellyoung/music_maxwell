"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import { Search, X } from "lucide-react";

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
    <div className="relative">
      <label
        htmlFor="notes-search"
        className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-foreground/45"
      >
        Search words or people
      </label>
      <input
        id="notes-search"
        type="search"
        placeholder="bar lights..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-14 w-full rounded-none border-0 border-b-2 border-foreground bg-transparent px-0 pl-8 pr-9 text-lg shadow-none placeholder:text-foreground/25 focus:border-primary focus:ring-0"
        aria-label="Search notes"
      />
      <Search
        className={`absolute bottom-4 left-0 h-5 w-5 transition-opacity ${
          isPending ? "animate-pulse opacity-40" : "opacity-65"
        }`}
        aria-hidden="true"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute bottom-3 right-0 flex h-8 w-8 items-center justify-center rounded-full text-foreground/45 transition hover:bg-foreground hover:text-background"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
