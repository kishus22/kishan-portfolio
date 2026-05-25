"use client";

import { motion } from "framer-motion";

export default function MissionParticles() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${8 + (i * 5) % 85}%`,
    top: `${10 + (i * 7) % 80}%`,
    size: 2 + (i % 3),
    delay: i * 0.2,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            opacity: [0.15, 0.6, 0.15],
            y: [0, -20, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + (dot.id % 4),
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
