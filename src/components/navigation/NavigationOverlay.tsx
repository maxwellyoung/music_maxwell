"use client";

import { motion, AnimatePresence, useSpring, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, useRef, useState } from "react";
import Link from "next/link";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Music", aside: "the main event" },
  { href: "/forum", label: "Forum", aside: "thoughts welcome" },
  { href: "/videos", label: "Videos", aside: "moving pictures" },
  { href: "/lyrics", label: "Lyrics", aside: "words, words, words" },
  { href: "/press", label: "Press", aside: "nice things people said" },
  { href: "/guestbook", label: "Guestbook", aside: "leave a note" },
];

function NavItem({
  item,
  index,
  isActive,
  onClose,
  firstRef,
  reducedMotion,
}: {
  item: typeof navItems[0];
  index: number;
  isActive: boolean;
  onClose: () => void;
  firstRef?: React.Ref<HTMLAnchorElement>;
  reducedMotion: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 400, damping: 30 };
  const x = useSpring(0, springConfig);

  useEffect(() => {
    if (reducedMotion) return;
    x.set(isHovered ? 6 : 0);
  }, [isHovered, x, reducedMotion]);

  const itemTransition = reducedMotion
    ? { duration: 0.1 }
    : { type: "spring", stiffness: 300, damping: 30, delay: index * 0.03 };

  return (
    <motion.li
      initial={{ opacity: 0, x: reducedMotion ? 0 : -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reducedMotion ? 0 : -4 }}
      transition={itemTransition}
    >
      <Link
        ref={index === 0 ? firstRef : undefined}
        href={item.href}
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-3 py-2.5"
      >
        {/* Index number */}
        <span className="w-5 font-mono text-[10px] tabular-nums text-foreground/30">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Label */}
        <motion.span
          className={`relative text-[15px] font-medium tracking-tight ${
            isActive ? "text-foreground" : "text-foreground/60"
          }`}
          style={reducedMotion ? {} : { x }}
        >
          {item.label}
        </motion.span>

        {/* Playful aside - appears on hover */}
        <motion.span
          className="ml-1 text-[11px] italic text-foreground/25"
          initial={{ opacity: 0, x: -4 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : -4,
          }}
          transition={{ duration: 0.15 }}
        >
          {item.aside}
        </motion.span>

        {/* Active indicator */}
        {isActive && (
          <motion.span
            layoutId="active"
            className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-foreground"
            transition={reducedMotion ? { duration: 0.1 } : { type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.li>
  );
}

export function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

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
      setTimeout(() => firstLinkRef.current?.focus(), 200);
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
          className="fixed inset-0 z-40 flex items-start justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop - click to close */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="relative z-10 flex h-full w-72 flex-col justify-center overflow-hidden"
            initial={{ x: reducedMotion ? 0 : "100%", opacity: reducedMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reducedMotion ? 0 : "100%", opacity: reducedMotion ? 0 : 1 }}
            transition={reducedMotion ? { duration: 0.15 } : { type: "spring", stiffness: 400, damping: 40 }}
          >
            {/* Glassy background with blur */}
            <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl backdrop-saturate-150" />

            {/* Border */}
            <div className="absolute inset-y-0 left-0 w-px bg-foreground/10" />

            {/* Content */}
            <nav
              className="relative px-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <motion.ul className="flex flex-col gap-0.5">
                {navItems.map((item, index) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    index={index}
                    isActive={isActive(item.href)}
                    onClose={onClose}
                    firstRef={index === 0 ? firstLinkRef : undefined}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </motion.ul>

              {/* Footer */}
              <motion.div
                className="mt-10 border-t border-foreground/[0.06] pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-[11px] italic text-foreground/20">
                  press esc to return to your regularly scheduled programming
                </p>
              </motion.div>
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
