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
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,.94)_0%,rgba(5,7,12,.7)_48%,rgba(5,7,12,.3)_100%)]" />

      {/* Single magenta rule is the only accent: one release colour, no stray bars. */}
      <motion.div
        className="absolute inset-x-0 top-[31%] h-[38vh] overflow-hidden border-t-[6px] border-[#ff40aa] sm:left-[44%] sm:right-0 sm:top-[20%] sm:h-[57vh] sm:border-l-[6px] sm:border-t-0"
        style={{ y: frameY }}
      >
        <Image
          src="/1kiss/still-hook.jpg"
          alt="Maxwell Young performing 1kiss"
          fill
          priority
          sizes="(min-width: 640px) 56vw, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,.35)_0%,transparent_40%)]" />
      </motion.div>

      <motion.div
        className="relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-24 sm:px-8 sm:pb-12 sm:pt-28 lg:px-12"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="font-pixel-dot text-[10px] uppercase tracking-[0.16em] text-[#b7c8eb] sm:text-xs">
            New single · out now
          </p>
          <h1 className="font-pixel-line mb-0 mt-3 text-[clamp(5.8rem,16vw,14rem)] leading-[0.72] tracking-[-0.055em] text-[#f5f8ff]">
            1kiss
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-auto grid gap-8 pt-[48vh] sm:max-w-[38%] sm:pt-0"
        >
          <p className="font-pixel-line max-w-[13ch] text-3xl uppercase leading-[0.86] tracking-[-0.025em] text-[#f5f8ff]/85 sm:text-4xl lg:text-5xl">
            your hips
            <br />
            our lips
            <br />
            one kiss
          </p>
          <Link
            href="/1kiss"
            className="font-pixel-dot group inline-flex min-h-12 w-fit items-center gap-3 border-b border-[#f5f8ff]/70 pb-1 text-xs uppercase tracking-[0.12em] transition hover:border-[#ff40aa] hover:text-[#ff40aa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Enter the release
            <ArrowDownRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
