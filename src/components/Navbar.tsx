"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isForum = pathname.startsWith("/forum");

  return (
    <header className="sticky top-0 z-30 mx-auto my-6 w-[95%] max-w-5xl rounded-2xl border border-border bg-background/80 shadow-2xl backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        {/* Left: Toggle Button */}
        <div className="flex flex-1 items-center">
          <button
            onClick={() => void router.push(isForum ? "/" : "/forum")}
            className="flex h-12 w-12 items-center justify-center rounded-full p-2 transition hover:bg-accent/10"
            aria-label={isForum ? "Go to Discography" : "Go to Forum"}
          >
            {isForum ? (
              <Image
                src="/icons/speech-bubble.svg"
                alt="Go to Discography"
                width={24}
                height={24}
                className="h-6 w-6 dark:invert"
              />
            ) : (
              <Image
                src="/icons/musicnote.svg"
                alt="Go to Forum"
                width={24}
                height={24}
                className="h-6 w-6 dark:invert"
              />
            )}
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href={isForum ? "/forum" : "/"}
            className="transition hover:opacity-80"
          >
            <Image
              src="/icons/maxwellyoung.svg"
              alt="Maxwell Young"
              width={160}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Right: Mobile Dropdown */}
        <div className="flex flex-1 items-center justify-end sm:hidden">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button aria-label="Open menu">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-transparent">
                  <Image
                    src="/icons/burger.svg"
                    alt="Menu"
                    width={24}
                    height={24}
                    className="h-6 w-6 dark:invert"
                  />
                </div>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="z-50 min-w-[180px] rounded-xl border border-border bg-background p-2 shadow-xl">
              <AnimatePresence>
                {session ? (
                  <>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/forum"
                        className="block rounded px-4 py-2 hover:bg-accent/10"
                      >
                        Forum
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/forum/new"
                        className="block rounded px-4 py-2 hover:bg-accent/10"
                      >
                        New Topic
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/settings"
                        className="block rounded px-4 py-2 hover:bg-accent/10"
                      >
                        Settings
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/rooms"
                        className="block rounded px-4 py-2 hover:bg-accent/10"
                      >
                        Listening Rooms
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1" />
                    <DropdownMenu.Item asChild>
                      <button
                        onClick={() => signOut()}
                        className="block w-full rounded px-4 py-2 text-left hover:bg-accent/10"
                      >
                        Logout
                      </button>
                    </DropdownMenu.Item>
                  </>
                ) : (
                  <>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/forum"
                        className="block rounded px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none"
                      >
                        Forum
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/rooms"
                        className="block rounded px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none"
                      >
                        Listening Rooms
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/auth/signin"
                        className="block rounded px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none"
                      >
                        Login
                      </Link>
                    </DropdownMenu.Item>
                  </>
                )}
              </AnimatePresence>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Right: Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-end gap-6 text-base font-medium sm:flex">
          <AnimatePresence>
            {isForum && session && (
              <motion.div
                key="new-topic"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Link
                  href="/forum/new"
                  className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-accent/10"
                  aria-label="New Topic"
                >
                  <Image
                    src="/icons/new.svg"
                    alt="New Topic"
                    width={24}
                    height={24}
                    className="h-6 w-6 dark:invert"
                  />
                </Link>
              </motion.div>
            )}
            {isForum && session && (
              <motion.button
                key="settings"
                onClick={() => router.push("/settings")}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-accent/10"
                aria-label="Settings"
              >
                <Image
                  src="/icons/cog.svg"
                  alt="Settings"
                  width={24}
                  height={24}
                  className="h-6 w-6 dark:invert"
                />
              </motion.button>
            )}
            {isForum && session && (
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <motion.button
                    key="logout"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex h-10 w-10 items-center justify-center rounded-full p-2 transition hover:bg-accent/10"
                    aria-label="Logout"
                  >
                    <Image
                      src="/icons/logout.svg"
                      alt="Logout"
                      width={24}
                      height={24}
                      className="h-6 w-6 dark:invert"
                    />
                  </motion.button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                  <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-xl">
                    <AlertDialog.Title className="mb-2 text-lg font-bold">
                      Confirm Logout
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mb-4 text-sm text-muted-foreground">
                      Are you sure you want to log out?
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
                          Logout
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            )}
            {isForum && !session && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Link
                  href="/auth/signin"
                  className="transition hover:text-accent focus:text-accent"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
