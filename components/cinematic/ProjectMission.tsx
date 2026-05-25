"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/lib/constants";
import ChapterIntro from "./ChapterIntro";
import ProjectVisual from "./ProjectVisual";
import MissionParticles from "@/components/effects/MissionParticles";
import CinematicText from "@/components/ui/CinematicText";

type Project = (typeof PROJECTS)[number];

type ProjectMissionProps = {
  project: Project;
  index: number;
};

export default function ProjectMission({ project, index }: ProjectMissionProps) {
  const ref = useRef<HTMLElement>(null);
  const reversed = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const posterScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.08]);
  const posterY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);
  const contentScale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.94, 1, 1, 0.96]);

  return (
    <article
      ref={ref}
      id={index === 0 ? "projects" : undefined}
      data-mission-pin
      className="scene-snap relative min-h-[70vh] lg:min-h-[85vh] w-full flex items-center justify-center py-12 md:py-16"
    >
      {/* Absolute positioned mission number at top right of card */}
      <div className="absolute top-8 right-8 font-[family-name:var(--font-orbitron)] text-[80px] font-black text-white select-none pointer-events-none opacity-[0.08] z-10">
        {project.chapter}
      </div>

      <motion.div
        style={{ scale: posterScale }}
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}
      />

      <div className="absolute inset-0 opacity-40">
        <ProjectVisual theme={project.theme} />
      </div>
      <MissionParticles />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

      <div className="relative z-10 w-full px-6 md:px-12">
        <div
          className={`mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 ${
            reversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <motion.div
            style={{ scale: posterScale, y: posterY }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.15)] shadow-[0_0_80px_rgba(0,212,255,0.08)] lg:aspect-auto lg:min-h-[440px]"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ filter: "brightness(0.5) contrast(1.1) saturate(0.7)" }}
              priority={index < 2}
            />

            {/* Cinematic Marvel-style cyan/purple color grading overlay */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(123,47,255,0.08) 100%)",
                mixBlendMode: "color"
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-cyan-950/30 mix-blend-multiply" />
            <ProjectVisual theme={project.theme} />
            <div className="poster-vignette absolute inset-0" />

            <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400/90">
              Classified · Mission {project.chapter}
            </div>
          </motion.div>

          <motion.div style={{ opacity: contentOpacity, scale: contentScale }} className="flex flex-col justify-center">
            <CinematicText
              as="h3"
              delay={0.1}
              className="font-[family-name:var(--font-orbitron)] text-5xl md:text-6xl font-bold text-white hover:[text-shadow:0_0_20px_rgba(0,212,255,0.6)] transition-all duration-300 leading-tight"
            >
              {project.title}
            </CinematicText>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="mt-3 text-sm uppercase tracking-[0.35em] text-purple-300"
            >
              {project.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="mt-4 font-light italic text-cyan-200/90"
            >
              &ldquo;{project.tagline}&rdquo;
            </motion.p>

            <div className="mt-6 max-w-xl flex flex-col gap-2">
              {(() => {
                const lines = project.description.split("\n");
                return (
                  <>
                    <p className="font-[family-name:var(--font-inter)] text-[15px] text-[#E8F4FD] italic leading-relaxed">
                      {lines[0]}
                    </p>
                    <p className="font-[family-name:var(--font-fira-code)] text-[13px] text-[#8BA3B8] leading-relaxed">
                      {lines[1]}
                    </p>
                  </>
                );
              })()}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 text-xs uppercase tracking-wider text-cyan-300/90"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </article>
  );
}
