"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type CinematicTextProps = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  glitch?: boolean;
  delay?: number;
  style?: CSSProperties;
};

export default function CinematicText({
  children,
  as: Tag = "h2",
  className = "",
  glitch = false,
  delay = 0,
  style,
}: CinematicTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(12px)", letterSpacing: "0.15em" }}
      whileInView={{
        opacity: 1,
        filter: "blur(0px)",
        letterSpacing: "0.05em",
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={glitch ? "glitch-text" : ""}
    >
      <Tag className={className} style={style}>{children}</Tag>
    </motion.div>
  );
}
