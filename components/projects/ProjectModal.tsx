"use client";
import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import { useLenisScroll } from "@/components/providers/LenisProvider";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lenis } = useLenisScroll();
  
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!project) return;
    
    const prevScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    if (lenis) lenis.stop();
    
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      if (lenis) lenis.start();
      window.scrollTo(0, prevScrollY);
      window.removeEventListener("keydown", handleKey);
    };
  }, [project, handleKey, lenis]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-lenis-prevent
          className="fixed inset-0 z-[99999] h-screen w-screen overflow-y-auto overflow-x-hidden bg-[rgba(2,4,9,0.96)] backdrop-blur-[24px] grid-cyber"
          onClick={onClose}
        >
          <div className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,212,255,0.03)_50%)] bg-[length:100%_4px]" />
          
          <motion.article
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full min-h-full pb-20 flex flex-col bg-[#020409]/95 border-x border-cyan-400/15 max-w-[1000px] mx-auto shadow-[0_0_80px_rgba(0,212,255,0.15)]"
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 pointer-events-none" />

            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

            <button
              type="button"
              onClick={onClose}
              className="fixed top-6 right-6 z-[10000] flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/40 bg-[rgba(2,4,9,0.85)] text-cyan-400 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300 text-lg cursor-pointer"
              aria-label="Close briefing"
            >
              ✕
            </button>

            <div className="relative w-full h-[48vh] overflow-hidden border-b border-cyan-400/15">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                style={{ filter: "brightness(0.4) contrast(1.1) saturate(0.85)" }}
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020409] via-[#020409]/30 to-transparent z-[2]" />
              <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.2] bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(0,212,255,0.08)_4px,rgba(0,212,255,0.08)_8px)]" />

              <div className="absolute top-6 left-6 md:left-12 flex flex-col gap-1.5 pointer-events-none z-[3]">
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.18em] uppercase bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded backdrop-blur-sm shadow-[0_0_15px_rgba(0,212,255,0.15)]">
                  {project.category} · {project.year}
                </span>
              </div>

              <div className="absolute top-6 right-20 pointer-events-none bg-black/60 border border-[#FF6B35]/40 px-3 py-1 rounded backdrop-blur-sm z-[3] shadow-[0_0_15px_rgba(255,107,53,0.15)]">
                <span className="font-[family-name:var(--font-fira-code)] text-[10px] text-[#FF6B35] tracking-[0.12em] uppercase font-semibold">
                  SECURE FILE // DECLASSIFIED
                </span>
              </div>

              <div className="absolute bottom-8 left-6 md:left-12 max-w-[85%] pointer-events-none z-[3]">
                <div className="font-[family-name:var(--font-fira-code)] text-[10px] text-cyan-400/70 tracking-[0.25em] uppercase mb-1">
                  PROJECT RECORD ARCHIVE
                </div>
                <h2 className="font-[family-name:var(--font-orbitron)] text-2xl md:text-[38px] font-extrabold text-white uppercase tracking-wide leading-tight text-shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                  {project.name}
                </h2>
              </div>
            </div>

            <div className="w-full px-6 md:px-12 flex flex-col gap-10 mt-10 z-[2]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-cyan-400/15 bg-[rgba(2,4,9,0.7)] rounded-lg font-[family-name:var(--font-fira-code)] text-[10px] uppercase tracking-wider text-cyan-400/80">
                <div className="flex flex-col gap-1 border-r border-cyan-400/10 last:border-0 pr-2">
                  <span className="text-cyan-500/50">ARCHIVE ID</span>
                  <span className="font-semibold text-white">#000{project.id}-SEC</span>
                </div>
                <div className="flex flex-col gap-1 border-r border-cyan-400/10 last:border-0 pr-2">
                  <span className="text-cyan-500/50">TELEMETRY</span>
                  <span className="font-semibold text-white">ACTIVE_OK</span>
                </div>
                <div className="flex flex-col gap-1 border-r border-cyan-400/10 last:border-0 pr-2">
                  <span className="text-cyan-500/50">SEC_LEVEL</span>
                  <span className="font-semibold text-[#FF2E93] text-glow-pink">LEVEL_DELTA</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-cyan-500/50">TIMESTAMP</span>
                  <span className="font-semibold text-white">{project.year} // CHRONO</span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 p-6 border border-cyan-400/15 bg-[rgba(0,212,255,0.02)] rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-cyan-400/10 border-b border-l border-cyan-400/20 px-3 py-1 font-[family-name:var(--font-fira-code)] text-[9px] text-cyan-400/60 uppercase">
                  Statement
                </div>
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.25em] uppercase font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  MISSION OVERVIEW
                </span>
                <p className="font-[family-name:var(--font-inter)] text-base text-[#C8D8E8] leading-[1.8]">
                  {project.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg p-6 border border-[#FF6B35]/20 border-l-[4px] border-l-[#FF6B35] bg-[rgba(255,107,53,0.03)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#FF6B35]/10 border-b border-l border-[#FF6B35]/20 px-2.5 py-0.5 font-[family-name:var(--font-fira-code)] text-[8px] text-[#FF6B35] uppercase">
                    VULNERABILITY
                  </div>
                  <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#FF6B35] tracking-[0.15em] uppercase font-bold">
                    THE CHALLENGE
                  </span>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#C8D8E8] mt-3 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                
                <div className="rounded-lg p-6 border border-cyan-400/20 border-l-[4px] border-l-cyan-400 bg-[rgba(0,212,255,0.03)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-cyan-400/10 border-b border-l border-cyan-400/20 px-2.5 py-0.5 font-[family-name:var(--font-fira-code)] text-[8px] text-cyan-400 uppercase">
                    RESOLUTION
                  </div>
                  <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.15em] uppercase font-bold">
                    THE DEPLOYMENT
                  </span>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#C8D8E8] mt-3 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.25em] uppercase font-semibold">
                  INTEGRATED TECHNOLOGIES
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-cyan-500/20 bg-cyan-950/20 hover:border-cyan-400 hover:text-white hover:bg-cyan-500/10 hover:shadow-[0_0_12px_rgba(0,212,255,0.35)] px-[14px] py-[6px] font-[family-name:var(--font-fira-code)] text-[12px] text-cyan-300 transition-all duration-200 select-none cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.25em] uppercase font-semibold">
                  KEY PERFORMANCE METRICS
                </span>
                <ul className="flex flex-col gap-3">
                  {project.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-center gap-4 rounded border border-cyan-500/10 bg-cyan-950/5 px-5 py-4 hover:border-cyan-400/30 hover:bg-cyan-500/5 hover:shadow-[0_0_15px_rgba(0,212,255,0.08)] transition-all duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF] shrink-0" />
                      <span className="font-[family-name:var(--font-inter)] text-[14.5px] text-[#C8D8E8] leading-relaxed">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center gap-6 mt-6 border-t border-cyan-400/15 pt-8">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 px-6 items-center justify-center gap-2 rounded border border-cyan-400/40 bg-transparent text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] font-[family-name:var(--font-fira-code)] text-[12px] uppercase cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  ACCESS SOURCE
                </a>
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 px-6 items-center justify-center rounded border border-[#7B2FFF]/40 bg-transparent text-[#7B2FFF] transition-all duration-300 hover:border-[#7B2FFF] hover:bg-[#7B2FFF]/10 font-[family-name:var(--font-fira-code)] text-[12px] uppercase cursor-pointer"
                  >
                    RUN LIVE BRIEFING
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
