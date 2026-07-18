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
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "13%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.09]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-svh overflow-hidden bg-[#11100f] text-white"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src="/artworks/SneakinDrinksIntoBars.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[61%_50%] sm:object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,.92)_0%,rgba(10,9,8,.72)_38%,rgba(10,9,8,.14)_78%),linear-gradient(0deg,rgba(10,9,8,.72)_0%,transparent_42%)]" />
      <div className="absolute inset-0 bg-[url('/grain.jpg')] bg-cover opacity-[0.08] mix-blend-soft-light" />

      <motion.div
        className="relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col justify-end px-5 pb-7 pt-28 sm:px-8 sm:pb-10 lg:px-12"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
          className="max-w-6xl"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-white/64 sm:text-xs"
          >
            New single · out now
          </motion.p>
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mb-0 max-w-[11ch] text-[clamp(4rem,12vw,10.5rem)] font-bold leading-[0.76] tracking-[-0.065em] text-white"
          >
            Sneakin Drinks Into Bars
          </motion.h1>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-col gap-6 sm:mt-9 sm:flex-row sm:items-end sm:justify-between"
          >
            <p className="font-reenie max-w-xl text-3xl leading-[0.9] text-white/78 sm:text-4xl">
              bar lights / field smoke / highlights
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/sneakin"
                className="group inline-flex min-h-12 items-center gap-3 border-b border-white pb-1 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#ff5f87] hover:text-[#ff8eaa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Enter the release
                <ArrowDownRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="mt-10 flex items-end justify-between border-t border-white/25 pt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/52"
        >
          <span>Maxwell Young · Aotearoa</span>
          <a
            href="#archive"
            className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Archive ↓
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
