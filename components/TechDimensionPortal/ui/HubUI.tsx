"use client";

import { motion } from "framer-motion";
import { DIMENSIONS } from "../data";

interface HubUIProps {
  onSelectDimension: (dimId: string) => void;
}

export default function HubUI({ onSelectDimension }: HubUIProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8 md:p-12 select-none">
      {/* Top Center HUD Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col items-center text-center mt-6"
      >
        <span className="font-[family-name:var(--font-fira-code)] text-xs font-semibold text-[#00D4FF] tracking-[0.25em] uppercase drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">
          TECH DIMENSION PORTAL
        </span>
        <span className="font-[family-name:var(--font-fira-code)] text-[9px] text-cyan-400/50 uppercase tracking-[0.18em] mt-1.5">
          SELECT A PORTAL NODE OR USE THE TELEPORTER BELOW TO EXPLORE
        </span>
      </motion.div>

      {/* Bottom Horizontal Nav Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex flex-col items-center mb-6"
      >
        <div className="flex flex-wrap justify-center gap-3.5 max-w-4xl p-3 border border-cyan-500/15 bg-black/60 backdrop-blur-md rounded-lg shadow-[0_0_25px_rgba(0,212,255,0.08)] pointer-events-auto">
          {DIMENSIONS.map((dim) => (
            <button
              key={dim.id}
              onClick={() => onSelectDimension(dim.id)}
              className="px-3.5 py-2 rounded font-[family-name:var(--font-fira-code)] text-[10px] md:text-[11px] uppercase tracking-wider transition-all duration-300 border border-transparent hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              style={{
                color: dim.color,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${dim.color}40`;
                e.currentTarget.style.boxShadow = `0 0 15px ${dim.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span>{dim.icon}</span>
              <span>{dim.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
