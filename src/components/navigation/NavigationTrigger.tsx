"use client";

import { motion, useReducedMotion } from "framer-motion";
import { springs } from "./spring-config";

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
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background/90 shadow-lg backdrop-blur-md transition-colors hover:bg-accent/10"
      style={{ opacity }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isOpen ? 0.9 : 1,
        opacity: opacity,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springs.hover}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
    >
      {/* Breathing pulse ring - only when closed and motion allowed */}
      {!isOpen && !prefersReducedMotion && (
        <motion.span
          className="absolute inset-0 rounded-full border border-foreground/20"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Icon: morphing hamburger/close */}
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
      >
        <motion.line
          x1="4"
          y1="8"
          x2="20"
          y2="8"
          animate={{
            rotate: isOpen ? 45 : 0,
            x1: isOpen ? 6 : 4,
            y1: isOpen ? 6 : 8,
            x2: isOpen ? 18 : 20,
            y2: isOpen ? 18 : 8,
          }}
          transition={springs.micro}
        />
        <motion.line
          x1="4"
          y1="16"
          x2="20"
          y2="16"
          animate={{
            rotate: isOpen ? -45 : 0,
            x1: isOpen ? 6 : 4,
            y1: isOpen ? 18 : 16,
            x2: isOpen ? 18 : 20,
            y2: isOpen ? 6 : 16,
          }}
          transition={springs.micro}
        />
      </motion.svg>
    </motion.button>
  );
}
