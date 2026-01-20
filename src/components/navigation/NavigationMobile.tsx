"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useCallback, useState } from "react";

interface NavigationMobileProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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

function MobileNavItem({
  item,
  index,
  isActive,
  onClose
}: {
  item: typeof navItems[0];
  index: number;
  isActive: boolean;
  onClose: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.025,
      }}
    >
      <Link
        href={item.href}
        onClick={onClose}
        className="relative flex items-center gap-3 py-3"
      >
        <span
          className="w-5 font-mono text-[10px] tabular-nums"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="text-[17px] font-normal"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.01em",
            color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
          }}
        >
          {item.label}
        </span>

        {isActive && (
          <motion.span
            layoutId="active-mobile"
            className="absolute -left-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-white"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.li>
  );
}

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onOpenChange(false);
  }, [onOpenChange]);

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
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={handleClose}
          />

          {/* Panel - slides up from bottom */}
          <motion.aside
            className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(20, 20, 22, 0.98)",
                backdropFilter: "blur(40px)",
              }}
            />

            {/* Handle */}
            <div className="relative flex justify-center pt-3">
              <div className="h-1 w-8 rounded-full bg-white/20" />
            </div>

            {/* Content */}
            <nav className="relative px-6 pb-10 pt-6" role="navigation" aria-label="Main navigation">
              <ul className="flex flex-col">
                {navItems.map((item, index) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    index={index}
                    isActive={isActive(item.href)}
                    onClose={handleClose}
                  />
                ))}
              </ul>
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
