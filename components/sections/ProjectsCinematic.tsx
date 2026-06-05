"use client";

import { useState, useEffect, useRef } from "react";
import CinematicText from "@/components/ui/CinematicText";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";

function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      alphaSpeed: number;
    }> = [];

    const colors = ["rgba(0, 212, 255, ", "rgba(168, 85, 247, ", "rgba(0, 255, 136, "];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.04 - Math.random() * 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.1 + Math.random() * 0.45,
        alphaSpeed: 0.0015 + Math.random() * 0.002,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.vx = -p.vx;
        }

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.6 || p.alpha < 0.08) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-[1] h-full w-full pointer-events-none opacity-[0.35]"
    />
  );
}

export default function ProjectsCinematic() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" data-scroll-reveal className="scene-snap relative z-10 bg-transparent px-6 py-[60px] md:py-[100px] overflow-hidden">
      {/* Drifting holographic dust background particles */}
      <BackgroundCanvas />

      {/* Cyberpunk grid backdrop overlay */}
      <div className="absolute inset-0 -z-[2] grid-cyber opacity-[0.08] pointer-events-none" />

      {/* Ambient center cyan glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] -z-[2] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="mb-10 text-center md:mb-12">
          <p className="label-cinematic">Selected Work</p>
          <CinematicText className="h2-cinematic mt-3 uppercase">Projects</CinematicText>
          <p className="body-cinematic mx-auto mt-4 max-w-xl">
            AI, computer vision, and full-stack systems · Click a project for the full briefing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setSelected}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
