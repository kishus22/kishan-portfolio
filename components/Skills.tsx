"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CinematicText from "@/components/ui/CinematicText";

// Deterministic pseudo-random generator to guarantee identical server and client outputs
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Define Skills data and themes matching the portfolio colors
interface SkillCategory {
  category: string;
  icon: string;
  skills: string[];
  color: string;
  glowColor: string;
  borderColor: string;
  conicGradient: string;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Languages",
    icon: "⚡",
    skills: ["Python", "JavaScript", "SQL"],
    color: "#00ffff",
    glowColor: "rgba(0, 255, 255, 0.4)",
    borderColor: "rgba(0, 255, 255, 0.15)",
    conicGradient: "conic-gradient(from 0deg, transparent 40%, #00ffff 50%, transparent 60%)",
  },
  {
    category: "Frontend",
    icon: "🖥️",
    skills: ["React.js", "HTML5", "CSS3", "Tailwind CSS", "Next.js"],
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    borderColor: "rgba(236, 72, 153, 0.15)",
    conicGradient: "conic-gradient(from 0deg, transparent 40%, #ec4899 50%, transparent 60%)",
  },
  {
    category: "Backend",
    icon: "⚙️",
    skills: ["Node.js", "Flask", "FastAPI", "Django", "REST APIs"],
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)",
    borderColor: "rgba(168, 85, 247, 0.15)",
    conicGradient: "conic-gradient(from 0deg, transparent 40%, #a855f7 50%, transparent 60%)",
  },
  {
    category: "Machine Learning & AI",
    icon: "🧠",
    skills: ["TensorFlow", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "Computer Vision"],
    color: "#00ff88",
    glowColor: "rgba(0, 255, 136, 0.4)",
    borderColor: "rgba(0, 255, 136, 0.15)",
    conicGradient: "conic-gradient(from 0deg, transparent 40%, #00ff88 50%, transparent 60%)",
  },
  {
    category: "Databases",
    icon: "🗄️",
    skills: ["MySQL", "PostgreSQL", "MongoDB"],
    color: "#ffaa00",
    glowColor: "rgba(255, 170, 0, 0.4)",
    borderColor: "rgba(255, 170, 0, 0.15)",
    conicGradient: "conic-gradient(from 0deg, transparent 40%, #ffaa00 50%, transparent 60%)",
  },
  {
    category: "DevOps & Tools",
    icon: "🚀",
    skills: ["Git", "GitHub", "Docker", "GitHub Actions", "CI/CD", "VS Code"],
    color: "#00d4ff",
    glowColor: "rgba(0, 212, 255, 0.4)",
    borderColor: "rgba(0, 212, 255, 0.15)",
    conicGradient: "conic-gradient(from 0deg, transparent 40%, #00d4ff 50%, transparent 60%)",
  },
  {
    category: "Automation & Testing",
    icon: "🔬",
    skills: ["PyTest", "Postman", "API Testing", "Unit Testing", "Regression Testing"],
    color: "#ff4b4b",
    glowColor: "rgba(255, 75, 75, 0.4)",
    borderColor: "rgba(255, 75, 75, 0.15)",
    conicGradient: "conic-gradient(from 0deg, transparent 40%, #ff4b4b 50%, transparent 60%)",
  },
];

