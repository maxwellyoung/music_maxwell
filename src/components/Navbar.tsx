"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteMenu from "~/components/SiteMenu";

export default function Navbar() {
  const pathname = usePathname();
  const isForum = pathname.startsWith("/forum");
  const isHome = pathname === "/";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-30 text-white"
          : "sticky top-0 z-30 border-b border-foreground/15 bg-background/90 text-foreground backdrop-blur-xl"
      }
    >
      <nav className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 sm:h-24 sm:px-8 lg:px-12">
        <div className="flex flex-1 items-center">
          <Link
            href={isForum ? "/" : "/forum"}
            className="group flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label={isForum ? "Go to music" : "Go to notes"}
          >
            <Image
              src={
                isForum ? "/icons/musicnote.svg" : "/icons/speech-bubble.svg"
              }
              alt=""
              width={286}
              height={375}
              className={`h-5 w-5 object-contain transition ${isHome ? "invert" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">
              {isForum ? "Music" : "Notes"}
            </span>
          </Link>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          aria-label="Maxwell Young home"
        >
          <Image
            src="/icons/maxwellyoung2.svg"
            alt="Maxwell Young"
            width={176}
            height={44}
            priority
            className={`h-9 w-36 sm:h-11 sm:w-44 ${isHome ? "invert" : ""}`}
          />
        </Link>

        <div className="flex flex-1 items-center justify-end">
          <SiteMenu />
        </div>
      </nav>
    </header>
  );
}
