"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function MouseGlow() {
  const [visible, setVisible] = useState(false);
  const springX = useSpring(0, { stiffness: 80, damping: 22 });
  const springY = useSpring(0, { stiffness: 80, damping: 22 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [springX, springY]);

  if (!visible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[4] h-[420px] w-[420px] rounded-full mix-blend-screen"
      style={{
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
        background:
          "radial-gradient(circle, rgba(0,255,255,0.18) 0%, rgba(168,85,247,0.1) 35%, transparent 68%)",
      }}
    />
  );
}
