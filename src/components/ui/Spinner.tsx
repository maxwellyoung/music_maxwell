import { motion } from "framer-motion";

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-t-2 border-primary"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  );
}
