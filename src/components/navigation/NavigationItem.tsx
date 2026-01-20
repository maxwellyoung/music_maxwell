"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { springs, itemVariants } from "./spring-config";
import type { ReactNode } from "react";

interface NavigationItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick?: () => void;
  layoutId?: string;
}

export function NavigationItem({
  href,
  label,
  icon,
  isActive,
  onClick,
  layoutId = "nav-indicator",
}: NavigationItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative"
    >
      <Link
        href={href}
        onClick={onClick}
        className="group relative flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-colors hover:bg-accent/10"
      >
        {/* Icon */}
        <motion.span
          className="flex h-10 w-10 items-center justify-center text-foreground/70 transition-colors group-hover:text-foreground"
          whileHover={{ scale: 1.1 }}
          transition={springs.micro}
        >
          {icon}
        </motion.span>

        {/* Label */}
        <span className="text-foreground/80 transition-colors group-hover:text-foreground">
          {label}
        </span>

        {/* Active indicator - animated underline */}
        {isActive && (
          <motion.div
            layoutId={layoutId}
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-foreground"
            transition={springs.navigation}
          />
        )}
      </Link>
    </motion.div>
  );
}
