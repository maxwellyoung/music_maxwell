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
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,12,.9)_0%,rgba(5,7,12,.64)_48%,rgba(5,7,12,.18)_100%)]" />

      <motion.div
        className="absolute inset-x-0 top-[31%] h-[38vh] overflow-hidden border-y-[6px] border-[#ff40aa] sm:left-[42%] sm:right-0 sm:top-[20%] sm:h-[57vh] sm:border-y-0 sm:border-l-[7px] sm:border-r-[7px] sm:border-l-[#ff40aa] sm:border-r-[#d8ff30]"
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

      <div className="absolute left-0 top-[29.8%] h-2 w-[66%] bg-[#32d8ff] sm:left-[38%] sm:top-[17.5%] sm:h-3 sm:w-[45%]" />
      <div className="absolute bottom-[20%] right-0 h-2 w-[47%] bg-[#d8ff30] sm:bottom-[18%] sm:w-[31%]" />

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
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#b7c8eb] sm:text-xs">
            Maxwell Young / new single / 24.07.26
          </p>
          <h1 className="mb-0 mt-3 text-[clamp(5.8rem,16vw,14rem)] font-bold leading-[0.72] tracking-[-0.085em] text-[#f5f8ff]">
            1kiss
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-auto grid gap-7 pt-[48vh] sm:max-w-[38%] sm:pt-0"
        >
          <p className="max-w-[13ch] text-4xl font-bold uppercase leading-[0.84] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            your hips
            <br />
            our lips
            <br />
            one kiss
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/1kiss"
              className="group inline-flex min-h-12 items-center gap-3 border-b border-[#f5f8ff] pb-1 text-xs font-bold uppercase tracking-[0.18em] transition hover:border-[#32d8ff] hover:text-[#32d8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Enter the release
              <ArrowDownRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                aria-hidden="true"
              />
            </Link>
            <span className="bg-[#d8ff30] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#07090d]">
              out Friday
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
