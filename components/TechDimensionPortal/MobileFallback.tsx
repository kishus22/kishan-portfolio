"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticlesBackground from "@/components/effects/ParticlesBackground";
import { DIMENSIONS } from "./data";
import { projects, Project } from "@/data/projects";

interface MobileFallbackProps {
  onProjectClick: (p: Project) => void;
}

export default function MobileFallback({ onProjectClick }: MobileFallbackProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative min-h-screen bg-[#020409] text-white px-6 py-16 flex flex-col items-center overflow-x-hidden">
      {/* Background Particles */}
      <ParticlesBackground />

      {/* Header section */}
      <div className="relative z-10 text-center mb-12 max-w-xl">
        <p className="font-[family-name:var(--font-fira-code)] text-[10px] uppercase tracking-[0.2em] text-[#00D4FF]">
          ACT III · TECH DIMENSION PORTAL
        </p>
        <h2
          className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-extrabold uppercase tracking-wider text-white"
          style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.4)" }}
        >
          TECH DIMENSION PORTAL
        </h2>
        <div className="mt-3 h-[1px] w-24 bg-gradient-to-r from-[#00D4FF] via-[#7B2FFF] to-transparent mx-auto" />
        <p className="mt-5 text-gray-400 font-[family-name:var(--font-inter)] text-xs leading-relaxed">
          Kishan S's Tech Universe. Tap each category dimension to unlock the integrated technical stack.
        </p>
      </div>

      {/* 7 Glassmorphic expandable accordion cards */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-4">
        {DIMENSIONS.map((dim) => {
          const isExpanded = expandedId === dim.id;
          const isProjects = dim.id === "projects";

          return (
            <div
              key={dim.id}
              className="border rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300"
              style={{
                borderColor: isExpanded ? dim.color : "rgba(255, 255, 255, 0.08)",
                backgroundColor: isExpanded ? `${dim.color}05` : "rgba(8, 13, 26, 0.55)",
                boxShadow: isExpanded ? `0 0 20px ${dim.color}15` : "none",
              }}
            >
              {/* Header card trigger */}
              <button
                onClick={() => toggleExpand(dim.id)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{dim.icon}</span>
                  <span
                    className="font-[family-name:var(--font-orbitron)] text-sm font-bold uppercase tracking-wider transition-colors duration-300"
                    style={{ color: isExpanded ? dim.color : "#ffffff" }}
                  >
                    {dim.label}
                  </span>
                </div>
                <span className="text-gray-400 text-xs font-semibold">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {/* Accordion content body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-white/5 flex flex-wrap gap-2">
                      {isProjects ? (
                        <div className="flex flex-col gap-3.5 w-full mt-2">
                          {projects.map((proj) => (
                            <div
                              key={proj.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onProjectClick(proj);
                              }}
                              className="w-full p-4 rounded-lg border border-cyan-500/10 hover:border-cyan-400 bg-cyan-950/5 hover:bg-cyan-500/5 active:scale-98 transition-all duration-200 cursor-pointer flex flex-col gap-1.5"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-[family-name:var(--font-orbitron)] text-xs font-bold text-white uppercase">
                                  {proj.name}
                                </span>
                                <span className="font-[family-name:var(--font-fira-code)] text-[9px] text-cyan-400 bg-cyan-950/50 border border-cyan-500/20 px-2 py-0.5 rounded">
                                  {proj.year}
                                </span>
                              </div>
                              <p className="text-gray-400 text-[11px] font-[family-name:var(--font-inter)] line-clamp-2">
                                {proj.overview}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {proj.stack.slice(0, 3).map((st) => (
                                  <span
                                    key={st}
                                    className="text-[9px] font-[family-name:var(--font-fira-code)] text-cyan-400/80 bg-cyan-950/20 px-1.5 py-0.5 rounded"
                                  >
                                    {st}
                                  </span>
                                ))}
                                {proj.stack.length > 3 && (
                                  <span className="text-[9px] font-[family-name:var(--font-fira-code)] text-gray-500">
                                    +{proj.stack.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        dim.skills.map((skill) => (
                          <span
                            key={skill}
                            className="border rounded-[6px] px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs text-[#E8F4FD]"
                            style={{
                              borderColor: `${dim.color}20`,
                              backgroundColor: `${dim.color}05`,
                            }}
                          >
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
