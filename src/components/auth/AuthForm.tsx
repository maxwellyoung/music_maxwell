"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/Spinner";
import { useToast } from "~/components/ui/use-toast";
// @ts-expect-error: No types for detect-inapp
import InApp from "detect-inapp";

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isInApp, setIsInApp] = useState(false);

  useEffect(() => {
    const inapp = new InApp(navigator.userAgent);
    setIsInApp(Boolean(inapp.isInApp));
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/choose-username" });
    } catch (error) {
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
      className="flex items-center justify-center"
    >
      <Card className="w-full max-w-md bg-background/80 shadow-2xl backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="mb-2 text-center text-3xl font-bold tracking-tight">
            Sign in with Google
          </CardTitle>
          <p className="mb-2 text-center text-base font-normal text-muted-foreground">
            Use your Google account to join the conversation.
          </p>
        </CardHeader>
        <CardContent>
          {isInApp && (
            <div className="mb-4 rounded border border-yellow-300 bg-yellow-100 p-3 text-center text-yellow-800">
              Google sign-in is not supported in this browser (e.g. Instagram,
              Facebook, or Twitter in-app browser).
              <br />
              <b>
                Please open this page in Chrome, Safari, or your default browser
                to sign in with Google.
              </b>
            </div>
          )}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading || isInApp}
            className="h-12 w-full text-lg font-semibold shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner size={16} />
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              <span>Sign in with Google</span>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
