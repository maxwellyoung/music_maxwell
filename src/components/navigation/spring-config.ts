export const springs = {
  navigation: { type: "spring" as const, stiffness: 400, damping: 40 },
  hover: { type: "spring" as const, stiffness: 500, damping: 30 },
  micro: { type: "spring" as const, stiffness: 700, damping: 35 },
  stagger: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ...springs.navigation,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ...springs.navigation,
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};
