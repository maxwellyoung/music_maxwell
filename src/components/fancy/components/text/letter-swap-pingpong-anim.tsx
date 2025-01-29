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

    return chars.map((char, i) => {
      let delay = 0;

      switch (staggerFrom) {
        case "center":
          delay = Math.abs(i - len / 2) * 0.05;
          break;
        case "end":
          delay = (len - i) * 0.05;
          break;
        case "last":
          delay = Math.abs(len - 1 - i) * 0.05;
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
