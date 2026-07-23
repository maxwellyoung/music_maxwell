"use client";

import Image from "next/image";
import styles from "./OneKissHeroVisual.module.css";

type OneKissHeroVisualProps = {
  active: boolean;
  progress: number;
  reduceMotion: boolean;
};

const horizontalFeather =
  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,.38) 9%, #000 19%, #000 82%, rgba(0,0,0,.42) 92%, transparent 100%)";
const verticalFeather =
  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.42) 9%, #000 18%, #000 83%, rgba(0,0,0,.38) 93%, transparent 100%)";

export default function OneKissHeroVisual({
  active,
  progress,
  reduceMotion,
}: OneKissHeroVisualProps) {
  const canMove = active && !reduceMotion;

  return (
    <div
      className={`${styles.visual} ${canMove ? styles.visualActive : ""} absolute inset-0 overflow-hidden`}
      style={{
        maskImage: horizontalFeather,
        WebkitMaskImage: horizontalFeather,
      }}
      role="img"
      aria-label="The 1kiss cover artwork dissolving into the signal field"
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage: verticalFeather,
          WebkitMaskImage: verticalFeather,
        }}
      >
        <Image
          src="/artworks/1kiss.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 64vw, 104vw"
          className="object-cover opacity-[.58] mix-blend-screen"
          style={{
            filter: "contrast(1.06) saturate(1.14)",
            objectPosition: "50% 48%",
          }}
        />

        <div
          className={`${styles.chromatic} ${canMove ? styles.chromaticActive : ""} absolute inset-0 mix-blend-screen`}
          aria-hidden="true"
        >
          <Image
            src="/artworks/1kiss.jpg"
            alt=""
            fill
            sizes="(min-width: 640px) 64vw, 104vw"
            className="object-cover"
            style={{
              filter: "hue-rotate(44deg) saturate(1.45)",
              objectPosition: "50% 48%",
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-x-[6%] top-[4%] h-[92%]"
          aria-hidden="true"
        >
          <div
            className={`${styles.scanRunner} ${canMove ? styles.scanRunnerActive : ""} absolute inset-0`}
            style={{
              transform: `translate3d(0, ${progress * 100}%, 0)`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-20 -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,.12),transparent)] mix-blend-screen">
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/80 shadow-[0_0_16px_rgba(255,255,255,.72)]" />
              <div className="absolute inset-x-[9%] top-[calc(50%+5px)] h-px bg-[#8ea6ff]/60" />
              <div className="absolute inset-x-[16%] top-[calc(50%-5px)] h-px bg-[#ff8eae]/45" />
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_38%_28%,rgba(255,255,255,.16),transparent_34%),linear-gradient(120deg,rgba(142,166,255,.07),transparent_42%,rgba(255,142,174,.07))] mix-blend-screen"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
