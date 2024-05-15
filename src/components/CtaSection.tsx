import React from "react";
import styles from "../styles/CtaSection.module.css";

const CtaSection: React.FC = () => {
  return (
    <div className={styles.ctaSection}>
      <h2>Freewheelin by Maxwell Young</h2>
      <p>Releases June 7th. Pre-save now!</p>
      <a
        href="https://music.drm.co.nz/freewheelin"
        className={styles.presaveButton}
      >
        Pre-save
      </a>
    </div>
  );
};

export default CtaSection;
