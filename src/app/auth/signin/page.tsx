import type { Metadata } from "next";
import AuthForm from "~/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In | Maxwell Young Forum",
  description: "Sign in to your Maxwell Young forum account.",
};

export default function SignInPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign in to join the discussion
          </p>
        </div>

        <AuthForm />
      </div>
    </main>
  );
}
