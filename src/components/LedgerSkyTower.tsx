"use client";

import { useEffect, useRef } from "react";

type ThreeModule = typeof import("three");

// The dithered Sky Tower from ninetynine.digital, ported to vanilla three
// and re-cut for the ledger: only the dark dither dots are drawn, in the
// current --ledger-ink colour, so it reads as print on paper (and inverts
// with the ink mode). Renders nothing until mounted; parent gates size.
const VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec2 uMouse;
  uniform vec3 uLightPos;
  uniform vec3 uInk;
  uniform float uAudio;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  float dither4x4(vec2 position) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = x + y * 4;
    float limit = 0.0;
    if (index == 0) limit = 0.0625;
    else if (index == 1) limit = 0.5625;
    else if (index == 2) limit = 0.1875;
    else if (index == 3) limit = 0.6875;
    else if (index == 4) limit = 0.8125;
    else if (index == 5) limit = 0.3125;
    else if (index == 6) limit = 0.9375;
    else if (index == 7) limit = 0.4375;
    else if (index == 8) limit = 0.25;
    else if (index == 9) limit = 0.75;
    else if (index == 10) limit = 0.125;
    else if (index == 11) limit = 0.625;
    else if (index == 12) limit = 1.0;
    else if (index == 13) limit = 0.5;
    else if (index == 14) limit = 0.875;
    else limit = 0.375;
    return limit;
  }

  void main() {
    vec3 lightDir = normalize(uLightPos - vWorldPos);
    float diff = max(dot(vNormal, lightDir), 0.0);

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
    rim = smoothstep(0.3, 1.0, rim);

    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 48.0);

    float mouseInfluence = dot(vNormal, vec3(uMouse * 0.5, 1.0));
    mouseInfluence = max(mouseInfluence, 0.0) * 0.2;

    float light = diff * 0.65 + rim * 0.35 + spec * 0.3 + mouseInfluence + 0.08 + uAudio * 0.35;
    light = clamp(light, 0.0, 1.0);

    // Keep only the dark dots of the Bayer pattern; paper shows through.
    if (step(dither4x4(gl_FragCoord.xy * 0.35), light) > 0.5) discard;

    // While sound plays the ink turns chromatic: the 1kiss palette
    // sweeps up the tower, vividness riding the audio level.
    vec3 pink = vec3(1.0, 0.25, 0.667);
    vec3 cyan = vec3(0.196, 0.847, 1.0);
    vec3 gold = vec3(1.0, 0.78, 0.25);
    float band = vWorldPos.y * 0.35 + uTime * 0.35;
    vec3 chroma = mix(pink, cyan, 0.5 + 0.5 * sin(band));
    chroma = mix(chroma, gold, 0.5 + 0.5 * sin(band * 0.61 + 2.1));
    float vivid = clamp(uAudio * 1.7, 0.0, 1.0) * 0.85;
    vec3 ink = mix(uInk, chroma, vivid);

    float fadeY = smoothstep(-4.5, -2.0, vWorldPos.y);
    gl_FragColor = vec4(ink, fadeY);
  }
