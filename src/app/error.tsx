"use client";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        An unexpected error occurred. Please try again or go back home.
      </p>
      <button
        onClick={() => reset()}
        className="mb-4 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow transition hover:bg-accent"
      >
        Try Again
      </button>
      <a
        href="/"
        className="rounded-lg bg-muted px-6 py-3 font-semibold text-foreground shadow transition hover:bg-accent"
      >
        Go Home
      </a>
    </div>
  );
}
