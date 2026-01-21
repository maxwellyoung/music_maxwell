"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function NavigationSignature() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-30 flex items-center justify-center py-5"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Link
        href="/"
        className="group relative"
        aria-label="Maxwell Young - Home"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Image
            src="/icons/maxwellyoung.svg"
            alt="Maxwell Young"
            width={140}
            height={40}
            className="h-10 w-auto opacity-80 transition-opacity group-hover:opacity-100"
            priority
          />
        </motion.div>
      </Link>
    </motion.header>
  );
}
