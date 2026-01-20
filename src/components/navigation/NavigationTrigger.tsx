"use client";

import { motion } from "framer-motion";

interface NavigationTriggerProps {
  onClick: () => void;
  isOpen: boolean;
  opacity?: number;
}

export function NavigationTrigger({
  onClick,
  isOpen,
  opacity = 1,
}: NavigationTriggerProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50"
      style={{ opacity: isOpen ? 0 : opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 0 : opacity }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label="Open navigation"
      aria-expanded={isOpen}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-sm">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-white/80"
        >
          <circle cx="4" cy="9" r="1.5" fill="currentColor" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
          <circle cx="14" cy="9" r="1.5" fill="currentColor" />
        </svg>
      </span>
    </motion.button>
  );
}
