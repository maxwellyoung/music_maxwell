"use client";

import { useEffect, useRef } from "react";

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

    float light = diff * 0.65 + rim * 0.35 + spec * 0.3 + mouseInfluence + 0.08;
    light = clamp(light, 0.0, 1.0);

    // Keep only the dark dots of the Bayer pattern; paper shows through.
    if (step(dither4x4(gl_FragCoord.xy * 0.35), light) > 0.5) discard;

    float fadeY = smoothstep(-4.5, -2.0, vWorldPos.y);
    gl_FragColor = vec4(uInk, fadeY);
  }
`;

export default function LedgerSkyTower() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

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
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        side: THREE.DoubleSide,
        transparent: true,
      });

      const group = new THREE.Group();
      scene.add(group);

      // Orbital rings from the ninetynine.digital original, inked for paper.
      const ringGroup = new THREE.Group();
      ringGroup.position.y = 0.5;
      scene.add(ringGroup);
      const ringMaterials: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];
      [2.2, 3.0, 3.8].forEach((radius, i) => {
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: inkOf(),
          transparent: true,
          opacity: 0.22 - i * 0.05,
        });
        ringMaterials.push(ringMaterial);
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.0035, 8, 128),
          ringMaterial,
        );
        ring.rotation.x = Math.PI / 2 + i * 0.15;
        ring.position.y = -1 + i * 0.8;
        ringGroup.add(ring);
      });

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
        ringGroup.scale.setScalar(scale / 0.65);
      };

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

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const onScheme = () => {
        const ink = inkOf();
        material.uniforms.uInk!.value.copy(ink);
        ringMaterials.forEach((m) => m.color.copy(ink));
      };
      scheme.addEventListener("change", onScheme);

      const pointer = new THREE.Vector2(0, 0);
      const pointerTarget = new THREE.Vector2(0, 0);
      const onPointer = (event: PointerEvent) => {
        pointerTarget.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
        );
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

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
        if (mesh) {
          if (reduceMotion.matches) {
            mesh.rotation.set(0, 0.6, 0);
          } else {
            mesh.rotation.y = t * 0.1 + pointer.x * 0.25;
            mesh.rotation.x = pointer.y * 0.08;
            mesh.position.y = Math.sin(t * 0.6) * 0.02;
          }
        }
        if (!reduceMotion.matches) {
          ringGroup.rotation.y = t * 0.05;
          ringGroup.rotation.x = Math.sin(t * 0.15) * 0.05;
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
        window.removeEventListener("pointermove", onPointer);
        scheme.removeEventListener("change", onScheme);
        mesh?.geometry.dispose();
        ringGroup.children.forEach((ring) => {
          if (ring instanceof THREE.Mesh) ring.geometry.dispose();
        });
        ringMaterials.forEach((m) => m.dispose());
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="h-full w-full text-(--ledger-ink)"
    />
  );
}
