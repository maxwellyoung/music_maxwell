"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
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
  const materialRef = useRef<
    THREE.ShaderMaterial & { uniforms: { time: { value: number } } }
  >(null);

  useFrame(({ clock }) => {
    if (materialRef.current?.uniforms?.time) {
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center px-4 py-12 text-center"
    >
      <div className="w-full max-w-4xl">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-5xl font-bold leading-tight text-white"
        >
          Metrosexual Awareness Night
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-4 text-xl font-semibold text-red-400"
        >
          A night of music
        </motion.p>
        <div className="relative mx-auto mb-8 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
          <Canvas>
            <Scene />
          </Canvas>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 space-y-4"
        >
          <p className="text-2xl font-light text-gray-300">
            October 11 @ Whammy in Auckland, New Zealand
          </p>
          <p className="text-xl text-gray-400">
            Presented by{" "}
            <motion.a
              href="https://instagram.com/maxwell_young"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Maxwell Young
            </motion.a>{" "}
            and{" "}
            <motion.a
              href="https://instagram.com/thom_haha"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Thom Haha
            </motion.a>
          </p>
        </motion.div>
        <motion.a
          href="https://metrosexualawareness.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transform rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          Learn More
        </motion.a>
        {isHovered && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-sm text-gray-400"
          >
            Click to visit the event website
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
