import type { Metadata } from "next";
import AuthForm from "~/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Login | Maxwell Young",
  description: "Sign in to leave a note on the Maxwell Young release wall.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <AuthForm />
    </main>
  );
}
