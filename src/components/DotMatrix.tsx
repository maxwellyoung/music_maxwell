"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/DotMatrix.module.css";

// Define the precise pattern for "Freewheelin by Maxwell Young releases June 7"
const pattern = [
  // Add the indices for the precise pattern here
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15, // Example for "F"
  // Continue for the rest of the phrase
];

const DotMatrix: React.FC = () => {
  const [dots, setDots] = useState<boolean[]>(Array(2500).fill(false));
  const [revealed, setRevealed] = useState<boolean>(false);

  useEffect(() => {
    if (revealed) {
      setDots((prevDots) => {
        const newDots = [...prevDots];
        pattern.forEach((index) => {
          newDots[index] = true;
        });
        return newDots;
      });
    }
  }, [revealed]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRevealed(true);
    }, 3000); // 3 seconds delay before revealing the pattern

    return () => clearTimeout(timeout);
  }, []);

  const handleMouseOver = (index: number) => {
    if (!revealed) {
      setDots((prevDots) => {
        const newDots = [...prevDots];
        newDots[index] = true;
        return newDots;
      });

      if (dots.filter(Boolean).length >= 2000) {
        // Adjust threshold as needed
        setRevealed(true);
      }
    }
  };

  return (
    <div className={styles["dot-matrix-container"]}>
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          className={`${styles.dot} ${dot ? styles.active : ""}`}
          onMouseOver={() => handleMouseOver(index)}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: dot ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
      ))}
      {revealed && (
        <div className={`${styles.cta} ${styles.revealed}`}>
          <p>Freewheelin by Maxwell Young releases June 7</p>
          <button className={styles["pre-save-button"]}>Pre-Save</button>
        </div>
      )}
    </div>
  );
};

export default DotMatrix;
