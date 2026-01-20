"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { springs } from "./spring-config";
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

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
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

export function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => firstLinkRef.current?.focus(), 400);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Morphing backdrop - expands from bottom-right */}
          <motion.div
            className="fixed inset-0 z-40 bg-neutral-950"
            initial={{
              clipPath: "circle(0% at calc(100% - 2.5rem) calc(100% - 2.5rem))"
            }}
            animate={{
              clipPath: "circle(150% at calc(100% - 2.5rem) calc(100% - 2.5rem))"
            }}
            exit={{
              clipPath: "circle(0% at calc(100% - 2.5rem) calc(100% - 2.5rem))"
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Film grain overlay */}
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 opacity-[0.35]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          />

          {/* Navigation content */}
          <motion.nav
            className="fixed inset-0 z-40 flex flex-col justify-center px-8 sm:px-16"
            role="navigation"
            aria-label="Main navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            {/* Close button - top right */}
            <motion.button
              onClick={onClose}
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.4 }}
              aria-label="Close navigation"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Nav items */}
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    delay: 0.3 + index * 0.04,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={onClose}
                    className="group relative flex items-center gap-5 py-2"
                  >
                    {/* Active bar */}
                    <motion.div
                      className={`h-12 w-1 rounded-full transition-all duration-300 ${
                        isActive(item.href) ? "bg-white" : "bg-white/0 group-hover:bg-white/20"
                      }`}
                      layoutId="nav-bar"
                    />

                    {/* Icon */}
                    <span
                      className={`flex h-10 w-10 items-center justify-center transition-all duration-300 ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-white/30 group-hover:text-white/70"
                      }`}
                    >
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span
                      className={`text-4xl font-extralight tracking-tight transition-all duration-300 sm:text-5xl md:text-6xl ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-white/30 group-hover:text-white/70"
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
