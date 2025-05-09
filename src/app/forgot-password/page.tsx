"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="card animate-fade-in w-full max-w-md bg-background/80 shadow-2xl backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="mb-2 text-center text-3xl font-bold tracking-tight">
            Forgot Password
          </CardTitle>
          <p className="mb-2 text-center text-base font-normal text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to send reset email");
      }

      toast({
        title: "Reset email sent",
        description: "Check your email for the password reset link.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 border-none bg-muted/50 text-lg font-medium placeholder:text-muted-foreground focus-visible:ring-1"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full text-lg font-semibold shadow-md"
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center text-base text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
