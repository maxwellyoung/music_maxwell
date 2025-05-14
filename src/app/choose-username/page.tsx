"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ChooseUsernamePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.username) {
      router.replace("/forum");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/set-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      router.push("/forum");
    } else if (res.status === 409) {
      setError("That username is already taken. Please choose another.");
    } else if (res.status === 400) {
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError("Invalid username. Please try again.");
        setLoading(false);
        return;
      }
      if (data.error?.toLowerCase().includes("inappropriate")) {
        setError(
          "That username contains inappropriate language. Please choose another.",
        );
      } else if (
        data.error
          ?.toLowerCase()
          .includes("letters, numbers, underscores, and hyphens")
      ) {
        setError(
          "Username can only contain letters, numbers, underscores, and hyphens.",
        );
      } else {
        setError(data.error ?? "Invalid username. Please try again.");
      }
    } else {
      setError("Failed to set username. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Choose a Username</h1>
        <input
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          required
          minLength={3}
          maxLength={20}
          className="w-full rounded border px-4 py-2"
          placeholder="Username"
        />
        {error && (
          <div className="text-sm font-medium text-red-600">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 font-semibold text-white"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </main>
  );
}
