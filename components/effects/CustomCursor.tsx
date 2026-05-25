"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const cursorX = useSpring(0, { stiffness: 280, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 280, damping: 28 });
  const ringX = useSpring(0, { stiffness: 120, damping: 18 });
  const ringY = useSpring(0, { stiffness: 120, damping: 18 });

  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    const checkTouch = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia("(any-pointer: coarse)").matches)
      );
    };
    setIsTouchDevice(checkTouch());
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest("a, button, [data-cursor-hover], input, textarea"),
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [cursorX, cursorY, ringX, ringY, isTouchDevice]);

  if (isTouchDevice || !visible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] mix-blend-screen"
        style={{ left: ringX, top: ringY, x: "-50%", y: "-50%" }}
      >
        <motion.div
          animate={{
            width: hovering ? 48 : 32,
            height: hovering ? 48 : 32,
            opacity: hovering ? 0.9 : 0.6,
          }}
          transition={{ duration: 0.25 }}
          className="rounded-full border border-cyan-400/80 shadow-[0_0_20px_rgba(0,255,255,0.6)]"
        />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed z-[9999]"
        style={{ left: cursorX, top: cursorY, x: "-50%", y: "-50%" }}
      >
        <motion.div
          animate={{ scale: hovering ? 1.8 : 1 }}
          className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#00ffff,0_0_24px_#00ffff]"
        />
      </motion.div>
    </>
  );
}
