"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "~/hooks/useDebounce";

export function SearchTopics({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      router.push(
        `/forum${debouncedQuery ? `?${createQueryString("q", debouncedQuery)}` : ""}`,
      );
      // Reset loading state after navigation
      const timeout = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [debouncedQuery, createQueryString, router, initialQuery]);

  return (
    <div className="relative mb-10">
      <input
        type="search"
        placeholder="Search topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-border bg-white px-5 py-3 pl-12 text-lg shadow transition placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-label="Search forum topics"
      />
      <svg
        className={`absolute left-4 top-3.5 h-6 w-6 text-muted-foreground transition-opacity ${
          isLoading ? "opacity-50" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {isLoading && (
        <div className="absolute right-4 top-3.5">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
