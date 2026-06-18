"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * StarField — Dense deep-space background star field with 3 layers:
 * 1. 2000 micro stars (pure white) on a fixed sphere
 * 2. 400 colored accent stars (cyan/purple/gold) that twinkle
 * 3. 50 large bright "hero" stars that pulse independently
 */
export default function StarField() {
  const microRef = useRef<THREE.Points>(null);
  const accentRef = useRef<THREE.Points>(null);
  const heroRef = useRef<THREE.Points>(null);

  // ── Micro stars (static deep background) ─────────────────────────
  const { microPos, microCol } = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute on a sphere of radius 200–500
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      const r = 200 + Math.random() * 300;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Slight warm/cool tint
      const warmth = 0.88 + Math.random() * 0.12;
      col[i * 3] = warmth;
      col[i * 3 + 1] = warmth * (0.9 + Math.random() * 0.1);
      col[i * 3 + 2] = 1.0;
    }
    return { microPos: pos, microCol: col };
  }, []);

  const microGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(microPos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(microCol, 3));
    return g;
  }, [microPos, microCol]);

  // ── Accent stars (colored, animated twinkle) ──────────────────────
  const { accentPos, accentCol, accentPhases } = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const palette = [
      [0.0, 0.83, 1.0],   // Cyan
      [0.48, 0.18, 1.0],  // Purple
      [1.0, 0.85, 0.0],   // Gold
      [0.0, 1.0, 0.53],   // Mint
      [1.0, 0.42, 0.21],  // Orange
    ];
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      const r = 60 + Math.random() * 140;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[i % palette.length];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { accentPos: pos, accentCol: col, accentPhases: phases };
  }, []);

  const accentGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(accentPos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(accentCol, 3));
    return g;
  }, [accentPos, accentCol]);

  // ── Hero stars (large + pulsing) ─────────────────────────────────
  const { heroPos } = useMemo(() => {
    const count = 50;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      const r = 30 + Math.random() * 80;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return { heroPos: pos };
  }, []);

  const heroGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(heroPos, 3));
    return g;
  }, [heroPos]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slow rotation of whole star field for parallax feel
    if (microRef.current) {
      microRef.current.rotation.y = t * 0.008;
      microRef.current.rotation.x = Math.sin(t * 0.003) * 0.05;
    }

    // Twinkle accent stars by varying opacity via material
    if (accentRef.current) {
      accentRef.current.rotation.y = -t * 0.012;
      const mat = accentRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = 0.5 + Math.sin(t * 1.6) * 0.35;
      }
    }

    // Pulse hero stars
    if (heroRef.current) {
      const mat = heroRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.size = 0.22 + Math.sin(t * 2.2) * 0.08;
        mat.opacity = 0.65 + Math.sin(t * 1.8) * 0.25;
      }
    }
  });

  return (
    <group>
      {/* Micro star background */}
      <points ref={microRef} geometry={microGeom}>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Colored accent stars (twinkling) */}
      <points ref={accentRef} geometry={accentGeom}>
        <pointsMaterial
          size={0.14}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Large hero stars */}
      <points ref={heroRef} geometry={heroGeom}>
        <pointsMaterial
          size={0.22}
          color="#FFFFFF"
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
