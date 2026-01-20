"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
}

export function ShowsIcon({ className }: IconProps) {
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
      {/* Spotlight */}
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <circle cx="12" cy="12" r="4" />
      {/* Light rays */}
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </motion.svg>
  );
}
