import React, { useState } from "react";
import { motion } from "framer-motion";
import "./DotMatrix.css";

const DotMatrix: React.FC = () => {
  const [dots, setDots] = useState<boolean[]>(Array(100).fill(false));
  const [revealed, setRevealed] = useState<boolean>(false);

  const handleMouseOver = (index: number) => {
    if (!revealed) {
      setDots((prevDots) => {
        const newDots = [...prevDots];
        newDots[index] = true;
        return newDots;
      });

      if (dots.filter(Boolean).length >= 80) {
        // Adjust the threshold as needed
        setRevealed(true);
      }
    }
  };

  return (
    <div className="dot-matrix-container">
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          className={`dot ${dot ? "active" : ""}`}
          onMouseOver={() => handleMouseOver(index)}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: dot ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
      ))}
      {revealed && (
        <div className="cta">
          <p>Freewheelin by Maxwell Young releases June 7</p>
          <button className="pre-save-button">Pre-Save</button>
        </div>
      )}
    </div>
  );
};

export default DotMatrix;
