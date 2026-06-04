"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);
  const [particleCount, setParticleCount] = useState(60);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setParticleCount(mobile ? 20 : 60);
    }

    // Defer initialization until after hero is fully painted
    const timer = setTimeout(() => {
      setReady(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

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
        number: { value: particleCount, density: { enable: true } },
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
        opacity: {
          value: {
            min: isMobile ? 0.25 : 0.15,
            max: isMobile ? 0.6 : 0.3,
          },
        },
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
    [particleCount, isMobile],
  );

  if (!ready) return null;

  return (
    <Particles
      id="neural-particles"
      init={particlesInit}
      options={options}
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
}
