"use client";

import { motion } from "framer-motion";
import type { ProjectTheme } from "@/lib/constants";

type ProjectVisualProps = {
  theme: ProjectTheme;
};

export default function ProjectVisual({ theme }: ProjectVisualProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dark overlay: fades to dark at bottom, lighter top */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to top, rgba(2,4,9,0.95) 40%, rgba(2,4,9,0.3) 100%)"
        }}
      />

      {/* Cyan scanline: top to bottom on card hover */}
      <div 
        className="absolute left-0 right-0 h-[1px] bg-cyan-400 opacity-0 group-hover:opacity-60 pointer-events-none z-20 transition-all duration-300 group-hover:animate-[hologram-scan_3.5s_linear_infinite]"
      />

      {/* Corner HUD brackets */}
      <CornerBrackets />

      {/* Project-specific visual overlays */}
      {theme === "fraud" && <FraudVisual />}
      {theme === "criminal-face" && <FaceScanVisual />}
      {theme === "face-animation" && <MeshVisual />}
      {theme === "face-swap" && <NeuralVisual />}
      {theme === "birth-cert" && <DatabaseVisual />}
      {theme === "fintech" && <PipelineVisual />}
    </div>
  );
}

function CornerBrackets() {
  return (
    <div className="absolute inset-4 pointer-events-none z-20">
      {/* Top Left */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-cyan-400/40" />
      {/* Top Right */}
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-cyan-400/40" />
      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-cyan-400/40" />
      {/* Bottom Right */}
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-400/40" />
    </div>
  );
}

function FraudVisual() {
  return (
    <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay z-15">
      <svg className="w-full h-full p-6" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Analytics chart path */}
        <motion.path
          d="M 5 80 L 25 65 L 45 75 L 65 40 L 85 55 L 95 20"
          fill="none"
          stroke="#00ffff"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid lines */}
        <line x1="5" y1="20" x2="95" y2="20" stroke="#00ffff" strokeWidth="0.25" strokeDasharray="2" />
        <line x1="5" y1="40" x2="95" y2="40" stroke="#00ffff" strokeWidth="0.25" strokeDasharray="2" />
        <line x1="5" y1="60" x2="95" y2="60" stroke="#00ffff" strokeWidth="0.25" strokeDasharray="2" />
        <line x1="5" y1="80" x2="95" y2="80" stroke="#00ffff" strokeWidth="0.25" strokeDasharray="2" />
      </svg>
    </div>
  );
}

function FaceScanVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.25] mix-blend-screen z-15">
      <div className="relative w-44 h-56 border border-dashed border-cyan-400/40 rounded flex items-center justify-center">
        {/* Bounding box corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
        
        {/* Detection indicator */}
        <div className="absolute -top-6 left-0 font-mono text-[9px] text-cyan-400 tracking-wider">
          TARGET_MATCH: 99.8%
        </div>
        
        {/* Scanning laser line */}
        <motion.div
          animate={{ y: [-90, 90, -90] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[1.5px] bg-cyan-400 shadow-[0_0_10px_#00ffff]"
        />
      </div>
    </div>
  );
}

function MeshVisual() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.20] mix-blend-screen z-15"
      style={{
        backgroundImage: "radial-gradient(circle, #00ffff 1px, transparent 1.5px)",
        backgroundSize: "16px 16px"
      }}
    />
  );
}

function NeuralVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.20] mix-blend-screen z-15 font-sans">
      <motion.span
        animate={{ opacity: [0.15, 0.7, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="font-[family-name:var(--font-orbitron)] text-2xl md:text-3xl font-black tracking-[0.4em] text-cyan-400"
        style={{ textShadow: "0 0 15px rgba(0, 255, 255, 0.8)" }}
      >
        SCANNING...
      </motion.span>
    </div>
  );
}

function DatabaseVisual() {
  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-[0.20] mix-blend-screen z-15 font-mono text-[8px] text-cyan-400">
      <div className="flex justify-between border-b border-cyan-400/20 pb-2">
        <span>TABLE: CIVILIAN_IDENTITIES</span>
        <span>INDEX: PRIMARY_KEY</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2 py-4">
        <div className="h-2 w-2/3 bg-cyan-400/10 border border-cyan-400/20 rounded" />
        <div className="h-2 w-1/2 bg-cyan-400/10 border border-cyan-400/20 rounded" />
        <div className="h-2 w-3/4 bg-cyan-400/10 border border-cyan-400/20 rounded" />
      </div>
      <div className="border-t border-cyan-400/20 pt-2 text-right">
        <span>STATUS: EXPORT_READY</span>
      </div>
    </div>
  );
}

function PipelineVisual() {
  return (
    <div className="absolute inset-0 opacity-[0.25] mix-blend-screen z-15 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Diagonal pipeline line */}
        <line x1="-10" y1="110" x2="110" y2="-10" stroke="#00ffff" strokeWidth="0.5" strokeDasharray="3" />
        <line x1="0" y1="120" x2="120" y2="0" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="3" />
      </svg>
      {/* Flowing dots along diagonal path */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00ffff]"
          initial={{ left: "-10%", top: "110%" }}
          animate={{ left: "110%", top: "-10%" }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            delay: i * 1.1,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
