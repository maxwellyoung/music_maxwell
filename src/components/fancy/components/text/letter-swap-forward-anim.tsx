import { motion } from "framer-motion";
import { useMemo } from "react";

interface LetterSwapForwardProps {
  label: string;
  staggerFrom?: "start" | "end" | "center";
  reverse?: boolean;
  className?: string;
}

export default function LetterSwapForward({
  label,
  staggerFrom = "start",
  reverse = false,
  className = "",
}: LetterSwapForwardProps) {
  const letters = useMemo(() => {
    const chars = label.split("");
    const len = chars.length;

    return chars.map((char, i) => {
      let delay = 0;

      switch (staggerFrom) {
        case "center":
          delay = Math.abs(i - len / 2) * 0.05;
          break;
        case "end":
          delay = (len - i) * 0.05;
          break;
        default:
          delay = i * 0.05;
      }

      if (reverse) delay = (len - 1) * 0.05 - delay;

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
            duration: 0.4,
            delay,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}
