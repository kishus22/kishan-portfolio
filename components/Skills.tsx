"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { SKILL_CATEGORIES } from "@/lib/skills";

const CARD_THEMES = [
  {
    name: "cyan",
    glowColor: "rgba(0, 212, 255, 0.45)",
    glowColorRaw: "rgb(0, 212, 255)",
    conicGradient: "conic-gradient(from_0deg,transparent_20%,#00D4FF_45%,#ffffff_50%,#00D4FF_55%,transparent_100%)",
    textColor: "text-[#00D4FF]",
    textShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
    chipBorder: "border-cyan-400/20 bg-cyan-950/10 hover:border-cyan-400 hover:bg-cyan-500/15 hover:shadow-[0_0_12px_rgba(0,212,255,0.4)]",
    spotlight: "rgba(0, 212, 255, 0.08)",
    borderRest: "border-cyan-400/10",
    boxShadowHover: "inset 0 0 30px rgba(0, 212, 255, 0.25), 0 0 40px rgba(0, 212, 255, 0.65), 0 0 70px rgba(123, 47, 255, 0.35), 0 15px 45px rgba(0,0,0,0.85)",
  },
  {
    name: "purple",
    glowColor: "rgba(123, 47, 255, 0.45)",
    glowColorRaw: "rgb(123, 47, 255)",
    conicGradient: "conic-gradient(from_0deg,transparent_20%,#7B2FFF_45%,#ffffff_50%,#7B2FFF_55%,transparent_100%)",
    textColor: "text-[#7B2FFF]",
    textShadow: "0 0 10px rgba(123, 47, 255, 0.5)",
    chipBorder: "border-[#7B2FFF]/20 bg-purple-950/10 hover:border-[#7B2FFF] hover:bg-[#7B2FFF]/15 hover:shadow-[0_0_12px_rgba(123,47,255,0.4)]",
    spotlight: "rgba(123, 47, 255, 0.08)",
    borderRest: "border-[#7B2FFF]/10",
    boxShadowHover: "inset 0 0 30px rgba(123, 47, 255, 0.25), 0 0 40px rgba(123, 47, 255, 0.55), 0 0 70px rgba(0, 212, 255, 0.45), 0 15px 45px rgba(0,0,0,0.85)",
  },
  {
    name: "green",
    glowColor: "rgba(0, 255, 136, 0.45)",
    glowColorRaw: "rgb(0, 255, 136)",
    conicGradient: "conic-gradient(from_0deg,transparent_20%,#00FF88_45%,#ffffff_50%,#00FF88_55%,transparent_100%)",
    textColor: "text-[#00FF88]",
    textShadow: "0 0 10px rgba(0, 255, 136, 0.5)",
    chipBorder: "border-[#00FF88]/20 bg-emerald-950/10 hover:border-[#00FF88] hover:bg-[#00FF88]/15 hover:shadow-[0_0_12px_rgba(0,255,136,0.4)]",
    spotlight: "rgba(0, 255, 136, 0.08)",
    borderRest: "border-[#00FF88]/10",
    boxShadowHover: "inset 0 0 30px rgba(0, 255, 136, 0.25), 0 0 40px rgba(0, 255, 136, 0.55), 0 0 70px rgba(0, 212, 255, 0.45), 0 15px 45px rgba(0,0,0,0.85)",
  },
  {
    name: "pink",
    glowColor: "rgba(236, 72, 153, 0.45)",
    glowColorRaw: "rgb(236, 72, 153)",
    conicGradient: "conic-gradient(from_0deg,transparent_20%,#EC4899_45%,#ffffff_50%,#EC4899_55%,transparent_100%)",
    textColor: "text-[#EC4899]",
    textShadow: "0 0 10px rgba(236, 72, 153, 0.5)",
    chipBorder: "border-pink-400/20 bg-pink-950/10 hover:border-pink-400 hover:bg-pink-500/15 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)]",
    spotlight: "rgba(236, 72, 153, 0.08)",
    borderRest: "border-[#EC4899]/10",
    boxShadowHover: "inset 0 0 30px rgba(236, 72, 153, 0.25), 0 0 40px rgba(236, 72, 153, 0.55), 0 0 70px rgba(123, 47, 255, 0.45), 0 15px 45px rgba(0,0,0,0.85)",
  }
];

function SkillCard({ cat, index }: { cat: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
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
    setIsHovered(true);
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
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

  const theme = CARD_THEMES[index % CARD_THEMES.length];

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
      {/* 1. Blinding Neutron Star Collision Backing Glow */}
      <div 
        className="absolute -inset-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0 group-hover:scale-125 animate-breathe-glow"
        style={{
          background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.85) 0%, ${theme.glowColor} 30%, transparent 70%)`,
        }}
      />

      {/* 2. Soft Bloom Lighting and Depth Shadows under card */}
      <div className="absolute inset-2 bg-black/60 rounded-xl blur-md -z-10 group-hover:blur-xl transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.85)]" />

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

      {/* Main Upgraded Card with Conic border sweep */}
      <div 
        className="skills-card h-full rounded-xl p-[1.5px] relative overflow-hidden transition-all duration-500 z-10 flex flex-col"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Conic border sweep container with neutron star flare sweep */}
        <div className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" style={{ padding: '1.5px' }}>
          <div 
            className="absolute inset-0 animate-[spin_3s_linear_infinite]"
            style={{
              background: theme.conicGradient,
            }}
          />
        </div>
        
        {/* Inner Card Panel content */}
        <div 
          className={`w-full h-full rounded-[11.5px] p-6 relative overflow-hidden bg-[#080D1A]/95 group-hover:bg-[#0C152B]/98 z-10 flex flex-col border ${theme.borderRest} group-hover:border-transparent transition-colors duration-500`}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: isHovered ? theme.boxShadowHover : "inset 0 0 12px rgba(255, 255, 255, 0.01), 0 4px 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Custom spotlight reflections */}
          <motion.div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background: `radial-gradient(circle 200px at ${highlightX} ${highlightY}, ${theme.spotlight} 0%, rgba(123, 47, 255, 0.02) 50%, transparent 100%)`
            }}
          />

          {/* Gloss Glass reflection sweep */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute top-0 left-0 w-[200%] h-full bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.03)_45%,rgba(0,212,255,0.06)_50%,transparent_55%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>

          {/* Shimmer Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10 opacity-30 group-hover:opacity-60 transition-opacity">
            <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-card-scanline" />
          </div>

          {/* Content category - Floating layer */}
          <h3 
            className={`font-[family-name:var(--font-fira-code)] text-[11px] tracking-[0.15em] uppercase mb-4 z-10 select-none ${theme.textColor}`}
            style={{ 
              marginBottom: "16px",
              transform: "translateZ(20px)",
              textShadow: theme.textShadow
            }}
          >
            {cat.category}
          </h3>
          
          {/* Chips list - Floating layer */}
          <div 
            className="flex flex-wrap gap-2.5 z-10"
            style={{
              transform: "translateZ(10px)",
            }}
          >
            {cat.skills.map((skill: string) => (
              <span 
                key={skill} 
                className={`skill-chip relative rounded-[6px] px-[14px] py-[6px] font-[family-name:var(--font-inter)] text-[13px] text-[#E8F4FD] border bg-opacity-[0.1] transition-all duration-300 select-none inline-block hover:scale-105 ${theme.chipBorder}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section 
      id="skills" 
      data-scroll-reveal 
      className="scene-snap relative z-10 px-6 py-20"
    >
      <div className="mx-auto max-w-7xl relative z-10">
        {/* HUD Indicator */}
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
