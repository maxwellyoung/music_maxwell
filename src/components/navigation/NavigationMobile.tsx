"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useCallback } from "react";
import {
  MusicIcon,
  ForumIcon,
  RoomsIcon,
  VideosIcon,
  ShowsIcon,
  LyricsIcon,
  TimelineIcon,
  BtsIcon,
  GuestbookIcon,
} from "./icons";

interface NavigationMobileProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { href: "/", label: "Music", icon: <MusicIcon /> },
  { href: "/forum", label: "Forum", icon: <ForumIcon /> },
  { href: "/rooms", label: "Rooms", icon: <RoomsIcon /> },
  { href: "/videos", label: "Videos", icon: <VideosIcon /> },
  { href: "/shows", label: "Shows", icon: <ShowsIcon /> },
  { href: "/lyrics", label: "Lyrics", icon: <LyricsIcon /> },
  { href: "/timeline", label: "Timeline", icon: <TimelineIcon /> },
  { href: "/bts", label: "Process", icon: <BtsIcon /> },
  { href: "/guestbook", label: "Guestbook", icon: <GuestbookIcon /> },
];

export function NavigationMobile({
  isOpen,
  onOpenChange,
}: NavigationMobileProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleClose = () => onOpenChange(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Morphing backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-neutral-950"
            initial={{
              clipPath: "circle(0% at calc(100% - 2rem) calc(100% - 2rem))"
            }}
            animate={{
              clipPath: "circle(150% at calc(100% - 2rem) calc(100% - 2rem))"
            }}
            exit={{
              clipPath: "circle(0% at calc(100% - 2rem) calc(100% - 2rem))"
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Film grain */}
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          />

          {/* Navigation */}
          <motion.nav
            className="fixed inset-0 z-40 flex flex-col justify-center px-6"
            role="navigation"
            aria-label="Main navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Close button */}
            <motion.button
              onClick={handleClose}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              aria-label="Close navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Nav items */}
            <ul className="space-y-0">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: 0.25 + index * 0.035,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={handleClose}
                    className="group flex items-center gap-4 py-2.5"
                  >
                    {/* Active bar */}
                    <div
                      className={`h-8 w-0.5 rounded-full transition-colors ${
                        isActive(item.href) ? "bg-white" : "bg-transparent"
                      }`}
                    />

                    {/* Icon */}
                    <span
                      className={`flex h-8 w-8 items-center justify-center transition-colors ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                    >
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span
                      className={`text-3xl font-extralight tracking-tight transition-colors ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
