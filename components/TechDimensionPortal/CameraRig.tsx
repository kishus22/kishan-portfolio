"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  traveling: boolean;
  activeDimension: string | null;
  cameraShakeRef: React.MutableRefObject<{ value: number }>;
}

/**
 * CameraRig — Cinematic camera motion controller.
 * - During travel: applies high-frequency shake from cameraShakeRef
 * - In hub: parallax mouse + multi-frequency organic drone sway
 * - Per-dimension: unique orbital/drift paths for each sub-world
 */
export default function CameraRig({ traveling, activeDimension, cameraShakeRef }: CameraRigProps) {
  const baseLookAt = useMemo(() => new THREE.Vector3(0, 0, -4), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  // Smooth lerp targets
  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 8), []);

  useFrame((state, delta) => {
    const { mouse, camera } = state;
    const shake = cameraShakeRef.current.value;
    const t = state.clock.getElapsedTime();

    if (traveling) {
      // High-frequency multi-axis engine rumble
      if (shake > 0) {
        const jitter = shake * 0.42;
        camera.position.x += (Math.random() - 0.5) * jitter;
        camera.position.y += (Math.random() - 0.5) * jitter;
        // Extra low-frequency deep rumble on Z (feels like spaceship turbulence)
        camera.position.z += Math.sin(t * 28) * shake * 0.18;
      }
      return;
    }

    // ─── Multi-frequency organic drone sway ──────────────────────
    const swayX = Math.sin(t * 0.28) * 0.32 + Math.cos(t * 0.71) * 0.13 + Math.sin(t * 1.3) * 0.04;
    const swayY = Math.cos(t * 0.38) * 0.22 + Math.sin(t * 0.87) * 0.09 + Math.cos(t * 1.7) * 0.03;
    const swayZ = Math.sin(t * 0.22) * 0.28;

    // ─── Dimension-specific camera behavior ──────────────────────
    let tx = mouse.x * 1.6 + swayX;
    let ty = mouse.y * 0.9 + swayY;
    let tz = 8 + swayZ;

    if (!activeDimension) {
      // Hub: standard parallax + sway
      tx = mouse.x * 1.8 + swayX;
      ty = mouse.y * 1.1 + swayY;

    } else if (activeDimension === "aiml") {
      // AI: slow galaxy orbit (wide arcs)
      tx = Math.cos(t * 0.055) * 1.8 + mouse.x * 1.4 + swayX * 0.4;
      ty = Math.sin(t * 0.038) * 0.8 + mouse.y * 0.75 + swayY * 0.4;
      tz = 8 + Math.sin(t * 0.08) * 0.5 + swayZ;

    } else if (activeDimension === "backend") {
      // Megacity: gentle vertical drift + wide parallax
      tx = mouse.x * 1.5 + swayX * 0.6;
      ty = 0.6 + Math.sin(t * 0.07) * 1.1 + mouse.y * 0.55 + swayY * 0.5;
      tz = 8 + Math.cos(t * 0.06) * 0.6 + swayZ;

    } else if (activeDimension === "fullstack") {
      // Full-stack: steady with subtle circular drift
      tx = Math.cos(t * 0.06) * 1.0 + mouse.x * 1.2 + swayX * 0.5;
      ty = Math.sin(t * 0.06) * 0.7 + mouse.y * 0.8 + swayY * 0.5;

    } else if (activeDimension === "databases") {
      // Golden archive: very still, slow hover
      tx = mouse.x * 1.0 + swayX * 0.35;
      ty = mouse.y * 0.6 + swayY * 0.35;
      tz = 8 + Math.sin(t * 0.1) * 0.3;

    } else if (activeDimension === "automation") {
      // Factory: side-to-side industrial scan motion
      tx = Math.sin(t * 0.09) * 2.2 + mouse.x * 1.0 + swayX * 0.4;
      ty = -0.3 + mouse.y * 0.7 + swayY * 0.4;

    } else if (activeDimension === "devops") {
      // Orbital: slow clockwise rotation around station
      const orbitR = 1.5;
      tx = Math.cos(t * 0.04) * orbitR + mouse.x * 1.1 + swayX * 0.3;
      ty = Math.sin(t * 0.04) * orbitR * 0.5 + mouse.y * 0.7 + swayY * 0.3;
      tz = 8 + Math.sin(t * 0.035) * 1.0;

    } else if (activeDimension === "projects") {
      // Mission archive: slow dolly left/right cinematic pan
      tx = Math.sin(t * 0.05) * 2.5 + mouse.x * 0.8;
      ty = mouse.y * 0.5 + swayY * 0.4;
    }

    // ─── Smooth interpolation ─────────────────────────────────────
    const lerpSpeed = 0.028;
    camera.position.x += (tx - camera.position.x) * lerpSpeed;
    camera.position.y += (ty - camera.position.y) * lerpSpeed;
    camera.position.z += (tz - camera.position.z) * lerpSpeed;

    // ─── Cinematic tilt-shift look-at ─────────────────────────────
    // Camera pitches slightly toward scene center + breathes
    lookAtTarget.set(
      baseLookAt.x + Math.sin(t * 0.48) * 0.22 + mouse.x * 0.35,
      baseLookAt.y + Math.cos(t * 0.38) * 0.16 + mouse.y * 0.22,
      baseLookAt.z + Math.sin(t * 0.28) * 0.12
    );
    camera.lookAt(lookAtTarget);
  });

  return null;
}