// Interactive 3D tilt card component
function SkillCard({ cat, index }: { cat: SkillCategory; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 15 });
  const springY = useSpring(y, { stiffness: 120, damping: 15 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);

    const spotX = ((e.clientX - rect.left) / width) * 100;
    const spotY = ((e.clientY - rect.top) / height) * 100;
    setCoords({ x: spotX, y: spotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Generate unique deterministic path trajectories for background energy dots
  const dots = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const seed = index * 30 + i * 5;
      return {
        id: i,
        size: seededRandom(seed) * 2 + 1,
        x: seededRandom(seed + 1) * 80 + 10,
        y: seededRandom(seed + 2) * 80 + 10,
        duration: seededRandom(seed + 3) * 4 + 4,
        delay: seededRandom(seed + 4) * -6,
      };
    });
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full rounded-2xl p-[1.2px] overflow-hidden group cursor-pointer transition-all duration-300"
    >
      {/* 1. Conic border sweep on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: cat.conicGradient,
          padding: "1.2px",
        }}
      >
        <div className="absolute inset-0 bg-transparent animate-[spin_4s_linear_infinite]" />
      </div>

      {/* 2. Soft glow backdrop */}
      <div
        className="absolute -inset-10 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none blur-2xl"
        style={{
          background: `radial-gradient(circle, ${cat.color}2b 0%, transparent 70%)`,
        }}
      />

      {/* 3. Floating energy dots in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-500">
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              backgroundColor: cat.color,
              filter: `drop-shadow(0 0 6px ${cat.color})`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, (seededRandom(index * 30 + dot.id * 5 + 10) * 10 - 5), 0],
              opacity: [0.15, 0.85, 0.15],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Inner card panel content */}
      <div
        className="w-full h-full rounded-[14.5px] p-6 relative overflow-hidden bg-[#080D1A]/95 group-hover:bg-[#0C152B]/98 z-10 border border-white/5 transition-colors duration-500 flex flex-col justify-between"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `0 15px 35px rgba(0,0,0,0.65), inset 0 0 20px ${cat.color}12`
            : "inset 0 0 10px rgba(255, 255, 255, 0.01), 0 5px 15px rgba(0, 0, 0, 0.55)",
        }}
      >
        {/* Mouse spotlight reflection */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(circle 180px at ${coords.x}% ${coords.y}%, ${cat.color}15 0%, transparent 70%)`,
          }}
        />

        {/* Categories content layout */}
        <div className="relative z-10 flex flex-col gap-4" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-3">
            <span className="text-xl" style={{ textShadow: `0 0 10px ${cat.color}` }}>{cat.icon}</span>
            <h3
              className="font-[family-name:var(--font-orbitron)] text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-300"
              style={{
                color: isHovered ? cat.color : "#ffffff",
                textShadow: isHovered ? `0 0 10px ${cat.color}60` : "none",
              }}
            >
              {cat.category}
            </h3>
          </div>

          {/* Glowing tech chips */}
          <div className="flex flex-wrap gap-2 mt-2" style={{ transform: "translateZ(10px)" }}>
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="skill-chip relative rounded-[6px] px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs text-[#E8F4FD] transition-all duration-300 border"
                style={{
                  borderColor: `${cat.color}25`,
                  backgroundColor: `${cat.color}08`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cat.color;
                  e.currentTarget.style.backgroundColor = `${cat.color}18`;
                  e.currentTarget.style.boxShadow = `0 0 10px ${cat.color}35`;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${cat.color}25`;
                  e.currentTarget.style.backgroundColor = `${cat.color}08`;
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    setMousePos({
      x: (clientX / width - 0.5) * 30, // Offset translation shift
      y: (clientY / height - 0.5) * 30,
    });
  };

  // Generate deterministic parallax background stars
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const seed = i * 15;
      return {
        id: i,
        size: seededRandom(seed) * 2 + 0.8,
        x: seededRandom(seed + 1) * 100,
        y: seededRandom(seed + 2) * 100,
        opacity: seededRandom(seed + 3) * 0.4 + 0.2,
        duration: seededRandom(seed + 4) * 3 + 2,
      };
    });
  }, []);

  return (
    <section
      id="skills"
      data-scroll-reveal
      onMouseMove={handleMouseMove}
      className="scene-snap relative z-10 px-6 py-20 bg-transparent overflow-hidden"
    >
      {/* Parallax background grid & glow wave */}
      <div 
        className="absolute inset-0 grid-cyber opacity-[0.06] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
        }}
      />
      <div className="absolute top-[30%] left-[20%] w-[60%] h-[60%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating background parallax particles (complementary to the main portal) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out z-0"
        style={{
          transform: `translate3d(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px, 0)`,
        }}
      >
        {backgroundStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-cyan-400/30"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Moving background light streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
        <div className="absolute top-0 left-[-50%] w-[200%] h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent skew-y-12 animate-[light-streak_12s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] right-[-50%] w-[200%] h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent -skew-y-12 animate-[light-streak_16s_ease-in-out_infinite_delay-2s]" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        {/* HUD Indicator */}
        <div className="absolute -top-4 right-6 hidden md:block opacity-60 font-[family-name:var(--font-fira-code)] text-[10px] text-[rgba(0,212,255,0.7)] bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px] border border-[rgba(0,212,255,0.2)] rounded px-[10px] py-[6px] uppercase tracking-widest">
          INTERFACE_SYNC: STABLE
        </div>

        {/* Section title & subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="font-[family-name:var(--font-fira-code)] text-[10px] uppercase tracking-[0.25em] text-[#00d4ff]">
            ACT IV · CAPABILITIES
          </p>
          <CinematicText className="h2-cinematic mt-4 uppercase">
            SKILLS MATRIX
          </CinematicText>
          <div className="mt-3 flex justify-center w-full">
            <div className="w-32 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                whileInView={{ x: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-[1.5px] w-full bg-gradient-to-r from-[#00D4FF] via-[#7B2FFF] to-transparent"
              />
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-lg text-gray-400 font-[family-name:var(--font-inter)] text-xs tracking-wider">
            Technology Stack & Engineering Capabilities
          </p>
        </motion.div>

        {/* Skills grid layout (7 responsive glassmorphic cards) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.6 }}
              className="h-full relative"
            >
              <SkillCard cat={cat} index={idx} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
