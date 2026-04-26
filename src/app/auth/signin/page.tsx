import type { Metadata } from "next";
import AuthForm from "~/components/auth/AuthForm";
import BackToForumButton from "~/components/auth/BackToForumButton";

export const metadata: Metadata = {
  title: "Sign In | Maxwell Young",
  description: "Sign in to your Maxwell Young account.",
};

export default function SignInPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md">
        <AuthForm />
        <BackToForumButton />
      </div>
    </main>
  );
}
