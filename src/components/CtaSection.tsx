"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type * as THREE from "three";

extend({ OrbitControls });

const GlobeShaderMaterial = {
  uniforms: {
    time: { value: 0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      vNormal = normal;
      vUv = uv;
      vec3 pos = position + normal * sin(time * 1.5 + position.y * 3.0) * 0.015;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      float glimmer = sin(vUv.y * 25.0 + time * 2.5) * 0.5 + 0.5;
      glimmer *= sin(vUv.x * 20.0 - time * 2.0) * 0.5 + 0.5;
      
      vec3 baseColor = vec3(0.95, 0.1, 0.1);
      vec3 darkColor = vec3(0.2, 0.05, 0.05);
      
      vec3 finalColor = mix(darkColor, baseColor, glimmer * dot(vNormal, vec3(0.0, 0.0, 1.0)));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[GlobeShaderMaterial as THREE.ShaderMaterialParameters]}
      />
    </mesh>
  );
}

function Scene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.z = 2.2;
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <Globe />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function CtaSection() {
  return (
    <section className="flex flex-col items-center px-4 py-12 text-center">
      <div className="w-full max-w-4xl">
        <h1 className="mb-2 text-5xl font-bold leading-tight text-white">
          Metrosexual Awareness Night
        </h1>
        <p className="mb-4 text-xl font-semibold text-red-400">
          A night of music
        </p>
        <div className="relative mx-auto mb-8 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
          <Canvas>
            <Scene />
          </Canvas>
        </div>
        <div className="mb-8 space-y-4">
          <p className="text-2xl font-light text-gray-300">
            October 11 @ Whammy in Auckland, New Zealand
          </p>
          <p className="text-xl text-gray-400">
            Presented by{" "}
            <a
              href="https://instagram.com/maxwell_young"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:underline"
            >
              Maxwell Young
            </a>{" "}
            and{" "}
            <a
              href="https://instagram.com/thom_haha"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:underline"
            >
              Thom Haha
            </a>
          </p>
        </div>
        <a
          href="https://metrosexualawareness.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transform rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Learn More
        </a>
      </div>
    </section>
  );
}
