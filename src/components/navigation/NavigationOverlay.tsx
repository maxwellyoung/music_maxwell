"use client";

import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Music" },
  { href: "/forum", label: "Forum" },
  { href: "/rooms", label: "Rooms" },
  { href: "/videos", label: "Videos" },
  { href: "/shows", label: "Shows" },
  { href: "/lyrics", label: "Lyrics" },
  { href: "/timeline", label: "Timeline" },
  { href: "/bts", label: "Process" },
  { href: "/guestbook", label: "Guestbook" },
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
      setTimeout(() => firstLinkRef.current?.focus(), 300);
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
    <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.5 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-neutral-950"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Fine film grain */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Navigation */}
            <nav
              className="relative flex h-full flex-col items-start justify-center px-8 sm:px-12 md:px-20"
              role="navigation"
              aria-label="Main navigation"
            >
              <ul className="flex flex-col">
                {navItems.map((item, index) => {
                  const active = isActive(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.6,
                        delay: index * 0.04,
                      }}
                    >
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={onClose}
                        className="group relative block py-1"
                      >
                        <motion.span
                          className={`relative block text-5xl font-normal tracking-tight sm:text-6xl md:text-7xl ${
                            active ? "text-white" : "text-neutral-600"
                          }`}
                          whileHover={{ x: 8 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                          {item.label}

                          {/* Hover indicator - subtle line */}
                          <motion.span
                            className="absolute -left-6 top-1/2 h-px w-4 -translate-y-1/2 bg-white"
                            initial={{ scaleX: 0, opacity: 0 }}
                            whileHover={{ scaleX: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{ originX: 0 }}
                          />
                        </motion.span>

                        {/* Active dot */}
                        {active && (
                          <motion.span
                            layoutId="nav-dot"
                            className="absolute -left-6 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
