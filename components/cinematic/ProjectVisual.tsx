"use client";

import { motion } from "framer-motion";
import type { ProjectTheme } from "@/lib/constants";

type ProjectVisualProps = {
  theme: ProjectTheme;
};

export default function ProjectVisual({ theme }: ProjectVisualProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.12)_0%,transparent_70%)]" />

      {theme === "fraud" && <FraudVisual />}
      {theme === "criminal-face" && <FaceScanVisual />}
      {theme === "face-animation" && <MeshVisual />}
      {theme === "face-swap" && <NeuralVisual />}
      {theme === "birth-cert" && <DatabaseVisual />}
      {theme === "fintech" && <PipelineVisual />}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="grid-cyber absolute inset-0 opacity-20" />
    </div>
  );
}

function FraudVisual() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-full bg-cyan-400/30"
          style={{ top: `${12 + i * 10}%` }}
          animate={{ opacity: [0.2, 0.8, 0.2], scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
        />
      ))}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl"
      />
    </>
  );
}

function FaceScanVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="h-64 w-48 rounded-lg border-2 border-cyan-400/60"
      />
      <motion.div
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute h-1 w-48 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute h-8 w-8 border-cyan-400/50"
          style={{
            top: `${20 + i * 25}%`,
            left: i % 2 === 0 ? "18%" : "72%",
            borderWidth: i === 1 ? 2 : 1,
          }}
        />
      ))}
    </div>
  );
}

function MeshVisual() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 400">
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={200}
            y1={200}
            x2={200 + Math.cos(angle) * 160}
            y2={200 + Math.sin(angle) * 160}
            stroke="#00ffff"
            strokeWidth="0.5"
            opacity={0.3 + (i % 3) * 0.2}
          />
        );
      })}
      <circle
        cx="200"
        cy="200"
        r="80"
        fill="none"
        stroke="#a855f7"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  );
}

function NeuralVisual() {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-purple-400"
          style={{
            left: `${10 + (i % 5) * 18}%`,
            top: `${15 + Math.floor(i / 5) * 18}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 1.5 + (i % 3) * 0.4, repeat: Infinity }}
        />
      ))}
    </>
  );
}

function DatabaseVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 px-12">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
          className="h-40 flex-1 rounded-lg border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-sm"
        />
      ))}
    </div>
  );
}

function PipelineVisual() {
  return (
    <>
      <svg className="absolute inset-0 h-full w-full opacity-50">
        <motion.path
          d="M 50 200 Q 200 80 350 200 T 650 200"
          fill="none"
          stroke="url(#pipeGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_20px_#00ffff]"
          style={{ left: `${10 + i * 5}%` }}
        />
      ))}
    </>
  );
}
