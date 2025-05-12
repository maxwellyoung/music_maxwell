"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const isForum = pathname.startsWith("/forum");
  const isDiscog = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 mx-auto my-6 w-[95%] max-w-5xl rounded-2xl border border-border bg-background/80 shadow-2xl backdrop-blur-lg">
      <nav className="container flex h-16 items-center justify-between">
        {/* Left: Toggle Button */}
        <div className="flex flex-1 items-center">
          <button
            onClick={() => void router.push(isForum ? "/" : "/forum")}
            className="flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/60"
            aria-label={isForum ? "Go to Discography" : "Go to Forum"}
          >
            {isForum ? (
              // Speech Bubble SVG - Optimized for navbar
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              // Music Note SVG - Optimized for navbar
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17C6 19.21 7.79 21 10 21C12.21 21 14 19.21 14 17V7H18V3H12ZM10 19C8.9 19 8 18.1 8 17C8 15.9 8.9 15 10 15C11.1 15 12 15.9 12 17C12 18.1 11.1 19 10 19Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
        {/* Site Title (always Maxwell Young) */}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/"
            className="transition hover:opacity-80"
            aria-label="Home"
          >
            <img
              src="/icons/maxwellyoung2.svg"
              alt="Maxwell Young Logo"
              style={{
                height: "48px",
                width: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Link>
        </div>
        {/* Animated Auth/Action Buttons */}
        <div className="flex flex-1 items-center justify-end gap-6 text-base font-medium">
          <AnimatePresence mode="wait">
            {isForum && session && (
              <motion.div
                key="new-topic"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Link
                  href="/forum/new"
                  className="transition hover:text-accent focus:text-accent"
                >
                  New Topic
                </Link>
              </motion.div>
            )}
            {isForum && session && (
              <motion.button
                key="logout"
                onClick={() => signOut()}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="cursor-pointer rounded-full border-none bg-primary px-5 py-2 font-semibold text-primary-foreground shadow-md transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/60"
                style={{ minWidth: 90 }}
              >
                Log out
              </motion.button>
            )}
            {isForum && !session && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <Link
                  href="/login"
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
