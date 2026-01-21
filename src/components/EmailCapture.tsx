"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEmailSignup } from "./providers/PostHogProvider";

interface SubscribeResponse {
  success: boolean;
  message: string;
}

interface EmailCaptureProps {
  source?: string;
  variant?: "default" | "minimal" | "hero";
  title?: string;
  description?: string;
}

export function EmailCapture({
  source = "website",
  variant = "default",
  title = "Stay in the loop",
  description = "Get notified about new releases, shows, and exclusive content.",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await response.json()) as SubscribeResponse;

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
        trackEmailSignup(source);
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (variant === "minimal") {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <span className="text-sm text-muted-foreground">Get notified about new releases</span>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-label="Email address"
            className="w-48 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
          >
            {status === "loading"
              ? "…"
              : status === "success"
                ? "Subscribed"
                : "Subscribe"}
          </button>
        </form>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center"
            >
              <p className="text-lg font-medium text-green-400">{message}</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email…"
                  aria-label="Email address"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-xl bg-white px-6 py-3 font-medium text-black transition-all hover:scale-105 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50"
                >
                  {status === "loading" ? "Subscribing…" : "Notify Me"}
                </button>
              </div>
              {status === "error" && (
                <p className="text-center text-sm text-red-400">{message}</p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mb-6 text-sm text-white/60">{description}</p>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-green-500/10 p-4 text-center"
          >
            <p className="font-medium text-green-400">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-white py-3 font-medium text-black transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
            {status === "error" && (
              <p className="text-center text-sm text-red-400">{message}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
