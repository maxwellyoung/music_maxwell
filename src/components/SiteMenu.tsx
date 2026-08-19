"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Instagram,
  Menu,
  Twitter,
  X,
  Youtube,
} from "lucide-react";

const publicLinks = [
  { number: "01", label: "Music", note: "the full archive", href: "/" },
  { number: "02", label: "1kiss", note: "latest release", href: "/1kiss" },
  { number: "03", label: "Notes", note: "the living wall", href: "/forum" },
  {
    number: "04",
    label: "Artwork",
    note: "covers & fragments",
    href: "/artwork/sneakin-drinks",
  },
  { number: "05", label: "Quiz", note: "test your memory", href: "/quiz" },
];

export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const links = session
    ? [
        ...publicLinks,
        {
          number: "06",
          label: "My corner",
          note: "profile & settings",
          href: session.user.username
            ? `/user/${session.user.username}`
            : "/settings",
        },
      ]
    : publicLinks;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        aria-label="Open site menu"
        aria-expanded={open}
      >
        <span className="hidden sm:inline">Everything</span>
        <Menu className="h-5 w-5" />
      </button>

      {mounted &&
        createPortal(
          open ? (
            <div
              className="fixed inset-0 z-[70] overflow-y-auto bg-[#11100f] text-white"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="min-h-full px-5 pb-8 pt-5 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                  <div className="flex h-16 items-center justify-between border-b border-white/20 sm:h-20">
                    <Image
                      src="/icons/maxwellyoung2.svg"
                      alt="Maxwell Young"
                      width={176}
                      height={44}
                      className="h-9 w-36 invert sm:h-11 sm:w-44"
                    />
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      autoFocus
                      className="flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
                      aria-label="Close site menu"
                    >
                      Close
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="py-8 sm:py-12" aria-label="Everything">
                    {links.map((link, index) => (
                      <div
                        key={link.href}
                        className="menu-link-enter"
                        style={{ animationDelay: `${0.04 + index * 0.045}s` }}
                      >
                        <Link
                          href={link.href}
                          className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-white/20 py-4 transition hover:border-white/60 sm:grid-cols-[4rem_1fr_0.4fr_auto] sm:gap-6 sm:py-5"
                        >
                          <span className="font-reenie text-2xl text-white/40 sm:text-3xl">
                            {link.number}
                          </span>
                          <span className="text-4xl font-bold leading-none tracking-[-0.045em] transition group-hover:translate-x-2 group-hover:text-white/70 sm:text-6xl lg:text-7xl">
                            {link.label}
                          </span>
                          <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-white/35 sm:block">
                            {link.note}
                          </span>
                          <ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-6 sm:w-6" />
                        </Link>
                      </div>
                    ))}
                  </nav>

                  <div className="flex flex-col gap-6 border-t border-white/20 pt-7 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-5 text-white/45">
                      <a
                        href="https://instagram.com/maxwell_young"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-white"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="https://twitter.com/internetmaxwell"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-white"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a
                        href="https://www.youtube.com/@maxwell_young"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-white"
                        aria-label="YouTube"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    </div>

                    {session ? (
                      <div className="flex flex-wrap items-center gap-5">
                        <Link
                          href="/settings"
                          className="text-xs font-bold uppercase tracking-[0.16em] text-white/45 transition hover:text-white"
                        >
                          Settings
                        </Link>
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="text-xs font-bold uppercase tracking-[0.16em] text-white/45 transition hover:text-white"
                        >
                          Sign out
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/55 transition hover:text-white"
                      >
                        Sign in to leave notes
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null,
          document.body,
        )}
    </>
  );
}
