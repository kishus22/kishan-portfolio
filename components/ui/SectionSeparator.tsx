"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SectionSeparatorProps = {
  fromColor?: string;
  toColor?: string;
};

export default function SectionSeparator({
  fromColor = "#000000",
  toColor = "#000000",
}: SectionSeparatorProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = lineRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 0.3,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[120px] overflow-hidden pointer-events-none select-none"
      style={{
        background: `linear-gradient(to bottom, ${fromColor}, transparent, ${toColor})`,
      }}
    >
      {/* Subtle vignette darkening at section edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      
      {/* Center 1px cyan glow line */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={lineRef}
          className="h-[1px] w-[80%] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(0,212,255,0.8)]"
          style={{ transformOrigin: "center" }}
        />
      </div>
    </div>
  );
}
