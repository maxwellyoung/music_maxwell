"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Rnd } from "react-rnd";

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
      
      vec3 baseColor = vec3(0.95, 0.1, 0.1);  // Bright red
      vec3 darkColor = vec3(0.2, 0.05, 0.05);  // Dark red
      
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
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Globe />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

interface Image {
  id: string;
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
}

const images: Image[] = [
  {
    id: "1",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5435%202-6hEWiwJ4DzO8FEmQOsxjwhWlh4SNni.jpeg",
    alt: "Me in suit in basement",
    initialX: 50,
    initialY: 50,
    initialWidth: 300,
    initialHeight: 400,
    initialRotation: 0,
  },

  {
    id: "2",
    src: "./makingamixtape.webp",
    alt: "Making a mixtape",
    initialX: 200,
    initialY: 300,
    initialWidth: 600,
    initialHeight: 100,
    initialRotation: -10,
  },
  {
    id: "3",
    src: "/name.webp",
    alt: "Maxwell Young",
    initialX: 600,
    initialY: 100,
    initialWidth: 600,
    initialHeight: 100,
    initialRotation: 10,
  },
];

const CtaSection: React.FC = () => {
  const [zIndexes, setZIndexes] = useState<{ [key: string]: number }>(
    Object.fromEntries(images.map((img, index) => [img.id, index + 1])),
  );
  const maxZIndexRef = useRef(images.length);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getRandomPosition = (
    imageWidth: number,
    imageHeight: number,
  ): { x: number; y: number } => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxX = windowWidth - imageWidth;
    const maxY = windowHeight - imageHeight;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    return { x, y };
  };

  const [imagePositions, setImagePositions] = useState<{
    [key: string]: { x: number; y: number };
  }>(() => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    images.forEach((image) => {
      const { x, y } = getRandomPosition(
        image.initialWidth,
        image.initialHeight,
      );
      positions[image.id] = { x, y };
    });
    return positions;
  });

  useEffect(() => {
    const updatePositions = () => {
      const newPositions: { [key: string]: { x: number; y: number } } = {};
      images.forEach((image) => {
        const { x, y } = getRandomPosition(
          image.initialWidth,
          image.initialHeight,
        );
        newPositions[image.id] = { x, y };
      });
      setImagePositions(newPositions);
    };

    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  const bringToFront = (id: string) => {
    setZIndexes((prev) => {
      maxZIndexRef.current += 1;
      return { ...prev, [id]: maxZIndexRef.current };
    });
    setSelectedImage(id);
  };

  const resetPositions = () => {
    setZIndexes(
      Object.fromEntries(images.map((img, index) => [img.id, index + 1])),
    );
    maxZIndexRef.current = images.length;
    setSelectedImage(null);
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
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Scene />
        </Canvas>
      </div>
      <div className="absolute inset-0 z-20 flex flex-wrap items-center justify-center">
        {images.map((image) => (
          <Rnd
            key={image.id}
            default={{
              x: imagePositions[image.id]?.x || 0,
              y: imagePositions[image.id]?.y || 0,
              width: image.initialWidth,
              height: image.initialHeight,
            }}
            style={{ zIndex: zIndexes[image.id] }}
            onDragStart={() => bringToFront(image.id)}
            onResizeStart={() => bringToFront(image.id)}
            bounds="parent"
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              topLeft: true,
              bottomRight: true,
              bottomLeft: true,
            }}
          >
            <motion.div
              className="group relative h-full w-full"
              initial={{ rotate: image.initialRotation }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full rounded-lg object-cover shadow-lg"
              />
              <motion.div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-200 group-hover:bg-opacity-20" />
              {selectedImage === image.id && (
                <motion.div
                  className="absolute -left-3 -top-3 h-6 w-6 cursor-move rounded-full bg-blue-500"
                  drag
                  dragConstraints={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  dragElastic={0.1}
                  dragMomentum={false}
                  onDrag={(_, info) => {
                    const rotationElement = info.point.x / 2;
                    const parentElement = info.point.y / 2;
                    const rotation = rotationElement + parentElement;
                    const motionDiv = document.getElementById(
                      `motion-div-${image.id}`,
                    );
                    if (motionDiv) {
                      motionDiv.style.transform = `rotate(${rotation}deg)`;
                    }
                  }}
                />
              )}
              <motion.div
                id={`motion-div-${image.id}`}
                className="h-full w-full"
              />
            </motion.div>
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default CtaSection;
