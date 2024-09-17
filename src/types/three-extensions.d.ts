import type * as THREE from "three";

declare module "three" {
  interface ShaderMaterial {
    uniforms: {
      time: { value: number };
    };
  }

  interface Mesh {
    rotation: THREE.Euler;
  }
}
