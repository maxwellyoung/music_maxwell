"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Point = {
  x: number;
  y: number;
};

type Layer = {
  points: Point[];
  color: string;
};

export const AbstractBlakePaintingComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });

  const drawLayer = useCallback(
    (ctx: CanvasRenderingContext2D, layer: Layer, t: number) => {
      ctx.beginPath();
      const firstPoint = layer.points[0];
      if (firstPoint) {
        ctx.moveTo(firstPoint.x, firstPoint.y);

        for (let i = 0; i < layer.points.length; i++) {
          const currentPoint = layer.points[i];
          const nextPoint = layer.points[(i + 1) % layer.points.length];

          if (currentPoint && nextPoint) {
            const midX = (currentPoint.x + nextPoint.x) / 2;
            const midY = (currentPoint.y + nextPoint.y) / 2;

            const controlX = midX + Math.sin(t * 0.01 + i) * 50;
            const controlY = midY + Math.cos(t * 0.01 + i) * 50;

            ctx.quadraticCurveTo(controlX, controlY, nextPoint.x, nextPoint.y);
          }
        }
      }

      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.globalAlpha = 0.1;
      ctx.fill();
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colorPalettes: string[][] = [
      ["#FF3366", "#FF6633", "#FFCC33", "#33CCFF", "#3366FF"],
      ["#FF0066", "#FF9900", "#FFCC00", "#00CCFF", "#0066FF"],
      ["#FF0033", "#FF6600", "#FFCC66", "#66CCFF", "#3399FF"],
    ];

    let currentPalette = 0;
    let time = 0;
    const layers: Layer[] = [];

    const createLayer = () => {
      const points: Point[] = [];
      const numPoints = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        });
      }
      const palette = colorPalettes[currentPalette];
      if (palette) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        if (color) {
          layers.push({ points, color });
        }
      }
    };

    for (let i = 0; i < 5; i++) {
      createLayer();
    }

    let animationFrameId: number;

    const loop = () => {
      time += 0.2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      layers.forEach((layer, index) => {
        drawLayer(ctx, layer, time + index * 100);
      });

      const palette = colorPalettes[currentPalette];
      if (palette) {
        const color = palette[Math.floor(time / 100) % palette.length];
        if (color) {
          const interactionLayer: Layer = {
            points: [
              { x: mousePosition.x, y: mousePosition.y },
              { x: mousePosition.x + 100, y: mousePosition.y - 50 },
              { x: mousePosition.x + 50, y: mousePosition.y + 100 },
            ],
            color: color,
          };
          drawLayer(ctx, interactionLayer, time);
        }
      }

      if (time % 1000 === 0) {
        currentPalette = (currentPalette + 1) % colorPalettes.length;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, drawLayer]);

  return (
    <div className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="fixed left-0 top-0 h-full w-full"
        style={{ zIndex: -1 }}
      />
      <div className="fixed left-0 top-0 flex h-screen w-full items-center justify-center">
        <div className="text-2xl font-bold text-white">
          maxwell young is working on a mixtape
        </div>
      </div>
    </div>
  );
};
