"use client";

import { useState, useEffect, useRef } from "react";
import { DIMENSIONS } from "./data";
import { projects, Project } from "@/data/projects";

interface MobileFallbackProps {
  onProjectClick: (p: Project) => void;
}

// ─── Skill Chip (memoized, pure CSS) ──────────────────────────────────────
function SkillChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block px-3 py-1.5 text-xs font-medium rounded-md border whitespace-nowrap transition-colors duration-200 active:scale-95"
      style={{
        color: color,
        borderColor: `${color}30`,
        backgroundColor: `${color}08`,
        fontFamily: "var(--font-inter)",
        fontSize: "11px",
      }}
    >
      {label}
    </span>
  );
}

// ─── Project Row Card ──────────────────────────────────────────────────────
function ProjectCard({ proj, color, onClick }: { proj: Project; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border transition-all duration-200 active:scale-98 cursor-pointer"
      style={{
        borderColor: `${color}15`,
        backgroundColor: `${color}05`,
        touchAction: "manipulation",
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}50`;
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${color}12`;
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}15`;
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${color}05`;
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-white text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
          {proj.name}
        </span>
        <span
          className="text-[9px] px-2 py-0.5 rounded border shrink-0 ml-2"
          style={{ color, borderColor: `${color}30`, fontFamily: "var(--font-fira-code)" }}
        >
          {proj.year}
        </span>
      </div>
      <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 mb-2" style={{ fontFamily: "var(--font-inter)" }}>
        {proj.overview}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {proj.stack.slice(0, 4).map((st) => (
          <span
            key={st}
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ color: `${color}CC`, backgroundColor: `${color}10`, fontFamily: "var(--font-fira-code)" }}
          >
            {st}
          </span>
        ))}
        {proj.stack.length > 4 && (
          <span className="text-[9px] text-gray-600" style={{ fontFamily: "var(--font-fira-code)" }}>
            +{proj.stack.length - 4} more
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-center gap-1">
        <span className="text-[9px] uppercase tracking-widest font-semibold animate-pulse" style={{ color, fontFamily: "var(--font-orbitron)" }}>
          TAP TO VIEW BRIEFING
        </span>
        <span style={{ color }}>›</span>
      </div>
    </button>
  );
}

// ─── Accordion Card ────────────────────────────────────────────────────────
function DimensionCard({
  dim,
  isOpen,
  onToggle,
  onProjectClick,
}: {
  dim: (typeof DIMENSIONS)[0];
  isOpen: boolean;
  onToggle: () => void;
  onProjectClick: (p: Project) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isProjects = dim.id === "projects";

  // CSS grid trick for smooth height: 0 → auto without JS layout thrash
  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        borderColor: isOpen ? `${dim.color}50` : "rgba(255,255,255,0.06)",
        backgroundColor: isOpen ? `${dim.color}06` : "rgba(6, 10, 20, 0.7)",
        boxShadow: isOpen ? `0 0 24px ${dim.color}12, inset 0 1px 0 ${dim.color}15` : "none",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer focus:outline-none"
        style={{ touchAction: "manipulation" }}
      >
        <div className="flex items-center gap-3">
          {/* Colored status dot */}
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: dim.color,
              boxShadow: isOpen ? `0 0 8px ${dim.color}` : "none",
              transition: "box-shadow 0.3s",
            }}
          />
          {/* Icon */}
          <span className="text-lg leading-none">{dim.icon}</span>
          {/* Label */}
          <span
            className="text-sm font-bold uppercase tracking-wider transition-colors duration-300"
            style={{
              color: isOpen ? dim.color : "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-orbitron)",
              textShadow: isOpen ? `0 0 10px ${dim.color}60` : "none",
            }}
          >
            {dim.label}
          </span>
        </div>
        {/* Chevron */}
        <span
          className="text-sm font-bold transition-transform duration-300 shrink-0"
          style={{
            color: isOpen ? dim.color : "rgba(255,255,255,0.3)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>

      {/* Accordion Body — CSS grid trick */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div ref={contentRef} className="overflow-hidden">
          <div
            className="px-5 pb-5 pt-1"
            style={{ borderTop: `1px solid ${dim.color}12` }}
          >
            {isProjects ? (
              /* Project list */
              <div className="flex flex-col gap-3 mt-2">
                {projects.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    proj={proj}
                    color={dim.color}
                    onClick={() => onProjectClick(proj)}
                  />
                ))}
              </div>
            ) : (
              /* Skill chips */
              <div className="flex flex-wrap gap-2 mt-2">
                {dim.skills.map((skill) => (
                  <SkillChip key={skill} label={skill} color={dim.color} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Animated CSS Background Grid ─────────────────────────────────────────
function CSSBackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,212,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(123,47,255,0.05) 0%, transparent 60%), #020409",
          animation: "bgPulse 8s ease-in-out infinite alternate",
        }}
      />
      {/* Thin grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Horizontal scan beam (sweeps down) */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)",
          animation: "scanBeam 6s linear infinite",
        }}
      />
      <style>{`
        @keyframes bgPulse {
          0% { opacity: 1; }
          100% { opacity: 0.85; }
        }
        @keyframes scanBeam {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Mobile Fallback ──────────────────────────────────────────────────
export default function MobileFallback({ onProjectClick }: MobileFallbackProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Staggered reveal on mount
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      className="relative min-h-screen bg-[#020409] text-white overflow-x-hidden"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* CSS Animated Background (no WebGL) */}
      <CSSBackgroundGrid />

      <div className="relative z-10 flex flex-col items-center px-4 py-16">

        {/* ─── Header ──────────────────────────────────────────────── */}
        <div
          className="text-center mb-10 max-w-sm transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-16px)",
          }}
        >
          {/* Section tag */}
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-px bg-cyan-500/50" />
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-cyan-400"
              style={{ fontFamily: "var(--font-fira-code)" }}
            >
              ACT III · TECH DIMENSION PORTAL
            </span>
            <div className="w-6 h-px bg-cyan-500/50" />
          </div>

          <h2
            className="text-3xl font-extrabold uppercase tracking-wider text-white mb-3"
            style={{
              fontFamily: "var(--font-orbitron)",
              textShadow: "0 0 24px rgba(0, 212, 255, 0.4)",
            }}
          >
            TECH DIMENSION
            <br />
            <span style={{ color: "#00D4FF" }}>PORTAL</span>
          </h2>

          <p
            className="text-gray-400 text-xs leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Kishan&apos;s tech universe. Tap a dimension to unlock the full tech stack.
          </p>
        </div>

        {/* ─── Accordion Cards ─────────────────────────────────────── */}
        <div className="w-full max-w-lg flex flex-col gap-3">
          {DIMENSIONS.map((dim, i) => (
            <div
              key={dim.id}
              className="transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <DimensionCard
                dim={dim}
                isOpen={expandedId === dim.id}
                onToggle={() => toggleExpand(dim.id)}
                onProjectClick={onProjectClick}
              />
            </div>
          ))}
        </div>

        {/* ─── Footer note ─────────────────────────────────────────── */}
        <p
          className="mt-10 text-center text-[10px] uppercase tracking-widest text-gray-700"
          style={{ fontFamily: "var(--font-fira-code)" }}
        >
          DESKTOP MODE AVAILABLE FOR FULL 3D EXPERIENCE
        </p>
      </div>
    </div>
  );
}
