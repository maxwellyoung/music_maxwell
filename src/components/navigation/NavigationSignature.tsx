"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { springs } from "./spring-config";

export function NavigationSignature() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-30 flex items-center justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.navigation}
    >
      {/* Gradient fade backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent" />

      <Link
        href="/"
        className="relative py-4 transition-opacity hover:opacity-80"
        aria-label="Maxwell Young - Home"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={springs.micro}
        >
          <Image
            src="/icons/maxwellyoung.svg"
            alt="Maxwell Young"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </motion.div>
      </Link>
    </motion.header>
  );
}
