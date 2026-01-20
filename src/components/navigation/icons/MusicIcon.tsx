"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
}

export function MusicIcon({ className }: IconProps) {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Vinyl record */}
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      {/* Grooves */}
      <circle cx="12" cy="12" r="6" strokeOpacity="0.4" />
    </motion.svg>
  );
}
