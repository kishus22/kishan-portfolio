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
      className="scene-snap relative min-h-[100svh] w-full"
    >
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

      <div className="relative z-10 flex min-h-[100svh] items-center px-6 py-24">
        <div
          className={`mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 ${
            reversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <motion.div
            style={{ scale: posterScale, y: posterY }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_100px_rgba(0,255,255,0.12)] lg:aspect-auto lg:min-h-[480px]"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={index < 2}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-cyan-950/30 mix-blend-multiply" />
            <ProjectVisual theme={project.theme} />
            <div className="poster-vignette absolute inset-0" />

            <div className="absolute bottom-6 left-6 font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400/90">
              Classified · Mission {project.chapter}
            </div>
          </motion.div>

          <motion.div style={{ opacity: contentOpacity, scale: contentScale }}>
            <ChapterIntro chapter={project.chapter} codename={project.codename} />

            <CinematicText
              as="h3"
              delay={0.1}
              className="font-[family-name:var(--font-orbitron)] text-3xl font-black leading-tight text-white md:text-5xl"
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

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.9 }}
              className="mt-6 max-w-xl leading-relaxed text-gray-400"
            >
              {project.description}
            </motion.p>

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
