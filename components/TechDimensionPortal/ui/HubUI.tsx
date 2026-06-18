"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DIMENSIONS } from "../data";

interface HubUIProps {
  onSelectDimension: (dimId: string) => void;
}

const TICKER_MESSAGES = [
  "SCANNING DIMENSIONAL SPACE — LOCKED ON 7 NODES",
  "WARNING: HIGH ENERGY PORTAL DETECTED AT COORDINATES [0, 0, -5]",
  "QUANTUM LINK ESTABLISHED — SELECT A NODE TO INITIATE TRAVEL",
  "DIMENSION DRIVE: ONLINE — WARP CAPACITY: 100%",
  "KISHAN S // TECH DIMENSION HUB — AUTHORIZED ACCESS",
];

export default function HubUI({ onSelectDimension }: HubUIProps) {
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((i) => (i + 1) % TICKER_MESSAGES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between select-none overflow-hidden">
      
      {/* ─── Cinematic Scanline Overlay ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.012) 3px, rgba(0,212,255,0.012) 4px)",
          animation: "scanlines 8s linear infinite",
        }}
      />

      {/* ─── Corner HUD Brackets ────────────────────────────────── */}
      {/* Top-left */}
      <div className="absolute top-5 left-5 w-12 h-12 border-t-2 border-l-2 border-cyan-400/40" />
      {/* Top-right */}
      <div className="absolute top-5 right-5 w-12 h-12 border-t-2 border-r-2 border-cyan-400/40" />
      {/* Bottom-left */}
      <div className="absolute bottom-5 left-5 w-12 h-12 border-b-2 border-l-2 border-cyan-400/40" />
      {/* Bottom-right */}
      <div className="absolute bottom-5 right-5 w-12 h-12 border-b-2 border-r-2 border-cyan-400/40" />

      {/* ─── Top HUD Bar ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 w-full flex flex-col items-center pt-8 px-8"
      >
        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-4 bg-cyan-400 animate-pulse" />
          <span className="font-[family-name:var(--font-orbitron)] text-xs font-bold uppercase tracking-[0.35em] text-cyan-400"
            style={{ textShadow: "0 0 12px rgba(0,212,255,0.6)" }}
          >
            TECH DIMENSION PORTAL
          </span>
          <div className="w-1 h-4 bg-cyan-400 animate-pulse" />
        </div>

        {/* Live Telemetry Ticker */}
        <div className="relative overflow-hidden h-5 w-full max-w-lg">
          <motion.span
            key={tickerIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-fira-code)] text-[9px] text-cyan-400/55 uppercase tracking-[0.2em] text-center"
          >
            {TICKER_MESSAGES[tickerIdx]}
          </motion.span>
        </div>

        {/* Thin separator line */}
        <div className="mt-3 w-40 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </motion.div>

      {/* ─── Side HUD Indicators ──────────────────────────────────── */}
      {/* Left telemetry */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-40">
        {["PORTAL: ONLINE", "NODES: 7/7", "QUANTUM: STABLE", "WARP: READY"].map((line, i) => (
          <div key={i} className="font-[family-name:var(--font-fira-code)] text-[8px] text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            {line}
          </div>
        ))}
      </div>
      {/* Right telemetry */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-40">
        {["SYS: NOMINAL", "FPS: MAX", "ENERGY: 100%", "DRIVE: ARMED"].map((line, i) => (
          <div key={i} className="font-[family-name:var(--font-fira-code)] text-[8px] text-purple-400 uppercase tracking-widest flex items-center gap-1.5 justify-end">
            {line}
            <div className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          </div>
        ))}
      </div>

      {/* ─── Bottom Nav Teleporter Bar ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full flex flex-col items-center pb-6 px-4"
      >
        {/* Label above buttons */}
        <span className="font-[family-name:var(--font-fira-code)] text-[8px] text-cyan-400/40 uppercase tracking-[0.22em] mb-2">
          TELEPORTER PANEL — CLICK NODE OR BUTTON TO ENTER
        </span>

        {/* Nav buttons */}
        <div
          className="flex flex-wrap justify-center gap-2 p-2.5 pointer-events-auto"
          style={{
            background: "rgba(2, 4, 9, 0.75)",
            border: "1px solid rgba(0,212,255,0.12)",
            backdropFilter: "blur(16px)",
            borderRadius: "8px",
            boxShadow: "0 0 30px rgba(0,212,255,0.06), inset 0 1px 0 rgba(0,212,255,0.08)",
          }}
        >
          {DIMENSIONS.map((dim, i) => (
            <motion.button
              key={dim.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 180, damping: 18 }}
              onClick={() => onSelectDimension(dim.id)}
              className="group relative px-3.5 py-2 rounded font-[family-name:var(--font-fira-code)] text-[10px] uppercase tracking-wider transition-all duration-250 cursor-pointer flex items-center gap-1.5 active:scale-95"
              style={{
                color: dim.color,
                background: `${dim.color}08`,
                border: `1px solid ${dim.color}20`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${dim.color}18`;
                e.currentTarget.style.borderColor = `${dim.color}60`;
                e.currentTarget.style.boxShadow = `0 0 18px ${dim.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${dim.color}08`;
                e.currentTarget.style.borderColor = `${dim.color}20`;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span>{dim.icon}</span>
              <span>{dim.label}</span>
              {/* Bottom border accent */}
              <span
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: dim.color }}
              />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
      `}</style>
    </div>
  );
}
