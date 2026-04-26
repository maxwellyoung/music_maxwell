"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Disc3, LogIn, LogOut, MessageCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isForum = pathname.startsWith("/forum");

  return (
    <header className="sticky top-0 z-30 mx-auto my-6 w-[95%] max-w-5xl border border-border/70 bg-background/80 shadow-lg backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex flex-1 items-center">
          <button
            onClick={() => void router.push(isForum ? "/" : "/forum")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground/65 transition hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label={isForum ? "Go to releases" : "Go to notes"}
            title={isForum ? "Releases" : "Notes"}
          >
            {isForum ? (
              <Disc3 className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
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
            className="h-9 w-auto"
          />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <AnimatePresence mode="wait" initial={false}>
            {session ? (
              <AlertDialog.Root key="logout">
                <AlertDialog.Trigger asChild>
                  <motion.button
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
                    aria-label="Log out"
                    title="Log out"
                  >
                    <LogOut className="h-5 w-5" aria-hidden="true" />
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
                    className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                    aria-label="Log in"
                    title="Log in"
                  >
                    <LogIn className="h-5 w-5" aria-hidden="true" />
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
