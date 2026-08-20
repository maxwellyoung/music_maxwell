import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy and account data | Maxwell Young",
  description:
    "How account details, public listener notes, replies, sessions, and deletion requests are handled on the Maxwell Young music site.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f2ede4] px-5 py-16 text-[#07090d] sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.28fr_0.72fr]">
        <p className="font-pixel-dot text-xs uppercase tracking-[0.14em] text-[#3157ec]">
          Site note / 01
        </p>
        <div>
          <h1 className="font-pixel-line mb-0 text-[clamp(4rem,10vw,8rem)] leading-[0.76] tracking-tighter">
            privacy.
          </h1>
          <div className="mt-12 max-w-2xl space-y-8 border-t border-black/20 pt-8 text-base leading-relaxed sm:text-lg">
            <section>
              <h2 className="font-pixel-dot mb-3 text-xs uppercase tracking-[0.12em] text-[#3157ec]">
                What is collected
              </h2>
              <p>
                You can browse releases without an account. If you sign in to
                post a note, the site stores the profile details supplied by
                Google, your chosen username, session information, and the notes
                or replies you submit.
              </p>
            </section>
            <section>
              <h2 className="font-pixel-dot mb-3 text-xs uppercase tracking-[0.12em] text-[#3157ec]">
                Why
              </h2>
              <p>
                This information is used only to run accounts, display the
                public release wall, prevent abuse, and keep the site working.
                It is not sold.
              </p>
            </section>
            <section>
              <h2 className="font-pixel-dot mb-3 text-xs uppercase tracking-[0.12em] text-[#3157ec]">
                Your choices
              </h2>
              <p>
                Do not post anything you want to keep private. You can sign out
                at any time. For a data or deletion request, contact Maxwell
                through the linked social channels and include the username used
                on the wall.
              </p>
            </section>
          </div>
          <Link
            href="/"
            className="font-pixel-dot mt-12 inline-block border-b border-black pb-1 text-xs uppercase tracking-widest transition hover:border-[#3157ec] hover:text-[#3157ec]"
          >
            Back to the music ↙
          </Link>
        </div>
      </div>
    </main>
  );
}
