"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

type ImagePositions = Record<string, { x: number; y: number }>;
type ZIndexes = Record<string, number>;

const images: ImageData[] = [
  {
    src: "/path/to/image1.jpg",
    alt: "Image 1",
    width: 400,
    height: 300,
  },
  // Add more images as needed
];

export function AdvancedImageCollageComponent() {
  const [positions, setPositions] = useState<ImagePositions>({});
  const [zIndexes, setZIndexes] = useState<ZIndexes>(
    Object.fromEntries(images.map((_, index) => [index.toString(), index + 1])),
  );
  const maxZIndexRef = useRef(images.length);

  const bringToFront = (index: string) => {
    setZIndexes((prev) => {
      maxZIndexRef.current += 1;
      return { ...prev, [index]: maxZIndexRef.current };
    });
  };

  const resetPositions = () => {
    setPositions({});
    setZIndexes(
      Object.fromEntries(
        images.map((_, index) => [index.toString(), index + 1]),
      ),
    );
    maxZIndexRef.current = images.length;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetPositions();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">
      {images.map((image, index) => {
        const key = index.toString();
        return (
          <motion.div
            key={key}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              zIndex: zIndexes[key] ?? 1,
              x: positions[key]?.x ?? 0,
              y: positions[key]?.y ?? 0,
            }}
            onDragStart={() => bringToFront(key)}
            onDragEnd={(_, info) => {
              setPositions((prev) => ({
                ...prev,
                [key]: { x: info.point.x, y: info.point.y },
              }));
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
