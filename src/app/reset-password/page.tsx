"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spinner } from "~/components/ui/Spinner";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="bg-background/80 shadow-2xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="mb-2 text-center text-3xl font-bold tracking-tight">
              Reset Password
            </CardTitle>
            <p className="mb-2 text-center text-base font-normal text-muted-foreground">
              Enter your new password below.
            </p>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={searchParams.token} />
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

function ResetPasswordForm({ token }: { token?: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid or missing reset token.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        throw new Error("Failed to reset password");
      }

      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      });
      window.location.href = "/login";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center text-muted-foreground">
        <p className="mb-4">Invalid or missing reset token.</p>
        <Link
          href="/forgot-password"
          className="text-primary hover:text-primary/80"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Input
          id="password"
          type="password"
          required
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 border-none bg-muted/50 text-lg font-medium placeholder:text-muted-foreground focus-visible:ring-1"
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="confirmPassword"
          type="password"
          required
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-12 border-none bg-muted/50 text-lg font-medium placeholder:text-muted-foreground focus-visible:ring-1"
          minLength={8}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full text-lg font-semibold shadow-md"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size={16} />
            <span className="ml-2">Resetting...</span>
          </div>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}
