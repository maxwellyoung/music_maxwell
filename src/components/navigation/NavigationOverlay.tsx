"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            onClick={onClose}
          />

          {/* Subtle grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Navigation - centered */}
          <nav
            className="relative z-10"
            role="navigation"
            aria-label="Main navigation"
          >
            <motion.ul
              className="flex flex-col items-center gap-0"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                }
              }}
            >
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={onClose}
                      className="group relative block px-8 py-2"
                    >
                      <motion.span
                        className="relative block text-center text-[clamp(2rem,8vw,4.5rem)] font-light"
                        style={{
                          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                          letterSpacing: "-0.03em",
                          color: active ? "#ffffff" : "rgba(255,255,255,0.2)"
                        }}
                        whileHover={{
                          color: "#ffffff",
                          transition: { duration: 0.2 }
                        }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* Close hint - bottom */}
          <motion.p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Click anywhere to close
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
