"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";

type AuthMode = "login" | "register";

interface RegisterResponse {
  error?: string;
  details?: { message: string; path?: string[] }[];
}

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setErrorDetails([]);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: username }),
        });

        if (!res.ok) {
          const data = (await res.json()) as RegisterResponse;
          setError(data.error ?? "Registration failed");
          if (data.details) {
            setErrorDetails(data.details.map((d) => d.message));
          }
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error("Invalid credentials");
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      router.push("/forum");
      router.refresh();
    } catch (error) {
      setError("An unexpected error occurred");
      setErrorDetails([]);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="card animate-fade-in w-full max-w-md bg-background/80 shadow-2xl backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="mb-2 text-center text-3xl font-bold tracking-tight">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <p className="mb-2 text-center text-base font-normal text-muted-foreground">
            {mode === "login"
              ? "Sign in to join the conversation."
              : "Create your account to join the forum."}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "register" && (
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base font-medium shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Choose a username"
                />
              </div>
            )}
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="h-12 border-none bg-muted/50 text-lg font-medium placeholder:text-muted-foreground focus-visible:ring-1"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                className="h-12 border-none bg-muted/50 text-lg font-medium placeholder:text-muted-foreground focus-visible:ring-1"
              />
            </div>

            {error && (
              <div className="animate-shake rounded-lg border border-red-300 bg-red-100/80 p-3 text-base font-medium text-red-700">
                {error}
                {errorDetails.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
                    {errorDetails.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full text-lg font-semibold shadow-md"
            >
              {isLoading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          <Separator className="my-8" />

          <div className="text-center text-base text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="m-0 cursor-pointer border-none bg-transparent p-0 font-semibold text-primary underline underline-offset-4 hover:text-primary/80 focus:underline focus:outline-none"
                  style={{ background: "none", border: "none" }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="m-0 cursor-pointer border-none bg-transparent p-0 font-semibold text-primary underline underline-offset-4 hover:text-primary/80 focus:underline focus:outline-none"
                  style={{ background: "none", border: "none" }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
