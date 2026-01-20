"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
}

export function TimelineIcon({ className }: IconProps) {
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
      {/* Spiral/timeline */}
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </motion.svg>
  );
}
