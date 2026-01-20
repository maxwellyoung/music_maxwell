"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function NavigationSignature() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-30 flex items-center justify-center py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Link
        href="/"
        className="transition-opacity hover:opacity-70"
        aria-label="Maxwell Young - Home"
      >
        <Image
          src="/icons/maxwellyoung.svg"
          alt="Maxwell Young"
          width={100}
          height={28}
          className="h-7 w-auto opacity-60"
          priority
        />
      </Link>
    </motion.header>
  );
}
