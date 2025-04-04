"use client";

import { useEffect, useRef } from "react";
import { useAnimationFrame } from "framer-motion";
import LetterSwapPingPong from "../fancy/components/text/letter-swap-pingpong-anim";
import Image from "next/image";

export default function CTASection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2; // Double the height for smoother transitions
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useAnimationFrame((t) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    const drawGradient = (
      x: number,
      y: number,
      radius: number,
      hue: number,
    ) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const numGradients = 5;
    for (let i = 0; i < numGradients; i++) {
      const x =
        width *
        (0.2 + 0.6 * Math.sin(t / 1000 + (i * Math.PI * 2) / numGradients));
      const y =
        height *
        (0.2 + 0.6 * Math.cos(t / 1000 + (i * Math.PI * 2) / numGradients));
      const radius =
        Math.min(width, height) * (0.2 + 0.1 * Math.sin(t / 500 + i));
      const hue = (t / 50 + (i * 360) / numGradients) % 360;
      drawGradient(x, y, radius, hue);
    }

    // Add a gradient fade out at the bottom
    const fadeHeight = height * 0.3; // 30% of the height
    const fadeGradient = ctx.createLinearGradient(
      0,
      height - fadeHeight,
      0,
      height,
    );
    fadeGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    fadeGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = fadeGradient;
    ctx.fillRect(0, height - fadeHeight, width, fadeHeight);
  });

  return (
    <section className="relative min-h-screen w-full">
      {/* Canvas wrapper with fade out effect */}
      <div className="absolute inset-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute left-0 top-0 h-[200vh] w-full"
          style={{
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            zIndex: 0,
          }}
        />
        {/* Additional gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"
          style={{ zIndex: 1 }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center text-white">
        <div className="flex flex-col items-center space-y-4">

          <Image
            src="/IMG_2094.webp"
            alt="Maxwell Young"
            width={300}
            height={300}
            className="rotate-90 p-6"
          />
          <LetterSwapPingPong
            label="Maxwell Young album 2025w"
            staggerFrom="center"
            className="font-pantasia mb-12 max-w-2xl text-xl md:text-2xl"
          />
        </div>
      </div>
    </section>
  );
}
