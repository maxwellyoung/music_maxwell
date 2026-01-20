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
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-2xl transition-colors hover:bg-foreground/90"
      style={{ opacity }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: opacity,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={springs.hover}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
    >
      {/* Breathing pulse ring - only when closed and motion allowed */}
      {!isOpen && !prefersReducedMotion && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-foreground"
            animate={{
              scale: [1, 1.4, 1.4],
              opacity: [0.4, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-foreground"
            animate={{
              scale: [1, 1.4, 1.4],
              opacity: [0.4, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Icon: morphing dots to X */}
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="relative z-10"
      >
        {isOpen ? (
          // X icon when open
          <>
            <motion.rect
              x="4"
              y="11"
              width="16"
              height="2"
              rx="1"
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
              style={{ originX: "12px", originY: "12px" }}
              transition={springs.micro}
            />
            <motion.rect
              x="4"
              y="11"
              width="16"
              height="2"
              rx="1"
              initial={{ rotate: 0 }}
              animate={{ rotate: -45 }}
              style={{ originX: "12px", originY: "12px" }}
              transition={springs.micro}
            />
          </>
        ) : (
          // Three dots when closed
          <>
            <motion.circle
              cx="6"
              cy="12"
              r="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...springs.micro, delay: 0 }}
            />
            <motion.circle
              cx="12"
              cy="12"
              r="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...springs.micro, delay: 0.05 }}
            />
            <motion.circle
              cx="18"
              cy="12"
              r="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...springs.micro, delay: 0.1 }}
            />
          </>
        )}
      </motion.svg>
    </motion.button>
  );
}
