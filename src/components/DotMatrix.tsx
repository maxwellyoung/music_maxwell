"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "../styles/DotMatrix.module.css";

interface Dot {
  active: boolean;
  color: string;
}

// Generate an array of random Pantone colors
const getRandomColor = (): string => {
  const colors = [
    "#F0F8FF",
    "#FAEBD7",
    "#00FFFF",
    "#7FFFD4",
    "#F0FFFF",
    "#F5F5DC",
    "#FFE4C4",
    "#000000",
    "#FFEBCD",
    "#0000FF",
    "#8A2BE2",
    "#A52A2A",
    "#DEB887",
    "#5F9EA0",
    "#7FFF00",
    "#D2691E",
    "#FF7F50",
    "#6495ED",
    "#FFF8DC",
    "#DC143C",
    "#00FFFF",
    "#00008B",
    "#008B8B",
    "#B8860B",
    "#A9A9A9",
    "#006400",
    "#BDB76B",
    "#8B008B",
    "#556B2F",
    "#FF8C00",
    "#9932CC",
    "#8B0000",
    "#E9967A",
    "#8FBC8F",
    "#483D8B",
    "#2F4F4F",
    "#00CED1",
    "#9400D3",
    "#FF1493",
    "#00BFFF",
    "#696969",
    "#1E90FF",
    "#B22222",
    "#FFFAF0",
    "#228B22",
    "#FF00FF",
    "#DCDCDC",
    "#F8F8FF",
    "#FFD700",
    "#DAA520",
    "#808080",
    "#008000",
    "#ADFF2F",
    "#F0FFF0",
    "#FF69B4",
    "#CD5C5C",
    "#4B0082",
    "#FFFFF0",
    "#F0E68C",
    "#E6E6FA",
    "#FFF0F5",
    "#7CFC00",
    "#FFFACD",
    "#ADD8E6",
    "#F08080",
    "#E0FFFF",
    "#FAFAD2",
    "#D3D3D3",
    "#90EE90",
    "#FFB6C1",
    "#FFA07A",
    "#20B2AA",
    "#87CEFA",
    "#778899",
    "#B0C4DE",
    "#FFFFE0",
    "#00FF00",
    "#32CD32",
    "#FAF0E6",
    "#FF00FF",
    "#800000",
    "#66CDAA",
    "#0000CD",
    "#BA55D3",
    "#9370DB",
    "#3CB371",
    "#7B68EE",
    "#00FA9A",
    "#48D1CC",
    "#C71585",
    "#191970",
    "#F5FFFA",
    "#FFE4E1",
    "#FFE4B5",
    "#FFDEAD",
    "#000080",
    "#FDF5E6",
    "#808000",
    "#6B8E23",
    "#FFA500",
    "#FF4500",
    "#DA70D6",
    "#EEE8AA",
    "#98FB98",
    "#AFEEEE",
    "#DB7093",
    "#FFEFD5",
    "#FFDAB9",
    "#CD853F",
    "#FFC0CB",
    "#DDA0DD",
    "#B0E0E6",
    "#800080",
    "#FF0000",
    "#BC8F8F",
    "#4169E1",
    "#8B4513",
    "#FA8072",
    "#FAA460",
    "#2E8B57",
    "#FFF5EE",
    "#A0522D",
    "#C0C0C0",
    "#87CEEB",
    "#6A5ACD",
    "#708090",
    "#FFFAFA",
    "#00FF7F",
    "#4682B4",
    "#D2B48C",
    "#008080",
    "#D8BFD8",
    "#FF6347",
    "#40E0D0",
    "#EE82EE",
    "#F5DEB3",
    "#FFFFFF",
    "#F5F5F5",
    "#FFFF00",
    "#9ACD32",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const initializeDots = (numDots: number): Dot[] => {
  return Array.from({ length: numDots }, () => ({
    active: false,
    color: getRandomColor(),
  }));
};

const DotMatrix: React.FC = () => {
  const [dots, setDots] = useState<Dot[]>(initializeDots(2500));
  const [visibleDots, setVisibleDots] = useState<number>(2500);
  const controls = useAnimation();

  useEffect(() => {
    const timeouts = dots.map(
      (_, index) =>
        setTimeout(() => {
          setDots((prevDots) => {
            const newDots: Dot[] = [...prevDots];
            if (!newDots[index].active) {
              newDots[index] = { ...newDots[index], active: true };
              setVisibleDots((prev) => prev - 1);
            }
            return newDots;
          });
        }, Math.random() * 10000), // Random delay up to 10 seconds
    );

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  useEffect(() => {
    if (visibleDots === 0) {
      controls.start({ opacity: 1, transition: { duration: 2 } });
    }
  }, [visibleDots, controls]);

  const handleMouseOver = (index: number) => {
    setDots((prevDots) => {
      const newDots: Dot[] = [...prevDots];
      if (!newDots[index].active) {
        newDots[index] = { ...newDots[index], active: true };
        setVisibleDots((prev) => prev - 1);
      }
      return newDots;
    });
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <motion.div
        className={styles["dot-matrix-container"]}
        initial={{ opacity: 0 }}
        animate={controls}
      >
        {dots.map((dot, index) => (
          <motion.div
            key={index}
            className={`${styles.dot} ${dot.active ? styles.active : ""}`}
            onMouseOver={() => handleMouseOver(index)}
            style={{ backgroundColor: dot.color }}
            initial={{ opacity: 1 }}
            animate={{ opacity: dot.active ? 0 : 1 }}
            transition={{ duration: 0.5 }} // Speed up the transition
          />
        ))}
      </motion.div>
      <motion.div
        className={styles.cta}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <p className={styles.text}>
          Freewheelin by Maxwell Young releases June 7
        </p>
        <a
          href="https://music.drm.co.nz/freewheelin"
          className={styles["pre-save-button"]}
        >
          Pre-Save
        </a>
      </motion.div>
      <motion.div
        className={styles["grain-overlay"]}
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 2 }}
      />
    </motion.div>
  );
};

export default DotMatrix;
