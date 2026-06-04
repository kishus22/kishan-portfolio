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
    
    // Save scroll position and lock
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
          className="fixed inset-0 z-[99999] h-screen w-screen overflow-y-auto overflow-x-hidden bg-[rgba(2,4,9,0.97)] backdrop-blur-[20px]"
          onClick={onClose}
        >
          <motion.article
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full min-h-full pb-20 flex flex-col bg-[#020409]"
          >
            {/* Fixed Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="fixed top-6 right-6 z-[10000] flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/40 bg-[rgba(2,4,9,0.8)] text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 text-lg cursor-pointer font-sans"
              aria-label="Close briefing"
            >
              ✕
            </button>

            {/* SECTION A: CINEMATIC HERO POSTER */}
            <div className="relative w-full h-[45vh] overflow-hidden">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                style={{ filter: "brightness(0.55) contrast(1.05)" }}
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020409] via-[#020409]/40 to-transparent" />
              
              {/* Category tag + year badge (overlaid top-left) */}
              <div className="absolute top-6 left-6 flex flex-col gap-1.5 pointer-events-none">
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.15em] uppercase">
                  {project.category} · {project.year}
                </span>
              </div>

              {/* Classified mission badge (overlaid top-right) */}
              <div className="absolute top-24 right-6 pointer-events-none bg-black/60 border border-[#FF6B35]/30 px-3 py-1 rounded">
                <span className="font-[family-name:var(--font-fira-code)] text-[10px] text-[#FF6B35] tracking-[0.1em] uppercase">
                  MISSION FILE · DECLASSIFIED
                </span>
              </div>

              {/* Project name overlaid bottom-left */}
              <div className="absolute bottom-6 left-6 md:left-12 max-w-[85%] pointer-events-none">
                <h2 className="font-[family-name:var(--font-orbitron)] text-2xl md:text-[36px] font-extrabold text-white uppercase tracking-wide leading-tight">
                  {project.name}
                </h2>
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 flex flex-col gap-10 mt-10">
              
              {/* SECTION B: PROJECT OVERVIEW */}
              <div className="flex flex-col gap-3">
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.2em] uppercase font-semibold">
                  OVERVIEW
                </span>
                <p className="font-[family-name:var(--font-inter)] text-base text-[#C8D8E8] leading-[1.8]">
                  {project.overview}
                </p>
              </div>

              {/* SECTION C: PROBLEM + SOLUTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg p-6 border-l-[3px] border-[#FF6B35] bg-[rgba(255,107,53,0.05)] backdrop-blur-md">
                  <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#FF6B35] tracking-[0.1em] uppercase font-bold">
                    THE PROBLEM
                  </span>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#C8D8E8] mt-3 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div className="rounded-lg p-6 border-l-[3px] border-[#00D4FF] bg-[rgba(0,212,255,0.05)] backdrop-blur-md">
                  <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.1em] uppercase font-bold">
                    THE SOLUTION
                  </span>
                  <p className="font-[family-name:var(--font-inter)] text-sm text-[#C8D8E8] mt-3 leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* SECTION D: TECH STACK */}
              <div className="flex flex-col gap-4">
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.2em] uppercase font-semibold">
                  TECHNOLOGY STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-[6px] border border-[rgba(0,212,255,0.25)] bg-[rgba(0,212,255,0.06)] px-[14px] py-[6px] font-[family-name:var(--font-inter)] text-[13px] text-[#E8F4FD] transition-all duration-200 hover:border-[#00D4FF] hover:bg-[rgba(0,212,255,0.12)] hover:shadow-[0_0_12px_rgba(0,212,255,0.4)] hover:scale-105 select-none"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION E: KEY ACHIEVEMENTS */}
              <div className="flex flex-col gap-4">
                <span className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.2em] uppercase font-semibold">
                  MISSION ACHIEVEMENTS
                </span>
                <ul className="flex flex-col gap-4">
                  {project.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-center gap-4 rounded-[6px] border border-[rgba(0,212,255,0.1)] bg-[rgba(0,212,255,0.03)] px-5 py-4 hover:border-[rgba(0,212,255,0.3)] hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-all duration-300"
                    >
                      <div className="h-2 w-2 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF] shrink-0" />
                      <span className="font-[family-name:var(--font-inter)] text-[15px] text-[#C8D8E8]">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SECTION F: ACTION BUTTONS */}
              <div className="flex justify-center gap-6 mt-6">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 px-6 items-center justify-center gap-2 rounded border border-cyan-400/40 bg-transparent text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] font-[family-name:var(--font-fira-code)] text-[13px] uppercase cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  View Repository
                </a>
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 px-6 items-center justify-center rounded border border-[#7B2FFF]/40 bg-transparent text-[#7B2FFF] transition-all duration-300 hover:border-[#7B2FFF] hover:bg-[#7B2FFF]/10 font-[family-name:var(--font-fira-code)] text-[13px] uppercase cursor-pointer"
                  >
                    Live Demo
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
