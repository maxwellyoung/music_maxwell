"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, useRef, useState } from "react";
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

function NavItem({
  item,
  index,
  isActive,
  onClose,
  firstRef
}: {
  item: typeof navItems[0];
  index: number;
  isActive: boolean;
  onClose: () => void;
  firstRef?: React.RefObject<HTMLAnchorElement>;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 400, damping: 30 };
  const x = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    x.set(isHovered ? 4 : 0);
    scale.set(isHovered ? 1.02 : 1);
  }, [isHovered, x, scale]);

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -4 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.03,
      }}
    >
      <Link
        ref={index === 0 ? firstRef : undefined}
        href={item.href}
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-3 py-2"
      >
        {/* Index number */}
        <span
          className="w-5 font-mono text-[10px] tabular-nums"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Label */}
        <motion.span
          className="relative text-[15px] font-normal tracking-[-0.01em]"
          style={{
            x,
            scale,
            color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {item.label}
        </motion.span>

        {/* Active indicator */}
        {isActive && (
          <motion.span
            layoutId="active"
            className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-white"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.li>
  );
}

export function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const mouseY = useMotionValue(0);
  const backgroundY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height;
    mouseY.set(y);
  }, [mouseY]);

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
          onMouseMove={handleMouseMove}
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            {/* Gradient background - responds subtly to mouse */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom,
                  rgba(20, 20, 22, 0.98) 0%,
                  rgba(25, 25, 30, 0.98) 50%,
                  rgba(20, 20, 22, 0.98) 100%
                )`,
                backdropFilter: "blur(40px)",
              }}
            />

            {/* Subtle color accent - Rothko energy */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(ellipse at 50% var(--y, 50%), rgba(60, 60, 80, 0.4) 0%, transparent 70%)`,
              }}
            />

            {/* Border */}
            <div className="absolute inset-y-0 left-0 w-px bg-white/[0.06]" />

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
                  />
                ))}
              </motion.ul>

              {/* Footer */}
              <motion.div
                className="mt-12 border-t border-white/[0.06] pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  Esc to close
                </p>
              </motion.div>
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
