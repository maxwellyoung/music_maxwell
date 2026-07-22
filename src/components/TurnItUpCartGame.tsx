"use client";

import { useCallback, useEffect, useRef } from "react";

type GameMode = "ready" | "playing" | "won" | "lost";

type FallingCan = {
  id: number;
  lane: number;
  y: number;
};

type CartGameState = {
  mode: GameMode;
  cartLane: number;
  cans: FallingCan[];
  nextCanId: number;
  spawnInMs: number;
  volume: number;
  missed: number;
  elapsedMs: number;
};

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

const WIDTH = 720;
const HEIGHT = 500;
const LANES = [150, 360, 570] as const;
const CART_Y = 424;
const CATCH_Y = 396;
const FALL_LIMIT = 466;
const WIN_VOLUME = 7;
const MISS_LIMIT = 3;
const LANE_SEQUENCE = [1, 0, 2, 2, 0, 1, 2, 0, 1, 1, 2, 0] as const;

const initialState = (): CartGameState => ({
  mode: "ready",
  cartLane: 1,
  cans: [],
  nextCanId: 0,
  spawnInMs: 420,
  volume: 0,
  missed: 0,
  elapsedMs: 0,
});

export default function TurnItUpCartGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<CartGameState>(initialState());
  const animationRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const state = stateRef.current;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = "#f4f5ef";
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.strokeStyle = "rgba(21, 32, 24, 0.12)";
    context.lineWidth = 1;
    for (let x = 0; x <= WIDTH; x += 60) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, HEIGHT);
      context.stroke();
    }
    for (let y = 0; y <= HEIGHT; y += 60) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(WIDTH, y);
      context.stroke();
    }

    context.fillStyle = "#152018";
    context.font = "700 15px Arial, sans-serif";
    context.fillText("TURN IT UP / CART RUN", 24, 32);
    context.textAlign = "right";
    context.fillText(`VOLUME ${state.volume}/${WIN_VOLUME}`, WIDTH - 24, 32);
    context.textAlign = "left";

    context.fillStyle = "rgba(21, 32, 24, 0.12)";
    context.fillRect(24, 46, WIDTH - 48, 7);
    context.fillStyle = "#6f8468";
    context.fillRect(24, 46, ((WIDTH - 48) * state.volume) / WIN_VOLUME, 7);

    context.strokeStyle = "rgba(21, 32, 24, 0.2)";
    context.setLineDash([4, 8]);
    for (const x of [255, 465]) {
      context.beginPath();
      context.moveTo(x, 76);
      context.lineTo(x, 470);
      context.stroke();
    }
    context.setLineDash([]);

    for (const can of state.cans) {
      const x = LANES[can.lane]!;
      context.fillStyle = "#6f8468";
      context.fillRect(x - 17, can.y - 25, 34, 50);
      context.fillStyle = "#f4f5ef";
      context.fillRect(x - 11, can.y - 17, 22, 4);
      context.fillRect(x - 11, can.y + 11, 22, 4);
      context.strokeStyle = "#152018";
      context.lineWidth = 2;
      context.strokeRect(x - 17, can.y - 25, 34, 50);
    }

    const cartX = LANES[state.cartLane]!;
    context.strokeStyle = "#152018";
    context.lineWidth = 5;
    context.strokeRect(cartX - 62, CART_Y, 124, 38);
    context.beginPath();
    context.moveTo(cartX - 72, CART_Y - 22);
    context.lineTo(cartX - 55, CART_Y);
    context.stroke();
    context.fillStyle = "#152018";
    context.beginPath();
    context.arc(cartX - 39, CART_Y + 49, 8, 0, Math.PI * 2);
    context.arc(cartX + 39, CART_Y + 49, 8, 0, Math.PI * 2);
    context.fill();

    context.font = "700 12px Arial, sans-serif";
    context.fillStyle = "rgba(21, 32, 24, 0.62)";
    context.fillText(`MISSED ${state.missed}/${MISS_LIMIT}`, 24, HEIGHT - 18);
    context.textAlign = "right";
    context.fillText("← → / A D / TAP / F FULLSCREEN", WIDTH - 24, 72);
    context.textAlign = "left";

    if (state.mode !== "playing") {
      context.fillStyle = "rgba(244, 245, 239, 0.9)";
      context.fillRect(70, 116, WIDTH - 140, 220);
      context.strokeStyle = "#152018";
      context.lineWidth = 2;
      context.strokeRect(70, 116, WIDTH - 140, 220);
      context.textAlign = "center";
      context.fillStyle = "#152018";
      context.font = "700 48px Arial, sans-serif";
      const heading =
        state.mode === "won"
          ? "TURNED UP"
          : state.mode === "lost"
            ? "TOO QUIET"
            : "CART RUN";
      context.fillText(heading, WIDTH / 2, 197);
      context.font = "700 16px Arial, sans-serif";
      context.fillText(
        state.mode === "ready"
          ? "COLLECT 7 CANS / MISS 3"
          : `VOLUME ${state.volume} / MISSED ${state.missed}`,
        WIDTH / 2,
        239,
      );
      context.font = "700 13px Arial, sans-serif";
      context.fillStyle = "#6f8468";
      context.fillText(
        state.mode === "ready" ? "PRESS ENTER OR TAP" : "PRESS R OR TAP",
        WIDTH / 2,
        286,
      );
      context.textAlign = "left";
    }
  }, []);

  const advance = useCallback(
    (durationMs: number) => {
      let remaining = Math.max(0, durationMs);
      while (remaining > 0) {
        const stepMs = Math.min(remaining, 16);
        remaining -= stepMs;
        const state = stateRef.current;
        if (state.mode !== "playing") continue;

        state.elapsedMs += stepMs;
        state.spawnInMs -= stepMs;
        if (state.spawnInMs <= 0) {
          const lane = LANE_SEQUENCE[state.nextCanId % LANE_SEQUENCE.length]!;
          state.cans.push({ id: state.nextCanId, lane, y: 82 });
          state.nextCanId += 1;
          state.spawnInMs += Math.max(520, 810 - state.volume * 28);
        }

        const speed = 142 + state.volume * 5;
        const nextCans: FallingCan[] = [];
        for (const can of state.cans) {
          const previousY = can.y;
          can.y += (speed * stepMs) / 1000;
          const crossesCart = previousY < CATCH_Y && can.y >= CATCH_Y;
          if (crossesCart && can.lane === state.cartLane) {
            state.volume += 1;
            if (state.volume >= WIN_VOLUME) {
              state.mode = "won";
              state.cans = [];
              break;
            }
            continue;
          }
          if (can.y > FALL_LIMIT) {
            state.missed += 1;
            if (state.missed >= MISS_LIMIT) {
              state.mode = "lost";
              state.cans = [];
              break;
            }
            continue;
          }
          nextCans.push(can);
        }
        if (state.mode === "playing") state.cans = nextCans;
      }
      draw();
    },
    [draw],
  );

  const start = useCallback(() => {
    stateRef.current = { ...initialState(), mode: "playing" };
    draw();
  }, [draw]);

  useEffect(() => {
    draw();
    const tick = (time: number) => {
      const last = lastFrameRef.current ?? time;
      lastFrameRef.current = time;
      advance(Math.min(40, time - last));
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);

    window.render_game_to_text = () => {
      const state = stateRef.current;
      return JSON.stringify({
        coordinateSystem:
          "origin top-left; x increases right; y increases down",
        canvas: { width: WIDTH, height: HEIGHT, lanes: LANES },
        mode: state.mode,
        cart: { lane: state.cartLane, x: LANES[state.cartLane], y: CART_Y },
        cans: state.cans.map((can) => ({
          id: can.id,
          lane: can.lane,
          x: LANES[can.lane],
          y: Math.round(can.y),
        })),
        volume: state.volume,
        targetVolume: WIN_VOLUME,
        missed: state.missed,
        missLimit: MISS_LIMIT,
      });
    };
    window.advanceTime = (ms: number) => advance(ms);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [advance, draw]);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      tabIndex={0}
      aria-label="Turn It Up cart game. Collect seven falling cans with the cart. Use left and right arrows or A and D. Miss three and the run ends."
      className="block aspect-[720/500] w-full border border-[#152018] bg-[#f4f5ef] outline-none focus-visible:ring-4 focus-visible:ring-[#6f8468]/45"
      onKeyDown={(event) => {
        const state = stateRef.current;
        if (event.key.toLowerCase() === "f") {
          event.preventDefault();
          void canvasRef.current?.requestFullscreen();
          return;
        }
        if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          start();
          return;
        }
        if (
          state.mode !== "playing" &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          start();
          return;
        }
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
          event.preventDefault();
          state.cartLane = Math.max(0, state.cartLane - 1);
          draw();
        }
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
          event.preventDefault();
          state.cartLane = Math.min(2, state.cartLane + 1);
          draw();
        }
      }}
      onPointerDown={(event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.focus();
        if (stateRef.current.mode !== "playing") {
          start();
          return;
        }
        const bounds = canvas.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * WIDTH;
        stateRef.current.cartLane = Math.max(
          0,
          Math.min(2, Math.floor(x / (WIDTH / 3))),
        );
        draw();
      }}
    />
  );
}
