import type { Metadata } from "next";
import AuthForm from "~/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Login | Maxwell Young Forum",
  description: "Login to your Maxwell Young forum account.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <AuthForm />
      <button
        className="mt-6 rounded bg-accent px-4 py-2 text-accent-foreground transition hover:bg-accent/80"
        onClick={() => (window.location.href = "/forum")}
      >
        Back to Forum
      </button>
    </main>
  );
}
