"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { EDUCATION } from "@/lib/constants";

const SPECS = ["AI & Machine Learning", "Computer Vision", "Deep Learning", "Full-Stack"];

function EducationCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Motion Values
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  // Maps coordinates to rotation angles
  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);
  
  const springConfig = { damping: 20, stiffness: 180, mass: 0.6 };
  const rXSpring = useSpring(rotateX, springConfig);
  const rYSpring = useSpring(rotateY, springConfig);
  
  // Reflections
  const highlightX = useTransform(x, [0, 1], ["0%", "100%"]);
  const highlightY = useTransform(y, [0, 1], ["0%", "100%"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
  };
  
  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Holographic particles local to this card
  const [localParticles, setLocalParticles] = useState<any[]>([]);
  useEffect(() => {
    setLocalParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 1.5 + Math.random() * 2,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * -6,
      }))
    );
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rXSpring,
        rotateY: rYSpring,
        transformStyle: "preserve-3d",
      }}
      className="perspective-1000 md:ml-20 relative group"
    >
      {/* 1. Large Cyan Atmospheric Bloom & Holographic glow spilling widely behind the degree card */}
      <div className="absolute -inset-28 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.26)_0%,transparent_70%)] blur-3xl pointer-events-none opacity-45 group-hover:opacity-100 transition-opacity duration-700 -z-10 group-hover:scale-105 animate-breathe-glow" />

      {/* Volumetric light fog behind card */}
      <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,rgba(123,47,255,0.04)_60%,transparent_100%)] rounded-xl blur-2xl pointer-events-none -z-10 animate-pulse-glow" />

      {/* Soft Bloom & Depth shadows */}
      <div className="absolute inset-2 bg-black/60 rounded-xl blur-md -z-10 group-hover:blur-xl transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group-hover:shadow-[0_25px_60px_rgba(0,212,255,0.15)]" />

      {/* Floating data particles local to card */}
      <div className="absolute -inset-6 overflow-hidden pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {localParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/40 blur-[0.5px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -45, 0],
              opacity: [0.1, 0.75, 0.1],
              scale: [1, 1.35, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main command-panel card body */}
      <div 
        className="relative z-10 rounded-xl p-8 border border-cyan-400/20 group-hover:border-cyan-400/60 transition-all duration-500 bg-[#080D1A]/95 group-hover:bg-[#0C152B]/98 flex flex-col justify-between group-hover:scale-[1.03] group-hover:shadow-[0_0_50px_rgba(0,212,255,0.35),0_0_100px_rgba(123,47,255,0.15),inset_0_0_20px_rgba(0,212,255,0.1)]"
        style={{ 
          backdropFilter: "blur(12px)", 
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "inset 0 0 35px rgba(0, 212, 255, 0.15), 0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Environmental Reflections */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(circle 250px at ${highlightX} ${highlightY}, rgba(0, 212, 255, 0.08) 0%, rgba(123, 47, 255, 0.04) 50%, transparent 100%)`
          }}
        />

        {/* Moving Scan-line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10 opacity-30 group-hover:opacity-60 transition-opacity">
          <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent animate-card-scanline" />
        </div>

        {/* Animated Light Streaks (diagonal sweep) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
          <motion.div
            initial={{ left: "-150%", top: "-150%" }}
            animate={{ left: "150%", top: "150%" }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2
            }}
            className="absolute w-[60%] h-[300%] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent rotate-[35deg] transform -translate-y-1/2"
          />
        </div>

        {/* SVG Border sweep animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ borderRadius: "12px" }}>
          <defs>
            <linearGradient id="eduPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="1" />
              <stop offset="40%" stopColor="#7B2FFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x="0.5"
            y="0.5"
            width="100%"
            height="100%"
            rx="12"
            fill="none"
            stroke="url(#eduPulseGrad)"
            strokeWidth="1.5"
            strokeDasharray="100 400"
            className="animate-border-sweep opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </svg>

        <div className="flex flex-wrap gap-3 items-center justify-between z-10">
          {/* Year badge */}
          <span className="font-[family-name:var(--font-fira-code)] text-xs text-[#00D4FF] bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.25)] rounded px-3 py-1 tracking-wider shadow-[0_0_10px_rgba(0,212,255,0.15)]">
            {EDUCATION.period}
          </span>

          {/* CGPA badge with pulse glow */}
          <span className="font-[family-name:var(--font-fira-code)] text-xs text-[#00FF88] bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.25)] rounded px-3 py-1 tracking-wider shadow-[0_0_12px_rgba(0,255,136,0.25)]">
            CGPA 7.9 / 10.0
          </span>
        </div>

        {/* Degree */}
        <h3 className="mt-6 font-[family-name:var(--font-orbitron)] text-[22px] font-bold text-white tracking-wide group-hover:text-cyan-200 transition-colors duration-300 z-10">
          {EDUCATION.degree}
        </h3>

        {/* University */}
        <p className="mt-3 font-[family-name:var(--font-inter)] text-sm text-[#8BA3B8] z-10">
          Jawaharlal Nehru National College of Engineering (JNNCE) · {EDUCATION.university}
        </p>

        {/* Specialization Tags */}
        <div className="mt-8 flex flex-wrap gap-2.5 z-10">
          {SPECS.map((tag) => (
            <span
              key={tag}
              className="rounded-[6px] border border-[rgba(0,212,255,0.25)] bg-[rgba(0,212,255,0.06)] px-[14px] py-[6px] font-[family-name:var(--font-inter)] text-[13px] text-[#E8F4FD] transition-all duration-200 hover:border-[#00D4FF] hover:bg-[rgba(0,212,255,0.12)] hover:shadow-[0_0_12px_rgba(0,212,255,0.4)] hover:scale-105 select-none"
            >
              {tag}
            </span>
          ))}
        </div>

        <ul className="mt-8 space-y-4 z-10">
          {EDUCATION.highlights.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex gap-3 text-gray-300 text-[15px]"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_#00ffff]" />
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Education() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2.0 + Math.random() * 2.5,
        duration: 8 + Math.random() * 8,
        delay: Math.random() * -8,
      }))
    );
  }, []);

  return (
    <section 
      id="education" 
      data-scroll-reveal
      className="scene-snap relative z-10 px-6 py-20 overflow-hidden bg-black"
    >
      {/* Cyan & Purple Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle 600px at 50% 55%, rgba(0,212,255,0.08) 0%, rgba(123,47,255,0.04) 60%, transparent 100%)"
        }}
      />

      {/* Floating Light Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden md:block hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/40 blur-[0.5px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -90, 0],
              opacity: [0.15, 0.65, 0.15],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Holographic Data Streams / Volumetric Fog */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <motion.div
          animate={{ opacity: [0.03, 0.12, 0.03] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          className="absolute left-[25%] top-0 bottom-0 w-[0.5px] bg-[#00D4FF]"
        />
        <motion.div
          animate={{ opacity: [0.03, 0.12, 0.03] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute left-[75%] top-0 bottom-0 w-[0.5px] bg-[#00D4FF]"
        />
        <div className="absolute -left-1/4 -right-1/4 top-0 bottom-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(0,212,255,0.06)_0%,transparent_80%)] blur-2xl mix-blend-screen" />
      </div>

      <div className="mx-auto max-w-4xl relative z-10">
        
        {/* Cinematic horizontal divider BEFORE section title */}
        <div className="w-full flex justify-center mb-12">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="font-[family-name:var(--font-fira-code)] text-[11px] uppercase tracking-[0.2em] text-cyan-400">
            ACT IV · KNOWLEDGE ARCHIVE
          </p>
          <h2 
            className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-bold md:text-5xl uppercase tracking-wider text-white"
            style={{ textShadow: "0 0 35px rgba(0, 212, 255, 0.7)" }}
          >
            EDUCATION
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-400 font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest">
            Future University Database & Academic Intelligence
          </p>
        </motion.div>

        <div className="relative">
          {/* Dual energy timeline connector beams */}
          <div className="absolute left-[21px] top-0 bottom-0 w-[6px] bg-cyan-500/10 blur-[1.5px] hidden md:block" />
          <div className="absolute left-[19px] top-0 bottom-0 w-[10px] bg-cyan-500/5 blur-[3px] hidden md:block" />
          
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-6 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-[#00D4FF] via-[#7B2FFF] to-transparent hidden md:block"
            style={{
              boxShadow: "0 0 15px rgba(0, 212, 255, 0.6)",
            }}
          />

          {/* Energy Pulse 1 traveling down timeline */}
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-[21px] w-2.5 h-16 bg-gradient-to-b from-cyan-400 via-[#7B2FFF] to-transparent rounded-full shadow-[0_0_15px_#00D4FF] z-10 hidden md:block"
          />

          {/* Energy Pulse 2 (offset delay for dual timeline pulse visual) */}
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{
              duration: 6.0,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.0
            }}
            className="absolute left-[21px] w-2.5 h-16 bg-gradient-to-b from-purple-400 via-cyan-400 to-transparent rounded-full shadow-[0_0_12px_#a855f7] z-10 hidden md:block"
          />

          {/* Timeline node that emits light */}
          <div className="absolute left-3 top-[30px] hidden md:block z-20">
            <motion.div
              animate={{ 
                scale: [1, 1.25, 1],
                boxShadow: [
                  "0 0 15px rgba(0, 212, 255, 0.5), 0 0 30px rgba(0, 212, 255, 0.3)",
                  "0 0 35px rgba(0, 212, 255, 0.9), 0 0 70px rgba(0, 212, 255, 0.6)",
                  "0 0 15px rgba(0, 212, 255, 0.5), 0 0 30px rgba(0, 212, 255, 0.3)",
                ]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-7 w-7 rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center"
            >
              <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
            </motion.div>
          </div>

          <EducationCard />
        </div>
      </div>
    </section>
  );
}
