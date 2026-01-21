"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "~/lib/utils";

interface AlbumCardProps {
  title: string;
  artist: string;
  artwork: string;
  lyricSnippet?: string;
  onClick: () => void;
  priority?: boolean;
}

// Glare effect component - follows cursor position
function GlareEffect({
  glareX,
  glareY,
  isHovered,
}: {
  glareX: ReturnType<typeof useSpring>;
  glareY: ReturnType<typeof useSpring>;
  isHovered: boolean;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 transition-opacity duration-300"
      style={{
        opacity: isHovered ? 1 : 0,
        background: useTransform(
          [glareX, glareY],
          ([x, y]: number[]) =>
            `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`
        ),
      }}
    />
  );
}

export function AlbumCard({
  title,
  artist,
  artwork,
  lyricSnippet,
  onClick,
  priority = false,
}: AlbumCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Mouse position within card (0-1)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring config for smooth, physical feel
  const springConfig = { damping: 20, stiffness: 300 };

  // Transform mouse position to rotation (-15 to 15 degrees)
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [8, -8]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-8, 8]),
    springConfig
  );

  // Glare position
  const glareX = useSpring(
    useTransform(mouseX, [0, 1], [0, 100]),
    springConfig
  );
  const glareY = useSpring(
    useTransform(mouseY, [0, 1], [0, 100]),
    springConfig
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer perspective-1000"
      style={{ perspective: 1000 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative aspect-square overflow-hidden rounded-2xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Album artwork */}
        <div className="relative h-full w-full">
          <Image
            src={artwork}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            priority={priority}
            className={cn(
              "object-cover transition-all duration-500",
              imageLoaded ? "blur-0 scale-100" : "blur-xl scale-105",
              isHovered && "scale-105"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Dynamic glare effect */}
        <GlareEffect glareX={glareX} glareY={glareY} isHovered={isHovered} />

        {/* Gradient overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Content that appears on hover */}
        <motion.div
          className="absolute inset-x-0 bottom-0 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-xs text-white/70">{artist}</p>

          {/* Lyric snippet - the invisible made visible */}
          {lyricSnippet && (
            <motion.p
              className="mt-2 line-clamp-2 text-[11px] italic leading-relaxed text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
            >
              &ldquo;{lyricSnippet}&rdquo;
            </motion.p>
          )}
        </motion.div>

        {/* Subtle border that appears on hover */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl ring-1 ring-inset transition-all duration-300",
            isHovered ? "ring-white/20" : "ring-white/5"
          )}
        />
      </motion.div>
    </motion.div>
  );
}
