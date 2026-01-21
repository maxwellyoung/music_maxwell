"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const quotes = [
  { text: "emotionally-driven alt-pop", source: "Complex" },
  { text: "disassociation pop", source: "Sniffers" },
  { text: "somewhere between a bad dream and a shoplifting spree", source: "" },
  { text: "what I've grown to be good at is being honest", source: "" },
];

export function FloatingQuotes() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.07]">
      {quotes.map((quote, i) => (
        <motion.div
          key={i}
          className="absolute whitespace-nowrap text-xs font-light italic tracking-wide text-foreground sm:text-sm"
          initial={{
            x: `${15 + (i * 20)}%`,
            y: `${20 + (i * 18)}%`,
          }}
          animate={{
            x: [`${15 + (i * 20)}%`, `${18 + (i * 20)}%`, `${15 + (i * 20)}%`],
            y: [`${20 + (i * 18)}%`, `${22 + (i * 18)}%`, `${20 + (i * 18)}%`],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          &ldquo;{quote.text}&rdquo;
          {quote.source && <span className="ml-2 not-italic opacity-50">— {quote.source}</span>}
        </motion.div>
      ))}
    </div>
  );
}
