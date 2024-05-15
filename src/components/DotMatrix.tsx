"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/DotMatrix.module.css";

// Empty star pattern
const starPattern = [];

const DotMatrix: React.FC = () => {
  const [dots, setDots] = useState<boolean[]>(Array(2500).fill(false));
  const [toggle, setToggle] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setToggle((prevToggle) => !prevToggle);
    }, 10000); // 10 seconds interval for color change

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDots((prevDots) => prevDots.map((dot) => !dot));
  }, [toggle]);

  const handleMouseOver = (index: number) => {
    setDots((prevDots) => {
      const newDots = [...prevDots];
      newDots[index] = !newDots[index];
      return newDots;
    });
  };

  return (
    <div className={styles.container}>
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
      </div>
      <div className={styles.cta}>
        <p className={styles.text}>
          Freewheelin by Maxwell Young releases June 7
        </p>
        <button className="cursor-pointer">
          <a
            href="https://music.drm.co.nz/freewheelin"
            className={styles["pre-save-button"]}
          >
            Pre-Save
          </a>
        </button>
      </div>
    </div>
  );
};

export default DotMatrix;