`;

// Procedural Beehive (Executive Wing, Wellington): a lathe of the real
// proportions with 32 facade ribs. No licensed mesh — ours outright.
function beehiveGeometry(THREE: ThreeModule) {
  const tiers: [number, number][] = [
    [1.8, 0.0],
    [1.8, 0.3],
    [1.48, 0.3],
  ];
  // ten tiered floors, straight taper with a small lip at each slab
  for (let f = 0; f < 10; f++) {
    const r0 = 1.48 - (f * (1.48 - 0.98)) / 10;
    const r1 = 1.48 - ((f + 1) * (1.48 - 0.98)) / 10;
    const y0 = 0.3 + f * 0.4;
    const y1 = 0.3 + (f + 1) * 0.4;
    tiers.push([r0 * 0.985, y0 + 0.06], [r1 + 0.015, y1], [r1, y1]);
  }
  // shallow dome and mast
  tiers.push(
    [0.9, 4.5],
    [0.74, 4.72],
    [0.48, 4.9],
    [0.16, 5.0],
    [0.022, 5.02],
    [0.022, 5.85],
  );
  const around = 128;
  const ribs = 32;
  const positions: number[] = [];
  const indices: number[] = [];
  for (const [radius, y] of tiers) {
    for (let j = 0; j <= around; j++) {
      const theta = (j / around) * Math.PI * 2;
      // vertical mullions: only on the walls, not plinth or mast
      const wall = y > 0.3 && y < 4.35 && radius > 0.6 ? 1 : 0;
      const r = radius * (1 + wall * 0.02 * Math.cos(theta * ribs));
      positions.push(r * Math.sin(theta), y - 2.5, r * Math.cos(theta));
    }
  }
  const ring = around + 1;
  for (let i = 0; i < tiers.length - 1; i++) {
    for (let j = 0; j < around; j++) {
      const a = i * ring + j;
      const b = a + ring;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.center();
  geometry.computeBoundingBox();
  return geometry;
}

export default function LedgerSkyTower({
  monument = "skytower",
}: {
  monument?: "skytower" | "beehive";
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // The monument is desktop decoration: below lg the wrapper is hidden
    // but children still mount, so bail before pulling three.js onto
    // phones — and before creating a renderer without WebGL support.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return;
    } catch {
      return;
    }

    let disposed = false;
    let frame = 0;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const THREE = await import("three");
      const { PLYLoader } = await import(
        "three/examples/jsm/loaders/PLYLoader.js"
      );
      if (disposed || !mount) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, 7.4);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // setSize(..., false) never styles the element; without explicit CSS
      // the canvas displays at buffer size, which at retina dpr blows the
      // scene up 2x and shoves it off-viewport. Pin it to the column.
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const inkOf = () => {
        const [r = 17, g = 17, b = 17] = getComputedStyle(mount)
          .color.match(/\d+/g)
          ?.map(Number) ?? [17, 17, 17];
        return new THREE.Color(r / 255, g / 255, b / 255);
      };

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMouse: { value: new THREE.Vector2(0, 0) },
          uLightPos: { value: new THREE.Vector3(5, 10, 5) },
          uInk: { value: inkOf() },
          uAudio: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        side: THREE.DoubleSide,
        transparent: true,
      });

      const group = new THREE.Group();
      scene.add(group);


      let mesh: InstanceType<typeof THREE.Mesh> | undefined;
      let modelSize: InstanceType<typeof THREE.Vector3> | undefined;

      // Scale so the whole silhouette fits the column at any aspect ratio —
      // fitted, never cropped.
      const fit = () => {
        if (!modelSize) return;
        const distance = camera.position.z;
        const visibleH = 2 * distance * Math.tan((camera.fov * Math.PI) / 360);
        const visibleW = visibleH * camera.aspect;
        const scale = Math.min(
          (visibleH * 0.86) / modelSize.y,
          (visibleW * 0.86) / modelSize.x,
        );
        group.scale.setScalar(scale);
        group.position.y = 0;
      };

      if (monument === "beehive") {
        const geometry = beehiveGeometry(THREE);
        modelSize = geometry.boundingBox!.getSize(new THREE.Vector3());
        mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
        fit();
      } else {
        new PLYLoader().load("/models/skytower.ply", (rawGeometry) => {
          if (disposed) return;
          const geometry = rawGeometry;
          geometry.computeVertexNormals();
          geometry.center();
          geometry.rotateX(-Math.PI / 2);
          geometry.center();
          geometry.computeBoundingBox();
          modelSize = geometry.boundingBox!.getSize(new THREE.Vector3());
          mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
          fit();
        });
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const onScheme = () => material.uniforms.uInk!.value.copy(inkOf());
      scheme.addEventListener("change", onScheme);
      // The ◐ switch flips data-ledger on <html>; follow it without reload.
      const attrObserver = new MutationObserver(onScheme);
      attrObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-ledger", "data-hour"],
      });

      const pointer = new THREE.Vector2(0, 0);
      const pointerTarget = new THREE.Vector2(0, 0);
      const onPointer = (event: PointerEvent) => {
        pointerTarget.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
        );
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      // Drag to spin, with momentum. The canvas is the only interactive
      // surface in the column; everything else stays pointer-events-none.
      let dragOffset = 0;
      let dragVelocity = 0;
      let dragging = false;
      let lastX = 0;
      const canvas = renderer.domElement;
      canvas.style.pointerEvents = "auto";
      canvas.style.cursor = "grab";
      canvas.style.touchAction = "pan-y";
      const onDown = (event: PointerEvent) => {
        dragging = true;
        lastX = event.clientX;
        canvas.style.cursor = "grabbing";
        canvas.setPointerCapture(event.pointerId);
      };
      const onDragMove = (event: PointerEvent) => {
        if (!dragging) return;
        const dx = event.clientX - lastX;
        lastX = event.clientX;
        dragOffset += dx * 0.008;
        dragVelocity = dx * 0.008;
      };
      const onUp = () => {
        dragging = false;
        canvas.style.cursor = "grab";
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onDragMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);

      // The excerpt player broadcasts its level; the tower listens.
      let audioLevel = 0;
      let audioTarget = 0;
      const onAudio = (event: Event) => {
        audioTarget = Math.min(1, (event as CustomEvent<number>).detail ?? 0);
      };
      window.addEventListener("ledger:audio-level", onAudio);

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        fit();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      const clock = new THREE.Clock();
      const tick = () => {
        frame = window.requestAnimationFrame(tick);
        if (document.visibilityState !== "visible") return;
        const t = clock.getElapsedTime();
        pointer.lerp(pointerTarget, 0.04);
        if (!dragging) {
          dragOffset += dragVelocity;
          dragVelocity *= 0.95;
        }
        audioLevel += (audioTarget - audioLevel) * 0.18;
        material.uniforms.uAudio!.value = audioLevel;
        material.uniforms.uTime!.value = t;
        if (mesh) {
          const scrollTilt = window.scrollY * 0.00035;
          if (reduceMotion.matches) {
            mesh.rotation.set(0, 0.6 + dragOffset, 0);
          } else {
            mesh.rotation.y =
              t * (0.1 + audioLevel * 0.25) + pointer.x * 0.25 + dragOffset;
            mesh.rotation.x = pointer.y * 0.08 + scrollTilt;
            mesh.position.y = Math.sin(t * 0.6) * 0.02;
          }
        }
        material.uniforms.uMouse!.value.copy(pointer);
        material.uniforms.uLightPos!.value.set(
          5 + Math.sin(t * 0.4) * 3,
          10 + Math.cos(t * 0.25) * 2,
          5 + Math.sin(t * 0.6) * 3,
        );
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        observer.disconnect();
        attrObserver.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("ledger:audio-level", onAudio);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onDragMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        scheme.removeEventListener("change", onScheme);
        mesh?.geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [monument]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="h-full w-full text-(--ledger-ink)"
    />
  );
}
