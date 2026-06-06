"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  traveling: boolean;
  activeDimension: string | null;
  cameraShakeRef: React.MutableRefObject<{ value: number }>;
}

export default function CameraRig({ traveling, activeDimension, cameraShakeRef }: CameraRigProps) {
  // Base look at target
  const baseLookAt = useMemo(() => new THREE.Vector3(0, 0, -4), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const { mouse, camera } = state;
    const shake = cameraShakeRef.current.value;

    if (traveling) {
      // Apply high-frequency engine rumble offsets to the GSAP-controlled camera path
      if (shake > 0) {
        camera.position.x += (Math.random() - 0.5) * shake * 0.42;
        camera.position.y += (Math.random() - 0.5) * shake * 0.42;
        camera.position.z += (Math.random() - 0.5) * shake * 0.42;
      }
      return; // Yield tracking control to GSAP during warp travel
    }

    const t = state.clock.getElapsedTime();

    // Multi-frequency organic camera drone sway
    const swayX = Math.sin(t * 0.3) * 0.3 + Math.cos(t * 0.75) * 0.12;
    const swayY = Math.cos(t * 0.4) * 0.2 + Math.sin(t * 0.9) * 0.08;
    const swayZ = Math.sin(t * 0.25) * 0.25;

    // Smoothly interpolate camera position based on mouse parallax + drone sway
    let targetX = mouse.x * 1.6 + swayX;
    let targetY = mouse.y * 0.9 + swayY;
    let targetZ = camera.position.z; // Keep GSAP-set position or base position

    // Custom movement behaviors inside specific dimensions
    if (activeDimension === "aiml") {
      // Gentle orbital path combined with mouse parallax
      targetX = Math.cos(t * 0.06) * 1.2 + mouse.x * 1.5 + swayX * 0.5;
      targetY = Math.sin(t * 0.03) * 0.5 + mouse.y * 0.8 + swayY * 0.5;
    } else if (activeDimension === "backend") {
      // Sway vertical range in Architecture City
      targetY = 0.5 + Math.sin(t * 0.08) * 0.8 + mouse.y * 0.6 + swayY * 0.5;
    }

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    
    // Slight Z drift for extra spatial depth feeling
    if (activeDimension) {
      // Sub-dimension z position drift
      camera.position.z += (8 + swayZ - camera.position.z) * 0.03;
    } else {
      // Hub state z position drift
      camera.position.z += (8 + swayZ - camera.position.z) * 0.03;
    }

    // Dynamic camera target sway for rotational parallax
    lookAtTarget.set(
      baseLookAt.x + Math.sin(t * 0.5) * 0.2 + mouse.x * 0.3,
      baseLookAt.y + Math.cos(t * 0.4) * 0.15 + mouse.y * 0.2,
      baseLookAt.z + Math.sin(t * 0.3) * 0.1
    );

    camera.lookAt(lookAtTarget);
  });

  return null;
}
