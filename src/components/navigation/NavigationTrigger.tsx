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
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white mix-blend-difference"
      style={{ opacity: isOpen ? 0 : opacity }}
      initial={{ scale: 0 }}
      animate={{ scale: isOpen ? 0 : 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      aria-label="Open navigation"
      aria-expanded={isOpen}
    >
      <span className="text-xs font-medium tracking-widest text-white mix-blend-difference">
        MENU
      </span>
    </motion.button>
  );
}
