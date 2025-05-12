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
        <AuthForm />
        <button
          className="mt-6 w-full rounded bg-accent px-4 py-2 text-accent-foreground transition hover:bg-accent/80"
          onClick={() => (window.location.href = "/forum")}
        >
          Back to Forum
        </button>
      </div>
    </main>
  );
}
