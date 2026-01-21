"use client";

import { motion, useReducedMotion } from "framer-motion";

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
  const reducedMotion = useReducedMotion() ?? false;
  const targetOpacity = isOpen ? 0 : opacity;

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
      animate={{
        opacity: targetOpacity,
        scale: isOpen ? (reducedMotion ? 1 : 0.9) : 1,
      }}
      whileHover={reducedMotion ? {} : { scale: 1.04 }}
      whileTap={reducedMotion ? {} : { scale: 0.96 }}
      transition={reducedMotion ? { duration: 0.15 } : { type: "spring", stiffness: 400, damping: 25 }}
      aria-label="Open navigation"
      aria-expanded={isOpen}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-background/70 shadow-lg backdrop-blur-xl backdrop-saturate-150">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-foreground/70"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="11" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
      </span>
    </motion.button>
  );
}
