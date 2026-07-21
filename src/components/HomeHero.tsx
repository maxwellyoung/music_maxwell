"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const frameY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-svh overflow-hidden bg-[#05070c] text-[#f5f8ff]"
    >
      <Image
        src="/1kiss/signal-bloom-blue.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,.9)_0%,rgba(5,7,12,.64)_48%,rgba(5,7,12,.18)_100%)]" />

      <motion.div
        className="absolute inset-x-0 top-[31%] h-[38vh] overflow-hidden border-y border-white/20 sm:left-[42%] sm:right-0 sm:top-[20%] sm:h-[57vh] sm:border"
        style={{ y: frameY }}
      >
        <Image
          src="/1kiss/still-hook.jpg"
          alt="Maxwell Young performing 1kiss"
          fill
          priority
          sizes="(min-width: 640px) 58vw, 100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <motion.div
        className="relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-between px-5 pb-7 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#b7c8eb] sm:text-xs">
            Maxwell Young / 24.07.26
          </p>
          <h1 className="font-pixel-line mb-0 mt-3 text-[clamp(5.5rem,14vw,11rem)] leading-[0.74] tracking-[-0.05em] text-[#f5f8ff]">
            1kiss
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-auto grid gap-7 pt-[48vh] sm:max-w-[38%] sm:pt-0"
        >
          <p className="font-pixel-line max-w-[13ch] text-3xl uppercase leading-[0.88] sm:text-4xl lg:text-5xl">
            your hips
            <br />
            our lips
            <br />
            one kiss
          </p>
          <div className="flex items-center">
            <Link
              href="/1kiss"
              className="font-pixel-dot group inline-flex min-h-12 items-center gap-3 border-b border-[#f5f8ff] pb-1 text-xs uppercase tracking-[0.1em] transition hover:border-[#8ea6ff] hover:text-[#8ea6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              enter 1kiss
              <ArrowDownRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
