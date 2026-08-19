"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isForum = pathname.startsWith("/forum");
  // /classic hosts the pre-minimal homepage and keeps its transparent hero nav.
  const isHome = pathname === "/classic";
  // The ledger surfaces (/, /r/*) and /lab experiments carry their own chrome.
  const isChromeless =
    pathname === "/" ||
    pathname.startsWith("/r/") ||
    pathname.startsWith("/lab");

  if (isChromeless) return null;

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
            href="/#archive"
            className="group flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            aria-label="Go to release archive"
            title="Archive"
          >
            <Image
              src="/icons/musicnote.svg"
              alt=""
              width={254}
              height={352}
              className={`h-5 w-5 object-contain transition ${isHome ? "invert" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Archive</span>
          </Link>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-label="Maxwell Young home"
        >
          <Image
            src="/icons/maxwellyoung2.png"
            alt="Maxwell Young"
            width={1024}
            height={483}
            priority
            className={`h-9 w-auto sm:h-11 ${isHome ? "invert" : ""}`}
          />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4 text-sm font-semibold uppercase tracking-[0.14em]">
          <AnimatePresence mode="wait" initial={false}>
            {session ? (
              <AlertDialog.Root key="logout">
                <AlertDialog.Trigger asChild>
                  <motion.button
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="group flex h-11 w-11 items-center justify-center opacity-70 transition hover:text-destructive hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                    aria-label="Log out"
                    title="Log out"
                  >
                    <Image
                      src="/icons/logout.svg"
                      alt=""
                      width={556}
                      height={807}
                      className={`h-6 w-6 object-contain transition ${isHome ? "invert" : ""}`}
                      aria-hidden="true"
                    />
                  </motion.button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                  <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-background p-6 shadow-xl">
                    <AlertDialog.Title className="mb-2 text-lg font-bold">
                      Log out?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mb-4 text-sm text-muted-foreground">
                      You will be signed out of your account.
                    </AlertDialog.Description>
                    <div className="flex justify-end gap-2">
                      <AlertDialog.Cancel asChild>
                        <button className="rounded bg-muted px-4 py-2 text-foreground transition hover:bg-muted/80">
                          Cancel
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          className="rounded bg-destructive px-4 py-2 text-destructive-foreground transition hover:bg-destructive/80"
                          onClick={() => signOut()}
                        >
                          Log out
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            ) : (
              isForum && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link
                    href="/login"
                    className="group flex h-11 w-11 items-center justify-center opacity-70 transition hover:text-primary hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                    aria-label="Log in"
                    title="Log in"
                  >
                    <Image
                      src="/icons/login.svg"
                      alt=""
                      width={288}
                      height={286}
                      className="h-6 w-6 object-contain transition"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
