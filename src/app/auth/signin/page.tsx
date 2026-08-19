import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthForm from "~/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In | Maxwell Young",
  description: "Sign in to leave a note on the Maxwell Young release wall.",
  alternates: { canonical: "/auth/signin" },
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="notes-canvas min-h-screen">
      <div className="grid min-h-[calc(100svh-5rem)] lg:grid-cols-[0.52fr_0.48fr]">
        <section className="flex items-center px-5 py-12 sm:px-10 lg:px-16">
          <div className="w-full">
            <Link
              href="/forum"
              className="group mb-12 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground/45 transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Notes
            </Link>
            <AuthForm />
          </div>
        </section>
        <section className="relative hidden min-h-[700px] overflow-hidden bg-black lg:block">
          <Image
            src="/artworks/SneakinDrinksIntoBars.jpg"
            alt=""
            fill
            priority
            sizes="48vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/25" />
          <p className="font-reenie absolute bottom-12 left-12 max-w-md rotate-[-4deg] text-6xl leading-[0.8] text-white">
            something you almost said
          </p>
        </section>
      </div>
    </main>
  );
}
