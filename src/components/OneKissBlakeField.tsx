"use client";

import { memo, useEffect, useRef } from "react";

type OneKissBlakeFieldProps = {
  active: boolean;
  reduceMotion: boolean;
};

const vertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Adapted from the Blake Dream field in Maxwell's Jeremy Blake studio.
const fragmentShader = `
precision highp float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_energy;
uniform vec2 u_pointer;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) +
    i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float t) {
  vec3 ink = vec3(0.018, 0.025, 0.055);
  vec3 cobalt = vec3(0.105, 0.18, 0.48);
  vec3 cyan = vec3(0.306, 0.804, 0.898);
  vec3 rose = vec3(0.91, 0.55, 0.61);
  vec3 paper = vec3(0.98, 0.86, 0.82);

  if (t < 0.24) return mix(ink, cobalt, t / 0.24);
  if (t < 0.48) return mix(cobalt, cyan, (t - 0.24) / 0.24);
  if (t < 0.72) return mix(cyan, rose, (t - 0.48) / 0.24);
  return mix(rose, paper, (t - 0.72) / 0.28);
}

void main() {
  vec2 st = v_uv * 2.0 - 1.0;
  st.x *= u_resolution.x / u_resolution.y;

  float time = u_time * mix(0.055, 0.13, u_energy);
  vec2 pointer = (u_pointer - 0.5) * 0.16;
  vec2 warped = st + pointer;
  warped += 0.19 * vec2(
    fbm(st * 1.15 + vec2(time, -time * 0.4)),
    fbm(st * 1.08 + vec2(-time * 0.55, time * 0.72))
  );

  float waves = 0.0;
  for (int i = 0; i < 6; i++) {
    float id = float(i);
    float distanceField = length(
      warped - vec2(sin(id * 1.7), cos(id * 1.31)) * 0.23
    );
    waves += sin(
      distanceField * (3.1 + id * 0.34) +
      time * (0.8 + id * 0.07) +
      id * 1.51 +
      warped.x * 1.8 -
      warped.y * 1.35
    ) * (0.15 - id * 0.012);
  }

  float field = fbm(warped * 1.34 + time * 0.15) * 0.3;
  float contour = 0.5 + 0.5 * sin(
    waves * 3.15 +
    field * 2.35 +
    time * 0.24 +
    v_uv.x * 0.62 -
    v_uv.y * 0.31
  );
  float colorPosition = clamp(0.08 + contour * 0.86, 0.0, 1.0);

  vec3 color = palette(colorPosition);
  float rosePool = 1.0 - smoothstep(
    0.18,
    1.35,
    length(st - vec2(0.74 + sin(time) * 0.08, -0.28))
  );
  float cyanPool = 1.0 - smoothstep(
    0.14,
    1.2,
    length(st - vec2(-0.18, 0.54 + cos(time * 0.7) * 0.08))
  );
  color = mix(color, vec3(0.94, 0.38, 0.43), rosePool * 0.28);
  color = mix(color, vec3(0.22, 0.68, 0.84), cyanPool * 0.24);

  float bloom = smoothstep(0.12, 0.78, colorPosition);
  color = mix(color * 0.46, color, 0.48 + bloom * 0.34 + u_energy * 0.1);

  float vignette = 1.0 - smoothstep(0.22, 1.42, length(st));
  color *= 0.42 + vignette * 0.58;
  color += vec3(0.02, 0.035, 0.08) * (0.3 + u_energy * 0.35);

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function OneKissBlakeField({
  active,
  reduceMotion,
}: OneKissBlakeFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const reduceMotionRef = useRef(reduceMotion);
  const requestDrawRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    activeRef.current = active;
    requestDrawRef.current();
  }, [active]);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
    requestDrawRef.current();
  }, [reduceMotion]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const energy = gl.getUniformLocation(program, "u_energy");
    const pointer = gl.getUniformLocation(program, "u_pointer");

    let frame = 0;
    let energyValue = activeRef.current ? 1 : 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetPointerX = 0.5;
    let targetPointerY = 0.5;
    let isVisible = true;
    let resizePending = true;
    let drawTimer = 0;
    const startedAt = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const updatePointer = (event: PointerEvent) => {
      if (!isVisible) return;
      targetPointerX = event.clientX / window.innerWidth;
      targetPointerY = 1 - event.clientY / window.innerHeight;
    };

    const scheduleDraw = (immediate = false) => {
      if (frame || drawTimer || !isVisible || document.hidden) return;
      const delay = immediate ? 0 : activeRef.current ? 1000 / 60 : 1000 / 30;
      drawTimer = window.setTimeout(() => {
        drawTimer = 0;
        frame = window.requestAnimationFrame(draw);
      }, delay);
    };

    const draw = (now: number) => {
      frame = 0;
      if (!isVisible || document.hidden) return;

      if (resizePending) {
        resize();
        resizePending = false;
      }
      energyValue += ((activeRef.current ? 1 : 0) - energyValue) * 0.035;
      pointerX += (targetPointerX - pointerX) * 0.025;
      pointerY += (targetPointerY - pointerY) * 0.025;

      gl.useProgram(program);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(
        time,
        reduceMotionRef.current ? 0 : (now - startedAt) / 1000,
      );
      gl.uniform1f(energy, energyValue);
      gl.uniform2f(pointer, pointerX, pointerY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reduceMotionRef.current) scheduleDraw();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(drawTimer);
        frame = 0;
        drawTimer = 0;
      } else {
        resizePending = true;
        scheduleDraw(true);
      }
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = Boolean(entry?.isIntersecting);
      if (isVisible) {
        resizePending = true;
        scheduleDraw(true);
      } else {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(drawTimer);
        frame = 0;
        drawTimer = 0;
      }
    });
    const resizeObserver = new ResizeObserver(() => {
      resizePending = true;
      scheduleDraw();
    });
    const hasFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    intersectionObserver.observe(container);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (hasFinePointer) {
      window.addEventListener("pointermove", updatePointer, { passive: true });
    }
    requestDrawRef.current = scheduleDraw;
    scheduleDraw(true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(drawTimer);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (hasFinePointer) {
        window.removeEventListener("pointermove", updatePointer);
      }
      requestDrawRef.current = () => undefined;
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[#05070c]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-95"
      />
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-70 mix-blend-screen"
      >
        <path
          d="M 80 760 C 210 635, 315 625, 420 700 S 675 530, 830 630"
          fill="none"
          stroke="#f04438"
          strokeLinecap="round"
          strokeWidth="32"
          opacity={active ? 0.32 : 0.16}
          className="transition-opacity duration-1000"
        />
        <path
          d="M 110 290 C 300 245, 505 315, 770 220"
          fill="none"
          stroke="#4ecde5"
          strokeDasharray="4 18"
          strokeLinecap="round"
          strokeWidth="8"
          opacity={active ? 0.58 : 0.24}
          className="transition-opacity duration-1000"
        />
        <path
          d="M 310 380 C 290 180, 390 70, 500 140 C 540 190, 535 310, 480 400"
          fill="none"
          stroke="#181516"
          strokeLinecap="round"
          strokeWidth="11"
          opacity="0.44"
        />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,transparent_0%,rgba(5,7,12,.06)_42%,rgba(5,7,12,.62)_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] mix-blend-overlay [background-image:url('/grain.webp')]" />
    </div>
  );
}

export default memo(OneKissBlakeField);
