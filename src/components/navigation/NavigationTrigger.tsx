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
      className="fixed bottom-6 right-6 z-50"
      style={{ opacity: isOpen ? 0 : opacity }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isOpen ? 0 : opacity,
        scale: isOpen ? 0.9 : 1,
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label="Open navigation"
      aria-expanded={isOpen}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <rect x="1" y="4" width="14" height="1.5" rx="0.75" fill="currentColor" />
          <rect x="1" y="10.5" width="14" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </span>
    </motion.button>
  );
}
