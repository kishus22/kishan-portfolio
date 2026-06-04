"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });

  const dotEl = useRef<HTMLDivElement>(null);
  const ringEl = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasFinePointer(window.matchMedia("(pointer: fine)").matches);
    }
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setVisible(true);

      // Inner dot: update position directly in mousemove (no lerp)
      if (dotEl.current) {
        dotEl.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest("a, button, [data-cursor-hover], [role='button'], input, textarea");
      setHovering(isInteractive);
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      // Outer ring: lerp factor 0.10 in requestAnimationFrame loop
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * 0.10;
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * 0.10;

      if (ringEl.current) {
        ringEl.current.style.transform = `translate(${ringRef.current.x}px, ${ringRef.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [hasFinePointer]);

  if (!hasFinePointer || !visible) return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringEl}
        className="pointer-events-none fixed left-0 top-0 z-[99998] rounded-full transition-[width,height,border-color,box-shadow] duration-200"
        style={{
          width: hovering ? "52px" : "40px",
          height: hovering ? "52px" : "40px",
          border: hovering ? "1.5px solid #00D4FF" : "1.5px solid rgba(0, 212, 255, 0.8)",
          boxShadow: hovering
            ? "0 0 20px #00D4FF, 0 0 40px rgba(0, 212, 255, 0.4)"
            : "0 0 12px rgba(0, 212, 255, 0.5), inset 0 0 8px rgba(0, 212, 255, 0.1)",
          visibility: "visible",
          opacity: 1,
          willChange: "transform",
        }}
      />
      {/* Inner Dot */}
      <div
        ref={dotEl}
        className="pointer-events-none fixed left-0 top-0 z-[99999] rounded-full bg-[#00D4FF] transition-[width,height,transform] duration-200"
        style={{
          width: "8px",
          height: "8px",
          boxShadow: "0 0 8px #00D4FF, 0 0 16px #00D4FF, 0 0 24px rgba(0, 212, 255, 0.6)",
          transform: `translate(${mouseRef.current.x}px, ${mouseRef.current.y}px) translate(-50%, -50%) ${
            hovering ? "scale(0.5)" : "scale(1)"
          }`,
          visibility: "visible",
          opacity: 1,
          willChange: "transform",
        }}
      />
    </>
  );
}
