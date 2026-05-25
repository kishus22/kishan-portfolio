"use client";

import { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: { color: { value: "transparent" } },
      particles: {
        number: { value: 80, density: { enable: true } },
        color: { value: ["#00ffff", "#a855f7", "#ec4899"] },
        links: {
          enable: true,
          color: "#00ffff",
          distance: 140,
          opacity: 0.25,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none" as const,
          random: true,
          outModes: { default: "bounce" as const },
        },
        opacity: { value: { min: 0.2, max: 0.6 } },
        size: { value: { min: 1, max: 3 } },
      },
      interactivity: {
        detectsOn: "window" as const,
        events: {
          onHover: { enable: true, mode: "grab" as const },
          resize: true,
        },
        modes: {
          grab: { distance: 180, links: { opacity: 0.5 } },
        },
      },
    }),
    [],
  );

  return (
    <Particles
      id="neural-particles"
      init={particlesInit}
      options={options}
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
