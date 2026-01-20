"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { springs } from "./spring-config";

export function NavigationSignature() {
  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-30 flex items-center justify-center py-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.navigation}
    >
      <Link
        href="/"
        className="transition-opacity hover:opacity-80"
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
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </motion.div>
      </Link>
    </motion.header>
  );
}
