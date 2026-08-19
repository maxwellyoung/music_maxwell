"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

export default function ChooseUsernamePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.username && !session.user.needsUserName) {
      router.replace("/forum");
    }
  }, [session, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/set-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (response.ok) {
      await signIn("google", { redirect: false });
      router.push("/forum");
    } else if (response.status === 409) {
      setError("That name is already pinned to someone else.");
    } else if (response.status === 400) {
      let data: { error?: string } = {};
      try {
        data = (await response.json()) as { error?: string };
      } catch {
        setError("That username does not look right. Try another.");
        setLoading(false);
        return;
      }
      if (data.error?.toLowerCase().includes("inappropriate")) {
        setError("Choose a username that can stay on the public wall.");
      } else if (
        data.error
          ?.toLowerCase()
          .includes("letters, numbers, underscores, and hyphens")
      ) {
        setError("Use only letters, numbers, underscores, and hyphens.");
      } else {
        setError(data.error ?? "That username does not look right.");
      }
    } else {
      setError("Could not save that name. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="notes-canvas flex min-h-[calc(100svh-5rem)] items-center px-5 py-14 sm:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[0.44fr_0.56fr] lg:items-end lg:gap-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            One last thing
          </p>
          <h1 className="mb-5 mt-4 text-6xl leading-[0.82] tracking-[-0.065em] sm:text-8xl">
            Sign the
            <br />
            corner.
          </h1>
          <p className="font-reenie text-4xl leading-none text-foreground/55">
            this is how people find your fragments
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="username"
            className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/45"
          >
            Public username
          </label>
          <div className="mt-3 flex items-end border-b-2 border-foreground">
            <span className="pb-3 text-3xl text-primary">@</span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              minLength={3}
              maxLength={20}
              className="h-16 min-w-0 flex-1 rounded-none border-0 bg-transparent px-2 text-3xl shadow-none placeholder:text-foreground/20 focus:ring-0"
              placeholder="your_name"
              autoComplete="username"
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-foreground/40">
            3–20 characters. Letters, numbers, underscores, and hyphens.
          </p>
          {error && (
            <div className="mt-5 border-l-2 border-destructive pl-4 text-sm font-medium text-destructive">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || username.length < 3}
            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 text-xs font-bold uppercase tracking-[0.18em] text-background transition hover:bg-primary disabled:opacity-35"
          >
            {loading ? "Pinning..." : "Use this name"}
            {!loading && (
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
