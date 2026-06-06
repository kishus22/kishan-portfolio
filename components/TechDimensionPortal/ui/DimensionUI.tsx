"use client";

import { motion } from "framer-motion";
import { Dimension } from "../data";

interface DimensionUIProps {
  dimension: Dimension;
  dimensionIndex: number;
  onBack: () => void;
}

export default function DimensionUI({ dimension, dimensionIndex, onBack }: DimensionUIProps) {
  // Stagger sequence for technology skill chips
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.8, // 0.8s delay after portal arrival
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 14 },
    },
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8 md:p-12 select-none">
      {/* Top Bar: Return to Hub & Active Dimension title */}
      <div className="w-full flex justify-between items-center mt-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 border border-cyan-400/30 bg-black/60 backdrop-blur-md rounded text-cyan-400 font-[family-name:var(--font-fira-code)] text-xs uppercase tracking-wider hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all duration-300 cursor-pointer active:scale-95"
        >
          ← RETURN TO PORTAL
        </motion.button>

        {/* Dimension Title */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-right flex flex-col"
        >
          <span
            className="font-[family-name:var(--font-orbitron)] text-lg md:text-xl font-bold uppercase tracking-wider text-shadow-glow"
            style={{
              color: dimension.color,
              textShadow: `0 0 20px ${dimension.color}60`,
            }}
          >
            {dimension.label}
          </span>
          <span className="font-[family-name:var(--font-fira-code)] text-[9px] text-gray-500 uppercase tracking-widest mt-1">
            DIMENSION CODE: SEC_{dimension.id.toUpperCase()}
          </span>
        </motion.div>
      </div>

      {/* Bottom Bar: Dimension Index & Staggered Technology Skill Chips */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        {/* Bottom Left: Dimension indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col text-left"
        >
          <span className="font-[family-name:var(--font-fira-code)] text-[10px] text-cyan-400/60 uppercase tracking-widest">
            LOCATION INDEX
          </span>
          <span className="font-[family-name:var(--font-orbitron)] text-sm md:text-base font-bold text-white tracking-wider mt-0.5">
            DIMENSION {dimensionIndex + 1} / 7
          </span>
        </motion.div>

        {/* Bottom Center/Right: Staggered Skill Chips */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2.5 max-w-2xl justify-start md:justify-end pointer-events-auto"
        >
          {dimension.skills.map((skill) => (
            <motion.span
              key={skill}
              variants={itemVariants}
              className="skill-chip border rounded px-3.5 py-1.5 font-[family-name:var(--font-inter)] text-xs text-[#E8F4FD] transition-all duration-300 cursor-default select-none hover:scale-105"
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
