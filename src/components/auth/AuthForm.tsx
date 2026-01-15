"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
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
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center px-4"
    >
      <Card className="w-full max-w-md border border-border/50 bg-background/60 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in with your Google account to join the conversation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInApp && (
            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-center text-sm text-yellow-700 dark:text-yellow-400">
              <p className="font-medium">In-app browser detected</p>
              <p className="mt-1 text-xs">
                Google sign-in may not work in this browser. Please open this
                page in Chrome, Safari, or your default browser.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((v) => !v)}
              className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-describedby="remember-me-description"
            />
            <label
              htmlFor="rememberMe"
              className="select-none text-sm text-muted-foreground"
            >
              Remember me for 30 days
            </label>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading || isInApp}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
