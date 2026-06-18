"use client";

import { motion } from "framer-motion";
import { Dimension } from "../data";

interface DimensionUIProps {
  dimension: Dimension;
  dimensionIndex: number;
  onBack: () => void;
}

// Fake coordinates per dimension for cinematic feel
const DIMENSION_COORDS: Record<string, string> = {
  aiml: "LAT: 39.7°N  LON: 84.2°E  ALT: ∞",
  backend: "LAT: -12.4°S  LON: 130.5°E  ALT: 4200m",
  fullstack: "LAT: 22.9°N  LON: 43.8°W  ALT: 1800m",
  databases: "LAT: 0.0°  LON: 0.0°  ALT: ARCHIVE LEVEL 7",
  automation: "LAT: 55.2°N  LON: 37.6°E  ALT: FACTORY SECTOR 12",
  devops: "LAT: 90.0°N  LON: 0.0°  ALT: ORBIT 400km",
  projects: "LAT: CLASSIFIED  LON: CLASSIFIED  ALT: VAULT DEPTH -3",
};

export default function DimensionUI({ dimension, dimensionIndex, onBack }: DimensionUIProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delayChildren: 0.8, staggerChildren: 0.065 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 140, damping: 16 },
    },
  };

  const coords = DIMENSION_COORDS[dimension.id] || "LAT: --  LON: --  ALT: --";

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between select-none overflow-hidden">

      {/* ─── Scanline overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* ─── Corner brackets ──────────────────────────────────────── */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2" style={{ borderColor: `${dimension.color}60` }} />
      <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2" style={{ borderColor: `${dimension.color}60` }} />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2" style={{ borderColor: `${dimension.color}60` }} />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2" style={{ borderColor: `${dimension.color}60` }} />

      {/* ─── Top Bar ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex justify-between items-start pt-7 px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onBack}
          className="pointer-events-auto group flex items-center gap-2 px-4 py-2 font-[family-name:var(--font-fira-code)] text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95"
          style={{
            background: "rgba(2, 4, 9, 0.8)",
            border: `1px solid ${dimension.color}30`,
            color: dimension.color,
            backdropFilter: "blur(16px)",
            borderRadius: "6px",
            boxShadow: `0 0 15px ${dimension.color}10`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = dimension.color;
            e.currentTarget.style.boxShadow = `0 0 20px ${dimension.color}40`;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${dimension.color}30`;
            e.currentTarget.style.boxShadow = `0 0 15px ${dimension.color}10`;
            e.currentTarget.style.color = dimension.color;
          }}
        >
          <span className="group-hover:translate-x-[-2px] transition-transform duration-200">←</span>
          RETURN TO PORTAL
        </motion.button>

        {/* Dimension Title + Coordinates */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-right flex flex-col gap-0.5"
        >
          <span
            className="font-[family-name:var(--font-orbitron)] text-lg md:text-xl font-bold uppercase tracking-wider"
            style={{ color: dimension.color, textShadow: `0 0 20px ${dimension.color}60` }}
          >
            {dimension.icon} {dimension.label}
          </span>
          <span className="font-[family-name:var(--font-fira-code)] text-[8px] text-gray-500 uppercase tracking-widest">
            DIMENSION CODE: SEC_{dimension.id.toUpperCase()}
          </span>
          {/* Coordinates */}
          <span className="font-[family-name:var(--font-fira-code)] text-[8px] uppercase tracking-widest" style={{ color: `${dimension.color}80` }}>
            {coords}
          </span>
        </motion.div>
      </div>

      {/* ─── Signal Strength Meter (left side) ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      >
        <span className="font-[family-name:var(--font-fira-code)] text-[7px] text-gray-600 uppercase tracking-widest rotate-180" style={{ writingMode: "vertical-rl" }}>
          SIGNAL
        </span>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
            className="w-1.5 rounded-sm"
            style={{
              height: `${8 + i * 3}px`,
              background: dimension.color,
              opacity: 0.2 + i * 0.12,
              boxShadow: `0 0 4px ${dimension.color}60`,
            }}
          />
        ))}
      </motion.div>

      {/* ─── Bottom Bar ───────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 px-8">
        {/* Bottom Left: Dimension Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col text-left gap-0.5"
        >
          <span className="font-[family-name:var(--font-fira-code)] text-[9px] text-gray-600 uppercase tracking-widest">
            LOCATION INDEX
          </span>
          <span className="font-[family-name:var(--font-orbitron)] text-sm md:text-base font-bold text-white tracking-wider">
            DIMENSION {dimensionIndex + 1} / 7
          </span>
          {/* Thin progress bar */}
          <div className="h-px w-24 bg-white/10 mt-1 rounded overflow-hidden">
            <motion.div
              className="h-full rounded"
              style={{ background: dimension.color }}
              initial={{ width: 0 }}
              animate={{ width: `${((dimensionIndex + 1) / 7) * 100}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Bottom Right: Staggered Skill Chips */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2 max-w-2xl justify-start md:justify-end pointer-events-auto"
        >
          {dimension.skills.map((skill) => (
            <motion.span
              key={skill}
              variants={itemVariants}
              className="skill-chip relative overflow-hidden border rounded px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs text-[#E8F4FD] transition-all duration-300 cursor-default select-none hover:scale-105"
              style={{
                borderColor: `${dimension.color}25`,
                backgroundColor: `${dimension.color}08`,
                boxShadow: `inset 0 0 8px ${dimension.color}05`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = dimension.color;
                e.currentTarget.style.backgroundColor = `${dimension.color}18`;
                e.currentTarget.style.boxShadow = `0 0 15px ${dimension.color}40, inset 0 0 8px ${dimension.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${dimension.color}25`;
                e.currentTarget.style.backgroundColor = `${dimension.color}08`;
                e.currentTarget.style.boxShadow = `inset 0 0 8px ${dimension.color}05`;
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
