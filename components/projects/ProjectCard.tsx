"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
};

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lift: false });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current || !canTilt()) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 16;
    const rx = (0.5 - py) * 16;
    setTilt({ rx: Math.max(-8, Math.min(8, rx)), ry: Math.max(-8, Math.min(8, ry)), lift: true });
    setSpot({ x: px * 100, y: py * 100 });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0, lift: false });
    setSpot({ x: 50, y: 50 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <article
        ref={ref}
        role="button"
        tabIndex={0}
        data-cursor-hover
        onClick={() => onOpen(project)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(project);
          }
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          transform: tilt.lift
            ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(12px)`
            : undefined,
          boxShadow: tilt.lift
            ? "0 0 35px rgba(0, 212, 255, 0.25), 0 0 50px rgba(168, 85, 247, 0.15), inset 0 0 20px rgba(0, 212, 255, 0.1)"
            : "0 0 20px rgba(0, 212, 255, 0.04), inset 0 0 10px rgba(0, 212, 255, 0.02)",
        }}
        className="project-card-tilt group relative flex h-[380px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-[rgba(2,4,9,0.85)] transition-[border-color,box-shadow,transform] duration-300 hover:border-transparent max-md:!transform-none max-md:h-auto max-md:min-h-[320px]"
      >
        {/* Animated Holographic Border Sweep */}
        <div className="absolute inset-0 z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ padding: '1px' }}>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_40%,#00D4FF_50%,#7B2FFF_60%,transparent_100%)] animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-[1px] rounded-2xl bg-[rgba(2,4,9,0.95)] z-[-1]" />
        </div>

        {/* Spot Light Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 280px at ${spot.x}% ${spot.y}%, rgba(0,212,255,0.14) 0%, transparent 65%)`,
          }}
        />

        {/* Image Container */}
        <div className="relative min-h-[200px] flex-1 overflow-hidden">
          <Image
            src={project.image}
            alt={project.name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
            style={{ filter: "brightness(0.5) contrast(1.1) saturate(0.7)" }}
          />

          {/* Subtle Scan-line Overlay */}
          <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.25] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,212,255,0.06)_2px,rgba(0,212,255,0.06)_4px)]" />

          {/* Glass Reflection sweep */}
          <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-[200%] h-full bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.03)_40%,rgba(0,212,255,0.05)_45%,transparent_50%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,4,9,0.95)_40%,rgba(2,4,9,0.2)_100%)] z-[2]" />
          
          <span className="absolute right-4 top-4 z-[3] rounded border border-cyan-400/40 px-2 py-0.5 font-[family-name:var(--font-fira-code)] text-[11px] text-[#00d4ff]">
            {project.year}
          </span>
        </div>

        {/* Content Details */}
        <div className="relative z-[3] mt-auto p-5">
          <h3 className="font-[family-name:var(--font-orbitron)] text-xl font-semibold leading-snug text-white group-hover:text-cyan-200">
            {project.name}
          </h3>
          
          {/* Mission File Style Descriptions */}
          <p className="mt-2.5 font-[family-name:var(--font-fira-code)] text-[11.5px] leading-relaxed text-cyan-400/90 font-medium">
            "{project.mission}"
          </p>
          <p className="mt-1 font-[family-name:var(--font-fira-code)] text-[10px] tracking-wide text-[#8BA3B8] opacity-85">
            {project.techSummary}
          </p>

          {/* Tech Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((item) => (
              <span
                key={item}
                className="rounded border border-cyan-400/25 px-2 py-0.5 font-[family-name:var(--font-fira-code)] text-[10px] uppercase tracking-wider text-cyan-400/70 group-hover:border-cyan-400 group-hover:text-white group-hover:shadow-[0_0_10px_rgba(0,212,255,0.25)] transition-all duration-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
