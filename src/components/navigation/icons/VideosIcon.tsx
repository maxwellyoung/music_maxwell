"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
}

export function VideosIcon({ className }: IconProps) {
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
      {/* Film frame */}
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="7" y1="2" x2="7" y2="6" />
      <line x1="17" y1="2" x2="17" y2="6" />
      <line x1="7" y1="18" x2="7" y2="22" />
      <line x1="17" y1="18" x2="17" y2="22" />
      {/* Play triangle */}
      <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
    </motion.svg>
  );
}
