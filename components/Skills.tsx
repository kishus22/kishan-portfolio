"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { SKILL_CATEGORIES } from "@/lib/skills";

function SkillCard({ cat, index }: { cat: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Motion Values
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  // Maps coordinates to rotation angles
  const rotateX = useTransform(y, [0, 1], [12, -12]);
  const rotateY = useTransform(x, [0, 1], [-12, 12]);
  
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
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 1.5 + Math.random() * 2,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * -5,
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
      className="perspective-1000 h-full w-full relative group"
    >
      {/* 1. Large Ambient Cyan Glow & Bloom spilling continuously into surrounding section background */}
      <div 
        className="absolute -inset-24 rounded-full blur-3xl opacity-40 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0 group-hover:scale-110 animate-breathe-glow"
        style={{
          background: index % 2 === 0
            ? "radial-gradient(circle at center, rgba(0, 212, 255, 0.28) 0%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(168, 85, 247, 0.22) 0%, transparent 70%)",
        }}
      />

      {/* 2. Soft Bloom Lighting and Depth Shadows under card */}
      <div className="absolute inset-2 bg-black/60 rounded-xl blur-md -z-10 group-hover:blur-xl transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group-hover:shadow-[0_25px_60px_rgba(0,212,255,0.15)]" />

      {/* 3. Floating Holographic Particles around the card */}
      <div className="absolute -inset-8 overflow-hidden pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
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
              y: [0, -40, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.4, 1],
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

      {/* Main Upgraded Card */}
      <div 
        className="skills-card h-full rounded-xl p-6 relative overflow-hidden transition-all duration-500 bg-[#080D1A]/95 group-hover:bg-[#0C152B]/98 border border-cyan-400/20 group-hover:border-cyan-400/60 z-10 flex flex-col group-hover:shadow-[inset_0_0_25px_rgba(0,212,255,0.12)]"
        style={{
          boxShadow: index % 2 === 0
            ? "inset 0 0 35px rgba(0, 212, 255, 0.16), 0 10px 30px rgba(0,0,0,0.6)"
            : "inset 0 0 35px rgba(123, 47, 255, 0.14), 0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        {/* 4. Cyan and purple environmental reflections */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(circle 200px at ${highlightX} ${highlightY}, rgba(0, 212, 255, 0.08) 0%, rgba(123, 47, 255, 0.04) 50%, transparent 100%)`
          }}
        />

        {/* Shimmer Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10 opacity-30 group-hover:opacity-60 transition-opacity">
          <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-card-scanline" />
        </div>

        {/* 5. SVG Neon Border Sweep / Energy Pulse */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ borderRadius: "12px" }}>
          <rect
            x="0.5"
            y="0.5"
            width="100%"
            height="100%"
            rx="12"
            fill="none"
            stroke="url(#skillPulseGrad)"
            strokeWidth="1.5"
            strokeDasharray="80 300"
            className="animate-border-sweep opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </svg>

        {/* Content */}
        <h3 className="font-[family-name:var(--font-fira-code)] text-[11px] text-[#00D4FF] tracking-[0.15em] uppercase mb-4 z-10" style={{ marginBottom: "16px" }}>
          {cat.category}
        </h3>
        <div className="flex flex-wrap gap-2 z-10">
          {cat.skills.map((skill: string) => (
            <span 
              key={skill} 
              className="skill-chip rounded-[6px] px-[14px] py-[6px] font-[family-name:var(--font-inter)] text-[13px] text-[#E8F4FD] transition-all duration-200 select-none inline-block hover:scale-105"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 12 + Math.random() * 14,
        delay: Math.random() * -12,
      }))
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section 
      id="skills" 
      data-scroll-reveal 
      onMouseMove={handleMouseMove}
      className="scene-snap relative z-10 px-6 py-20 overflow-hidden bg-black"
    >
      {/* Large Ambient Cyan Glow */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.18)_0%,transparent_75%)] blur-3xl pointer-events-none z-0"
      />
      {/* Large Ambient Purple Glow */}
      <div 
        className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(123,47,255,0.12)_0%,transparent_75%)] blur-3xl pointer-events-none z-0"
      />

      {/* Moving Spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-90"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, rgba(0, 212, 255, 0.14) 0%, rgba(123, 47, 255, 0.08) 50%, transparent 100%)`,
        }}
      />

      {/* Floating Cyan Light Orb */}
      <motion.div
        animate={{
          x: [0, 90, -50, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.18)_0%,transparent_70%)] blur-3xl pointer-events-none z-0"
      />

      {/* Animated Light Sweep / Volumetric Effect */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 9.0,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent skew-x-12 pointer-events-none z-0"
      />

      {/* Holographic Reflections overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[linear-gradient(45deg,rgba(0,212,255,0.5)_25%,transparent_25%),linear-gradient(-45deg,rgba(0,212,255,0.5)_25%,transparent_25%)] bg-[size:40px_40px]" />

      {/* Animated Neural Connections SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.2] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neuralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7B2FFF" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="neuralGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7B2FFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="skillPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="1" />
            <stop offset="30%" stopColor="#7B2FFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 50 150 Q 250 80 450 220 T 850 120 T 1200 200"
          fill="none"
          stroke="url(#neuralGrad1)"
          strokeWidth="1.5"
          strokeDasharray="8 4"
          animate={{ strokeDashoffset: [0, -60] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 150 550 Q 450 400 650 620 T 1050 450"
          fill="none"
          stroke="url(#neuralGrad2)"
          strokeWidth="1.5"
          strokeDasharray="12 6"
          animate={{ strokeDashoffset: [0, 80] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Subtle Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 md:block hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/40 blur-[1px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.15, 0.7, 0.15],
              scale: [1, 1.4, 1],
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

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="absolute -top-4 right-6 hidden md:block opacity-60 font-[family-name:var(--font-fira-code)] text-[10px] text-[rgba(0,212,255,0.7)] bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px] border border-[rgba(0,212,255,0.2)] rounded px-[10px] py-[6px] uppercase tracking-widest">
          SYSTEM_SYNC: ACTIVE
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-[family-name:var(--font-fira-code)] text-[11px] uppercase tracking-[0.2em] text-cyan-400">
            ACT III · SKILLS MATRIX
          </p>
          <h2 
            className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-bold md:text-5xl uppercase tracking-wider text-white"
            style={{ textShadow: "0 0 35px rgba(0, 212, 255, 0.8)" }}
          >
            SKILLS MATRIX
          </h2>
          <div className="mt-3 flex justify-center w-full">
            <div className="w-32 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                whileInView={{ x: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-[1px] w-full bg-gradient-to-r from-[#00D4FF] via-[#7B2FFF] to-transparent"
              />
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-lg text-gray-400 font-[family-name:var(--font-inter)] text-sm">
            AI Knowledge Core & Interactive Technology Matrix
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className="h-full relative"
            >
              <SkillCard cat={cat} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
