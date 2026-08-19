"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { signIn } from "next-auth/react";
import { useToast } from "~/components/ui/use-toast";
// @ts-expect-error: No types for detect-inapp
import InApp from "detect-inapp";

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isInApp, setIsInApp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const inapp = new InApp(navigator.userAgent);
    setIsInApp(Boolean(inapp.isInApp));
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/choose-username",
        rememberMe: rememberMe ? "1" : "0",
      });
    } catch {
      toast({
        title: "Could not sign in",
        description: "Google sign-in did not complete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl"
    >
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
        Notes account
      </p>
      <h1 className="mb-4 mt-4 text-5xl leading-[0.9] tracking-[-0.055em] sm:text-7xl">
        Join the wall.
      </h1>
      <p className="font-reenie mb-10 text-4xl leading-none text-foreground/55">
        pin a line / answer an echo / keep a corner
      </p>

      {isInApp && (
        <div className="mb-6 border-l-2 border-accent bg-accent/10 px-4 py-3 text-sm leading-relaxed text-foreground/65">
          <p className="font-semibold text-foreground">Open in your browser</p>
          Google sign-in may not work inside Instagram or another in-app
          browser. Open this page in Safari or Chrome.
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isInApp}
        className="group flex min-h-14 w-full items-center justify-between rounded-full bg-foreground px-6 text-sm font-bold text-background transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="flex items-center gap-3">
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? "Opening Google..." : "Continue with Google"}
        </span>
        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      </button>

      <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-foreground/55">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe((value) => !value)}
          className="peer sr-only"
        />
        <span className="flex h-5 w-5 items-center justify-center border border-foreground/30 transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
          {rememberMe && <Check className="h-3.5 w-3.5" />}
        </span>
        Keep me signed in for 30 days
      </label>

      <p className="mt-8 max-w-md text-xs leading-relaxed text-foreground/35">
        Your account is used for public notes, replies, and your profile. Your
        email is never shown on the wall.
      </p>
    </motion.div>
  );
}
