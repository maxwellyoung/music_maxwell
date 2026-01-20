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
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center"
      style={{ opacity: isOpen ? 0 : opacity }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isOpen ? 0.8 : 1,
        opacity: isOpen ? 0 : opacity,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      aria-label="Open navigation"
      aria-expanded={isOpen}
    >
      {/* Circle with dot */}
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.button>
  );
}
