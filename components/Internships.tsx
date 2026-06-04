"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { INTERNSHIPS } from "@/lib/constants";

function InternshipCard({ intern, index }: { intern: any; index: number }) {
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
      className="perspective-1000 h-full relative group/glow"
    >
      {/* 1. Large Cyan/Purple Ambient Glow & Bloom spilling continuously into section background */}
      <div 
        className="absolute -inset-28 rounded-full blur-3xl opacity-40 group-hover/glow:opacity-100 transition-all duration-700 pointer-events-none z-0 group-hover/glow:scale-110 animate-breathe-glow"
        style={{
          background: index % 2 === 0
            ? "radial-gradient(circle, rgba(0, 212, 255, 0.26) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%)"
        }}
      />

      {/* Volumetric background light diffusion */}
      <div className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05)_0%,transparent_70%)] rounded-xl blur-xl pointer-events-none -z-10" />

      {/* Soft bloom lighting under card & depth shadow */}
      <div className="absolute inset-2 bg-black/60 rounded-xl blur-md -z-10 group-hover/glow:blur-xl transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group-hover/glow:shadow-[0_25px_60px_rgba(0,212,255,0.15)]" />

      {/* 2. Floating holographic particles local to card */}
      <div className="absolute -inset-6 overflow-hidden pointer-events-none z-20 opacity-0 group-hover/glow:opacity-100 transition-opacity duration-500">
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
              y: [0, -35, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.3, 1],
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

      {/* 3. AI System Pulse Node on the card edge (network node visual) */}
      <div className="absolute -left-1.5 top-10 flex h-4 w-4 items-center justify-center z-30">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_#00D4FF]"></span>
      </div>

      {/* Main card body */}
      <div 
        className="relative h-full rounded-xl border border-cyan-400/20 group-hover/glow:border-cyan-400/60 bg-[#080D1A]/95 group-hover/glow:bg-[#0C152B]/98 p-8 transition-all duration-500 flex flex-col justify-between overflow-hidden group-hover/glow:shadow-[0_0_50px_rgba(0,212,255,0.3),inset_0_0_20px_rgba(0,212,255,0.1)] z-10"
        style={{ 
          backdropFilter: "blur(12px)", 
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: index % 2 === 0
            ? "inset 0 0 30px rgba(0, 212, 255, 0.14), 0 10px 40px rgba(0,0,0,0.6)"
            : "inset 0 0 30px rgba(123, 47, 255, 0.12), 0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* 4. Cyan and purple environmental reflections */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/glow:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(circle 200px at ${highlightX} ${highlightY}, rgba(0, 212, 255, 0.08) 0%, rgba(123, 47, 255, 0.04) 50%, transparent 100%)`
          }}
        />

        {/* 5. Animated border energy sweep */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ borderRadius: "12px" }}>
          <defs>
            <linearGradient id="internPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
            stroke="url(#internPulseGrad)"
            strokeWidth="1.5"
            strokeDasharray="90 350"
            className="animate-border-sweep opacity-0 group-hover/glow:opacity-100 transition-opacity duration-500"
          />
        </svg>

        {/* Diagonal Light Streaks sweep */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            initial={{ left: "-150%", top: "-150%" }}
            animate={{ left: "150%", top: "150%" }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 3,
              delay: index * 1.5,
            }}
            className="absolute w-[60%] h-[300%] bg-gradient-to-r from-transparent via-cyan-400/8 to-transparent rotate-[30deg] transform -translate-y-1/2"
          />
        </div>

        {/* Top Edge Light Sweep */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear",
            delay: index * 1.5,
          }}
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"
        />

        {/* Left vertical Accent bar */}
        <motion.div 
          animate={{ opacity: [0.5, 1.0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#00D4FF] to-[#7B2FFF] rounded-l-xl z-20"
        />

        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div>
            {/* Top Row: Company & Period */}
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-[family-name:var(--font-orbitron)] text-xl font-bold text-white group-hover/glow:text-cyan-200 transition-colors duration-300">
                {intern.company}
              </h3>
              <span className="font-[family-name:var(--font-fira-code)] text-xs text-[#00D4FF] bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.25)] rounded px-3 py-1 tracking-wider shadow-[0_0_10px_rgba(0,212,255,0.15)]">
                {intern.period}
              </span>
            </div>

            {/* Second Row: Role */}
            <div className="mt-3 flex items-center gap-3">
              <p className="font-[family-name:var(--font-orbitron)] text-sm uppercase tracking-[0.25em] text-purple-300">
                {intern.role}
              </p>
              <span className="font-[family-name:var(--font-fira-code)] text-[10px] text-cyan-400/60 uppercase tracking-widest">
                · {intern.company === "Contriver" ? "Bangalore, IN" : "Remote"}
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 leading-relaxed text-gray-400 font-[family-name:var(--font-inter)] text-[14px]">
              {intern.description}
            </p>
          </div>

          <div className="mt-8">
            {/* Skills chip list */}
            <div className="flex flex-wrap gap-2">
              {intern.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="rounded-[6px] border border-[rgba(0,212,255,0.25)] bg-[rgba(0,212,255,0.06)] px-[14px] py-[6px] font-[family-name:var(--font-inter)] text-[12px] text-[#E8F4FD] transition-all duration-200 hover:border-[#00D4FF] hover:bg-[rgba(0,212,255,0.12)] hover:shadow-[0_0_12px_rgba(0,212,255,0.4)] select-none hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Status badge */}
            <div className="mt-6 flex items-center justify-between">
              <span className="font-[family-name:var(--font-fira-code)] text-[10px] text-[#00FF88] bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.25)] rounded px-2.5 py-1 tracking-widest uppercase shadow-[0_0_10px_rgba(0,255,136,0.1)]">
                MISSION COMPLETE
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Internships() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 9 + Math.random() * 9,
        delay: Math.random() * -9,
      }))
    );
  }, []);

  return (
    <section 
      id="internships" 
      data-scroll-reveal
      className="scene-snap relative z-10 px-6 py-20 overflow-hidden bg-black"
    >
      {/* Ambient Section Spotlight Lighting */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle 600px at 50% 50%, rgba(123,47,255,0.06) 0%, rgba(0,212,255,0.04) 50%, transparent 100%)"
        }}
      />

      {/* Floating particles */}
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
              y: [0, -100, 0],
              opacity: [0.1, 0.6, 0.1],
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

      <div className="mx-auto max-w-5xl relative z-10">
        
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
            ACT V · MISSION LOG
          </p>
          <h2 
            className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-bold md:text-5xl uppercase tracking-wider text-white"
            style={{ textShadow: "0 0 35px rgba(0, 212, 255, 0.7)" }}
          >
            INTERNSHIPS
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-400 font-[family-name:var(--font-inter)] text-xs uppercase tracking-widest">
            Professional Mission Log & Career Operations Center
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline connector line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-6 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-[#00D4FF] via-[#7B2FFF] to-transparent hidden md:block"
            style={{
              boxShadow: "0 0 10px rgba(0, 212, 255, 0.2)",
            }}
          />

          <div className="grid gap-10 md:grid-cols-2 md:pl-20">
            {INTERNSHIPS.map((intern, index) => (
              <motion.div
                key={intern.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="h-full"
              >
                <InternshipCard intern={intern} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
