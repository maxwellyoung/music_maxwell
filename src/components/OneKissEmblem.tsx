"use client";

import { motion } from "framer-motion";

type OneKissEmblemProps = {
  active: boolean;
  progress: number;
  reduceMotion: boolean;
};

const TICK_COUNT = 18;

export default function OneKissEmblem({
  active,
  progress,
  reduceMotion,
}: OneKissEmblemProps) {
  const activeTicks = Math.round(progress * TICK_COUNT);

  return (
    <div
      className="relative h-full w-full"
      role="img"
      aria-label="A gold number one medal stamped with a kiss"
    >
      <div
        className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle,rgba(255,222,132,.17)_0%,rgba(142,166,255,.07)_38%,transparent_70%)]"
        aria-hidden="true"
      />
      <motion.svg
        viewBox="0 0 700 700"
        className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_24px_42px_rgba(0,0,0,.34)]"
        animate={
          active && !reduceMotion
            ? {
                rotate: [-2.5, -1.2, -3.1, -2.5],
                scale: [1, 1.018, 1.006, 1],
                y: [0, -5, 2, 0],
              }
            : { rotate: -2.5, scale: 1, y: 0 }
        }
        transition={
          active && !reduceMotion
            ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.25 }
        }
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="one-kiss-ribbon-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#cfdbff" />
            <stop offset=".45" stopColor="#617cd2" />
            <stop offset="1" stopColor="#172651" />
          </linearGradient>
          <linearGradient id="one-kiss-ribbon-rose" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd1d8" />
            <stop offset=".45" stopColor="#d86276" />
            <stop offset="1" stopColor="#651d38" />
          </linearGradient>
          <radialGradient id="one-kiss-gold" cx=".36" cy=".28" r=".78">
            <stop offset="0" stopColor="#fff8cf" />
            <stop offset=".26" stopColor="#f8d56f" />
            <stop offset=".62" stopColor="#b67922" />
            <stop offset=".82" stopColor="#f1c85b" />
            <stop offset="1" stopColor="#70430e" />
          </radialGradient>
          <linearGradient id="one-kiss-lip" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff7d91" />
            <stop offset=".42" stopColor="#e52c56" />
            <stop offset="1" stopColor="#7e102d" />
          </linearGradient>
        </defs>

        <path
          d="M236 31 343 34 315 285 196 293Z"
          fill="url(#one-kiss-ribbon-blue)"
          stroke="#dce5ff"
          strokeOpacity=".36"
          strokeWidth="2"
        />
        <path
          d="m464 31-107 3 28 251 119 8Z"
          fill="url(#one-kiss-ribbon-rose)"
          stroke="#ffe1e5"
          strokeOpacity=".34"
          strokeWidth="2"
        />
        <path
          d="m236 31 56 2-50 258-46 2Z"
          fill="#fff"
          fillOpacity=".11"
        />
        <path
          d="m464 31-56 2 50 258 46 2Z"
          fill="#fff"
          fillOpacity=".1"
        />

        {Array.from({ length: TICK_COUNT }, (_, index) => (
          <line
            key={index}
            x1="350"
            y1="72"
            x2="350"
            y2={index < activeTicks ? "99" : "88"}
            transform={`rotate(${index * (360 / TICK_COUNT)} 350 350)`}
            stroke={index < activeTicks ? "#fff2b7" : "#b7c8eb"}
            strokeOpacity={index < activeTicks ? ".94" : ".2"}
            strokeLinecap="round"
            strokeWidth={index < activeTicks ? "5" : "3"}
          />
        ))}

        <circle
          cx="350"
          cy="350"
          r="225"
          fill="#0b1024"
          fillOpacity=".34"
          stroke="#e8d18c"
          strokeOpacity=".34"
          strokeWidth="2"
        />
        <circle
          cx="350"
          cy="350"
          r="206"
          fill="url(#one-kiss-gold)"
          stroke="#fff0ad"
          strokeOpacity=".72"
          strokeWidth="5"
        />
        <circle
          cx="350"
          cy="350"
          r="175"
          fill="none"
          stroke="#6f4212"
          strokeOpacity=".48"
          strokeWidth="3"
        />
        <circle
          cx="350"
          cy="350"
          r="166"
          fill="none"
          stroke="#fff0ad"
          strokeDasharray="2 11"
          strokeLinecap="round"
          strokeOpacity=".72"
          strokeWidth="4"
        />

        <text
          x="340"
          y="474"
          fill="#744710"
          fillOpacity=".44"
          fontFamily="Georgia, Times New Roman, serif"
          fontSize="330"
          fontWeight="700"
          textAnchor="middle"
        >
          1
        </text>
        <text
          x="334"
          y="465"
          fill="#fff4bd"
          fontFamily="Georgia, Times New Roman, serif"
          fontSize="330"
          fontWeight="700"
          textAnchor="middle"
        >
          1
        </text>

        <g transform="translate(354 360) rotate(-13)">
          <motion.g
            initial={false}
            animate={
              active && !reduceMotion
                ? { opacity: [0.9, 1, 0.94], scale: [1, 1.035, 1] }
                : { opacity: 0.94, scale: 1 }
            }
            transition={
              active && !reduceMotion
                ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.2 }
            }
            style={{ transformOrigin: "125px 85px" }}
          >
            <path
              d="M0 70C34 19 78 16 121 47c39-38 91-35 129 19-50-4-89 6-125 17C91 75 53 65 0 70Z"
              fill="url(#one-kiss-lip)"
              stroke="#ffd5dc"
              strokeOpacity=".4"
              strokeWidth="2"
            />
            <path
              d="M0 70c44 8 83 9 125 13 42-9 83-17 125-17-29 72-77 106-126 107C73 171 28 137 0 70Z"
              fill="url(#one-kiss-lip)"
              stroke="#5e0923"
              strokeOpacity=".45"
              strokeWidth="2"
            />
            <path
              d="M20 76c72 14 139 15 211-3-60 31-144 36-211 3Z"
              fill="#57071f"
              fillOpacity=".74"
            />
            <path
              d="M48 54c30-24 55-24 72-2"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeOpacity=".34"
              strokeWidth="7"
            />
          </motion.g>
        </g>
      </motion.svg>
    </div>
  );
}
