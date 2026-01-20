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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: springs.navigation,
  },
  exit: {
    opacity: 0,
    x: 20,
    filter: "blur(10px)",
    transition: { duration: 0.2 },
  },
};

export function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Focus first link when opened
      setTimeout(() => firstLinkRef.current?.focus(), 100);
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40"
        >
          {/* Full-screen dark backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Ambient glow effect */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          </div>

          {/* Navigation content */}
          <motion.nav
            ref={navRef}
            className="relative flex h-full flex-col items-center justify-center px-8"
            role="navigation"
            aria-label="Main navigation"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close hint */}
            <motion.p
              className="absolute top-8 text-sm tracking-widest text-white/40"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              ESC TO CLOSE
            </motion.p>

            {/* Nav items - large, bold, centered */}
            <ul className="flex flex-col items-center gap-2">
              {navItems.map((item, index) => (
                <motion.li key={item.href} variants={itemVariants}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={onClose}
                    className="group relative flex items-center gap-4 px-6 py-3"
                  >
                    {/* Icon */}
                    <motion.span
                      className={`flex h-8 w-8 items-center justify-center transition-all duration-300 ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/80"
                      }`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={springs.micro}
                    >
                      {item.icon}
                    </motion.span>

                    {/* Label - large typography */}
                    <span
                      className={`text-3xl font-light tracking-wide transition-all duration-300 sm:text-4xl ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/80"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator - vertical bar */}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute -left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-white"
                        transition={springs.navigation}
                      />
                    )}

                    {/* Hover glow */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-white/0 transition-colors duration-300 group-hover:bg-white/5"
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Bottom branding */}
            <motion.p
              className="absolute bottom-8 text-xs tracking-[0.3em] text-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              MAXWELL YOUNG
            </motion.p>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
