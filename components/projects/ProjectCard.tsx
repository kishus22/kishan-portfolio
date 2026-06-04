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
            ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(10px)`
            : undefined,
        }}
        className="project-card-tilt group relative flex h-[380px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-[rgba(2,4,9,0.85)] transition-[border-color,box-shadow,transform] duration-300 hover:border-cyan-400/50 max-md:!transform-none max-md:h-auto max-md:min-h-[320px]"
      >
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 280px at ${spot.x}% ${spot.y}%, rgba(0,212,255,0.14) 0%, transparent 65%)`,
          }}
        />

        <div className="relative min-h-[200px] flex-1 overflow-hidden">
          <Image
            src={project.image}
            alt={project.name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ filter: "brightness(0.5) contrast(1.1) saturate(0.7)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,4,9,0.95)_40%,rgba(2,4,9,0.2)_100%)]" />
          <span className="absolute right-4 top-4 z-[3] rounded border border-cyan-400/40 px-2 py-0.5 font-[family-name:var(--font-fira-code)] text-[11px] text-[#00d4ff]">
            {project.year}
          </span>
        </div>

        <div className="relative z-[3] mt-auto p-5">
          <h3 className="font-[family-name:var(--font-orbitron)] text-xl font-semibold leading-snug text-white group-hover:text-cyan-200">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 font-[family-name:var(--font-fira-code)] text-xs leading-relaxed text-[#8BA3B8]">
            {project.overview}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((item) => (
              <span
                key={item}
                className="rounded border border-cyan-400/25 px-2 py-0.5 font-[family-name:var(--font-fira-code)] text-[10px] uppercase tracking-wider text-cyan-400/90"
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
