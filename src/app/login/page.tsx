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
    </main>
  );
}
