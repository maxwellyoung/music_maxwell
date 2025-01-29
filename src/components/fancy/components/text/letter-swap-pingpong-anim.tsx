import { motion } from "framer-motion";
import { useMemo } from "react";

interface LetterSwapPingPongProps {
  label: string;
  staggerFrom?: "start" | "end" | "center" | "last";
  reverse?: boolean;
  className?: string;
}

export default function LetterSwapPingPong({
  label,
  staggerFrom = "start",
  reverse = false,
  className = "",
}: LetterSwapPingPongProps) {
  const letters = useMemo(() => {
    const chars = label.split("");
    const len = chars.length;
    const staggerDelay = 0.1;

    return chars.map((char, i) => {
      let delay = 0;

      switch (staggerFrom) {
        case "center":
          delay = Math.abs(i - len / 2) * staggerDelay;
          break;
        case "end":
          delay = (len - i) * staggerDelay;
          break;
        case "last":
          delay = Math.abs(len - 1 - i) * staggerDelay;
          break;
        default:
          delay = i * staggerDelay;
      }

      if (reverse) delay = (len - 1) * staggerDelay - delay;

      return { char, delay };
    });
  }, [label, staggerFrom, reverse]);

  return (
    <div className={className}>
      {letters.map(({ char, delay }, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.34, 1.56, 0.64, 1], // Bouncy effect
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}
